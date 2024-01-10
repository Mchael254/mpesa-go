import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { BranchComponent } from './branch.component';
import {
  BranchContactDTO,
  BranchDivisionDTO,
  OrganizationBranchDTO,
  OrganizationDTO,
  OrganizationRegionDTO,
} from '../../data/organization-dto';
import {
  CountryDto,
  StateDto,
  TownDto,
} from '../../../../shared/data/common/countryDto';
import { StaffDto } from '../../../../features/entities/data/StaffDto';
import { Subject, of } from 'rxjs';
import { OrganizationService } from '../../services/organization.service';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from '../../../../shared/shared.module';
import { TableModule } from 'primeng/table';

const mockOrganizationData: OrganizationDTO[] = [
  {
    address: {
      box_number: '',
      country_id: 0,
      estate: '',
      fax: '',
      house_number: '',
      id: 0,
      is_utility_address: '',
      phone_number: '',
      physical_address: '',
      postal_code: '',
      residential_address: '',
      road: '',
      state_id: 0,
      town_id: 0,
      utility_address_proof: '',
      zip: '',
    },
    country: undefined,
    currency_id: 0,
    emailAddress: '',
    faxNumber: '',
    groupId: 0,
    id: 0,
    license_number: '',
    manager: 0,
    motto: '',
    name: '',
    organizationGroupLogo: '',
    organizationLogo: '',
    organization_type: '',
    paybill: 0,
    physicalAddress: '',
    pin_number: '',
    postalAddress: 0,
    postalCode: '',
    primaryTelephoneNo: '',
    primarymobileNumber: '',
    registrationNo: '',
    secondaryMobileNumber: '',
    secondaryTelephoneNo: '',
    short_description: '',
    state: {
      country: undefined,
      id: 0,
      name: '',
      shortDescription: '',
    },
    town: {
      country: '',
      id: 0,
      name: '',
      shortDescription: '',
      state: '',
    },
    vatNumber: '',
    webAddress: '',
    bankBranchId: 0,
    bankId: 0,
    swiftCode: '',
    bank_account_name: '',
    bank_account_number: '',
    customer_care_email: '',
    customer_care_name: '',
    customer_care_primary_phone_number: 0,
    customer_care_secondary_phone_number: 0,
  },
];

const mockRegionData: OrganizationRegionDTO[] = [
  {
    agentSeqNo: '',
    branchMgrSeqNo: '',
    clientSequence: 0,
    code: 0,
    computeOverOwnBusiness: '',
    dateFrom: '',
    dateTo: '',
    managerAllowed: '',
    managerId: 0,
    name: '',
    organization: '',
    overrideCommissionEarned: '',
    policySeqNo: 0,
    postingLevel: '',
    preContractAgentSeqNo: 0,
    shortDescription: '',
  },
];

const mockBranchesData: OrganizationBranchDTO[] = [
  {
    bnsCode: 0,
    countryId: 0,
    countryName: '',
    emailAddress: '',
    generalPolicyClaim: '',
    id: 0,
    logo: '',
    managerAllowed: '',
    managerId: 0,
    managerName: '',
    managerSeqNo: '',
    name: '',
    organizationId: 0,
    overrideCommissionAllowed: '',
    physicalAddress: '',
    policyPrefix: '',
    policySequence: 0,
    postalAddress: '',
    postalCode: '',
    regionId: 0,
    regionName: '',
    shortDescription: '',
    stateId: 0,
    stateName: '',
    telephone: '',
    townId: 0,
    townName: '',
  },
];

const mockBranchContactData: BranchContactDTO[] = [
  {
    branchId: 0,
    designation: '',
    emailAddress: '',
    id: 0,
    idNumber: '',
    mobile: '',
    name: '',
    physicalAddress: '',
    telephone: '',
  },
];

const mockBranchDivisionData: BranchDivisionDTO[] = [
  {
    branchId: 0,
    branchName: '',
    divisionId: 0,
    divisionName: '',
    id: 0,
    withEffectiveFrom: '',
    withEffectiveTo: '',
  },
];

const mockCountryData: CountryDto[] = [
  {
    adminRegMandatory: '',
    adminRegType: '',
    currSerial: 0,
    currency: {
      createdBy: '',
      createdDate: '',
      decimalWord: '',
      id: 0,
      modifiedBy: '',
      modifiedDate: '',
      name: '',
      numberWord: '',
      roundingOff: 0,
      symbol: '',
    },
    drugTraffickingStatus: '',
    drugWefDate: '',
    drugWetDate: '',
    highRiskWefDate: '',
    highRiskWetDate: '',
    id: 1,
    isShengen: '',
    mobilePrefix: 0,
    name: 'Kenya',
    nationality: '',
    risklevel: '',
    short_description: '',
    subAdministrativeUnit: '',
    telephoneMaximumLength: 0,
    telephoneMinimumLength: 0,
    unSanctionWefDate: '',
    unSanctionWetDate: '',
    unSanctioned: '',
    zipCode: 0,
    zipCodeString: '',
  },
];

const mockStateData: StateDto[] = [
  {
    country: {
      adminRegMandatory: '',
      adminRegType: '',
      currSerial: 0,
      currency: {
        createdBy: '',
        createdDate: '',
        decimalWord: '',
        id: 0,
        modifiedBy: '',
        modifiedDate: '',
        name: '',
        numberWord: '',
        roundingOff: 0,
        symbol: '',
      },
      drugTraffickingStatus: '',
      drugWefDate: '',
      drugWetDate: '',
      highRiskWefDate: '',
      highRiskWetDate: '',
      id: 0,
      isShengen: '',
      mobilePrefix: 0,
      name: '',
      nationality: '',
      risklevel: '',
      short_description: '',
      subAdministrativeUnit: '',
      telephoneMaximumLength: 0,
      telephoneMinimumLength: 0,
      unSanctionWefDate: '',
      unSanctionWetDate: '',
      unSanctioned: '',
      zipCode: 0,
      zipCodeString: '',
    },
    id: 1,
    shortDescription: '',
    name: 'Nairobi',
  },
];

const mockTownData: TownDto[] = [
  {
    id: 0,
    country: {
      adminRegMandatory: '',
      adminRegType: '',
      currSerial: 0,
      currency: {
        createdBy: '',
        createdDate: '',
        decimalWord: '',
        id: 0,
        modifiedBy: '',
        modifiedDate: '',
        name: '',
        numberWord: '',
        roundingOff: 0,
        symbol: '',
      },
      drugTraffickingStatus: '',
      drugWefDate: '',
      drugWetDate: '',
      highRiskWefDate: '',
      highRiskWetDate: '',
      id: 0,
      isShengen: '',
      mobilePrefix: 0,
      name: '',
      nationality: '',
      risklevel: '',
      short_description: '',
      subAdministrativeUnit: '',
      telephoneMaximumLength: 0,
      telephoneMinimumLength: 0,
      unSanctionWefDate: '',
      unSanctionWetDate: '',
      unSanctioned: '',
      zipCode: 0,
      zipCodeString: '',
    },
    shortDescription: '',
    name: '',
    state: {
      country: {
        adminRegMandatory: '',
        adminRegType: '',
        currSerial: 0,
        currency: {
          createdBy: '',
          createdDate: '',
          decimalWord: '',
          id: 0,
          modifiedBy: '',
          modifiedDate: '',
          name: '',
          numberWord: '',
          roundingOff: 0,
          symbol: '',
        },
        drugTraffickingStatus: '',
        drugWefDate: '',
        drugWetDate: '',
        highRiskWefDate: '',
        highRiskWetDate: '',
        id: 0,
        isShengen: '',
        mobilePrefix: 0,
        name: '',
        nationality: '',
        risklevel: '',
        short_description: '',
        subAdministrativeUnit: '',
        telephoneMaximumLength: 0,
        telephoneMinimumLength: 0,
        unSanctionWefDate: '',
        unSanctionWetDate: '',
        unSanctioned: '',
        zipCode: 0,
        zipCodeString: '',
      },
      id: 0,
      shortDescription: '',
      name: '',
    },
  },
];

const mockStaffData: StaffDto[] = [
  {
    name: '',
    username: '',
    userType: '',
    status: '',
  },
];

export class MockOrganizationService {
  getOrganization = jest.fn().mockReturnValue(of(mockOrganizationData));
  getOrganizationRegion = jest.fn().mockReturnValue(of(mockRegionData));
  getOrganizationBranchDivision = jest
    .fn()
    .mockReturnValue(of(mockBranchDivisionData));
  getOrganizationBranchContact = jest
    .fn()
    .mockReturnValue(of(mockBranchContactData));
  getOrganizationBranch = jest.fn().mockReturnValue(of(mockBranchesData));
  createOrganizationBranch = jest.fn();
  updateOrganizationBranch = jest.fn();
}

export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of(mockCountryData));
  getMainCityStatesByCountry = jest.fn().mockReturnValue(of(mockStateData));
  getTownsByMainCityState = jest.fn().mockReturnValue(of(mockTownData));
}

export class MockStaffService {
  getStaff = jest.fn().mockReturnValue(of(mockStaffData));
}

export class MockGlobalMessagingService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
  clearMessages = jest.fn();
}

describe('BranchComponent', () => {
  let component: BranchComponent;
  let fixture: ComponentFixture<BranchComponent>;
  let organizationServiceStub: OrganizationService;
  let countryServiceStub: CountryService;
  let messageServiceStub: GlobalMessagingService;
  let staffServiceStub: StaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
        TableModule,
        SharedModule,
      ],
      providers: [
        { provide: OrganizationService, useClass: MockOrganizationService },
        { provide: CountryService, useClass: MockCountryService },
        { provide: StaffService, useClass: MockStaffService },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
      ],
    });
    fixture = TestBed.createComponent(BranchComponent);
    component = fixture.componentInstance;
    organizationServiceStub = TestBed.inject(OrganizationService);
    countryServiceStub = TestBed.inject(CountryService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    staffServiceStub = TestBed.inject(StaffService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch organization data on ngOnInit', () => {
    jest.spyOn(organizationServiceStub, 'getOrganizationRegion');
    component.ngOnInit();
    expect(organizationServiceStub.getOrganization).toHaveBeenCalled();
    expect(component.organizationsData).toEqual(mockOrganizationData);
  });

  test('should fetch organization region data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganization');
    const organizationId = mockOrganizationData[0].id;
    component.fetchOrganizationRegion(organizationId);
    expect(organizationServiceStub.getOrganizationRegion).toHaveBeenCalled();
    expect(component.regionData).toEqual(mockRegionData);
  });

  test('should fetch organization branch division data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganizationBranchDivision');
    const branchId = mockBranchesData[0].id;
    component.fetchOrganizationBranchDivision(branchId);
    expect(
      organizationServiceStub.getOrganizationBranchDivision
    ).toHaveBeenCalled();
    expect(component.branchDivisionData).toEqual(mockBranchDivisionData);
  });

  test('should fetch organization branch contact data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganizationBranchContact');
    const branchId = mockBranchesData[0].id;
    component.fetchOrganizationBranchContact(branchId);
    expect(
      organizationServiceStub.getOrganizationBranchContact
    ).toHaveBeenCalled();
    expect(component.branchContacts).toEqual(mockBranchContactData);
  });

  test('should fetch organization branch data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganizationBranch');
    const organizationId = mockOrganizationData[0].id;
    const regionId = mockRegionData[0].code;
    component.fetchOrganizationBranch(organizationId, regionId);
    expect(organizationServiceStub.getOrganizationBranch).toHaveBeenCalled();
    expect(component.branchesData).toEqual(mockBranchesData);
  });

  test('should fetch countries data', () => {
    jest.spyOn(countryServiceStub, 'getCountries');
    component.fetchCountries();
    expect(countryServiceStub.getCountries).toHaveBeenCalled();
    expect(component.countriesData).toEqual(mockCountryData);
  });

  test('should open Branch Contact Modal', () => {
    component.openBranchContactModal();

    const modal = document.getElementById('branchContactModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Branch Contact Modal', () => {
    const modal = document.getElementById('branchContactModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeBranchContactModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open Branch Division Modal', () => {
    component.openBranchDivisionModal();

    const modal = document.getElementById('branchDivisionModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Branch Division Modal', () => {
    const modal = document.getElementById('branchDivisionModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeBranchDivisionModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open Branch BranchTransfer Modal', () => {
    component.openBranchTransferModal();

    const modal = document.getElementById('branchTransferModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close BranchBranchTransfer Modal', () => {
    const modal = document.getElementById('branchTransferModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeBranchTransferModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open Branch Branch Modal', () => {
    component.openBranchModal();

    const modal = document.getElementById('branchModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close BranchBranchTransfer Modal', () => {
    const modal = document.getElementById('branchModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeBranchModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should call filterGlobal on branchTable with the correct filter value', () => {
    const mockEvent: Event = {
      target: { value: 'testFilterValue' },
    } as unknown as Event; // This is necessary to satisfy TypeScript

    const branchTableSpy = jest.spyOn(component.branchTable, 'filterGlobal');

    component.filterBranch(mockEvent);

    expect(branchTableSpy).toHaveBeenCalledWith('testFilterValue', 'contains');
  });

  test('should call filterGlobal on branchContactTable with the correct filter value', () => {
    const mockEvent: Event = {
      target: { value: 'testFilterValue' },
    } as unknown as Event; // This is necessary to satisfy TypeScript

    const branchContactTableSpy = jest.spyOn(
      component.branchContactTable,
      'filterGlobal'
    );

    component.filterBranchContact(mockEvent);

    expect(branchContactTableSpy).toHaveBeenCalledWith(
      'testFilterValue',
      'contains'
    );
  });

  test('should set values and call service on country change', () => {
    component.countriesData = mockCountryData;
    component.selectedCountry = mockCountryData[0].id;

    component.onCountryChange();

    expect(component.createBranchForm.get('state').value).toBe(null);
    expect(component.createBranchForm.get('town').value).toBe(null);
    expect(component.countrySelected).toEqual(mockCountryData[0]);
    expect(countryServiceStub.getMainCityStatesByCountry).toHaveBeenCalledWith(
      1
    );
  });

  test('should set values and call service on city change', () => {
    component.stateData = mockStateData;
    component.selectedState = mockStateData[0].id;

    component.onCityChange();

    expect(component.stateSelected).toEqual(mockStateData[0]);
    expect(countryServiceStub.getTownsByMainCityState).toHaveBeenCalledWith(1);
  });

  test('should set selectedOrg and fetch regions on organization change', () => {
    jest.spyOn(organizationServiceStub, 'getOrganization');
    jest.spyOn(organizationServiceStub, 'getOrganizationRegion');

    // component.onOrganizationChange();
    const button =
      fixture.debugElement.nativeElement.querySelector('#organization');
    button.click();

    component.selectedOrganizationId = 1;
    component.organizationsData = mockOrganizationData;

    expect(organizationServiceStub.getOrganization).toHaveBeenCalled();
    expect(organizationServiceStub.getOrganizationRegion).toHaveBeenCalledWith(
      1
    );
    expect(component.selectedOrg).toBeDefined();
    expect(component.selectedOrg.id).toBe(1);
  });

  test('should fetch branches on region change', () => {
    component.selectedOrg = mockOrganizationData[0];
    component.selectedOrganizationId = mockOrganizationData[0].id;
    component.regionData = mockRegionData;
    component.selectedRegion = mockRegionData[0].code;
    const fetchOrganizationBranchSpy = jest.spyOn(
      component,
      'fetchOrganizationBranch'
    );

    component.onRegionChange();

    expect(fetchOrganizationBranchSpy).toHaveBeenCalledWith(
      mockOrganizationData[0].id,
      mockRegionData[0].code
    );
  });

  test('should set selected branch and fetch branch divisions and contacts on branch row select', () => {
    const branch: OrganizationBranchDTO = mockBranchesData[0];
    const fetchOrganizationBranchDivisionSpy = jest.spyOn(
      component,
      'fetchOrganizationBranchDivision'
    );
    const fetchOrganizationBranchContactSpy = jest.spyOn(
      component,
      'fetchOrganizationBranchContact'
    );

    component.onBranchRowSelect(branch);

    expect(component.selectedBranch).toEqual(branch);
    expect(fetchOrganizationBranchDivisionSpy).toHaveBeenCalledWith(branch.id);
    expect(fetchOrganizationBranchContactSpy).toHaveBeenCalledWith(branch.id);
  });

  test('should set selected branch division on branch division row select', () => {
    const division: BranchDivisionDTO = mockBranchDivisionData[0];

    component.onBranchDivisionRowSelect(division);

    expect(component.selectedBranchDivision).toEqual(division);
  });

  test('should set selected branch contact on branch contact row select', () => {
    const contact: BranchContactDTO = mockBranchContactData[0];

    component.onBranchContactRowSelect(contact);

    expect(component.selectedBranchContact).toEqual(contact);
  });

  test('should create a new organization branch', () => {
    component.selectedOrg = mockOrganizationData[0];
    component.selectedReg = mockRegionData[0];
    component.createBranchForm.setValue({
      country: 'Kenya',
      emailAddress: 'test@example.com',
      managerAllowed: '',
      branchLogo: '',
      branchManager: 'John Doe',
      branchName: 'New Branch',
      commission: '',
      physicalAddress: '123 Main St',
      postalAddress: 'P.O. Box 456',
      postalCode: '78901',
      shortDescription: 'A new branch',
      state: 'California',
      telephone: '+254724541108',
      town: 'Westlands',
    });

    component.saveBranch();

    expect(organizationServiceStub.createOrganizationBranch).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created an Organization Branch'
    );
    expect(component.selectedBranch).toBeNull();
    expect(component.fetchOrganizationBranch).toHaveBeenCalledWith(1, 2);
  });
});
