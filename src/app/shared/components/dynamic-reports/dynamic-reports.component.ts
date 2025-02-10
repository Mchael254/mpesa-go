import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnInit,
  Output
} from '@angular/core';
import {ReportFileDTO, ReportFileParams} from "../../data/common/reports-dto";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Logger} from "../../services";
import {ReportsService} from "../../services/reports/reports.service";
import {GlobalMessagingService} from "../../services/messaging/global-messaging.service";
import {DatePipe} from "@angular/common";
import {document} from "ngx-bootstrap/utils";

const log = new Logger("DynamicReportsComponent");

/**
 * This component is used to display and download reports
 * It takes in the following inputs:
 * 1. title: The title of the reports to be displayed
 * 2. reportsToDisplay: The reports array to be displayed containing the code and desc
 *
 * It has the following outputs:
 * 1. onClickReport: An event emitter that emits the selected report
 */

@Component({
  selector: 'app-dynamic-reports',
  templateUrl: './dynamic-reports.component.html',
  styleUrls: ['./dynamic-reports.component.css'],
  standalone: false
})
export class DynamicReportsComponent implements OnInit {

  @Input() title: string = 'Reports';
  @Input() reportsToDisplay: any[] = [];
  selectedReport: any;
  @Output() onClickReport = new EventEmitter<any>();
  reportParamData: ReportFileParams;
  reportData: ReportFileDTO;
  public reportForm: FormGroup;
  public fileName: any;
  public filePath: any;
  reportParamCollection: any[] = [];
  displayModal = false;

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
  createReportForm() {
    this.reportForm = this.fb.group({
      downloadOption: [''],
    });

    if (this.reportData) {
      this.reportData?.params.forEach(param => {
        log.info('PARAMS', param?.name)
        const control = this.fb.control('');
        this.reportForm.addControl(param?.name, control);
      })
    }

     setTimeout(() => this.cdr.detectChanges());
  }

  /**
   * Handles the selection of a report. This method updates the selected report,
   * emits the selection event, and fetches the corresponding report details.
   *
   * @param {any} report - The selected report object.
   */
  onReportSelect(report: any) {
    log.info(report);
    this.selectedReport = report;
    this.onClickReport.emit(this.selectedReport);
    this.fetchReportDetails(report?.code);
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
        this.displayModal = true;

        this.reportData.params.forEach(param => {
          if (param?.type === 'LOV' || param?.type === 'PLOV') {
            this.fetchReportParameterDetails(param?.code, param?.name);
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
   * Fetches the report parameter details for the given report code and parameter code.
   * @param {number} paramCode - The parameter code to fetch the details for.
   */
  fetchReportParameterDetails(paramCode: number, paramName: string) {
    this.reportService.getReportParameterDetails(this.selectedReport?.code, paramCode)
      .subscribe({
        next: (data) => {
          this.reportParamData = data;
          console.log("queryDataMap", paramName);

          this.reportParamCollection.push(this.reportParamData);

          log.info("report params>>", data);
          log.info("collection>>", this.reportParamCollection);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
        }
      });
    this.cdr.detectChanges();
  }

  /**
   * Fetches the report parameter details for the given report code and parameter code.
   *
   * @param {number} paramCode - The parameter code to fetch the details for.
   * @param {string} paramName - The parameter name to fetch the details for.
   * @returns {Observable<ReportFileParams>}
   */
  filterParameters(name: string, reportFileParams: ReportFileParams[]) {
    return reportFileParams
      .filter(param => param?.name === name)
      .map(value => value.queryData)
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

    this.reportService.generateReport(payload)
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

          const blob = new Blob([response], {type: blobType});
          this.filePath = window.URL.createObjectURL(blob);

          this.fileName = report?.description;
          this.download(this.filePath, this.fileName);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
        }
      })
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
   * Opens the "Report Download" modal by selecting the modal element
   */
  openReportDownloadModal() {
    this.displayModal = true;
    this.cdr.detectChanges();
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
    this.reportData = null;
    this.displayModal = false;
  }

}
