import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

import { NewIntermediaryComponent } from './new-intermediary.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IntermediaryService} from "../../../services/intermediary/intermediary.service";
import {MessageService} from "primeng/api";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {DatePipe} from "@angular/common";
import {BehaviorSubject, of} from "rxjs";
import {
  DynamicBreadcrumbComponent
} from "../../../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component";
import {Logger, UtilService} from "../../../../../shared/services";
import {DropdownModule} from "primeng/dropdown";
import {Router} from "@angular/router";
import {CountryService} from "../../../../../shared/services/setups/country/country.service";
import {SectorService} from "../../../../../shared/services/setups/sector/sector.service";
import {OccupationService} from "../../../../../shared/services/setups/occupation/occupation.service";
import {EntityService} from "../../../services/entity/entity.service";
import {BankService} from "../../../../../shared/services/setups/bank/bank.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {AddressDTO, AgentPostDTO, AgentRequestDTO, ContactDetailsDTO} from "../../../data/AgentDTO";

const address: AddressDTO = {
  box_number: "",
  country_id: 0,
  estate: "",
  fax: "",
  house_number: "",
  id: 0,
  is_utility_address: "",
  physical_address: "",
  postal_code: "",
  residential_address: "",
  road: "",
  state_id: 0,
  town_id: "",
  zip: ""
}
const agentRequestDto: AgentRequestDTO = {
  agentIdNo: "",
  agentLicenceNo: "",
  branchId: "",
  creditLimit: "",
  is_credit_allowed: "",
  systemId: 0,
  vatApplicable: "",
  withHoldingTax: 0

}
const contactDetails: ContactDetailsDTO = {
  emailAddress: "",
  id: 0,
  phoneNumber: "",
  receivedDocuments: "",
  smsNumber: "",
  titleShortDescription: ""
}
const saveAgent: AgentPostDTO = {
  accountType: 0,
  address: address,
  agentRequestDto: agentRequestDto,
  category: "",
  contactDetails: contactDetails,
  countryId: "",
  createdBy: "",
  dateCreated: "",
  dateOfBirth: "",
  effectiveDateFrom: "",
  effectiveDateTo: "",
  firstName: "",
  gender: "",
  lastName: "",
  modeOfIdentityid: 0,
  organizationId: 0,
  partyId: 0,
  partyTypeShortDesc: "",
  pinNumber: "",
  status: ""

}

const entityDetails = {
  categoryName: "Individual",
  country: null,
  countryId: 1100,
  dateOfBirth: "2023-01-19T00:00:00.000+00:00",
  effectiveDateFrom: "2023-01-27T14:51:00.092+00:00",
  effectiveDateTo: null,
  id: 16675706,
  modeOfIdentity: {
    id: 1,
    identityFormat: "^[A-Z]{1,2}[0-9]{9}[A-Z]{1}$",
    identityFormatError: "Incorrect Id Format",
    name: "NATIONAL_ID",
    organizationId: 2,
  },
  modeOfIdentityNumber: "A456783251R",
  name: "Service test4",
  organization: {
    address: null,
    addressId: null,
    countryId: null,
    currency_id: 234,
    emailAddress: "info@geminia.co.ke",
    faxNumber: "020 - 2782100",
    groupId: 1,
    id: 2,
    license_number: null,
    manager: null,
    motto: "THINK INSURANCE,THINK GEMINIA",
    name: "GEMINIA INSURANCE CO. LTD",
    organization_type: "INS",
    physicalAddress: "LE'MAC 5TH FLOOR CHURCH ROAD, OFF WAIYAKI WAY",
    pin_number: null,
    postalCode: "00200",
    primaryTelephoneNo: "020 2782000",
    primarymobileNumber: "+254723057249",
    registrationNo: null,
    secondaryMobileNumber: "+254723230860",
    secondaryTelephoneNo: null,
    short_description: "GIC GENERAL",
    stateId: null,
    townId: null,
    vatNumber: null,
    webAddress: "www.geminia.co.ke",
  },
  organizationGroup: null,
  organizationGroupId: 1,
  organizationId: 2,
  partyTypeId: 4,
  pinNumber: "A457923456Y",
  profileImage: "",
  profilePicture: "",
}
export class MockCountryService {
  getCountries= jest.fn().mockReturnValue(of());
  getMainCityStatesByCountry= jest.fn().mockReturnValue(of());
  getTownsByMainCityState= jest.fn().mockReturnValue(of());
}

export class MockSectorService {
  getSectors = jest.fn().mockReturnValue(of());
}

export class MockOccupationsService {
  getOccupations = jest.fn().mockReturnValue(of());
}

export class MockEntityService {
  getClientTitles = jest.fn().mockReturnValue(of());
  currentEntity$ = new BehaviorSubject<any>(undefined);
}

export class MockMandatoryFieldsService {
  getMandatoryFieldsByGroupId = jest.fn().mockReturnValue(of());
}

export class MockBankService {
  getCurrencies = jest.fn().mockReturnValue(of());
  getBanks = jest.fn().mockReturnValue(of());
  getBankBranches = jest.fn().mockReturnValue(of());
  getBankBranchesByBankId = jest.fn().mockReturnValue(of());
}

export class MockIntermediaryService {
  getIdentityType = jest.fn().mockReturnValue(of());
  getAccountType = jest.fn().mockReturnValue(of());
  saveAgentDetails = jest.fn().mockReturnValue(of());
}

export class MockUtilService {
  findScrollContainer = jest.fn();
}
export class MockGlobalMessagingService {
  clearMessages = jest.fn();
  displaySuccessMessage = jest.fn().mockReturnValue(of());
}
describe('NewIntermediaryComponent', () => {
  let component: NewIntermediaryComponent;
  let fixture: ComponentFixture<NewIntermediaryComponent>;
  let countryServiceStub: CountryService;
  let sectorServiceStub: SectorService;
  let occupationsServiceStub: OccupationService;
  let entityServiceStub: EntityService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let bankServiceStub: BankService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let intermediaryServiceStub: IntermediaryService;
  let utilServiceStub: UtilService;
  let formBuilderStub: FormBuilder;
  let routerStub: Router;
  let loggerSpy: jest.SpyInstance;
  sessionStorage.setItem('entityDetails', JSON.stringify(entityDetails));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewIntermediaryComponent, DynamicBreadcrumbComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule
      ],
      providers: [
        { provide: CountryService, useClass: MockCountryService },
        { provide: SectorService, useClass: MockSectorService },
        { provide: OccupationService, useClass: MockOccupationsService },
        { provide: EntityService, useClass: MockEntityService },
        { provide: MandatoryFieldsService, useClass: MockMandatoryFieldsService },
        { provide: BankService, useClass: MockBankService },
        { provide: IntermediaryService, useClass: MockIntermediaryService },
        { provide: DatePipe },
        { provide: GlobalMessagingService, useClass: MockGlobalMessagingService },
        { provide: MessageService },
        { provide: UtilService, useClass: MockUtilService },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ]
    });
    fixture = TestBed.createComponent(NewIntermediaryComponent);
    component = fixture.componentInstance;
    countryServiceStub = TestBed.inject(CountryService);
    sectorServiceStub = TestBed.inject(SectorService);
    occupationsServiceStub = TestBed.inject(OccupationService);
    entityServiceStub = TestBed.inject(EntityService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    bankServiceStub = TestBed.inject(BankService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    utilServiceStub = TestBed.inject(UtilService);
    intermediaryServiceStub = TestBed.inject(IntermediaryService);
    routerStub = TestBed.inject(Router);
    loggerSpy = jest.spyOn(Logger.prototype, 'info');
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create client registration form', () => {
    expect(component.createIntermediaryRegForm).toBeTruthy();
    component.createIntermediaryForm.get('addressDetails.country').setValue('YourValue');

  });

  it('should get countries', () => {
    jest.spyOn(countryServiceStub, 'getCountries').mockReturnValue(of());
    component.fetchCountries();
    expect(countryServiceStub.getCountries().subscribe((data) =>{
      component.countryData= data;
    })).toBeTruthy();
  });

  it('should set validators based on response data', () => {

    const responseData = [
      {
        frontedId: 'citizenship',
        visibleStatus: 'Y',
        mandatoryStatus: 'Y',
        id: 1,
        fieldName: '',
        fieldLabel: 'citizenship',
        disabledStatus: '',
        screenName: '',
        groupId: 'intermediaryTab',
        module: ''
      },
      {
        frontedId: 'boxNumber',
        visibleStatus: 'Y',
        mandatoryStatus: 'N',
        id: 0,
        fieldName: '',
        fieldLabel: 'boxNumber',
        disabledStatus: '',
        screenName: '',
        groupId: 'intermediaryTab',
        module: ''
      },
    ];

    const getDataSpy = jest.spyOn(mandatoryFieldsServiceStub, 'getMandatoryFieldsByGroupId').mockReturnValue(of(responseData));

    component.createIntermediaryRegForm();

    const yourField1Control = component.createIntermediaryForm.controls;

    yourField1Control['citizenship'].setValue(null);

    expect(yourField1Control['citizenship'].valid).toBeFalsy();
    expect(yourField1Control['citizenship'].hasError('required')).toBeTruthy();

    /*const addressDet = (component.createIntermediaryForm.get('addressDetails') as FormGroup).controls;
    addressDet['boxNumber'].setValue(null);
    addressDet['boxNumber'].updateValueAndValidity();

    expect(addressDet['boxNumber'].valid).toBeFalsy();
    expect(addressDet['boxNumber'].hasError('required')).toBeTruthy();*/
  });

  it('should set agentType when selectUserType is called', () => {
    // Initial value of agentType should be defined by I
    expect(component.agentType).toBeDefined();

    const fakeEvent = {
      target: {
        value: 'C',
      },
    };

    component.selectUserType(fakeEvent);

    expect(component.agentType).toBe('C');
  });

  it('should set isWithHoldingTaxApplcable based on form value', () => {
    // Initial value of isWithHoldingTaxApplcable should be defined Y
    expect(component.isWithHoldingTaxApplcable).toBeDefined();

    const sampleFormValue = {
      otherDetails: {
        withHoldingTaxApplicable: "N",
      },
    };

    component.selectWithHoldingTax();

    expect(sampleFormValue.otherDetails.withHoldingTaxApplicable).toBe('N'); // Replace with the expected value
  });

  it('should reset form values, call getBanks, and fetch city states', () => {
    const selectedCountry = 1;
    const testData = [];

    const patchValueSpy = jest.spyOn(component.createIntermediaryForm, 'patchValue');
    const getBanksSpy = jest.spyOn(component, 'getBanks');
    const getMainCityStatesByCountrySpy = jest
      .spyOn(countryServiceStub, 'getMainCityStatesByCountry')
      .mockReturnValue(of(testData));

    component.selectedCountry = selectedCountry;

    component.onCountryChange();

    expect(patchValueSpy).toHaveBeenCalledWith({
      county: null,
      town: null,
    });

    expect(getBanksSpy).toHaveBeenCalledWith(selectedCountry);

    // Expect that getMainCityStatesByCountry was called with the selected country ID
    expect(getMainCityStatesByCountrySpy).toHaveBeenCalledWith(selectedCountry);

    // Since getMainCityStatesByCountry returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.citiesData).toEqual(testData);
    });
  });

  it('should fetch banks', () => {
    const countryId = 1;
    const testData = [];

    const getBanksSpy = jest.spyOn(bankServiceStub, 'getBanks').mockReturnValue(of(testData));

    // component.countryId = countryId;

    component.getBanks(countryId);

    // Expect that getBanks was called with the provided countryId
    expect(getBanksSpy).toHaveBeenCalledWith(countryId);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.banksData).toEqual(testData);
    });
  });


  it('should toggle showHideInputs when creditAllowed changes', () => {
    const showHideInputs = component.showHideInputs = true;

    // const selectedOption1 = component.createIntermediaryForm.controls['otherDetails.creditAllowed'];
    // selectedOption1.setValue('NO')
    // expect(component.showHideInputs).toBe(false);

    // Call toggleCreditAllowed with 'YES' option
    component.toggleCreditAllowed();

    // Now, showHideInputs should be true
    expect(showHideInputs).toBe(true);

    // Call toggleCreditAllowed with 'NO' option
    component.toggleCreditAllowed();

    // Now, showHideInputs should be false again
    // expect(showHideInputs).toBe(false);
  });

  it('should city states and log info message', () => {
    const stateId = 1;
    const testData = [];

    const getMainCityStatesByCountrySpy = jest
      .spyOn(countryServiceStub, 'getMainCityStatesByCountry')
      .mockReturnValue(of(testData));

    component.fetchMainCityStates(stateId);

    expect(getMainCityStatesByCountrySpy).toHaveBeenCalledWith(stateId);

    expect(loggerSpy).toHaveBeenCalledWith(`Fetching city states list for country, ${stateId}`);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.citiesData).toEqual(testData);
    });
  });

  it('should fetch towns and log info message', () => {
    const stateId = 1;
    const testData = [];

    const getTownsByMainCityStateSpy = jest
      .spyOn(countryServiceStub, 'getTownsByMainCityState')
      .mockReturnValue(of(testData));

    component.fetchTowns(stateId);

    expect(getTownsByMainCityStateSpy).toHaveBeenCalledWith(stateId);

    expect(loggerSpy).toHaveBeenCalledWith(`Fetching towns list for city-state, ${stateId}`);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.townData).toEqual(testData);
    });
  });

  it('should fetch towns when city state changes', () => {
    const selectedCityState = 1;
    const testData = [];

    const getTownsByMainCityStateSpy = jest
      .spyOn(countryServiceStub, 'getTownsByMainCityState')
      .mockReturnValue(of(testData));

    component.selectedCityState = selectedCityState;

    component.onCityChange();

    expect(getTownsByMainCityStateSpy).toHaveBeenCalledWith(selectedCityState);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.townData).toEqual(testData);
    });
  });

  it('should call getBankBranches and update branch in the form', () => {
    const selectedBank = 115;

    component.selectedBank = selectedBank;

    const bankBranches = jest.spyOn(component, 'getBankBranches');
    /*const branchControl = component.createIntermediaryForm.controls['paymentDetails']['branch'];

    branchControl.setValue(null);*/

    component.onBankSelection();

    expect(bankBranches).toHaveBeenCalledWith(selectedBank);

    // expect(branchControl).toBeNull();
  });

  it('should fetch bank branches when bankId is provided', () => {
    const bankId = 1;
    const testData = [];

    const getBankBranchesByBankIdSpy = jest
      .spyOn(bankServiceStub, 'getBankBranchesByBankId')
      .mockReturnValue(of(testData));

    component.getBankBranches(bankId);

    expect(getBankBranchesByBankIdSpy).toHaveBeenCalledWith(bankId);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.bankBranchData).toEqual(testData);
    });
  });

  it('should reset bankBranchData when bankId is not provided', () => {
    const bankId = null;

    component.getBankBranches(bankId);

    expect(component.bankBranchData).toEqual([]);
  });


  /*it('should prepare and send agent details for saving if the form is valid', () => {
    component.saveIntermediary();
    const citizenInput = component.createIntermediaryForm.controls['citizenship'];
    // formInputs.markAllAsTouched();
    citizenInput.addValidators(Validators.required);
    citizenInput.setValue('Kenya');
    citizenInput.updateValueAndValidity();
    /!*const mockScrollContainer = {
      scrollTop: 0,
    };
    let firstInvalidUnfilledControl: HTMLInputElement | HTMLSelectElement | null = null;
*!/

    /!*const saveButton = fixture.debugElement.nativeElement.querySelector('#saveIntermediaryBtn');
    saveButton.click();
    fixture.detectChanges();*!/

    jest.spyOn(intermediaryServiceStub, 'saveAgentDetails').mockReturnValue(of(saveAgent));
    const clearMessage = jest.spyOn(globalMessagingServiceStub, 'clearMessages');

    fixture.detectChanges();
    expect(component.createIntermediaryForm.touched).toBeTruthy();
    expect(component.createIntermediaryForm.valid).toBeTruthy();
    expect(clearMessage).toHaveBeenCalled();

    /!*setTimeout(() => {

      const formInputs = component.createIntermediaryForm.controls['citizenship'];
      formInputs.invalid;
      jest.spyOn(utilServiceStub, 'findScrollContainer');
    });

    const invalidFormErrorMessage = jest.spyOn(globalMessagingServiceStub, 'displayErrorMessage');
    expect(formInputs.touched).toBe(true);
    // expect(invalidFormErrorMessage).toHaveBeenCalledWith('Failed', 'Form is Invalid, Fill all required fields');
    expect(utilServiceStub.findScrollContainer).toHaveBeenCalledWith(firstInvalidUnfilledControl);
*!/
    // expect(mockScrollContainer.scrollTop).toBe(firstInvalidUnfilledControl.offsetTop);
  });*/

  /*it('should set submitted to true and mark form controls as touched', () => {
    // Call the saveIntermediary function
    component.saveIntermediary();

    // Expect that submitted is set to true
    expect(component.submitted).toBe(true);

    // Expect that createIntermediaryForm controls are marked as touched
    expect(component.createIntermediaryForm.touched).toBe(true);
  });*/

  it('should set the URL to a valid data URL when onUpload is called with an event', () => {
    const mockFile = new File([''], 'example.jpg', { type: 'image/jpeg' });
    const mockEvent = { target: { files: [mockFile] } } as any;

    component.onUpload(mockEvent);

    fixture.detectChanges();

  });
});
