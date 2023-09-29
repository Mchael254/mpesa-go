import {Component, OnInit} from '@angular/core';
import {ReportService} from "../services/report.service";
import {map, tap} from "rxjs/operators";
import {Folder, FolderId} from "../../../shared/data/reports/folder";
import {Router} from "@angular/router";
import {Report} from "../../../shared/data/reports/report";
import {Observable} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import { NgxSpinnerService } from 'ngx-spinner';
import {Logger} from "../../../shared/services/logger/logger.service";

const log = new Logger('MyReportsComponent');
@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.css']
})
export class MyReportsComponent implements OnInit{

  public folders: Folder[] = [];
  public reports: Report[] = [];
  public reports$: Observable<Report[]> = new Observable<Report[]>();

  public user: any;
  private userId: number = 0;
  private folderId: number = FolderId.MY_REPORTS;
  public selectedReport: Report;
  public currentUrl: string;

  public searchForm: FormGroup;

  constructor(
    private reportService: ReportService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
  }
  ngOnInit(): void {
    this.getFolders();

    this.currentUrl = this.router.url;
    const folderId = this.currentUrl.indexOf('my-reports') !== -1 ? FolderId.MY_REPORTS
      : this.currentUrl.indexOf('shared-reports') !== -1 ? FolderId.SHARED_REPORTS
        : null;

    this.getReports(folderId);
    this.selectFolder(this.folders[folderId])

    /*this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
      this.userId = this.user.id;
      log.info(`current user >>>`, this.user)
    });*/
    this.user = this.authService.getCurrentUser()
    this.userId = this.user.id
    log.info(`current user >>>`, this.user)

    this.searchForm = this.fb.group({
      searchTerm: [''],
    });
  }

  getReports(folderId: number) {
    this.spinner.show();
    this.reports$ =  this.reportService.getReports()
      .pipe(
        map((reports) => reports.filter(report => report.folderId == folderId)),
        tap((reports) => {
          this.reports = reports;
          this.spinner.hide();
        })
      )
  }

  getFolders(): void {
    this.folders = [
      {id: FolderId.MY_REPORTS, name: 'My Reports', desc: 'Logged in user folder', userId: 1 },
      {id: FolderId.SHARED_REPORTS, name: 'Shared Reports', desc: 'All users folder', userId: 0},
    ]
  }

  selectFolder(folder: Folder): void {
    this.reports = [];

    this.folders.forEach((item) => {
      item.active = item.id === folder.id
    });

    this.userId = folder.id === 0 ? this.user?.id : 0;
    this.folderId = folder.id;
    this.getReports(this.folderId);
  }

  viewReport() {
    this.router.navigate([`home/reports/edit-report`],
      {queryParams: {reportId: this.selectedReport.id }})
  }

  selectReport(report: Report) {
    this.reports.forEach((item) => {
      item.active = item.id === report.id;
    });
    this.selectedReport = report;
  }

}
