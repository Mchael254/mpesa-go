import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {SubjectArea} from "../../../shared/data/reports/subject-area";
import {ReportService} from "../services/report.service";
import {SubjectAreaCategory} from "../../../shared/data/reports/subject-area-category";
import {map, take, tap} from "rxjs/operators";
import {Criteria} from "../../../shared/data/reports/criteria";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {ChartConfiguration, ChartType} from "chart.js";
import {TableDetail} from "../../../shared/data/table-detail";
import cubejs from "@cubejs-client/core";
import {AppConfigService} from "../../../core/config/app-config-service";
import {Folder} from "../../../shared/data/reports/folder";
import {Observable} from "rxjs";
import {Report} from "../../../shared/data/reports/report";
import {AuthService} from "../../../shared/services/auth.service";
import {LocalStorageService} from "../../../shared/services/local-storage/local-storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Logger} from "../../../shared/services/logger/logger.service";

const log = new Logger('CreateReportComponent');

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit{

  public searchForm: FormGroup;
  public saveReportForm: FormGroup;
  public subjectAreas: SubjectArea[] = [];
  public selectedSubjectArea: string = null;
  public subjectAreaCategories: SubjectAreaCategory[] = [];
  public reports$: Observable<Report[]> = new Observable<Report[]>();
  public queryObject: Criteria = {};
  public showSubjectAreas: boolean = false;
  public shouldShowVisualization: boolean = false;
  public shouldShowTable: boolean = true;
  public criteria: Criteria[] = [];
  public measures: string[] = [];
  public dimensions: string[] = [];
  public chartLabels: string[];
  public chartData: ChartConfiguration<'bar'|'line'|'scatter'|'bubble'|'pie'|'doughnut'|'polarArea'|'radar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public isCriteriaButtonActive: boolean = true;
  public isPreviewResultAvailable: boolean = null;
  private reportId: number;
  private report: Report;
  public chartTypes: {iconClass: string, name: ChartType | string}[] = [
    { iconClass: 'pi pi-table', name: 'table'},
    { iconClass: 'pi pi-chart-bar', name: 'bar'},
    { iconClass: 'pi pi-chart-line', name: 'line'},
    { iconClass: 'pi pi-chart-pie', name: 'pie'},
    { iconClass: 'pi pi-chart-bar', name: 'doughnut'},
    { iconClass: 'pi pi-chart-bar', name: 'polarArea'},
    { iconClass: 'pi pi-chart-bar', name: 'radar'},
  ];
  public chartType: ChartType | string = "table";
  public reportTitle: string = '';
  public tableDetails: TableDetail = {};

  private cubejsApi = cubejs({
    apiUrl: this.appConfig.config.cubejsDefaultUrl
  });

  public folders: Folder[] = [];
  private user: any = null;
  private userId: number = 0;
  private folderId: number = 0; // defaults to My Reports

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private reportService: ReportService,
    private globalMessagingService: GlobalMessagingService,
    private appConfig: AppConfigService,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Initializes component by:
   * 1. Creating a search form
   * 2. Creating a save report form
   * 3. Getting a report when reportId exists in params
   * 4. Getting the currently logged in user
   * 5. Getting a list of existing reports
   * 6. Getting a list of folders
   * @return void
   */
  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        take(1)
      ).subscribe((params) => {
      this.reportId = params['reportId'];
      // log.info(`params >>> `, params, this.reportId);
      if (this.reportId !== undefined) {
        this.getReport();
      }
    });

    this.getSubjectAreas();
    this.createSearchForm();
    this.createSaveReportForm();

    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      this.userId = this.user.id;
    });

    this.getReports();
    this.getFolders();
  }

  /**
   * Creates the search form
   * @returns void
   */
  createSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      subjectArea: ['']
    });
  }

  /**
   * Creates the save report form
   * @returns void
   */
  createSaveReportForm(): void {
    this.saveReportForm = this.fb.group({
      reportSearch: [''],
      reportName: [''],
      reportDescription: ['']
    });
  }

  /**
   * Fetches a list of subject areas
   * @returns void
   */
  getSubjectAreas(): void {
    this.reportService.getSubjectAreas()
      .subscribe((res) => {
        this.subjectAreas = res;
        log.info(`all Subject Areas >>>`, this.subjectAreas);
      });
  }

  /**
   * Fetches a list of categories under the selected subject area
   * @returns void
   * @param s - the selected subject area
   */
  getCategoriesBySubjectAreaId(s: SubjectArea): void {
    console.log(`subject area from click`, s)
    this.selectedSubjectArea = s.subjectAreaName;
    this.subjectAreaCategories = null;
    this.showSubjectAreas = false;
    this.searchForm.reset();
    this.reportService.getCategoriesBySubjectAreaId(s.id)
      .pipe(take(1))
      .subscribe(res => {
        this.subjectAreaCategories = res;
        // log.info(`subjectAreaCategories>>>`, this.subjectAreaCategories);
        this.cdr.detectChanges();
      });
  }

  /**
   * 1. Selects a criteria and
   * 2. Splits the criteria into a list of measures and dimensions for cubeJs API consumption
   * 3. Calls the splitDimensionAndMeasure() method to accomplish #2 above
   * @param category
   * @param subCategory
   * @param query
   * @returns void
   */
  selectCriteria(category, subCategory, query): void {

    this.queryObject = {
      category: category.description,
      categoryName: category.name,
      subcategory: subCategory.description,
      subCategoryName: subCategory.name,
      transaction: subCategory.value,
      query: query.value,
      queryName: query.name
    }

    const criterion = `${this.queryObject.transaction}.${this.queryObject.query}`;
    const checkCriterion = this.checkIfCriterionExists(criterion, this.measures, this.dimensions);
    if (checkCriterion) {
      const detail = `${this.queryObject.query} already selected.`;
      this.globalMessagingService.displayErrorMessage('error',detail);
      return;
    }

    this.criteria.push(this.queryObject);
    this.splitDimensionsAndMeasures(this.queryObject);
  }

  /**
   * Splits the selected criteria into a list of dimensions and measures
   * @returns void
   */
  splitDimensionsAndMeasures(queryObject: Criteria): void {
    const criterion = `${queryObject.transaction}.${queryObject.query}`;
    if (queryObject.category === 'metrics') {
      this.measures.push(criterion);
    } else {
      this.dimensions.push(criterion);
    }
  }

  /**
   * Checks if a criteria exists based on the combination of the transaction type and query
   * @param criterion
   * @param measures
   * @param dimensions
   * @returns boolean
   */
  checkIfCriterionExists(criterion, measures, dimensions): boolean {
    if (measures.indexOf(criterion) === -1 && dimensions.indexOf(criterion) === -1 ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Toggles between criteria lists and preview chart in the template, calls loadChart() when preview is active
   * @param selected
   * @returns void
   */
  toggleCriteriaPreview(selected: string): void {
    this.isCriteriaButtonActive = selected === 'criteria' ? true : false;
    log.info(`isCriteriaButtonActive`, this.isCriteriaButtonActive)
    if (selected === 'preview') {
      this.loadChart();
    }
  }

  /**
   * 1. Loads chart by calling the cubeJS API based on previously defined values i.e.:
   * i. criteria
   * ii. isPreviewAvailable
   * iii. measures
   * iv. dimensions
   * 2. Calls a helper method for generating a dynamic tables based on result fetched from cubeJS API
   * @returns void
   */
  loadChart(): void {

    if (this.reportId) {
      this.measures = [];
      this.dimensions = [];
      this.criteria.forEach((queryObject) => {
        this.splitDimensionsAndMeasures(queryObject);
      });
    }

    this.isPreviewResultAvailable = false;
    const query = {
      measures: this.measures,
      dimensions: this.dimensions,
      limit: 20
    }
    log.info(`query for cube >>> `, query);

    this.cubejsApi.load(query).then(resultSet => {
      this.chartLabels = resultSet.chartPivot().map((c) => c.xValues[0]);
      const reportLabels = resultSet.chartPivot().map((c) => c.xValues);
      const reportData = resultSet.series().map(s => s.series.map(r => r.value));

      this.chartData = {
        labels: this.chartLabels,
        datasets: this.reportService.generateReportDatasets(reportLabels, reportData, this.measures)
      };

      this.isPreviewResultAvailable = true;

      this.tableDetails = this.reportService.prepareTableData(
        reportLabels, reportData, this.dimensions, this.measures, this.criteria
      );
    });
  }

  /**
   * Adds a report to dashboard
   * @returns void
   */
  addReportToDashboard(): void {
    const reportToSave: any /*Report*/ = {
      criteria: JSON.stringify(this.criteria),
      reportName: this.report.reportName,
      reportType: this.chartType,
      reportDescription: this.report.reportDescription,
      dashboardId: 0, // default dashboard
      borderColor: 'blue',
      backgroundColor: 'red',
      folderId: this.report.folderId,
      userId: this.report.userId,
    };

    this.reportService.editReport(this.reportId, reportToSave)
      .pipe()
      .subscribe((res) => {
        log.info(`Report successfully updated >>> `, res);
        this.globalMessagingService.displaySuccessMessage('success', 'Report successfully added to dashboard.')
        this.router.navigate(['home/reports/dashboard']).then(r => {})
      }, (error) => {
        this.globalMessagingService.displayErrorMessage('error', 'Report not added to dashboard.')
      });
  }

  /**
   * Deletes a previously selected criteria
   * @param criteria
   * @returns void
   */
  deleteCriteria(criteria: Criteria): void {
    const index = this.criteria.indexOf(criteria);
    if (index > -1) {
      this.criteria.splice(index, 1);
    }

    const criteriaToRemove = `${criteria.transaction}.${criteria.query}`
    if (criteria.category === 'metrics') {
      const index = this.measures.indexOf(criteriaToRemove);
      this.measures.splice(index, 1);
    } else {
      const index = this.dimensions.indexOf(criteriaToRemove);
      this.dimensions.splice(index, 1);
    }

  }

  /**
   * Toggles dropdown to show list of available chart visualizations
   * @returns void
   */
  showVisualizationList(): void {
    this.shouldShowVisualization = !this.shouldShowVisualization;
  }

  /**
   * Selects a chart type for the list of available visualizations
   * @param chartType
   * @returns void
   */
  selectChartType(chartType: { iconClass: string; name: ChartType | string }): void {
    this.chartType = chartType.name;
    // @ts-ignore
    if (this.chartType === 'table') {
      this.shouldShowTable = true;
    } else {
      this.shouldShowTable = false;
    }
    this.shouldShowVisualization = false;
    this.loadChart();
  }

  /**
   * Searches for a report for the list of reports
   * status: pending implementation (yet to be developed)
   * @returns void
   */
  searchReport(): void {
    const searchTerm = this.saveReportForm.getRawValue().reportSearch;
    log.info(`search report using >>>`, searchTerm);
  }

  /**
   * Selects folder to view or save a report to
   * @param folder
   * @returns void
   */
  selectFolder(folder: Folder): void {
    this.folders.forEach(item => {
      item.active = item.id === folder.id ? true: false
    });

    this.userId = folder.id === 0 ? this.user.id : 0;
    this.folderId = folder.id;
    this.getReports();
  }

  /**
   * Gets a list of available reports
   * @returns void
   */
  getReports(): void {
    // log.info(`user id >>>`, this.userId, typeof this.userId);
    this.reports$ = this.reportService.getReports()
      .pipe(
        map(reports => reports.filter(report => parseInt(String(report.folderId)) === this.folderId)),
        tap(reports => {
          // log.info(`reports >>>`, reports)
        })
      );
  }

  /**
   * Gets a specific report by id
   * @returns void
   */
  getReport(): void {
    this.reportService.getReport(this.reportId)
      .pipe(take(1))
      .subscribe((report) => {
        report.criteria = JSON.parse(String(report.criteria));
        // @ts-ignore
        this.criteria = report.criteria
        this.report = report;
        this.reportTitle = report.reportName;
        this.shouldShowTable = report.reportType === 'table';
        this.chartType = report.reportType;
        this.toggleCriteriaPreview('preview');
      });
  }

  /**
   * Initializes the list of available folders
   * @returns void
   */
  getFolders(): void {
    this.folders = [
      {id: 0, name: 'My Reports', desc: 'Logged in user folder', userId: 1, active: true},
      {id: 1, name: 'Shared Reports', desc: 'All users folder', userId: 0},
    ]
  }

  /**
   * 1. Saves a report to the databse
   * 2. Gets the list of reports after saving
   * 3. Gets the return value of the saved report
   * @returns void
   */
  saveReport(): void {
    const rawValue = this.saveReportForm.getRawValue();
    this.reportTitle = rawValue.reportName;
    const reportDescription = rawValue.reportDescription;

    const reportToSave: Report = {
      criteria: JSON.stringify(this.criteria),
      reportName: this.reportTitle,
      reportType: this.chartType,
      reportDescription: reportDescription,
      dashboardId: null,
      folderId: this.folderId,
      userId: this.userId,
    };

    this.reportService.saveReport(reportToSave)
      .subscribe(res => {
        log.info(`response from successful save >>>`, res);
        this.reportId = res.id;
        this.getReports();

        this.getReport();
        this.globalMessagingService.displaySuccessMessage('success', 'Report saved');
        this.cdr.detectChanges();
      }, (error) =>
      {
        this.globalMessagingService.displayErrorMessage('error', 'Report not saved');
      });

  }

}
