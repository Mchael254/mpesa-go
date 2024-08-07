import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table, TableLazyLoadEvent } from 'primeng/table';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SystemsService } from '../../../../shared/services/setups/systems/systems.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import {
  StatusDTO,
  SystemsDto,
} from '../../../../shared/data/common/systemsDto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { ScheduledJobsDto } from '../../data/scheduler';
import { SchedulerService } from '../../services/scheduler.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { OptionsService } from '../../services/options.service';
import { Options } from '../../data/options';
import { Alerts, JobType, Reports, Routine } from '../../data/job-type';
import { JobTypesService } from '../../services/job-types.service';
import { StaffDto } from '../../../../features/entities/data/StaffDto';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { MessagesService } from '../../services/messages.service';
import { MessageTemplate } from '../../data/messaging-template';
import { Pagination } from '../../../../shared/data/common/pagination';

const log = new Logger('SchedulerComponent');

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
})
export class SchedulerComponent implements OnInit {
  @ViewChild('schedulerTable') schedulerTable: Table;
  @ViewChild('templatesModal') templatesModal: any;

  public createSchedulerForm: FormGroup;

  public systems: SystemsDto[] = [];
  public scheduledJobsData: ScheduledJobsDto[] = [];
  public selectedScheduledJob: ScheduledJobsDto;
  public selectedSystem: number;
  public jobTypeData: JobType[] = [];
  public repeatOptionsData: Options[] = [];
  public userData: StaffDto[] = [];
  public templateData: any[] = [];
  public thresholdTypeData: any;
  public messageTemplateRes: Pagination<MessageTemplate>;
  public messageTemplateData: MessageTemplate[];
  public routineData: Routine[];
  public reportData: Reports[];
  public statusData: StatusDTO[] = [];
  public selectedSendTo = '';
  public selectedUser = '';
  public selectedFailedUser = '';
  public selectedTemplate: any;
  public selectedFailedTemplate = '';
  public selectedJobTemplate = '';
  public dynamicFieldLabel: string = '';
  optionLabel: string = '';

  messageTemplates: MessageTemplate[];
  messageTemplateResponse: Pagination<MessageTemplate>;
  selectedTemplateData: any;

  first = 0;
  rows = 10;
  pageNumber: number = 0;
  loading: boolean = false;
  templateFilter: string;
  contentFilter: string;
  triggeringField: string;

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
    private jobTypesService: JobTypesService,
    private optionsService: OptionsService,
    private staffService: StaffService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private statusService: StatusService,
    private messagesService: MessagesService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.fetchSystemApps();
    this.SchedulerForm();
    this.fetchJobTypes();
    this.fetchRepeatOptions();
    this.fetchThresholdType();
    this.fetchAllUsers();
    this.fetchStatus();
  }

  ngOnDestroy(): void {}

  SchedulerForm() {
    this.createSchedulerForm = this.fb.group({
      jobName: [''],
      jobDescription: [''],
      jobType: [''],
      sendTo: [''],
      jobTemplate: [''],
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

  openModal(field: string) {
    this.triggeringField = field;
    log.info('Trigger Field', this.triggeringField);
    // this.fetchMessageTemplates(this.selectedSystem);
    const modal = document.getElementById('templatesModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    const modal = document.getElementById('templatesModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  onTemplateSelect(event: any) {
    this.selectedTemplateData = event.data;
    log.info('Selected Template', this.selectedTemplateData);
    if (this.selectedTemplateData) {
      if (this.triggeringField === 'successTemplate') {
        this.selectedTemplate = this.selectedTemplateData;
        this.createSchedulerForm.patchValue({
          successTemplate: this.selectedTemplateData.id,
        });
      } else if (this.triggeringField === 'failedTemplate') {
        this.selectedFailedTemplate = this.selectedTemplateData;
        this.createSchedulerForm.patchValue({
          failedTemplate: this.selectedTemplateData.id,
        });
      }
      this.triggeringField = '';
      this.closeModal();
    }
  }

  saveSelectedTemplate() {
    if (this.selectedTemplateData) {
      if (this.triggeringField === 'successTemplate') {
        this.selectedTemplate = this.selectedTemplateData;
        this.createSchedulerForm.patchValue({
          successTemplate: this.selectedTemplateData.id,
        });
      } else if (this.triggeringField === 'failTemplate') {
        this.selectedFailedTemplate = this.selectedTemplateData;
        this.createSchedulerForm.patchValue({
          failTemplate: this.selectedTemplateData.id,
        });
      }
      this.triggeringField = '';
      this.closeModal();
    }
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
      this.fetchMessageTemplates(this.selectedSystem);
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

  fetchStatus() {
    this.statusService
      .getStatus()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.statusData = data;
            log.info('Fetch Status', this.statusData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchJobTypes() {
    this.jobTypesService
      .getJobTypes()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.jobTypeData = data;
            log.info('Fetch Job Types', this.jobTypeData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchRepeatOptions() {
    this.optionsService
      .getRepeatOptions()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.repeatOptionsData = data;
            log.info('Fetch repeat options', this.repeatOptionsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchMessageTemplates(systemId: number) {
    this.loading = true;
    this.messagesService
      .getMessageTemplates(systemId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.messageTemplateRes = data;
            this.messageTemplateData = data.content;
            this.loading = false;
            log.info('Fetch Message Templates', this.messageTemplateData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
          this.loading = false;
        },
      });
  }

  fetchThresholdType() {
    this.optionsService
      .getThresholdType()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.thresholdTypeData = data;
            log.info('Fetch Threshold Type', this.thresholdTypeData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  onJobTypeChange(event: any): void {
    const selectedJobType = event.target.value;

    this.ngZone.run(() => {
      switch (selectedJobType) {
        case 'RPT':
          this.dynamicFieldLabel = 'Report Name';
          this.optionLabel = 'name';
          this.fetchReports();
          break;
        case 'J':
          this.dynamicFieldLabel = 'Routine Name';
          this.optionLabel = 'description';
          this.fetchRoutines();
          break;
        case 'A':
          this.dynamicFieldLabel = 'Message Template';
          this.optionLabel = 'message';
          this.fetchAlerts();
          break;
        default:
          this.templateData = [];
          break;
      }
      this.cdr.detectChanges();
    });
  }

  fetchReports(): void {
    this.jobTypesService
      .getAllReports()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: Reports[]) => {
          if (data) {
            // this.ngZone.run(() => {
            //   this.templateData = data.map((report) => ({
            //     value: report.code,
            //     name: report.name,
            //   }));
            //   this.templateData = data;
            //   // this.cdr.markForCheck();
            //   this.cdr.detectChanges();
            //   log.info('Fetch Job Types Reports', this.templateData);
            // });
            this.templateData = data;
            this.cdr.detectChanges();
            log.info('Fetch Job Types Reports', this.templateData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchRoutines(): void {
    this.jobTypesService
      .getAllRoutines()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: Routine[]) => {
          if (data) {
            // this.ngZone.run(() => {
            //   this.templateData = data.map((routine) => ({
            //     value: routine.code,
            //     name: routine.description,
            //   }));
            //   // this.cdr.markForCheck();
            //   this.cdr.detectChanges();
            //   log.info('Fetch Job Types Routines', this.templateData);
            // });
            this.templateData = data;
            this.cdr.detectChanges();
            log.info('Fetch Job Types Routines', this.templateData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchAlerts(): void {
    this.jobTypesService
      .getAlerts()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: Alerts[]) => {
          if (data) {
            // this.ngZone.run(() => {
            //   this.templateData = data.map((alert) => ({
            //     value: alert.code,
            //     name: alert.message,
            //   }));
            //   // this.cdr.markForCheck();
            //   this.cdr.detectChanges();
            //   log.info('Fetch Job Types Alerts', this.templateData);
            // });
            this.templateData = data;
            this.cdr.detectChanges();
            log.info('Fetch Job Types Alerts', this.templateData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchAllUsers() {
    this.staffService
      .getStaff(0, 1000, 'U', 'dateCreated', 'desc', null)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.userData = data.content;
            log.info('Fetch All Users:', this.userData);
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
