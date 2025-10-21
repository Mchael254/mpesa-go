import { Component } from '@angular/core';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { ReportParams, ReportResponse } from '../../data/quotationsDTO';
import { NgxSpinnerService } from 'ngx-spinner';
import { Logger, UtilService } from "../../../../../../shared/services";
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';

const log = new Logger('QuotationReportComponent');


@Component({
  selector: 'app-quotation-report',
  templateUrl: './quotation-report.component.html',
  styleUrls: ['./quotation-report.component.css']
})
export class QuotationReportComponent {
  reports: any[] = [];
  selectedReports: ReportResponse[] = [];
  fetchedReports: ReportResponse[] = [];
  currentIndex: number = 0;
  currentReport!: ReportResponse;
  activeIndex: number = 1;
  reportBlobs: { [code: string]: Blob } = {};
  quotationCodeString: string;
  quotationCode: number
  filePath: string = '';
  zoomLevel = 1;
  public isClientCardDetailsOpen = false;

  constructor(
    public quotationService: QuotationsService,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,


  ) { }
  ngOnInit(): void {

    this.quotationCodeString = sessionStorage.getItem('quotationCode');
    this.quotationCode = Number(sessionStorage.getItem('quotationCode'));
    log.debug("two codes", this.quotationCode, this.quotationCodeString)
    log.debug('quotationCode', this.quotationCodeString)
    this.fetchReports()
  }

  fetchReports() {
    const system = 37;
    const applicationLevel = "QUOTE"
    this.quotationService.fetchReports(system, applicationLevel)
      .subscribe({
        next: (res: any[]) => {
          this.fetchedReports = res
          if (res) {

            if (this.fetchedReports?.length) {
              this.currentIndex = 0;
              this.currentReport = this.fetchedReports[0];
              this.selectedReports = [this.currentReport]; // show first as checked
              this.loadAndShowReport(this.currentReport);
            }

          }
        },
        error: (err: any) => {
          const backendMsg = err.error?.message || err.message || 'An unexpected error occurred'; console.error("OTP Verification Error:", backendMsg);
          this.globalMessagingService.displayErrorMessage("Error", backendMsg);
        }
      });
  }
  onReportClick(report: ReportResponse) {
    const isSelected = this.selectedReports?.some(r => r.code === report.code);

    // Simulate checkbox toggle behavior
    const event = { checked: !isSelected };

    if (!isSelected) {
      // Add to selected reports
      this.selectedReports = [...(this.selectedReports || []), report];
    } else {
      // Remove from selected reports
      this.selectedReports = this.selectedReports.filter(r => r.code !== report.code);
    }

    // Call your existing toggle logic
    this.onReportToggle(event, report);
  }

  onReportToggle(event: any, report: ReportResponse) {

    if (event.checked) {
      this.currentIndex = this.fetchedReports.findIndex(r => r.code === report.code);
      this.currentReport = report;
      this.loadAndShowReport(report);
    } else {

      if (this.currentReport && this.currentReport.code === report.code) {
        if (this.selectedReports && this.selectedReports.length) {
          this.currentReport = this.selectedReports[0];
          this.currentIndex = this.fetchedReports.findIndex(r => r.code === this.currentReport.code);
          this.loadAndShowReport(this.currentReport);
        } else {
          this.currentReport = null;
          this.filePath = null;
        }
      }
    }
  }


  toggleReport(direction: 'prev' | 'next') {
    if (!this.fetchedReports || this.fetchedReports.length === 0) return;

    if (direction === 'prev' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'next' && this.currentIndex < this.fetchedReports.length - 1) {
      this.currentIndex++;
    } else {
      return;
    }

    this.currentReport = this.fetchedReports[this.currentIndex];

    // visually select only the active report (this will uncheck others)
    this.selectedReports = [this.currentReport];

    // generate and preview
    this.loadAndShowReport(this.currentReport);
  }


  private loadAndShowReport(report: ReportResponse) {
    this.quotationService.fetchReportParams(report.code).subscribe({
      next: (res: ReportParams) => this.generateReport(res),
      error: (err: any) => {
        const backendMsg = err.error?.message || err.message || 'An unexpected error occurred';
        this.globalMessagingService.displayErrorMessage("Error", backendMsg);
      }
    });
  }
  generateReport(selectedReportDetails: ReportParams) {
    const reportCode = selectedReportDetails.rptCode;

    // Check if report is already generated and cached
    if (this.reportBlobs[reportCode]) {
      console.log("Report already generated, downloading from cache...");
      this.filePath = URL.createObjectURL(this.reportBlobs[reportCode]);
      // this.downloadReportByCode(reportCode, selectedReportDetails.reportName);
      return;
    }

    // Build payload for backend
    const value = this.quotationCode;
    const reportPayload = {
      params: selectedReportDetails.params.map(param => ({
        name: param.name,   // transform if needed
        value: value
      })),
      rptCode: reportCode,
      system: "GIS",
      reportFormat: "PDF",
      encodeFormat: "RAW"
    };

    console.log("Generating report payload:", reportPayload);

    // Call backend
    this.quotationService.generateReports(reportPayload).subscribe({
      next: (res: Blob) => {
        // Create PDF blob
        const blob = new Blob([res], { type: 'application/pdf' });
        this.filePath = URL.createObjectURL(blob);
        log.debug("Blob URL:", this.filePath);
        // Cache the blob
        this.reportBlobs[reportCode] = blob;

        console.log("Report generated and cached:", reportCode);

        // this.downloadReportByCode(reportCode, selectedReportDetails.reportName);
      },
      error: (err: any) => {
        const backendMsg = err.error?.message || err.message || 'An unexpected error occurred';
        console.error("Error generating report:", backendMsg);
        this.globalMessagingService.displayErrorMessage("Error", backendMsg);
      }
    });
  }

  downloadReports(reports: any[]) {
    if (!reports || reports.length === 0) return;

    reports.forEach(report => {
      const reportCode = report.rptCode || report.code;
      this.downloadReportByCode(reportCode, report.description);
    });
  }

  downloadReportByCode(reportCode: number, fileName?: string) {
    const blob = this.reportBlobs[reportCode];
    if (!blob) {
      console.warn("No cached blob found for report:", reportCode);
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'report'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Report downloaded:", reportCode);
  }


  printReport(report: any) {
    const reportCode = report.rptCode || report.code;
    const blob = this.reportBlobs[reportCode];

    if (!blob) {
      console.warn("No cached blob found for report:", reportCode);
      this.globalMessagingService.displayInfoMessage('Info', 'Select a report to continue');
      return;
    }

    this.spinner.show();

    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        this.spinner.hide();
      }

      iframe.contentWindow?.addEventListener("afterprint", () => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      });
    };

    document.body.appendChild(iframe);
  }
  toggleClientCardDetails() {
    this.isClientCardDetailsOpen = !this.isClientCardDetailsOpen;
  }
}
