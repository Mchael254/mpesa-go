import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportsComponent} from "./reports/reports.component";
import {CreateReportComponent} from "./create-report/create-report.component";

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: 'create-report', component: CreateReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
