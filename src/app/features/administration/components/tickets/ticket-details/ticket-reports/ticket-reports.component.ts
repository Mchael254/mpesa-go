import {Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../../shared/services";
import {allTicketModules} from "../../../../data/ticketModule";
import {ActivatedRoute} from "@angular/router";


const log = new Logger('TicketReportsComponent');

@Component({
  selector: 'app-ticket-reports',
  templateUrl: './ticket-reports.component.html',
  styleUrls: ['./ticket-reports.component.css']
})
export class TicketReportsComponent implements OnInit {

  selectedFormat: string = 'HTML';
  reportsWithLinks: any[] = [];
  module: string;

  constructor(
    private route: ActivatedRoute) {

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
        viewReports = this.fetchClaimReports(name);
        break;
      case allTicketModules.quotation:
        viewReports = this.fetchQuotationReports(name);
        break;
      default:
        viewReports = this.fetchPolicyReports(name);
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

  private fetchPolicyReports(name: string): string[] {
    return ["Premium Working Report", "Debit/Credit Note", "Endorsement Report"];
  }

  private fetchQuotationReports(name: string): string[] {
    return ["Quotation Report", "Quotation Premium Report"];
  }

  private fetchClaimReports(name: string): string[] {
    return ["Claim Voucher Report"];
  }
}
