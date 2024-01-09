import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionComponent } from './division.component';
import { OrganizationService } from '../../services/organization.service';
import {
  OrganizationDTO,
  OrganizationDivisionDTO,
} from '../../data/organization-dto';
import { BehaviorSubject, of } from 'rxjs';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../../../shared/shared.module';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

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

const mockDivisionData: OrganizationDivisionDTO[] = [
  {
    id: 1,
    is_default_division: 'YES',
    name: 'Test Division',
    order: 0,
    organization_id: mockOrganizationData[0].id,
    short_description: '',
    status: '',
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
  getOrganizationDivision = jest.fn().mockReturnValue(of(mockDivisionData));
  createOrganizationDivision = jest.fn();
  updateOrganizationDivision = jest.fn();
  deleteOrganizationDivision = jest.fn();

  private selectedOrganizationIdSubject = new BehaviorSubject<number | null>(
    null
  );
  selectedOrganizationId$ = this.selectedOrganizationIdSubject.asObservable();

  // Method to set the selectedOrganizationId for testing
  setSelectedOrganizationId(selectedOrganizationId: number | null): void {
    this.selectedOrganizationIdSubject.next(selectedOrganizationId);
  }
}

export class MockStatusService {
  getStatus = jest.fn().mockReturnValue(of(mockStatusData));
}

export class MockGlobalMessagingService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('DivisionComponent', () => {
  let component: DivisionComponent;
  let fixture: ComponentFixture<DivisionComponent>;
  let organizationServiceStub: OrganizationService;
  let statusServiceStub: StatusService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DivisionComponent],
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
        { provide: StatusService, useClass: MockStatusService },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
      ],
    });
    fixture = TestBed.createComponent(DivisionComponent);
    component = fixture.componentInstance;
    organizationServiceStub = TestBed.inject(OrganizationService);
    statusServiceStub = TestBed.inject(StatusService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should subscribe to selectedOrganizationId$ observable on ngOnInit', () => {
    const selectedOrganizationId = 123;
    const spySubscribe = jest.spyOn(
      organizationServiceStub.selectedOrganizationId$,
      'subscribe'
    );
    organizationServiceStub.setSelectedOrganizationId(selectedOrganizationId);
    component.ngOnInit();
    expect(spySubscribe).toHaveBeenCalled();
    expect(component.selectedOrganizationId).toEqual(selectedOrganizationId);
  });

  test('should call fetchOrganizationDivision when selectedOrganizationId is not null on ngOnInit', () => {
    const selectedOrganizationId = 123;
    const spyFetchOrganizationDivision = jest.spyOn(
      component,
      'fetchOrganizationDivision'
    );
    const spySubscribe = jest.spyOn(
      organizationServiceStub.selectedOrganizationId$,
      'subscribe'
    );
    organizationServiceStub.setSelectedOrganizationId(selectedOrganizationId);
    component.ngOnInit();
    expect(spySubscribe).toHaveBeenCalled();
    expect(spyFetchOrganizationDivision).toHaveBeenCalledWith(
      selectedOrganizationId
    );
  });

  test('should call fetchOrganizationDivision on onOrganizationChange', () => {
    // const selectedOrganizationId = mockOrganizationData[0].id;
    component.selectedOrg = mockOrganizationData[0];
    const selectedOrganizationId = component.selectedOrg.id;
    component.organizationsData = mockOrganizationData;
    const spyFetchOrganizationDivision = jest.spyOn(
      component,
      'fetchOrganizationDivision'
    );
    // component.selectedOrganizationId = selectedOrganizationId;
    // component.organizationsData = mockOrganizationData;

    const button =
      fixture.debugElement.nativeElement.querySelector('#organization');
    button.click();

    component.onOrganizationChange();
    expect(spyFetchOrganizationDivision).toHaveBeenCalledWith(
      selectedOrganizationId
    );
  });

  test('should open Division Modal', () => {
    component.openDivisionModal();

    const modal = document.getElementById('divisionModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Division Modal', () => {
    const modal = document.getElementById('divisionModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDivisionModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open Confirmation Modal', () => {
    component.openConfirmationModal();

    const modal = document.getElementById('confirmationModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Confirmation Modal', () => {
    const modal = document.getElementById('confirmationModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeConfirmationModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should select a division on onDivisionRowSelect', () => {
    const selectedDivision = mockDivisionData[0];
    component.onDivisionRowSelect(selectedDivision);
    expect(component.selectedDivision).toEqual(selectedDivision);
  });

  test('should open confirmation modal if default division already exists on saveDivision', () => {
    component.selectedOrg = mockOrganizationData[0];
    const existingDefault = mockDivisionData[0];
    component.divisionData = [existingDefault];
    const organizationFormValues = { default: 'YES' };
    component.selectedOrganizationId = 1;
    const spyOpenConfirmationModal = jest.spyOn(
      component,
      'openConfirmationModal'
    );
    component.saveDivision();
    expect(spyOpenConfirmationModal).toHaveBeenCalled();
  });

  // test('should set selectedDefaultStatus, close modal, and call finalizeDivisionSave on confirmDefaultDivision', () => {
  //   const selectedValue = 'Yes';
  //   const organizationFormValues = {
  //     name: 'Test',
  //     divisionOrder: 1,
  //     shortDescription: 'Desc',
  //     divisionStatus: 'Active',
  //   };
  //   const spyFinalizeDivisionSave = jest.spyOn(
  //     component,
  //     'finalizeDivisionSave'
  //   );
  //   component.confirmDefaultDivision(selectedValue);
  //   expect(component.selectedDefaultStatus).toEqual(selectedValue);
  //   expect(spyFinalizeDivisionSave).toHaveBeenCalledWith(
  //     organizationFormValues,
  //     selectedValue
  //   );
  // });

  // test('should create a new division on finalizeDivisionSave when selectedDivision is null', () => {
  //   const saveOrganizationDivision: OrganizationDivisionDTO = {
  //     id: null,
  //     is_default_division: 'NO',
  //     name: 'Test Division',
  //     order: 1,
  //     organization_id: 1,
  //     short_description: 'Desc',
  //     status: 'Active',
  //   };
  //   const spyCreateOrganizationDivision = jest
  //     .spyOn(organizationServiceStub, 'createOrganizationDivision')
  //     .mockReturnValue(of());
  //   component.selectedOrganizationId = 1;
  //   component.selectedOrg = mockOrganizationData[0];
  //   component.selectedDivision = null;
  //   component.finalizeDivisionSave(
  //     {
  //       name: 'Test Division',
  //       divisionOrder: 1,
  //       shortDescription: 'Desc',
  //       divisionStatus: 'Active',
  //       default: 'NO',
  //     },
  //     'NO'
  //   );
  //   expect(spyCreateOrganizationDivision).toHaveBeenCalledWith(
  //     saveOrganizationDivision
  //   );
  // });
});
