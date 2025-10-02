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
  @Input() primeDetailsConfig: any
  @Input() formGroupsAndFieldConfig: any
  @Input() formFieldsConfig: any;
  @Input() clientDetails: any;
  @Input() selectOptions: {
    idTypes: IdentityModeDTO[],
    countries: CountryDto[],
    maritalStatuses: MaritalStatus[]
  };

  primaryDetailsConfig: any;
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

  constructor(
    private utilService: UtilService,
    private fb: FormBuilder,
    private entityService: EntityService,
    private countryService: CountryService,
    private maritalStatusService: MaritalStatusService,
    private clientService: ClientService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

  ngOnInit(): void {
    this.fetchSelectOptions();
    setTimeout(() => {
      this.primaryDetailsConfig = this.primeDetailsConfig.primary_details;
      this.createEditForm(this.formFieldsConfig.fields)

      /*this.primeDetails = {
        modeOfIdentityNumber: this.clientDetails.idNumber,
        partyType: this.partyAccountDetails.partyType,
        modeOfIdentity: this.clientDetails.modeOfIdentity,
        pinNumber: this.clientDetails.pinNumber,
        dateOfBirth: this.clientDetails.dateOfBirth,
        gender: this.clientDetails?.gender == 'M' ? 'male' : 'female',
        maritalStatus: this.clientDetails.maritalStatus,
        citizenshipCountryName: this.clientDetails.citizenshipCountryName,
        citizenshipCountryId: this.clientDetails.citizenshipCountryId,
      }*/

      this.primeDetails = {
        overview_business_reg_no: this.clientDetails.idNumber,
        overview_pin_number: this.clientDetails.pinNumber,
        overview_date_of_incorporation: this.clientDetails.dateOfBirth,
        overview_client_type: this.clientDetails.clientTyeName,
        overview_primary_id_type: this.clientDetails.modeOfIdentity,
        overview_id_number: this.clientDetails.idNumber,
        overview_date_of_birth: this.clientDetails.dateOfBirth,
        overview_citizenship: this.clientDetails.citizenshipCountryName,
        overview_gender: this.clientDetails.gender,
        overview_marital_status: this.clientDetails.maritalStatus,
      };

      const fields = this.formGroupsAndFieldConfig.fields.filter(field => field.formGroupingId.includes('prime_identity'));

      for (const field of fields) {
        field.dataValue = this.primeDetails[field.fieldId] ?? null;
        log.info(' mapped fields with data value >>> ', field, this.primeDetails[field.fieldId]);
      }
      log.info('fields to display >>> ', fields);



    }, 1000);
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
        if (this.primaryDetailsConfig) this.setSelectOptions(data.idTypes, data.countries, data.maritalStatuses);
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
    this.formFieldsConfig.fields.forEach((field) => {
      switch (field.fieldId) {
        case 'id_type':
          field.options = idTypes;
          break;
        case 'citizenship':
          field.options = countries;
          break;
        case 'marital_status':
          field.options = maritalStatuses;
          break;
        case 'gender':
          field.options = this.genders;
          break;
        default:
          // do something
      }
      this.cdr.detectChanges();
    });
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
  }

  patchFormValues(): void {
    const dob = this.clientDetails?.dateOfBirth; // from api >>> "2007-04-10T00:00:00.000+00:00"
    // const gender = (this.primeDetails?.gender[0]).toUpperCase() === 'M' ? 'male' : 'female';
    const genderIndex =
      this.genders.findIndex(gender => gender.shtDesc === this.primeDetails.gender[0].toLowerCase());

    const patchData = {
      id_type: this.primeDetails?.modeOfIdentity,
      id_number: this.primeDetails?.modeOfIdentityNumber,
      pin_number: this.primeDetails?.pinNumber,
      dob: new Date(dob).toISOString().split('T')[0],
      citizenship: this.primeDetails.citizenshipCountryId,
      gender: this.genders[genderIndex].id,
      marital_status: this.primeDetails.maritalStatus // todo: not available from backend
    }
    this.editForm.patchValue(patchData)
    log.info(`patched form values >>> `, this.editForm.value);
  }


  openEditPrimeIdentityDialog(): void {
    log.info(`openEditPrimeIdentityDialog >>> `, this.idTypes, this.countries, this.maritalStatuses);
    this.editButton.nativeElement.click();
    this.patchFormValues();
  }


  editPrimeDetails(): void {
    const formValues = this.editForm.value;

    const modeOfIdentityIndex =
      this.idTypes.findIndex((item) => item.name === formValues.id_type);

    const genderIndex =this.genders.findIndex((item) => item.id == formValues.gender);


    const partyAccountDetails = {
      // ...this.partyAccountDetails,
      idNumber: formValues.id_number,
      modeOfIdentity: this.idTypes[modeOfIdentityIndex],
      pinNumber: formValues.pin_number,
      dateOfBirth: formValues.dob,
      citizenshipCountryId: formValues.citizenship,
      gender: this.genders[genderIndex].shtDesc,
      maritalStatus: formValues.marital_status,
    }


    log.info(`client details to post >>> `, partyAccountDetails, formValues);
    this.clientService.updateClientSection(this.partyAccountDetails.accountCode, {...partyAccountDetails}).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
        this.primeDetails = {
          ...this.primeDetails,
          modeOfIdentityNumber: data.idNumber,
          modeOfIdentity: data.modeOfIdentity,
          pinNumber: data.pinNumber,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender.toUpperCase() === 'M' ? 'male' : 'female',
          maritalStatus: data.maritalStatus,
          citizenshipCountryName: data.citizenshipCountryName,
        }

        this.clientDetails = data;

        log.info('edited prime details', data);

      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
    this.closeButton.nativeElement.click();
  }

}
