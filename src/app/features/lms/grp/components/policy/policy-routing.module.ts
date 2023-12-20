import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicySummaryComponent } from './components/policy-summary/policy-summary.component';
import { PolicyListingComponent } from './components/policy-listing/policy-listing.component';

const routes: Routes = [
  { path: 'policySummary', component: PolicySummaryComponent },
  { path: 'policyListing', component: PolicyListingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
