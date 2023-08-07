import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import {SharedModule} from "../../shared/shared.module";
import { CreateReportComponent } from './create-report/create-report.component';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { CriteriaPillComponent } from './criteria-pill/criteria-pill.component';


@NgModule({
  declarations: [
    ReportsComponent,
    CreateReportComponent,
    CriteriaPillComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
  ]
})
export class ReportsModule { }
