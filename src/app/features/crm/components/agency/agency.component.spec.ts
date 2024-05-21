import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';

import { AgencyComponent } from './agency.component';
import { OrganizationService } from '../../services/organization.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SharedModule } from '../../../../shared/shared.module';
import {
  BranchAgencyDTO,
  CrmApiResponse,
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

const mockCrmApiResponse: CrmApiResponse = {
  message: '',
  status: 0,
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
  transferOrganizationBranchAgency = jest
    .fn()
    .mockReturnValue(of(mockCrmApiResponse));
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

  test('should save a new Organization Branch Agency', () => {
    jest.spyOn(component, 'fetchOrganizationBranchAgency');
    component.createAgencyForm.setValue({
      code: 1,
      id: 'BA-001',
      name: 'Test BA',
      status: 'A',
      manager: 'Test Manager',
      managerAllowed: 'Y',
      commission: 'Y',
    });

    component.saveAgency();

    expect(
      organizationServiceStub.createOrganizationBranchAgency
    ).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created an Organization Branch Agency'
    );
    expect(component.fetchOrganizationBranchAgency).toHaveBeenCalled();
  });

  test('should handle error when saving Organization Branch Agency', () => {
    component.createAgencyForm.setValue({
      code: 1,
      id: 'BA-001',
      name: 'Test BA',
      status: 'A',
      manager: 'Test Manager',
      managerAllowed: 'Y',
      commission: 'Y',
    });
    const errorMessage = 'Failed to save Organization Branch Agency';
    jest
      .spyOn(organizationServiceStub, 'createOrganizationBranchAgency')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));
    component.saveAgency();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe(
      'Failed to save Organization Branch Agency'
    );
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to save Organization Branch Agency'
    );
  });

  test('should transfer agency successfully', () => {
    component.createAgencyTransferForm.setValue({
      agencyName: 'Test Agency',
      transferDate: new Date(),
      currentBranch: 1,
      transferBranch: 2,
    });
    component.selectedAgency = {
      name: 'Test Agency',
      code: 1,
    } as BranchAgencyDTO;

    jest.spyOn(organizationServiceStub, 'transferOrganizationBranchAgency');
    const closeModalSpy = jest.spyOn(component, 'closeAgencyTransferModal');
    const fetchAgencySpy = jest.spyOn(
      component,
      'fetchOrganizationBranchAgency'
    );
    const successMessageSpy = jest.spyOn(
      messageServiceStub,
      'displaySuccessMessage'
    );

    component.transferAgency();

    expect(closeModalSpy).toHaveBeenCalled();
    expect(
      organizationServiceStub.transferOrganizationBranchAgency
    ).toHaveBeenCalledWith(1, 1, 2);
    expect(successMessageSpy).toHaveBeenCalledWith(
      'success',
      'Successfully Transfered Organization Branch Agency'
    );
    expect(fetchAgencySpy).toHaveBeenCalledWith(1);
  });

  test('should handle unsuccessful transfer agency', () => {
    component.createAgencyTransferForm.setValue({
      agencyName: 'Test Agency',
      transferDate: new Date(),
      currentBranch: 1,
      transferBranch: 2,
    });
    const errorMessage = 'Failed to Transfer Organization Branch Agency';
    jest
      .spyOn(organizationServiceStub, 'transferOrganizationBranchAgency')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));

    component.transferAgency();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe(
      'Failed to Transfer Organization Branch Agency'
    );
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to Transfer Organization Branch Agency'
    );
  });
});
