import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {Chart, ReportV2} from "../../../shared/data/reports/report";
import {ReportServiceV2} from "../services/report.service";
import {take} from "rxjs/operators";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import _default from "chart.js/dist/core/core.interaction";
import dataset = _default.modes.dataset;

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

  public conditions = [];
  public dimensionConditions = [];
  public metricConditions = [];
  public dateConditions = [];
  public conditionsOptionsValue = [];

  public chartType: ChartType | string = "table";
  public displayChartTypes: string[] = [];
  public selectedChartType = { iconClass: 'pi pi-table', name: 'Table'}
  public shouldShowTable: boolean = true;
  public shouldShowVisualization: boolean = false;
  public shouldShowStyles: boolean = false;
  public filterForm: FormGroup;
  public chartTypeForm: FormGroup;
  public selectedFilters = [];
  public criteria: Criteria[];
  public measures: string[] = [];
  public dimensions: string[] = [];
  public chartLabels: string[];
  public chartData: ChartConfiguration<'bar'|'line'|'scatter'|'bubble'|'pie'|'doughnut'|'polarArea'|'radar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public filters =  [];
  private sort =  [];
  private cubejsApi = cubejs({
    apiUrl: this.appConfig.config.cubejsDefaultUrl
  });
  public tableDetails: TableDetail = {};
  public isPreviewResultAvailable: boolean = true;
  public reportNameRec: string;
  public saveReportForm: FormGroup;
  private currentUser;
  public styleType: string = 'table';
  public dashboards: any[] = [];

  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private appConfig: AppConfigService,
    private reportService: ReportService,
    private reportServiceV2: ReportServiceV2,
    private authService: AuthService,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  /**
   * Initializes the component by:
   * 1. fetching the report parameters from session storage
   * 2. initializing criteria, filter, sort & report name from fetched report parameters
   * 3. creating a filterForm
   * 4. creating a saveReportForm
   * 5. loading chart details
   * 6. Fetching details of the current user
   */
  ngOnInit(): void {
    const reportParams = this.sessionStorageService.getItem(`reportParams`)
    this.criteria = reportParams.criteria;
    this.sort = reportParams.sort;
    this.reportNameRec = reportParams.reportNameRec;

    this.fetchFilterConditions();
    this.populateSelectedFilters(reportParams.filters);
    this.createFilterForm();
    this.createSaveReportForm();
    this.createChartTypeForm();
    this.loadChart();
    this.fetchDashboards();

    this.currentUser = this.authService.getCurrentUser();
    this.displayChartTypes.push('table');
  }

  fetchDashboards() {
    this.reportServiceV2.getDashboards()
      .pipe()
      .subscribe({
        next: ((dashboards) => {
          log.info(`dashboards >>>`, dashboards);
          this.dashboards = dashboards;
        }),
        error: (e) => {

        }
      })
  }

  populateSelectedFilters(reportParamFilters) {

    reportParamFilters.forEach(reportParamFilter => {
      const category = reportParamFilter.queryObject.category;
      let operator;

      if (category === 'metrics') {
        operator = this.metricConditions.filter((item) => item.value === reportParamFilter.filter.operator)[0];
      } else if (category !== 'metrics' && category !== 'whenFilters') {
        operator = this.dimensionConditions.filter((item) => item.value === reportParamFilter.filter.operator)[0];
      } else if (category !== 'metrics' && category === 'whenFilters') {
        operator = this.dateConditions.filter((item) => item.value === reportParamFilter.filter.operator)[0];
      }

      const selectedFilter = {
        column: reportParamFilter.queryObject.query,
        operator: operator,
        value: reportParamFilter.filter.values[0]
      };

      this.selectedFilters.push(selectedFilter);
      this.filters.push(reportParamFilter.filter);
    })
  }

  fetchFilterConditions(): void {
    const conditions = this.reportServiceV2.fetchFilterConditions();
    this.dateConditions = conditions.dateConditions;
    this.dimensionConditions = conditions.dimensionConditions;
    this.metricConditions = conditions.metricConditions;
  }

  /**
   * 1. creates saveReportForm
   * 2. patches reportName and destination folder to saveReportForm
   */
  createSaveReportForm(): void {
    this.saveReportForm = this.fb.group({
      reportName: [''],
      dashboard: [''],
      destination: [''],
    });
    this.saveReportForm.patchValue({
      reportName: this.reportNameRec,
      destination: 'M'
    })
  }

  /**
   * creates filter form
   */
  createFilterForm(): void {
    this.filterForm = this.fb.group({
      column: [''],
      operator: [''],
      value: ['']
    });
  }

  /**
   * creates chart type form
   */
  createChartTypeForm(): void {
    this.chartTypeForm = this.fb.group({
      chartType: [''],
      /*table: [''],
      bar: [''],
      line: [''],
      pie: [''],
      doughnut: [''],
      polarArea: [''],
      radar: [''],*/
    });
  }

  /**
   * 1. selects chart to be displayed
   * 2. fetch chart details by calling the loadChart() method
   * @param chartType
   */
  selectChartType(chartType: { iconClass: string; name: ChartType | string }): void {
    log.info(`selected chartType `, chartType);
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

  selectChart(event) {
    const formChartType = event.target.value;
    const selectedChartType = this.chartTypes.filter((item) => item.name === formChartType)[0];

    const isIndexPresent = this.displayChartTypes.indexOf(selectedChartType.name);

    if(isIndexPresent !== -1) {
      this.displayChartTypes.splice(isIndexPresent, 1);
    } else {
      this.displayChartTypes.push(selectedChartType.name);
    }

    this.chartType = this.displayChartTypes[this.displayChartTypes.length-1];
    this.styleType = this.chartType;

    // @ts-ignore
    if (this.chartType === 'table') {
      this.shouldShowTable = true;
    } else {
      this.shouldShowTable = false;
    }
    // this.shouldShowVisualization = false;
    this.loadChart();

  }

  /**
   * toggles visualization visibility to either true or false
   */
  showVisualizationList(): void {
    this.shouldShowVisualization = !this.shouldShowVisualization;
  }

  /**
   * toggles show visualization styles to either true of false
   */
  showStyles(): void {
    this.shouldShowStyles = !this.shouldShowStyles;
  }

  selectStyle(styleType) {
    this.shouldShowStyles = false;
    this.styleType = styleType;
  }

  /**
   * 1. constructs a filter object from form values
   * 2. adds the filter to the list of selected filters
   */
  addFilter(): void {
    const formValues = this.filterForm.getRawValue();

    const operator = (this.conditionsOptionsValue.filter(item => item.value === formValues.operator))[0];
    const selectedFilter = {
      column: formValues.column,
      operator: operator,
      value: formValues.value
    };
    this.selectedFilters.push(selectedFilter);

    const member = this.criteria.filter((item) => item.query === formValues.column)[0];
    const filter = {
      member: `${member.transaction}.${formValues.column}`,
      operator: operator.value,
      values: [formValues.value]
    };
    this.filters.push(filter);

    this.cdr.detectChanges();
    this.filterForm.reset()
  }

  /**
   * removes a filter from the list of selected filters
   * @param filter
   */
  removeFilter(filter): void{
    const filterSelectedIndex = this.selectedFilters.indexOf(filter)
    this.selectedFilters.splice(filterSelectedIndex, 1);

    const member = this.criteria.filter((item) => item.query === filter.column)[0];
    log.info(`member >>>`, member, this.criteria);
    log.info(`this.filter >>>`, member, this.filters);
    this.filters.forEach((filter, index) => {
      const testString = `${member.transaction}.${member.query}`;
      if (filter.member === testString) this.filters.splice(index, 1);
      return;
    });
  }

  /**
   * 1. constructs a query object for cubejs api call
   * 2. fetches report data by calling the cubejs api
   * 3. constructs table details from report data
   */
  loadChart(): void {

    // todo: refactor - remove splitDimensionsAndMeasures
    // if (this.reportId) {
      this.measures = [];
      this.dimensions = [];
      // log.info(`criteria >>> `, this.criteria);
      this.criteria.forEach((queryObject) => {
        this.splitDimensionsAndMeasures(queryObject);
      });
    // }

    this.isPreviewResultAvailable = false;
    const query = {
      measures: this.measures,
      dimensions: this.dimensions,
      filters: this.filters,
      order: this.sort,
      limit: 20
    }
    // log.info(`query for cube >>> `, query);

    this.cubejsApi.load(query).then(resultSet => {
      // this.chartLabels = resultSet.chartPivot().map((c) => c.xValues[0]);
      const chartLabels = resultSet.chartPivot().map((c) => c.xValues[0]);
      const reportLabels = resultSet.chartPivot().map((c) => c.xValues);
      const reportData = resultSet.series().map(s => s.series.map(r => r.value));


      const datasets = this.reportService.generateReportDatasets(reportLabels, reportData, this.measures);
      this.chartData = {
        labels: chartLabels,
        datasets,
      };

      this.isPreviewResultAvailable = true;

      this.tableDetails = this.reportService.prepareTableData(
        reportLabels, reportData, this.dimensions, this.measures, this.criteria
      );
    });
  }


  setChartColors(chartType, chartData) {
    const colorScheme = ['red', 'orange', 'green', 'blue', 'indigo', 'violet'];
    if(chartType === 'bar' || chartType === 'line') {
      chartData.datasets.forEach((dataset, index) => {
        dataset.backgroundColor = colorScheme[index];
        dataset.borderColor = colorScheme[index];
      });
    } else {
      chartData.datasets.forEach((dataset) => {
        dataset.backgroundColor = colorScheme;
        dataset.borderColor = '#fff';
      })
    }
    // log.info(`chartData >>> `, chartData);
    return chartData
  }

  /**
   * splits criteria in to a list of measures and dimensions
   * @param queryObject
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
   * 1. Gets a list of measures & dimensions to save
   * 2. creates a report object for saving
   * 3. saves the report and returns saved report or throw error is saving fails
   */
  saveReport() {
    const formValues = this.saveReportForm.getRawValue();
    const measuresToSave = this.criteria.filter(measure => measure.category === 'metrics');
    const dimensionsToSave = this.criteria.filter(measure => measure.category !== 'metrics');

    let charts: Chart[] = [];

    this.displayChartTypes.forEach((chartType) => {
      const chart: Chart = {
        backgroundColor: "",
        borderColor: "",
        chartReportId: 0,
        colorScheme: 0,
        evenColor: "",
        evenOddAppliesTo: "",
        // id: 0,
        length: 0,
        name: "",
        oddColor: "",
        order: 0,
        type: chartType,
        width: 0
      };
      charts.push(chart)
    })


    const report: ReportV2 = {
      charts,
      createdBy: this.currentUser.id,
      createdDate: "",
      dashboardId: formValues.dashboard,
      dimensions: JSON.stringify(dimensionsToSave),
      filter: JSON.stringify(this.filters),
      folder: formValues.destination,
      // id: 0,
      length: 0,
      measures: JSON.stringify(measuresToSave),
      name: formValues.reportName,
      order: 0,
      width: 0
    }

    log.info(`report to save`, report)

    this.reportServiceV2.createReport(report)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          log.info(`saved report >>>`, res);
          this.globalMessagingService.displaySuccessMessage('success', 'Report successfully saved')
        },
        error: (e) => {
          this.globalMessagingService.displayErrorMessage('error', 'Report not saved')
        }
      });
  }


  /**
   * Go back to report configuration page
   */
  backToCreateReport() {
    this.router.navigate(['/home/reportsv2/create-report'], {queryParams:{fromPreview: true}})
  }

  showConditions(event) {
    this.conditionsOptionsValue = [];
    const query = event.target.value;
    const criterion = this.criteria.filter((item) => item.query === query)[0];

    if (criterion.category === 'metrics') {
      this.conditionsOptionsValue = this.metricConditions;
    } else if (criterion.category !== 'dimensions' && criterion.category !== 'whenFilters') {
      this.conditionsOptionsValue = this.dimensionConditions;
    }

    this.filterForm.patchValue({
      operator: this.conditionsOptionsValue[0].value
    })
  }

}
