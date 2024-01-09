import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { RegionComponent } from './region.component';
import { OrganizationService } from '../../services/organization.service';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import {
  ManagersDTO,
  OrganizationDTO,
  OrganizationRegionDTO,
  PostOrganizationRegionDTO,
  YesNoDTO,
} from '../../data/organization-dto';
import { BehaviorSubject, of } from 'rxjs';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../../../shared/shared.module';
import { BankRegionDTO } from 'src/app/shared/data/common/bank-dto';

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
    id: 1,
    license_number: '',
    manager: 0,
    motto: '',
    name: 'Turnkey Africa Limited',
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

const mockRegionBankData: BankRegionDTO[] = [
  {
    bankRegionName: '',
    id: 0,
    managerId: 0,
    organizationId: 0,
    regionCode: 0,
    shortDescription: '',
    wef: '',
    wet: '',
  },
];

const mockManagersData: ManagersDTO[] = [
  {
    agentShortDescription: '',
    id: 0,
    name: '',
    townCode: 0,
  },
];

const mockOptionData: YesNoDTO[] = [
  {
    name: '',
    value: '',
  },
];

export class MockOrganizationService {
  getOrganization = jest.fn().mockReturnValue(of(mockOrganizationData));
  getOrganizationRegion = jest.fn().mockReturnValue(of(mockRegionData));
  getOptionValues = jest.fn().mockReturnValue(of(mockOptionData));
  getRegionManagers = jest.fn().mockReturnValue(of(mockManagersData));
  createOrganizationRegion = jest.fn().mockReturnValue(of());
  updateOrganizationRegion = jest.fn().mockReturnValue(of());
  deleteOrganizationRegion = jest.fn().mockReturnValue(of());

  private selectedOrganizationIdSubject = new BehaviorSubject<number | null>(
    null
  );
  selectedOrganizationId$ = this.selectedOrganizationIdSubject.asObservable();

  // Method to set the selectedOrganizationId for testing
  setSelectedOrganizationId(selectedOrganizationId: number | null): void {
    this.selectedOrganizationIdSubject.next(selectedOrganizationId);
  }

  private selectedRegionSource = new BehaviorSubject<number | null>(null);
  selectedRegion$ = this.selectedRegionSource.asObservable();

  setSelectedRegion(selectedRegion: number) {
    this.selectedRegionSource.next(selectedRegion);
  }
}

export class MockBankService {
  getBankRegion = jest.fn().mockReturnValue(of(mockRegionBankData));
  createBankRegion = jest.fn().mockReturnValue(of());
  updateBankRegion = jest.fn().mockReturnValue(of());
  deleteBankRegion = jest.fn().mockReturnValue(of());
}

export class MockGlobalMessagingService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('RegionComponent', () => {
  let component: RegionComponent;
  let fixture: ComponentFixture<RegionComponent>;
  let organizationServiceStub: OrganizationService;
  let bankServiceStub: BankService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionComponent],
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
        { provide: BankService, useClass: MockBankService },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
      ],
    });
    fixture = TestBed.createComponent(RegionComponent);
    component = fixture.componentInstance;
    organizationServiceStub = TestBed.inject(OrganizationService);
    bankServiceStub = TestBed.inject(BankService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should update selectedOrg, fetch organization region, and fetch manager', () => {
    const spySetOrganizationId = jest.spyOn(
      organizationServiceStub,
      'setSelectedOrganizationId'
    );

    const organizationId = mockOrganizationData[0].id;

    component.selectedOrganizationId = organizationId;
    component.organizationsData = mockOrganizationData;

    component.onOrganizationChange();

    expect(component.selectedOrg).toEqual(mockOrganizationData[0]);
    expect(spySetOrganizationId).toHaveBeenCalledWith(organizationId);
    expect(organizationServiceStub.getOrganizationRegion).toHaveBeenCalledWith(
      organizationId
    );
    expect(organizationServiceStub.getRegionManagers).toHaveBeenCalledWith(
      organizationId
    );
  });

  test('should open Region Modal', () => {
    component.openRegionModal();

    const modal = document.getElementById('regionModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Region Modal', () => {
    const modal = document.getElementById('regionModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeRegionModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open Region Bank Modal', () => {
    component.openBankModal();

    const modal = document.getElementById('bankModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Region Bank Modal', () => {
    const modal = document.getElementById('bankModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeBankModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should filter region on filterRegion', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(component.regionTable, 'filterGlobal');

    component.filterRegion(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should filter region banks on filterRegionBank', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(
      component.bankRegionTable,
      'filterGlobal'
    );

    component.filterRegionBank(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should fetch organization region data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganization');
    const organizationId = mockOrganizationData[0].id;
    component.fetchOrganizationRegion(organizationId);
    expect(organizationServiceStub.getOrganizationRegion).toHaveBeenCalled();
    expect(component.regionData).toEqual(mockRegionData);
  });

  test('should fetch organization managers data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganization');
    const organizationId = mockOrganizationData[0].id;
    component.fetchManager(organizationId);
    expect(organizationServiceStub.getRegionManagers).toHaveBeenCalled();
    expect(component.regionManagersData).toEqual(mockManagersData);
  });

  test('should fetch region banks data', () => {
    jest.spyOn(organizationServiceStub, 'getOrganizationRegion');
    const regionCode = mockRegionData[0].code;
    component.fetchBankRegions(regionCode);
    expect(bankServiceStub.getBankRegion).toHaveBeenCalled();
    expect(component.bankRegionData).toEqual(mockRegionBankData);
  });

  test('should select a region on onRegionRowClick', () => {
    const spyFetchBankRegions = jest.spyOn(component, 'fetchBankRegions');
    const spySetSelectedRegion = jest.spyOn(
      organizationServiceStub,
      'setSelectedRegion'
    );
    const selectedRegion = mockRegionData[0];
    component.onRegionRowClick(selectedRegion);
    expect(component.selectedRegion).toEqual(selectedRegion);
    expect(spyFetchBankRegions).toHaveBeenCalledWith(selectedRegion.code);
    expect(spySetSelectedRegion).toHaveBeenCalledWith(selectedRegion.code);
  });

  test('should select a region bank on onRegionBankRowClick', () => {
    jest.spyOn(bankServiceStub, 'getBankRegion');
    const selectedRegionBank = mockRegionBankData[0];
    component.onRegionBankRowClick(selectedRegionBank);
    expect(component.selectedRegionBank).toEqual(selectedRegionBank);
  });

  test('should create a new region when no region is selected', () => {
    const spyFetchOrganizationRegion = jest.spyOn(
      component,
      'fetchOrganizationRegion'
    );
    const mockOrganizationId = mockOrganizationData[0].id;
    const mockRegionFormValues = {
      shortDescription: 'NBI',
      name: 'Nairobi',
      manager: 1,
      managerAllowed: 'Y',
      wef: '',
      wet: '',
      commissionEarned: undefined,
    };

    const mockSaveRegion: PostOrganizationRegionDTO = {
      agentSeqNo: null,
      branchMgrSeqNo: null,
      clientSequence: null,
      code: null,
      computeOverOwnBusiness: '',
      dateFrom: mockRegionFormValues.wef,
      dateTo: mockRegionFormValues.wet,
      managerAllowed: mockRegionFormValues.managerAllowed,
      managerId: mockRegionFormValues.manager,
      name: mockRegionFormValues.name,
      organizationId: mockOrganizationData[0].id,
      overrideCommissionEarned: mockRegionFormValues.commissionEarned,
      policySeqNo: null,
      postingLevel: null,
      preContractAgentSeqNo: null,
      shortDescription: mockRegionFormValues.shortDescription,
    };

    component.selectedOrg = mockOrganizationData[0];
    component.selectedRegion = null;
    component.createRegionForm.patchValue(mockRegionFormValues);

    component.saveRegion();

    expect(
      organizationServiceStub.createOrganizationRegion
    ).toHaveBeenCalledWith(mockSaveRegion);
    // expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
    //   'Success',
    //   'Successfully Created a Region'
    // );
    // expect(spyFetchOrganizationRegion).toHaveBeenCalledWith(mockOrganizationId);
    // expect(component.createRegionForm.reset).toHaveBeenCalled();
  });

  test('should open the region modal and set form values when a region is selected', () => {
    const mockSelectedRegion = mockRegionData[0];
    component.selectedRegion = mockSelectedRegion;
    const spyOpenRegionModal = jest.spyOn(component, 'openRegionModal');
    const patchValueSpy = jest.spyOn(component.createRegionForm, 'patchValue');

    component.editRegion();

    expect(spyOpenRegionModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      organization: mockSelectedRegion.organization,
      shortDescription: mockSelectedRegion.shortDescription,
      name: mockSelectedRegion.name,
      manager: mockSelectedRegion.managerId,
      managerAllowed: mockSelectedRegion.managerAllowed,
      wef: mockSelectedRegion.dateFrom,
      wet: mockSelectedRegion.dateTo,
      commissionEarned: mockSelectedRegion.overrideCommissionEarned,
    });
  });

  test('should display an error message when no region is selected during edit', () => {
    component.selectedRegion = null;

    component.editRegion();
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Region is selected.'
    );
  });

  test('should show the region confirmation modal when deleteRegion is called', () => {
    const spydeleteOrganizationRegion = jest.spyOn(component, 'deleteRegion');
    component.deleteRegion();

    expect(spydeleteOrganizationRegion).toHaveBeenCalled();
    expect(component.regionConfirmationModal.show).toBeTruthy;
  });

  test('should confirm region deletion when a region is selected', () => {
    const spyfetchOrganizationRegion = jest.spyOn(
      component,
      'fetchOrganizationRegion'
    );
    const spydeleteOrganization = jest.spyOn(
      organizationServiceStub,
      'deleteOrganizationRegion'
    );
    const spydisplaySuccessMessage = jest.spyOn(
      messageServiceStub,
      'displaySuccessMessage'
    );
    const mockRegionCode = mockRegionData[0].code;

    component.selectedRegion = mockRegionData[0];
    component.selectedOrg = mockOrganizationData[0];
    const button = fixture.debugElement.nativeElement.querySelector(
      '#regionConfirmationModal'
    );
    button.click();
    component.confirmRegionDelete();

    expect(spydeleteOrganization).toHaveBeenCalledWith(mockRegionCode);
    // expect(spydisplaySuccessMessage).toHaveBeenCalledWith(
    //   'success',
    //   'Successfully deleted a Region'
    // );
    // expect(spyfetchOrganizationRegion).toHaveBeenCalledWith(
    //   component.selectedOrg.id
    // );
    // expect(component.selectedRegion).toBeNull();
  });

  test('should display an error message when no region is selected during delete confirmation', () => {
    component.selectedRegion = null;

    component.confirmRegionDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Region is Selected!'
    );
  });

  test('should open the region bank modal and set form values when a region bank is selected', () => {
    const mockSelectedRegionBank = mockRegionBankData[0];
    component.selectedRegionBank = mockSelectedRegionBank;
    const spyOpenRegionBankModal = jest.spyOn(component, 'openBankModal');
    const patchValueSpy = jest.spyOn(
      component.createRegionBankForm,
      'patchValue'
    );

    component.editRegionBank();

    expect(spyOpenRegionBankModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      shortDescription: mockSelectedRegionBank.shortDescription,
      name: mockSelectedRegionBank.bankRegionName,
      wef: mockSelectedRegionBank.wef,
      wet: mockSelectedRegionBank.wet,
      manager: mockSelectedRegionBank.managerId,
    });
  });

  test('should show the region bank confirmation modal when deleteRegionBank is called', () => {
    const spydeleteOrganizationRegion = jest.spyOn(
      component,
      'deleteRegionBank'
    );
    component.deleteRegionBank();

    expect(spydeleteOrganizationRegion).toHaveBeenCalled();
    expect(component.regionBankConfirmationModal.show).toBeTruthy;
  });

  test('should confirm region deletion when a region is selected', () => {
    component.selectedRegionBank = mockRegionBankData[0];
    const selectedBankId = mockRegionBankData[0].id;

    const spydeleteBankRegion = jest.spyOn(bankServiceStub, 'deleteBankRegion');

    const spydisplaySuccessMessage = jest.spyOn(
      messageServiceStub,
      'displaySuccessMessage'
    );

    const spydeleteRegionBank = jest.spyOn(component, 'deleteRegionBank');
    component.deleteRegionBank();

    const button = fixture.debugElement.nativeElement.querySelector(
      '#regionBankConfirmationModal'
    );
    button.click();

    component.confirmRegionBankDelete();

    expect(spydeleteRegionBank).toHaveBeenCalled();
    expect(spydeleteBankRegion).toHaveBeenCalledWith(selectedBankId);
  });

  test('should display an error message when no region bank is selected during delete confirmation', () => {
    component.selectedRegionBank = null;

    component.confirmRegionBankDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Region Bank is Selected!'
    );
  });
});
