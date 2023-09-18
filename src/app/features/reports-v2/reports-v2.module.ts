import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsV2RoutingModule } from './reports-v2-routing.module';
import { CreateReportComponent } from './create-report/create-report.component';


@NgModule({
  declarations: [
    CreateReportComponent
  ],
  imports: [
    CommonModule,
    ReportsV2RoutingModule
  ]
})
export class ReportsV2Module { }
