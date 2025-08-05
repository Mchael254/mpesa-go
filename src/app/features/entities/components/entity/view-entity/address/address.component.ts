import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {CountryDto, PostalCodesDTO, StateDto, TownDto} from "../../../../../../shared/data/common/countryDto";
import {CountryService} from "../../../../../../shared/services/setups/country/country.service";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {ClientService} from "../../../../services/client/client.service";
import {ClientTitleDTO} from "../../../../../../shared/data/common/client-title-dto";

const log = new Logger('AddressComponent');

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() addressDetailsConfig: any
  @Input() formFieldsConfig: any;
  @Input() addressDetails: any;
  @Input() accountCode: number;

  countries: CountryDto[];
  clientCountry: CountryDto;

  states: StateDto[];
  clientState: StateDto;

  towns: TownDto[];
  clientTown: TownDto;
  postalCodes: PostalCodesDTO[];
  clientPostalCode: PostalCodesDTO

  language: string = 'en';
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private countryService: CountryService,
    private globalMessagingService: GlobalMessagingService,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
  ) {
    this.utilService.currentLanguage.subscribe(lang => this.language = lang);
  }

  ngOnInit(): void {
    this.fetchCountries();
    setTimeout(() => {
      if (this.countries && this.addressDetails) {

      }
    }, 1000)
    this.createEditForm(this.formFieldsConfig.fields)
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
    // this.patchFormValues();
  }

  fetchCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (countries: CountryDto[]) => {
        this.countries = countries;
        this.clientCountry = countries.find(country => country.id === this.addressDetails.countryId);
        this.fetchStates(this.clientCountry.id);
      },
      error: (err) => {}
    })
  }

  fetchStates(countryId: number): void {
    this.countryService.getMainCityStatesByCountry(countryId).subscribe({
      next:(states) => {
        this.states = states;
        this.clientState = states.find(state => state.id === this.addressDetails?.stateId);
        this.fetchTowns(this.addressDetails?.stateId);
      },
      error: (err) => {},
    })
  }

  fetchTowns(stateId: number): void {
    this.countryService.getTownsByMainCityState(stateId).subscribe({
      next:(towns) => {
        this.towns = towns;
        this.clientTown = towns.find(town => town.id === this.addressDetails?.townId);
        this.fetchPostalCodes(this.clientTown?.id);
      },
      error: (err) => {},
    })
  }

  fetchPostalCodes(townId: number): void {
    this.countryService.getPostalCodes(townId).subscribe({
      next: (postalCodes: PostalCodesDTO[]) => {
        this.postalCodes = postalCodes;
      },
      error: (err) => {},
    });
  }

  openEditAddressDialog(): void {
    this.editButton.nativeElement.click();
    this.setSelectOptions();
    setTimeout(() => {this.patchFormValues()}, 500)
  }

  patchFormValues(): void {
    const patchData = {
      address: '',
      country: this.clientCountry.id,
      county: this.clientState.id,
      city: this.clientTown.id,
      physicalAddress: this.addressDetails.physicalAddress,
      postalAddress: this.addressDetails.postalAddress,
      postalCode: this.addressDetails.postalCode,
      town: this.clientTown.id,
      road: this.addressDetails.road,
      houseNo: this.addressDetails.houseNo,
    }
    this.editForm.patchValue(patchData);
  }

  editAddressDetails(): void {
    const formValues = this.editForm.getRawValue();
    const addressDetails = {
      ...this.addressDetails,
      address: 'test address',
      countryId: formValues.country,
      stateId: formValues.county,
      townId: formValues.city,
      physicalAddress: formValues.physicalAddress,
      residentialAddress: formValues.physicalAddress,
      postalAddress: formValues.postalAddress,
      postalCode: formValues.postalCode,
      // townId: formValues.town,
      road: formValues.road,
      houseNumber: formValues.houseNo,
      // boxNumber: '123',
      // estate: 'test estate',
      // isUtilityAddress: '1233',
      // utilityAddressProof: '222',
      // fax: '123',
      // zip: '123',
      // phoneNumber: '08060911051',
      // modifiedBy: 'Tunde'
    }

    this.clientService.updateClient(this.accountCode, addressDetails).subscribe({
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

  setSelectOptions(): void {
    if (
      this.countries?.length > 0 &&
      this.states?.length > 0 &&
      this.towns?.length > 0
    ) {
      this.formFieldsConfig.fields.forEach(field => {
        switch (field.fieldId) {
          case 'country':
            field.options = this.countries;
            break;
          case 'county':
            field.options = this.states;
            break;
          case 'city':
          case 'town':
            field.options = this.towns;
            break;
          case 'postalCode':
            field.options = this.postalCodes;
            break;
          default:
            //do nothing
        }
        // this.cdr.detectChanges();
      });
    }
  }

  processSelectOption(event: any, fieldId: string): void {
    const selectedOption = event.target.value;
    log.info(`processSelectOption >>> `, fieldId, selectedOption);

    switch (fieldId) {
      case 'country': // update list of states/county by selected country
        this.countryService.getMainCityStatesByCountry(selectedOption).subscribe({
          next: states => {
            this.formFieldsConfig.fields.forEach(field => {
              if (field.fieldId === 'county') field.options = states;
            })
          },
          error: err => {},
        })
        break;

      case 'county': // update list of towns/cities by selected state/county
        this.countryService.getTownsByMainCityState(selectedOption).subscribe({
          next: towns => {
            this.formFieldsConfig.fields.forEach(field => {
              if (field.fieldId === 'city' || field.fieldId === 'town') field.options = towns;
            })
          }
        })
        break;

      case 'city':
        this.countryService.getPostalCodes(selectedOption).subscribe({
          next: postalCodes => {
            this.formFieldsConfig.fields.forEach(field => {
              if (field.fieldId === 'postalCode') field.options = postalCodes;
              log.info(`postalCode >>> `, field);
            })
          },
          error: err => {},
        })
        break;
    }
  }

}
