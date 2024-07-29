import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {CountryDto, StateDto} from "../../../../../../shared/data/common/countryDto";
import {Logger} from "../../../../../../shared/services";
import {EditBankFormComponent} from "./edit-bank-form/edit-bank-form.component";
import {EditWealthFormComponent} from "./edit-wealth-form/edit-wealth-form.component";
import {EditAmlFormComponent} from "./edit-aml-form/edit-aml-form.component";
import {EditNokFormComponent} from "./edit-nok-form/edit-nok-form.component";
import {BankBranchDTO} from "../../../../../../shared/data/common/bank-dto";
import {SectorDTO} from "../../../../../../shared/data/common/sector-dto";
import {SectorService} from "../../../../../../shared/services/setups/sector/sector.service";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('EntityOtherDetails');

@Component({
  selector: 'app-entity-other-details',
  templateUrl: './entity-other-details.component.html',
  styleUrls: ['./entity-other-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityOtherDetailsComponent implements OnInit, OnChanges {

  @ViewChild('closeModalButton') closeModalButton;

  @ViewChild(EditBankFormComponent) editBankFormComponent!: EditBankFormComponent;
  @ViewChild(EditWealthFormComponent) editWealthFormComponent!: EditWealthFormComponent;
  @ViewChild(EditAmlFormComponent) editAmlFormComponent!: EditAmlFormComponent;
  @ViewChild(EditNokFormComponent) editNokFormComponent!: EditNokFormComponent;

  @Input() partyAccountDetails: any;
  @Input() countries: CountryDto[];
  @Input() bankDetails: any;
  @Input() bankBranch: BankBranchDTO;
  @Input() wealthAmlDetails: any;
  @Input() states: StateDto[];
  // @Input() nokDetails: any;
  @Input() nokList: any[]
  @Output('fetchWealthAmlDetails') fetchWealthAmlDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output('fetchPaymentDetails') fetchPaymentDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output('refreshData') refreshData: EventEmitter<any> = new EventEmitter<any>();
  activeTab: string = 'contact';

  additionalInfoTabs: { index: number, tabName: string }[] = [
    { index: 0, tabName: 'contact' },
    { index: 1, tabName: 'bank' },
    { index: 2, tabName: 'wealth' },
    { index: 3, tabName: 'aml' },
    { index: 4, tabName: 'nok' },
  ];

  sectorData: SectorDTO[];
  sector: SectorDTO;

  constructor(
    private sectorService: SectorService,
    private globalMessagingService: GlobalMessagingService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.getNokList();
  }

  ngOnInit(): void {
    this.getNokList();
    this.fetchSectors();
  }

  getCountryName(id: number): string {
    if (this.countries?.length > 0) {
      const country: CountryDto = this.countries.filter((item: CountryDto):boolean => item.id === id)[0];
      return country?.name
    }
  }

  getWealthAmlDetails(): void {
    log.info(`fetch wealth aml details`)
    this.fetchWealthAmlDetails.emit();
  }

  getNokList(): void {
    if (this.partyAccountDetails?.nextOfKinDetailsList) {
      this.nokList = this.partyAccountDetails?.nextOfKinDetailsList;
    }
  }

  /**
   * Set the selected tab as active for edit purpose
   * @param event
   */
  setActiveTab(event): void {
    const index = event.index;
    this.activeTab = this.additionalInfoTabs[index].tabName;
  }

  /**
   * Prepare the details to be edited and send to the required component
   */
  prepareDetailsForEdit(): void {
    const extras: Extras = {
      partyAccountId: this.partyAccountDetails.id,
      countryId: this.partyAccountDetails?.address?.country_id,
    };

    switch(this.activeTab) {
      case 'bank':
        this.editBankFormComponent.prepareUpdateDetails(this.bankDetails, extras);
        break;
      case 'wealth':
        this.editWealthFormComponent.prepareUpdateDetails(this.wealthAmlDetails, extras);
        break;
      case 'aml':
        this.editAmlFormComponent.prepareUpdateDetails(this.wealthAmlDetails, extras);
        break;
      case 'nok':
        // code block
        break;
      default:
      // code block
    }

  }

  /**
   * Upon successful update, close modal and refresh page data
   */
  closeEditModal(): void {
    this.closeModalButton.nativeElement.click();
    this.refreshData.emit();
  }

  prepareNokForEdit(nok: any): void {
    const extras: Extras = {
      partyAccountId: this.partyAccountDetails.id,
      countryId: this.partyAccountDetails?.country?.id,
    };
    const nokToUpdate = this.nokList.filter(el => el.id === nok.id)[0];
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
        this.sector = this.sectorData.filter((el) => el.id === this.wealthAmlDetails.sector_id)[0];
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
  }

  protected readonly status = status;
}


export interface Extras {
  partyAccountId: number,
  countryId?: number,
}
