import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  SystemReportDto
} from "../../../../../shared/data/common/reports-dto";
import {ReportsService} from "../../../../../shared/services/reports/reports.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {Logger} from "../../../../../shared/services";

const log = new Logger("RequestReportComponent");
@Component({
  selector: 'app-request-report',
  templateUrl: './request-report.component.html',
  styleUrls: ['./request-report.component.css']
})
export class RequestReportComponent implements OnInit {
  selectedReport: any;
  serviceRequestReportsData: SystemReportDto[];

  constructor(
    private reportService: ReportsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchReports(0, "SRQ");
  }

  onReportSelect($event: any) {
    this.selectedReport = $event;
    log.info('selected', this.selectedReport);
  }

  fetchReports(system: number, applicationLevel: string) {
    this.reportService.getReportsBySystem(system, applicationLevel)
      .subscribe({
        next: (data) => {
          this.serviceRequestReportsData = data;
          log.info("reportsBySystem", data);

        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
        }
      });
    this.cdr.detectChanges();
  }

}
