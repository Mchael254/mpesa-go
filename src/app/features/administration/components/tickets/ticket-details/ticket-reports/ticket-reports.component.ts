import {Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../../shared/services";
import {allTicketModules} from "../../../../data/ticketModule";
import {ActivatedRoute} from "@angular/router";
import {ReportsService} from "../../../../../../shared/services/reports/reports.service";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {NotificationService} from "../../../../../lms/service/notification/notification.service";
import {HttpErrorResponse} from "@angular/common/http";


const log = new Logger('TicketReportsComponent');

@Component({
  selector: 'app-ticket-reports',
  templateUrl: './ticket-reports.component.html',
  styleUrls: ['./ticket-reports.component.css']
})
export class TicketReportsComponent implements OnInit {

  selectedFormat: string = 'PDF';
  reportsWithLinks: any[] = [];
  module: string;

  filePath: any;
  fileName: any;
  selectedReportName: string;
  isLoadingReport: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportsService,
    private messageService: GlobalMessagingService,
    private notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      log.info(`query Params >>>`, params);
      this.module = params['module'];
      this.fetchReports(params['module'], '');
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

  sendNotification() {

    const payload = {
      address: ['john.gachoki@turnkeyafrica.com', 'example2@gmail.com'].filter(email => email), // Filter out any empty values
      agentCode: 0,
      attachments: [
        {
          content: 'string',
          contentId: 'string',
          disposition: 'string',
          name: 'string',
          type: 'string',
        },
      ],
      clientCode: 0,
      code: '524L',
      emailAggregator: 'N',
      from: 'string',
      fromName: 'string',
      message: 'Happy Birthday',
      response: '524L',
      sendOn: '2024-02-08T11:32:40.261Z',
      status: 'D',
      subject: 'Birthday Wishes',
      systemCode: '0 for CRM, 1 for FMS',
      systemModule: 'NB for New Business',

    };
    this.notificationService.sendEmail(payload).subscribe(
      {
        next:(res)=>{
          const response = res
          this.messageService.displaySuccessMessage('Success', 'Email sent successfully' );
          console.log(res)
        },
        error : (error: HttpErrorResponse) => {
          log.info(error);
          this.messageService.displayErrorMessage('Error', 'Error, try again later' );
        }
      });
  }
}
