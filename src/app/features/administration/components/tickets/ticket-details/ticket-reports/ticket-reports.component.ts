import {Component, Input, OnInit} from '@angular/core';
import {Logger} from "../../../../../../shared/services";
import {allTicketModules} from "../../../../data/ticketModule";
import {ActivatedRoute} from "@angular/router";
import {ReportsService} from "../../../../../../shared/services/reports/reports.service";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {NotificationService} from "../../../../../lms/service/notification/notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {untilDestroyed} from "../../../../../../shared/services/until-destroyed";
import {PoliciesService} from "../../../../../gis/services/policies/policies.service";
import {AuthService} from "../../../../../../shared/services/auth.service";


const log = new Logger('TicketReportsComponent');

@Component({
  selector: 'app-ticket-reports',
  templateUrl: './ticket-reports.component.html',
  styleUrls: ['./ticket-reports.component.css']
})
export class TicketReportsComponent implements OnInit {
  @Input() policyDetails:any;
  selectedFormat: string = 'PDF';
  reportsWithLinks: any[] = [];
  module: string;

  filePath: any;
  fileName: any;
  selectedReportName: string;
  isLoadingReport: boolean = false;

  docDispatchForm: FormGroup;
  dispatchReasonsData: any[];
  saveDocumentRejectionData: any;
  isLoading: boolean = false;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportsService,
    private messageService: GlobalMessagingService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private policiesService: PoliciesService,
    private authService: AuthService,
    private globalMessagingService: GlobalMessagingService,) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      log.info(`query Params >>>`, params);
      this.module = params['module'];
      this.fetchReports(params['module'], '');
    })
    this.createDocDispatchForm();
    this.getDispatchReasons();
  }

  createDocDispatchForm() {
    this.docDispatchForm = this.fb.group({
      dispatchDocuments: [''],
      rejectionDescription: [''],
      documentDispatched: ['']
    })
  }

  /***
   * Fetch reports depending on the module
   * @param module
   * @param name
   */
  fetchReports(module: string, name: string) {
    log.info('Fetching documents for module ', module);
    let viewReports = []; // Array to store the reports

    switch (module) {
      case allTicketModules.claims:
        viewReports = this.fetchClaimReports();
        break;
      case allTicketModules.quotation:
        viewReports = this.fetchQuotationReports();
        break;
      default:
        viewReports = this.fetchPolicyReports();
        break;
    }

    this.reportsWithLinks = viewReports.map((report) => {
      return {
        name: report,
        link: this.generateReportLink(report) // Use the generateReportLink function
      };
    });

    log.info(this.reportsWithLinks);
  }

  /**
   * The function `getReportLink` takes a report object and returns a URL link based on the report's name and selected
   * format.
   * @param {any} report - The `report` parameter is of type `any`, which means it can be any type of object. It is used to
   * determine which report link to generate based on the `name` property of the report object.
   * @returns A string representing the URL of the report.
   */
  getReportLink(report: any): string {
    const baseURL = 'http://10.176.18.211:9991/reports/';
    const format = this.selectedFormat === 'PDF' ? 'PDF' : 'HTML';

    switch (report.name) {
      case 'Premium Working Report':
        return baseURL + 'premium_working_report?output=' + format;
      case 'Debit/Credit Note':
        return baseURL + 'debit_credit_note?output=' + format;
      case 'Endorsement Report':
        return baseURL + 'endorsement_report?output=' + format;
      case 'Quotation Report':
        return baseURL + 'quotation_report?output=' + format;
      case 'Quotation Premium Report':
        return baseURL + 'quotation_premium_report?output=' + format;
      case 'Claim Voucher Report':
        return baseURL + 'claim_voucher_report?output=' + format;
      default:
        return ''; // Handle unknown reports
    }
  }

  /**
   * The function generates a report link based on the given report name.
   * @param {string} report - The `report` parameter is a string that represents the type of report. It can have the
   * following values:
   * @returns The function `generateReportLink` returns a string that represents the URL for a specific report. The URL is
   * generated based on the input `report` parameter. If the `report` matches one of the cases in the switch statement, the
   * corresponding URL is returned. If the `report` does not match any of the cases, an empty string is returned.
   */
  private generateReportLink(report: string): string {
    const baseURL = "http://10.176.18.211:9991/reports/";

    switch (report) {
      case "Premium Working Report":
        return baseURL + "premium_working_report?output=HTML";
      case "Debit/Credit Note":
        return baseURL + "debit_credit_note?output=HTML";
      case "Endorsement Report":
        return baseURL + "endorsement_report?output=HTML";
      case "Quotation Report":
        return baseURL + "quotation_report?output=HTML";
      case "Quotation Premium Report":
        return baseURL + "quotation_premium_report?output=HTML";
      case "Claim Voucher Report":
        return baseURL + "claim_voucher_report?output=HTML";
      default:
        return ""; // Handle unknown reports
    }
  }

  /**
   * The function fetchPolicyReports returns an array of strings representing different policy reports.
   * @param {string} name - The name parameter is a string that represents the name of the policy for which you want to
   * fetch the policy reports.
   * @returns An array of strings containing the names of policy reports.
   */
  private fetchPolicyReports(): any[] {
    return [{
      name: 'Premium Working Report',
      rpt_code: 22
    }, {
      name: 'Debit/Credit Note',
      rpt_code: 12
    }, {
      name: 'Endorsement Report',
      rpt_code: 18
    }]
  }

  /**
   * The function fetchQuotationReports returns an array of quotation reports based on the given name.
   * @param {string} name - The name parameter is a string that represents the name of the person for whom the quotation
   * reports are being fetched.
   * @returns An array of strings containing the names of the quotation reports.
   */
  private fetchQuotationReports(): any[] {
    return [
      {
        name: 'Quotation Report',
        rpt_code: 4
      },
      {
        name: 'Quotation Premium Report',
        rpt_code: 3
      }
    ];
  }

  /**
   * The function fetchClaimReports returns an array of claim voucher reports.
   * @param {string} name - The name parameter is a string that represents the name of the claim for which you want to
   * fetch the claim reports.
   * @returns An array of strings containing the claim voucher report.
   */
  private fetchClaimReports(): any[] {
    return [{
      name: 'Claim Voucher Report',
      rpt_code: 294
    }];
  }

  fetchReport(report:any) {
    this.isLoadingReport = true;
    const format = this.selectedFormat === 'PDF' ? 'PDF' : 'HTML';
    const selectedRptCode = report?.name?.rpt_code;
    this.selectedReportName = report?.name?.name;
    console.log('rpt>', selectedRptCode);
    this.reportService.fetchReport(selectedRptCode)
      .subscribe(
        (response) => {
          // this.apiService.DOWNLOADFROMBYTES(response, 'fname.pdf', 'application/pdf')
          const blob = new Blob([response], { type: 'application/pdf' });
          this.filePath  = window.URL.createObjectURL(blob);

          this.openReportsModal();
          this.isLoadingReport = false;
        },
        err=>{
          this.filePath= null;
          this.messageService.displayErrorMessage('Error', err.statusText);
          this.isLoadingReport = false;
        })
  }

  openReportsModal() {
    const modal = document.getElementById('reportsModalToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

  closeReportsModal() {
    const modal = document.getElementById('reportsModalToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  openDocDispatchModal() {
    const modal = document.getElementById('docDispatchToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }
  closeDocDispatchModal() {
    const modal = document.getElementById('docDispatchToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  getDispatchReasons() {
    // this.spinner.show();
    this.policiesService.getDispatchRejectionReasons('EDD')
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.dispatchReasonsData = data.embedded[0];
          // this.spinner.hide();
          log.info('dispatch reasons>>', this.dispatchReasonsData);
        }
      )
  }

  saveDispatchRejection() {
    // log.info('>>>>', event.value)
    const scheduleFormValues = this.docDispatchForm.getRawValue();
    const assignee = this.authService.getCurrentUserName();
    if (scheduleFormValues) {
      const payload: any = {
        code: 0,
        dispatchApply: "N",
        exemptReason: scheduleFormValues.rejectionDescription,
        policyBatchNo: this.policyDetails?.batch_no,
        preparedBy: assignee,
        preparedDate: this.dateToday

      }
      this.policiesService.saveDispatchRejectReason(payload)
        .subscribe({
          next: (data) => {
            this.saveDocumentRejectionData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully saved reason for dispatch rejection');
            // this.cdr.detectChanges();
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Rejection reason not saved.'
      );
    }
  }
  onSave() {
    this.globalMessagingService.displaySuccessMessage('Success', 'Saved');
  }

  ngOnDestroy(): void {
  }
}
