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
  private fetchPolicyReports(name: string): string[] {
    return ["Premium Working Report", "Debit/Credit Note", "Endorsement Report"];
  }

  /**
   * The function fetchQuotationReports returns an array of quotation reports based on the given name.
   * @param {string} name - The name parameter is a string that represents the name of the person for whom the quotation
   * reports are being fetched.
   * @returns An array of strings containing the names of the quotation reports.
   */
  private fetchQuotationReports(name: string): string[] {
    return ["Quotation Report", "Quotation Premium Report"];
  }

  /**
   * The function fetchClaimReports returns an array of claim voucher reports.
   * @param {string} name - The name parameter is a string that represents the name of the claim for which you want to
   * fetch the claim reports.
   * @returns An array of strings containing the claim voucher report.
   */
  private fetchClaimReports(name: string): string[] {
    return ["Claim Voucher Report"];
  }
}
