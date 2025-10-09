import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Logger, UtilService} from "../../../../../../shared/services";
import {ClientService} from "../../../../services/client/client.service";
import {ClientTitleDTO} from "../../../../../../shared/data/common/client-title-dto";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import _default from "chart.js/dist/core/core.interaction";
import index = _default.modes.index;
import {group} from "@angular/animations";
import {forkJoin, Observable} from "rxjs";
import {BranchService} from "../../../../../../shared/services/setups/branch/branch.service";
import {OrganizationBranchDto} from "../../../../../../shared/data/common/organization-branch-dto";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {AccountService} from "../../../../services/account/account.service";
import {AccountsEnum} from "../../../../data/enums/accounts-enum";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto, FormSubGroupsDto, MultilingualText
} from "../../../../../../shared/data/common/dynamic-screens-dto";
import {Group} from "../../../../data/form-config.model";
import {ClientDTO, ContactDetails, ContactPerson} from "../../../../data/ClientDTO";

const log = new Logger('ContactComponent');

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() clientDetails: ClientDTO;
  @Input() accountCode: number;
  @Input() formGroupsAndFieldConfig: DynamicScreenSetupDto;
  @Input() group: FormGroupsDto;

  contactDetails: ContactDetails;
  contactPersons: ContactPerson[];

  clientTitles$: Observable<ClientTitleDTO[]>;
  branches$: Observable<OrganizationBranchDto[]>;

  language: string = 'en';
  editForm: FormGroup;
  clientTitle: ClientTitleDTO;
  clientTitles: ClientTitleDTO[];
  branches: OrganizationBranchDto[];
  selectedBranch: OrganizationBranchDto;
  contactChannels: AccountsEnum[];

  protected readonly CountryISO = CountryISO;
  protected readonly SearchCountryField = SearchCountryField;
  protected readonly PhoneNumberFormat = PhoneNumberFormat;

  fields: ConfigFormFieldsDto[];
  tableHeaders: ConfigFormFieldsDto[];
  table: { cols: any[], data: any[] } = { cols: [], data: [] };


  constructor(
    private utilService: UtilService,
    private clientService: ClientService,
    private branchService: BranchService,
    // private accountService: AccountService,
    private globalMessagingService: GlobalMessagingService,
    private fb: FormBuilder,
    ) {
    this.utilService?.currentLanguage.subscribe(lang => {this.language = lang;});
  }

  ngOnInit(): void {
    // this.fetchSelectOptions();

    setTimeout(() => {
      this.contactDetails = this.clientDetails.contactDetails;
      this.contactPersons = this.clientDetails.contactPersons;

      const displayContactDetails  = {
        overview_title: this.contactDetails?.title?.description,
        overview_contact_person_full_name: this.contactDetails?.principalContactName,
        overview_contact_details_email: this.contactDetails?.emailAddress,
        overview_contact_person_doc_id_no: null,
        overview_website_url: this.contactDetails?.websiteUrl,
        overview_tel_no: this.contactDetails?.phoneNumber,
        overview_contact_person_email: this.contactDetails?.emailAddress,
        overview_pref_contact_channel: this.contactDetails?.contactChannel,
        overview_social_media: this.contactDetails?.socialMediaUrl,
        overview_contact_person_mobile_no: this.contactDetails?.phoneNumber,
        overview_wef: null,
        overview_wet: null,
        overview_branch: this.contactDetails?.branchName,
        overview_sms_number: this.contactDetails?.smsNumber,
        overview_telephone_number: this.contactDetails?.telephoneNumber,
        overview_email: this.contactDetails?.email,
      }

      if (this.group.subGroup.length === 0) {
        this.prepareGroupDetails(displayContactDetails);
      } else {
        this.prepareSubGroupDetails(displayContactDetails);
      }
    }, 1000);

    this.clientTitles$ = this.clientService.getClientTitles();
    this.branches$ = this.branchService.getAllBranches();
    this.initData();
  }


  /**
   * prepares fields and table details for display when address details has no subgroup
   * @param displayContactDetails
   */
  prepareGroupDetails(displayContactDetails): void {
    if (this.group.presentationType === 'fields') {
      this.fields = this.createFieldDisplay(displayContactDetails);
    } else {
      this.createTableDisplay();
    }
  }

  /**
   * create field display using the labelled fields
   * @param displayFields
   */
  createFieldDisplay(displayFields): ConfigFormFieldsDto[] {
    const fields = this.formGroupsAndFieldConfig.fields.filter((field: ConfigFormFieldsDto) => field.formGroupingId === this.group.groupId);

    if (fields.length > 0) this.createEditForm(fields);

    for (const field of fields) {
      field.dataValue = displayFields[field.fieldId] ?? null;
    }

    fields.sort((a, b) => a.order - b.order);

    return fields;
  }


  createTableDisplay(subGroup?: FormSubGroupsDto) {
    const headerFields = this.formGroupsAndFieldConfig.fields.filter((field: ConfigFormFieldsDto) => field.formSubGroupingId === subGroup.subGroupId);
    headerFields.sort((a, b) => a.order - b.order);
    this.tableHeaders = headerFields;

    const tableData = [];
    this.contactPersons.forEach(person => {
      const p = {
        overview_title: person.clientTitle,
        overview_contact_person_full_name: person.name,
        overview_contact_person_doc_id_no: person.idNumber,
        overview_contact_person_email: person.email,
        overview_contact_person_mobile_no: person.mobileNumber,
        overview_wef: person.wef,
        overview_wet: person.wet,
      };
      tableData.push(p);
    });

    this.table = {
      cols: this.tableHeaders,
      data: tableData
    };
  }

  prepareSubGroupDetails(displayContactDetails): void {
    this.group?.subGroup?.forEach((subGroup) => {
      if (subGroup.presentationType === 'fields') {
        subGroup.fields = this.createFieldDisplay(displayContactDetails);
      } else {
        this.createTableDisplay(subGroup);
      }
    });
  }


  initData(): void {
    this.clientTitles$.subscribe({
      next: (res: ClientTitleDTO[]) => {
        this.clientTitles = res;
        const index =  res.findIndex(title =>  title.id === this.contactDetails?.titleId)
        this.clientTitle = res[index];
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err?.error?.message);
      }
    });
  }

  /*fetchSelectOptions(): void {
    forkJoin({
      branches: this.branchService.getAllBranches(),
      contactChannels: this.accountService.getCommunicationChannels(),
    }).subscribe({
      next: data => {
        this.branches = data.branches;
        this.contactChannels = data.contactChannels;
        if (this.contactDetailsConfig) this.setSelectOptions(
          data.branches,
          data.contactChannels,
        );
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        log.error(`could not fetch: `, err);
      }
    });
  }*/

  setSelectOptions(
    branches: OrganizationBranchDto[],
    contactChannels: AccountsEnum[],
  ): void {
    this.fields.forEach(field => {
      switch (field.fieldId) {
        case 'title':
          field.options = this.clientTitles;
          break;
        case 'branch':
          field.options = branches;
          break;
        case 'contactChannel':
          field.options = contactChannels;
          break;
        default:
        // do something
      }
    })
  }

  openEditContactDialog(): void {
    this.editButton.nativeElement.click();
    this.patchFormValues();
  }

  createEditForm(fields: any[]): void {
    const group: { [key: string]: any } = {};
    fields.forEach(field => {
      group[field.fieldId] = [
        field.defaultValue,
        field.isMandatory ? Validators.required : []
      ];
    });
    this.editForm = this.fb.group(group);
    log.info('edit form  >>> ', this.editForm);
  }

  patchFormValues(): void {
    const patchData = {
      branch: this.contactDetails?.branchId,
      title: this.clientTitle?.id,
      smsNumber: this.contactDetails?.smsNumber,
      telNumber: this.contactDetails?.phoneNumber,
      email: this.contactDetails?.emailAddress,
      contactChannel: (this.contactDetails?.contactChannel).toUpperCase()
    }
    this.editForm?.patchValue(patchData);
  }

  editContactDetails(): void {
    const formValues = this.editForm.getRawValue();
    const updatePayload = {
      contactDetails: {
        ...this.contactDetails,
        titleId: formValues.title,
        smsNumber: formValues.smsNumber?.internationalNumber,
        phoneNumber: formValues.telNumber?.internationalNumber,
        emailAddress: formValues.email,
        contactChannel: formValues.contactChannel,
      },
      organizationBranchId: formValues.branch,
      organizationBranchName: ''
    }

    this.clientService.updateClientSection(this.accountCode, { ...updatePayload }).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
        this.contactDetails = data.contactDetails;
        this.contactDetails.branchName = data.organizationBranchName
        this.contactDetails.branchId = data.organizationBranchId
        log.info('updated contact details >>> ', this.contactDetails)
        this.initData();
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
    this.closeButton.nativeElement.click();
  }

}
