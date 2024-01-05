import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ReportService} from "../../reports/services/report.service";
import {Logger} from "../../../shared/services";
import {ActivatedRoute} from "@angular/router";
import {
  ListDashboardsDTO,
  AddReportToDashDTO,
  DashboardReports
} from "../../../shared/data/reports/dashboard";
import cubejs, {Query} from "@cubejs-client/core";
import {AppConfigService} from "../../../core/config/app-config-service";
import {ChartConfiguration} from "chart.js";
import {TableDetail} from "../../../shared/data/table-detail";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {RenameDTO} from "../../../shared/data/reports/chart-reports";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import { take } from 'rxjs';

const log = new Logger('ListReportComponent');

export let browserRefresh = false;
@Component({
  selector: 'app-list-report',
  templateUrl: './list-report.component.html',
  styleUrls: ['./list-report.component.css']
})
export class ListReportComponent implements OnInit {

  items: MenuItem[] = [];
  basicData: any;
  public dashboardId: number;
  public dashboard: ListDashboardsDTO[] = [];
  updatedReport: RenameDTO;

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
  selectedReportId:number = null;
  selectedReport:any = null;

  isEditable: boolean = false;

  unsavedChanges = false;

  public orderedReports: any;

  previousPosition: number;
  currentPosition: number;
  dragDroppedData: any[];

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
              // this.shareReport();
              const modal = document.getElementById('shareModal');
              if (modal) {
                modal.classList.add('show');
                modal.style.display = 'block';
                const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
                if (modalBackdrop) {
                  modalBackdrop.classList.add('show');
                }
              }
            }
          },
          {
            label: 'Download',
            command: () => {
              // this.downloadReport();
              const modal = document.getElementById('downloadModal');
              if (modal) {
                modal.classList.add('show');
                modal.style.display = 'block';
                const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
                if (modalBackdrop) {
                  modalBackdrop.classList.add('show');
                }
              }
            }
          },
          {
            label: 'Rename',
            command: () => {
              // this.renameReport();
              this.toggleEditability(this.selectedReportId);
            }
          },
          {
            label: 'Remove from dashboard',
            command: () => {
              // this.removeFromDashboard();
              const modal = document.getElementById('deleteDashboardModal');
              if (modal) {
                modal.classList.add('show');
                modal.style.display = 'block';
                const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
                if (modalBackdrop) {
                  modalBackdrop.classList.add('show');
                }
              }
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
      reportId: this.selectedReportId,
      width: 0
    }];

    const deleteDashboard: AddReportToDashDTO = {
      dashboardId: this.selectedDashboard,
      dashboardReports: report
    }

    this.reportService.deleteReportFromDashboard(this.selectedDashboard, this.selectedReportId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          log.info('on delete report', res);

          this.globalMessagingService.displaySuccessMessage('Success', 'Report successfully removed from dashboard' );

          setTimeout(() => {
            this.getDashboardById(this.selectedDashboard);
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('error', err.message);
        }
      });
  }

  /**
   * The function "getDashboardById" retrieves a dashboard report by its ID and logs the report data.
   * @param {number} id - The parameter "id" is of type number and represents the identifier of the dashboard that we want
   * to retrieve.
   */
  getDashboardById(id:number) {
    this.dashboard= [] = [];
    this.reportService.getDashboardsById(id)
    .pipe(take(1))
    .subscribe({
      next: (reportData) => {
        let reportArr = [];
        reportArr.push(reportData);
        this.dashboard = reportArr;
        // this.reportName = this.report.name
        log.info('report data', this.dashboard);

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
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('error', err.message);
      }
    });
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

        let tableDimensions = [];
        dimensions.forEach((el) => {
          tableDimensions.push(`${el.transaction}.${el.query}`);
        });

        let tableMeasures = [];
        measures.forEach((el) => {
          tableMeasures.push(`${el.transaction}.${el.query}`);
        });

        const tableCriteria = [...measures, ...dimensions];

        log.info('chart data', chartData);
        resolve(chartData);

        this.tableDetails = this.reportService.prepareTableData(
          reportLabels, reportData, tableDimensions, tableMeasures, tableCriteria
        );

        // log.info('report data >>>', reportsData);
      })
    })
  }

  /**
   * The function "closeDeleteModal" is used to hide and remove the delete dashboard modal and its backdrop.
   */
  closeDeleteModal() {
    const modal = document.getElementById('deleteDashboardModal');
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
   * The function "openSaveModal" displays a modal for saving a dashboard.
   */
  openSaveModal() {
    const modal = document.getElementById('saveDashboardModal');
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
   * The function "closeSaveModal" hides the save dashboard modal and its backdrop.
   */
  closeSaveModal() {
    const modal = document.getElementById('saveDashboardModal');
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
   * The function toggles the editability of a report and logs the report ID.
   * @param event - The `event` parameter is an object that represents the event that triggered the `toggleEditability`
   * function. It could be an event object that contains information about the event, such as the type of event, the target
   * element, or any other relevant data. The specific properties and structure of the `
   */
  toggleEditability(event) {
    const reportId = this.selectedReport;
    if (reportId) {
      this.isEditable = !this.isEditable;
    }

    log.info('report rename id', this.selectedReport);
  }

  /**
   * The `handleEnter` function is triggered when the Enter key is pressed, and it updates a report with a new name.
   * @param {any} event - The `event` parameter is an object that represents the event that triggered the function. In this
   * case, it is used to check if the Enter key was pressed.
   */
  handleEnter(event: any) {
    const reportId = this.selectedReportId;
    if (event.key === 'Enter') {
      // this.renameReport(reportId);
      const renameValue = event.target.value;

      const updateReport: RenameDTO = {
        name: renameValue,
        reportId: this.selectedReportId
      }
      log.info('report on enter',this.selectedReport)
      log.info('report on enter',updateReport)
      this.reportService.renameChartReports(reportId, updateReport)
        .subscribe(res => {
          this.updatedReport = res;
          log.info('updated report', this.updatedReport);
          this.globalMessagingService.displaySuccessMessage('Success', 'Report successfully updated' );
          this.isEditable = false;

          setTimeout(() => {
            this.getDashboardById(this.dashboardId);
            this.cdr.detectChanges();
          }, 3000);
        })
    }
  }

  /**
   * The "drop" function is used to move an item within an array based on the previous and current index values.
   * @param event - The event parameter is an object that contains information about the drag and drop event. It includes
   * properties such as previousIndex, which represents the index of the item before it was moved, and currentIndex, which
   * represents the index of the item after it was moved.
   */
  drop(event: CdkDragDrop<ListDashboardsDTO[]>) {
    moveItemInArray(this.dashboard[0].reports, event.previousIndex, event.currentIndex);

    log.info('>>>>>', this.dashboard)
    log.info('prev pos', event.previousIndex + 1);
    log.info('current pos', event.currentIndex + 1);
    log.info('data', event.container.data);

    this.currentPosition = event.currentIndex;
    this.previousPosition = event.previousIndex;
    this.dragDroppedData = event.container.data;

    for (let i=0; i<this.dashboard[0].reports?.length; i++) {
      this.dashboard[0].reports[i].order = i;
      // log.info('>>>i', i)
    }

    this.orderedReports = this.dashboard[0].reports;

    log.info('list reports ordering', this.dashboard[0].reports);

  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    const isUnsaved = this.previousPosition !== null || this.currentPosition !== null || this.dragDroppedData !== null;
    log.info('Is unsaved>>', isUnsaved);
    if (isUnsaved) {
      log.info('test reload');
      this.openSaveModal();
      $event.returnValue = true;
    }
  }

  /**
   * The function `updateReportOrder()` updates the order of reports in a dashboard and saves the changes.
   */
  updateReportOrder() {

    const report: DashboardReports[] = this.dashboard[0].reports.map((orderedReport) => {

      return {
        length: 0,
        order: orderedReport.order,
        reportId: orderedReport.id,
        width: 0,
      };
    });

    const saveOrderedReports: AddReportToDashDTO = {
      dashboardId: this.dashboard[0].id,
      dashboardReports: report
    }

    log.info('ordered details', saveOrderedReports);

    this.reportService.addReportToDashboard(this.dashboard[0].id, saveOrderedReports)
      .subscribe(res => {
        log.info(`save response  >>>`, res);
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated records');

        setTimeout(() => {
          this.getDashboardById(this.dashboard[0].id);
          this.cdr.detectChanges();
        }, 3000);
      })
  }

}
