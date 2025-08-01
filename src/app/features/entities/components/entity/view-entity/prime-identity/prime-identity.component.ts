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
  @Input() formFieldsConfig: any;
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
      /*if (this.selectOptions) {
        const idTypes = this.selectOptions.idTypes;
        const countries = this.selectOptions.countries;
        const maritalStatuses = this.selectOptions.maritalStatuses;
        this.setSelectOptions(idTypes, countries, maritalStatuses);
        this.cdr.detectChanges();
      }*/
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
    // patch form values
    const dob = this.partyAccountDetails?.dateOfBirth; // from api >>> "2007-04-10T00:00:00.000+00:00"
    const patchData = {
      id_type: this.partyAccountDetails?.modeOfIdentity.name,
      id_number: this.partyAccountDetails?.modeOfIdentityNumber,
      pin_number: this.partyAccountDetails?.pinNumber,
      dob: new Date(dob).toISOString().split('T')[0],
      citizenship: this.partyAccountDetails?.country, // todo: not available from backend
      gender: this.partyAccountDetails?.gender, // todo: not available from backend
      marital_status: '' // todo: not available from backend
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
    const clientDetails = {
      ...this.partyAccountDetails,
      idNumber: formValues.id_number,
      modeOfIdentity: formValues.id_type,
      pinNumber: formValues.pin_number,
      dateOfBirth: formValues.dob,
      country: formValues.country, // todo: change to country ID
      gender: (formValues.gender).toUpperCase(),
      maritalStatus: formValues.marital_status,
    }

    log.info(`client details to post >>> `, clientDetails)
    this.clientService.updateClient(this.partyAccountDetails.accountCode, clientDetails).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
    this.closeButton.nativeElement.click();
  }



}
