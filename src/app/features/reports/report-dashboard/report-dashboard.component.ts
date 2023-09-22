import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ReportService} from "../services/report.service";
import {map, take, tap} from "rxjs/operators";
import cubejs from "@cubejs-client/core";
import {AppConfigService} from "../../../core/config/app-config-service";
import {Report} from "../../../shared/data/reports/report";
import {Criteria} from "../../../shared/data/reports/criteria";
import {Logger} from "../../../shared/services";

// const log = new Logger('ReportDashboardComponent');
@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.css']
})
export class ReportDashboardComponent implements OnInit{
  @Input() chartCount: number;
  private userId: number = 0;
  private dashboardId: number = 0;
  public reports$: Observable<Report[]> = new Observable<Report[]>();
  public reports: Report[] = [];
  public visualizationQueries = [];
  public reportVisualizations = [];
  public isPreviewResultAvailable: boolean = false;
  private criteria: Criteria;

  private cubejsApi = cubejs({
    apiUrl: this.appConfig.config.cubejsDefaultUrl
  });

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef,
    private appConfig: AppConfigService,
  ) {}

  /**
   * Initializes the component by getting a list of reports
   * @returns void
   */
  ngOnInit(): void {
    this.getReports();
  }

  /**
   * Gets a list of reports and calls the getVisualizationsQueries() method
   * @returns void
   */
  getReports(): void {
    this.reports$ = this.reportService.getReports()
      .pipe(
        take(1),
        map(reports => reports.filter(report =>
          parseInt(String(report.dashboardId)) === this.dashboardId && report.criteria !== null)
        ),
        tap((reports) => {
          this.reports = reports;
        })
      )
    this.getVisualizationQueries();
  }

  /**
   * Get the visualizations queries from backend to querying the cubeJS API
   * splits the visualization queries into measures and dimensions
   * should add reports to visualizations
   * @returns void
   */
  getVisualizationQueries(): void {
    this.reports$.pipe(
      take(1)
    ).subscribe(queryDetails => {
      this.visualizationQueries = [];
      queryDetails.forEach(queryDetail => {
        const criteria = JSON.parse(String(queryDetail.criteria));
        const dimensionMeasure = this.getDimensionsAndMeasures(criteria);
        const details = {
          ...dimensionMeasure,
          queryDetail,
          limit: 15,
        };
        this.visualizationQueries.push(details);
        this.criteria = criteria;
      });
      this.addReportToVisualizations(this.criteria);
      this.isPreviewResultAvailable = true;
      this.cdr.detectChanges()
    });
  }

  /**
   * Splits the criteria into a list of dimensions and measures
   * @param criteria
   * @returns a list of dimensions & measures
   */
  getDimensionsAndMeasures(criteria) {
    const measures = [];
    const dimensions = [];

    criteria.forEach(criterion => {
      if (criterion.category === 'metrics') {
        measures.push(`${criterion.transaction}.${criterion.query}`);
      } else {
        dimensions.push(`${criterion.transaction}.${criterion.query}`);
      }
    });

    return { measures, dimensions };
  }

  /**
   * Add reports to visualizations by loading the dimesions & measures into the cubeJs API endpoint
   * @returns void
   */
  addReportToVisualizations(criteria) {

    this.visualizationQueries.forEach(visualization => {
      const query = {
        measures: visualization.measures,
        dimensions: visualization.dimensions,
        limit: 10
      }

      this.cubejsApi.load(query).then(resultSet => {
        const reportLabels = resultSet.chartPivot().map((c) => c.xValues);
        const reportData = resultSet.series().map(s => s.series.map(r => r.value));

        const tableDetails = this.reportService.prepareTableData(
          reportLabels, reportData, query.dimensions, query.measures, criteria
        );

        const chartData = {
          labels: reportLabels,
          datasets: this.reportService.generateReportDatasets(reportLabels, reportData, query.measures),
          chartType: visualization.queryDetail.reportType,
        }

        const data = {
          labels: reportLabels,
          datasets: this.reportService.generateReportDatasets(reportLabels, reportData, query.measures),
          reportType: visualization.queryDetail.reportType,
          reportName: visualization.queryDetail.reportName,
          criteria: JSON.parse(visualization.queryDetail.criteria),
          measures: visualization.measures,
          dimensions: visualization.dimensions,
          tableDetails,
          chartData,
        };

        this.reportVisualizations.push(data);
      });

    });
  }

}
