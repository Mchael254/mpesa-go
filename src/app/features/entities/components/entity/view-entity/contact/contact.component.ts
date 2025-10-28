import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Logger, UtilService} from "../../../../../../shared/services";
import {ClientService} from "../../../../services/client/client.service";
import {ClientTitleDTO} from "../../../../../../shared/data/common/client-title-dto";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {FormBuilder, FormGroup } from "@angular/forms";
import {forkJoin} from "rxjs";
import {BranchService} from "../../../../../../shared/services/setups/branch/branch.service";
import {OrganizationBranchDto} from "../../../../../../shared/data/common/organization-branch-dto";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {AccountService} from "../../../../services/account/account.service";
import {AccountsEnum} from "../../../../data/enums/accounts-enum";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto, FormSubGroupsDto, PresentationType, SaveAction
} from "../../../../../../shared/data/common/dynamic-screens-dto";
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
  @Input() formGroupsAndFieldConfig: DynamicScreenSetupDto;
  @Input() group: FormGroupsDto;

  @Output() fetchClientDetails = new EventEmitter<number>();

  contactDetails: ContactDetails;
  contactPersons: ContactPerson[];
  selectedContactPerson: ContactPerson;

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
  formFields: ConfigFormFieldsDto[] = [];
  tableHeaders: ConfigFormFieldsDto[];
  table: { cols: any[], data: any[] } = { cols: [], data: [] };
  subGroups: FormSubGroupsDto[] = [];
  selectedSubgroup: FormSubGroupsDto = null;

  formHeadingLabel: FormSubGroupsDto | FormGroupsDto;

  PRESENTATION_TYPE = PresentationType;
  Save_Action = SaveAction;
  saveAction: SaveAction;

  constructor(
    private utilService: UtilService,
    private clientService: ClientService,
    private branchService: BranchService,
    private accountService: AccountService,
    private globalMessagingService: GlobalMessagingService,
    private fb: FormBuilder,
    ) {
    this.utilService?.currentLanguage.subscribe(lang => {this.language = lang;});
  }

  ngOnInit(): void {
    this.prepareDataDisplay();
  }

  prepareDataDisplay(): void {
    setTimeout(() => {
      this.subGroups = this.group.subGroup;
      this.contactDetails = this.clientDetails.contactDetails;
      this.contactPersons = this.clientDetails.contactPersons ?? this.contactPersons;

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
        overview_telephone_number: this.contactDetails?.phoneNumber,
        overview_email: this.contactDetails?.emailAddress,
      }

      if (this.group.subGroup.length === 0) {
        this.prepareGroupDetails(displayContactDetails);
      } else {
        this.prepareSubGroupDetails(displayContactDetails);
      }
    }, 1000);
  }


  /**
   * prepares fields and table details for display when address details has no subgroup
   * @param displayContactDetails
   */
  prepareGroupDetails(displayContactDetails: any): void {
    if ((this.group.presentationType === this.PRESENTATION_TYPE.fields) || (this.group.subGroup.length === 0)) {
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

    for (const field of fields) {
      const value = displayFields[field.fieldId];
      field.dataValue = value ?? null;
    }

    fields.sort((a, b) => a.order - b.order);

    return fields;
  }


  /**
   * create the structured info (column headings and row data) for displaying table
   * @param subGroup
   */
  createTableDisplay(subGroup?: FormSubGroupsDto) {
    const headerFields = this.formGroupsAndFieldConfig.fields.filter((field: ConfigFormFieldsDto) => field.formSubGroupingId === subGroup.subGroupId);
    headerFields.sort((a, b) => a.order - b.order);
    this.tableHeaders = headerFields;

    const tableData = [];
    this.contactPersons.forEach(person => {
      const p = {
        contactPersonId: person.code,
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

  /**
   * Where exists, prepare the details of the subgroup
   * Call method to create either field display or table display
   * @param displayContactDetails
   */
  prepareSubGroupDetails(displayContactDetails: any): void {
    this.group?.subGroup?.forEach((subGroup) => {
      if (subGroup.presentationType === this.PRESENTATION_TYPE.fields) {
        subGroup.fields = this.createFieldDisplay(displayContactDetails);
      } else {
        this.createTableDisplay(subGroup);
      }
    });
  }

  /**
   * Delete contact person and refresh data for display
   * @param row
   */
  handleContactPersonDelete(row: any): void {
    this.clientService.deleteContactPerson(row.contactPersonId).subscribe({
      next: () => {
        this.table.data = this.table.data.filter(person => person.contactPersonId != row.contactPersonId);
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted contact person');
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err?.error?.message);
      }
    });
  }

  fetchSelectOptions(): void {
    forkJoin({
      branches: this.branchService.getAllBranches(),
      contactChannels: this.accountService.getCommunicationChannels(),
      clientTitles: this.clientService.getClientTitles(),
    }).subscribe({
      next: data => {
        this.branches = data.branches;
        this.contactChannels = data.contactChannels;
        this.clientTitles = data.clientTitles;
        this.setSelectOptions(
          data.branches,
          data.contactChannels,
          data.clientTitles,
        );
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
  }

  setSelectOptions(
    branches: OrganizationBranchDto[],
    contactChannels: AccountsEnum[],
    clientTitles: ClientTitleDTO[],
  ): void {
    this.formFields.forEach(field => {
      switch (field.fieldId) {
        case 'overview_title':
          field.options = clientTitles;
          break;
        case 'overview_branch':
          field.options = branches;
          break;
        case 'overview_pref_contact_channel':
          field.options = contactChannels;
          break;
        default:
        // do something
      }
    })
  }

  openEditContactDialog(subgroup?: FormSubGroupsDto, saveAction?: SaveAction): void {
    this.saveAction = saveAction;
    let fields: ConfigFormFieldsDto[];

    if (subgroup?.fields) {
      this.selectedSubgroup = subgroup;
      this.formHeadingLabel = subgroup;
      fields = subgroup.fields;
    } else {
      fields = this.fields;
      this.formHeadingLabel = this.group
    }

    this.prepareDataDisplay();

    this.formFields = fields;
    this.createEditForm(fields, saveAction);
    this.editButton.nativeElement.click();
  }

  createEditForm(fields: ConfigFormFieldsDto[], saveAction?: SaveAction): void {
    const group: { [key: string]: any } = {};
    fields.forEach(field => {
      group[field.fieldId] = [
        field.defaultValue,
        // field.isMandatory ? Validators.required : []
      ];
    });

    this.fetchSelectOptions();
    this.editForm = this.fb.group(group);

    if (
      saveAction === SaveAction.EDIT_CONTACT_DETAILS ||
      saveAction === SaveAction.EDIT_CONTACT_PERSON
    ) this.patchFormValues(fields);

  }

  patchFormValues(fields): void {
    let patchData = {};

    if (this.group.subGroup.length > 0) {
      this.formFields.forEach(field => { // corporate
        patchData[field.fieldId] = field.dataValue;
      });
    } else if (this.group.subGroup.length === 0) { // individual
      fields.forEach(field => {
        patchData[field.fieldId] = field.dataValue;
      });
    }

    patchData = { // patch dropdown values
      ...patchData,
      overview_title: this.clientDetails.contactDetails.titleId,
      overview_pref_contact_channel: this.clientDetails.contactChannel,
      overview_branch: this.clientDetails.organizationBranchId,
    }

    this.editForm?.patchValue(patchData);
  }


  saveDetails(): void {
    switch (this.saveAction) {
      case SaveAction.EDIT_CONTACT_DETAILS:
        this.editContactDetails();
        break;
      case SaveAction.EDIT_CONTACT_PERSON:
        this.addEditContactPerson();
        break;
      case SaveAction.SAVE_CONTACT_PERSON:
        this.editForm.reset();
        this.addEditContactPerson();
        break;
      default:
        // do something
    }
  }

  editContactDetails(): void {
    const formValues = this.editForm.getRawValue();
    log.info('form values', formValues);

    const emailAddress = formValues.overview_contact_details_email ? formValues.overview_contact_details_email : formValues.overview_email;
    const smsNumber = formValues.overview_contact_person_mobile_no ? formValues.overview_contact_person_mobile_no: formValues.overview_sms_number
    const phoneNumber = formValues.overview_tel_no ? formValues.overview_tel_no: formValues.overview_telephone_number

    const contactDetails = {
      ...this.contactDetails,
      titleId: formValues.overview_title,
      smsNumber: (smsNumber?.internationalNumber)?.replace(/\s+/g, ''),
      phoneNumber: (phoneNumber?.internationalNumber)?.replace(/\s+/g, ''),
      emailAddress,
      contactChannel: formValues.overview_pref_contact_channel,
      websiteUrl: formValues.overview_website_url,
      socialMediaUrl: formValues.overview_social_media,
      principalContactName: formValues.overview_contact_person_full_name,
    };

    const client = {
      clientCode: this.clientDetails.clientCode,
      partyAccountCode: this.clientDetails.partyAccountCode,
      partyId: this.clientDetails.partyId,
      contactDetails
    };

    this.clientService.updateClientSection(this.clientDetails.clientCode, client).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
        this.clientDetails = data;
        this.prepareDataDisplay();
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
    this.closeButton.nativeElement.click();
  }


  prepareEditContactPersonForm(data, saveAction: SaveAction): void {
    this.saveAction = saveAction;
    this.formFields =  this.tableHeaders.map(field => ({...field})) ;
    const row = data.row;
    this.selectedContactPerson = this.contactPersons.find(person => person.code = row.contactPersonId);
    this.selectedSubgroup = data.subGroup;

    this.formFields.forEach((field: ConfigFormFieldsDto) => {
      field.dataValue = row[field.fieldId];
      if (field.type === 'date') {
        field.dataValue = row[field.fieldId]?.split('T')[0];
      }
    });

    this.createEditForm(this.formFields, saveAction);
    this.editButton.nativeElement.click();
  }

  addEditContactPerson(): void {
    const formValues = this.editForm.getRawValue();

    const contactPerson = {
      ...this.selectedContactPerson,
      clientCode: this.clientDetails.clientCode,
      clientTitleCode: formValues.overview_title,
      clientTitle: formValues.overview_title,
      name: formValues.overview_contact_person_full_name,
      idNumber: formValues.overview_contact_person_doc_id_no,
      email: formValues.overview_contact_person_email,
      mobileNumber: (formValues.overview_contact_person_mobile_no?.internationalNumber).replace(/\s+/g, ''), // remove spaces before saving
      wef: formValues.overview_wef,
      wet: formValues.overview_wet,
    };

    const client = {
      clientCode: this.clientDetails.clientCode,
      partyAccountCode: this.clientDetails.partyAccountCode,
      partyId: this.clientDetails.partyId,
      contactPersons: [contactPerson]
    }


    this.clientService.updateClientSection(this.clientDetails.clientCode, client).subscribe({
      next: data => {
        this.clientDetails = data;
        this.contactPersons = data.contactPersons;
        this.prepareDataDisplay();
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted contact person');
        this.closeButton.nativeElement.click();
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err?.error?.message);
        this.closeButton.nativeElement.click();
      }
    });
  }


  checkTelNumber(mainStr: string): boolean {
    const subStrs: string[] = ['mobile_no', 'tel_no', 'sms_number', 'telephone_number'];
    return subStrs.some(subStr => mainStr.includes(subStr));
  }

}
