import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReinsuranceRoutingModule } from './reinsurance-routing.module';
import { ReinsuranceSelectionComponent } from './components/reinsurance-selection/reinsurance-selection.component';
import { SummaryComponent } from './components/summary/summary.component';
import { QuotaShareSummaryComponent } from './components/quota-share-summary/quota-share-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReinsuranceListingComponent } from './components/reinsurance-listing/reinsurance-listing.component';


@NgModule({
  declarations: [
    ReinsuranceSelectionComponent,
    SummaryComponent,
    QuotaShareSummaryComponent,
    ReinsuranceListingComponent
  ],
  imports: [
    CommonModule,
    ReinsuranceRoutingModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule
  ]
})
export class ReinsuranceModule { }
