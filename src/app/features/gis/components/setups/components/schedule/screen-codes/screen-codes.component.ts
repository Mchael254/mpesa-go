import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ScheduleService} from "../../../services/schedule/schedule.service";
import {take} from "rxjs/operators";
import {ScreenCode} from "../../../data/gisDTO";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NgxSpinnerService} from 'ngx-spinner';
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";
import {Logger} from "../../../../../../../shared/services/logger/logger.service";


const log = new Logger('ScreenCodesComponent');

@Component({
  selector: 'app-screen-codes',
  templateUrl: './screen-codes.component.html',
  styleUrls: ['./screen-codes.component.css']
})
export class ScreenCodesComponent implements OnInit{
  private allScreenCodes: ScreenCode[];
  public filteredScreenCodes: ScreenCode[];
  selectedScreenCode: ScreenCode;
  public isDetailsViewActive: boolean = true;
  public screenForm: FormGroup;
  isUpdateScreenCode: boolean = false;

  public breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'GIS Setups',
      url: '/home/gis/setup/schedule/screen-codes',
    },
    {
      label: 'Screen codes',
      url: '/home/gis/setup/schedule/screen-codes'
    }
  ];

  constructor(
    private scheduleService: ScheduleService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageService: GlobalMessagingService,
  ) {
  }

  /**
   * Initializes component by:
   * 1. Getting all screenCodes from the DB
   * 2. Create screenCode form
   * @return void
   */
  ngOnInit(): void {
    this.loadAllScreenCodes();
    this.createScreenForm();
    this.spinner.show();
  }

  /**
   * Gets a list of all screenCodes from the DB
   * @return void
   */
   loadAllScreenCodes(): void {
    this.scheduleService.getAllScreenCodes()
      .pipe(take(1))
      .subscribe((screenCodes) => {
        this.allScreenCodes = screenCodes._embedded.screen_dto_list;
        this.filteredScreenCodes = screenCodes._embedded.screen_dto_list;
        this.spinner.hide();
      });
  }

  /**
   * Creates a screenCode form
   * @return void
   */
  createScreenForm() {
    this.screenForm = this.fb.group({
      code: new FormControl(''),
      screen_description: new FormControl(''),
      level: new FormControl(''),
      screen_name: new FormControl(''),
      schedule_report_name: new FormControl(''),
      endorsement_schedule: new FormControl(''),
      renewalCertificates: new FormControl(''),
      renewalNotice: new FormControl(''),
      screen_title: new FormControl(''),
      policy_document_name:  new FormControl(''),
      is_schedule_required:  new FormControl(''),
      help_content:  new FormControl(''),
      show_default_risks:  new FormControl(''),
      number_of_risks:  new FormControl(''),
      show_sum_insured: new FormControl(''),
      cover_summary_name: new FormControl(''),
      claim_schedule_report: new FormControl(''),
      fleetName: null,
      policySchedule: null,
      riskReportName: "string",
      riskNoteName: null,
      xmlRiskNoteName: null,
      screenType: null,
      screenId: 2,
      organization_code: 2,
      version: 2,
    })
  }

  /**
   * Search for a screenCode by filtering using name
   * @param event - HTML event from search value
   * @return void
   */
  filterScreenCodes(event: any): void {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredScreenCodes = this.allScreenCodes.filter((el) => el.code.includes(searchValue));
    this.cdr.detectChanges();
  }

  /**
   * Selects a screenCode and patches the values to the parameter form
   * @param screenCode:ScreenCode
   * @return void
   */
  selectScreenCode(screenCode: ScreenCode): void {
    this.selectedScreenCode = screenCode;
    this.isUpdateScreenCode = true;
    this.screenForm.patchValue(screenCode);
  }

  /**
   * Toggles between the 'details' and 'schedules' tab
   * @param selected:string - either 'details' or 'schedule'
   * @return void
   */
  toggleDetails(selected: string): void {
    this.isDetailsViewActive = selected === 'details';
  }

  /**
   * Resets form fields of the screenForm
   * @return void
   */
  resetForm(): void {
    this.screenForm.reset()
    this.isUpdateScreenCode = false;
  }

  /**
   * Prepares the screenCode object for saving/updating
   * Checks if the isUpdate has a value or true/false and update/save
   * @return void
   */
  createUpdateScreenCode(): void {
    const formValues = this.screenForm.getRawValue();

    const screenCode: ScreenCode = {
      code: formValues.code,
      coverSummaryName: formValues.cover_summary_name,
      screen_description: formValues.screen_description,
      claimScheduleReport: formValues.claim_schedule_report,
      endorsementSchedule: formValues.endorsement_schedule,
      fleetName: formValues.fleetName,
      helpContent: formValues.help_content,
      level: formValues.level,
      numberOfRisks: formValues.number_of_risks,
      policyDocumentName: formValues.policy_document_name,
      policyDocumentRiskNoteName: null,
      policySchedule: formValues.policySchedule,
      riskReportName: formValues.riskReportName,
      renewalCertificates: formValues.renewalCertificates,
      renewalNotice: formValues.renewalNotice,
      riskNoteName: formValues.riskNoteName,
      xmlNiskNoteName: null, // todo: request backend to correct spelling
      scheduleReportName: formValues.schedule_report_name,
      isScheduleRequired: formValues.is_schedule_required,
      showDefaultRisks: formValues.show_default_risks,
      screenTitle: formValues.screen_title,
      showSumInsured: formValues.show_sum_insured,
      screenId: 2,
      organization_code: 2,
      version: 2,
      screenName: formValues.screen_name,
      screenType: formValues.screenType,
    }

    if (this.isUpdateScreenCode) {
      screenCode.code = this.selectedScreenCode.code;
      this.updateScreenCode(screenCode);
    } else {
      this.createScreenCode(screenCode);
    }
  }

  /**
   * Saves a screenCode to the DB and displays error/success message afterwards
   * @param screenCode:ScreenCode
   * @return void
   */
  createScreenCode(screenCode: ScreenCode): void {
    this.scheduleService.createScreenCode(screenCode)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.messageService.displaySuccessMessage('success', 'Screen code successfully created');
        },
        error: (e) => {
          this.messageService.displayErrorMessage('error', 'Screen code failed to create!');
        }
      });
  }

  /**
   * Updates a specific screenCode to the DB and displays error/success message afterwards
   * @param screenCode:ScreenCode
   * @return void
   */
  updateScreenCode(screenCode: ScreenCode): void {
    this.scheduleService.updateScreenCode(screenCode)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.messageService.displaySuccessMessage('success', 'Screen code successfully updated');
        },
        error: (e) => {
          this.messageService.displayErrorMessage('error', 'Screen code failed to update!');
        }
      })
  }
}
