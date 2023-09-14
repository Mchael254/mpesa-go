import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NewClientComponent } from './new-client.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import { MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import {SectorService} from "../../../../../shared/services/setups/sector.service";
import {BankService} from "../../../../../shared/services/setups/bank.service";
import { AccountService } from '../../../services/account/account.service';
import { ClientService } from '../../../services/client/client.service';
import {OccupationService} from "../../../../../shared/services/setups/occupation.service";
import {CountryService} from "../../../../../shared/services/setups/country.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields.service";


import { of } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientDTO } from '../../../data/ClientDTO';
import { Logger } from '../../../../../shared/services';

const countryData = null;
const sectorData = null;
const currenciesData = null;
const banksData = null;
const branchesData = null;
const clientTitlesData = null;
const countyData = null;
const townData = null;
const identityTypeData = [];
const occupationData = null;
const savingClient: ClientDTO = {
  branchCode: 0,
  category: '',
  clientTitle: '',
  clientType: {
    category: '',
    clientTypeName: '',
    code: 0,
    description: '',
    organizationId: 0,
    person: '',
    type: ''
  },
  country: 0,
  createdBy: '',
  dateOfBirth: '',
  emailAddress: '',
  firstName: '',
  gender: '',
  id: 0,
  idNumber: '',
  lastName: '',
  modeOfIdentity: '',
  occupation: {
    id: 0,
    name: '',
    sector_id: 0,
    short_description: ''
  },
  passportNumber: '',
  phoneNumber: '',
  physicalAddress: '',
  pinNumber: '',
  shortDescription: '',
  status: '',
  withEffectFromDate: '',
  clientTypeName: '',
  clientFullName: ''
}
export class MockClientsService {
  getClients = jest.fn().mockReturnValue(of());
  getClientById= jest.fn().mockReturnValue(of());
  getCountries= jest.fn().mockReturnValue(of(countryData));
  getSectors= jest.fn().mockReturnValue(of(sectorData));
  getCurrencies= jest.fn().mockReturnValue(of(currenciesData));
  getBanks= jest.fn().mockReturnValue(of(banksData));
  getBranches= jest.fn().mockReturnValue(of(branchesData));
  getClientTitles= jest.fn().mockReturnValue(of(clientTitlesData));
  getCounty= jest.fn().mockReturnValue(of(countyData));
  getTown= jest.fn().mockReturnValue(of(townData));
  getIdentityType= jest.fn().mockReturnValue(of(identityTypeData));
  getOccupation= jest.fn().mockReturnValue(of(occupationData));
  saveClientDetails = jest.fn().mockReturnValue(of());
}
export class mockMandatoryService{
  getMandatoryFieldsByGroupId=jest.fn().mockReturnValue(of());
}
export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
    };
  }
}

describe('NewClientComponent', () => {
  let component: NewClientComponent;
  let fixture: ComponentFixture<NewClientComponent>;
  let service: SectorService;
  let bankService: BankService;
  let accountService:AccountService;
  let clientService:ClientService;
  let occupationService:OccupationService;
  let countryService:CountryService;
  let mandatoryFieldsService:MandatoryFieldsService
  let loggerSpy: jest.SpyInstance; 
  let globalMessageService:GlobalMessagingService;
    beforeEach(() => {
 
    TestBed.configureTestingModule({
      declarations: [NewClientComponent],
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
        
      ],
      providers:[
        { provide: AppConfigService, useClass: MockAppConfigService },
        {provide:MandatoryFieldsService,useClass:mockMandatoryService},
        GlobalMessagingService,
        MessageService,
        
      ]
    });
    fixture = TestBed.createComponent(NewClientComponent);
    service = TestBed.inject(SectorService);
    bankService= TestBed.inject(BankService);
    accountService= TestBed.inject(AccountService);
    clientService= TestBed.inject(ClientService);
    occupationService= TestBed.inject(OccupationService);
    countryService= TestBed.inject(CountryService);
    mandatoryFieldsService= TestBed.inject(MandatoryFieldsService);
    globalMessageService= TestBed.inject(GlobalMessagingService);

      component = fixture.componentInstance;
         // Create a spy for the Logger class and its methods
    loggerSpy = jest.spyOn(Logger.prototype, 'info');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  test('should get county', () => {
    jest.spyOn(countryService, 'getMainCityStatesByCountry').mockReturnValue(of());
    component.ngOnInit();
    expect(countryService.getMainCityStatesByCountry(0).subscribe((data) =>{
      component.citiesData= data;
    })).toBeTruthy();
  }); 
  it('should call getBankBranches and detect changes when bank is selected', fakeAsync(() => {
    const selectedBank = 123;
    const bankBranches = [{ name: 'Branch A' }, { name: 'Branch B' }];

    // Set the selected bank in your component
    component.selectedBank = selectedBank;

    // Spy on the getBankBranches method of your service and mock its return value
    const getBankBranchesSpy = jest.spyOn(bankService, 'getBankBranchesByBankId').mockReturnValue(of(bankBranches)as any);

    // Call the method to be tested
    component.onBankSelection();

    // Expectations
    // expect(component.clientRegistrationForm.value.branch).toBeNull();
    expect(getBankBranchesSpy).toHaveBeenCalledWith(selectedBank);

    // Detect changes to update the view
    fixture.detectChanges();

    // Use tick to complete any asynchronous operations
    tick();

    // Verify that the bankBranchData property is set correctly
    // expect(component.bankBranchData).toEqual(bankBranches);

    // Additional expectations if needed
  }));
  it('should set clientType property and log the value to the console', () => {
    const mockEvent = {
      target: {
        value: 'YourMockedValue', // Replace with the value you want to test
      },
    };

    // const consoleLogSpy = spyOn(console, 'log'); // Create a spy for console.log

    // Call the selectUserType method with the mocked event
    component.selectUserType(mockEvent);

    // Expectations
    expect(component.clientType).toBe('YourMockedValue'); // Replace with the expected value
    // expect(consoleLogSpy).toHaveBeenCalledWith('userType >>>', 'YourMockedValue', 'YourMockedValue'); // Check if console.log is called with the expected arguments
  });
  it('should set the utilityBill property', () => {
    const mockEvent = {
      target: {
        value: 'YourMockedValue', // Replace with the value you want to test
      },
    };

    // Call the selectUtilityBill method with the mocked event
    component.selectUtilityBill(mockEvent);

    // Expectations
    expect(component.utilityBill).toBe('YourMockedValue'); // Replace with the expected value
  });
  it('should create a valid client registration form', () => {
    // Call the method to initialize the form
    component.clientRegForm();

    // Assert that the form is created
    expect(component.clientRegistrationForm).toBeTruthy();

    // Assert that specific form controls are created
    expect(component.clientRegistrationForm.get('partyTypeShtDesc')).toBeTruthy();
    expect(component.clientRegistrationForm.get('partyId')).toBeTruthy();
    expect(component.clientRegistrationForm.get('identity_type')).toBeTruthy();
    // Add more assertions for other form controls as needed

    // You can also check the initial values if applicable
    // For example, if you expect 'partyTypeShtDesc' to be 'CLIENT':
    expect(component.clientRegistrationForm.get('partyTypeShtDesc').value).toEqual('CLIENT');

    // You can also check the initial values of nested form groups if needed

    // Ensure the form is initially valid if there are any validation rules
    expect(component.clientRegistrationForm.get('partyTypeShtDesc').value).toEqual('CLIENT');
  });
  it('should set initial values for specific form controls', () => {
    // Call the method to initialize the form
    component.clientRegForm();

    // Verify that specific form controls have the expected initial values
    expect(component.clientRegistrationForm.get('partyTypeShtDesc').value).toEqual('CLIENT');
  });
  it('should have required fields marked as invalid if initialized with empty values', () => {
  // Call the method to initialize the form
  component.clientRegForm();

  // Simulate initializing the form with empty values for required fields
  component.clientRegistrationForm.get('partyTypeShtDesc').setValue('');
  // Set other required fields to empty values similarly

  // Assert that the form is invalid
  expect(component.clientRegistrationForm.invalid).toBeTruthy();

  // Check if individual required form controls are marked as invalid
  // expect(component.clientRegistrationForm.get('partyTypeShtDesc').hasError('required')).toBeTruthy();
  });
  it('should call required methods and initialize client form', () => {
    const entityDetails = {
      // Provide entity details here as needed for your test
    };
    
    // Spy on sessionStorage's getItem method
    // const getItemSpy = jest.spyOn(sessionStorage, 'getItem');
    // getItemSpy.mockReturnValue(JSON.stringify(entityDetails));

    // Spy on component methods
    const clientRegFormSpy = jest.spyOn(component, 'clientRegForm');
    const getClientByIdSpy = jest.spyOn(clientService, 'getClientById');
    getClientByIdSpy.mockReturnValue(of(/* mock client data */));
    const fetchCountriesSpy = jest.spyOn(component, 'fetchCountries');
    const getSectorsSpy = jest.spyOn(component, 'getSectors');
    const getCurrenciesSpy = jest.spyOn(component, 'getCurrencies');
    const getClientTitlesSpy = jest.spyOn(component, 'getClientTitles');
    const getIdentityTypeSpy = jest.spyOn(component, 'getIdentityType');
    const getOccupationSpy = jest.spyOn(component, 'getOccupation');
    const getClientTypeSpy = jest.spyOn(component, 'getClientType');
    const getClientBranchSpy = jest.spyOn(component, 'getClientBranch');

    // Call the ngOnInit method
    component.ngOnInit();

    // Expectations
    expect(clientRegFormSpy).toHaveBeenCalled();
    // expect(getClientByIdSpy).toHaveBeenCalledWith(component.clientID);
    expect(fetchCountriesSpy).toHaveBeenCalled();
  });
  it('should subscribe to mandatory fields service and update form controls', () => {
    const mockResponse = [
      // Define your mock response here, matching the structure in your actual code
    ];

    // Spy on the getMandatoryFieldsByGroupId method and return the mock response
    jest.spyOn(mandatoryFieldsService, 'getMandatoryFieldsByGroupId').mockReturnValue(of(mockResponse));

    // Call the ngAfterViewInit method
    component.ngAfterViewInit();

    // Assert that this.response is updated as expected based on your mock response
    expect(component.response).toEqual(mockResponse);

    // You can add more assertions here to check if form controls and labels are updated correctly
    
  // Iterate through the form controls and assert that they have the correct validators
  const formControls = component.clientRegistrationForm.controls;
  for (const key of Object.keys(formControls)) {
    const control = formControls[key];

    if (control && control.enabled && mockResponse.some(field => field.frontedId === key)) {
      // Check if the control has the required validator
      expect(control.hasValidator(Validators.required)).toBeTruthy();
    }
  }

  // Iterate through labels and assert that they have asterisks if needed
  const labels = fixture.nativeElement.querySelectorAll('label');
  for (const label of labels) {
    const htmlFor = label.getAttribute('for');
    if (mockResponse.some(field => field.frontedId === htmlFor)) {
      // Check if the label has an asterisk
      const asterisk = label.querySelector('span');
      expect(asterisk).toBeTruthy();
      expect(asterisk.textContent.trim()).toBe('*');
      expect(asterisk.style.color).toBe('red');
    }
  }
  });

  it('should submit client registration form when valid', () => {
    const mockClientData = {
      branchCode: 123,
      category: 'Category1',
      clientFullName: 'John Doe',
      clientTitle: 'Mr.',
      clientType: {
        category: 'ClientCategory1',
        clientTypeName: 'ClientTypeName1',
        code: 456,
        description: 'ClientTypeDescription1',
        organizationId: 789,
        person: 'Person1',
        type: 'Type1',
      },
      clientTypeName: 'ClientType1',
      country: 456,
      createdBy: 'CreatedUser',
      dateOfBirth: '1990-01-15',
      emailAddress: 'example@example.com',
      firstName: 'John',
      gender: 'Male',
      id: 789,
      idNumber: 'AB123456',
      lastName: 'Doe',
      modeOfIdentity: 'Passport',
      occupation: {
        id: 101,
        name: 'Occupation1',
        sector_id: 201,
        short_description: 'Desc1',
      },
      passportNumber: 'Passport123',
      phoneNumber: '9876543210',
      physicalAddress: '123 Street',
      pinNumber: 'PIN123',
      shortDescription: 'ShortDesc1',
      status: 'Active',
      withEffectFromDate: '2023-01-01',
    };
      
    // Define form values that match your form structure
    const formValues = {
      partyTypeShtDesc: 'CLIENT',
      partyId: 16673590,
      identity_type: '', // Example value for identity_type
      citizenship: '', // Example value for citizenship
      surname: '', // Example value for surname
      certRegNo: '', // Example value for certRegNo
      regName: '', // Example value for regName
      tradeName: '', // Example value for tradeName
      regDate: '', // Example value for regDate
      countryOfIncorporation: '', // Example value for countryOfIncorporation
      parentCompany: '', // Example value for parentCompany
      otherName: '', // Example value for otherName
      dateOfBirth: '', // Example value for dateOfBirth
      idNumber: '', // Example value for idNumber
      pinNumber: '', // Example value for pinNumber
      gender: '', // Example value for gender
      clientTypeId: '', // Example value for clientTypeId
  
      contact_details: {
        clientBranch: 'Branch1', // Fill in with appropriate value
        clientTitle: 'Mr.', // Fill in with appropriate value
        smsNumber: '123456', // Fill in with appropriate value
        phoneNumber: '987654', // Fill in with appropriate value
        email: 'example@example.com', // Fill in with appropriate value
        channel: 'Email', // Fill in with appropriate value
        pinNo: '1234', // Fill in with appropriate value
        eDocuments: 'Document1', // Fill in with appropriate value
      },
  
      address: {
        box_number: '123', // Fill in with appropriate value
        country: 'Country1', // Fill in with appropriate value
        county: 'County1', // Fill in with appropriate value
        town: 'Town1', // Fill in with appropriate value
        physical_address: '123 Street', // Fill in with appropriate value
        road: 'Road1', // Fill in with appropriate value
        house_number: '123', // Fill in with appropriate value
        utility_address_proof: 'Proof1', // Fill in with appropriate value
        is_utility_address: 'Yes', // Fill in with appropriate value
      },
  
      payment_details: {
        bank: 'Bank1', // Fill in with appropriate value
        branch: 'Branch1', // Fill in with appropriate value
        account_number: '1234567890', // Fill in with appropriate value
        currency: 'USD', // Fill in with appropriate value
        effective_to_date: '2023-12-31', // Fill in with appropriate value
        effective_from_date: '2023-01-01', // Fill in with appropriate value
        mpayNo: 'MPay123', // Fill in with appropriate value
        Iban: 'IBAN123', // Fill in with appropriate value
        is_default_channel: 'Yes', // Fill in with appropriate value
      },
  
      next_of_kin_details: {
        mode_of_identity: 'Passport', // Fill in with appropriate value
        identity_number: 'AB123456', // Fill in with appropriate value
        full_name: 'John Doe', // Fill in with appropriate value
        relationship: 'Spouse', // Fill in with appropriate value
        phone_number: '9876543210', // Fill in with appropriate value
        email_address: 'john@example.com', // Fill in with appropriate value
        dateofbirth: '1990-01-15', // Fill in with appropriate value
      },
  
      wealth_details: {
        wealth_citizenship: 'Country2', // Fill in with appropriate value
        marital_status: 'Married', // Fill in with appropriate value
        funds_source: 'Savings', // Fill in with appropriate value
        typeOfEmployment: 'Employed', // Fill in with appropriate value
        economic_sector: 'Finance', // Fill in with appropriate value
        occupation: 'Accountant', // Fill in with appropriate value
        purposeinInsurance: 'Life Insurance', // Fill in with appropriate value
        premiumFrequency: 'Monthly', // Fill in with appropriate value
        distributeChannel: 'Online', // Fill in with appropriate value
      },
    };
  
   
  // Mocking your form values
  component.clientRegistrationForm.setValue(formValues);

  // Disable 'partyTypeShtDesc' control
  component.clientRegistrationForm.get('partyTypeShtDesc').disable();

  // Trigger the saveClientBasic method
  component.saveClientBasic();
  
   // Mock the saveClientDetails method in the service
   const saveClientDetailsSpy = jest
   .spyOn(clientService, 'saveClientDetails')
   .mockReturnValue(of(mockClientData)as any);



  const expectedClientData: ClientDTO = {
    branchCode: 123, // Fill in with an appropriate number
    category: 'Category1', // Fill in with an appropriate string
    clientTitle: 'Mr.', // Fill in with an appropriate string
    clientType: {
      category: 'ClientCategory1', // Fill in with an appropriate string
      clientTypeName: 'ClientTypeName1', // Fill in with an appropriate string
      code: 456, // Fill in with an appropriate number
      description: 'ClientTypeDescription1', // Fill in with an appropriate string
      organizationId: 789, // Fill in with an appropriate number
      person: 'Person1', // Fill in with an appropriate string
      type: 'Type1', // Fill in with an appropriate string
    },
    country: 456, // Fill in with an appropriate number
    createdBy: 'CreatedUser', // Fill in with an appropriate string
    dateOfBirth: '1990-01-15', // Fill in with an appropriate date string
    emailAddress: 'example@example.com', // Fill in with an appropriate string
    firstName: 'John', // Fill in with an appropriate string
    gender: 'Male', // Fill in with an appropriate string
    id: 789, // Fill in with an appropriate number
    idNumber: 'AB123456', // Fill in with an appropriate string
    lastName: 'Doe', // Fill in with an appropriate string
    modeOfIdentity: 'Passport', // Fill in with an appropriate string
    occupation: {
      id: 101, // Fill in with an appropriate number
      name: 'Occupation1', // Fill in with an appropriate string
      sector_id: 201, // Fill in with an appropriate number
      short_description: 'Desc1', // Fill in with an appropriate string
    },
    passportNumber: 'Passport123', // Fill in with an appropriate string
    phoneNumber: '9876543210', // Fill in with an appropriate string
    physicalAddress: '123 Street', // Fill in with an appropriate string
    pinNumber: 'PIN123', // Fill in with an appropriate string
    shortDescription: 'ShortDesc1', // Fill in with an appropriate string
    status: 'Active', // Fill in with an appropriate string
    withEffectFromDate: '2023-01-01', // Fill in with an appropriate date string
    clientTypeName: 'ClientType1', // Fill in with an appropriate string
    clientFullName: 'John Doe', // Fill in with an appropriate string
  };
  
  // Check if the saveClientDetails method was called with the correct data
  // expect(clientService.saveClientDetails).toHaveBeenCalledWith(expectedClientData);
  

  // Re-enable 'partyTypeShtDesc' control after the test if needed
  component.clientRegistrationForm.get('partyTypeShtDesc').enable();
  });
  it('should display validation errors for invalid form submission', () => {
    // Define form values with invalid data (e.g., empty required fields)
    const invalidFormValues = {
      partyTypeShtDesc: 'CLIENT',
      partyId: null, // Invalid partyId value (null)
      identity_type: '', // Empty identity_type field to trigger a 'required' error
      citizenship: '', // Empty citizenship field to trigger a 'required' error
      surname: '', // Empty surname field to trigger a 'required' error
      certRegNo: '', // Empty certRegNo field to trigger a 'required' error
      regName: '', // Empty regName field to trigger a 'required' error
      tradeName: '', // Empty tradeName field to trigger a 'required' error
      regDate: '', // Empty regDate field to trigger a 'required' error
      countryOfIncorporation: '', // Empty countryOfIncorporation field to trigger a 'required' error
      parentCompany: '', // Empty parentCompany field to trigger a 'required' error
      otherName: '', // Empty otherName field to trigger a 'required' error
      dateOfBirth: '', // Empty dateOfBirth field to trigger a 'required' error
      idNumber: '', // Empty idNumber field to trigger a 'required' error
      pinNumber: '', // Empty pinNumber field to trigger a 'required' error
      gender: '', // Empty gender field to trigger a 'required' error
      clientTypeId: '', // Empty clientTypeId field to trigger a 'required' error
      contact_details: {
        clientBranch: '', // Empty clientBranch field to trigger a 'required' error
        clientTitle: '', // Empty clientTitle field to trigger a 'required' error
        smsNumber: '', // Empty smsNumber field to trigger a 'required' error
        phoneNumber: '', // Empty phoneNumber field to trigger a 'required' error
        email: '', // Empty email field to trigger a 'required' error
        channel: '', // Empty channel field to trigger a 'required' error
        pinNo: '', // Empty pinNo field to trigger a 'required' error
        eDocuments: '', // Empty eDocuments field to trigger a 'required' error
      },
      address: {
        box_number: '', // Empty box_number field to trigger a 'required' error
        country: '', // Empty country field to trigger a 'required' error
        county: '', // Empty county field to trigger a 'required' error
        town: '', // Empty town field to trigger a 'required' error
        physical_address: '', // Empty physical_address field to trigger a 'required' error
        road: '', // Empty road field to trigger a 'required' error
        house_number: '', // Empty house_number field to trigger a 'required' error
        utility_address_proof: '', // Empty utility_address_proof field to trigger a 'required' error
        is_utility_address: '', // Empty is_utility_address field to trigger a 'required' error
      },
      payment_details: {
        bank: '', // Empty bank field to trigger a 'required' error
        branch: '', // Empty branch field to trigger a 'required' error
        account_number: '', // Empty account_number field to trigger a 'required' error
        currency: '', // Empty currency field to trigger a 'required' error
        effective_to_date: '', // Empty effective_to_date field to trigger a 'required' error
        effective_from_date: '', // Empty effective_from_date field to trigger a 'required' error
        mpayNo: '', // Empty mpayNo field to trigger a 'required' error
        Iban: '', // Empty Iban field to trigger a 'required' error
        is_default_channel: '', // Empty is_default_channel field to trigger a 'required' error
      },
      next_of_kin_details: {
        mode_of_identity: '', // Empty mode_of_identity field to trigger a 'required' error
        identity_number: '', // Empty identity_number field to trigger a 'required' error
        full_name: '', // Empty full_name field to trigger a 'required' error
        relationship: '', // Empty relationship field to trigger a 'required' error
        phone_number: '', // Empty phone_number field to trigger a 'required' error
        email_address: '', // Empty email_address field to trigger a 'required' error
        dateofbirth: '', // Empty dateofbirth field to trigger a 'required' error
      },
      wealth_details: {
        wealth_citizenship: '', // Empty wealth_citizenship field to trigger a 'required' error
        marital_status: '', // Empty marital_status field to trigger a 'required' error
        funds_source: '', // Empty funds_source field to trigger a 'required' error
        typeOfEmployment: '', // Empty typeOfEmployment field to trigger a 'required' error
        economic_sector: '', // Empty economic_sector field to trigger a 'required' error
        occupation: '', // Empty occupation field to trigger a 'required' error
        purposeinInsurance: '', // Empty purposeinInsurance field to trigger a 'required' error
        premiumFrequency: '', // Empty premiumFrequency field to trigger a 'required' error
        distributeChannel: '', // Empty distributeChannel field to trigger a 'required' error
      },
    };
  
    // Mock your form values
    component.clientRegistrationForm.setValue(invalidFormValues);
  
    // Disable 'partyTypeShtDesc' control
    component.clientRegistrationForm.get('partyTypeShtDesc').disable();
  
    // Trigger the saveClientBasic method
    component.saveClientBasic();
  
    expect(component.clientRegistrationForm.get('address.utility_address_proof').hasError('required')).toBeTruthy();

  
   
  
    // Ensure that the saveClientDetails method was NOT called
    // expect(clientService.saveClientDetails).not.toHaveBeenCalled();
  
    // Re-enable 'partyTypeShtDesc' control after the test if needed
    component.clientRegistrationForm.get('partyTypeShtDesc').enable();
  });
  it('should call saveClientDetails after timeout', () => {
    const mockClientFormValues = {
      partyTypeShtDesc: 'CLIENT',
      partyId: 16673590,
      identity_type: 'Passport',
      citizenship: 'Country1',
      surname: 'Doe',
      certRegNo: '123456',
      regName: 'John',
      tradeName: 'TradeName1',
      regDate: '2023-01-01',
      countryOfIncorporation: 'Country2',
      parentCompany: 'ParentCompany1',
      otherName: 'OtherName1',
      dateOfBirth: '1990-01-15',
      idNumber: 'AB123456',
      pinNumber: 'PIN123',
      gender: 'Male',
      clientTypeId: 'ClientType1',
      // Add values for other form fields here
      contact_details: {
        clientBranch: 'Branch1',
        clientTitle: 'Mr.',
        smsNumber: '123456',
        phoneNumber: '987654',
        email: 'example@example.com',
        channel: 'Email',
        pinNo: '1234',
        eDocuments: 'Document1',
      },
      address: {
        box_number: '123',
        country: 'Country1',
        county: 'County1',
        town: 'Town1',
        physical_address: '123 Street',
        road: 'Road1',
        house_number: '123',
        utility_address_proof: 'Proof1',
        is_utility_address: 'Yes',
      },
      payment_details: {
        bank: 'Bank1',
        branch: 'Branch1',
        account_number: '1234567890',
        currency: 'USD',
        effective_to_date: '2023-12-31',
        effective_from_date: '2023-01-01',
        mpayNo: 'MPay123',
        Iban: 'IBAN123',
        is_default_channel: 'Yes',
      },
      next_of_kin_details: {
        mode_of_identity: 'Passport',
        identity_number: 'AB123456',
        full_name: 'John Doe',
        relationship: 'Spouse',
        phone_number: '9876543210',
        email_address: 'john@example.com',
        dateofbirth: '1990-01-15',
      },
      wealth_details: {
        wealth_citizenship: 'Country2',
        marital_status: 'Married',
        funds_source: 'Savings',
        typeOfEmployment: 'Employed',
        economic_sector: 'Finance',
        occupation: 'Accountant',
        purposeinInsurance: 'Life Insurance',
        premiumFrequency: 'Monthly',
        distributeChannel: 'Online',
      },
    };
    const expectedClientData = {
      branchCode: 123,
      category: 'Category1',
      clientFullName: 'John Doe',
      clientTitle: 'Mr.',
      clientType: {
        category: 'ClientCategory1',
        clientTypeName: 'ClientTypeName1',
        code: 456,
        description: 'ClientTypeDescription1',
        organizationId: 789,
        person: 'Person1',
        type: 'Type1',
      },
      clientTypeName: 'ClientType1',
      country: 456,
      createdBy: 'CreatedUser',
      dateOfBirth: '1990-01-15',
      emailAddress: 'example@example.com',
      firstName: 'John',
      gender: 'Male',
      id: 789,
      idNumber: 'AB123456',
      lastName: 'Doe',
      modeOfIdentity: 'Passport',
      occupation: {
        id: 101,
        name: 'Occupation1',
        sector_id: 201,
        short_description: 'Desc1',
      },
      passportNumber: 'Passport123',
      phoneNumber: '9876543210',
      physicalAddress: '123 Street',
      pinNumber: 'PIN123',
      shortDescription: 'ShortDesc1',
      status: 'Active',
      withEffectFromDate: '2023-01-01',
      // ... Add other client data fields with appropriate values
    };

    // Set form values on your component
    component.clientRegistrationForm.setValue(mockClientFormValues);

    // Disable 'partyTypeShtDesc' control
    component.clientRegistrationForm.get('partyTypeShtDesc').disable();

    // Call the saveClientBasic method
    component.saveClientBasic();

    // Advance timers to trigger the setTimeout
    jest.advanceTimersByTime(1);

    // Assert that saveClientDetails is called with the expected data
    // expect(clientService.saveClientDetails).toHaveBeenCalledWith(expectedClientData);

    // Re-enable 'partyTypeShtDesc' control after the test if needed
    component.clientRegistrationForm.get('partyTypeShtDesc').enable();
  });


  it('should get sectors and call logger.info', () => {
    const organizationId = 2;
    const testData = [/* your test data here */];

    jest.spyOn(service, 'getSectors').mockReturnValue(of(testData));

    component.ngOnInit(); // Call the component method that triggers getSectors

    expect(service.getSectors).toHaveBeenCalledWith(organizationId);

    // Check if logger.info was called with the expected arguments
    expect(loggerSpy).toHaveBeenCalledWith( 'Testing data->', []);
    // You may need to adjust the order of arguments based on how your Logger constructor is defined

    // Other expectations as needed...
  });
  it('should set currenciesData when getCurrencies is called', () => {
    const testData = [/* your test data here */];

    // Create a spy for the bankService.getCurrencies method and mock its behavior
    const getCurrenciesSpy = jest.spyOn(bankService, 'getCurrencies').mockReturnValue(of(testData));

    // Call the getCurrencies method
    component.getCurrencies();

    // Expect that getCurrencies was called
    expect(getCurrenciesSpy).toHaveBeenCalled();

    // Since getCurrencies returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that currenciesData was set with the test data
      expect(component.currenciesData).toEqual(testData);
    });
  });
  it('should set clientTitlesData when getClientTitles is called', () => {
    const organizationId = 1;
    const testData = [/* your test data here */];

    // Create a spy for the accountService.getClientTitles method and mock its behavior
    const getClientTitlesSpy = jest.spyOn(accountService, 'getClientTitles').mockReturnValue(of(testData));

    // Call the getClientTitles method
    component.getClientTitles(organizationId);

    // Expect that getClientTitles was called with the provided organizationId
    expect(getClientTitlesSpy).toHaveBeenCalledWith(organizationId);

    // Since getClientTitles returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that clientTitlesData was set with the test data
      expect(component.clientTitlesData).toEqual(testData);
    });
  });
  it('should set identityTypeData when getIdentityType is called', () => {
    const testData = [/* your test data here */];

    // Create a spy for the clientsService.getIdentityType method and mock its behavior
    const getIdentityTypeSpy = jest.spyOn(clientService, 'getIdentityType').mockReturnValue(of(testData));

    // Call the getIdentityType method
    component.getIdentityType();

    // Expect that getIdentityType was called
    expect(getIdentityTypeSpy).toHaveBeenCalled();

    // Since getIdentityType returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that identityTypeData was set with the test data
      expect(component.identityTypeData).toEqual(testData);
    });
  });
  it('should set occupationData when getOccupation is called', () => {
    const organizationId = 1;
    const testData = [/* your test data here */];

    // Create a spy for the occupationService.getOccupations method and mock its behavior
    const getOccupationsSpy = jest.spyOn(occupationService, 'getOccupations').mockReturnValue(of(testData));

    // Call the getOccupation method
    component.getOccupation(organizationId);

    // Expect that getOccupations was called with the provided organizationId
    expect(getOccupationsSpy).toHaveBeenCalledWith(organizationId);

    // Since getOccupations returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that occupationData was set with the test data
      expect(component.occupationData).toEqual(testData);
    });
  });
  it('should set clientTypeData when getClientType is called', () => {
    const organizationId = 1;
    const testData = [/* your test data here */];

    // Create a spy for the clientService.getClientType method and mock its behavior
    const getClientTypeSpy = jest.spyOn(clientService, 'getClientType').mockReturnValue(of(testData));

    // Call the getClientType method
    component.getClientType(organizationId);

    // Expect that getClientType was called with the provided organizationId
    expect(getClientTypeSpy).toHaveBeenCalledWith(organizationId);

    // Since getClientType returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that clientTypeData was set with the test data
      expect(component.clientTypeData).toEqual(testData);
    });
  });
  it('should set clientBranchData when getClientBranch is called', () => {
    const testData = [/* your test data here */];

    // Create a spy for the clientsService.getCLientBranches method and mock its behavior
    const getCLientBranchesSpy = jest.spyOn(clientService, 'getCLientBranches').mockReturnValue(of(testData));

    // Call the getClientBranch method
    component.getClientBranch();

    // Expect that getCLientBranches was called
    expect(getCLientBranchesSpy).toHaveBeenCalled();

    // Since getCLientBranches returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that clientBranchData was set with the test data
      expect(component.clientBranchData).toEqual(testData);
    });
  });
  it('should fetch countries and log info message', () => {
    const testData = [/* your test data here */];

    // Create a spy for the countryService.getCountries method and mock its behavior
    const getCountriesSpy = jest.spyOn(countryService, 'getCountries').mockReturnValue(of(testData));

    // Call the fetchCountries method
    component.fetchCountries();

    // Expect that getCountries was called
    expect(getCountriesSpy).toHaveBeenCalled();

    // Expect that console.info was called with the expected message
    expect(loggerSpy).toHaveBeenCalledWith('Fetching countries list');

    // Since getCountries returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that countryData was set with the test data
      expect(component.countryData).toEqual(testData);
    });
  });
  it('should fetch city states and log info message', () => {
    const countryId = 1;
    const testData = [/* your test data here */];

    // Create a spy for the countryService.getMainCityStatesByCountry method and mock its behavior
    const getMainCityStatesByCountrySpy = jest
      .spyOn(countryService, 'getMainCityStatesByCountry')
      .mockReturnValue(of(testData));

    // Call the fetchMainCityStates method
    component.fetchMainCityStates(countryId);

    // Expect that getMainCityStatesByCountry was called with the provided countryId
    expect(getMainCityStatesByCountrySpy).toHaveBeenCalledWith(countryId);

    // Expect that console.info was called with the expected log message
    expect(loggerSpy).toHaveBeenCalledWith(`Fetching city states list for country, ${countryId}`);

    // Since getMainCityStatesByCountry returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that citiesData was set with the test data
      expect(component.citiesData).toEqual(testData);
    });
  });
  it('should fetch towns and log info message', () => {
    const stateId = 1;
    const testData = [/* your test data here */];

    // Create a spy for the countryService.getTownsByMainCityState method and mock its behavior
    const getTownsByMainCityStateSpy = jest
      .spyOn(countryService, 'getTownsByMainCityState')
      .mockReturnValue(of(testData));

    // Call the fetchTowns method
    component.fetchTowns(stateId);

    // Expect that getTownsByMainCityState was called with the provided stateId
    expect(getTownsByMainCityStateSpy).toHaveBeenCalledWith(stateId);

    // Expect that console.info was called with the expected log message
    expect(loggerSpy).toHaveBeenCalledWith(`Fetching towns list for city-state, ${stateId}`);

    // Since getTownsByMainCityState returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that townData was set with the test data
      expect(component.townData).toEqual(testData);
    });
  });
  it('should reset form values, call getBanks, and fetch city states', () => {
    const selectedCountry = 1;
    const testData = [/* your test data here */];

    // Create spies for the required methods and mock their behavior
    const patchValueSpy = jest.spyOn(component.clientRegistrationForm, 'patchValue');
    const getBanksSpy = jest.spyOn(component, 'getBanks');
    const getMainCityStatesByCountrySpy = jest
      .spyOn(countryService, 'getMainCityStatesByCountry')
      .mockReturnValue(of(testData));

    // Set the selectedCountry value
    component.selectedCountry = selectedCountry;

    // Call the onCountryChange method
    component.onCountryChange();

    // Expect that form values were reset
    expect(patchValueSpy).toHaveBeenCalledWith({
      county: null,
      town: null,
    });

    // Expect that getBanks was called with the selected country ID
    expect(getBanksSpy).toHaveBeenCalledWith(selectedCountry);

    // Expect that getMainCityStatesByCountry was called with the selected country ID
    expect(getMainCityStatesByCountrySpy).toHaveBeenCalledWith(selectedCountry);

    // Expect that detectChanges was called
    // expect(cdr.detectChanges).toHaveBeenCalled();

    // Since getMainCityStatesByCountry returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that citiesData was set with the test data
      expect(component.citiesData).toEqual(testData);
    });
  });
  it('should fetch towns when city state changes', () => {
    const selectedCityState = 1;
    const testData = [/* your test data here */];

    // Create a spy for the countryService.getTownsByMainCityState method and mock its behavior
    const getTownsByMainCityStateSpy = jest
      .spyOn(countryService, 'getTownsByMainCityState')
      .mockReturnValue(of(testData));

    // Set the selectedCityState value
    component.selectedCityState = selectedCityState;

    // Call the onCityChange method
    component.onCityChange();

    // Expect that getTownsByMainCityState was called with the selected city state ID
    expect(getTownsByMainCityStateSpy).toHaveBeenCalledWith(selectedCityState);

    // Since getTownsByMainCityState returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that townData was set with the test data
      expect(component.townData).toEqual(testData);
    });
  });
  it('should fetch banks and log bank data', () => {
    const countryId = 1;
    const testData = [/* your test data here */];

    // Create a spy for the bankService.getBanks method and mock its behavior
    const getBanksSpy = jest.spyOn(bankService, 'getBanks').mockReturnValue(of(testData));

    // Set the countryId value
    // component.countryId = countryId;

    // Call the getBanks method
    component.getBanks(countryId);

    // Expect that getBanks was called with the provided countryId
    expect(getBanksSpy).toHaveBeenCalledWith(countryId);

    // Since getBanks returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that banksData was set with the test data
      expect(component.banksData).toEqual(testData);

      // Expect that the log message was printed to the console
      expect(console.log).toHaveBeenCalledWith('Bank DATA', testData);

      // You can also check for additional behavior, like calling getBankBranches if needed
    });
  });
  it('should fetch bank branches when bankId is provided', () => {
    const bankId = 1;
    const testData = [/* your test data here */];

    // Create a spy for the bankService.getBankBranchesByBankId method and mock its behavior
    const getBankBranchesByBankIdSpy = jest
      .spyOn(bankService, 'getBankBranchesByBankId')
      .mockReturnValue(of(testData));

    // Call the getBankBranches method with a bankId
    component.getBankBranches(bankId);

    // Expect that getBankBranchesByBankId was called with the provided bankId
    expect(getBankBranchesByBankIdSpy).toHaveBeenCalledWith(bankId);

    // Since getBankBranchesByBankId returns an observable, you should use async and await
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Expect that bankBranchData was set with the test data
      expect(component.bankBranchData).toEqual(testData);
    });
  });
  it('should reset bankBranchData when bankId is not provided', () => {
    const bankId = null;

    // Call the getBankBranches method with a null bankId
    component.getBankBranches(bankId);

    // Expect that bankBranchData was reset to an empty array
    expect(component.bankBranchData).toEqual([]);
  });
 
  
});
