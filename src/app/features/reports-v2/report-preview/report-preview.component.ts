import {Component, OnInit} from '@angular/core';
import {BreadCrumbItem} from "../../../shared/data/common/BreadCrumbItem";
import {ChartType} from "chart.js";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Logger} from "../../../shared/services";
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";
import {Criteria} from "../../../shared/data/reports/criteria";
import cubejs from "@cubejs-client/core";
import {AppConfigService} from "../../../core/config/app-config-service";
import {ChartConfiguration} from "chart.js/dist/types";
import {TableDetail} from "../../../shared/data/table-detail";
import {ReportService} from "../../reports/services/report.service";

const log = new Logger('ReportPreviewComponent')

@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.css']
})
export class ReportPreviewComponent implements OnInit{

  public createReportBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Criteria',
      url: '/reportsv2/create-report'
    },
    {
      label: 'Preview',
      url: '',
    },
  ];

  public chartTypes: {iconClass: string, name: ChartType | string}[] = [
    { iconClass: 'pi pi-table', name: 'table'},
    { iconClass: 'pi pi-chart-bar', name: 'bar'},
    { iconClass: 'pi pi-chart-line', name: 'line'},
    { iconClass: 'pi pi-chart-pie', name: 'pie'},
    { iconClass: 'pi pi-chart-bar', name: 'doughnut'},
    { iconClass: 'pi pi-chart-bar', name: 'polarArea'},
    { iconClass: 'pi pi-chart-bar', name: 'radar'},
  ];

  public conditions = [
    {label: 'Greater than', value: 'greaterThan'},
    {label: 'Greater than or equal', value: 'greaterThanOrEqual'},
    {label: 'Lower than', value: 'lowerThan'},
    {label: 'Lower than or equal', value: 'lowerThanOrEqual'},
    {label: 'Equal', value: 'equal'},
    {label: 'Between', value: 'between'},
  ];

  public chartType: ChartType | string = "table";
  public selectedChartType = { iconClass: 'pi pi-table', name: 'table'}
  public shouldShowTable: boolean = true;
  public shouldShowVisualization: boolean = false;
  public shouldShowStyles: boolean = false;
  public filterForm: FormGroup;
  public selectedFilters = [];
  public criteria: Criteria[];
  public measures: string[] = [];
  public dimensions: string[] = [];
  public chartLabels: string[];
  public chartData: ChartConfiguration<'bar'|'line'|'scatter'|'bubble'|'pie'|'doughnut'|'polarArea'|'radar'>['data'] = {
    labels: [],
    datasets: [],
  };
  private filters =  [];
  private cubejsApi = cubejs({
    apiUrl: this.appConfig.config.cubejsDefaultUrl
  });
  public tableDetails: TableDetail = {};
  public isPreviewResultAvailable: boolean = null;

  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private appConfig: AppConfigService,
    private reportService: ReportService,
  ) {
  }

  ngOnInit(): void {
    this.criteria = this.sessionStorageService.getItem(`criteria`);
    this.createFilterForm();
    this.loadChart();
  }

  createFilterForm(): void {
    this.filterForm = this.fb.group({
      column: [''],
      operator: [''],
      value: ['']
    });
  }

  selectChartType(chartType: { iconClass: string; name: ChartType | string }): void {
    this.chartType = chartType.name;
    this.selectedChartType = chartType
    // @ts-ignore
    if (this.chartType === 'table') {
      this.shouldShowTable = true;
    } else {
      this.shouldShowTable = false;
    }
    this.shouldShowVisualization = false;
    this.loadChart();
  }

  showVisualizationList(): void {
    this.shouldShowVisualization = !this.shouldShowVisualization;
  }

  showStyles(): void {
    this.shouldShowStyles = !this.shouldShowStyles;
  }

  selectStyle(chartType) {
    this.shouldShowStyles = false;
  }

  addFilter(): void {
    const formValues = this.filterForm.getRawValue();
    const operator = (this.conditions.filter(item => item.value === formValues.operator))[0];
    const filter = {
      column: formValues.column,
      operator: operator,
      value: formValues.value
    }
    this.selectedFilters.push(filter)
  }

  removeFilter(filter): void{
    const filterIndex = this.selectedFilters.indexOf(filter)
    this.selectedFilters.splice(filterIndex, 1);
    log.info(`selectedFilters >>> `, this.selectedFilters, filterIndex);
  }

  loadChart(): void {

    // if (this.reportId) {
      this.measures = [];
      this.dimensions = [];
      this.criteria.forEach((queryObject) => {
        this.splitDimensionsAndMeasures(queryObject);
      });
    // }

    this.isPreviewResultAvailable = false;
    const query = {
      measures: this.measures,
      dimensions: this.dimensions,
      filters: this.filters,
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
      console.log(`chart data >>> `, this.chartData)

      this.isPreviewResultAvailable = true;

      this.tableDetails = this.reportService.prepareTableData(
        reportLabels, reportData, this.dimensions, this.measures, this.criteria
      );
    });
  }

  splitDimensionsAndMeasures(queryObject: Criteria): void {
    const criterion = `${queryObject.transaction}.${queryObject.query}`;
    if (queryObject.category === 'metrics') {
      this.measures.push(criterion);
    } else {
      this.dimensions.push(criterion);
    }
  }

}
