import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReinsuranceRoutingModule } from './reinsurance-routing.module';
import { ReinsuranceSelectionComponent } from './components/reinsurance-selection/reinsurance-selection.component';
import { SummaryComponent } from './components/summary/summary.component';
import { QuotaShareSummaryComponent } from './components/quota-share-summary/quota-share-summary.component';


@NgModule({
  declarations: [
    ReinsuranceSelectionComponent,
    SummaryComponent,
    QuotaShareSummaryComponent
  ],
  imports: [
    CommonModule,
    ReinsuranceRoutingModule
  ]
})
export class ReinsuranceModule { }
