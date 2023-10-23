import { Component, OnInit } from '@angular/core';
import { ReportServiceV2 } from '../services/report.service';
import {Logger} from "../../../shared/services";
import { take } from 'rxjs';
import { ReportService } from '../../reports/services/report.service';

const log = new Logger('ReportManagementComponent');

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.css']
})
export class ReportManagementComponent implements OnInit{

  public reports;
  public dashboards = [];
  public shouldShowTable: boolean = false;
  public first: number = 0;
  public rows: number = 10;
  public totalRecords: number;


  constructor(
    private reportServiceV2: ReportServiceV2,
    private reportService: ReportService,
  ) {

  }

  /**
   * Initializes the app by getting all reports from the DB
   */
  ngOnInit(): void {
    this.getReports();
    this.getDashboards();
  }

  /**
   * Gets all reports from the DB
   * @returns void
   */
  getReports(): void {
    this.reportServiceV2.getReports()
    .pipe(take(1))
    .subscribe({
      next: (res) => { 
        this.reports = res;
        this.totalRecords = res.totalElements;
        log.info(`reports >>>`, res);
        this.shouldShowTable = true;
      },
      error: (e) => { 
        log.debug(`error: `, e);
        this.shouldShowTable = true;
      }
    })
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

  getUserName(id) {
    return this.reportServiceV2.findUserById(id)
    // .pipe(take(1))
    // .subscribe({
    //   next: (res) => {
    //     log.info(`user >>> `, res)
    //   },
    //   error: (e) => { log.debug(`error: `, e) }
    // })
  }

  pageChange(event) {
    const page = (event.rows / event.first)
    log.info(`event >>> `, event, page);
  }

}