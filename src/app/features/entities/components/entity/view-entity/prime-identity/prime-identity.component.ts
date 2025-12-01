import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PartyAccountsDetails} from "../../../../data/accountDTO";
import {IdentityModeDTO, ReqPartyById} from "../../../../data/entityDto";
import {Logger, UtilService} from "../../../../../../shared/services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CountryDto} from "../../../../../../shared/data/common/countryDto";
import {MaritalStatus} from "../../../../../../shared/data/common/marital-status.model";
import {EntityService} from "../../../../services/entity/entity.service";
import {CountryService} from "../../../../../../shared/services/setups/country/country.service";
import {MaritalStatusService} from "../../../../../../shared/services/setups/marital-status/marital-status.service";
import {forkJoin} from "rxjs";
import {ClientService} from "../../../../services/client/client.service";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {group} from "@angular/animations";
import {ClientDTO} from "../../../../data/ClientDTO";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto, UserCategory
} from "../../../../../../shared/data/common/dynamic-screens-dto";
import {EntityUtilService} from "../../../../services/entity-util.service";
import {StaffDto} from "../../../../data/StaffDto";
import {ServiceProviderRes} from "../../../../data/ServiceProviderDTO";
import {AgentDTO} from "../../../../data/AgentDTO";

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
  @Input() entityPartyIdDetails: ReqPartyById;
  @Input() formGroupsAndFieldConfig: DynamicScreenSetupDto;
  @Input() clientDetails: ClientDTO;
  @Input() entityDetails: StaffDto | ClientDTO | ServiceProviderRes | AgentDTO;
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
  genders: {id: number, name: string, shtDesc: string}[] = [
    { id: 1, name: 'male', shtDesc: 'm'},
    { id: 2, name: 'female', shtDesc: 'f'},
  ]

  primeDetails: any;
  fields: ConfigFormFieldsDto[];

  constructor(
    private utilService: UtilService,
    // private fb: FormBuilder,
    private entityService: EntityService,
    private countryService: CountryService,
    private maritalStatusService: MaritalStatusService,
    private clientService: ClientService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private entityUtilService: EntityUtilService,
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

      const partyType = (this.partyAccountDetails.partyType.partyTypeName).toUpperCase();

      switch (partyType) {
        case 'CLIENT':
          this.setClientPrimeDetails();
          break;
        case 'INTERMEDIARIES':
          //
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
      this.fetchSelectOptions();
    }, 1000);
  }

  setClientPrimeDetails(): void {
    this.primeDetails = {
      overview_business_reg_no: this.clientDetails.idNumber,
      overview_pin_number: this.clientDetails.pinNumber,
      overview_date_of_incorporation: this.clientDetails?.dateOfBirth,
      overview_client_type: this.clientDetails?.clientType?.clientTypeName,
      overview_primary_id_type: this.clientDetails.modeOfIdentity?.name,
      overview_id_number: this.clientDetails.idNumber,
      overview_date_of_birth: this.clientDetails.dateOfBirth,
      overview_citizenship: this.clientDetails.citizenshipCountryName,
      overview_gender: this.clientDetails.gender,
      overview_marital_status: this.clientDetails.maritalStatus,
    };
  }


  fetchSelectOptions(): void {
    forkJoin({
      idTypes: this.entityService.getIdentityType(),
      countries: this.countryService.getCountries(),
      maritalStatuses: this.maritalStatusService.getMaritalStatus()
    }).subscribe({
      next: data => {
        this.idTypes = data.idTypes;
        this.countries = data.countries;
        this.maritalStatuses = data.maritalStatuses
        this.setSelectOptions(data.idTypes, data.countries, data.maritalStatuses);
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
    maritalStatuses: MaritalStatus[]
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
        default:
          // do something
      }
      this.cdr.detectChanges();
    });
  }

  patchFormValues(): void {
    let patchData: {};
    const category = this.clientDetails.category;
    const dob = this.clientDetails?.dateOfBirth;

    if (category.toUpperCase() === UserCategory.CORPORATE) {
      patchData = {
        overview_business_reg_no: this.clientDetails.idNumber,
        overview_date_of_incorporation: new Date(dob).toISOString().split('T')[0],
        overview_pin_number: this.clientDetails?.pinNumber,
      }
    } else if (category.toUpperCase() === UserCategory.INDIVIDUAL) {
      const gender = this.genders.find(g => (g.shtDesc).toUpperCase() === this.clientDetails.gender);
      patchData = {
        overview_client_type: this.clientDetails?.clientType?.clientTypeName,
        overview_primary_id_type: this.clientDetails.modeOfIdentity?.id,
        overview_id_number: this.clientDetails.idNumber,
        overview_pin_number: this.clientDetails.pinNumber,
        overview_date_of_birth: new Date(dob).toISOString().split('T')[0],
        overview_citizenship: this.clientDetails?.citizenshipCountryId,
        overview_gender: gender.id,
        overview_marital_status: this.clientDetails.maritalStatus,
      }
    }
    this.editForm.patchValue(patchData)
  }


  openEditPrimeIdentityDialog(): void {
    this.editButton.nativeElement.click();
    this.patchFormValues();
  }


  editPrimeDetails(): void {
    const formValues = this.editForm.value;
    const category = this.clientDetails?.category;
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
      clientCode: this.clientDetails.clientCode,
      partyAccountCode: this.clientDetails.partyAccountCode,
      partyId: this.clientDetails.partyId,
      ...primeDetails,
    };

    this.clientService.updateClientSection(this.clientDetails.clientCode, client).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
        this.clientDetails = data;
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
