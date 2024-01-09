import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserParametersComponent } from './user-parameters.component';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';
import { of } from 'rxjs';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ParameterService } from '../../services/parameter.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../../../shared/shared.module';
import { UserParameterDTO } from '../../data/user-parameter-dto';

const mockParameterData: UserParameterDTO[] = [
  {
    description: '',
    id: 0,
    name: '',
    organizationId: 0,
    parameterError: '',
    status: '',
    value: '',
  },
];

const mockStatusData: StatusDTO[] = [
  {
    name: '',
    value: '',
  },
];

export class MockParameterService {
  getParameter = jest.fn().mockReturnValue(of(mockParameterData));
  updateParameter = jest.fn().mockReturnValue(of());
}

export class MockStatusService {
  getStatus = jest.fn().mockReturnValue(of(mockStatusData));
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('UserParametersComponent', () => {
  let component: UserParametersComponent;
  let fixture: ComponentFixture<UserParametersComponent>;
  let parameterServiceStub: ParameterService;
  let statusServiceStub: StatusService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserParametersComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TableModule,
        SharedModule,
      ],
      providers: [
        { provide: ParameterService, useClass: MockParameterService },
        { provide: StatusService, useClass: MockStatusService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
      ],
    });
    fixture = TestBed.createComponent(UserParametersComponent);
    component = fixture.componentInstance;
    parameterServiceStub = TestBed.inject(ParameterService);
    statusServiceStub = TestBed.inject(StatusService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch parameters', () => {
    jest.spyOn(parameterServiceStub, 'getParameter');
    component.fetchParameters();
    expect(parameterServiceStub.getParameter).toHaveBeenCalled();
    expect(component.userParametersData).toEqual(mockParameterData);
  });

  test('should fetch statuses', () => {
    jest.spyOn(statusServiceStub, 'getStatus');
    component.fetchStatuses();
    expect(statusServiceStub.getStatus).toHaveBeenCalled();
    expect(component.statusesData).toEqual(mockStatusData);
  });

  test('should update parameters', () => {
    const updateParameterSpy = jest.spyOn(
      parameterServiceStub,
      'updateParameter'
    );
    const displaySuccessMessageSpy = jest.spyOn(
      messageServiceStub,
      'displaySuccessMessage'
    );

    // Set selectedParameter
    component.selectedParameter = {
      id: 1,
      name: 'Test Parameter',
      value: 'Test Value',
      status: 'Active',
      description: 'Test Description',
      organizationId: 1,
      parameterError: null,
    };

    // Update form values
    component.createParameterForm.patchValue({
      name: 'Updated Parameter',
      value: 'Updated Value',
      status: 'Inactive',
      description: 'Updated Description',
    });

    component.updateParameters();

    expect(updateParameterSpy).toHaveBeenCalledWith(1, {
      id: 1,
      name: 'Updated Parameter',
      value: 'Updated Value',
      status: 'Inactive',
      description: 'Updated Description',
      organizationId: 1,
      parameterError: null,
    });

    // expect(displaySuccessMessageSpy).toHaveBeenCalledWith(
    //   'Success',
    //   'Successfully Updated a User Parameter'
    // );
  });

  test('should set selectedParameter on onParamsRowClick', () => {
    const mockParameter: UserParameterDTO = {
      id: 1,
      name: 'Test Parameter',
      value: 'Test Value',
      status: 'Active',
      description: 'Test Description',
      organizationId: 1,
      parameterError: null,
    };

    component.onParamsRowClick(mockParameter);
    expect(component.selectedParameter).toEqual(mockParameter);
  });

  test('should filter parameters on filterParameters', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(
      component.parameterTable,
      'filterGlobal'
    );

    component.filterParameters(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should open Branch Parameter Modal', () => {
    component.openParameterModal();

    const modal = document.getElementById('parameterModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Parameter Modal', () => {
    const modal = document.getElementById('parameterModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeParameterModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should edit parameter on editParameter', () => {
    const mockParameter: UserParameterDTO = {
      id: 1,
      name: 'Test Parameter',
      value: 'Test Value',
      status: 'Active',
      description: 'Test Description',
      organizationId: 1,
      parameterError: null,
    };

    component.selectedParameter = mockParameter;
    const openParameterModalSpy = jest.spyOn(component, 'openParameterModal');
    const patchValueSpy = jest.spyOn(
      component.createParameterForm,
      'patchValue'
    );
    // const displayErrorMessageSpy = jest.spyOn(
    //   component.globalMessagingService,
    //   'displayErrorMessage'
    // );

    component.editParameter();

    expect(openParameterModalSpy).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      name: mockParameter.name,
      value: mockParameter.value,
      status: mockParameter.status,
      description: mockParameter.description,
    });
    // expect(displayErrorMessageSpy).not.toHaveBeenCalled();
  });
});
