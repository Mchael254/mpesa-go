import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ReportService} from "../../reports/services/report.service";
import {Logger} from "../../../shared/services";
import {ActivatedRoute} from "@angular/router";
import {ChartReport, DashboardReport, DashboardReports} from "../../../shared/data/reports/dashboard";
import cubejs, {Query} from "@cubejs-client/core";
import {AppConfigService} from "../../../core/config/app-config-service";
import {ChartConfiguration} from "chart.js";
import {TableDetail} from "../../../shared/data/table-detail";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";

const log = new Logger('ListReportComponent');
@Component({
  selector: 'app-list-report',
  templateUrl: './list-report.component.html',
  styleUrls: ['./list-report.component.css']
})
export class ListReportComponent implements OnInit {

  items: MenuItem[] = [];
  basicData: any;
  public dashboardId: number;
  public report: ChartReport[] = [];

  public chartLabels: string[];
  public chartData: ChartConfiguration<'bar'|'line'|'scatter'|'bubble'|'pie'|'doughnut'|'polarArea'|'radar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public tableDetails: TableDetail = {};
  public chartDataArr = [];

  private cubejsApi = cubejs({
    apiUrl: this.appConfig.config.cubejsDefaultUrl
  });
  selectedDashboard:any = null;
  selectedReport:any = null;
  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {

    this.spinner.show();
    this.items = [
      {
        items: [
          {
            label: 'Share',
            command: () => {
              this.shareReport();
            }
          },
          {
            label: 'Download',
            command: () => {
              this.downloadReport();
            }
          },
          {
            label: 'Rename',
            command: () => {
              this.renameReport();
            }
          },
          {
            label: 'Remove from dashboard',
            command: () => {
              this.removeFromDashboard();
            }
          },
        ]
      },
    ];

    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.route.queryParams.subscribe(params => {
      log.info(`query Params >>>`, params);
      this.dashboardId = params['dashboardId'];
      this.getDashboardById(params['dashboardId']);
    });
  }

  /**
   * The function "shareReport" is used to share a report.
   */
  shareReport() {

  }

  /**
   * The function "downloadReport" is used to download a report.
   */
  downloadReport() {

  }

  /**
   * The function renameReport() is used to rename a report.
   */
  renameReport() {

  }

  /**
   * The function removeFromDashboard() is used to remove a report from a dashboard.
   */
  removeFromDashboard() {
   /* log.info('dashboard id>', this.selectedDashboard);
    log.info('report id>', this.selectedReport);*/

    const report: DashboardReports[] = [{
      length: 0,
      order: 0,
      reportId: this.selectedReport,
      width: 0
    }];

    const deleteDashboard: DashboardReport = {
      dashboardId: this.selectedDashboard,
      dashboardReports: report
    }

    this.reportService.deleteReportFromDashboard(this.selectedDashboard, deleteDashboard)
      .subscribe(res => {
        log.info('on delete report', res);

        this.globalMessagingService.displaySuccessMessage('Success', 'Report successfully removed from dashboard' );
      });
    this.getDashboardById(this.selectedDashboard);
    this.cdr.detectChanges;
  }

  /**
   * The function "getDashboardById" retrieves a dashboard report by its ID and logs the report data.
   * @param {number} id - The parameter "id" is of type number and represents the identifier of the dashboard that we want
   * to retrieve.
   */
  getDashboardById(id:number) {
    this.reportService.getDashboardsById(id)
      .subscribe(reportData => {

        let reportArr = [];
        reportArr.push(reportData);
        this.report = reportArr;
        // this.reportName = this.report.name
        log.info('report data', this.report);

        for (const dashboard of reportArr) {

          if (dashboard.reports.length > 0) {
            const report = dashboard.reports[0];
            const measures = JSON.parse(report?.measures);
            const dimensions = JSON.parse(report?.dimensions);
            const filters = JSON.parse(report?.filter);

            log.info(`measures >>>`, measures);
            log.info(`dimensions >>>`, dimensions);
            log.info(`filters >>>`, filters);
            log.info('---------------')

            // this.getReportFromCubeJS(measures, dimensions, filters);
            const chartData = this.getReportFromCubeJS(measures, dimensions, filters);
            dashboard.chartData = chartData;
          }
        }
        this.spinner.hide();
      })
  }

  /**
   * The function `getReportFromCubeJS` retrieves data from a CubeJS API based on the provided measures, dimensions, and
   * filters, and returns a promise that resolves to the chart data.
   * @param measures - An array of measures to include in the report. Each measure should have a "transaction" and "query"
   * property.
   * @param dimensions - An array of dimensions to include in the report. Each dimension should have a "transaction" and
   * "query" property.
   * @param filters - The `filters` parameter is an array of objects that represent the filters to be applied to the cube
   * query. Each object in the array should have the following properties:
   * @returns a Promise that resolves to the chartData object.
   */
  getReportFromCubeJS(measures, dimensions, filters) {
    log.info('measures', measures);

    let cubeMeasures = [];
    measures.forEach((measure) => {
      cubeMeasures.push(`${measure.transaction}.${measure.query}`)
    })
    let cubeDimensions = [];
    dimensions.forEach((dimension) => {
      cubeDimensions.push(`${dimension.transaction}.${dimension.query}`)
    })
    /*let cubeFilters = [];
    filters.forEach((filter) => {
      cubeMeasures.push(`${filter.transaction}.${filter.query}`)
    })*/
    const query: Query = {
      dimensions: cubeDimensions,
      // filters: cubeFilters,
      measures: cubeMeasures,
      limit: 20,
    }

    /*return this.cubejsApi.load(query).then(resultSet => {

      this.chartLabels = resultSet.chartPivot().map((c) => c.xValues[0]);
      const reportLabels = resultSet.chartPivot().map((c) => c.xValues);
      const reportData = resultSet.series().map(s => s.series.map(r => r.value));

      const chartData = {
        labels: this.chartLabels,
        datasets: this.reportService.generateReportDatasets(reportLabels, reportData, cubeMeasures)
      };
      this.chartDataArr.push(chartData);
      log.info('chart data', chartData);
      return chartData;

      /!*this.tableDetails = this.reportService.prepareTableData(
        reportLabels, reportData, dimensions, this.measures, this.criteria
      );*!/

       // log.info('report data >>>', reportsData);
     })*/
    return new Promise((resolve) => {
      this.cubejsApi.load(query).then(resultSet => {

        this.chartLabels = resultSet.chartPivot().map((c) => c.xValues[0]);
        const reportLabels = resultSet.chartPivot().map((c) => c.xValues);
        const reportData = resultSet.series().map(s => s.series.map(r => r.value));

        const chartData = {
          labels: this.chartLabels,
          datasets: this.reportService.generateReportDatasets(reportLabels, reportData, cubeMeasures)
        };
        this.chartDataArr.push(chartData);
        this.chartData = chartData;
        log.info('chart data', chartData);
        resolve(chartData);

        /*this.tableDetails = this.reportService.prepareTableData(
          reportLabels, reportData, dimensions, this.measures, this.criteria
        );*/

        // log.info('report data >>>', reportsData);
      })
    })
  }
}
