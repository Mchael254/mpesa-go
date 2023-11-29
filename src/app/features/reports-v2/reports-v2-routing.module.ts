import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CreateReportComponent} from "./create-report/create-report.component";
import { ReportsComponent } from './reports/reports.component';
import {CreateDashboardComponent} from "./create-dashboard/create-dashboard.component";
import {ReportPreviewComponent} from "./report-preview/report-preview.component";
import {ListReportComponent} from "./list-report/list-report.component";
import { ReportManagementComponent } from './report-management/report-management.component';
import { BaseComponent } from './base/base.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
  {
    path: 'main',
    component: ReportsComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'create-report',
    component: CreateReportComponent
  },
  {
    path: 'edit-report/:id',
    component: CreateReportComponent
  },
  {
    path: 'create-dashboard',
    component: CreateDashboardComponent
  },
  {
    path: 'preview',
    component: ReportPreviewComponent
  },
  {
    path: 'preview/:id',
    component: ReportPreviewComponent
  },
  {
    path: 'list-report',
    component: ListReportComponent
  },
  {
    path: 'list-report/:id',
    component: ListReportComponent
  },
  {
    path: 'report-management',
    component: ReportManagementComponent
  },]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsV2RoutingModule { }
