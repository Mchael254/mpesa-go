import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";

@Component({
  selector: 'app-activity-types',
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.css']
})
export class ActivityTypesComponent implements OnInit{
  pageSize: 5;
  activityTypeData: any[];
  selectedActivityType: any[] = [];
  editMode: boolean = false;

  createNewActivityTypeForm: FormGroup;

  visibleStatus: any = {
    description: 'Y'
  }

  groupId: string = 'activityMngtActivityTypeTab';

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.activityTypeCreateForm();
  }

  activityTypeCreateForm() {
    this.createNewActivityTypeForm = this.fb.group({
      description: [''],
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createNewActivityTypeForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createNewActivityTypeForm.controls[key].addValidators(Validators.required);
                this.createNewActivityTypeForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  };

  get f() {
    return this.createNewActivityTypeForm.controls;
  }

  openDefineActivityTypeModal() {
    const modal = document.getElementById('newActivityType');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
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
    this.editMode = !this.editMode;
    this.openDefineActivityTypeModal();
  }

  ngOnDestroy(): void {}
}
