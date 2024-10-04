import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsComponent } from './campaigns.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../../../shared/shared.module";
import {CampaignsService} from "../../services/campaigns..service";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {OrganizationService} from "../../services/organization.service";
import {CurrencyService} from "../../../../shared/services/setups/currency/currency.service";
import {StaffService} from "../../../entities/services/staff/staff.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {of, throwError} from "rxjs";
import {CampaignsDTO} from "../../data/campaignsDTO";
import {NgxSpinnerService} from "ngx-spinner";
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {OrganizationDTO} from "../../data/organization-dto";
import {CurrencyDTO} from "../../../../shared/data/common/currency-dto";
import {StaffDto} from "../../../entities/data/StaffDto";
import {Pagination} from "../../../../shared/data/common/pagination";
import {CampaignDefinitionComponent} from "./campaign-definition/campaign-definition.component";

const mockCampaignData: CampaignsDTO =
  {
    "actualResponseCount": 0, "actualRoi": 0, "actualSalesCount": 0, "campaignName": "", "campaignType": "", "cmpActlCost": 0, "cmpBgtCost": 0,
    "cmpDate": "", "cmpExptRevenue": 0, "cmpNumSent": "", "code": 0, "currencies": 0, "description": "", "eventTime": "", "events": "",
    "expectCloseDate": "", "expectedCost": 0, "expectedResponseCount": 0, "expectedRoi": 0, "expectedSalesCount": 0, "impressionCount": 0,
    "objective": "", "organization": 0, "product": 0, "sponsor": "", "status": "", "system": 0, "targetAudience": "", "targetSize": 0,
    "teamLeader": 0, "user": 0, "venue": ""
  }

const system: SystemsDto = {
  "id": 1,
  "shortDesc": "Sample Short Description",
  "systemName": "Sample System Name"
}

const organization: OrganizationDTO = {
  address: {
    box_number: "",
    country_id: 0,
    estate: "",
    fax: "",
    house_number: "",
    id: 0,
    is_utility_address: "",
    phone_number: "",
    physical_address: "",
    postal_code: "",
    residential_address: "",
    road: "",
    state_id: 0,
    town_id: 0,
    utility_address_proof: "",
    zip: ""
  },
  bankBranchId: 0,
  bankId: 0,
  bank_account_name: "",
  bank_account_number: "",
  country: undefined,
  currency_id: 0,
  customer_care_email: "",
  customer_care_name: "",
  customer_care_primary_phone_number: 0,
  customer_care_secondary_phone_number: 0,
  emailAddress: "",
  faxNumber: "",
  groupId: 0,
  id: 0,
  license_number: "",
  manager: 0,
  motto: "",
  name: "",
  organizationGroupLogo: "",
  organizationLogo: "",
  organization_type: "",
  paybill: 0,
  physicalAddress: "",
  pin_number: "",
  postalAddress: 0,
  postalCode: "",
  primaryTelephoneNo: "",
  primarymobileNumber: "",
  registrationNo: "",
  secondaryMobileNumber: "",
  secondaryTelephoneNo: "",
  short_description: "",
  state: {country: undefined, id: 0, name: "", shortDescription: ""},
  swiftCode: "",
  town: {country: "", id: 0, name: "", shortDescription: "", state: ""},
  vatNumber: "",
  webAddress: ""
}

const currency: CurrencyDTO = {
  decimalWord: "", id: 0, name: "", numberWord: "", roundingOff: 0, symbol: ""
}

const staff: Pagination<StaffDto>  = {
  content: [], first: false, last: false, number: 0, numberOfElements: 0, size: 0, totalElements: 0, totalPages: 0,
}

export class MockCampaignService {
  getCampaigns = jest.fn().mockReturnValue(of());
  deleteCampaign = jest.fn().mockReturnValue(of());
}

export class MockSystemsService {
  getSystems = jest.fn().mockReturnValue(of());
}

export class MockOrganizationService {
  getOrganization = jest.fn().mockReturnValue(of());
}

export class MockCurrencyService {
  getCurrencies = jest.fn().mockReturnValue(of());
}

export class MockStaffService {
  getStaff = jest.fn().mockReturnValue(of());
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('CampaignsComponent', () => {
  let component: CampaignsComponent;
  let fixture: ComponentFixture<CampaignsComponent>;
  let campaignsServiceStub: CampaignsService;
  let systemsServiceStub: SystemsService;
  let organizationServiceStub: OrganizationService;
  let currencyServiceStub: CurrencyService;
  let staffServiceStub: StaffService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let loggerSpy: jest.SpyInstance;
  let mockSpinnerService: NgxSpinnerService;
  let mockCdr: ChangeDetectorRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignsComponent, CampaignDefinitionComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        { provide: CampaignsService, useClass: MockCampaignService },
        { provide: SystemsService, useClass: MockSystemsService },
        { provide: OrganizationService, useClass: MockOrganizationService },
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: StaffService, useClass: MockStaffService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: NgxSpinnerService },
        { provide: ChangeDetectorRef }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(CampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    campaignsServiceStub = TestBed.inject(CampaignsService);
    staffServiceStub = TestBed.inject(StaffService);
    currencyServiceStub = TestBed.inject(CurrencyService);
    organizationServiceStub = TestBed.inject(OrganizationService);
    systemsServiceStub = TestBed.inject(SystemsService);
    mockSpinnerService = TestBed.inject(NgxSpinnerService);
    mockCdr = TestBed.inject(ChangeDetectorRef);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    component.campaignsTable = { filterGlobal: jest.fn() } as any;
    component.campaignDefinitionComp = { editCampaign: jest.fn() } as unknown as CampaignDefinitionComponent;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch campaigns data', () => {
    jest.spyOn(campaignsServiceStub, 'getCampaigns');
    component.fetchCampaigns();
    expect(campaignsServiceStub.getCampaigns).toHaveBeenCalled();
    expect(component.campaignData).toEqual(undefined);
  });

  /*test('should aggregate campaigns data when campaign.length is greater than 0', () => {

    const staff = {
      totalElements: 2, // Set the desired value for testing
      content: [
        { id: 1, username: 'user1', departmentCode: 1 },
        { id: 2, username: 'user2', departmentCode: 2 },
      ],
    };

    const currencies = [
      { id: 1, transactionData: 'KSH' },
      { id: 2, transactionData: 'Dollar' },
    ];

    const organizations = [
      { id: 1, departmentName: 'Org 1' },
      { id: 2, departmentName: 'Org 2' },
    ];

    const systems = [
      { id: 1, departmentName: 'Department 1' },
      { id: 2, departmentName: 'Department 2' },
    ];

    const campaigns = [
      { id: 1, departmentName: 'Department 1', user: 1, currencies: 1, organization: 1, system: 1 },
      { id: 2, departmentName: 'Department 2', user: 2, currencies: 2, organization: 2, system: 2 },
    ];

    component.getGrpCampaignsData();

    const aggregatedData = [{campaigns, staff, organizations, currencies, systems}];

    // Verify that the aggregated data contains the expected information
    expect(aggregatedData).toEqual([
      {
        campaign: { id: 1, departmentName: 'Department 1', user: 1, currencies: 1, organization: 1, system: 1 },
        staffs: { id: 1, username: 'user1', departmentCode: 1 },
        system: { id: 1, departmentName: 'Department 1' },
        organization: { id: 1, departmentName: 'Org 1' },
        currency: { id: 1, transactionData: 'KSH' },
      },
      {
        campaign: { id: 2, departmentName: 'Department 2', user: 2, currencies: 2, organization: 2, system: 2 },
        staffs: { id: 2, username: 'user2', departmentCode: 2 },
        system: { id: 2, departmentName: 'Department 2' },
        organization: { id: 2, departmentName: 'Org 2' },
        currency: { id: 2, transactionData: 'Dollar' },
      },
    ]);
  });*/
  test('should fetch campaigns and aggregate data successfully', () => {

    jest.spyOn(campaignsServiceStub, 'getCampaigns').mockReturnValue(of([mockCampaignData]));
    jest.spyOn(staffServiceStub, 'getStaff').mockReturnValue(of(staff));
    jest.spyOn(currencyServiceStub, 'getCurrencies').mockReturnValue(of([currency]));
    jest.spyOn(organizationServiceStub, 'getOrganization').mockReturnValue(of([organization]));
    jest.spyOn(systemsServiceStub, 'getSystems').mockReturnValue(of([system]));

    component.getGrpCampaignsData();
    fixture.detectChanges();

    expect(campaignsServiceStub.getCampaigns).toHaveBeenCalled();
    expect(staffServiceStub.getStaff).toHaveBeenCalledWith(0, 200, null, 'dateCreated', 'desc', null);
    expect(currencyServiceStub.getCurrencies).toHaveBeenCalled();
    expect(organizationServiceStub.getOrganization).toHaveBeenCalled();
    expect(systemsServiceStub.getSystems).toHaveBeenCalled();

    expect(component.aggregatedCampaignsData.content.length).toBe(1);
    expect(component.aggregatedCampaignsData.content[0].campaign).toEqual(mockCampaignData);
    expect(component.aggregatedCampaignsData.content[0].staffs).toEqual([staff.content[0]]);
    expect(component.aggregatedCampaignsData.content[0].currency).toEqual(currency);
    expect(component.aggregatedCampaignsData.content[0].organization).toEqual(organization);
    expect(component.aggregatedCampaignsData.content[0].system).toEqual(system[0]);
  });

  test('should display error message on failure', () => {
    const mockError = { error: { message: 'Some error occurred' } };

    jest.spyOn(campaignsServiceStub, 'getCampaigns').mockReturnValue(throwError(mockError));

    component.getGrpCampaignsData();

    expect(globalMessagingServiceStub.displayErrorMessage).toHaveBeenCalledWith('Error', 'Some error occurred');
  });

  test('should select a campaign on onCampaignSelect', () => {
    const selectedCampaign = mockCampaignData[0];
    component.onCampaignSelect(selectedCampaign);
    expect(component.selectedCampaign).toEqual(selectedCampaign);
  });

  test('should show the campaign confirmation modal when deleteCampaign is called', () => {
    const spyDeleteCampaign = jest.spyOn(component, 'deleteCampaign');
    component.deleteCampaign();

    expect(spyDeleteCampaign).toHaveBeenCalled();
    expect(component.campaignConfirmationModal.show).toBeTruthy;
  });

  test('should confirm campaign deletion when a campaign is selected', () => {
    component.selectedCampaign = mockCampaignData;
    const selectedCamaignId = mockCampaignData.code;

    jest.spyOn(campaignsServiceStub, 'deleteCampaign');
    jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    const spyDeleteCampaign = jest.spyOn(component, 'deleteCampaign');
    component.deleteCampaign();

    const button = fixture.debugElement.nativeElement.querySelector('#campaignConfirmationModal');
    button.click();

    component.confirmCampaignDelete();

    expect(spyDeleteCampaign).toHaveBeenCalled();
  });

  test('should filter campaigns based on input value', () => {
    const mockEvent = { target: { value: 'campaign name' } } as unknown as Event;

    // Call the method with the mock event
    component.filterCampaigns(mockEvent);

    // Assert that filterGlobal was called with the correct parameters
    expect(component.campaignsTable.filterGlobal).toHaveBeenCalledWith('campaign name', 'contains');
  });

  test('should set showCampaignTable to true when toggleCampaign is called', () => {
    expect(component.showCampaignTable).toBe(true);

    component.toggleCampaign();

    expect(component.showCampaignTable).toBe(true);
  });

  test('should set showCampaignTable and showDefinitionMode to false and log to console', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#showAnalytics');
    button.click();

    component.showAnalytics();

    expect(component.showCampaignTable).toBe(false);
    expect(component.showDefinitionMode).toBe(false);
  });

  test('should show campaign definition edit when a campaign is selected', () => {
    component.selectedCampaign = { id: 1, name: 'Test Campaign' }; // Mock selected campaign

    component.showEditDefinition();

    expect(component.showCampaignTable).toBe(false);
    expect(component.showDefinitionMode).toBe(true);

    jest.runAllTimers();

    // expect(component.campaignDefinitionComp.editCampaign).toHaveBeenCalled();
  });

  test('toggle show definition', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.fa-plus');
    button.click();

    component.showDefinition();

    expect(component.showCampaignTable).toBe(false);
    expect(component.showDefinitionMode).toBe(true);
  });
});
