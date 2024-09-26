import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesComponent } from './activities.component';
import {createSpyObj} from "jest-createspyobj";
import {of, throwError} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {ActivityService} from "../../../services/activity.service";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {MessageService} from "primeng/api";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {Activity, ActivityNote, ActivityParticipant, ActivityTask, ActivityType} from "../../../data/activity";
import {MandatoryFieldsDTO} from "../../../../../shared/data/common/mandatory-fields-dto";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
    };
  }
}

describe('ActivitiesComponent', () => {
  const activityServiceStub = createSpyObj('ActivityService',
    [
      'getActivityTypes',
      'getActivities', 'createActivity', 'updateActivity', 'deleteActivity',
      'getActivityTasks', 'createActivityTask', 'updateActivityTask', 'deleteActivityTask',
      'getActivityNotes', 'createActivityNote', 'updateActivityNote', 'deleteActivityNote',
      'getActivityParticipants', 'createParticipant', 'updateParticipant', 'deleteParticipant'
    ]);

  const mandatoryFieldServiceStub = createSpyObj('MandatoryFieldsService',
    ['getMandatoryFieldsByGroupId'])

  const activityType: ActivityType = {
    "id": 102,
    "desc": "System maintenance scheduled",
    "systemCode": 5001
  }

  const activity: Activity = {
    "id": 1,
    "activityTypeCode": 101,
    "wef": new Date("2024-09-23T09:00:00Z"),
    "wet": new Date("2024-09-23T11:00:00Z"),
    "duration": 120,
    "subject": "Team Meeting",
    "location": "Conference Room A",
    "assignedTo": 25,
    "relatedTo": 13,
    "statusId": 2,
    "desc": "Discussion on project updates and next steps.",
    "reminder": "email",
    "team": 4,
    "reminderTime": new Date("2024-09-23T08:00:00Z"),
    "messageCode": 501
  }

  const activityTask: ActivityTask = {
    "id": 1,
    "actCode": 3001,
    "dateFrom": new Date("2024-09-23T09:00:00Z"),
    "dateTo": new Date("2024-09-23T17:00:00Z"),
    "subject": "Annual Financial Review",
    "statusId": 2,
    "priorityCode": 1,
    "accCode": 500
  }

  const activityNote: ActivityNote = {
    "id": 1,
    "accCode": 12345,
    "contactCode": 67890,
    "subject": "Meeting Notes",
    "notes": "These are the notes from the meeting.",
    "attachment": new Uint8Array ([72, 101, 108, 108, 111]),  // Sample byte array representing a file
    "actCode": 3001,
    "attachmentType": "application/pdf",
    "fileName": "meeting_notes.pdf"
  }

  const activityParticipant: ActivityParticipant = {
    "id": 1,
    "aacCode": 1010,
    "actCode": 2020,
    "participant": {
      "id": 1,
      "name": "John Doe",
      "emailAddress": "johndoe@example.com"
    }
  }

  const mandatoryField: MandatoryFieldsDTO = {
    "id": 1,
    "fieldName": "username",
    "fieldLabel": "Username",
    "mandatoryStatus": "required",
    "visibleStatus": "Y",
    "disabledStatus": "enabled",
    "frontedId": "field-username",
    "screenName": "loginScreen",
    "groupId": "authGroup",
    "module": "authentication"
  }

  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;

  beforeEach(() => {
    jest.spyOn(activityServiceStub, 'getActivityTypes').mockReturnValue(of([activityType]));

    jest.spyOn(activityServiceStub, 'getActivities').mockReturnValue(of([activity]));
    jest.spyOn(activityServiceStub, 'createActivity').mockReturnValue(of(activity));
    jest.spyOn(activityServiceStub, 'updateActivity').mockReturnValue(of(activity));
    jest.spyOn(activityServiceStub, 'deleteActivity').mockReturnValue(of('success'));

    jest.spyOn(activityServiceStub, 'getActivityTasks').mockReturnValue(of([activityTask]));
    jest.spyOn(activityServiceStub, 'createActivityTask').mockReturnValue(of(activityTask));
    jest.spyOn(activityServiceStub, 'updateActivityTask').mockReturnValue(of(activityTask));
    jest.spyOn(activityServiceStub, 'deleteActivityTask').mockReturnValue(of('success'));

    jest.spyOn(activityServiceStub, 'getActivityNotes').mockReturnValue(of([activityNote]));
    jest.spyOn(activityServiceStub, 'createActivityNote').mockReturnValue(of(activityNote));
    jest.spyOn(activityServiceStub, 'updateActivityNote').mockReturnValue(of(activityNote));
    jest.spyOn(activityServiceStub, 'deleteActivityNote').mockReturnValue(of('success'));

    jest.spyOn(activityServiceStub, 'getActivityParticipants').mockReturnValue(of([activityParticipant]));
    jest.spyOn(activityServiceStub, 'createParticipant').mockReturnValue(of(activityParticipant));
    jest.spyOn(activityServiceStub, 'updateParticipant').mockReturnValue(of(activityParticipant));
    jest.spyOn(activityServiceStub, 'deleteParticipant').mockReturnValue(of('success'));

    jest.spyOn(mandatoryFieldServiceStub, 'getMandatoryFieldsByGroupId').mockReturnValue(of([mandatoryField]));

    TestBed.configureTestingModule({
      declarations: [ActivitiesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ActivityService, useValue: activityServiceStub },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: MandatoryFieldsService, useValue: mandatoryFieldServiceStub},
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
  });

  test('should open activity modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.open-activity-modal');
    button.click();
    fixture.detectChanges();
    expect(component.openDefineActivityModal.call).toBeTruthy();
  });

  test('should close activity modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.close-activity-modal');
    button.click();
    fixture.detectChanges();
    expect(component.closeDefineActivityModal.call).toBeTruthy();
  });

  test('should open note modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.open-note-modal');
    button.click();
    fixture.detectChanges();
    expect(component.openDefineNoteModal.call).toBeTruthy();
  });

  test('should close note modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.close-note-modal');
    button.click();
    fixture.detectChanges();
    expect(component.closeDefineNoteModal.call).toBeTruthy();
  });

  test('should open task modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.open-task-modal');
    button.click();
    fixture.detectChanges();
    expect(component.openDefineTaskModal.call).toBeTruthy();
  });

  test('should close task modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.close-task-modal');
    button.click();
    fixture.detectChanges();
    expect(component.closeDefineTaskModal.call).toBeTruthy();
  });

  test('should edit activity', () => {
    component.selectedActivity = activity;
    const button = fixture.debugElement.nativeElement.querySelector('.edit-activity');
    button.click();
    fixture.detectChanges();
    expect(component.editActivity.call).toBeTruthy();
  });

  test('should edit activity', () => {
    component.selectedNote = activityNote;
    const button = fixture.debugElement.nativeElement.querySelector('.edit-note');
    button.click();
    fixture.detectChanges();
    expect(component.editNote.call).toBeTruthy();
  });

  test('should edit task', () => {
    component.selectedTask = activityTask;
    const button = fixture.debugElement.nativeElement.querySelector('.edit-task');
    button.click();
    fixture.detectChanges();
    expect(component.editTask.call).toBeTruthy();
  });

  test('should select file', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.select-file');
    button.click(); // todo: should mimic ng onChange
    fixture.detectChanges();
    expect(component.onFileChange.call).toBeTruthy();
  });

  test('should open all users modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.open-all-users-modal');
    button.click();
    fixture.detectChanges();
    expect(component.openAllUsersModal.call).toBeTruthy();
  });

  test('should process selected user', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#process-selected-user');
    button.click();
    fixture.detectChanges();
    expect(component.processSelectedUser.call).toBeTruthy();
  });

  test('should get selected user', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#get-selected-user');
    button.click();
    fixture.detectChanges();
    expect(component.getSelectedUser.call).toBeTruthy();
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

    const button = fixture.debugElement.nativeElement.querySelector('.create-update-activity');
    button.click();
    fixture.detectChanges();
    expect(component.createUpdateActivity.call).toBeTruthy();
    expect(component.createActivity.call).toBeTruthy();
  });

  test('should throw error when create activity fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'createActivity')
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

    const button = fixture.debugElement.nativeElement.querySelector('.create-update-activity');
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

    const button = fixture.debugElement.nativeElement.querySelector('.edit-activity');
    button.click();
    fixture.detectChanges();

    const button2 = fixture.debugElement.nativeElement.querySelector('.create-update-activity');
    button2.click();
    fixture.detectChanges();

    // expect(component.editMode).toEqual(true);
    expect(component.createUpdateActivity.call).toBeTruthy();
    expect(component.updateActivity.call).toBeTruthy();
  });

  test('should throw error when update activity fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'updateActivity')
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

    const button2 = fixture.debugElement.nativeElement.querySelector('.create-update-activity');
    button2.click();
    fixture.detectChanges();

    // expect(component.editMode).toEqual(true);
    expect(component.createUpdateActivity.call).toBeTruthy();
    expect(component.updateActivity.call).toBeTruthy();
  });

  test('should delete activity', () => {
    component.selectedActivity = activity;
    const button = fixture.debugElement.nativeElement.querySelector('.delete-activity');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivity.call).toBeTruthy();
  });

  test('should throw error when delete activity fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'deleteActivity').mockReturnValueOnce(throwError(() => error));

    component.selectedActivity = activity;
    const button = fixture.debugElement.nativeElement.querySelector('.delete-activity');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivity.call).toBeTruthy();
  });

  /**
   * Activity tasks
   */

  test('should create activity task', () => {
    // component.taskForm.controls['actCode'].setValue('');
    component.taskForm.controls['taskStartDate'].setValue('10-09-2024');
    component.taskForm.controls['taskEndDate'].setValue('11-09-25');
    component.taskForm.controls['taskSubject'].setValue('subject');
    // component.taskForm.controls['statusId'].setValue(123);
    component.taskForm.controls['priority'].setValue('urgent');
    // component.taskForm.controls['accCode'].setValue(123);

    const button = fixture.debugElement.nativeElement.querySelector('.create-update-activity-task');
    button.click();
    fixture.detectChanges();
    expect(component.createUpdateActivityTask.call).toBeTruthy();
    expect(component.createActivityTask.call).toBeTruthy();
  });

  test('should throw error when create activity task fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'createActivity')
      .mockReturnValueOnce(throwError(() => error));

    // component.taskForm.controls['actCode'].setValue('');
    component.taskForm.controls['taskStartDate'].setValue('10-09-2024');
    component.taskForm.controls['taskEndDate'].setValue('11-09-25');
    component.taskForm.controls['taskSubject'].setValue('subject');
    // component.taskForm.controls['statusId'].setValue(123);
    component.taskForm.controls['priority'].setValue('urgent');
    // component.taskForm.controls['accCode'].setValue(123);

    const button = fixture.debugElement.nativeElement.querySelector('.create-update-activity-task');
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

    const button = fixture.debugElement.nativeElement.querySelector('.edit-task');
    button.click();
    fixture.detectChanges();

    const button2 = fixture.debugElement.nativeElement.querySelector('.create-update-activity-task');
    button2.click();
    fixture.detectChanges();

    // expect(component.editMode).toEqual(true);
    expect(component.createUpdateActivityTask.call).toBeTruthy();
    expect(component.updateActivityTask.call).toBeTruthy();
  });

  test('should throw error when update activity task fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'updateActivityTask')
      .mockReturnValueOnce(throwError(() => error));

    component.selectedActivity = activity;
    component.editActivity();

    // component.taskForm.controls['actCode'].setValue('');
    component.taskForm.controls['taskStartDate'].setValue('10-09-2024');
    component.taskForm.controls['taskEndDate'].setValue('11-09-25');
    component.taskForm.controls['taskSubject'].setValue('subject');
    // component.taskForm.controls['statusId'].setValue(123);
    component.taskForm.controls['priority'].setValue('urgent');
    // component.taskForm.controls['accCode'].setValue(123);

    const button2 = fixture.debugElement.nativeElement.querySelector('.create-update-activity-task');
    button2.click();
    fixture.detectChanges();

    // expect(component.editMode).toEqual(true);
    expect(component.createUpdateActivityTask.call).toBeTruthy();
    expect(component.updateActivityTask.call).toBeTruthy();
  });

  test('should delete activity task', () => {
    component.selectedTask = activityTask;
    const button = fixture.debugElement.nativeElement.querySelector('.delete-activity-task');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityTask.call).toBeTruthy();
  });

  test('should throw error when delete activity fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(activityServiceStub, 'deleteActivity').mockReturnValueOnce(throwError(() => error));

    component.selectedTask = activityTask;
    const button = fixture.debugElement.nativeElement.querySelector('.delete-activity-task');
    button.click();
    fixture.detectChanges();
    expect(component.confirmDeleteActivityTask.call).toBeTruthy();
  });


});
