import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportsComponent} from "./reports/reports.component";
import {CreateReportComponent} from "./create-report/create-report.component";
import {ReportDashboardComponent} from "./report-dashboard/report-dashboard.component";

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: 'create-report', component: CreateReportComponent },
  { path: 'dashboard', component: ReportDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
