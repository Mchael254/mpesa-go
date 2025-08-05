import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressComponent } from './address.component';
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MessageService} from "primeng/api";
import {ClientService} from "../../../../services/client/client.service";
import {CountryService} from "../../../../../../shared/services/setups/country/country.service";
import {CountryDto} from "../../../../../../shared/data/common/countryDto";

const countries: CountryDto[] = [
  {
  adminRegMandatory: "",
  adminRegType: "",
  currSerial: 0,
  currency: {
    createdBy: "",
    createdDate: "",
    decimalWord: "",
    id: 0,
    modifiedBy: "",
    modifiedDate: "",
    name: "",
    numberWord: "",
    roundingOff: 0,
    symbol: ""
  },
  drugTraffickingStatus: "",
  drugWefDate: "",
  drugWetDate: "",
  highRiskWefDate: "",
  highRiskWetDate: "",
  id: 0,
  isShengen: "",
  mobilePrefix: 0,
  name: "",
  nationality: "",
  risklevel: "",
  short_description: "",
  subAdministrativeUnit: "",
  telephoneMaximumLength: 0,
  telephoneMinimumLength: 0,
  unSanctionWefDate: "",
  unSanctionWetDate: "",
  unSanctioned: "",
  zipCode: 0,
  zipCodeString: ""
  }
]

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  const mockUtilService = {
    currentLanguage: of('en')
  }

  const mockCountryService = {
    getCountries: jest.fn().mockReturnValue(of(countries)),
    getMainCityStatesByCountry: jest.fn(),
    getTownsByMainCityState: jest.fn(),
    getPostalCodes: jest.fn()
  }

  const mockClientService = {
    getClientTitles: jest.fn().mockReturnValue(of([])),
    updateClient: jest.fn().mockReturnValue(of({}))
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        MessageService,
        FormBuilder,
        { provide: ClientService, useValue: mockClientService },
        { provide: CountryService, useValue: mockCountryService },
      ]
    });
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;

    component.formFieldsConfig =  {
      label: {
        en: "address",
        fr: "adresse",
        ke: "anwani"
      },
      fields: [
        {
          sectionId: "address",
          fieldId: "address",
          type: "text",
          label: { en: "address", ke: "", fr: "" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: ["NATIONAL_ID", "BIRTH_CERT"]
        },
        {
          sectionId: "address",
          fieldId: "country",
          type: "select",
          label: { en: "country", ke: "", fr: "" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: []
        },
        {
          sectionId: "address",
          fieldId: "county",
          type: "select",
          label: { en: "county / state", ke: "Aina ya Mteja", fr: "Type de Client" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: []
        },
        {
          sectionId: "address",
          fieldId: "city",
          type: "select",
          label: { en: "city / town", ke: "Aina ya Mteja", fr: "Type de Client" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: []
        },
        {
          sectionId: "address",
          fieldId: "physicalAddress",
          type: "text",
          label: { en: "physical address", ke: "Aina ya Mteja", fr: "Type de Client" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: []
        },
        {
          sectionId: "address",
          fieldId: "postalAddress",
          type: "text",
          label: { en: "postal address", ke: "Aina ya Mteja", fr: "Type de Client" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: ["m", "f"]
        },
        {
          sectionId: "address",
          fieldId: "postalCode",
          type: "select",
          label: { en: "postal code", ke: "Aina ya Mteja", fr: "Type de Client" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: ["m", "f"]
        },
        /*{
          sectionId: "address",
          fieldId: "town",
          type: "select",
          label: { en: "town", ke: "Aina ya Mteja", fr: "Type de Client" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: ["m", "f"]
        },*/
        /*{
          sectionId: "address",
          fieldId: "road",
          type: "text",
          label: { en: "road", ke: "Aina ya Mteja", fr: "Type de Client" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: ["m", "f"]
        },*/
        /*{
          sectionId: "address",
          fieldId: "houseNo",
          type: "text",
          label: { en: "house name /no", ke: "Aina ya Mteja", fr: "Type de Client" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: ["m", "f"]
        }*/
      ],
      buttons: {
        cancel: {
          sectionId: "prime_identity",
          fieldId: "cancel_button",
          type: "button",
          label: { en: "cancel", ke: "Aina ya Mteja", fr: "Type de Client" }
        },
        save: {
          sectionId: "prime_identity",
          fieldId: "cancel_button",
          type: "button",
          label: { en: "save details", ke: "Aina ya Mteja", fr: "Type de Client" }
        }
      }
    };

    component.addressDetails = {
      countryId: "165",
    }


    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
