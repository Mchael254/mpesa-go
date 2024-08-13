import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableDetail } from '../../../../shared/data/table-detail';
import {Profile} from "../../../../shared/data/auth/profile";
import {EntityService} from "../../../entities/services/entity/entity.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../../shared/services/auth.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  basicData: any;

  cols = [
    { field: 'policyNumber', header: 'Policy Number' },
    { field: 'type', header: 'Type' },
    { field: 'insured', header: 'Insured' },
    { field: 'status', header: 'Status' },
    { field: 'premium', header: 'Premium' },
  ];

  rows = [
    {
      policyNumber: 'TA823151',
      type: 'Motor',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
    {
      policyNumber: 'TA823152',
      type: 'Travel',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
    {
      policyNumber: 'TA823159',
      type: 'Marine',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
    {
      policyNumber: 'TA823158',
      type: 'Motor',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
    {
      policyNumber: 'TA823150',
      type: 'Motor',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
  ];

  globalFilterFields = ['policyNumber', 'type', 'insured', 'status', 'premium'];

  policyDataTable: TableDetail = {
    cols: this.cols,
    rows: this.rows,
    globalFilterFields: this.globalFilterFields,
    showFilter: false,
    showSorting: false,
    title: 'A list of policies transacted',
    paginator: true,
    url: 'entities',
    urlIdentifier: 'policyNumber',
  };

  cols2 = [
    { field: 'policyNumber', header: 'Policy Number' },
    { field: 'type', header: 'Type' },
    { field: 'insured', header: 'Insured' },
    { field: 'status', header: 'Status' },
    { field: 'premium', header: 'Premium' },
    { field: 'options', header: 'Options' },
  ];

  rows2 = [
    {
      policyNumber: 'TA823151',
      type: 'Motor',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
      options: 'View',
    },
    {
      policyNumber: 'TA823152',
      type: 'Travel',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
      options: 'View',
    },
    {
      policyNumber: 'TA823159',
      type: 'Marine',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
      options: 'View',
    },
    {
      policyNumber: 'TA823158',
      type: 'Motor',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
      options: 'View',
    },
    {
      policyNumber: 'TA823150',
      type: 'Motor',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
      options: 'View',
    },
  ];

  globalFilterFields2 = [
    'policyNumber',
    'type',
    'insured',
    'status',
    'premium',
  ];

  quotationDataTable: TableDetail = {
    cols: this.cols2,
    rows: this.rows2,
    globalFilterFields: this.globalFilterFields2,
    showFilter: false,
    showSorting: false,
    title: 'A list of policies transacted',
    paginator: true,
  };

  isPolicyDataReady: boolean = false;
  isQuotationDataReady: boolean = false;
  currency: string = '';

  gis_policies: any;
  gis_quotations: any;

  user: Profile;

  constructor(
    private entityService: EntityService,
    private globalMessagingService: GlobalMessagingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: 'My Second dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };
    this.user = this.authService.getCurrentUser();
    this.fetchGisPoliciesByUser(this.user?.userName);
    this.fetchGisQuotationsByUser(this.user?.userName);
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
}
