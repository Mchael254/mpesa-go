import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsV2RoutingModule } from './reports-v2-routing.module';
import { CreateReportComponent } from './create-report/create-report.component';
import {SharedModule} from "../../shared/shared.module";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {MegaMenuModule} from "primeng/megamenu";
import { CriteriaPillComponent } from './criteria-pill/criteria-pill.component';
import { ReportsComponent } from './reports/reports.component';
import { CreateDashboardComponent } from './create-dashboard/create-dashboard.component';
import {MenuModule} from "primeng/menu";
import {DragDropModule} from "@angular/cdk/drag-drop";
import { ReportPreviewComponent } from './report-preview/report-preview.component';
import {InputTextModule} from "primeng/inputtext";
import {CriteriaComponent} from "./criteria/criteria.component";
import { ListReportComponent } from './list-report/list-report.component';
import {MultiSelectModule} from "primeng/multiselect";
import { ColorSchemeComponent } from './report-preview/color-scheme/color-scheme.component';

import { ColorPickerModule } from 'primeng/colorpicker';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    CreateReportComponent,
    CriteriaPillComponent,
    ReportsComponent,
    CreateDashboardComponent,
    ReportPreviewComponent,
    CriteriaComponent,
    ListReportComponent,
    ColorSchemeComponent
  ],
  imports: [
    CommonModule,
    ReportsV2RoutingModule,
    SharedModule,
    DropdownModule,
    FormsModule,
    ProgressSpinnerModule,
    MegaMenuModule,
    MenuModule,
    DragDropModule,
    InputTextModule,
    ColorPickerModule,
    CalendarModule,
    MultiSelectModule
  ]
})
export class ReportsV2Module { }
