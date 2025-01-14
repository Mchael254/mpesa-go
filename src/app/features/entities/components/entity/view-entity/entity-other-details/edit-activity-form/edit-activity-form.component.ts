import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import { Extras } from '../entity-other-details.component';
import { Logger } from '../../../../../../../shared/services/logger/logger.service';
import { ActivityService } from '../../../../../../../features/crm/services/activity.service';
import { LeadActivityDto } from '../../../../../../../features/crm/data/leads';
import { Activity } from '../../../../../../../features/crm/data/activity';
import { LeadsService } from '../../../../../../../features/crm/services/leads.service';
import { forkJoin } from 'rxjs';

const log = new Logger('EditActivityFormComponent');

@Component({
  selector: 'app-edit-activity-form',
  templateUrl: './edit-activity-form.component.html',
  styleUrls: ['./edit-activity-form.component.css'],
})
export class EditActivityFormComponent implements OnInit {
  @Output('closeEditModal') closeEditModal: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('isFormDetailsReady') isFormDetailsReady: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Output('activityAssigned') activityAssigned: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public activityDetailForm: FormGroup;

  public unassignedActivities: any[] = [];
  public assigned;
  public activityDetails: any;
  public extras: Extras;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private activityService: ActivityService,
    private leadService: LeadsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.CreateActivityForm();
  }

  CreateActivityForm() {
    this.activityDetailForm = this.fb.group({
      activity: [[]],
    });
    this.isFormDetailsReady.emit(true);
  }

  initializeNewActivity(extras: Extras): void {
    this.extras = extras;
    log.info(
      `Initialized form for new comment creation with extras`,
      this.extras
    );
    this.fetchUnassignedActivities();
  }

  fetchUnassignedActivities(): void {
    this.activityService.getActivities().subscribe((allActivities) => {
      log.info('All Activities', allActivities);
      // Get the list of already assigned activity codes
      const assignedActivityCodes = (this.extras.leadActivities || []).map(
        (leadActivity: LeadActivityDto) => leadActivity.activityCode
      );

      log.info('Assigned activityCode', assignedActivityCodes);

      this.unassignedActivities = allActivities.filter(
        (activity: Activity) => !assignedActivityCodes.includes(activity.id)
      );
      log.info('Unassigned Activities', this.unassignedActivities);
    });
  }

  updateDetails(): void {
    const formValues = this.activityDetailForm.getRawValue();

    const leadId = this.extras.leadId;

    const leadActivities = formValues.activity.map((activityId: number) => ({
      activityCode: activityId,
      code: null,
      leadCode: leadId,
    }));

    log.info('Activity Details to be Assigned to a Lead', leadActivities);
    // leadActivities.forEach((activity) => {
    //   this.leadService.assignLeadActivity(activity, leadId).subscribe({
    //     next: (res) => {
    //       this.globalMessagingService.displaySuccessMessage(
    //         'Success',
    //         'Successfully Assigned an Activity to Lead'
    //       );
    //       this.closeEditModal.emit();
    //       this.activityAssigned.emit(true);
    //       this.isFormDetailsReady.emit(false);
    //     },
    //     error: (err) => {
    //       const errorMessage = err?.error?.message ?? err.message;
    //       this.globalMessagingService.displayErrorMessage(
    //         'Error',
    //         errorMessage
    //       );
    //     },
    //   });
    // });

    //Use this after endpoint modification::

    this.leadService.assignLeadActivity(leadActivities, leadId).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Successfully Assigned an Activity to Lead'
        );
        this.closeEditModal.emit();
        this.activityAssigned.emit(true);
        this.isFormDetailsReady.emit(false);
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }
}
