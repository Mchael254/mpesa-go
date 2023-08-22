import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportsComponent} from "./reports/reports.component";
import {CreateReportComponent} from "./create-report/create-report.component";
import {ReportDashboardComponent} from "./report-dashboard/report-dashboard.component";
import {MyReportsComponent} from "./my-reports/my-reports.component";

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: 'create-report', component: CreateReportComponent },
  { path: 'edit-report', component: CreateReportComponent },
  { path: 'dashboard', component: ReportDashboardComponent },
  { path: 'my-reports', component: MyReportsComponent },
  { path: 'shared-reports', component: MyReportsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
