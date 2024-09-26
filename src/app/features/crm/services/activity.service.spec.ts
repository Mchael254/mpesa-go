import { TestBed } from '@angular/core/testing';

import { ActivityService } from './activity.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {ApiService} from "../../../shared/services/api/api.service";
import {
  Activity,
  ActivityNote,
  ActivityParticipant,
  ActivityStatus,
  ActivityTask,
  ActivityType,
  PriorityLevel
} from "../data/activity";

describe('ActivityService', () => {
  let service: ActivityService;
  let httpTestingController: HttpTestingController;

  const activity: Activity = {
    "id": 101,
    "activityTypeCode": 1,
    "wef": new Date("2024-09-23T09:00:00Z"),
    "wet": new Date("2024-09-23T12:00:00Z"),
    "duration": 180,
    "subject": "Team Meeting",
    "location": "Conference Room 3",
    "assignedTo": 25,
    "relatedTo": 15,
    "statusId": 2,
    "desc": "Quarterly team meeting to discuss project updates.",
    "reminder": "Email",
    "team": 8,
    "reminderTime": new Date("2024-09-23T08:30:00Z"),
    "messageCode": 1001
  }

  const activityType: ActivityType = {
    "id": 102,
    "desc": "System maintenance scheduled",
    "systemCode": 5001
  }

  const priorityLevel: PriorityLevel = {
    "id": 103,
    "desc": "System maintenance scheduled for the upcoming weekend.",
    "shortDesc": "Weekend maintenance"
  }

  const activityStatus: ActivityStatus = {
    "code": 200,
    "desc": "User login successful",
    "id": 104
  }

  const activityTask: ActivityTask = {
    "id": 105,
    "actCode": 300,
    "dateFrom": new Date("2024-09-25T10:00:00Z"),
    "dateTo": new Date("2024-09-25T12:00:00Z"),
    "subject": "Project Deadline Review",
    "statusId": 1,
    "priorityCode": 2,
    "accCode": 4567
  }

  const activityNote: ActivityNote = {
    "id": 106,
    "accCode": 4567,
    "contactCode": 8901,
    "subject": "Client Meeting Notes",
    "notes": "Discussed project scope and deliverables.",
    "attachment": new Uint8Array ([137, 80, 78, 71, 13, 10, 26, 10]),
    "actCode": 300,
    "attachmentType": "image/png",
    "fileName": "meeting-notes.png"
  }

  const activityParticipant: ActivityParticipant = {
    "id": 107,
    "aacCode": 5678,
    "actCode": 300,
    "participant": {
      "id": 201,
      "name": "John Doe",
      "emailAddress": "john.doe@example.com"
    }
  }




  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ActivityService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });


  // activity tests
  test('should get activities', () => {
        service.getActivities().subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe([activity]);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/activities');
    expect(req.request.method).toEqual('GET');
    req.flush([activity]);
  });

  test('should create activity', () => {
    service.createActivity(activity).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activity);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/activities');
    expect(req.request.method).toEqual('POST');
    req.flush(activity);
  });

  test('should update activity', () => {
    service.updateActivity(activity).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activity);
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/activities/${activity.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(activity);
  });

  test('should delete activity', () => {
    service.deleteActivity(activity.id).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe('success');
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/activities/${activity.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush('success');
  });


  // activity types tests
  test('should get activity types', () => {
    service.getActivityTypes().subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe([activityType]);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/activity-types');
    expect(req.request.method).toEqual('GET');
    req.flush([activityType]);
  });

  test('should create activity types', () => {
    service.createActivityType(activityType).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityType);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/activity-types');
    expect(req.request.method).toEqual('POST');
    req.flush(activity);
  });

  test('should update activity type', () => {
    service.updateActivityType(activityType).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityType);
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/activity-types/${activityType.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(activityType);
  });

  test('should delete activity type', () => {
    service.deleteActivityType(activityType.id).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe('success');
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/activity-types/${activityType.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush('success');
  });


  // priority level tests
  test('should get priority levels', () => {
    service.getPriorityLevels().subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe([priorityLevel]);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/priority-level');
    expect(req.request.method).toEqual('GET');
    req.flush([priorityLevel]);
  });

  test('should create priority level', () => {
    service.createPriorityLevel(priorityLevel).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(priorityLevel);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/priority-level');
    expect(req.request.method).toEqual('POST');
    req.flush(activity);
  });

  test('should update priority level', () => {
    service.updatePriorityLevel(priorityLevel).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(priorityLevel);
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/priority-level/${priorityLevel.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(priorityLevel);
  });

  test('should delete priority level', () => {
    service.deletePriorityLevel(priorityLevel.id).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe('success');
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/priority-level/${priorityLevel.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush('success');
  });


  // activity status tests
  test('should get activity statuses', () => {
    service.getActivityStatuses().subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe([activityStatus]);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/status');
    expect(req.request.method).toEqual('GET');
    req.flush([activityStatus]);
  });

  test('should create activity status', () => {
    service.createActivityStatus(activityStatus).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityStatus);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/status');
    expect(req.request.method).toEqual('POST');
    req.flush(activity);
  });

  test('should update activity status', () => {
    service.updateActivityStatus(activityStatus).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityStatus);
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/status/${activityStatus.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(activityStatus);
  });

  test('should delete activity status', () => {
    service.deleteActivityStatus(activityStatus.id).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe('success');
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/status/${activityStatus.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush('success');
  });


  // activity task tests
  test('should get activity tasks', () => {
    service.getActivityTasks().subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe([activityTask]);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/activity-tasks');
    expect(req.request.method).toEqual('GET');
    req.flush([activityTask]);
  });

  test('should create activity task', () => {
    service.createActivityTask(activityTask).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityTask);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/activity-tasks');
    expect(req.request.method).toEqual('POST');
    req.flush(activity);
  });

  test('should update activity task', () => {
    service.updateActivityTask(activityTask).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityTask);
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/activity-tasks/${activityTask.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(activityTask);
  });

  test('should delete activity task', () => {
    service.deleteActivityTask(activityTask.id).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe('success');
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/activity-tasks/${activityTask.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush('success');
  });


  // activity notes test
  test('should get activity notes', () => {
    service.getActivityNotes().subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe([activityNote]);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/activity-notes');
    expect(req.request.method).toEqual('GET');
    req.flush([activityNote]);
  });

  test('should create activity note', () => {
    service.createActivityNote(activityNote).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityNote);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/activity-notes');
    expect(req.request.method).toEqual('POST');
    req.flush(activityNote);
  });

  test('should update activity note', () => {
    service.updateActivityNote(activityNote).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityNote);
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/activity-notes/${activityNote.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(activityTask);
  });

  test('should delete activity note', () => {
    service.deleteActivityNote(activityNote.id).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe('success');
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/activity-notes/${activityNote.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush('success');
  });


  // activity participants tests
  test('should get activity participants', () => {
    service.getActivityParticipants().subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe([activityParticipant]);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/participants');
    expect(req.request.method).toEqual('GET');
    req.flush([activityParticipant]);
  });

  test('should create activity participant', () => {
    service.createParticipant(activityParticipant).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityParticipant);
    });
    const req = httpTestingController.expectOne('/crm/campaigns/participants');
    expect(req.request.method).toEqual('POST');
    req.flush(activityParticipant);
  });

  test('should update activity participant', () => {
    service.updateParticipant(activityParticipant).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(activityParticipant);
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/participants/${activityParticipant.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(activityTask);
  });

  test('should delete activity participant', () => {
    service.deleteParticipant(activityParticipant.id).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe('success');
    });
    const req = httpTestingController.expectOne(`/crm/campaigns/participants/${activityParticipant.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush('success');
  });

});
