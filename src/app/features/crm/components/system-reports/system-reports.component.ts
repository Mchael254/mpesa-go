import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SystemReportDto} from "../../../../shared/data/common/reports-dto";
import {Logger} from "../../../../shared/services";
import {ReportsService} from "../../../../shared/services/reports/reports.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {SetupsParametersService} from "../../../../shared/services/setups-parameters.service";
import {SetupsParametersDTO} from "../../../../shared/data/common/setups-parametersDTO";

const log = new Logger(`SystemReportsComponent`);
@Component({
  selector: 'app-system-reports',
  templateUrl: './system-reports.component.html',
  styleUrls: ['./system-reports.component.css']
})

export class SystemReportsComponent implements OnInit {
  selectedReport: any;
  systemReportsData: SystemReportDto[];
  directDebitReportsData: SystemReportDto[];
  directDebitReportsVisibility: SetupsParametersDTO[] = [];

  constructor(
    private reportService: ReportsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private setupsParameterService: SetupsParametersService
  ) {}

  ngOnInit(): void {
    this.fetchReports(0, "SYSR");
    this.defineDebitReportsVisibility();
  }

  onReportSelect($event: any) {
    this.selectedReport = $event;
    log.info('selected', this.selectedReport);
  }

  fetchReports(system: number, applicationLevel: string) {
    this.reportService.getReportsBySystem(system, applicationLevel)
      .subscribe({
        next: (data) => {
          this.systemReportsData = data;
          log.info("reportsBySystem", data);

        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
        }
      });
    this.cdr.detectChanges();
  }

  fetchDirectDebitReports(system: number, applicationLevel: string) {
    this.reportService.getReportsBySystem(system, applicationLevel)
      .subscribe({
        next: (data) => {
          this.directDebitReportsData = data;
          log.info("direct debit reports", data);

        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
        }
      });
    this.cdr.detectChanges();
  }

  defineDebitReportsVisibility(): void {
    this.setupsParameterService.getParameters('DIRECT_DEBIT_RPTS')
      .subscribe({
        next: (param) => {
          this.directDebitReportsVisibility = param
          log.info(`direct debit setup >>>`, param);

          if (param[0]?.value === 'Y') {
            this.fetchDirectDebitReports(0, "DIDR");
          }
        },
        error: (err) => {
          log.error('Error', err.error.status);
        }
      });
  }
}
