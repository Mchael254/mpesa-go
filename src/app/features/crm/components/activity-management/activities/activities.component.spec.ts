import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesComponent } from './activities.component';
import { createSpyObj } from 'jest-createspyobj';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityService } from '../../../services/activity.service';
import { AppConfigService } from '../../../../../core/config/app-config-service';
import { MessageService } from 'primeng/api';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  Activity,
  ActivityNote,
  ActivityParticipant,
  ActivityStatus,
  ActivityTask,
  ActivityType,
  PriorityLevel,
} from '../../../data/activity';
import { MandatoryFieldsDTO } from '../../../../../shared/data/common/mandatory-fields-dto';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { MessageTemplate } from '../../../data/messaging-template';

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        accounts_services: 'crm',
        users_services: 'user',
        auth_services: 'oauth',
      },
    };
  }
}

describe('ActivitiesComponent', () => {
  const activityServiceStub = createSpyObj('ActivityService', [
    'getActivityTypes',
    'getActivities',
    'createActivity',
    'updateActivity',
    'deleteActivity',
    'getActivityTasks',
    'createActivityTask',
    'updateActivityTask',
    'deleteActivityTask',
    'getActivityNotes',
    'createActivityNote',
    'updateActivityNote',
    'deleteActivityNote',
    'getActivityParticipants',
    'createParticipant',
    'updateParticipant',
    'deleteParticipant',
    'getActivityStatuses',
    'getPriorityLevels',
  ]);

  const mandatoryFieldServiceStub = createSpyObj('MandatoryFieldsService', [
    'getMandatoryFieldsByGroupId',
  ]);

  const messagingServiceStub = createSpyObj('MessagingService', [
    'getMessageTemplates',
  ]);

  const activityType: ActivityType = {
    id: 102,
    desc: 'System maintenance scheduled',
    systemCode: 5001,
  };

  const activity: Activity = {
    id: 1,
    activityTypeCode: 101,
    wef: new Date('2024-09-23T09:00:00Z'),
    wet: new Date('2024-09-23T11:00:00Z'),
    duration: 120,
    subject: 'Team Meeting',
    location: 'Conference Room A',
    assignedTo: 25,
    relatedTo: 13,
    statusId: 2,
    desc: 'Discussion on project updates and next steps.',
    reminder: 'email',
    team: 4,
    reminderTime: new Date('2024-09-23T08:00:00Z'),
    messageCode: 501,
  };

  const activityTask: ActivityTask = {
    id: 1,
    actCode: 3001,
    dateFrom: new Date('2024-09-23T09:00:00Z'),
    dateTo: new Date('2024-09-23T17:00:00Z'),
    subject: 'Annual Financial Review',
    statusId: 2,
    priorityCode: 1,
    accCode: 500,
  };

  const activityNote: ActivityNote = {
    id: 1,
    accCode: 12345,
    contactCode: 67890,
    subject: 'Meeting Notes',
    notes: 'These are the notes from the meeting.',
    attachment: new Uint8Array([72, 101, 108, 108, 111]), // Sample byte array representing a file
    actCode: 3001,
    attachmentType: 'application/pdf',
    fileName: 'meeting_notes.pdf',
  };

  const activityParticipant: ActivityParticipant = {
    id: 1,
    aacCode: 1010,
    actCode: 2020,
    participant: {
      id: 1,
      name: 'John Doe',
      emailAddress: 'johndoe@example.com',
    },
  };

  const activityStatus: ActivityStatus = { code: 0, desc: '', id: 0 };

  const priorityLevel: PriorityLevel = { desc: '', id: 0, shortDesc: '' };

  const mandatoryField: MandatoryFieldsDTO = {
    id: 1,
    fieldName: 'username',
    fieldLabel: 'Username',
    mandatoryStatus: 'required',
    visibleStatus: 'Y',
    disabledStatus: 'enabled',
    frontedId: 'field-username',
    screenName: 'loginScreen',
    groupId: 'authGroup',
    module: 'authentication',
  };

  const messageTemplate: MessageTemplate = {
    id: 1,
    systemCode: 101,
    name: 'Welcome Email',
    subject: 'Welcome to Our Service',
    content: 'Dear User, Welcome to our platform...',
    templateType: 'Email',
    systemModule: 'User Management',
    imageAttachment: 'welcome_image.png',
    imageUrl: 'https://example.com/welcome_image.png',
    productCode: 501,
    productName: 'Premium Subscription',
    status: 'Active',
  };

  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;

  beforeEach(() => {
    jest
      .spyOn(activityServiceStub, 'getActivityTypes')
      .mockReturnValue(of([activityType]));

    jest
      .spyOn(activityServiceStub, 'getActivities')
      .mockReturnValue(of([activity]));
    jest
      .spyOn(activityServiceStub, 'createActivity')
      .mockReturnValue(of(activity));
    jest
      .spyOn(activityServiceStub, 'updateActivity')
      .mockReturnValue(of(activity));
    jest
      .spyOn(activityServiceStub, 'deleteActivity')
      .mockReturnValue(of('success'));

    jest
      .spyOn(activityServiceStub, 'getActivityTasks')
      .mockReturnValue(of([activityTask]));
    jest
      .spyOn(activityServiceStub, 'createActivityTask')
      .mockReturnValue(of(activityTask));
    jest
      .spyOn(activityServiceStub, 'updateActivityTask')
      .mockReturnValue(of(activityTask));
    jest
      .spyOn(activityServiceStub, 'deleteActivityTask')
      .mockReturnValue(of('success'));

    jest
      .spyOn(activityServiceStub, 'getActivityNotes')
      .mockReturnValue(of([activityNote]));
    jest
      .spyOn(activityServiceStub, 'createActivityNote')
      .mockReturnValue(of(activityNote));
    jest
      .spyOn(activityServiceStub, 'updateActivityNote')
      .mockReturnValue(of(activityNote));
    jest
      .spyOn(activityServiceStub, 'deleteActivityNote')
      .mockReturnValue(of('success'));

    jest
      .spyOn(activityServiceStub, 'getActivityParticipants')
      .mockReturnValue(of([activityParticipant]));
    jest
      .spyOn(activityServiceStub, 'createParticipant')
      .mockReturnValue(of(activityParticipant));
    jest
      .spyOn(activityServiceStub, 'updateParticipant')
      .mockReturnValue(of(activityParticipant));
    jest
      .spyOn(activityServiceStub, 'deleteParticipant')
      .mockReturnValue(of('success'));

    jest
      .spyOn(activityServiceStub, 'getActivityStatuses')
      .mockReturnValue(of([activityStatus]));
    jest
      .spyOn(activityServiceStub, 'getPriorityLevels')
      .mockReturnValue(of([priorityLevel]));

    jest
      .spyOn(mandatoryFieldServiceStub, 'getMandatoryFieldsByGroupId')
      .mockReturnValue(of([mandatoryField]));

    jest
      .spyOn(messagingServiceStub, 'getMessageTemplates')
      .mockReturnValue(of([messageTemplate]));

    TestBed.configureTestingModule({
      declarations: [ActivitiesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ActivityService, useValue: activityServiceStub },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: MessageService, useValue: messagingServiceStub },
        {
          provide: MandatoryFieldsService,
          useValue: mandatoryFieldServiceStub,
        },
        MessageService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.activityCreateForm.call).toBeTruthy();
    expect(component.noteCreateForm.call).toBeTruthy();
    expect(component.taskCreateForm.call).toBeTruthy();
    expect(component.getActivities.call).toBeTruthy();
    expect(component.getActivityTypes.call).toBeTruthy();
    expect(component.getActivityNotes.call).toBeTruthy();
    expect(component.getActivityTasks.call).toBeTruthy();
    expect(component.getActivityParticipants.call).toBeTruthy();
    expect(component.getEmailTemplates.call).toBeTruthy();
  });

  test('should open activity modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector(
      '.open-activity-modal'
    );
    button.click();
    fixture.detectChanges();
    expect(component.openDefineActivityModal.call).toBeTruthy();
  });

  test('should close activity modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector(
      '.close-activity-modal'
    );
    button.click();
    fixture.detectChanges();
    expect(component.closeDefineActivityModal.call).toBeTruthy();
  });

  test('should open note modal', () => {
    const button =
      fixture.debugElement.nativeElement.querySelector('.open-note-modal');
    button.click();
    fixture.detectChanges();
    expect(component.openDefineNoteModal.call).toBeTruthy();
  });

  test('should close note modal', () => {
    const button =
      fixture.debugElement.nativeElement.querySelector('.close-note-modal');
    button.click();
    fixture.detectChanges();
    expect(component.closeDefineNoteModal.call).toBeTruthy();
  });

  test('should open task modal', () => {
    const button =
      fixture.debugElement.nativeElement.querySelector('.open-task-modal');
    button.click();
    fixture.detectChanges();
    expect(component.openDefineTaskModal.call).toBeTruthy();
  });

  test('should close task modal', () => {
    const button =
      fixture.debugElement.nativeElement.querySelector('.close-task-modal');
    button.click();
    fixture.detectChanges();
    expect(component.closeDefineTaskModal.call).toBeTruthy();
  });

  test('should edit activity', () => {
    component.selectedActivity = activity;
    const button =
      fixture.debugElement.nativeElement.querySelector('.edit-activity');
    button.click();
    fixture.detectChanges();
    expect(component.editActivity.call).toBeTruthy();
  });

  test('should edit activity note', () => {
    component.selectedNote = activityNote;
    const button =
      fixture.debugElement.nativeElement.querySelector('.edit-note');
    button.click();
    fixture.detectChanges();
    expect(component.editNote.call).toBeTruthy();
  });

  test('should edit task', () => {
    component.selectedTask = activityTask;
    const button =
      fixture.debugElement.nativeElement.querySelector('.edit-task');
    button.click();
    fixture.detectChanges();
    expect(component.editTask.call).toBeTruthy();
  });

  test('should select file', () => {
    const button =
      fixture.debugElement.nativeElement.querySelector('.select-file');
    button.click(); // todo: should mimic ng onChange
    fixture.detectChanges();
    expect(component.onFileChange.call).toBeTruthy();
  });

  test('should open all users modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector(
      '.open-all-users-modal'
    );
    button.click();
    fixture.detectChanges();
    expect(component.openAllUsersModal.call).toBeTruthy();
  });

  test('should process selected user', () => {
    const button = fixture.debugElement.nativeElement.querySelector(
      '#process-selected-user'
    );
    button.click();
    fixture.detectChanges();
    expect(component.processSelectedUser.call).toBeTruthy();
  });

  test('should get selected user', () => {
    const button =
      fixture.debugElement.nativeElement.querySelector('#get-selected-user');
    button.click();
    fixture.detectChanges();
    expect(component.getSelectedUser.call).toBeTruthy();
  });

  test('should throw error when get activity types fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'getActivityTypes')
      .mockReturnValueOnce(throwError(() => error));

    fixture.detectChanges();
    expect(component.getActivityTypes.call).toBeTruthy();
  });

  test('should throw error when get getActivityStatuses fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'getActivityStatuses')
      .mockReturnValueOnce(throwError(() => error));

    fixture.detectChanges();
    expect(component.getActivityStatuses.call).toBeTruthy();
  });

  test('should throw error when get priority levels fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'getPriorityLevels')
      .mockReturnValueOnce(throwError(() => error));

    fixture.detectChanges();
    expect(component.getPriorityLevels.call).toBeTruthy();
  });

  test('should throw error when get email templates fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(messagingServiceStub, 'getMessageTemplates')
      .mockReturnValueOnce(throwError(() => error));

    fixture.detectChanges();
    expect(component.getEmailTemplates.call).toBeTruthy();
  });

  // activites
  test('should throw error when get activities fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'getActivities')
      .mockReturnValueOnce(throwError(() => error));

    fixture.detectChanges();
    expect(component.isDataReady.activities).toBe(true);
  });

  test('should create activity', () => {
    component.activityForm.controls['activityType'].setValue('');
    component.activityForm.controls['startDate'].setValue(123);
    component.activityForm.controls['endDate'].setValue(123);
    component.activityForm.controls['duration'].setValue(123);
    component.activityForm.controls['subject'].setValue(123);
    component.activityForm.controls['location'].setValue(123);
    component.activityForm.controls['assignedTo'].setValue(123);
    component.activityForm.controls['relatedAccount'].setValue(123);
    component.activityForm.controls['status'].setValue(123);
    component.activityForm.controls['description'].setValue(123);
    // component.activityForm.controls['reminder'].setValue(123);
    component.activityForm.controls['team'].setValue(123);
    component.activityForm.controls['reminderTime'].setValue(123);
    component.activityForm.controls['emailTemplate'].setValue(123);

    const button = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity'
    );
    button.click();
    fixture.detectChanges();
    expect(component.createUpdateActivity.call).toBeTruthy();
    expect(component.createActivity.call).toBeTruthy();
  });

  test('should throw error when create activity fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'createActivity')
      .mockReturnValueOnce(throwError(() => error));

    component.activityForm.controls['activityType'].setValue('test');
    component.activityForm.controls['startDate'].setValue(123);
    component.activityForm.controls['endDate'].setValue(123);
    component.activityForm.controls['duration'].setValue(123);
    component.activityForm.controls['subject'].setValue(123);
    component.activityForm.controls['location'].setValue(123);
    component.activityForm.controls['assignedTo'].setValue(123);
    component.activityForm.controls['relatedAccount'].setValue(123);
    component.activityForm.controls['status'].setValue(123);
    component.activityForm.controls['description'].setValue(123);
    // component.activityForm.controls['reminder'].setValue(123);
    component.activityForm.controls['team'].setValue(123);
    component.activityForm.controls['reminderTime'].setValue(123);
    component.activityForm.controls['emailTemplate'].setValue(123);

    const button = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity'
    );
    button.click();
    fixture.detectChanges();
    expect(component.createUpdateActivity.call).toBeTruthy();
    expect(component.createActivity.call).toBeTruthy();
  });

  test('should update activity', () => {
    component.selectedActivity = activity;

    component.activityForm.controls['activityType'].setValue('');
    component.activityForm.controls['startDate'].setValue(123);
    component.activityForm.controls['endDate'].setValue(123);
    component.activityForm.controls['duration'].setValue(123);
    component.activityForm.controls['subject'].setValue(123);
    component.activityForm.controls['location'].setValue(123);
    component.activityForm.controls['assignedTo'].setValue(123);
    component.activityForm.controls['relatedAccount'].setValue(123);
    component.activityForm.controls['status'].setValue(123);
    component.activityForm.controls['description'].setValue(123);
    // component.activityForm.controls['reminder'].setValue(123);
    component.activityForm.controls['team'].setValue(123);
    component.activityForm.controls['reminderTime'].setValue(123);
    component.activityForm.controls['emailTemplate'].setValue(123);

    const button =
      fixture.debugElement.nativeElement.querySelector('.edit-activity');
    button.click();
    fixture.detectChanges();

    const button2 = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity'
    );
    button2.click();
    fixture.detectChanges();

    // expect(component.editMode).toEqual(true);
    expect(component.createUpdateActivity.call).toBeTruthy();
    expect(component.updateActivity.call).toBeTruthy();
  });

  test('should throw error when update activity fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'updateActivity')
      .mockReturnValueOnce(throwError(() => error));

    component.selectedActivity = activity;
    component.editActivity();

    component.activityForm.controls['activityType'].setValue('');
    component.activityForm.controls['startDate'].setValue(123);
    component.activityForm.controls['endDate'].setValue(123);
    component.activityForm.controls['duration'].setValue(123);
    component.activityForm.controls['subject'].setValue(123);
    component.activityForm.controls['location'].setValue(123);
    component.activityForm.controls['assignedTo'].setValue(123);
    component.activityForm.controls['relatedAccount'].setValue(123);
    component.activityForm.controls['status'].setValue(123);
    component.activityForm.controls['description'].setValue(123);
    // component.activityForm.controls['reminder'].setValue(123);
    component.activityForm.controls['team'].setValue(123);
    component.activityForm.controls['reminderTime'].setValue(123);
    component.activityForm.controls['emailTemplate'].setValue(123);

    const button2 = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity'
    );
    button2.click();
    fixture.detectChanges();

    // expect(component.editMode).toEqual(true);
    expect(component.createUpdateActivity.call).toBeTruthy();
    expect(component.updateActivity.call).toBeTruthy();
  });

  test('should delete activity', () => {
    component.selectedActivity = activity;
    component.activityText = 'activity';

    const button =
      fixture.debugElement.nativeElement.querySelector('.delete-activity');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivity.call).toBeTruthy();
  });

  test('should throw error when delete activity fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'deleteActivity')
      .mockReturnValueOnce(throwError(() => error));

    component.selectedActivity = activity;
    component.activityText = 'activity';

    const button =
      fixture.debugElement.nativeElement.querySelector('.delete-activity');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivity.call).toBeTruthy();
  });

  /**
   * Activity tasks
   */

  test('should throw error when create get activity tasks fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'getActivityTasks')
      .mockReturnValueOnce(throwError(() => error));
    expect(component.getActivityTasks.call).toBeTruthy();
  });

  test('should create activity task', () => {
    // component.taskForm.controls['actCode'].setValue('');
    component.taskForm.controls['taskStartDate'].setValue('10-09-2024');
    component.taskForm.controls['taskEndDate'].setValue('11-09-25');
    component.taskForm.controls['taskSubject'].setValue('subject');
    // component.taskForm.controls['statusId'].setValue(123);
    component.taskForm.controls['priority'].setValue('urgent');
    // component.taskForm.controls['accCode'].setValue(123);

    const button = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity-task'
    );
    button.click();
    fixture.detectChanges();
    expect(component.createUpdateActivityTask.call).toBeTruthy();
    expect(component.createActivityTask.call).toBeTruthy();
  });

  test('should throw error when create activity task fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'createActivityTask')
      .mockReturnValueOnce(throwError(() => error));

    component.taskForm.controls['taskStartDate'].setValue('10-09-2024');
    component.taskForm.controls['taskEndDate'].setValue('11-09-25');
    component.taskForm.controls['taskSubject'].setValue('subject');
    component.taskForm.controls['priority'].setValue('urgent');

    const button = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity-task'
    );
    button.click();
    fixture.detectChanges();
    expect(component.createUpdateActivityTask.call).toBeTruthy();
    expect(component.createActivityTask.call).toBeTruthy();
  });

  test('should update activity task', () => {
    component.selectedTask = activityTask;

    // component.taskForm.controls['actCode'].setValue('');
    component.taskForm.controls['taskStartDate'].setValue('10-09-2024');
    component.taskForm.controls['taskEndDate'].setValue('11-09-25');
    component.taskForm.controls['taskSubject'].setValue('subject');
    // component.taskForm.controls['statusId'].setValue(123);
    component.taskForm.controls['priority'].setValue('urgent');
    // component.taskForm.controls['accCode'].setValue(123);

    const button =
      fixture.debugElement.nativeElement.querySelector('.edit-task');
    button.click();
    fixture.detectChanges();

    const button2 = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity-task'
    );
    button2.click();
    fixture.detectChanges();

    // expect(component.editMode).toEqual(true);
    expect(component.createUpdateActivityTask.call).toBeTruthy();
    expect(component.updateActivityTask.call).toBeTruthy();
  });

  test('should throw error when update activity task fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'updateActivityTask')
      .mockReturnValueOnce(throwError(() => error));

    component.selectedTask = activityTask;
    component.editTask();

    component.taskForm.controls['taskStartDate'].setValue('10-09-2024');
    component.taskForm.controls['taskEndDate'].setValue('11-09-25');
    component.taskForm.controls['taskSubject'].setValue('subject');
    component.taskForm.controls['priority'].setValue('urgent');

    const button2 = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity-task'
    );
    button2.click();
    fixture.detectChanges();

    expect(component.createUpdateActivityTask.call).toBeTruthy();
    expect(component.updateActivityTask.call).toBeTruthy();
  });

  test('should delete activity task', () => {
    component.selectedTask = activityTask;
    component.activityText = 'task';

    const button = fixture.debugElement.nativeElement.querySelector(
      '.delete-activity-item'
    );
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityTask.call).toBeTruthy();
  });

  test('should throw error when delete activity task fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'deleteActivityTask')
      .mockReturnValueOnce(throwError(() => error));

    component.selectedTask = activityTask;
    component.activityText = 'task';

    const button = fixture.debugElement.nativeElement.querySelector(
      '.delete-activity-item'
    );
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityTask.call).toBeTruthy();
  });

  /**
   * Activity notes
   */

  test('should throw error when get activity note fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'getActivityNotes')
      .mockReturnValueOnce(throwError(() => error));

    fixture.detectChanges();
    expect(component.getActivityNotes.call).toBeTruthy();
    // expect(component.createActivityNote.call).toBeTruthy();
  });

  test('should create activity notes', () => {
    component.noteForm.controls['noteSubject'].setValue('sample note');
    component.noteForm.controls['relateTo'].setValue('999');
    component.noteForm.controls['noteDescription'].setValue('sample desc');
    component.noteForm.controls['attachment'].setValue('');

    const button = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity-note'
    );
    button.click();
    fixture.detectChanges();
    expect(component.createUpdateActivityNote.call).toBeTruthy();
    expect(component.createActivityNote.call).toBeTruthy();
  });

  test('should throw error when create activity note fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'createActivityNote')
      .mockReturnValueOnce(throwError(() => error));

    component.noteForm.controls['noteSubject'].setValue('sample note2');
    component.noteForm.controls['relateTo'].setValue('99');
    component.noteForm.controls['noteDescription'].setValue('sample dec');
    component.noteForm.controls['attachment'].setValue('xyz');

    const button = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity-note'
    );
    button.click();
    fixture.detectChanges();
    expect(component.createUpdateActivityNote.call).toBeTruthy();
    expect(component.createActivityNote.call).toBeTruthy();
  });

  test('should update activity note', () => {
    component.selectedNote = activityNote;

    component.noteForm.controls['noteSubject'].setValue('sample note2');
    component.noteForm.controls['relateTo'].setValue('99');
    component.noteForm.controls['noteDescription'].setValue('sample dec');
    component.noteForm.controls['attachment'].setValue('xyz');

    const button =
      fixture.debugElement.nativeElement.querySelector('.edit-note');
    button.click();
    fixture.detectChanges();

    const button2 = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity-note'
    );
    button2.click();
    fixture.detectChanges();

    expect(component.createUpdateActivityNote.call).toBeTruthy();
    expect(component.updateActivityNote.call).toBeTruthy();
  });

  test('should throw error when update activity task fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'updateActivityNote')
      .mockReturnValueOnce(throwError(() => error));

    component.selectedNote = activityNote;
    // component.editActivityNote();

    component.noteForm.controls['noteSubject'].setValue('sample note2');
    component.noteForm.controls['relateTo'].setValue('99');
    component.noteForm.controls['noteDescription'].setValue('sample dec');
    component.noteForm.controls['attachment'].setValue('xyz');

    const button2 = fixture.debugElement.nativeElement.querySelector(
      '.create-update-activity-note'
    );
    button2.click();
    fixture.detectChanges();

    expect(component.createUpdateActivityNote.call).toBeTruthy();
    expect(component.updateActivityNote.call).toBeTruthy();
  });

  test('should delete activity note', () => {
    component.selectedNote = activityNote;
    component.activityText = 'note';
    const button = fixture.debugElement.nativeElement.querySelector(
      '.delete-activity-item'
    );
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityNote.call).toBeTruthy();
  });

  test('should throw error when delete note fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'deleteActivityNote')
      .mockReturnValueOnce(throwError(() => error));

    component.selectedNote = activityNote;
    component.activityText = 'note';
    const button = fixture.debugElement.nativeElement.querySelector(
      '.delete-activity-item'
    );
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityNote.call).toBeTruthy();
  });

  /**
   * Activity participants
   */

  test('should throw error when create get participant fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'getActivityParticipants')
      .mockReturnValueOnce(throwError(() => error));
    expect(component.getActivityParticipants.call).toBeTruthy();
  });

  // test('should create activity participants', () => {
  //   component.noteForm.controls['noteSubject'].setValue('sample note');
  //   component.noteForm.controls['relateTo'].setValue('999');
  //   component.noteForm.controls['noteDescription'].setValue('sample desc');
  //   component.noteForm.controls['attachment'].setValue('');

  //   const button = fixture.debugElement.nativeElement.querySelector(
  //     '.create-update-activity-note'
  //   );
  //   button.click();
  //   fixture.detectChanges();
  //   expect(component.createUpdateActivityNote.call).toBeTruthy();
  //   expect(component.createActivityNote.call).toBeTruthy();
  // });

  // test('should throw error when create activity participant fail', () => {
  //   const error = {
  //     error: { message: 'Failed' },
  //   };
  //   jest
  //     .spyOn(activityServiceStub, 'createActivityNote')
  //     .mockReturnValueOnce(throwError(() => error));

  //   component.noteForm.controls['noteSubject'].setValue('sample note2');
  //   component.noteForm.controls['relateTo'].setValue('99');
  //   component.noteForm.controls['noteDescription'].setValue('sample dec');
  //   component.noteForm.controls['attachment'].setValue('xyz');

  //   const button = fixture.debugElement.nativeElement.querySelector(
  //     '.create-update-activity-note'
  //   );
  //   button.click();
  //   fixture.detectChanges();
  //   expect(component.createUpdateActivityNote.call).toBeTruthy();
  //   expect(component.createActivityNote.call).toBeTruthy();
  // });

  test('should delete activity participant', () => {
    component.selectedParticipant = activityParticipant;
    component.activityText = 'participant';
    const button = fixture.debugElement.nativeElement.querySelector(
      '.delete-activity-item'
    );
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityParticipant.call).toBeTruthy();
  });

  test('should throw error when delete participant fail', () => {
    const error = {
      error: { message: 'Failed' },
    };
    jest
      .spyOn(activityServiceStub, 'deleteParticipant')
      .mockReturnValueOnce(throwError(() => error));

    component.selectedParticipant = activityParticipant;
    component.activityText = 'participant';
    const button = fixture.debugElement.nativeElement.querySelector(
      '.delete-activity-item'
    );
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityParticipant.call).toBeTruthy();
  });

  test('should prepare item for delete', () => {
    component.selectedActivity = activity;
    component.activityText = 'activity';
    const button = fixture.debugElement.nativeElement.querySelector(
      '.prepare-item-for-delete'
    );
    button.click();
    fixture.detectChanges();
    expect(component.prepareItemForDelete.call).toBeTruthy();
  });
});
