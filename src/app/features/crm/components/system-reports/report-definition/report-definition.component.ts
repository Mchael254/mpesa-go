import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SystemsDto} from "../../../../../shared/data/common/systemsDto";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";

@Component({
  selector: 'app-report-definition',
  templateUrl: './report-definition.component.html',
  styleUrls: ['./report-definition.component.css']
})
export class ReportDefinitionComponent implements OnInit {
  sortingForm: FormGroup;
  modulesData: any;
  selectedModule: any;
  subModuleData: any;
  selectedSubModule: any;
  pageSize: 5;
  editMode: boolean = false;
  systems: SystemsDto[];
  defineModuleForm: FormGroup;
  defineSubModuleForm: FormGroup;

  visibleStatus: any = {
    moduleName: 'Y',
    moduleDescription: 'Y',
    system: 'Y',
    subModuleName: 'Y',
    subModuleDescription: 'Y'
  }
  groupId: string = 'reportDefinitionTab';


  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private systemsService: SystemsService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.createSortForm();
    this.createDefineModuleForm();
    this.createDefineSubModuleForm();
    this.getAllSystems();
  }

  createSortForm() {
    this.sortingForm = this.fb.group({
      module: '',
      system: ''
    });
  }

  createDefineModuleForm() {
    this.defineModuleForm = this.fb.group({
      moduleName: '',
      moduleDescription: '',
      system: ''
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.defineModuleForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.defineModuleForm.controls[key].addValidators(Validators.required);
                this.defineModuleForm.controls[key].updateValueAndValidity();
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

  createDefineSubModuleForm() {
    this.defineSubModuleForm = this.fb.group({
      subModuleName: '',
      subModuleDescription: '',
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.defineSubModuleForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.defineSubModuleForm.controls[key].addValidators(Validators.required);
                this.defineSubModuleForm.controls[key].updateValueAndValidity();
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

  openDefineModuleModal() {
    const modal = document.getElementById('moduleDefinitionModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeDefineModuleModal() {
    this.editMode = false;
    const modal = document.getElementById('moduleDefinitionModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openSubModuleModal() {
    const modal = document.getElementById('subModuleDefinitionModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeSubModuleModal() {
    this.editMode = false;
    const modal = document.getElementById('subModuleDefinitionModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveModuleDetails() {

  }

  saveSubModuleDetails() {

  }

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

  get g() {
    return this.defineModuleForm.controls;
  }

  ngOnDestroy(): void {}

}
