import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicScreensConfigRoutingModule } from './dynamic-screens-config-routing.module';
import { BaseComponent } from './components/base/base.component';
import {SharedModule} from "../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import { CrmScreensConfigComponent } from './components/crm-screens-config/crm-screens-config.component';
import {DialogModule} from "primeng/dialog";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import { PreviewDynamicSetupTableComponent } from './components/preview-dynamic-setup-table/preview-dynamic-setup-table.component';
import {FormsModule} from "@angular/forms";
import {EntitiesModule} from "../entities/entities.module";


@NgModule({
  declarations: [
    BaseComponent,
    CrmScreensConfigComponent,
    PreviewDynamicSetupTableComponent
  ],
  imports: [
    CommonModule,
    DynamicScreensConfigRoutingModule,
    SharedModule,
    TranslateModule,
    DialogModule,
    NgxIntlTelInputModule,
    FormsModule,
    EntitiesModule
  ]
})
export class DynamicScreensConfigModule { }
