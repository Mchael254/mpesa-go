import {Injectable} from '@angular/core';
import {
  Activity,
  ActivityNote,
  ActivityParticipant,
  ActivityStatus,
  ActivityTask,
  ActivityType,
  PriorityLevel,
} from '../data/activity';
import {Observable} from 'rxjs';
import {ApiService} from "../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private apiService: ApiService) {}

  getActivities(): Observable<Activity[]> {
    return this.apiService.GET<Activity[]>(
      `activities`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  /*getActivityById(id: number): Observable<Activity> {
    return this.apiService.GET<Activity>(
      `activities/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }*/

  createActivity(activity: Activity): Observable<Activity> {
    return this.apiService.POST<Activity>(
      `activities`,
      JSON.stringify(activity),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateActivity(activity: Activity): Observable<Activity> {
    return this.apiService.PUT<Activity>(
      `activities/${activity.id}`,
      JSON.stringify(activity),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteActivity(id: number): Observable<string> {
    return this.apiService.DELETE<string>(
      `activities/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  getActivityTypes(): Observable<ActivityType[]> {
    return this.apiService.GET<ActivityType[]>(
      `activity-types`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  /*getActivityTypeById(id: number): Observable<ActivityType> {
    return this.apiService.GET<ActivityType>(
      `activity-types/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }*/

  createActivityType(activityType: ActivityType): Observable<ActivityType> {
    return this.apiService.POST<ActivityType>(
      `activity-types`,
      JSON.stringify(activityType),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateActivityType(activityType: ActivityType): Observable<ActivityType> {
    return this.apiService.PUT<ActivityType>(
      `activity-types/${activityType.id}`,
      JSON.stringify(activityType),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteActivityType(id: number): Observable<string> {
    return this.apiService.DELETE<string>(
      `activity-types/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  // priority-level
  getPriorityLevels(): Observable<PriorityLevel[]> {
    return this.apiService.GET<PriorityLevel[]>(
      `priority-level`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  /*getPriorityLevelById(id: number): Observable<PriorityLevel> {
    return this.apiService.GET<PriorityLevel>(
      `priority-level/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }*/

  createPriorityLevel(priorityLevel: PriorityLevel): Observable<PriorityLevel> {
    return this.apiService.POST<PriorityLevel>(
      `priority-level`,
      JSON.stringify(priorityLevel),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updatePriorityLevel(priorityLevel: PriorityLevel): Observable<PriorityLevel> {
    return this.apiService.PUT<PriorityLevel>(
      `priority-level/${priorityLevel.id}`,
      JSON.stringify(priorityLevel),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deletePriorityLevel(id: number): Observable<string> {
    return this.apiService.DELETE<string>(
      `priority-level/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  //status
  getActivityStatuses(): Observable<ActivityStatus[]> {
    return this.apiService.GET<ActivityStatus[]>(
      `status`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  /*getActivityStatusById(id: number): Observable<ActivityStatus> {
    return this.apiService.GET<ActivityStatus>(
      `status/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }*/

  createActivityStatus(
    activityStatus: ActivityStatus
  ): Observable<ActivityStatus> {
    return this.apiService.POST<ActivityStatus>(
      `status`,
      JSON.stringify(activityStatus),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateActivityStatus(
    activityStatus: ActivityStatus
  ): Observable<ActivityStatus> {
    return this.apiService.PUT<ActivityStatus>(
      `status/${activityStatus.id}`,
      JSON.stringify(activityStatus),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteActivityStatus(id: number): Observable<string> {
    return this.apiService.DELETE<string>(
      `status/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  //tasks
  getActivityTasks(): Observable<ActivityTask[]> {
    return this.apiService.GET<ActivityTask[]>(
      `activity-tasks`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  /*getActivityTaskById(id: number): Observable<ActivityTask> {
    return this.apiService.GET<ActivityTask>(
      `activity-tasks/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }*/

  createActivityTask(activityTask: ActivityTask): Observable<ActivityTask> {
    return this.apiService.POST<ActivityTask>(
      `activity-tasks`,
      JSON.stringify(activityTask),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateActivityTask(activityTask: ActivityTask): Observable<ActivityTask> {
    return this.apiService.PUT<ActivityTask>(
      `activity-tasks/${activityTask.id}`,
      JSON.stringify(activityTask),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteActivityTask(id: number): Observable<string> {
    return this.apiService.DELETE<string>(
      `activity-tasks/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  // Activity Note
  getActivityNotes(): Observable<ActivityNote[]> {
    return this.apiService.GET<ActivityNote[]>(
      `activity-notes`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  /*getActivityNoteById(id: number): Observable<ActivityNote> {
    return this.apiService.GET<ActivityNote>(
      `activity-notes/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }*/

  createActivityNote(activityNote: ActivityNote): Observable<ActivityNote> {
    return this.apiService.POST<ActivityNote>(
      `activity-notes`,
      JSON.stringify(activityNote),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateActivityNote(activityNote: ActivityNote): Observable<ActivityNote> {
    return this.apiService.PUT<ActivityNote>(
      `activity-notes/${activityNote.id}`,
      JSON.stringify(activityNote),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteActivityNote(id: number): Observable<string> {
    return this.apiService.DELETE<string>(
      `activity-notes/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  // Participant
  getActivityParticipants(): Observable<ActivityParticipant[]> {
    return this.apiService.GET<ActivityParticipant[]>(
      `participants`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  /*getParticipantById(id: number): Observable<ActivityParticipant> {
    return this.apiService.GET<ActivityParticipant>(
      `activity-participants/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }*/

  createParticipant(
    participant: ActivityParticipant
  ): Observable<ActivityParticipant> {
    return this.apiService.POST<ActivityParticipant>(
      `participants`,
      JSON.stringify(participant),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateParticipant(
    participant: ActivityParticipant
  ): Observable<ActivityParticipant> {
    return this.apiService.PUT<ActivityParticipant>(
      `participants/${participant.id}`,
      JSON.stringify(participant),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteParticipant(id: number): Observable<string> {
    return this.apiService.DELETE<string>(
      `participants/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }
}
