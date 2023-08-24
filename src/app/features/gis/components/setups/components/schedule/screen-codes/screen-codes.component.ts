import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ScheduleService} from "../../../services/schedule/schedule.service";
import {take} from "rxjs/operators";
import {ScreenCode} from "../../../data/gisDTO";
import {Logger} from "../../../../../../../shared/services";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import { NgxSpinnerService } from 'ngx-spinner';
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";


const log = new Logger('ScreenCodesComponent');

@Component({
  selector: 'app-screen-codes',
  templateUrl: './screen-codes.component.html',
  styleUrls: ['./screen-codes.component.css']
})
export class ScreenCodesComponent implements OnInit{
  private allScreenCodes: ScreenCode[];
  public filteredScreenCodes: ScreenCode[];
  public isDetailsViewActive: boolean = true;
  public screenForm: FormGroup;
  isUpdate: boolean = true;

  constructor(
    private scheduleService: ScheduleService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,
  ) {
  }

  ngOnInit(): void {
    this.loadAllScreenCodes();
    this.createScreenForm();
    this.spinner.show();
  }

   loadAllScreenCodes(): void {
    this.scheduleService.getAllScreenCodes()
      .pipe(take(1))
      .subscribe((screenCodes) => {
        this.allScreenCodes = screenCodes._embedded.screen_dto_list;
        this.filteredScreenCodes = screenCodes._embedded.screen_dto_list;
        log.info(`allScreenCodes >>>`, screenCodes?._embedded.screen_dto_list);
        this.spinner.hide();
      });
  }

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

  filterScreenCodes(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredScreenCodes = this.allScreenCodes.filter((el) => el.code.includes(searchValue));
    this.cdr.detectChanges();
  }

  selectScreenCode(screenCode: ScreenCode) {
    log.info(`selected Screen code >>>`, screenCode)
    this.screenForm.patchValue(screenCode);
  }

  toggleDetails(selected: string): void {
    this.isDetailsViewActive = selected === 'details';
  }

  resetForm() {
    this.screenForm.reset()
    this.isUpdate = false;
  }

  createUpdateScreenCode() {
    const formValues = this.screenForm.getRawValue();
    const screenCode: ScreenCode = {
      claimScheduleReport: formValues.claim_schedule_report,
      code: "", // todo: fix this
      coverSummaryName: formValues.cover_summary_name,
      endorsementSchedule: formValues.endorsement_schedule,
      fleetName: formValues.fleetName,
      helpContent: formValues.help_content,
      isScheduleRequired: formValues.is_schedule_required,
      level: formValues.level,
      numberOfRisks: formValues.number_of_risks,
      organizationCode: formValues.organizationCode,
      policyDocumentName: formValues.policy_document_name,
      policyDocumentRiskNoteName: null, // todo: confirm
      policySchedule: formValues.policySchedule,
      renewalCertificates: formValues.renewalCertificates,
      renewalNotice: formValues.renewalNotice,
      riskNoteName: formValues.riskNoteName,
      riskReportName: formValues.riskReportName,
      scheduleReportName: formValues.schedule_report_name,
      screenDescription: formValues.screen_description,
      screenId: 2,
      screenName: formValues.screen_name,
      screenTitle: formValues.screen_title,
      screenType: formValues.screenType,
      showDefaultRisks: formValues.show_default_risks,
      showSumInsured: formValues.show_sum_insured,
      version: 2,
      xmlRiskNoteName: null // todo: confirm
    }

    if (this.isUpdate) {
      this.updateScreenCode(screenCode);
    } else {
      this.createScreenCode(screenCode);
    }
  }

  createScreenCode(screenCode: ScreenCode) {
    const screenCodeToSave =  screenCode;
    this.scheduleService.createScreenCode(screenCodeToSave)
      .pipe(take(1))
      .subscribe((res) => {
        this.globalMessagingService.displaySuccessMessage('success', 'Screen code successfully created');
      }, err => {
        this.globalMessagingService.displayErrorMessage('error', 'Screen code failed to create!');
      });
  }

  updateScreenCode(screenCode: ScreenCode) {
    const screenCodeToUpdate = screenCode;
    // screenCodeToUpdate.code = 0
    this.scheduleService.updateScreenCode(screenCodeToUpdate, 0)
      .pipe(take(1))
      .subscribe((res) => {
        this.globalMessagingService.displaySuccessMessage('success', 'Screen code successfully updated');
      }, err => {
        this.globalMessagingService.displayErrorMessage('error', 'Screen code failed to update!');
      });
  }
}
