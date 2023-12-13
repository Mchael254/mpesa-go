import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { EndorsementComponent } from './components/endorsement/endorsement.component';
import { SummaryComponent } from './components/summary/summary.component';

const routes: Routes = [
  {path: 'underwriting', component: UnderwritingComponent},
  {path: 'endorsement', component: EndorsementComponent},
  {path: 'summary', component: SummaryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnderwritingRoutingModule { }
