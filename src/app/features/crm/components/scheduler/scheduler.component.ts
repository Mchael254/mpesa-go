import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import {
  Recurrence,
  ScheduledJobsDto,
  ScheduledJobsPostDto,
} from '../../data/scheduler';
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
import { UtilService } from 'src/app/shared/services/util/util.service';

const log = new Logger('SchedulerComponent');

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
})
export class SchedulerComponent implements OnInit {
  @ViewChild('schedulerTable') schedulerTable: Table;
  @ViewChild('templatesModal') templatesModal: any;
  @ViewChild('monthlyContainer') monthlyContainer: ElementRef;
  @ViewChild('yearlyContainer') yearlyContainer: ElementRef;

  public createSchedulerForm: FormGroup;

  public systems: SystemsDto[] = [];
  public scheduledJobsData: ScheduledJobsDto[] = [];
  public selectedScheduledJob: ScheduledJobsDto;
  public selectedSystem: number;
  public jobTypeData: JobType[] = [];
  public repeatOptionsData: Options[] = [];
  public userData: StaffDto[] = [];
  public templateData: any[] = [];
  public thresholdTypeData: Options[] = [];
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
  public submitted = false;
  public errorMessage: string = '';
  public visibleStatus: any = {};
  public response: any;
  public groupId: string = 'schedulerTab';

  public recurrenceForm: FormGroup;
  public showListbox: boolean = false;
  public selectedDays: any[] = [];
  public showWeekDaysListbox = false;
  public showMonthsListbox = false;
  public weekDaysPlaceholder = 'The';
  public showYearlyWeekDaysListbox = false;
  public showYearlyMonthsListbox = false;
  public yearlyWeekDaysPlaceholder = 'The';
  firstFocus: boolean = true;

  months = [
    { name: 'January', value: 'jan' },
    { name: 'February', value: 'feb' },
    { name: 'March', value: 'mar' },
    { name: 'April', value: 'apr' },
    { name: 'May', value: 'may' },
    { name: 'June', value: 'jun' },
    { name: 'July', value: 'jul' },
    { name: 'August', value: 'aug' },
    { name: 'September', value: 'sep' },
    { name: 'October', value: 'oct' },
    { name: 'November', value: 'nov' },
    { name: 'December', value: 'dec' },
  ];

  weekDays = [
    { name: 'Monday', value: 'mon' },
    { name: 'Tuesday', value: 'tue' },
    { name: 'Wednesday', value: 'wed' },
    { name: 'Thursday', value: 'thu' },
    { name: 'Friday', value: 'fri' },
    { name: 'Saturday', value: 'sat' },
    { name: 'Sunday', value: 'sun' },
  ];

  weekOptions = [
    { name: 'First', value: 'first' },
    { name: 'Second', value: 'second' },
    { name: 'Third', value: 'third' },
    { name: 'Fourth', value: 'fourth' },
    { name: 'Last', value: 'last' },
  ];

  weekToDaysMap = {
    first: [],
    second: [],
    third: [],
    fourth: [],
    last: [],
  };

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
    private utilService: UtilService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchSystemApps();
    this.SchedulerForm();
    this.RecurrenceForm();
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

  RecurrenceForm() {
    this.recurrenceForm = this.fb.group({
      type: ['monthly', Validators.required],
      interval: [1, [Validators.required, Validators.min(1)]],
      dayOfWeek: ['mon'],
      daysOfWeek: this.fb.array([]),
      month: ['', Validators.required],
      dayOfMonthMonthly: [1, [Validators.required, Validators.min(1)]],
      repeatOnTheMonthly: ['day', Validators.required],
      monthlyRepeatOnThe: [[], Validators.required],
      monthlyDays: [[]],
      yearlyRepeatOnThe: [[], Validators.required],
      yearlyDays: [[]],
      yearlyMonths: [[]],
      dayOfMonthYearly: [1, [Validators.required, Validators.min(1)]],
      repeatOnTheYearly: ['day', Validators.required],
      end: ['never', Validators.required],
      endOn: [''],
      occurrences: [1, Validators.min(1)],
    });

    // Subscribe to interval value changes
    this.recurrenceForm.get('interval')?.valueChanges.subscribe((value) => {
      this.updateSummary();
    });
  }

  // RecurrenceForm() {
  //   this.recurrenceForm = this.fb.group({
  //     type: ['monthly', Validators.required],
  //     interval: [1, [Validators.required, Validators.min(1)]],
  //     dayOfWeek: ['mon'],
  //     daysOfWeek: this.fb.array([]),
  //     dayOfMonthMonthly: [1, [Validators.required, Validators.min(1)]],
  //     repeatOnTheMonthly: ['day', Validators.required],
  //     monthlyRepeatOnThe: this.fb.group({
  //       week: [null, Validators.required], // Selected week option
  //       days: [[], Validators.required], // Selected week days
  //     }),
  //     yearlyRepeatOnThe: this.fb.group({
  //       week: [null, Validators.required], // Selected week option
  //       days: [[], Validators.required], // Selected week days
  //       months: [[], Validators.required], // Selected months
  //     }),
  //     dayOfMonthYearly: [1, [Validators.required, Validators.min(1)]],
  //     repeatOnTheYearly: ['day', Validators.required],
  //     end: ['never', Validators.required],
  //     endOn: [''],
  //     occurrences: [1, Validators.min(1)],
  //   });

  //   // Subscribe to interval value changes
  //   this.recurrenceForm.get('interval')?.valueChanges.subscribe((value) => {
  //     this.updateSummary();
  //   });
  // }

  toggleDaySelection(day: string) {
    const daysOfWeekArray = this.daysOfWeek;
    const index = daysOfWeekArray.controls.findIndex(
      (control) => control.value === day
    );
    if (index > -1) {
      daysOfWeekArray.removeAt(index);
    } else {
      daysOfWeekArray.push(this.fb.control(day));
    }
    this.updateSummary();
  }

  // When monthly week options change, update the corresponding days
  onWeekOptionChange(event: any) {
    const selectedWeeks = event.value.map((opt: any) => opt.value);

    // Reset the selected weekdays in the form and the weekToDaysMap
    this.recurrenceForm.get('monthlyDays')?.setValue([]);
    selectedWeeks.forEach((week) => {
      this.weekToDaysMap[week] = [];
    });

    // Show the listbox if weeks are selected
    this.showWeekDaysListbox = selectedWeeks.length > 0;
    log.info('Show Week Days Listbox:', this.showWeekDaysListbox);
    this.updatePlaceholder();
  }

  // When a day is selected, update the corresponding week in weekToDaysMap
  onDaySelectionChange() {
    const selectedDays = this.recurrenceForm.get('monthlyDays')?.value || [];

    // Get the selected weeks
    const selectedWeeks =
      this.recurrenceForm
        .get('monthlyRepeatOnThe')
        ?.value.map((opt: any) => opt.value) || [];

    // Update weekToDaysMap with the selected days
    selectedWeeks.forEach((week) => {
      this.weekToDaysMap[week] = selectedDays.map((day: any) => day.value);
    });

    // Log the updated weekToDaysMap
    log.info('Updated weekToDaysMap:', this.weekToDaysMap);

    // Update the placeholder text
    this.updatePlaceholder();
  }

  // Update the placeholder text based on selected weeks and days
  updatePlaceholder() {
    const selectedWeeks =
      this.recurrenceForm
        .get('monthlyRepeatOnThe')
        ?.value.map((opt: any) => opt.name)
        .join(', ') || '';

    const selectedDaysArray =
      this.recurrenceForm.get('monthlyDays')?.value || [];
    const selectedDays =
      selectedDaysArray.map((day: any) => day.name).join(', ') || '';

    this.weekDaysPlaceholder =
      selectedWeeks && selectedDays
        ? `${selectedWeeks}: ${selectedDays}`
        : selectedWeeks || selectedDays || 'The';
  }

  // Show the listbox again if p-multiSelect is clicked
  onMultiSelectFocus() {
    this.showWeekDaysListbox =
      this.recurrenceForm.get('monthlyRepeatOnThe')?.value.length > 0;
  }

  // Listen for clicks outside the containers
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      this.monthlyContainer &&
      !this.monthlyContainer.nativeElement.contains(event.target)
    ) {
      this.showWeekDaysListbox = false;
    }
    if (
      this.yearlyContainer &&
      !this.yearlyContainer.nativeElement.contains(event.target)
    ) {
      this.showYearlyWeekDaysListbox = false;
      this.showYearlyMonthsListbox = false;
    }
  }

  // When yearly week options change, update the corresponding days
  onYearlyWeekOptionChange(event: any) {
    const selectedWeeks = event.value.map((opt: any) => opt.value);

    // Reset the selected weekdays in the form and the weekToDaysMap
    this.recurrenceForm.get('yearlyDays')?.setValue([]);
    selectedWeeks.forEach((week) => {
      this.weekToDaysMap[week] = [];
    });

    // Show the listbox if weeks are selected
    this.showYearlyWeekDaysListbox = selectedWeeks.length > 0;
    this.showYearlyMonthsListbox = false;
    this.updateYearlyPlaceholder();
  }

  // When a yearly day is selected, trigger the months listbox
  onYearlyDaySelectionChange() {
    const selectedDays = this.recurrenceForm.get('yearlyDays')?.value || [];
    this.showYearlyMonthsListbox = selectedDays.length > 0; // Show months listbox only when a day is selected

    // Update the placeholder text
    this.updateYearlyPlaceholder();
  }

  // When months are selected, update the corresponding months
  onYearlyMonthSelectionChange() {
    const selectedMonths = this.recurrenceForm.get('yearlyMonths')?.value || [];
    // You can add additional logic here if needed for months

    // Update the placeholder text
    this.updateYearlyPlaceholder();
  }

  // Update the placeholder text based on selected weeks, days, and months
  updateYearlyPlaceholder() {
    const selectedWeeks =
      this.recurrenceForm
        .get('yearlyRepeatOnThe')
        ?.value.map((opt: any) => opt.name)
        .join(', ') || '';

    const selectedDaysArray =
      this.recurrenceForm.get('yearlyDays')?.value || [];
    const selectedDays =
      selectedDaysArray.map((day: any) => day.name).join(', ') || '';

    const selectedMonthsArray =
      this.recurrenceForm.get('yearlyMonths')?.value || [];
    const selectedMonths =
      selectedMonthsArray.map((month: any) => month.name).join(', ') || '';

    this.yearlyWeekDaysPlaceholder =
      selectedWeeks && selectedDays && selectedMonths
        ? `${selectedWeeks}: ${selectedDays}, ${selectedMonths}`
        : selectedWeeks || selectedDays || selectedMonths || 'The';
  }

  onYearlyMultiSelectFocus() {
    const selectedWeeks = this.recurrenceForm.get('yearlyRepeatOnThe')?.value;

    // Check if there are selected weeks and display both listboxes accordingly
    if (selectedWeeks && selectedWeeks.length > 0) {
      this.showYearlyWeekDaysListbox = true;
      this.showYearlyMonthsListbox = true;
    }
  }

  get g() {
    return this.recurrenceForm.controls;
  }

  get daysOfWeek(): FormArray {
    return this.recurrenceForm.get('daysOfWeek') as FormArray;
  }

  onRepeatChange(event: any) {
    const selectedValue = event.target.value;

    // Determine the recurrence type based on the selected value
    let recurrenceType: string;
    switch (selectedValue) {
      case 'D':
        recurrenceType = 'daily';
        break;
      case 'W':
        recurrenceType = 'weekly';
        break;
      case 'M':
        recurrenceType = 'monthly';
        break;
      case 'Y':
        recurrenceType = 'yearly';
        break;
      default:
        recurrenceType = '';
        break;
    }

    // Patch the form value only if the selected type is valid
    if (recurrenceType) {
      this.recurrenceForm.patchValue({ type: recurrenceType });
      this.openRecurrenceModal();
    } else {
      // Handle the case where no valid type is selected (e.g., "None")
      this.recurrenceForm.patchValue({ type: null });
      this.closeRecurrenceModal();
    }
  }

  // Update summary function to include yearly option
  updateSummary() {
    const type = this.recurrenceForm.get('type')?.value;
    let summaryText = `Occurs every ${
      this.recurrenceForm.get('interval')?.value
    } ${type}(s)`;

    if (type === 'weekly') {
      const days = this.recurrenceForm
        .get('daysOfWeek')
        ?.value.map(
          (day: string) => this.weekDays.find((d) => d.value === day)?.name
        )
        .join(', ');
      summaryText += ` on ${days}`;
    } else if (type === 'monthly') {
      const repeatOnThe = this.recurrenceForm.get('monthlyRepeatOnThe')?.value;
      if (repeatOnThe && repeatOnThe.length > 0) {
        const weeks = repeatOnThe.map((opt: any) => opt.name).join(', ');
        const days = this.recurrenceForm
          .get('monthlyDays')
          ?.value.map((day: any) => day.name)
          .join(', ');
        summaryText += ` on the ${weeks} ${days}`;
      } else {
        const dayOfMonth = this.recurrenceForm.get('dayOfMonthMonthly')?.value;
        summaryText += ` on day ${dayOfMonth} of the month`;
      }
    } else if (type === 'yearly') {
      const yearlyRepeatOnThe =
        this.recurrenceForm.get('yearlyRepeatOnThe')?.value;
      if (yearlyRepeatOnThe && yearlyRepeatOnThe.length > 0) {
        const weeks = yearlyRepeatOnThe.map((opt: any) => opt.name).join(', ');
        const days = this.recurrenceForm
          .get('yearlyDays')
          ?.value.map((day: any) => day.name)
          .join(', ');
        const months = this.recurrenceForm
          .get('yearlyMonths')
          ?.value.map((month: any) => month.name)
          .join(', ');
        summaryText += ` on the ${weeks} ${days} of ${months}`;
      } else {
        const dayOfMonthYearly =
          this.recurrenceForm.get('dayOfMonthYearly')?.value;
        const month = this.recurrenceForm.get('month')?.value;
        const monthName = this.months.find((m) => m.value === month)?.name;
        summaryText += ` on the ${dayOfMonthYearly}th of ${monthName}`;
      }
    }

    // Handle the end options
    const end = this.recurrenceForm.get('end')?.value;
    if (end === 'on') {
      summaryText += ` until ${this.recurrenceForm.get('endOn')?.value}`;
    } else if (end === 'after') {
      summaryText += ` for ${
        this.recurrenceForm.get('occurrences')?.value
      } occurrences`;
    }

    return summaryText;
  }

  openRecurrenceModal() {
    const modal = document.getElementById('recurrenceModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeRecurrenceModal() {
    const modal = document.getElementById('recurrenceModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
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

  saveScheduler() {
    this.submitted = true;
    this.createSchedulerForm.markAllAsTouched();

    if (this.createSchedulerForm.invalid) {
      const invalidControls = Array.from(
        document.querySelectorAll('.is-invalid')
      ) as Array<HTMLInputElement | HTMLSelectElement>;

      let firstInvalidUnfilledControl:
        | HTMLInputElement
        | HTMLSelectElement
        | null = null;

      for (const control of invalidControls) {
        if (!control.value) {
          firstInvalidUnfilledControl = control;
          break;
        }
      }

      if (firstInvalidUnfilledControl) {
        firstInvalidUnfilledControl.focus();
        const scrollContainer = this.utilService.findScrollContainer(
          firstInvalidUnfilledControl
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop;
        }
      } else {
        const firstInvalidControl = invalidControls[0];
        if (firstInvalidControl) {
          firstInvalidControl.focus();
          const scrollContainer =
            this.utilService.findScrollContainer(firstInvalidControl);
          if (scrollContainer) {
            scrollContainer.scrollTop = firstInvalidControl.offsetTop;
          }
        }
      }
      return;
    }

    this.closeSchedulerModal();

    if (!this.selectedScheduledJob) {
      const schedulerFormValues = this.createSchedulerForm.getRawValue();
      const recurrenceData = this.collectRecurrenceData();

      const saveScheduler: ScheduledJobsPostDto = {
        code: null,
        description: schedulerFormValues.jobDescription,
        endTime: null,
        failNotifyTemplate: schedulerFormValues.failedTemplate,
        jobAssignee: schedulerFormValues.sendTo,
        jobName: schedulerFormValues.jobName,
        jobTemplate: schedulerFormValues.jobTemplate,
        jobType: schedulerFormValues.jobType,
        nextFireTime: null,
        notifiedFailUser: schedulerFormValues.failedUser,
        notifiedSuccUser: schedulerFormValues.successUser,
        prevFireTime: null,
        recurrence: schedulerFormValues.repeat,
        // recurrence: this.buildRecurrenceDescription(recurrenceData),
        // recurrenceInterval: recurrenceFormValues.interval,
        // recurrenceType: recurrenceFormValues.type,
        recurrenceInterval: recurrenceData.interval,
        recurrenceType: this.buildRecurrenceDescription(recurrenceData),
        startTime: schedulerFormValues.executionTime,
        status: schedulerFormValues.status,
        succNotifyTemplate: schedulerFormValues.successTemplate,
        sysCode: this.selectedSystem,
        thresholdType: schedulerFormValues.thresholdType,
        thresholdValue: schedulerFormValues.thresholdValue,
      };

      log.info('Scheduler Details to be saved >>>>', saveScheduler);
    }
  }

  editScheduler() {}

  deleteScheduler() {}

  saveOccurence() {
    const recurrenceData = this.collectRecurrenceData();
    log.info('Collected Recurrence Data:', recurrenceData);

    log.info('Recurrence Type', recurrenceData.type);

    this.closeRecurrenceModal();
  }
  collectRecurrenceData() {
    const recurrenceType = this.recurrenceForm.get('type')?.value;
    const interval = this.recurrenceForm.get('interval')?.value;

    let recurrenceData: any = {
      type: recurrenceType,
      interval: interval,
    };

    if (recurrenceType === 'weekly') {
      recurrenceData.daysOfWeek =
        this.recurrenceForm.get('daysOfWeek')?.value || [];
    } else if (recurrenceType === 'monthly') {
      const repeatOnThe = this.recurrenceForm.get('repeatOnTheMonthly')?.value;
      recurrenceData.monthlyOption = {
        type: repeatOnThe,
        dayOfMonth: this.recurrenceForm.get('dayOfMonthMonthly')?.value,
        week: this.recurrenceForm.get('monthlyRepeatOnThe')?.value || [],
        days: this.recurrenceForm.get('monthlyDays')?.value || [],
      };
    } else if (recurrenceType === 'yearly') {
      const repeatOnThe = this.recurrenceForm.get('repeatOnTheYearly')?.value;
      recurrenceData.yearlyOption = {
        type: repeatOnThe,
        dayOfMonth: this.recurrenceForm.get('dayOfMonthYearly')?.value,
        week: this.recurrenceForm.get('yearlyRepeatOnThe')?.value || [],
        days: this.recurrenceForm.get('yearlyDays')?.value || [],
        months: this.recurrenceForm.get('yearlyMonths')?.value || [],
      };
    }

    return recurrenceData;
  }

  buildRecurrenceDescription(recurrenceData: any): string {
    switch (recurrenceData.type) {
      case 'daily':
        return `Repeats every ${recurrenceData.interval} day(s)`;

      case 'weekly':
        return `Repeats every ${
          recurrenceData.interval
        } week(s) on ${recurrenceData.daysOfWeek.join(', ')}`;

      case 'monthly':
        if (recurrenceData.monthlyOption.type === 'day') {
          return `Repeats every ${recurrenceData.interval} month(s) on day ${recurrenceData.monthlyOption.dayOfMonth}`;
        } else {
          const weekDescription = recurrenceData.monthlyOption.week
            .map((week) => week.name)
            .join(', ');
          const dayDescription = recurrenceData.monthlyOption.days
            .map((day) => day.name)
            .join(', ');
          return `Repeats every ${recurrenceData.interval} month(s) on the ${weekDescription} of ${dayDescription}`;
        }

      case 'yearly':
        if (recurrenceData.yearlyOption.type === 'day') {
          const monthName = recurrenceData.yearlyOption.months[0]?.name || ''; // Assuming only one month selected
          return `Repeats every ${recurrenceData.interval} year(s) on ${monthName} ${recurrenceData.yearlyOption.dayOfMonth}`;
        } else {
          const weekDescription = recurrenceData.yearlyOption.week
            .map((week) => week.name)
            .join(', ');
          const dayDescription = recurrenceData.yearlyOption.days
            .map((day) => day.name)
            .join(', ');
          const monthDescription = recurrenceData.yearlyOption.months
            .map((month) => month.name)
            .join(', ');
          return `Repeats every ${recurrenceData.interval} year(s) on the ${weekDescription} of ${dayDescription} in ${monthDescription}`;
        }

      default:
        return 'None';
    }
  }
}
