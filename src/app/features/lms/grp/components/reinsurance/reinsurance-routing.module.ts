import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReinsuranceSelectionComponent } from './components/reinsurance-selection/reinsurance-selection.component';
import { SummaryComponent } from './components/summary/summary.component';
import { QuotaShareSummaryComponent } from './components/quota-share-summary/quota-share-summary.component';

const routes: Routes = [
  { path: 'selection', component: ReinsuranceSelectionComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'quota-summary', component: QuotaShareSummaryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReinsuranceRoutingModule { }
