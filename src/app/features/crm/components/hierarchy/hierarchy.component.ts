import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {untilDestroyed} from "../../../../shared/services/until-destroyed";
import {MandatoryFieldsService} from "../../../../shared/services/mandatory-fields/mandatory-fields.service";

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css']
})
export class HierarchyComponent implements OnInit {
  pageSize: 5;
  systems: SystemsDto[] = [];
  selectedSystem: SystemsDto = {
    id: undefined,
    shortDesc: undefined,
    systemName: undefined,
  };
  shouldShowSystems: boolean = false;
  hierarchyTypeData: any;
  selectedHierarchyType: any;
  editMode: boolean = false;

  hierarchyLevelData: any;
  selectedHierarchyLevel: any;
  previousSubDivHeadsData: any;
  selectedPreviousSubDivHeads: any;
  orgSubDivForm: FormGroup;
  hierarchyTypeForm: FormGroup;
  hierarchyLevelsForm: FormGroup;
  hierarchyHeadHistoryForm: FormGroup;

  visibleStatus: any = {
    parentDivision: 'Y',
    divisionLevelType: 'Y',
    divisionLevel: 'Y',
    name: 'Y',
    divisionHead: 'Y',
    location: 'Y',
    managerAllowed: 'Y',
    overrideCommAllowed: 'Y',
    wef: 'Y',
    wet: 'Y',
  //
    description: 'Y',
    accType: 'Y',
    headAccType: 'Y',
    type: 'Y',
    intermediary: 'Y',
    payIntermediary: 'Y',
  //
    ranking: 'Y',
    agentName: 'Y',
    desc: 'Y'
  }

  groupId: string = 'hierarchyLevelTab';
  groupIdHierarchyType: string = 'hierarchyTypeTab';

  constructor(
    private systemsService: SystemsService,
    private globalMessagingService: GlobalMessagingService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchSystems();
    this.orgSubDivCreateForm();
    this.hierarchyTypeCreateForm();
    this.hierarchyLevelsCreateForm();
    this.hierarchyHeadHistoryCreateForm();
  }

  orgSubDivCreateForm() {
    this.orgSubDivForm = this.fb.group({
      parentDivision: [''],
      divisionLevelType: [''],
      divisionLevel: [''],
      name: [''],
      divisionHead: [''],
      location: [''],
      managerAllowed: [''],
      overrideCommAllowed: [''],
      wef: [''],
      wet: ['']
    });
  }

  hierarchyTypeCreateForm() {
    this.hierarchyTypeForm = this.fb.group({
      description: [''],
      accType: [''],
      headAccType: [''],
      type: [''],
      intermediary: [''],
      payIntermediary: ['']
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupIdHierarchyType)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        response.forEach((field) => {
          for (const key of Object.keys(this.hierarchyTypeForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.hierarchyTypeForm.controls[key].addValidators(
                  Validators.required
                );
                this.hierarchyTypeForm.controls[key].updateValueAndValidity();
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

  hierarchyLevelsCreateForm() {
    this.hierarchyLevelsForm = this.fb.group({
      desc: [''],
      ranking: [''],
      type: ['']
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        response.forEach((field) => {
          for (const key of Object.keys(this.hierarchyLevelsForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.hierarchyLevelsForm.controls[key].addValidators(
                  Validators.required
                );
                this.hierarchyLevelsForm.controls[key].updateValueAndValidity();
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

  hierarchyHeadHistoryCreateForm() {
    this.hierarchyHeadHistoryForm = this.fb.group({
      agentName: [''],
      wef: [''],
      wet: ['']
    });
  }

  get f() {
    return this.hierarchyTypeForm.controls;
  }

  get g() {
    return this.hierarchyLevelsForm.controls;
  }

  openDefineHierarchyTypeModal() {
    const modal = document.getElementById('newHierarchyType');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

   /* if (this.editMode) {
      this.activityTypeForm.patchValue({
        description: this.selectedActivityType.desc,
      });
    }*/
  }

  closeDefineHierarchyTypeModal() {
    this.editMode = false;
    const modal = document.getElementById('newHierarchyType');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  editHierarchyType() {
    if (this.selectedHierarchyType?.id) {
      this.editMode = !this.editMode;
      this.openDefineHierarchyTypeModal();
    }
  }

  openDefineHierarchyLevelsModal() {
    const modal = document.getElementById('newHierarchyLevel');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    /* if (this.editMode) {
       this.activityTypeForm.patchValue({
         description: this.selectedActivityType.desc,
       });
     }*/
  }

  closeDefineHierarchyLevelsModal() {
    this.editMode = false;
    const modal = document.getElementById('newHierarchyLevel');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  editHierarchyLevels() {
    if (this.selectedHierarchyType?.id) {
      this.editMode = !this.editMode;
      this.openDefineHierarchyLevelsModal();
    }
  }

  openDefinePreviousSubDivHeadsModal() {
    const modal = document.getElementById('newHierarchyHeadHistory');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    /* if (this.editMode) {
       this.activityTypeForm.patchValue({
         description: this.selectedActivityType.desc,
       });
     }*/
  }

  closeDefinePreviousSubDivHeadsModal() {
    this.editMode = false;
    const modal = document.getElementById('newHierarchyHeadHistory');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  editPreviousSubDivHeads() {
    if (this.selectedHierarchyType?.id) {
      this.editMode = !this.editMode;
      this.openDefineHierarchyLevelsModal();
    }
  }

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

  selectSystem(system: SystemsDto): void {
    this.selectedSystem = system;
  }

  saveHierarchyType() {

  }

  saveHierarchyLevel() {

  }

  saveHierarchyHeadHistory() {

  }

  ngOnDestroy(): void {}
}
