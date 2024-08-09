import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";

@Component({
  selector: 'app-priority-levels-activity-status',
  templateUrl: './priority-levels-activity-status.component.html',
  styleUrls: ['./priority-levels-activity-status.component.css']
})
export class PriorityLevelsActivityStatusComponent implements OnInit{
  pageSize: 5;
  priorityLevelsData: any[];
  selectedPriorityLevels: any[] = [];
  activityStatusData: any[];
  selectedActivityStatus: any[] = [];

  createNewPriorityLevelForm: FormGroup;
  createNewActivityStatusForm: FormGroup;
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
  ) {}

  ngOnInit(): void {
    this.priorityLevelCreateForm();
    this.activityStatusCreateForm();
  }

  priorityLevelCreateForm() {
    this.createNewPriorityLevelForm = this.fb.group({
      shortDescription: [''],
      description: ['']
    });
  };

  activityStatusCreateForm() {
    this.createNewActivityStatusForm = this.fb.group({
      shortDescription: [''],
      description: ['']
    });
  };

  get f() {
    return this.createNewPriorityLevelForm.controls;
  }

  get g() {
    return this.createNewActivityStatusForm.controls;
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
    this.openDefinePriorityLevelModal();
  }

  editActivityStatus() {
    this.editMode = !this.editMode;
    this.openActivityStatusModal();
  }
}
