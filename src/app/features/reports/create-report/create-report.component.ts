import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {SubjectArea} from "../../../shared/data/reports/subject-area";
import {Logger} from "../../../shared/services";
import {ReportService} from "../services/report.service";
import {SubjectAreaCategory} from "../../../shared/data/reports/subject-area-category";
import {take} from "rxjs/operators";
import {Criteria} from "../../../shared/data/reports/criteria";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {ChartConfiguration, ChartType} from "chart.js";
import {TableDetail} from "../../../shared/data/table-detail";
import cubejs from "@cubejs-client/core";
import {AppConfigService} from "../../../core/config/app-config-service";

const log = new Logger('CreateReportComponent');

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit{

  public searchForm: FormGroup;
  public subjectAreas: SubjectArea[] = [];
  public selectedSubjectArea: string = null;
  public subjectAreaCategories: SubjectAreaCategory[] = [];
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

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private reportService: ReportService,
    private globalMessagingService: GlobalMessagingService,
    private appConfig: AppConfigService
  ) {}
  ngOnInit(): void {
    this.getSubjectAreas();
    this.createSearchForm();
  }

  createSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      subjectArea: ['']
    });
  }

  getSubjectAreas(): void {
    this.reportService.getSubjectAreas()
      .subscribe((res) => {
        this.subjectAreas = res;
        log.info(`all Subject Areas >>>`, this.subjectAreas);
      });
  }

  getCategoriesBySubjectAreaId(s: SubjectArea): void {
    this.selectedSubjectArea = s.subjectAreaName;
    this.subjectAreaCategories = null;
    this.showSubjectAreas = false;
    this.searchForm.reset();
    this.reportService.getCategoriesBySubjectAreaId(s.id)
      .pipe(take(1))
      .subscribe(res => {
        this.subjectAreaCategories = res;
        log.info(`subjectAreaCategories>>>`, this.subjectAreaCategories);
        this.cdr.detectChanges();
      });
  }

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

  splitDimensionsAndMeasures(queryObject: Criteria): void {
    const criterion = `${queryObject.transaction}.${queryObject.query}`;
    if (queryObject.category === 'metrics') {
      this.measures.push(criterion);
    } else {
      this.dimensions.push(criterion);
    }
  }

  checkIfCriterionExists(criterion, measures, dimensions): boolean {
    if (measures.indexOf(criterion) === -1 && dimensions.indexOf(criterion) === -1 ) {
      return false;
    } else {
      return true;
    }
  }

  toggleCriteriaPreview(selected: string): void {
    this.isCriteriaButtonActive = selected === 'criteria' ? true : false;
    if (selected === 'preview') {
      this.loadChart();
    }
  }

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
        datasets: this.generateDatasets(reportLabels, reportData)
      };

      this.isPreviewResultAvailable = true;

      this.prepareTableData(reportLabels, reportData);
    });
  }

  generateDatasets(chartLabels, chartData) {
    let datasets = [];
    for (let i=0; i < chartData.length; i++) {
      const dataset = {
        data: chartData[i],
        label: this.measures[i].split(".")[1]
      };
      datasets.push(dataset);
    }
    log.info(`dataset >>>`, datasets);
    return datasets;
  }

  addReportToDashboard() {
    const reportToSave: any /*Report*/ = {
      /*criteria: JSON.stringify(this.criteria),
      reportName: this.report.reportName,
      reportType: this.chartType,
      reportDescription: this.report.reportDescription,
      dashboardId: 0, // default dashboard
      borderColor: 'blue',
      backgroundColor: 'red',
      folderId: this.report.folderId,
      userId: this.report.userId,*/
    };

    this.reportService.editReport(this.reportId, reportToSave)
      .pipe()
      .subscribe((res) => {
        log.info(`Report successfully updated >>> `, res);
        /*this.messageService.add({
          severity: 'success',
          summary:'Success',
          detail:'Report successfully added to dashboard'
        });*/
        // this.router.navigate(['home/reports/dashboard']).then(r => {})
      }, (error) => {
        /*this.messageService.add({
          severity: 'error',
          summary:'Error',
          detail:'Report not added to dashboard'
        });*/
      });
  }

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

  showVisualizationList(): void {
    this.shouldShowVisualization = !this.shouldShowVisualization;
  }

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

  prepareTableData(chartLabels, chartData): void {
    const tableHead = [];
    const header = [ ...this.dimensions, ...this.measures ];
    // const tableHeaderColspan = header.length;

    header.forEach(x => {
      const query = x.split(".")[1];
      const headerName = this.criteria.filter(q => q.query === query)[0].queryName;
      tableHead.push(headerName);
    });

    const tableRows = []; //always initialize table to empty array before populating
    log.info(`table head`, tableHead);

    const elementLength = chartLabels[0].length;
    let enhancedChartLabels = [];

    for (let i = 0; i < elementLength; i++) {
      const arr = [];
      chartLabels.forEach((item, j) => {
        arr.push(item[i])
      })
      enhancedChartLabels.push(arr);
    }

    let tableData = [...enhancedChartLabels];
    chartData.forEach(x => tableData.push(x));


    const dataLength = tableData[0].length;

    for (let i = 0; i < dataLength; i++) {
      const rowData = [];
      for (let j = 0; j < tableData.length; j++) {
        rowData.push(tableData[j][i]);
      }
      tableRows.push(rowData);
    }

    const cols = [];
    const rows = []

    tableHead.forEach((el, i) => {
      const field = el.replace(/\s/g, ""); // remove whitespaces from field name
      cols[i] = { field, header: el};
    });

    tableRows.forEach((row, i) => {
      let rowItem = {};
      cols.forEach((col, j) => {

        const fieldValue =
          typeof row[j] === 'number' ? (Math.round(row[j] * 100) / 100).toFixed(2) : row[j];

        rowItem[cols[j].field] = fieldValue;

      });
      rows.push(rowItem);
    });

    this.tableDetails = {
      cols,
      rows,
      globalFilterFields: [],
      showFilter: false,
      showSorting: false,
      showSearch: false,
      title: '',
      paginator: true,
      url: '',
      urlIdentifier: ''
    }

  }

}
