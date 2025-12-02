import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PartyAccountsDetails} from "../../../../data/accountDTO";
import {AccountReqPartyId, IdentityModeDTO, ReqPartyById} from "../../../../data/entityDto";
import {Logger, UtilService} from "../../../../../../shared/services";
import {FormGroup} from "@angular/forms";
import {CountryDto} from "../../../../../../shared/data/common/countryDto";
import {MaritalStatus} from "../../../../../../shared/data/common/marital-status.model";
import {EntityService} from "../../../../services/entity/entity.service";
import {CountryService} from "../../../../../../shared/services/setups/country/country.service";
import {MaritalStatusService} from "../../../../../../shared/services/setups/marital-status/marital-status.service";
import {forkJoin} from "rxjs";
import {ClientService} from "../../../../services/client/client.service";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto, UserCategory
} from "../../../../../../shared/data/common/dynamic-screens-dto";
import {EntityUtilService} from "../../../../services/entity-util.service";
import {AccountTypeDTO, AgentDTO} from "../../../../data/AgentDTO";
import {IntermediaryService} from "../../../../services/intermediary/intermediary.service";
import {AccountService} from "../../../../services/account/account.service";

const log = new Logger('PrimeIdentityComponent');

@Component({
  selector: 'app-prime-identity',
  templateUrl: './prime-identity.component.html',
  styleUrls: ['./prime-identity.component.css']
})
export class PrimeIdentityComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() partyAccountDetails: PartyAccountsDetails;
  @Input() entityAccountIdDetails: AccountReqPartyId[];
  @Input() entityPartyIdDetails: ReqPartyById;
  @Input() formGroupsAndFieldConfig: DynamicScreenSetupDto;
  // @Input() clientDetails: ClientDTO;
  @Input() entityDetails: any /*StaffDto | ClientDTO | ServiceProviderRes | AgentDTO*/;
  @Input() group: FormGroupsDto;

  selectOptions: {
    idTypes: IdentityModeDTO[],
    countries: CountryDto[],
    maritalStatuses: MaritalStatus[]
  };

  language: string = '';
  editForm: FormGroup;

  idTypes: IdentityModeDTO[] = [];
  countries: CountryDto[] = [];
  maritalStatuses: MaritalStatus[] = [];
  accountTypes: AccountTypeDTO[] = [];

  genders: {id: number, name: string, shtDesc: string}[] = [
    { id: 1, name: 'Male', shtDesc: 'm'},
    { id: 2, name: 'Female', shtDesc: 'f'},
  ]

  primeDetails: any;
  fields: ConfigFormFieldsDto[];
  partyTypeShtDesc: string;

  constructor(
    private utilService: UtilService,
    private entityService: EntityService,
    private countryService: CountryService,
    private maritalStatusService: MaritalStatusService,
    private accountService: AccountService,
    private clientService: ClientService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private entityUtilService: EntityUtilService,
    private intermediaryService: IntermediaryService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    setTimeout(() => {
      this.fetchSelectOptions();
      this.partyTypeShtDesc = (this.entityAccountIdDetails[0]?.partyType?.partyTypeShtDesc).toUpperCase();

      switch (this.partyTypeShtDesc) {
        case 'C':
          this.primeDetails = this.setClientPrimeDetails();
          break;
        case 'A':
          this.primeDetails = this.setIntermediaryDetails();
          break;
          default:
            //
      }

      this.fields = this.formGroupsAndFieldConfig.fields.filter((field: ConfigFormFieldsDto) => field.formGroupingId === this.group.groupId);

      for (const field of this.fields) {
        field.dataValue = this.primeDetails[field.fieldId] ?? null;
      }

      this.fields.sort((a, b) => a.order - b.order);

      this.editForm = this.entityUtilService.createEditForm(this.fields);

    }, 1000);
  }

  setClientPrimeDetails() {
    return {
      overview_business_reg_no: this.entityDetails.idNumber,
      overview_pin_number: this.entityDetails.pinNumber,
      overview_date_of_incorporation: this.entityDetails?.dateOfBirth,
      overview_client_type: this.entityDetails?.clientType?.clientTypeName,
      overview_primary_id_type: this.entityDetails.modeOfIdentity?.name,
      overview_id_number: this.entityDetails.idNumber,
      overview_date_of_birth: this.entityDetails.dateOfBirth,
      overview_citizenship: this.entityDetails.citizenshipCountryName,
      overview_gender: this.entityDetails.gender,
      overview_marital_status: this.entityDetails.maritalStatus,
    };
  }

  setIntermediaryDetails() {
    const gender = this.genders.find(g => g.shtDesc === this.entityDetails.gender);

    return {
      overview_account_type: this.entityDetails.accountType?.accountType,
      overview_doc_id_no: this.entityDetails.idNumber,
      overview_tax_pin_no: this.entityDetails.pinNumber,
      overview_ira_license_no: this.entityDetails.licenceNumber,
      overview_dob: this.entityDetails.dateOfBirth,
      overview_citizenship :null,
      overview_gender: gender?.name,
      overview_marital_status: this.entityDetails.maritalStatus,
    }
  }


  fetchSelectOptions(): void {
    forkJoin({
      idTypes: this.entityService.getIdentityType(),
      countries: this.countryService.getCountries(),
      maritalStatuses: this.maritalStatusService.getMaritalStatus(),
      accountTypes: this.accountService.getAccountType(),
    }).subscribe({
      next: data => {
        this.idTypes = data.idTypes;
        this.countries = data.countries;
        this.maritalStatuses = data.maritalStatuses;
        this.accountTypes = data.accountTypes;
        this.setSelectOptions(data.idTypes, data.countries, data.maritalStatuses, data.accountTypes);
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        log.error(`could not fetch: `, err);
      }
    });
  }

  setSelectOptions(
    idTypes: IdentityModeDTO[],
    countries: CountryDto[],
    maritalStatuses: MaritalStatus[],
    accountTypes: AccountTypeDTO[],
  ): void {
    this.formGroupsAndFieldConfig.fields.forEach((field) => {
      switch (field.fieldId) {
        case 'overview_primary_id_type':
          field.options = idTypes;
          break;
        case 'overview_citizenship':
          field.options = countries;
          break;
        case 'overview_marital_status':
          field.options = maritalStatuses;
          break;
        case 'overview_gender':
          field.options = this.genders;
          break;
        case 'overview_account_type':
          field.options = accountTypes;
          break;
        default:
          // do something
      }
      this.cdr.detectChanges();
    });
  }

  patchClientFormValues(): void {
    let patchData: {};
    const category = this.entityDetails.category;
    const dob = this.entityDetails?.dateOfBirth;

    if (category.toUpperCase() === UserCategory.CORPORATE) {
      patchData = {
        overview_business_reg_no: this.entityDetails.idNumber,
        overview_date_of_incorporation: new Date(dob).toISOString().split('T')[0],
        overview_pin_number: this.entityDetails?.pinNumber,
      }
    } else if (category.toUpperCase() === UserCategory.INDIVIDUAL) {
      const gender = this.genders.find(g => (g.shtDesc).toUpperCase() === this.entityDetails.gender);
      patchData = {
        overview_client_type: this.entityDetails?.clientType?.clientTypeName,
        overview_primary_id_type: this.entityDetails.modeOfIdentity?.id,
        overview_id_number: this.entityDetails.idNumber,
        overview_pin_number: this.entityDetails.pinNumber,
        overview_date_of_birth: new Date(dob).toISOString().split('T')[0],
        overview_citizenship: this.entityDetails?.countryId,
        overview_gender: gender.id,
        overview_marital_status: this.entityDetails.maritalStatus,
      }
    }
    this.editForm.patchValue(patchData)
  }

  patchAgentFormValues(): void {
    let patchData: {};
    const category = this.entityDetails.category;
    const dob = this.entityDetails.dateOfBirth;

    if (category.toUpperCase() === UserCategory.CORPORATE) {
      // create payload for corporate

    } else if (category.toUpperCase() === UserCategory.INDIVIDUAL) {
      const gender = this.genders.find(g => g.shtDesc === this.entityDetails.gender);
      // const status = this.maritalStatuses.find(m => m.value === this.entityDetails.status);

      patchData = {
        overview_account_type: this.entityDetails.accountType?.id,
        overview_doc_id_no: this.entityDetails.idNumber,
        overview_tax_pin_no: this.entityDetails.pinNumber,
        overview_ira_license_no: this.entityDetails.licenceNumber,
        overview_dob: new Date(dob).toISOString().split('T')[0],
        overview_citizenship: null,
        overview_gender: gender?.id,
        overview_marital_status: undefined,
      }
    }
    this.editForm.patchValue(patchData)
  }


  openEditPrimeIdentityDialog(): void {
    this.editButton.nativeElement.click();

    switch (this.partyTypeShtDesc) {
      case 'C':
        this.patchClientFormValues();
        break;
      case 'A':
        this.patchAgentFormValues();
        break;
      default:
      //
    }
  }

  editPrimeDetails(): void {
    const formValues = this.editForm.getRawValue();
    const category = this.entityDetails?.category;

    switch (this.partyTypeShtDesc) {
      case 'C':
        this.editClientDetails(category, formValues);
        break;
      case 'A':
        this.editAgentDetails(category, formValues);
        break;
      default:
      //
    }

    this.closeButton.nativeElement.click();
  }


  editClientDetails(category: string, formValues: any): void {
    let primeDetails: {};

    if (category.toUpperCase() === UserCategory.CORPORATE) {
      primeDetails = {
        pinNumber: formValues.overview_pin_number,
        dateOfBirth: formValues.overview_date_of_incorporation,
        idNumber: formValues.overview_business_reg_no,
      }
    } else if (category.toUpperCase() === UserCategory.INDIVIDUAL) {
      const gender = this.genders.find(g => g.id === parseInt(formValues.overview_gender));
      primeDetails = {
        clientType: formValues.overview_client_type,
        modeOfIdentity: formValues.overview_primary_id_type,
        idNumber: formValues.overview_id_number,
        pinNumber: formValues.overview_pin_number,
        dateOfBirth: formValues.overview_date_of_birth,
        citizenshipCountryName: formValues.overview_citizenshipCountryName,
        gender: gender.name,
      }
    }

    const client = {
      clientCode: this.entityDetails.clientCode,
      partyAccountCode: this.entityDetails.partyAccountCode,
      partyId: this.entityDetails.partyId,
      ...primeDetails,
    };

    this.clientService.updateClientSection(this.entityDetails.clientCode, client).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
        this.entityDetails = data;
        this.initData();
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
  }


  editAgentDetails(category: string, formValues: any): void {
    let primeDetails: {};

    if (category.toUpperCase() === UserCategory.CORPORATE) {
      // create payload for corporate client

    } else if (category.toUpperCase() === UserCategory.INDIVIDUAL) {
      const gender = this.genders.find(g => g.id === parseInt(formValues.overview_gender));
      const country  = this.countries.find(cou => cou.id === parseInt(formValues.overview_citizenship));
      const maritalStatus  = this.maritalStatuses.find(m => m.name === formValues.overview_marital_status);

      log.info('form values >>. ', formValues);
      primeDetails = {
        accountTypeId: parseInt(formValues.overview_account_type),
        licenceNumber: formValues.overview_ira_license_no,
        idNumber: formValues.overview_doc_id_no,
        pinNumber: formValues.overview_tax_pin_no,
        dateOfBirth: formValues.overview_dob,
        countryName: country.name,
        gender: gender?.shtDesc,
        countryId: parseInt(formValues.overview_citizenship),
        maritalStatus: maritalStatus?.value,
      }
    }

    const accountCode = this.partyAccountDetails.accountCode;
    const agentPayload = {
      accountCode: this.partyAccountDetails.accountCode,
      partyAccountCode: this.entityDetails.partyAccountCode,
      partyId: this.entityDetails.partyId,
      ...primeDetails,
    };

    this.intermediaryService.updateAgentSection(accountCode, agentPayload).subscribe({
      next: data => {
        this.entityDetails = data;
        this.initData();
        this.globalMessagingService.displaySuccessMessage('Success', 'Entity details updated successfully');
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);      }
    });
  }

}
