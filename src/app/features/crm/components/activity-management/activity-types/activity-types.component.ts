import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { ActivityService } from '../../../services/activity.service';
import { ActivityType } from '../../../data/activity';
import { NgxSpinnerService } from 'ngx-spinner';
import { Logger } from '../../../../../shared/services';
import { SystemsDto } from '../../../../../shared/data/common/systemsDto';
import { SystemsService } from '../../../../../shared/services/setups/systems/systems.service';

const log = new Logger('ActivityTypesComponent');

@Component({
  selector: 'app-activity-types',
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.css'],
})
export class ActivityTypesComponent implements OnInit {
  pageSize: 5;
  activityTypeData: ActivityType[];
  selectedActivityType: ActivityType;
  editMode: boolean = false;

  activityTypeForm: FormGroup;

  visibleStatus: any = {
    description: 'Y',
  };

  groupId: string = 'activityMngtActivityTypeTab';

  systems: SystemsDto[] = [];
  selectedSystem: SystemsDto = {
    id: undefined,
    shortDesc: undefined,
    systemName: undefined,
  };
  shouldShowSystems: boolean = false;
  isDataReady: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private activityService: ActivityService,
    private systemsService: SystemsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.activityTypeCreateForm();
    this.getActivityTypes();
    this.fetchSystems();
  }

  /**
   * This method fetches all system and assigns them to a variable
   */
  fetchSystems(): void {
    this.shouldShowSystems = false;
    this.spinner.show();
    this.systemsService.getSystems().subscribe({
      next: (res: SystemsDto[]) => {
        this.systems = res;
        this.spinner.hide();
        this.shouldShowSystems = true;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.spinner.hide();
        this.shouldShowSystems = true;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  /**
   * This method get the selected system module, and assigns it to a variable
   * @param system
   */
  selectSystem(system: SystemsDto): void {
    this.selectedSystem = system;
  }

  attachSystem() {
    this.selectedSystem = this.systems.filter(
      (el) => el.id === this.selectedActivityType.systemCode
    )[0];
  }

  activityTypeCreateForm() {
    this.activityTypeForm = this.fb.group({
      description: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        response.forEach((field) => {
          for (const key of Object.keys(this.activityTypeForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.activityTypeForm.controls[key].addValidators(
                  Validators.required
                );
                this.activityTypeForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        });
        this.cdr.detectChanges();
      });
  }

  get f() {
    return this.activityTypeForm.controls;
  }

  openDefineActivityTypeModal() {
    const modal = document.getElementById('newActivityType');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    if (this.editMode) {
      this.activityTypeForm.patchValue({
        description: this.selectedActivityType.desc,
      });
    }
  }

  closeDefineActivityTypeModal() {
    this.editMode = false;
    const modal = document.getElementById('newActivityType');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  editActivityType() {
    if (this.selectedActivityType?.id) {
      this.editMode = !this.editMode;
      this.openDefineActivityTypeModal();
    }
  }

  saveActivityType(): void {
    const formValues = this.activityTypeForm.getRawValue();
    const activityType: ActivityType = {
      id: this.selectedActivityType?.id || null,
      desc: formValues.description,
      systemCode:
        this.selectedSystem?.id || this.selectedActivityType?.systemCode,
    };

    if (!this.editMode) {
      this.createNewActivityType(activityType);
    } else {
      this.updateActivityType(activityType);
    }
  }

  createNewActivityType(activityType: ActivityType): void {
    this.activityService.createActivityType(activityType).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity type created successfully!'
        );
        this.getActivityTypes();
        this.closeDefineActivityTypeModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  updateActivityType(activityType: ActivityType): void {
    this.activityService.updateActivityType(activityType).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity type updated successfully!'
        );
        this.getActivityTypes();
        this.closeDefineActivityTypeModal();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  getActivityTypes(): void {
    this.isDataReady = false;
    this.activityService.getActivityTypes().subscribe({
      next: (data) => {
        this.activityTypeData = data;
        this.isDataReady = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isDataReady = true;
      },
    });
  }

  confirmDeleteActivityType(): void {
    const id = this.selectedActivityType.id;

    this.activityService.deleteActivityType(id).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Activity type deleted successfully!'
        );
        this.getActivityTypes();
        // close modal after delete
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  ngOnDestroy(): void {}
}
