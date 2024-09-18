import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { ActivityService } from '../../../services/activity.service';
import { ActivityType } from '../../../data/activity';
import { Logger } from 'src/app/shared/services';
import { SystemsDto } from 'src/app/shared/data/common/systemsDto';
import { SystemsService } from 'src/app/shared/services/setups/systems/systems.service';
import { NgxSpinnerService } from 'ngx-spinner';

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

  createNewActivityTypeForm: FormGroup;

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
    this.createNewActivityTypeForm = this.fb.group({
      description: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        response.forEach((field) => {
          for (const key of Object.keys(
            this.createNewActivityTypeForm.controls
          )) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createNewActivityTypeForm.controls[key].addValidators(
                  Validators.required
                );
                this.createNewActivityTypeForm.controls[
                  key
                ].updateValueAndValidity();
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
    return this.createNewActivityTypeForm.controls;
  }

  openDefineActivityTypeModal() {
    const modal = document.getElementById('newActivityType');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    if (this.editMode) {
      this.createNewActivityTypeForm.patchValue({
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
    if (this.selectedActivityType.id) {
      this.editMode = !this.editMode;
      this.openDefineActivityTypeModal();
    }
  }

  saveActivivty(): void {
    const formValues = this.createNewActivityTypeForm.getRawValue();
    const activityType: ActivityType = {
      id: this.selectedActivityType?.id || null,
      desc: formValues.description,
      systemCode: this.selectedSystem.id || this.selectedActivityType?.id,
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
    this.activityService.getActivityTypes().subscribe({
      next: (data) => {
        log.info(`activity types >>> `, data);
        this.activityTypeData = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
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
