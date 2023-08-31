import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScreenCodesComponent } from './screen-codes/screen-codes.component';
import { LiabilityComponent } from './liability/liability.component';
import { WordingsComponent } from './wordings/wordings.component';
import {ListboxModule} from "primeng/listbox";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../../../../../shared/shared.module";


@NgModule({
  declarations: [
    ScreenCodesComponent,
    LiabilityComponent,
    WordingsComponent
  ],
    imports: [
        CommonModule,
        ScheduleRoutingModule,
        ListboxModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        SharedModule
    ]
})
export class ScheduleModule { }
