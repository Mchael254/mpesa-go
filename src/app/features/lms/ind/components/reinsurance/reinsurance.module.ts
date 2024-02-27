import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReinsuranceRoutingModule } from './reinsurance-routing.module';
import { InitiationComponent } from './components/initiation/initiation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExcessOfLossCoverageComponent } from './components/excess-of-loss-coverage/excess-of-loss-coverage.component';
import { SummaryComponent } from './components/summary/summary.component';


@NgModule({
  declarations: [
    InitiationComponent,
    ExcessOfLossCoverageComponent,
    SummaryComponent
  ],
  imports: [
    CommonModule,
    ReinsuranceRoutingModule,
    SharedModule
  ]
})
export class ReinsuranceModule { }
