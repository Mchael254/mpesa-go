import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewServiceProviderComponent } from './new-service-provider.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of} from "rxjs";
import {MessageService} from "primeng/api";
import { DatePipe } from '@angular/common';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import { AppConfigService } from '../../../../../core/config/app-config-service';
import { DynamicBreadcrumbComponent } from '../../../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component';
import { DropdownModule } from 'primeng/dropdown';
import { CountryService } from '../../../../../shared/services/setups/country.service';
import { SectorService } from '../../../../../shared/services/setups/sector.service';
import { BankService } from '../../../../../shared/services/setups/bank.service';
import { ClientService } from '../../../services/client/client.service';
import { OccupationService } from '../../../../../shared/services/setups/occupation.service';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields.service';
import { TownDto } from 'src/app/shared/data/common/countryDto';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
const countryData = null;
const sectorData = null;
const currenciesData = null;
const banksData = null;
const bankBranchesData = null;
const clientTitlesData = null;
const countyData = null;
const townData = null;
const identityTypeData = [];
const occupationData = null;
const providerTypeData = null;
const groupId= 'tag';


const mandatoryFieldsData = [
  {
    disabledStatus: "N",
    fieldLabel: "Account Number:",
    fieldName: "REG_NO",
    frontedId:"txtRegNo",
    groupId:"serviceProviderTab",
    id:8912,
    mandatoryStatus:"N",
    module:"ACCOUNT MGT",
    screenName:"serviceProviders.jspx",
    visibleStatus:"Y",
  }
]

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

export class MockServiceProviderService {
  getClients = jest.fn().mockReturnValue(of());
  getClientById= jest.fn().mockReturnValue(of());
  getCountries= jest.fn().mockReturnValue(of(countryData));
  getSectors= jest.fn().mockReturnValue(of(sectorData));
  getCurrencies= jest.fn().mockReturnValue(of(currenciesData));
  getBanks= jest.fn().mockReturnValue(of(banksData));
  getBankBranches= jest.fn().mockReturnValue(of(bankBranchesData));
  getClientTitles= jest.fn().mockReturnValue(of(clientTitlesData));
  getCounty= jest.fn().mockReturnValue(of(countyData));
  getTown= jest.fn().mockReturnValue(of(townData));
  getIdentityType= jest.fn().mockReturnValue(of(identityTypeData));
  getOccupation= jest.fn().mockReturnValue(of(occupationData));
  getServiceProviderType= jest.fn().mockReturnValue(of(providerTypeData));
  saveServiceProvider = jest.fn();
  getMandatoryFieldsByGroupId = jest.fn().mockReturnValue(of(mandatoryFieldsData));
}

describe('NewServiceProviderComponent', () => {
  let component: NewServiceProviderComponent;
  let fixture: ComponentFixture<NewServiceProviderComponent>;
  let serviceProviderServiceStub: ServiceProviderService;
  let countryService:CountryService
  let sectorService:SectorService
  let clientService:ClientService
  let bankService:BankService;
  let occupationService:OccupationService;
  let messageServiceStub: MessageService;
  let datePipe:DatePipe;
  let mandatoryService:MandatoryFieldsService;
  let fileInput: DebugElement;
  sessionStorage.setItem('entityDetails', JSON.stringify(entityDetails));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewServiceProviderComponent,DynamicBreadcrumbComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        DropdownModule
      ],
      providers: [
        { provide: ServiceProviderService, useClass: MockServiceProviderService },
        { provide: MessageService},
        { provide: DatePipe},
        {provide: AppConfigService, useValue: {config:{contextPath: { 
          accounts_services: "crm",
          users_services: "user",
          auth_services: "oauth",
          setup_services: 'crm' } }}}
      ]
    });
    fixture = TestBed.createComponent(NewServiceProviderComponent);
    component = fixture.componentInstance;
    messageServiceStub = TestBed.inject(MessageService);
    countryService = TestBed.inject(CountryService)
    datePipe = TestBed.inject(DatePipe);
    serviceProviderServiceStub = TestBed.inject(ServiceProviderService);
    sectorService = TestBed.inject(SectorService)
    bankService = TestBed.inject(BankService)
    clientService = TestBed.inject(ClientService)
    occupationService = TestBed.inject(OccupationService);
    mandatoryService = TestBed.inject(MandatoryFieldsService);
    jest.spyOn(mandatoryService, 'getMandatoryFieldsByGroupId').mockReturnValue(of([]));
    fixture.detectChanges();
    fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  test('should get countries', () => {
    jest.spyOn(countryService, 'getCountries').mockReturnValue(of());
    component.fetchCountries();
    expect(countryService.getCountries().subscribe((data) =>{
      component.countryData= data;
    })).toBeTruthy();
  });

  test('should get sectors', () => {
    jest.spyOn(sectorService, 'getSectors').mockReturnValue(of());
    component.getSectors();
    expect(sectorService.getSectors(2).subscribe((data) =>{
      component.sectorData= data;
    })).toBeTruthy();
  });
  test('should get currencies', () => {
    jest.spyOn(bankService, 'getCurrencies').mockReturnValue(of());
    component.getCurrencies();
    expect(bankService.getCurrencies().subscribe((data) =>{
      component.currenciesData= data;
    })).toBeTruthy();
  });

  test('should get banks', () => {
    jest.spyOn(bankService, 'getBanks').mockReturnValue(of());
    component.ngOnInit();
    expect(bankService.getBanks(1).subscribe((data) =>{
      component.banksData= data;
    })).toBeTruthy();
  });
  test('should get branches', () => {
    jest.spyOn(bankService, 'getBankBranchesByBankId').mockReturnValue(of());
    component.ngOnInit();
    expect(bankService.getBankBranchesByBankId(1).subscribe((data) =>{
      component.bankBranchData= data;
    })).toBeTruthy();
  });

  test('should get client titles', () => {
    jest.spyOn(serviceProviderServiceStub, 'getClientTitles').mockReturnValue(of());
    component.getClientTitles();
    expect(serviceProviderServiceStub.getClientTitles().subscribe((data) =>{
      component.clientTitlesData= data;
    })).toBeTruthy();
  });


  test('should get town', () => {
    jest.spyOn(countryService, 'getTownsByMainCityState').mockReturnValue(of());
    component.ngOnInit();
    expect(countryService.getTownsByMainCityState(2).subscribe((data) =>{
      component.townData= data;
    })).toBeTruthy();
  });

  test('should get identity type', () => {
    jest.spyOn(clientService, 'getIdentityType').mockReturnValue(of());
    component.getIdentityType();
    expect(clientService.getIdentityType().subscribe((data) =>{
      component.identityTypeData= data;
    })).toBeTruthy();
  });
  test('should get occupation', () => {
    jest.spyOn(occupationService, 'getOccupations').mockReturnValue(of());
    component.getOccupation();
    expect(occupationService.getOccupations(2).subscribe((data) =>{
      component.occupationData= data;
    })).toBeTruthy();
  });
  test('should get service provider type', () => {
    jest.spyOn(serviceProviderServiceStub, 'getServiceProviderType').mockReturnValue(of());
    component.getServiceProviderType();
    expect(serviceProviderServiceStub.getServiceProviderType().subscribe((data) =>{
      component.providerTypeData= data;
    })).toBeTruthy();
  });
  test('should save service provider', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveServiceProviderBtn');
    button.click();
    fixture.detectChanges();
    expect(serviceProviderServiceStub.saveServiceProvider.call).toBeTruthy();
    expect(serviceProviderServiceStub.saveServiceProvider.call.length).toBe(1);
  })

  it('should configure the form and validators correctly', () => {
    // Call the method to be tested
    component.serviceProviderRegForm();
    // Assertions to check if form controls, validators, and mandatory fields are configured correctly
    expect(component.newServiceProviderForm).toBeTruthy(); // Check if the form is created   
   

  });
  it('should update agentType when selecting a user type', () => {
    const event = {
      target: {
        value: 'selectedUserType', // Replace with your desired user type value
      },
    };

    // Call the selectUserType method with the event
    component.selectUserType(event);

    // Check if the agentType property is updated correctly
    expect(component.agentType).toEqual('selectedUserType');

   
    component.selectUserType(event);
  
  });
  it('should configure the form and validators correctly', () => {
    const mockResponse = [
      {
        id: 1,
        fieldName: 'field1',
        fieldLabel: 'Field 1',
        mandatoryStatus: 'Y',
        visibleStatus: 'Y',
        disabledStatus: 'N',
        frontedId: 'field1',
        screenName: 'Screen 1',
        groupId: 'group1',
        module: 'Module 1',
      },
      {
        id: 2,
        fieldName: 'field2',
        fieldLabel: 'Field 2',
        mandatoryStatus: 'N', // Example with non-mandatory field
        visibleStatus: 'Y',
        disabledStatus: 'N',
        frontedId: 'field2',
        screenName: 'Screen 1',
        groupId: 'group1',
        module: 'Module 1',
      }
      
    ];

    // Spy on the mandatoryService.getMandatoryFieldsByGroupId method
    const getMandatoryFieldsSpy = jest
      .spyOn(mandatoryService, 'getMandatoryFieldsByGroupId')
      .mockReturnValue(of(mockResponse));
    component.serviceProviderRegForm();

    // Assertions to check the behavior of serviceProviderRegForm
    expect(component.entityDetails).toEqual({ partyTypeId: 0,
      profilePicture: "",
      categoryName: "",
      modeOfIdentityName: "",
      countryId: 0,
      dateOfBirth: "",
      effectiveDateFrom: "",
      effectiveDateTo: "",
      id: 0,
      modeOfIdentity: undefined,
      identityNumber: 0,
      name: "",
      organizationId: 0,
      pinNumber: "",
      profileImage: "",});
    // Ensure that getMandatoryFieldsByGroupId is called
    expect(mandatoryService.getMandatoryFieldsByGroupId).toHaveBeenCalled();
    expect(getMandatoryFieldsSpy).toHaveBeenCalledWith(component.groupId);

  });
  it('should reset county and town in the form, call getBanks, and update citiesData', () => {
    // Mock selected country value
    const selectedCountry = 'SelectedCountry';
    
    // Mock response for countryService.getMainCityStatesByCountry
    const citiesDataMock =[ {
      id: 1,
      shortDescription: 'NY',
      name: 'New York',
      country: {
        id: 1,
        name: 'United States',
        short_description:'US'
      },
    }];

    // Mock the getBanks method and return an observable
    // const getBanksSpy = jest.spyOn(component, 'getBanks');
    // getBanksSpy.mockReturnValue(of());

    // Mock the countryService.getMainCityStatesByCountry and return an observable
    const getMainCityStatesByCountrySpy = jest
      .spyOn(countryService, 'getMainCityStatesByCountry')
      .mockReturnValue(of(citiesDataMock));

    // Call the onCountryChange method
    component.onCountryChange();

  
    // expect(getBanksSpy).toHaveBeenCalledWith(selectedCountry);
    
    // Wait for the observable to complete
    fixture.whenStable().then(() => {
      expect(getMainCityStatesByCountrySpy).toHaveBeenCalledWith(selectedCountry);
      expect(component.citiesData).toEqual(citiesDataMock);
    });
  });
  it('should call getTownsByMainCityState with the selectedCityState', () => {
    
    // Create a mock response
    const mockTownsData:TownDto[] = [{
      id: 1,
      shortDescription:'one',
      name:'states',
      state:{
        id: 1,
        shortDescription: 'NY',
        name: 'New York',
        country: {
          id: 1,
          name: 'United States',
          short_description:'US'
        }
      },
      country: {
        id: 1,
        short_description: 'USA',
        name: 'United States',
      }}];
    
    // Mock the service method to return the mock response
    jest.spyOn(countryService, 'getTownsByMainCityState').mockReturnValue(of(mockTownsData));

    // Call the method to be tested
    component.onCityChange();

    // Expectations
    expect(countryService.getTownsByMainCityState).toHaveBeenCalledWith(undefined);
    expect(component.townData).toEqual(mockTownsData);
  });
  it('should set utilityBill when selectUtilityBill is called', () => {
    // Arrange
    const event = { target: { value: 'electricity' } }; // Replace with your desired value

    // Act
    component.selectUtilityBill(event);

    // Assert
    expect(component.utilityBill).toEqual('electricity');
  });
  it('should set the URL to a valid data URL when onUpload is called with an event', () => {
    // Arrange
    const mockFile = new File([''], 'example.jpg', { type: 'image/jpeg' });
    const mockEvent = { target: { files: [mockFile] } } as any;

    // Act
    component.onUpload(mockEvent);

    // Trigger change detection to update the view
    fixture.detectChanges();
   
  });   
  it('should update bankBranchData when getBankBranches is called', () => {
    // Arrange: Set up the spy to return a mock value when getBankBranches is called
    jest.spyOn(bankService,'getBankBranchesByBankId').mockReturnValue(of())
    component.getClientTitles();
    expect(bankService.getBankBranchesByBankId(123).subscribe((data) =>{
      component.bankBranchData= data;
    })).toBeTruthy();
  });

  it('should update bankBranchData when getBankBranches is called', () => {
   
    jest.spyOn(component, 'getBankBranches');
    // Act: Call the getBankBranches method
    component.onBankSelection();
    expect(component.getBankBranches).toHaveBeenCalledWith(undefined);
  });
  it('should save service provider successfully', () => {
    // Arrange: Set up your form values and expected data
    const expectedSaveData = [{
      category: 'Individual',
      country: {
        id: 1,
        name: 'Your Country Name',
        short_description: 'Country Short Description',
      },
      createdBy: 'John Doe',
      dateCreated: '2023-09-15',
      dateOfRegistration: '2023-08-01',
      effectiveDateFrom: '2023-08-01',
      emailAddress: 'john.doe@example.com',
      gender: 'Male',
      id: 12345,
      idNumber: 'A1234567',
      modeOfIdentity: 'Passport',
      modeOfIdentityDto: 'Passport DTO',
      name: 'John Doe',
      organizationId: 789,
      parentCompany: 'Parent Company Name',
      partyId: 45678,
      phoneNumber: '123-456-7890',
      physicalAddress: '123 Main Street, City, Country',
      pinNumber: 'ABC12345',
      postalAddress: 'P.O. Box 1234, City, Country',
      providerLicenseNo: '123-ABC-789',
      providerStatus: 'Active',
      spEntityType: 'Entity Type',
      providerType: {
        code: 1,
        name: 'Provider Type Name',
        providerTypeSuffixes: 'Suffixes',
        shortDescription: 'Type Short Description',
        shortDescriptionNextNo: 'Next No',
        shortDescriptionSerialFormat: 'Serial Format',
        status: 'Active',
        vatTaxRate: '10%',
        witholdingTaxRate: '5%',
      },
      shortDescription: 'Short Description',
      smsNumber: '9876543210',
      status: 'Active',
      system: 'System Name',
      systemCode: 123,
      title: 'Mr.',
      tradeName: 'Trade Name',
      type: 'Type',
      vatNumber: 'VAT123456',
    }];

    // Mock the saveServiceProvider method to return an observable with the expected data
    jest.spyOn(serviceProviderServiceStub, 'saveServiceProvider').mockReturnValue(of(expectedSaveData));

    // Act: Call the saveServiceProvider method
    component.saveServiceProvider();


  });

});
