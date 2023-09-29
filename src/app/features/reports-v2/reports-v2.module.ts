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


@NgModule({
  declarations: [
    CreateReportComponent,
    CriteriaPillComponent,
    ReportsComponent,
    CriteriaPillComponent,
    CreateDashboardComponent
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
        DragDropModule
    ]
})
export class ReportsV2Module { }
