import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
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
import {LocalStorageService} from "../../../../../../shared/services/local-storage/local-storage.service";
import {DmsService} from "../../../../../../shared/services/dms/dms.service";


const log = new Logger('TicketReportsComponent');

@Component({
  selector: 'app-ticket-reports',
  templateUrl: './ticket-reports.component.html',
  styleUrls: ['./ticket-reports.component.css']
})
export class TicketReportsComponent implements OnInit {
  policyDetails:any;
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
  documentsToDispatchData: any[];
  isLoading: boolean = false;
  reportsDispatchedData: any[];
  selectedOptions: any[];

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;

  reportList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportsService,
    private messageService: GlobalMessagingService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private policiesService: PoliciesService,
    private authService: AuthService,
    private globalMessagingService: GlobalMessagingService,
    private localStorageService: LocalStorageService,
    private dmsService: DmsService,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      log.info(`query Params >>>`, params);
      this.module = params['module'];
      this.fetchReports(params['module'], '');
    })
    this.policyDetails = this.localStorageService.getItem('ticketDetails');
    log.info('policy report sess', this.policyDetails);
    this.createDocDispatchForm();
    this.getDispatchReasons();
    this.getReportsToPrepare();
    this.getReportsDispatched();

    /*this.documentsToDispatchData = [
      { rpt_name: 'Premium Listing', dd_code: '1' },
      { rpt_name: 'Debit/credit note', dd_code: '2' },
      { rpt_name: 'Renewal notice', dd_code: '3' },
      { rpt_name: 'Policy draft', dd_code: '4' },
      { rpt_name: 'Policy document', dd_code: '5' },
      { rpt_name: 'Premium calculation', dd_code: '6' }
    ];*/
  }

  /**
   * The function creates a form group for document dispatch with fields for dispatch documents, rejection description, and
   * document dispatched.
   */
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
    return [
      {
        name: 'Claim Payment Voucher',
        rpt_code: 294
      },
      {
        name: 'Facultative debit/ credit',
        rpt_code: 424
      },
      {
        name: 'Cheque forwarding Letter',
        rpt_code: 3958
      },
      {
        name: 'Coinsurance Debit/credit',
        rpt_code: 989
      },
      {
        name: 'Related Claims XOL Report',
        rpt_code: 0
      },
      {
        name: 'Cash call document',
        rpt_code: 0
      },
    ];
  }

  onLabelClick() {
    this.reportsWithLinks.forEach(doc => {
      this.fetchReport(doc)
    })
  }

  /**
   * The fetchReport function fetches a report in either PDF or HTML format, displays it in a modal, and handles error
   * messages.
   * @param {any} report - The `fetchReport` function takes a `report` parameter, which is expected to be an object
   * containing information about the report to be fetched. The function then sets the `isLoadingReport` flag to true,
   * determines the format of the report (PDF or HTML) based on the `selectedFormat`,
   */
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
          const filePath  = window.URL.createObjectURL(blob);

          this.reportList.push({
            fileName: report?.name?.name,
            srcUrl: filePath
          })
          log.info('report list', this.reportList)
          this.isLoadingReport = false;
        },
        err=>{
          this.filePath= null;
          this.messageService.displayErrorMessage('Error', err.statusText);
          this.isLoadingReport = false;
        })
  }

  /**
   * The function `openReportsModal` displays a modal with a backdrop if it exists.
   */
  openReportsModal() {
    const modal = document.getElementById('reportsModalToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      this.onLabelClick();
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

  /**
   * The function `closeReportsModal` hides the reports modal and its backdrop if they are currently displayed.
   */
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

  /**
   * The function `openDocDispatchModal` displays a modal with a backdrop.
   */
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

  /**
   * The function `closeDocDispatchModal` hides a modal with the ID 'docDispatchToggle' and its backdrop.
   */
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

  /**
   * The function `getDispatchReasons` retrieves dispatch rejection reasons for a specific policy type and logs the data.
   */
  getDispatchReasons() {
    // this.spinner.show();
    this.policiesService.getDispatchRejectionReasons('EDD')
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.dispatchReasonsData = data?._embedded[0];
          // this.spinner.hide();
          log.info('dispatch reasons>>', this.dispatchReasonsData);
        }
      )
  }

  /**
   * The `saveDispatchRejection` function saves a dispatch rejection reason with relevant details and displays success or
   * error messages accordingly.
   */
  saveDispatchRejection() {
    // log.info('>>>>', event.value)
    const scheduleFormValues = this.docDispatchForm.getRawValue();
    const assignee = this.authService.getCurrentUserName();
    if (scheduleFormValues) {
      const payload: any = {
        code: 0,
        dispatchApply: "N",
        exemptReason: scheduleFormValues.rejectionDescription,
        policyBatchNo: this.policyDetails?.ticket?.policyCode,
        preparedBy: assignee,
        preparedDate: this.dateToday

      }
      log.info('save payload>>', payload)
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

  /**
   * The function `getReportsToPrepare` fetches dispatch reports using policy details and stores the data in
   * `documentsToDispatchData`.
   */
  getReportsToPrepare() {
    this.policiesService.fetchDispatchReports(this.policyDetails?.ticket?.policyCode, this.policyDetails?.ticket?.endorsment)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.documentsToDispatchData = data;
          // this.spinner.hide();
          log.info('reports>>', this.documentsToDispatchData);
        }
      )
  }

  /**
   * The function `getReportsDispatched` fetches and logs document dispatch codes from a service and stores the data in a
   * component property.
   */
  getReportsDispatched() {
    this.policiesService.fetchReportsDispatched(this.policyDetails?.ticket?.policyCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          const codes = data?._embedded.map(transaction => transaction?.documentDispatchCode);
          log.info('Codes:', codes);

          // this.selectedOptions = codes;
          this.reportsDispatchedData = data;

          log.info('reports dispatched>>', this.reportsDispatchedData);
        }
      );
  }

  //add/remove report, also dispatch documents added
  prepareDocuments() {
    const scheduleFormValues = this.docDispatchForm.getRawValue();
    if (scheduleFormValues.documentDispatched.length > 0) {
      const payload: any = {
        dispatchDocumentCode: scheduleFormValues.documentDispatched,
        policyBatchNo: this.policyDetails?.ticket?.policyCode,
        reportStatus: "A"
      }

      log.info('prepare report payload>>', payload, scheduleFormValues)
      this.policiesService.addRemoveReportsToPrepare(payload)
        .subscribe({
          next: (data) => {
            // this.saveAddReportData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully added report(s)');
            setTimeout(() => {
              this.savePreparedDocs();
            },1500);
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Document(s) not prepared, ensure a report is selected.'
      );
    }
  }

  /**
   * The `savePreparedDocs` function prepares documents for a policy and displays success or error messages accordingly.
   */
  savePreparedDocs() {
    this.policiesService.prepareDocuments(this.policyDetails?.ticket?.policyCode)
      .subscribe({
        next: (data) => {
          // this.savePreparedDocumentData = data;
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully prepared documents');
          this.onSave();
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      })
  }

  /**
   * The onSave function checks if a policy code exists, dispatches documents, displays success or error messages, fetches
   * dispatched documents, and closes a modal.
   */
  onSave() {
    if (this.policyDetails?.ticket?.policyCode) {
      const payload: any[] = [
        this.policyDetails?.ticket?.policyCode
      ]
      this.policiesService.dispatchDocuments(payload)
        .subscribe({
          next: (data) => {
            // this.saveDispatchedDocumentData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully dispatched documents');
            this.dmsService.fetchDispatchedDocumentsByBatchNo(this.policyDetails?.ticket?.policyCode);
            this.closeDocDispatchModal();
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        })
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
  }
}
