import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {Logger} from "../../../../../shared/services";
import {SystemsDto} from "../../../../../shared/data/common/systemsDto";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";

const log = new Logger('RequestCategoriesComponent');
@Component({
  selector: 'app-request-categories',
  templateUrl: './request-categories.component.html',
  styleUrls: ['./request-categories.component.css']
})
export class RequestCategoriesComponent implements OnInit {
  pageSize: 5;
  incidentsData: any;
  requestCategoriesData: any;

  editMode: boolean = false;
  serviceRequestCategoryForm: FormGroup;
  requestEscalationForm: FormGroup;

  allUsersModalVisible: boolean = false;
  zIndex= 1;
  selectedMainUser: StaffDto;

  systems: SystemsDto[];

  visibleStatus: any = {
    name: 'Y',
    shtDesc: 'Y',
    assignee: 'Y',
    //
    system: 'Y',
    requestCategory: 'Y',
    levelOneDuration: 'Y',
    levelOneEscalatedTo: 'Y',
    levelTwoDuration: 'Y',
    levelTwoEscalatedTo: 'Y',
    assignTo: 'Y',
    messageTemplate: 'Y',
  }

  groupId: string = 'serviceDeskTab';

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private mandatoryFieldsService: MandatoryFieldsService,
    private systemsService: SystemsService
  ) { }

  ngOnInit(): void {
    this.serviceRequestCategoryCreateForm();
    this.requestEscalationCreateForm();
    this.getAllSystems();
  }

  serviceRequestCategoryCreateForm() {
    this.serviceRequestCategoryForm = this.fb.group({
      name: [''],
      shtDesc: [''],
      assignee: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.serviceRequestCategoryForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.serviceRequestCategoryForm.controls[key].addValidators(Validators.required);
                this.serviceRequestCategoryForm.controls[key].updateValueAndValidity();
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

  requestEscalationCreateForm() {
    this.requestEscalationForm = this.fb.group({
      system: [''],
      requestCategory: [''],
      levelOneDuration: [''],
      levelOneEscalatedTo: [''],
      levelTwoDuration: [''],
      levelTwoEscalatedTo: [''],
      assignTo: [''],
      messageTemplate: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.requestEscalationForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.requestEscalationForm.controls[key].addValidators(Validators.required);
                this.requestEscalationForm.controls[key].updateValueAndValidity();
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

  get f() {
    return this.serviceRequestCategoryForm.controls;
  }

  get g() {
    return this.requestEscalationForm.controls;
  }

  openServiceRequestCategoryModal() {
    const modal = document.getElementById('serviceRequestCategoryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeServiceRequestCategoryModal() {
    this.editMode = false;
    const modal = document.getElementById('serviceRequestCategoryModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openRequestEscalationModal() {
    const modal = document.getElementById('requestEscalationModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeRequestEscalationModal() {
    this.editMode = false;
    const modal = document.getElementById('requestEscalationModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  private toggleAllUsersModal(display: boolean) {
    this.allUsersModalVisible = display;
  }
  processSelectedUser($event: void) {
    this.toggleAllUsersModal(false);
    this.zIndex = 1;
  }

  openAllUsersModal() {
    this.zIndex  = -1;
    this.toggleAllUsersModal(true);
  }

  getSelectedUser(event: StaffDto) {
    this.selectedMainUser = event;
    log.info(this.selectedMainUser)
    this.serviceRequestCategoryForm.patchValue({
      assignee: event?.id
    });
  }

  /*getSelectedUser(event: StaffDto, formGroup: FormGroup, controlName: string) {
    this.selectedMainUser = event;
    console.log(this.selectedMainUser);
    formGroup.patchValue({
      [controlName]: event?.id
    });
  }*/

  getAllSystems() {
    this.systemsService.getSystems()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.systems = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  saveServiceRequestCategory() {

  }

  saveRequestEscalation() {

  }

  ngOnDestroy(): void {}
}
