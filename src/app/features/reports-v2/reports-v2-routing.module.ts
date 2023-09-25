import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CreateReportComponent} from "./create-report/create-report.component";
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsV2RoutingModule { }
