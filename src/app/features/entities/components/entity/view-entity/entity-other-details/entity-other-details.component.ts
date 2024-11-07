import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CountryDto,
  StateDto,
} from '../../../../../../shared/data/common/countryDto';
import { Logger } from '../../../../../../shared/services';
import { EditBankFormComponent } from './edit-bank-form/edit-bank-form.component';
import { EditWealthFormComponent } from './edit-wealth-form/edit-wealth-form.component';
import { EditAmlFormComponent } from './edit-aml-form/edit-aml-form.component';
import { EditNokFormComponent } from './edit-nok-form/edit-nok-form.component';
import { BankBranchDTO } from '../../../../../../shared/data/common/bank-dto';
import { SectorDTO } from '../../../../../../shared/data/common/sector-dto';
import { SectorService } from '../../../../../../shared/services/setups/sector/sector.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { EditPrimaryFormComponent } from './edit-primary-form/edit-primary-form.component';
import { EditLeadContactFormComponent } from './edit-lead-contact-form/edit-lead-contact-form.component';
import { EditResidentialFormComponent } from './edit-residential-form/edit-residential-form.component';
import { EditOrganizationFormComponent } from './edit-organization-form/edit-organization-form.component';
import { EditCommentFormComponent } from './edit-comment-form/edit-comment-form.component';
import { EditOtherDetailsFormComponent } from './edit-other-details-form/edit-other-details-form.component';
import { EditActivityFormComponent } from './edit-activity-form/edit-activity-form.component';
import {ReqPartyById} from "../../../../data/entityDto";

const log = new Logger('EntityOtherDetails');

@Component({
  selector: 'app-entity-other-details',
  templateUrl: './entity-other-details.component.html',
  styleUrls: ['./entity-other-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityOtherDetailsComponent implements OnInit {
  @ViewChild('closeModalButton') closeModalButton;

  @ViewChild(EditBankFormComponent)
  editBankFormComponent!: EditBankFormComponent;
  @ViewChild(EditWealthFormComponent)
  editWealthFormComponent!: EditWealthFormComponent;
  @ViewChild(EditAmlFormComponent) editAmlFormComponent!: EditAmlFormComponent;
  @ViewChild(EditNokFormComponent) editNokFormComponent!: EditNokFormComponent;
  @ViewChild(EditPrimaryFormComponent)
  editPrimaryFormComponent!: EditPrimaryFormComponent;
  @ViewChild(EditLeadContactFormComponent)
  editLeadContactFormComponent!: EditLeadContactFormComponent;
  @ViewChild(EditResidentialFormComponent)
  editResidentialFormComponent!: EditResidentialFormComponent;
  @ViewChild(EditOrganizationFormComponent)
  editOrganizationFormComponent!: EditOrganizationFormComponent;
  @ViewChild(EditOtherDetailsFormComponent)
  editOtherFormComponent!: EditOtherDetailsFormComponent;
  @ViewChild(EditCommentFormComponent)
  editCommentFormComponent!: EditCommentFormComponent;
  @ViewChild(EditActivityFormComponent)
  editActivityFormComponent!: EditActivityFormComponent;

  @Input() partyAccountDetails: any;
  @Input() countries: CountryDto[];
  @Input() bankDetails: any;
  @Input() bankBranch: BankBranchDTO;
  @Input() wealthAmlDetails: any;
  @Input() states: StateDto[];
  @Input() nokList: any[];
  @Input() entityPartyIdDetails: ReqPartyById;
  // @Input() leadDetails: Leads;

  public commentsData: any[] = [];
  public activitiesData: any[] = [];

  public leadDetails: any;

  @Output('fetchWealthAmlDetails') fetchWealthAmlDetails: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('fetchPaymentDetails') fetchPaymentDetails: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('refreshData') refreshData: EventEmitter<any> =
    new EventEmitter<any>();
  activeTab: string;

  public activeTabIndex: number = 0;

  additionalInfoTabs: { index: number; tabName: string }[] = [
    { index: 0, tabName: 'contact' },
    { index: 1, tabName: 'bank' },
    { index: 2, tabName: 'wealth' },
    { index: 3, tabName: 'aml' },
    { index: 4, tabName: 'nok' },
    { index: 5, tabName: 'primary' },
    { index: 6, tabName: 'lead_contact' },
    { index: 7, tabName: 'residential' },
    { index: 8, tabName: 'organization' },
    { index: 9, tabName: 'other' },
    { index: 10, tabName: 'comment' },
    { index: 11, tabName: 'activity' },
  ];

  sectorData: SectorDTO[];
  sector: SectorDTO;
  isFormDetailsReady: boolean = false;
  public selectedComment: any;
  public selectedActivity: any;

  constructor(
    private sectorService: SectorService,
    private cdr: ChangeDetectorRef,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.setInitialTab();
    this.getLeadDetails();
    this.getNokList();
    this.fetchSectors();
    this.getCommentList();
    this.getActivityList();
  }

  onCommentUpdated(isUpdated: boolean): void {
    if (isUpdated) {
      this.getCommentList();
      this.cdr.detectChanges();
    }
  }

  getCountryName(id: number): string {
    if (this.countries?.length > 0) {
      const country: CountryDto = this.countries.filter(
        (item: CountryDto): boolean => item.id === id
      )[0];
      return country?.name;
    }
  }

  getWealthAmlDetails(): void {
    this.fetchWealthAmlDetails.emit();
  }

  getNokList(): void {
    if (this.partyAccountDetails?.nextOfKinDetailsList) {
      this.nokList = this.partyAccountDetails?.nextOfKinDetailsList;
    }
  }

  getLeadDetails(): void {
    if (this.partyAccountDetails?.leadDto) {
      this.leadDetails = this.partyAccountDetails?.leadDto;
    }
  }

  getCommentList(): void {
    if (this.partyAccountDetails?.leadDto?.leadComments) {
      this.commentsData = [...this.partyAccountDetails.leadDto.leadComments];
    }
  }

  getActivityList(): void {
    if (this.partyAccountDetails?.leadDto?.leadActivities) {
      this.activitiesData = this.partyAccountDetails?.leadDto?.leadActivities;
    }
  }

  /**
   * Set the selected tab as active for edit purpose
   * @param event
   */
  // setActiveTab(event): void {
  //   const index = event.index;
  //   this.activeTab = this.additionalInfoTabs[index].tabName;
  // }

  setInitialTab(): void {
    this.activeTabIndex =
      this.partyAccountDetails?.partyType?.partyTypeName === 'Lead' ? 0 : 6;
    this.setActiveTab({ index: this.activeTabIndex });
  }

  setActiveTab(event: any): void {
    this.activeTabIndex = event.index;
    const tabs =
      this.partyAccountDetails?.partyType?.partyTypeName === 'Lead'
        ? [
            'primary',
            'lead_contact',
            'residential',
            'organization',
            'other',
            'comment',
            'activity',
          ]
        : ['contact', 'bank', 'wealth', 'aml', 'nok'];
    this.activeTab = tabs[this.activeTabIndex];
  }

  /**
   * Prepare the details to be edited and send to the required component
   */
  prepareDetailsForEdit(): void {
    const extras: Extras = {
      partyAccountId: this.partyAccountDetails.id,
      countryId: this.partyAccountDetails?.address?.country_id,
      leadId: this.partyAccountDetails?.leadDto?.code,
      userCode: this.partyAccountDetails?.leadDto?.userCode,
    };

    switch (this.activeTab) {
      // case 'contact':
      //   this.editContactFormComponent.prepareUpdateDetails(
      //     this.contactDetails,
      //     extras
      //   );
      //   break;
      case 'bank':
        this.editBankFormComponent.prepareUpdateDetails(
          this.bankDetails,
          extras
        );
        break;
      case 'wealth':
        this.editWealthFormComponent.prepareUpdateDetails(
          this.wealthAmlDetails,
          extras
        );
        break;
      case 'aml':
        this.editAmlFormComponent.prepareUpdateDetails(
          this.wealthAmlDetails,
          extras
        );
        break;
      case 'nok':
        this.editNokFormComponent.prepareUpdateDetails(this.nokList, extras);
        break;
      case 'primary':
        this.editPrimaryFormComponent.prepareUpdateDetails(
          {
            campaingName: this.leadDetails.campCode,
            leadSource: this.leadDetails.leadSourceCode,
            occupation: this.leadDetails.occupation,
            date: this.leadDetails.leadDate,
          },
          extras
        );
        break;
      case 'lead_contact':
        this.editLeadContactFormComponent.prepareUpdateDetails(
          {
            mobileNumber: this.leadDetails.mobileNumber,
            emailAddress: this.leadDetails.emailAddress,
            campTel: this.leadDetails.campTel,
            title: this.leadDetails.title,
            website: this.leadDetails.website,
          },
          extras
        );
        break;
      case 'residential':
        this.editResidentialFormComponent.prepareUpdateDetails(
          {
            physicalAddress: this.leadDetails.physicalAddress,
            townCode: this.leadDetails.townCode,
            postalAddress: this.leadDetails.postalAddress,
            postalCode: this.leadDetails.postalCode,
            stateCode: this.leadDetails.stateCode,
            countryCode: this.leadDetails.countryCode,
          },
          extras
        );
        break;
      case 'organization':
        this.editOrganizationFormComponent.prepareUpdateDetails(
          {
            userCode: this.leadDetails.userCode,
            organizationCode: this.leadDetails.organizationCode,
            divisionCode: this.leadDetails.divisionCode,
            teamCode: this.leadDetails.teamCode,
            systemCode: this.leadDetails.systemCode,
            productCode: this.leadDetails.productCode,
            accountCode: this.leadDetails.accountCode,
          },
          extras
        );
        break;
      case 'other':
        this.editOtherFormComponent.prepareUpdateDetails(
          {
            industry: this.leadDetails.industry,
            currencyCode: this.leadDetails.currencyCode,
            annualRevenue: this.leadDetails.annualRevenue,
            potentialAmount: this.leadDetails.potentialAmount,
            potentialCloseDate: this.leadDetails.potentialCloseDate,
            potentialName: this.leadDetails.potentialName,
            potentialSaleStage: this.leadDetails.potentialSaleStage,
            potentialContributor: this.leadDetails.potentialContributor,
            converted: this.leadDetails.converted,
          },
          extras
        );
        break;
      case 'comment':
        this.editCommentFormComponent.prepareUpdateDetails(
          this.selectedComment,
          extras
        );
        break;
      case 'activity':
        this.editActivityFormComponent.prepareUpdateDetails(
          this.selectedActivity,
          extras
        );
        break;
      default:
        log.warn(`No form found for tab: ${this.activeTab}`);
    }
  }

  /**
   * Upon successful update, close modal and refresh page data
   */
  closeEditModal(): void {
    this.closeModalButton.nativeElement.click();
    this.refreshData.emit();
  }

  /**
   * Upon successful form data patching, update details to hide spinner
   */
  confirmFormReadyStatus(event: boolean): void {
    this.isFormDetailsReady = event;
  }

  prepareNokForEdit(nok: any): void {
    const extras: Extras = {
      partyAccountId: this.partyAccountDetails.id,
      countryId: this.partyAccountDetails?.country?.id,
    };
    const nokToUpdate = this.nokList.filter((el) => el.id === nok.id)[0];
    this.editNokFormComponent.prepareUpdateDetails(nokToUpdate, extras);
  }

  /**
   * This method fetches a list of sectors for patching and selecting
   */
  fetchSectors(): void {
    this.sectorService.getSectors().subscribe({
      next: (sectors) => {
        this.sectorData = sectors;
        // this.cdr.detectChanges();
        this.sector = this.sectorData.filter(
          (el) => el.id === this.wealthAmlDetails.sector_id
        )[0];
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  protected readonly status = status;

  addItem(): void {
    const extras: Extras = {
      partyAccountId: this.partyAccountDetails.id,
      countryId: this.partyAccountDetails?.address?.country_id,
      leadId: this.partyAccountDetails?.leadDto?.code,
      userCode: this.partyAccountDetails?.leadDto?.userCode,
    };

    if (this.activeTab === 'comment') {
      this.editCommentFormComponent.initializeNewComment(extras);
    } else {
      log.warn('Add operation not supported for this tab.');
    }
  }

  deleteItem(): void {
    // Logic to delete item based on the active tab
  }
}

export interface Extras {
  partyAccountId: number;
  countryId?: number;
  leadId?: number;
  userCode?: number;
}
