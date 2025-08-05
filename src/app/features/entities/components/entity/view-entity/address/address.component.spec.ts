import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { AddressComponent } from './address.component';
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MessageService} from "primeng/api";
import {ClientService} from "../../../../services/client/client.service";
import {CountryService} from "../../../../../../shared/services/setups/country/country.service";
import {CountryDto, PostalCodesDTO, StateDto, TownDto} from "../../../../../../shared/data/common/countryDto";
import {UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {ElementRef} from "@angular/core";

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
  id: 165,
  isShengen: "",
  mobilePrefix: 0,
  name: "nigeria",
  nationality: "nigerian",
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
];

const states: StateDto[] = [{country: countries[0], id: 1, name: "nigeria", shortDescription: "nig"}];

const towns: TownDto[] = [{country: undefined, id: 3, name: "", shortDescription: "", state: undefined}];

const postalCodes: PostalCodesDTO[] = [{description: "", id: 0, townCode: 0, townName: 0, zipCode: 0}];

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  const mockUtilService = {
    currentLanguage: of('en')
  }

  const mockCountryService = {
    getCountries: jest.fn(),
    getMainCityStatesByCountry: jest.fn(),
    getTownsByMainCityState: jest.fn(),
    getPostalCodes: jest.fn()
  }

  const mockClientService = {
    getClientTitles: jest.fn().mockReturnValue(of([])),
    updateClient: jest.fn().mockReturnValue(of({}))
  }

  let mockMessagingService = {
    displaySuccessMessage: jest.fn(),
    displayErrorMessage: jest.fn()
  };

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
        { provide: UtilService, useValue: mockUtilService },
        { provide: GlobalMessagingService, useValue: mockMessagingService },
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
      physicalAddress: '123 Main St',
    } as any;

    jest.spyOn(mockCountryService, 'getCountries').mockReturnValue(of(countries));
    jest.spyOn(mockCountryService, 'getMainCityStatesByCountry').mockReturnValue(of(states));
    jest.spyOn(mockCountryService, 'getTownsByMainCityState').mockReturnValue(of(towns));
    jest.spyOn(mockCountryService, 'getPostalCodes').mockReturnValue(of(postalCodes));

    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should set clientCountry based on addressDetails.countryId', () => {
    jest.spyOn(mockCountryService, 'getCountries').mockReturnValue(of(countries));

    component.addressDetails = {
      countryId: 165
    } as any;

    component.fetchCountries();

    expect(component.clientCountry).toEqual(countries[0]);
  });

  test('should patch form values correctly', () => {
    component.editForm = new FormBuilder().group({
      address: [''],
      country: [''],
      county: [''],
      city: [''],
      physicalAddress: [''],
      postalAddress: [''],
      postalCode: [''],
      town: [''],
      road: [''],
      houseNo: [''],
    });

    component.clientCountry = { id: 165 } as any;
    component.clientState = { id: 1 } as any;
    component.clientTown = { id: 3 } as any;

    component.patchFormValues();

    expect(component.editForm.value.physicalAddress).toBe('123 Main St');
    expect(component.editForm.value.town).toBe(3);
  });

  test('should call editButton click, setSelectOptions, and patchFormValues', fakeAsync(() => {
    const setSelectOptionsSpy = jest.spyOn(component, 'setSelectOptions');
    const patchFormValuesSpy = jest.spyOn(component, 'patchFormValues');

    component.clientCountry = { id: 165 } as any;
    component.clientState = { id: 1 } as any;
    component.clientTown = { id: 3 } as any;

    component.editButton = {
      nativeElement: {
        click: jest.fn()
      }
    } as any;

    component.openEditAddressDialog();

    expect(component.editButton.nativeElement.click).toHaveBeenCalled();
    expect(setSelectOptionsSpy).toHaveBeenCalled();

    tick(500); // simulate the 500ms delay
    expect(patchFormValuesSpy).toHaveBeenCalled();
  }));


  test('should set options for country, county, town, and postalCode fields', () => {
    component.countries = countries;
    component.states = states;
    component.towns = towns;
    component.postalCodes = postalCodes;

    component.formFieldsConfig = {
      fields: [
        { fieldId: 'country', options: [] },
        { fieldId: 'county', options: [] },
        { fieldId: 'town', options: [] },
        { fieldId: 'postalCode', options: [] }
      ]
    };

    component.setSelectOptions();

    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'country')?.options).toEqual(component.countries);
    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'county')?.options).toEqual(component.states);
    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'town')?.options).toEqual(component.towns);
    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'postalCode')?.options).toEqual(component.postalCodes);
  });

  test('should fetch and set states when a country is selected', () => {
    const mockStates = states;
    const mockEvent = { target: { value: 'kenya-id' } };

    // Spy on country service
    jest.spyOn(mockCountryService, 'getMainCityStatesByCountry').mockReturnValue(of(mockStates));

    // Setup form fields
    component.formFieldsConfig = {
      fields: [
        { fieldId: 'country', options: [] },
        { fieldId: 'county', options: [] }
      ]
    };

    component.processSelectOption(mockEvent, 'country');

    expect(mockCountryService.getMainCityStatesByCountry).toHaveBeenCalledWith('kenya-id');
    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'county')?.options).toEqual(mockStates);
  });

  test('should fetch and set towns when a county is selected', () => {
    const mockTowns = towns;
    const mockEvent = { target: { value: 'lagos-id' } };

    // Prepare formFieldsConfig with city and town fields
    component.formFieldsConfig = {
      fields: [
        { fieldId: 'city', options: [] },
        { fieldId: 'town', options: [] }
      ]
    };

    // Spy on getTownsByMainCityState
    const getTownsSpy = jest
      .spyOn(mockCountryService, 'getTownsByMainCityState')
      .mockReturnValue(of(mockTowns));

    component.processSelectOption(mockEvent, 'county');

    expect(getTownsSpy).toHaveBeenCalledWith('lagos-id');

    const cityField = component.formFieldsConfig.fields.find(f => f.fieldId === 'city');
    const townField = component.formFieldsConfig.fields.find(f => f.fieldId === 'town');

    expect(cityField?.options).toEqual(mockTowns);
    expect(townField?.options).toEqual(mockTowns);
  });

  test('should fetch and set postal codes when a city is selected', () => {
    const mockPostalCodes = postalCodes;
    const mockEvent = { target: { value: 'ikeja-id' } };

    // Prepare formFieldsConfig with postalCode field
    component.formFieldsConfig = {
      fields: [
        { fieldId: 'postalCode', options: [] }
      ]
    };

    // Spy on getPostalCodes
    const getPostalCodesSpy = jest
      .spyOn(mockCountryService, 'getPostalCodes')
      .mockReturnValue(of(mockPostalCodes));

    component.processSelectOption(mockEvent, 'city');

    expect(getPostalCodesSpy).toHaveBeenCalledWith('ikeja-id');

    const postalCodeField = component.formFieldsConfig.fields.find(f => f.fieldId === 'postalCode');
    expect(postalCodeField?.options).toEqual(mockPostalCodes);
  });


  test('should call updateClient', () => {
    component.editForm = new FormBuilder().group({
      country: ['165'],
      county: ['2'],
      city: ['3'],
      postalCode: ['00100'],
      physicalAddress: ['123 Main St'],
      postalAddress: ['P.O. Box 123'],
      road: ['1st Ave'],
      houseNo: ['12B']
    });

    component.addressDetails = {
      id: 100,
      countryId: 165,
      stateId: 2,
      townId: 3
    };

    component.accountCode = 42;

    component.closeButton = {
      nativeElement: {
        click: jest.fn()
      }
    } as unknown as ElementRef;

    component.editAddressDetails();

    expect(mockClientService.updateClient).toHaveBeenCalled();
    expect(mockMessagingService.displaySuccessMessage).toHaveBeenCalled();
  });


});
