import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { Activity, ActivityType } from '../data/activity';
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/environments/api_service_config';

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

  getActivityById(id: number): Observable<Activity> {
    return this.apiService.GET<Activity>(
      `activities/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  createActivity(activity: Activity): Observable<Activity> {
    return this.apiService.POST<Activity>(
      `activities`,
      JSON.stringify(activity),
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  updateActivity(activity: Activity): Observable<Activity> {
    return this.apiService.PUT<Activity>(
      `activities/${activity.id}`,
      JSON.stringify(activity),
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  deleteActivity(id: number): Observable<string> {
    return this.apiService.DELETE<string>(
      `activities/${id}`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  getActivityTypes(): Observable<ActivityType[]> {
    return this.apiService.GET<ActivityType[]>(
      `activity-types`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  getActivityTypeById(id: number): Observable<ActivityType> {
    return this.apiService.GET<ActivityType>(
      `activity-types/${id}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

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
}
