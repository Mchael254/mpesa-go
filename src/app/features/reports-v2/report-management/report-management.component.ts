import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ReportServiceV2} from '../services/report.service';
import {Logger} from "../../../shared/services";
import {Observable, take} from 'rxjs';
import {ReportService} from '../../reports/services/report.service';
import {ReportV2} from '../../../shared/data/reports/report';
import {SaveReportModalComponent} from '../save-report-modal/save-report-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalMessagingService} from '../../../shared/services/messaging/global-messaging.service';

const log = new Logger('ReportManagementComponent');

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.css']
})
export class ReportManagementComponent implements OnInit{

  @ViewChild(SaveReportModalComponent) child:SaveReportModalComponent;
  @ViewChild('closebutton') closebutton;

  public reports;
  public selectedReport: ReportV2;
  public dashboards = [];
  public shouldShowTable: boolean = false;
  public first: number = 0;
  public rows: number = 10;
  public totalRecords: number;
  public createBy$: Observable<any>;

  globalFilterFields: string[] = [
    'name',
    'createdBy',
    'date',
    'createdDate',
    'dashboardId',
  ]


  constructor(
    private reportServiceV2: ReportServiceV2,
    private reportService: ReportService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private globalMessagingService: GlobalMessagingService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  /**
   * Initializes the app by getting all reports from the DB
   */
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      const folder = params['id'] ? params['id'] : '';
      this.getReports(folder);
    });
    /*const id: string = this.activatedRoute.snapshot.paramMap.get('id');
    const reportCategory = id ? id : '';
    console.log(`report category >>> `, reportCategory);
    this.getReports(reportCategory);*/
    this.getDashboards();
  }

  /**
   * Gets all reports from the DB
   * @returns void
   */
  getReports(reportCategory: string): void {
    this.reports = { content: []};
    this.reportServiceV2.getReports()
    .pipe(take(1))
    .subscribe({
      next: (res) => {
        this.reports.content = this.filterReportsByCategory(res.content, reportCategory);
        this.totalRecords = res.totalElements;
        this.shouldShowTable = true;
      },
      error: (e) => {
        log.debug(`error: `, e);
        this.shouldShowTable = true;
      }
    })
  }

  filterReportsByCategory(reports: ReportV2[], reportCategory: string): ReportV2[] {
    if (!reportCategory) return reports;
    return  reports.filter(report => report.folder === reportCategory);
    // log.info(`filtered reports `, filteredReports);
  }


  /**
   * Get all dashboards from DB
   */
  getDashboards(): void {
    this.reportService.getDashboards()
    .pipe(take(1))
    .subscribe({
      next: (res) => {
        this.dashboards = res;
      },
      error: (e) => { log.debug(`error: `, e) }
    })
  }

  getFolderCategoryName(folder: string): string {
    return folder === 'M' ? 'My Reports' : 'Shared Reports';
  }

  getDashboardName(id: string): string {
    const dashbaord = this.dashboards.filter((dashboard) => dashboard.id === id)[0];
    const dashboardName = dashbaord?.name.length > 0 ? dashbaord?.name : '---';
    return dashboardName;
  }

  // getUserName(id: number) {
  //   return this.reportServiceV2.findUserById(id);
  // }

  pageChange(event) {
    const page = (event.rows / event.first)
    log.info(`event >>> `, event, page);
  }


  reAssignReportFolder(folder: string, report: ReportV2) {
    if (report.folder !== folder) {
      const reportToSave: ReportV2 = {
        ...report,
        folder,
        dashboardId: report.dashboardId,
      };
      this.saveReport(reportToSave);
    }
  }

  reAssignReportDashboard(dashboardId: number, report: ReportV2) {
    if (report.dashboardId !== dashboardId) {
      const reportToSave: ReportV2 = {
        ...report,
        dashboardId
      };
      this.saveReport(reportToSave);
    }
  }

  saveReport(report: ReportV2) {
    this.reportServiceV2.updateReport(report)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          // log.info(`report udpate successfully`, res);
          this.shouldShowTable = false;
          this.closebutton.nativeElement.click();
          this.getReports(res.folder);
        },
        error: (e) => {

        }
      });
  }

  deleteReport(id: number) {
    this.reportServiceV2.deleteReport(id)
    .pipe(take(1))
    .subscribe({
      next: (res) => {
        log.info(`report successfully deleted`);
        this.globalMessagingService.displaySuccessMessage('success', 'Report successfully deleted')
        this.shouldShowTable = false;
        this.ngOnInit();
      },
      error: (e) => {
        log.info(`delete failed >>>`, e);
        this.globalMessagingService.displayErrorMessage('error', 'Report not deleted')
      }
    })
  }

  selectReport(report: ReportV2) {
    this.selectedReport = report;
    this.child.patchFormValues(report);
  }

  gotoEditReport(report: ReportV2): void {
    this.router.navigate([`/home/reportsv2/preview/${report.id}`],
            { queryParams: { isEditing: true }});
  }

}
