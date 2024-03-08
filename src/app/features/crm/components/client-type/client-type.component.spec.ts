import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';

import { ClientTypeComponent } from './client-type.component';
import { ClientTypeService } from '../../../../shared/services/setups/client-type/client-type.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';
import { SharedModule } from '../../../../shared/shared.module';
import { ClientTypeDTO } from 'src/app/shared/data/common/client-type';

const mockClientTypesData: ClientTypeDTO[] = [
  {
    category: 'Individual',
    clientTypeName: 'Government',
    code: 1,
    description: 'GK',
    organizationId: 1,
    person: 'Y',
    type: 'individual',
  },
  {
    category: 'Corporate',
    clientTypeName: 'Direct',
    code: 2,
    description: 'DR',
    organizationId: 2,
    person: 'Y',
    type: 'corporate',
  },
];

const mockClientTypeData: ClientTypeDTO = {
  category: 'Corporate',
  clientTypeName: 'Direct',
  code: 2,
  description: 'DR',
  organizationId: 2,
  person: 'Y',
  type: 'Corporate',
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

export class MockClientTypeService {
  getClientType = jest.fn().mockReturnValue(of(mockClientTypesData));
  createClientType = jest.fn().mockReturnValue(of(mockClientTypeData));
  updateClientType = jest.fn().mockReturnValue(of(mockClientTypeData));
  deleteClientType = jest.fn().mockReturnValue(of(mockClientTypeData));
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest
    .fn()
    .mockReturnValue(of(mockMandatoryData));
}

export class MockGlobalMessagingService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}
export class MockUtilService {
  findScrollContainer(control: any) {
    return document.createElement('div');
  }
}

describe('ClientTypeComponent', () => {
  let component: ClientTypeComponent;
  let fixture: ComponentFixture<ClientTypeComponent>;
  let clientTypeServiceStub: ClientTypeService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let messageServiceStub: GlobalMessagingService;
  let utilServiceStub: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientTypeComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        TableModule,
        SharedModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ClientTypeService,
          useClass: MockClientTypeService,
        },
        {
          provide: MandatoryFieldsService,
          useClass: MockMandatoryService,
        },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
        {
          provide: UtilService,
          useClass: MockUtilService,
        },
      ],
    });
    fixture = TestBed.createComponent(ClientTypeComponent);
    component = fixture.componentInstance;
    clientTypeServiceStub = TestBed.inject(ClientTypeService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    utilServiceStub = TestBed.inject(UtilService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should filter Client Type on filterClientType', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(
      component.clientTypeTable,
      'filterGlobal'
    );

    component.filterClientType(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should set the selected Client Type when a Client Type is selected', () => {
    expect(component.selectedClientType).toBeUndefined();
    component.onClientTypeRowSelect(mockClientTypeData);

    expect(component.selectedClientType).toEqual(mockClientTypeData);
  });

  test('should open Client Type Modal', () => {
    component.openClientTypeModal();

    const modal = document.getElementById('clientTypeModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Client Type Modal', () => {
    const modal = document.getElementById('clientTypeModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeClientTypeModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  // test('should handle error when client type form is invalid', () => {
  //   component.submitted = true;
  //   component.createClientTypeForm.markAllAsTouched();

  //   const mockInvalidControl1: HTMLInputElement =
  //     document.createElement('input');
  //   mockInvalidControl1.classList.add('is-invalid');
  //   mockInvalidControl1.value = '';
  //   document.body.appendChild(mockInvalidControl1);

  //   const mockInvalidControl2: HTMLInputElement =
  //     document.createElement('input');
  //   mockInvalidControl2.classList.add('is-invalid');
  //   mockInvalidControl2.value = 'Some Value';
  //   document.body.appendChild(mockInvalidControl2);

  //   const focusSpy = jest.spyOn(mockInvalidControl1, 'focus');

  //   jest.spyOn(utilServiceStub, 'findScrollContainer').mockReturnValue(null);

  //   component.saveClientType();

  //   expect(focusSpy).toHaveBeenCalled();

  //   expect(document.documentElement.scrollTop).toBe(0);
  // });

  test('should save a new Client Type', () => {
    jest.spyOn(component, 'fetchClientTypes');
    component.createClientTypeForm.setValue({
      category: 'Corporate',
      clientTypeName: 'Direct',
      description: 'DR',
    });

    component.saveClientType();

    expect(clientTypeServiceStub.createClientType).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created a Client Type'
    );
    expect(component.fetchClientTypes).toHaveBeenCalled();
  });

  test('should handle error when saving a Client Type', () => {
    component.createClientTypeForm.setValue({
      category: 'Corporate',
      clientTypeName: 'Direct',
      description: 'DR',
    });

    const errorMessage = 'Failed to save a Client Type';

    jest
      .spyOn(clientTypeServiceStub, 'createClientType')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));

    component.saveClientType();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to save a Client Type');
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to save a Client Type'
    );
  });

  test('should update a Client Type', () => {
    jest.spyOn(component, 'fetchClientTypes');
    const formData = {
      category: 'Corporate',
      clientTypeName: 'Direct',
      description: 'DR',
    };
    const selectedClientType = mockClientTypeData;

    component.selectedClientType = selectedClientType;
    const clientTypeCode = selectedClientType.code;
    component.createClientTypeForm.setValue({
      category: 'Corporate',
      clientTypeName: 'Direct',
      description: 'DR',
    });

    component.createClientTypeForm.patchValue(formData);

    jest.spyOn(clientTypeServiceStub, 'updateClientType');

    component.saveClientType();

    expect(clientTypeServiceStub.updateClientType).toHaveBeenCalledWith(
      clientTypeCode,
      {
        category: formData.category,
        clientTypeName: formData.clientTypeName,
        code: clientTypeCode,
        description: formData.description,
        organizationId: selectedClientType.organizationId,
        person: selectedClientType.person,
        type: selectedClientType.type,
      }
    );
    expect(clientTypeServiceStub.updateClientType).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated a Client Type'
    );
    expect(component.fetchClientTypes).toHaveBeenCalled();
  });

  test('should handle error when updating a Client Type', () => {
    jest.spyOn(component, 'fetchClientTypes');

    const formData = {
      category: 'Corporate',
      clientTypeName: 'Direct',
      description: 'DR',
    };

    const selectedClientType = mockClientTypeData;

    component.selectedClientType = selectedClientType;
    const clientTypeCode = selectedClientType.code;

    component.createClientTypeForm.setValue(formData);
    component.createClientTypeForm.patchValue(formData);

    const errorMessage = 'Failed to update a Client Type';
    jest
      .spyOn(clientTypeServiceStub, 'updateClientType')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));

    component.saveClientType();

    expect(clientTypeServiceStub.updateClientType).toHaveBeenCalledWith(
      clientTypeCode,
      {
        category: formData.category,
        clientTypeName: formData.clientTypeName,
        code: clientTypeCode,
        description: formData.description,
        organizationId: selectedClientType.organizationId,
        person: selectedClientType.person,
        type: selectedClientType.type,
      }
    );

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe(errorMessage);
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      errorMessage
    );
    expect(component.fetchClientTypes).not.toHaveBeenCalled();
  });

  test('should open client type modal and patch form values when a client type is selected', () => {
    jest.spyOn(component, 'openClientTypeModal');
    const selectedClientType = mockClientTypeData;
    component.selectedClientType = selectedClientType;

    component.editClientType();

    expect(component.openClientTypeModal).toHaveBeenCalled();
    expect(component.createClientTypeForm.value).toEqual({
      category: selectedClientType.category,
      clientTypeName: selectedClientType.clientTypeName,
      description: selectedClientType.description,
    });
  });

  test('should display error message if no client type is selected', () => {
    component.editClientType();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Client Type is selected!.'
    );
  });

  test('should delete Client Type and display success message in confirmClientTypeDelete', () => {
    jest.spyOn(component, 'fetchClientTypes');
    jest.spyOn(clientTypeServiceStub, 'deleteClientType');

    const selectedClientType = mockClientTypeData;

    component.selectedClientType = selectedClientType;

    component.confirmClientTypeDelete();

    expect(clientTypeServiceStub.deleteClientType).toHaveBeenCalledWith(
      selectedClientType.code
    );
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'success',
      'Successfully deleted a Client Type'
    );
    expect(component.selectedClientType).toBeNull();
    expect(component.fetchClientTypes).toHaveBeenCalled();
  });

  test('should handle error when delete fails in confirmClientTypeDelete', () => {
    const selectedClientType = mockClientTypeData;
    component.selectedClientType = selectedClientType;

    jest
      .spyOn(clientTypeServiceStub, 'deleteClientType')
      .mockReturnValue(
        throwError({ error: { errors: ['Failed to delete Client Type'] } })
      );

    component.confirmClientTypeDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to delete Client Type'
    );
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to delete Client Type');
  });

  test('should display error message if no Client Type is selected in confirmClientTypeDelete', () => {
    component.confirmClientTypeDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Client Type is selected!.'
    );
  });
});
