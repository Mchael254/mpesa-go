import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { ActivityService } from '../../../services/activity.service';
import { ActivityStatus, PriorityLevel } from '../../../data/activity';

@Component({
  selector: 'app-priority-levels-activity-status',
  templateUrl: './priority-levels-activity-status.component.html',
  styleUrls: ['./priority-levels-activity-status.component.css'],
})
export class PriorityLevelsActivityStatusComponent implements OnInit {
  pageSize: 5;
  priorityLevelsData: PriorityLevel[];
  selectedPriorityLevel: PriorityLevel;
  activityStatusData: ActivityStatus[];
  selectedActivityStatus: ActivityStatus;

  priorityLevelForm: FormGroup;
  activityStatusForm: FormGroup;
  visibleStatus: any = {
    shortDescription: 'Y',
    description: 'Y',
  };
  editMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.priorityLevelCreateForm();
    this.activityStatusCreateForm();
    this.getPriorityLevels();
    this.getActivityStatuses();
  }

  priorityLevelCreateForm() {
    this.priorityLevelForm = this.fb.group({
      shtDesc: [''],
      desc: [''],
    });
  }

  activityStatusCreateForm() {
    this.activityStatusForm = this.fb.group({
      shtDesc: [''],
      desc: [''],
    });
  }

  get f() {
    return this.priorityLevelForm.controls;
  }

  get g() {
    return this.activityStatusForm.controls;
  }

  openDefinePriorityLevelModal() {
    const modal = document.getElementById('newPriorityLevel');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeDefinePriorityLevelModal() {
    this.editMode = false;
    const modal = document.getElementById('newPriorityLevel');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
  openActivityStatusModal() {
    const modal = document.getElementById('newActivityStatus');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeActivityStatusModal() {
    this.editMode = false;
    const modal = document.getElementById('newActivityStatus');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  editPriorityLevel() {
    this.editMode = !this.editMode;
    this.priorityLevelForm.patchValue({
      shtDesc: this.selectedPriorityLevel?.shortDesc,
      desc: this.selectedPriorityLevel?.desc,
    });
    this.openDefinePriorityLevelModal();
  }

  editActivityStatus() {
    this.editMode = !this.editMode;
    this.activityStatusForm.patchValue({
      desc: this.selectedActivityStatus?.desc,
      code: this.selectedActivityStatus?.code,
    });
    this.openActivityStatusModal();
  }

  getPriorityLevels(): void {
    this.activityService.getPriorityLevels().subscribe({
      next: (res) => {
        this.priorityLevelsData = res;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  createPriorityLevel(): void {
    const formValues = this.priorityLevelForm.getRawValue();
    const priorityLevel: PriorityLevel = {
      id: this.selectedPriorityLevel?.id || null,
      desc: formValues.desc,
      shortDesc: formValues.shtDesc,
    };

    if (!this.editMode) {
      this.createNewPriorityLevel(priorityLevel);
    } else {
      this.updatePriorityLevel(priorityLevel);
    }
  }

  createNewPriorityLevel(priorityLevel: PriorityLevel): void {
    this.activityService.createPriorityLevel(priorityLevel).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Priority Level created successfully!'
        );
        this.getPriorityLevels();
        this.closeDefinePriorityLevelModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  updatePriorityLevel(priorityLevel: PriorityLevel): void {
    this.activityService.updatePriorityLevel(priorityLevel).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Priority Level updated successfully!'
        );
        this.getPriorityLevels();
        this.closeDefinePriorityLevelModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  confirmDeletePriorityLevel(): void {
    const id = this.selectedPriorityLevel.id;

    this.activityService.deletePriorityLevel(id).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Priority level deleted successfully!'
        );
        this.getPriorityLevels();
        // close modal after delete
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  // Activity Status
  getActivityStatuses(): void {
    this.activityService.getActivityStatuses().subscribe({
      next: (res) => {
        this.activityStatusData = res;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  createActivityStatus(): void {
    const formValues = this.activityStatusForm.getRawValue();
    const activityStatus: ActivityStatus = {
      id: this.selectedPriorityLevel?.id || null,
      desc: formValues.desc,
      code: formValues.shtDesc,
    };

    if (!this.editMode) {
      this.createNewActivityStatus(activityStatus);
    } else {
      this.updateActivityStatus(activityStatus);
    }
  }

  createNewActivityStatus(activityStatus: ActivityStatus): void {
    this.activityService.createActivityStatus(activityStatus).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Priority Level created successfully!'
        );
        this.getActivityStatuses();
        this.closeActivityStatusModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  updateActivityStatus(activityStatus: ActivityStatus): void {
    this.activityService.updateActivityStatus(activityStatus).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Priority Level updated successfully!'
        );
        this.getActivityStatuses();
        this.closeActivityStatusModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  confirmDeleteActivityStatus(): void {
    const id = this.selectedActivityStatus.id;

    this.activityService.deleteActivityStatus(id).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity status deleted successfully!'
        );
        this.getActivityStatuses();
        // close modal after delete
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }
}
