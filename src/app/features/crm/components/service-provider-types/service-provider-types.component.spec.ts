import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';

import { ServiceProviderTypesComponent } from './service-provider-types.component';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ServiceProviderTypesService } from '../../services/service-provider-types.service';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';
import { ServiceProviderTypeDTO } from '../../data/service-provider-type';
import { SharedModule } from '../../../../shared/shared.module';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';

const mockServiceProviderTypesData: ServiceProviderTypeDTO[] = [
  {
    code: 1,
    name: 'Test-1 SPT',
    providerTypeSuffixes: '',
    shortDescription: 'TT-1',
    shortDescriptionNextNo: '',
    shortDescriptionSerialFormat: '',
    status: 'A',
    vatTaxRate: '',
    witholdingTaxRate: '',
  },
  {
    code: 2,
    name: 'Test-2 SPT',
    providerTypeSuffixes: '',
    shortDescription: 'TT-2',
    shortDescriptionNextNo: '',
    shortDescriptionSerialFormat: '',
    status: 'A',
    vatTaxRate: '',
    witholdingTaxRate: '',
  },
];
const mockServiceProviderTypeData: ServiceProviderTypeDTO = {
  code: 2,
  name: 'Test SPT',
  providerTypeSuffixes: '',
  shortDescription: 'TT',
  shortDescriptionNextNo: '',
  shortDescriptionSerialFormat: '',
  status: 'A',
  vatTaxRate: '',
  witholdingTaxRate: '',
};

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

export class MockServiceProviderTypeService {
  getServiceProviderTypes = jest
    .fn()
    .mockReturnValue(of(mockServiceProviderTypesData));
  createServiceProviderType = jest
    .fn()
    .mockReturnValue(of(mockServiceProviderTypeData));
  updateServiceProviderType = jest
    .fn()
    .mockReturnValue(of(mockServiceProviderTypeData));
  deleteServiceProviderType = jest
    .fn()
    .mockReturnValue(of(mockServiceProviderTypeData));
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest
    .fn()
    .mockReturnValue(of(mockMandatoryData));
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

describe('ServiceProviderTypesComponent', () => {
  let component: ServiceProviderTypesComponent;
  let fixture: ComponentFixture<ServiceProviderTypesComponent>;
  let serviceProviderTypeServiceStub: ServiceProviderTypesService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let statusServiceStub: StatusService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceProviderTypesComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        TableModule,
        SharedModule,
      ],
      providers: [
        {
          provide: ServiceProviderTypesService,
          useClass: MockServiceProviderTypeService,
        },
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
    fixture = TestBed.createComponent(ServiceProviderTypesComponent);
    component = fixture.componentInstance;
    serviceProviderTypeServiceStub = TestBed.inject(
      ServiceProviderTypesService
    );
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    statusServiceStub = TestBed.inject(StatusService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch serviceprovidertype successfully', () => {
    jest.spyOn(serviceProviderTypeServiceStub, 'getServiceProviderTypes');
    component.fetchServiceProviderTypes();
    expect(
      serviceProviderTypeServiceStub.getServiceProviderTypes
    ).toHaveBeenCalled();
    expect(component.serviceProviderTypesData).toEqual(
      mockServiceProviderTypesData
    );
  });

  test('should filter service provider type on filterServiceProviderTypes', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(
      component.serviceProviderTypeTable,
      'filterGlobal'
    );

    component.filterServiceProviderTypes(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should set the selected Service Provider Type when a Service Provider Type is selected', () => {
    expect(component.selectedServiceProviderType).toBeUndefined();
    component.onServiceProviderTypeRowSelect(mockServiceProviderTypeData);

    expect(component.selectedServiceProviderType).toEqual(
      mockServiceProviderTypeData
    );
  });

  test('should open Service Provider Type Modal', () => {
    component.openServiceProviderTypeModal();

    const modal = document.getElementById('serviceProviderTypeModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Service Provider Type Modal', () => {
    const modal = document.getElementById('serviceProviderTypeModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeServiceProviderTypeModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should save a new Service Provider Type', () => {
    jest.spyOn(component, 'fetchServiceProviderTypes');
    component.createServiceProviderTypeForm.setValue({
      shortDescription: 'TT',
      name: 'Test SPT',
      status: 'A',
      withHoldingTaxRate: '',
      vatTaxRate: '16%',
    });

    component.saveServiceProviderType();

    expect(
      serviceProviderTypeServiceStub.createServiceProviderType
    ).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created a Service Provider Type'
    );
    expect(component.fetchServiceProviderTypes).toHaveBeenCalled();
  });

  test('should handle error when saving a Service Provider Type', () => {
    component.createServiceProviderTypeForm.setValue({
      shortDescription: 'TT',
      name: 'Test SPT',
      status: 'A',
      withHoldingTaxRate: '',
      vatTaxRate: '16%',
    });
    const errorMessage = 'Failed to save a Service Provider Type';
    jest
      .spyOn(serviceProviderTypeServiceStub, 'createServiceProviderType')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));
    component.saveServiceProviderType();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe(
      'Failed to save a Service Provider Type'
    );
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to save a Service Provider Type'
    );
  });

  test('should update a Service Provider Type', () => {
    jest.spyOn(component, 'fetchServiceProviderTypes');
    const formData = {
      shortDescription: 'TT-Update',
      name: 'Test SPT Updated',
      status: 'A',
      withHoldingTaxRate: '14%',
      vatTaxRate: '16%',
    };
    const selectedServiceProviderType = mockServiceProviderTypeData;

    component.selectedServiceProviderType = selectedServiceProviderType;
    const serviceProviderTypeId = selectedServiceProviderType.code;
    component.createServiceProviderTypeForm.setValue({
      shortDescription: 'TT-Update',
      name: 'Test SPT Updated',
      status: 'A',
      withHoldingTaxRate: '14%',
      vatTaxRate: '16%',
    });

    component.createServiceProviderTypeForm.patchValue(formData);

    jest.spyOn(serviceProviderTypeServiceStub, 'updateServiceProviderType');

    component.saveServiceProviderType();

    expect(
      serviceProviderTypeServiceStub.updateServiceProviderType
    ).toHaveBeenCalledWith(serviceProviderTypeId, {
      code: serviceProviderTypeId,
      name: formData.name,
      providerTypeSuffixes: '',
      shortDescription: formData.shortDescription,
      shortDescriptionNextNo: '',
      shortDescriptionSerialFormat: '',
      status: formData.status,
      vatTaxRate: formData.vatTaxRate,
      witholdingTaxRate: formData.withHoldingTaxRate,
    });
    expect(
      serviceProviderTypeServiceStub.updateServiceProviderType
    ).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated a Service Provider Type'
    );
    expect(component.fetchServiceProviderTypes).toHaveBeenCalled();
  });

  test('should open Service Provider Type modal and patch form values when a service provider type is selected', () => {
    jest.spyOn(component, 'openServiceProviderTypeModal');
    const selectedServiceProviderType = mockServiceProviderTypeData;
    component.selectedServiceProviderType = selectedServiceProviderType;

    component.editServiceProviderType();

    expect(component.openServiceProviderTypeModal).toHaveBeenCalled();
    expect(component.createServiceProviderTypeForm.value).toEqual({
      shortDescription: selectedServiceProviderType.shortDescription,
      name: selectedServiceProviderType.name,
      status: selectedServiceProviderType.status,
      withHoldingTaxRate: selectedServiceProviderType.witholdingTaxRate,
      vatTaxRate: selectedServiceProviderType.vatTaxRate,
    });
  });

  test('should display error message if no Service Provider Type is selected', () => {
    component.editServiceProviderType();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Service Provider Type is selected!.'
    );
  });

  test('should delete Sercive Provider Type and display success message in confirmServiceProviderTypeDelete', () => {
    jest.spyOn(component, 'fetchServiceProviderTypes');
    jest.spyOn(serviceProviderTypeServiceStub, 'deleteServiceProviderType');

    const selectedServiceProviderType = mockServiceProviderTypeData;

    component.selectedServiceProviderType = selectedServiceProviderType;

    component.confirmServiceProviderTypeDelete();

    expect(
      serviceProviderTypeServiceStub.deleteServiceProviderType
    ).toHaveBeenCalledWith(selectedServiceProviderType.code);
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'success',
      'Successfully deleted a Service Provider Type'
    );
    expect(component.selectedServiceProviderType).toBeNull();
    expect(component.fetchServiceProviderTypes).toHaveBeenCalled();
  });

  test('should display error message if no Service Provider Type is selected in confirmServiceProviderTypeDelete', () => {
    component.confirmServiceProviderTypeDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Service Provider Type is selected!.'
    );
  });
});
