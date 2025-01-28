import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";

@Component({
  selector: 'app-report-group',
  templateUrl: './report-group.component.html',
  styleUrls: ['./report-group.component.css']
})
export class ReportGroupComponent implements OnInit {
  pageSize: 5;
  reportGroupData: any;
  selectedReportGroup: any;
  reportGroupDivisionData: any;
  selectedReportGroupDivision: any;
  divisionsData: any;
  selectedDivision: any;
  editMode: boolean = false;
  defineReportGroupForm: FormGroup;
  visibleStatus: any = {
    name: 'Y',
  }
  groupId: string = 'reportGroupTab';

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.createDefineReportGroupForm();
  }

  createDefineReportGroupForm() {
    this.defineReportGroupForm = this.fb.group({
      name: '',
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.defineReportGroupForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.defineReportGroupForm.controls[key].addValidators(Validators.required);
                this.defineReportGroupForm.controls[key].updateValueAndValidity();
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
  }

  openDefineReportGroupModal() {
    const modal = document.getElementById('reportGroupDefinitionModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeReportGroupModal() {
    this.editMode = false;
    const modal = document.getElementById('reportGroupDefinitionModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openReportGroupDivisionModal() {
    const modal = document.getElementById('reportGroupDivisionModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeReportGroupDivisionModal() {
    this.editMode = false;
    const modal = document.getElementById('reportGroupDivisionModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveReportGroupDetails() {

  }

  saveReportGroupDivisionDetails() {

  }

  get g() {
    return this.defineReportGroupForm.controls;
  }

  ngOnDestroy(): void {}
}
