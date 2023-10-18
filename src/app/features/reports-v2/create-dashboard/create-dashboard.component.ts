import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {MenuItem} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportService} from "../../reports/services/report.service";
import {Logger, UtilService} from "../../../shared/services";
import {Dashboard, DashboardReport, DashboardReports} from "../../../shared/data/reports/dashboard";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import cubejs, {Query} from "@cubejs-client/core";
import {AppConfigService} from "../../../core/config/app-config-service";
import {ChartConfiguration} from "chart.js/dist/types";
import {TableDetail} from "../../../shared/data/table-detail";
import {Criteria} from "../../../shared/data/reports/criteria";
import {NgxSpinnerService} from "ngx-spinner";

const log = new Logger('CreateDashboardComponent');
@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements OnInit {

  basicData: any;
  items: MenuItem[] = [];
  public createDashboardForm: FormGroup;
  public addReportToDashboardForm: FormGroup;

  public chartReports: any[] = [];
  chartRepName: any = [];
  selectedChartReport: any = [];

  public dashboards: any[] = [];
  public selectedDashboard: Dashboard;
  selectedItem:any = null;
  public dashboardReport: DashboardReports;

  private cubejsApi = cubejs({
    apiUrl: this.appConfig.config.cubejsDefaultUrl
  });

  public chartLabels: string[];
  public chartData: ChartConfiguration<'bar'|'line'|'scatter'|'bubble'|'pie'|'doughnut'|'polarArea'|'radar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public tableDetails: TableDetail = {};
  public chartDataArr = [];
  public measures: string[] = [];
  public criteria: Criteria[];

  constructor(
  private globalMessagingService: GlobalMessagingService,
  private fb: FormBuilder,
  private reportService: ReportService,
  private cdr: ChangeDetectorRef,
  private authService: AuthService,
  private utilService: UtilService,
  private router: Router,
  private appConfig: AppConfigService,
  private spinner: NgxSpinnerService
  ) {}


  /**
   * The `ngOnInit` function initializes data and adds event listeners to clickable icons.
   */
  ngOnInit(): void {
    this.spinner.show();
    this.createDashForm();
    this.addReportToDashForm();
    this.getChartReports();
    this.getAllDashboards();

    this.items = [
      {
        items: [
          {
            label: 'Rename dashboard',
            command: () => {
              this.renameDashboard();
            }
          },
          {
            label: 'Delete',
            command: (event) => {
              // this.deleteDashboard(this.selectedItem);
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
          {
            label: 'Add report',
            command: () => {
              this.addReport();
            }
          },
        ]
      },
    ];

    const clickableIcons = document.querySelectorAll('.clickable');

    // Add click event listener to the document
    document.addEventListener('click', (event) => {
      const clickedElement = event.target as HTMLElement;

      // Check if the clicked element is not within a clickable icon or its container
      if (
        clickedElement &&
        !clickedElement.classList.contains('clickable') &&
        !clickedElement.closest('.icon-container')
      ) {
        // Remove the "active" class from all clickable icons
        clickableIcons.forEach(icon => {
          icon.closest('.icon-container')?.classList.remove('active');
        });
      }
    });

    clickableIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        icon.closest('.icon-container').classList.toggle('active');
      });
    });

  }

  createDashForm() {
    this.createDashboardForm = this.fb.group({
      dashboardName: ['', Validators.required],
      reportName: [''],
    });
  }

  addReportToDashForm() {
    this.addReportToDashboardForm = this.fb.group({
      reportName: [''],
    })
  }
  /**
   * The function onCreateDashboard displays a success message when a dashboard is successfully created.
   */
  onCreateDashboard() {
    if (this.createDashboardForm.valid) {
      const formValues = this.createDashboardForm.getRawValue();
      log.info('form value', formValues);
      log.info('rep id', formValues.reportName[0].id);

      const loggedInUser = this.authService.getCurrentUser();
      let id:number;
      if (this.utilService.isUserAdmin(loggedInUser)) {
        id = loggedInUser.id;

      }
      const createdByID = id;
      let selectedReports = formValues.reportName;

      const report: DashboardReports[] = selectedReports.map((selectedReport, index) => {
        const reportId = selectedReport && selectedReport?.id ? selectedReport?.id : null;

        return {
          length: 0,
          order: index,
          reportId,
          width: 0,
        };
      });

      const saveDashboard: Dashboard = {
        createdBy: createdByID,
        dashboardReports: report,
        id: 0,
        name: formValues.dashboardName
      }

      this.reportService.saveDashboard(saveDashboard)
        .subscribe(res => {
          log.info(`save response  >>>`, res);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created Dashboard');

        })
      this.getAllDashboards();
      this.cdr.detectChanges();

    }
    else {
      this.globalMessagingService.displayErrorMessage('error', 'Dashboard name is required')
    }

  }

  /**
   * The addReport function displays a success message indicating that a report has been added.
   */
  addReport() {

    const modal = document.getElementById('addReportModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
    // this.globalMessagingService.displaySuccessMessage('Success',  'Report Added' );
  }

  /**
   * The function closeAddReportModal() is used to hide and remove the display of a modal element with the id 'addReportModal' and
   * its associated backdrop.
   */
  closeAddReportModal() {
    const modal = document.getElementById('addReportModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

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
   * The delete function displays a success message indicating that a report has been deleted.
   */
  deleteDashboard(id:number) {
    this.reportService.deleteDashboard(this.selectedItem).subscribe(res =>{
      log.info(`on delete response  >>>`, res);
      this.globalMessagingService.displaySuccessMessage('Success', 'Report Deleted' );

    })
    this.getAllDashboards();
    this.cdr.detectChanges();

  }

  /**
   * The function `getChartReports` retrieves chart reports from the report service and assigns them to the `chartReports`
   * variable.
   */
  getChartReports(): void {
    this.reportService.getChartReports()
      .subscribe(res => {
        this.chartReports = res?.content;
        log.info(`all chart reports >>>`, this.chartReports);

      });
  }

  /**
   * The function `getAllDashboards` retrieves all dashboards from the report service and logs them.
   */
  async getAllDashboards(): Promise<void> {
    this.reportService.getDashboards()
      .subscribe(async res => {
        this.dashboards = res;
        log.info(`dashboards >>>`, this.dashboards);
        for (const dashboard of res) {

          if (dashboard.reports.length > 0) {
            const report = dashboard.reports[0];
            const measures = JSON.parse(report?.measures);
            const dimensions = JSON.parse(report?.dimensions);
            const filters = JSON.parse(report?.filter);
            log.info(`chart to use >>>`, res[1]?.reports[0]?.charts[0]?.type);

            /*log.info(`measures >>>`, measures);
            log.info(`dimensions >>>`, dimensions);
            log.info(`filters >>>`, filters);
            log.info('---------------')*/

            // this.getReportFromCubeJS(measures, dimensions, filters);
            const chartData = await this.getReportFromCubeJS(measures, dimensions, filters);
            dashboard.chartData = chartData;
          }
        }
        this.spinner.hide();
        // log.info(`all dashboards >>>`, this.dashboards);
      });
  }

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

        log.info(`--------------------------------`)
        log.info(`report labels >>>`, reportLabels);
        log.info(`reportData >>>`, reportData);
        log.info(`dimensions >>>`, tableDimensions);
        log.info(`measures >>>`, tableMeasures);
        log.info(`criteria >>>`, tableCriteria);
        log.info(`--------------------------------`)

        this.tableDetails = this.reportService.prepareTableData(
          reportLabels, reportData, tableDimensions, tableMeasures, tableCriteria
        );

        // chartData.tableDetails = tableDetails;

        log.info('chart data', chartData);
        resolve(chartData);

        // log.info('report data >>>', reportsData);
      })
    })
  }

  /**
   * The function renameDashboard() is used to rename a dashboard.
   */
  renameDashboard() {

  }

  /**
   * The function `addReportToDashboard` adds a report to a dashboard and displays a success message.
   */
  addReportToDashboard() {
    // log.info('add reportto dash', this.selectedItem);

      const reportToDashForm = this.addReportToDashboardForm.getRawValue();
      log.info('form value', reportToDashForm);
      log.info('rep id', reportToDashForm.reportName.id);

    let selectedReports = reportToDashForm.reportName;
    const report: DashboardReports[] = selectedReports.map((selectedReport, index) => {
      const reportId = selectedReport && selectedReport?.id ? selectedReport?.id : null;

      return {
        length: 0,
        order: index,
        reportId,
        width: 0,
      };
    });

      const saveDashboard: DashboardReport = {
        dashboardId: this.selectedItem,
        dashboardReports: report

      }

    this.reportService.addReportToDashboard(this.selectedItem, saveDashboard)
      .subscribe(res => {
        this.dashboardReport = res;
        log.info('add reportto dash', this.dashboardReport);
        this.globalMessagingService.displaySuccessMessage('Success', 'Report successfully added' );
      })
  }

  /**
   * The function `moveToListReport` navigates to the list-report page with a specified dashboardId query parameter.
   * @param {number} id - The `id` parameter is a number that represents the dashboard ID.
   */
  moveToListReport(id:number) {
    this.router.navigate([`home/reportsv2/list-report`],
      {queryParams: {dashboardId: id }});
  }
}
