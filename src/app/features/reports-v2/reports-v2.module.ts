import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsV2RoutingModule } from './reports-v2-routing.module';
import { CreateReportComponent } from './create-report/create-report.component';
import {SharedModule} from "../../shared/shared.module";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {ProgressSpinnerModule} from "primeng/progressspinner";


@NgModule({
  declarations: [
    CreateReportComponent
  ],
  imports: [
    CommonModule,
    ReportsV2RoutingModule,
    SharedModule,
    DropdownModule,
    FormsModule,
    ProgressSpinnerModule
  ]
})
export class ReportsV2Module { }
