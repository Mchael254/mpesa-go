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


@NgModule({
  declarations: [
    CreateReportComponent,
    CriteriaPillComponent
  ],
    imports: [
        CommonModule,
        ReportsV2RoutingModule,
        SharedModule,
        DropdownModule,
        FormsModule,
        ProgressSpinnerModule,
        MegaMenuModule
    ]
})
export class ReportsV2Module { }
