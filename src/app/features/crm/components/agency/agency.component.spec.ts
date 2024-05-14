import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';

import { AgencyComponent } from './agency.component';
import { OrganizationService } from '../../services/organization.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SharedModule } from '../../../../shared/shared.module';
import {
  BranchAgencyDTO,
  ManagersDTO,
  OrganizationBranchDTO,
  OrganizationDTO,
} from '../../data/organization-dto';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';

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
    postalCode: 0,
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

const mockBranchAgenciesData: BranchAgencyDTO[] = [
  {
    agentCode: 0,
    branchId: 0,
    code: 0,
    manager: '',
    managerAllowed: '',
    managerSequenceNo: '',
    name: '',
    overrideCommEarned: '',
    policySequenceNo: 0,
    postLevel: '',
    propertySequenceNo: 0,
    sequenceNo: '',
    status: '',
  },
  {
    agentCode: 0,
    branchId: 0,
    code: 1,
    manager: '',
    managerAllowed: '',
    managerSequenceNo: '',
    name: '',
    overrideCommEarned: '',
    policySequenceNo: 0,
    postLevel: '',
    propertySequenceNo: 0,
    sequenceNo: '',
    status: '',
  },
];

const mockBranchAgencyData: BranchAgencyDTO = {
  agentCode: 0,
  branchId: 0,
  code: 0,
  manager: '',
  managerAllowed: '',
  managerSequenceNo: '',
  name: '',
  overrideCommEarned: '',
  policySequenceNo: 0,
  postLevel: '',
  propertySequenceNo: 0,
  sequenceNo: '',
  status: '',
};

const mockManagersData: ManagersDTO[] = [
  {
    agentShortDescription: '',
    id: 0,
    name: '',
    townCode: 0,
  },
];
const mockMandatoryData: MandatoryFieldsDTO[] = [
  {
    id: 1,
    fieldName: '',
    fieldLabel: '',
    mandatoryStatus: 'Y',
    visibleStatus: 'Y',
    disabledStatus: 'N',
    frontedId: 'shortDescription',
    screenName: '',
    groupId: '',
    module: '',
  },
];

const mockStatusData: StatusDTO[] = [
  {
    name: '',
    value: '',
  },
];

export class MockOrganizationService {
  getOrganization = jest.fn().mockReturnValue(of(mockOrganizationData));
  getOrganizationBranch = jest.fn().mockReturnValue(of(mockBranchesData));
  getOrganizationBranchAgency = jest
    .fn()
    .mockReturnValue(of(mockBranchAgenciesData));
  getBranchManagers = jest.fn().mockReturnValue(of(mockManagersData));
  createOrganizationBranchAgency = jest
    .fn()
    .mockReturnValue(of(mockBranchAgencyData));
  updateOrganizationBranchAgency = jest
    .fn()
    .mockReturnValue(of(mockBranchAgencyData));
  deleteOrganizationBranchAgency = jest
    .fn()
    .mockReturnValue(of(mockBranchAgencyData));
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

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest
    .fn()
    .mockReturnValue(of(mockMandatoryData));
}

export class MockStatusService {
  getStatus = jest.fn().mockReturnValue(of(mockStatusData));
}

describe('AgencyComponent', () => {
  let component: AgencyComponent;
  let fixture: ComponentFixture<AgencyComponent>;
  let organizationServiceStub: OrganizationService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let statusServiceStub: StatusService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgencyComponent],
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
        {
          provide: MandatoryFieldsService,
          useClass: MockMandatoryService,
        },
        {
          provide: StatusService,
          useClass: MockStatusService,
        },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
      ],
    });
    fixture = TestBed.createComponent(AgencyComponent);
    component = fixture.componentInstance;
    organizationServiceStub = TestBed.inject(OrganizationService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    statusServiceStub = TestBed.inject(StatusService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should filter agency on filterAgency', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(component.agencyTable, 'filterGlobal');

    component.filterAgency(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should open Branch Agency Transfer Modal', () => {
    component.openAgencyTransferModal();

    const modal = document.getElementById('agencyTransferModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Branch Agency Transfer Modal', () => {
    const modal = document.getElementById('agencyTransferModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeAgencyTransferModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open Branch Agency Modal', () => {
    component.openAgencyModal();

    const modal = document.getElementById('agencyModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Branch Agency Modal', () => {
    const modal = document.getElementById('agencyModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeAgencyModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should fetch organization branch managers data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganization');
    const organizationId = mockOrganizationData[0].id;
    component.fetchBranchManagers(organizationId);
    expect(organizationServiceStub.getBranchManagers).toHaveBeenCalled();
    expect(component.managersData).toEqual(mockManagersData);
  });

  test('should fetch organization branch data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganizationBranch');
    const organizationId = mockOrganizationData[0].id;
    component.fetchOrganizationBranch(organizationId);
    expect(organizationServiceStub.getOrganizationBranch).toHaveBeenCalled();
    expect(component.branchesData).toEqual(mockBranchesData);
  });

  test('should fetch organization branch agency data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganizationBranchAgency');
    const branchId = mockBranchesData[0].id;
    component.fetchOrganizationBranchAgency(branchId);
    expect(
      organizationServiceStub.getOrganizationBranchAgency
    ).toHaveBeenCalled();
    expect(component.agenciesData).toEqual(mockBranchAgenciesData);
  });
});
