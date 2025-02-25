import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableDetail } from '../../../../shared/data/table-detail';
import { Profile } from '../../../../shared/data/auth/profile';
import { EntityService } from '../../../entities/services/entity/entity.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ReportServiceV2 } from '../../../reports-v2/services/report.service';
import {Logger, UtilService} from '../../../../shared/services';
import cubejs from '@cubejs-client/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { ReportService } from '../../../reports/services/report.service';
import { ChartConfiguration } from 'chart.js';
import { Criteria } from '../../../../shared/data/reports/criteria';
import {Router} from "@angular/router";

const log = new Logger('DashboardComponent');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  isPolicyDataReady: boolean = false;
  isQuotationDataReady: boolean = false;
  currency: string = '';

  gis_policies: any;
  gis_quotations: any;

  user: Profile;
  chartsData = [];
  report: { name: string; type: string }[] = [];

  private cubejsApi = cubejs({
    apiUrl: this.appConfig.config.cubejsDefaultUrl,
  });

  constructor(
    private entityService: EntityService,
    private appConfig: AppConfigService,
    private globalMessagingService: GlobalMessagingService,
    private authService: AuthService,
    private reportService: ReportService,
    private reportServiceV2: ReportServiceV2,
    private router: Router,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.fetchGisPoliciesByUser(this.user?.userName);
    this.fetchGisQuotationsByUser(this.user?.userName);
    this.getReports();
  }

  /**
   * This methody fetches the GIS Policies for User using username
   * @param user
   */
  fetchGisPoliciesByUser(user: string): void {
    this.entityService.fetchGisPoliciesByUser(user).subscribe({
      next: (data) => {
        this.gis_policies = data._embedded;
        this.currency = this.gis_policies[0]?.currency;
        this.isPolicyDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isPolicyDataReady = true;
      },
    });
  }

  /**
   * This methody fetches the GIS Quotations for User using username
   * @param user
   */
  fetchGisQuotationsByUser(user: string): void {
    this.entityService.fetchGisQuotationsByUser(user).subscribe({
      next: (data) => {
        this.gis_quotations = data?._embedded;
        this.isQuotationDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isQuotationDataReady = true;
      },
    });
  }

  getReports(): void {
    this.reportServiceV2.getReports().subscribe({
      next: (res) => {
        const reports = res.content;

        for (let i = reports.length - 1; i > reports.length - 3; i--) {
          const report = reports[i];
          this.report.push({
            name: report.name,
            type: report.charts[0]?.type ? report.charts[0]?.type : 'bar',
          });

          const measures = JSON.parse(report.measures);
          const dimensions = JSON.parse(report.dimensions);
          const criteria = [...measures, ...dimensions];
          this.loadChart(criteria);
        }
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  loadChart(criteria) {
    const { measures, dimensions } = this.splitDimensionsAndMeasures(criteria);
    const query = {
      measures,
      dimensions,
      limit: 20,
    };

    this.cubejsApi.load(query).then(
      (resultSet) => {
        const chartLabels = resultSet.chartPivot().map((c) => c.xValues[0]);
        const reportLabels = resultSet.chartPivot().map((c) => c.xValues);
        const reportData = resultSet
          .series()
          .map((s) => s.series.map((r) => r.value));

        const datasets = this.reportService.generateReportDatasets(
          reportLabels,
          reportData,
          measures
        );
        const chartData = {
          labels: chartLabels,
          datasets,
        };
        this.chartsData.push(chartData);
        // log.info(`charts data >>> `, this.chartsData);
      },
      (err) => {
        this.globalMessagingService.displayErrorMessage('CubeJS Error', err);
      }
    );
  }

  /**
   * splits criteria in to a list of measures and dimensions
   * @param queryObject
   */
  splitDimensionsAndMeasures(queryObject) {
    let measures = [];
    let dimensions = [];

    queryObject.forEach((item) => {
      const criterion = `${item.transaction}.${item.query}`;
      if (item.category === 'metrics') {
        measures.push(criterion);
      } else {
        dimensions.push(criterion);
      }
    });
    return { measures, dimensions };
  }
  createQuote(type: 'QUICK' | 'NORMAL'){
    let url = '/home/gis/quotation/quick-quote'
    if (type === 'NORMAL'){
      url = '/home/gis/quotation/quotations-client-details'
    }
    this.utilService.clearSessionStorageData()
    this.router.navigate([url]).then(r => {})

  }
}
