import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';

import { LeadSourcesStatusesComponent } from './lead-sources-statuses.component';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { LeadsService } from '../../services/leads.service';
import { SharedModule } from '../../../../shared/shared.module';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';
import { LeadSourceDto, LeadStatusDto } from '../../data/leads';

const mockLeadSourcesData: LeadSourceDto[] = [
  {
    code: 1,
    description: 'Social Media',
  },
  {
    code: 2,
    description: 'Walk-In',
  },
];

const mockLeadSourceData: LeadSourceDto = {
  code: 1,
  description: 'Social Media',
};

const mockLeadStatusesData: LeadStatusDto[] = [
  {
    code: 1,
    description: 'Interested',
  },

  {
    code: 2,
    description: 'Not Interested',
  },
];

const mockLeadStatusData: LeadStatusDto = {
  code: 1,
  description: 'Interested',
};

const mockMandatoryData: MandatoryFieldsDTO[] = [
  {
    id: 0,
    fieldName: '',
    fieldLabel: '',
    mandatoryStatus: 'Y',
    visibleStatus: 'Y',
    disabledStatus: 'N',
    frontedId: 'description',
    screenName: '',
    groupId: '',
    module: '',
  },
];

export class MockLeadService {
  getLeadSources = jest.fn().mockReturnValue(of(mockLeadSourcesData));
  createLeadSources = jest.fn().mockReturnValue(of(mockLeadSourceData));
  updateLeadSources = jest.fn().mockReturnValue(of(mockLeadSourceData));
  deleteLeadSources = jest.fn().mockReturnValue(of(mockLeadSourceData));
  getLeadStatuses = jest.fn().mockReturnValue(of(mockLeadStatusesData));
  createLeadStatuses = jest.fn().mockReturnValue(of(mockLeadStatusData));
  updateLeadStatuses = jest.fn().mockReturnValue(of(mockLeadStatusData));
  deleteLeadStatuses = jest.fn().mockReturnValue(of(mockLeadStatusData));
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

describe('LeadSourcesStatusesComponent', () => {
  let component: LeadSourcesStatusesComponent;
  let fixture: ComponentFixture<LeadSourcesStatusesComponent>;
  let leadServiceStub: LeadsService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadSourcesStatusesComponent],
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
          provide: LeadsService,
          useClass: MockLeadService,
        },
        {
          provide: MandatoryFieldsService,
          useClass: MockMandatoryService,
        },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
      ],
    });
    fixture = TestBed.createComponent(LeadSourcesStatusesComponent);
    component = fixture.componentInstance;
    leadServiceStub = TestBed.inject(LeadsService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should filter lead sources on filterLeadSources', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(component.sourceTable, 'filterGlobal');

    component.filterLeadSources(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should filter lead statuses on filterLeadStatuses', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(component.statusTable, 'filterGlobal');

    component.filterLeadStatuses(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should set the selected lead source when a lead source is selected', () => {
    expect(component.selectedLeadSource).toBeNull();
    component.onLeadSourcesRowSelect(mockLeadSourceData);

    expect(component.selectedLeadSource).toEqual(mockLeadSourceData);
  });

  test('should set the selected lead status when a lead status is selected', () => {
    expect(component.selectedLeadStatus).toBeNull();
    component.onLeadStatusesRowSelect(mockLeadStatusData);

    expect(component.selectedLeadStatus).toEqual(mockLeadStatusData);
  });

  test('should open Lead Source Modal', () => {
    component.openLeadSourceModal();

    const modal = document.getElementById('sourceModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Lead Source Modal', () => {
    const modal = document.getElementById('sourceModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeLeadSourceModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open Lead Status Modal', () => {
    component.openLeadStatusModal();

    const modal = document.getElementById('statusModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Lead Status Modal', () => {
    const modal = document.getElementById('statusModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeLeadStatusModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should fetch lead sources successfully', () => {
    jest.spyOn(leadServiceStub, 'getLeadSources');
    component.fetchLeadSources();
    expect(leadServiceStub.getLeadSources).toHaveBeenCalled();
    expect(component.leadSourcesData).toEqual(mockLeadSourcesData);
  });

  test('should handle error when fetching lead sources', () => {
    const errorMessage = 'Failed to fetch lead sources';
    jest
      .spyOn(leadServiceStub, 'getLeadSources')
      .mockReturnValue(throwError({ message: errorMessage }));
    component.fetchLeadSources();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to fetch lead sources');
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to fetch lead sources'
    );
  });

  test('should fetch lead statuses successfully', () => {
    jest.spyOn(leadServiceStub, 'getLeadStatuses');
    component.fetchLeadStatuses();
    expect(leadServiceStub.getLeadStatuses).toHaveBeenCalled();
    expect(component.leadStatusesData).toEqual(mockLeadStatusesData);
  });

  test('should handle error when fetching lead statuses', () => {
    const errorMessage = 'Failed to fetch lead statuses';
    jest
      .spyOn(leadServiceStub, 'getLeadStatuses')
      .mockReturnValue(throwError({ message: errorMessage }));
    component.fetchLeadStatuses();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to fetch lead statuses');
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to fetch lead statuses'
    );
  });

  test('should save a new lead source', () => {
    jest.spyOn(component, 'fetchLeadSources');
    component.createLeadSourceForm.setValue({
      description: 'Walk-In',
    });

    component.saveLeadSource();

    expect(leadServiceStub.createLeadSources).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created a Lead Source'
    );
    expect(component.fetchLeadSources).toHaveBeenCalled();
  });

  test('should handle error when saving a lead source', () => {
    component.createLeadSourceForm.setValue({
      description: 'Walk-In',
    });
    const errorMessage = 'Failed to save a lead source';
    jest
      .spyOn(leadServiceStub, 'createLeadSources')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));
    component.saveLeadSource();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to save a lead source');
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to save a lead source'
    );
  });

  test('should update a lead source', () => {
    jest.spyOn(component, 'fetchLeadSources');
    const formData = {
      description: 'Updated Walk-In',
    };

    component.selectedLeadSource = mockLeadSourceData;
    const leadSourceId = mockLeadSourceData.code;

    component.createLeadSourceForm.patchValue(formData);

    jest.spyOn(leadServiceStub, 'updateLeadSources');

    component.saveLeadSource();

    expect(leadServiceStub.updateLeadSources).toHaveBeenCalledWith(
      leadSourceId,
      {
        description: formData.description,
        code: leadSourceId,
      }
    );
    expect(leadServiceStub.updateLeadSources).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated a Lead Source'
    );
    expect(component.fetchLeadSources).toHaveBeenCalled();
  });

  test('should open lead source modal and patch form values when a lead source is selected', () => {
    jest.spyOn(component, 'openLeadSourceModal');

    component.selectedLeadSource = mockLeadSourceData;

    component.editLeadSource();

    expect(component.openLeadSourceModal).toHaveBeenCalled();
    expect(component.createLeadSourceForm.value).toEqual({
      description: mockLeadSourceData.description,
    });
  });

  test('should display error message if no lead source is selected', () => {
    component.editLeadSource();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Lead Source is selected!.'
    );
  });

  test('should delete lead source and display success message in confirmLeadSourceDelete', () => {
    jest.spyOn(component, 'fetchLeadSources');

    component.selectedLeadSource = mockLeadSourceData;

    const deleteLeadSourceResponse = mockLeadSourceData;

    jest
      .spyOn(leadServiceStub, 'deleteLeadSources')
      .mockReturnValue(of(deleteLeadSourceResponse));

    component.confirmLeadSourceDelete();

    expect(leadServiceStub.deleteLeadSources).toHaveBeenCalledWith(
      mockLeadSourceData.code
    );
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'success',
      'Successfully deleted a Lead Source'
    );
    expect(component.selectedLeadSource).toBeNull();
    expect(component.fetchLeadSources).toHaveBeenCalled();
  });

  test('should display error message if no lead source is selected in confirmLeadSourceDelete', () => {
    component.confirmLeadSourceDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Lead Source is selected!.'
    );
  });

  test('should save a new lead status', () => {
    jest.spyOn(component, 'fetchLeadStatuses');
    component.createLeadStatusForm.setValue({
      statusDescription: 'Interested',
    });

    component.saveLeadStatus();

    expect(leadServiceStub.createLeadStatuses).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Created a Lead Status'
    );
    expect(component.fetchLeadStatuses).toHaveBeenCalled();
  });

  test('should handle error when saving a lead status', () => {
    component.createLeadStatusForm.setValue({
      statusDescription: 'Interested',
    });
    const errorMessage = 'Failed to save a lead status';
    jest
      .spyOn(leadServiceStub, 'createLeadStatuses')
      .mockReturnValue(throwError({ error: { errors: [errorMessage] } }));
    component.saveLeadStatus();
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Failed to save a lead status');
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to save a lead status'
    );
  });

  test('should update a lead status', () => {
    jest.spyOn(component, 'fetchLeadStatuses');
    const formData = {
      statusDescription: 'Updated Interested',
    };

    component.selectedLeadStatus = mockLeadStatusData;
    const leadStatusId = mockLeadStatusData.code;

    component.createLeadStatusForm.patchValue(formData);

    jest.spyOn(leadServiceStub, 'updateLeadStatuses');

    component.saveLeadStatus();

    expect(leadServiceStub.updateLeadStatuses).toHaveBeenCalledWith(
      leadStatusId,
      {
        description: formData.statusDescription,
        code: leadStatusId,
      }
    );
    expect(leadServiceStub.updateLeadStatuses).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Successfully Updated a Lead Status'
    );
    expect(component.fetchLeadStatuses).toHaveBeenCalled();
  });

  test('should open lead status modal and patch form values when a lead status is selected', () => {
    jest.spyOn(component, 'openLeadStatusModal');

    component.selectedLeadStatus = mockLeadStatusData;

    component.editLeadStatus();

    expect(component.openLeadStatusModal).toHaveBeenCalled();
    expect(component.createLeadStatusForm.value).toEqual({
      statusDescription: mockLeadStatusData.description,
    });
  });

  test('should display error message if no lead status is selected', () => {
    component.editLeadStatus();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Lead Status is selected!.'
    );
  });

  test('should delete lead status and display success message in confirmLeadStatusDelete', () => {
    jest.spyOn(component, 'fetchLeadStatuses');

    component.selectedLeadStatus = mockLeadStatusData;

    const deleteLeadStatusResponse = mockLeadStatusData;

    jest
      .spyOn(leadServiceStub, 'deleteLeadSources')
      .mockReturnValue(of(deleteLeadStatusResponse));

    component.confirmLeadStatusDelete();

    expect(leadServiceStub.deleteLeadStatuses).toHaveBeenCalledWith(
      mockLeadStatusData.code
    );
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'success',
      'Successfully deleted a Lead Status'
    );
    expect(component.selectedLeadStatus).toBeNull();
    expect(component.fetchLeadStatuses).toHaveBeenCalled();
  });

  test('should display error message if no lead status is selected in confirmLeadStatusDelete', () => {
    component.confirmLeadStatusDelete();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Lead Status is selected!.'
    );
  });
});
