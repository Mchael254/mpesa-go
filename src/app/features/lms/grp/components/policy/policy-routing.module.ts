import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicySummaryComponent } from './components/policy-summary/policy-summary.component';

const routes: Routes = [
  {path: 'policySummary', component: PolicySummaryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
