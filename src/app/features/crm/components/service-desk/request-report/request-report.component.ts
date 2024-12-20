import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ReportFileDTO, ReportFileParams, ServiceDeskReports} from "../../../../../shared/data/common/reports-dto";
import {ReportsService} from "../../../../../shared/services/reports/reports.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {Logger} from "../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";

const log = new Logger("RequestReportComponent");
@Component({
  selector: 'app-request-report',
  templateUrl: './request-report.component.html',
  styleUrls: ['./request-report.component.css']
})
export class RequestReportComponent implements OnInit {
  reportData: ReportFileDTO;
  reportForm: FormGroup;
  fileName: any;
  filePath: any;
  reportsToDisplay = ServiceDeskReports;
  selectedReport: any;
  reportParamData: ReportFileParams;

  constructor(
    private reportService: ReportsService,
    private globalMessagingService: GlobalMessagingService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createReportForm();
    log.info("reports", this.reportsToDisplay);
  }

  /**
   * Handles the report selection change event by fetching the report details
   * and re-creating the report form.
   *
   * @param {any} event - The event fired when the report selection changes.
   */
  createReportForm(){
    this.reportForm = this.fb.group({
      downloadOption: [''],
    });

    if(this.reportData) {
      this.reportData?.params.forEach(param => {
        log.info('PARAMS', param?.name)
        const control = this.fb.control('');
        this.reportForm.addControl(param?.name, control);
      })
    }

    this.cdr.detectChanges();
  }

  /**
   * Fetches the report details based on the provided report code.
   *
   * This function makes a request to the report service to retrieve the details
   * of a report identified by the given code. On successful retrieval, it updates
   * the report data, recreates the report form, and opens the report download modal.
   * If an error occurs, it displays an error message using the global messaging service.
   *
   * @param {number} code - The code representing the report to fetch details for.
   */
  fetchReportDetails(code: number) {
    this.reportService.getReportDetails(code).subscribe({
      next: (data) => {
        this.reportData = data;
        log.info("report details>>", data);

        this.createReportForm();
        log.info("create form called");

        this.reportData.params.forEach(param => {
          if (param?.type === 'LOV' || param?.type === 'PLOV') {
            this.fetchReportParameterDetails(param?.code);
            log.info('type', param.type);
          }
        });

        this.openReportDownloadModal();

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.status);
      }
    });
  }

  /**
   * Opens the report download modal.
   *
   * This function is called when the report form is submitted, and it sets the
   * filePath and fileName properties of the component to be used in the
   * report download modal.
   */
  generateReport(report: any) {
    log.info('rpt>', report);
    const formData = this.reportForm.getRawValue();
    log.info(formData);

    let payload = {
      encode_format: "RAW",
      params: Object.keys(formData).filter(key => key !== 'downloadOption').map(key => {
        const val = formData[key];
        // If the value is a string and matches the ISO date format, convert it
        // to a date object and format it as 'dd-MMM-yyyy'.
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
          const dateParts = val.split('-');
          const date = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
          const datePipe = new DatePipe('en-US');
          return {
            name: key,
            value: datePipe.transform(date, 'dd-MMM-yyyy')
          }
        }
        return {
          name: key,
          value: val
        }
      }),
      /*params: Object.keys(formData).filter(key => key !== 'downloadOption').map(key => {
        return {
          name: key,
          value: formData[key]
        }
      }),*/
      report_format: formData?.downloadOption,
      rpt_code: report?.code,
      system: "CRM"
    }

    log.info('form', payload)

    this.reportService.generateCRMReport(payload)
      .subscribe({
        next: (response) => {
          let blobType;
          switch (formData?.downloadOption) {
            case 'RTF':
              blobType = 'application/rtf';
              break;
            case 'PDF':
              blobType = 'application/pdf';
              break;
            case 'XLS':
              blobType = 'application/vnd.ms-excel';
              break;
            case 'HTML':
            default:
              blobType = 'text/html';
              break;
          }

          const blob = new Blob([response], { type: blobType });
          this.filePath = window.URL.createObjectURL(blob);

          this.fileName = report?.desc;
          this.download(this.filePath, this.fileName);
        },
        error: (err)=> {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
        }
      })
  }

  /**
   * Downloads the report based on the selected report and options.
   */
  onReportSelect(report: any) {
    log.info(report);
    this.selectedReport = report;
    this.fetchReportDetails(report?.code);
  }

  /**
   * Opens the "Report Download" modal by selecting the modal element
   */
  openReportDownloadModal() {
    const modal = document.getElementById('reportDownloadModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the "Report Download" modal.
   */
  closeReportDownloadModal() {
    const modal = document.getElementById('reportDownloadModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
    this.selectedReport = null;
    this.filePath = null;
    this.fileName = null;
    this.reportParamData = null;
  }

  /**
   * Downloads a file using the provided URL and file name.
   *
   * This function creates an anchor element, sets its href attribute to the
   * specified file URL, and triggers a download by programmatically
   * clicking the anchor. The download will be saved with the given file name.
   *
   * @param {string} fileUrl - The URL of the file to download.
   * @param {string} fileName - The name to use for the downloaded file.
   */
  download(fileUrl: string, fileName: string): void {

    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    }
  }

  /**
   * Fetches the report parameter details for the given report code and parameter code.
   * @param {number} paramCode - The parameter code to fetch the details for.
   */
  fetchReportParameterDetails(paramCode: number) {

    this.reportService.getReportParameterDetails(this.selectedReport?.code, paramCode)
      .subscribe({
        next: (data) => {
          this.reportParamData = data;

          log.info("report params>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
        }
      });
  }

}
