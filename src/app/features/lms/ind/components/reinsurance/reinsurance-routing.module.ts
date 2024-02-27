import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitiationComponent } from './components/initiation/initiation.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ExcessOfLossCoverageComponent } from './components/excess-of-loss-coverage/excess-of-loss-coverage.component';

const routes: Routes = [
  {
    path: 'initiation',
    component: InitiationComponent
  },
  {
    path: 'excess-of-loss-coverage',
    component: ExcessOfLossCoverageComponent
  },
  {
    path: 'summary',
    component: SummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReinsuranceRoutingModule { }
