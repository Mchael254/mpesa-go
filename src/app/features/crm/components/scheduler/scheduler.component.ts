import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SystemsService } from '../../../../shared/services/setups/systems/systems.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { SystemsDto } from '../../../../shared/data/common/systemsDto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { ScheduledJobsDto } from '../../data/scheduler';
import { SchedulerService } from '../../services/scheduler.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';

const log = new Logger('SchedulerComponent');

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
})
export class SchedulerComponent implements OnInit {
  @ViewChild('schedulerTable') schedulerTable: Table;

  public createSchedulerForm: FormGroup;

  public systems: SystemsDto[] = [];
  public scheduledJobsData: ScheduledJobsDto[] = [];
  public selectedScheduledJob: ScheduledJobsDto;
  public selectedSystem: number;
  public jobTypeData: any;
  public repeatOption: any;
  public userData: any;
  public templateData: any;
  public thresholdTypeData: any;

  public errorOccurred = false;
  public errorMessage: string = '';
  public visibleStatus: any = {};
  public response: any;
  public groupId: string = 'schedulerTab';

  organizationBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/crm',
    },
    {
      label: 'Messaging',
      url: '/home/crm',
    },

    {
      label: 'Scheduler',
      url: '/home/crm/scheduler',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private schedulerService: SchedulerService,
    private globalMessagingService: GlobalMessagingService,
    private systemsService: SystemsService,
    private mandatoryFieldsService: MandatoryFieldsService
  ) {}

  ngOnInit(): void {
    this.fetchSystemApps();
    this.SchedulerForm();
  }

  ngOnDestroy(): void {}

  SchedulerForm() {
    this.createSchedulerForm = this.fb.group({
      jobName: [''],
      jobDescription: [''],
      jobType: [''],
      executionTime: [''],
      repeat: [''],
      successUser: [''],
      successTemplate: [''],
      failedUser: [''],
      failedTemplate: [''],
      thresholdType: [''],
      thresholdValue: [''],
      status: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          this.visibleStatus[field.frontedId] = field.visibleStatus;
          if (field.visibleStatus === 'Y' && field.mandatoryStatus === 'Y') {
            const key = field.frontedId;
            this.createSchedulerForm.controls[key].setValidators(
              Validators.required
            );
            this.createSchedulerForm.controls[key].updateValueAndValidity();
            const label = document.querySelector(`label[for=${key}]`);
            if (label) {
              const asterisk = document.createElement('span');
              asterisk.innerHTML = ' *';
              asterisk.style.color = 'red';
              label.appendChild(asterisk);
            }
          }
        });
      });
  }

  get f() {
    return this.createSchedulerForm.controls;
  }

  fetchSystemApps(organizationId?: number) {
    this.systemsService
      .getSystems(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.systems = data;
            log.info('Systems Data:', this.systems);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  onSystemChange() {
    if (this.selectedSystem !== null) {
      this.fetchScheduledJobs(this.selectedSystem);
    }
  }

  fetchScheduledJobs(
    systemCode: number,
    jobName?: string,
    description?: string
  ) {
    this.schedulerService
      .getScheduledJobs(systemCode, jobName, description)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.scheduledJobsData = data;
            log.info('Scheduled Jobs Data:', this.scheduledJobsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  filterScheduler(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.schedulerTable.filterGlobal(filterValue, 'contains');
  }

  onSchedulerRowSelect(scheduler: ScheduledJobsDto) {
    this.selectedScheduledJob = scheduler;
  }

  openSchedulerModal() {
    const modal = document.getElementById('schedulerModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeSchedulerModal() {
    const modal = document.getElementById('schedulerModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveScheduler() {}

  editScheduler() {}

  deleteScheduler() {}
}
