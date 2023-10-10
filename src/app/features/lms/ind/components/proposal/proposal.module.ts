import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProposalRoutingModule } from './proposal-routing.module';
import { SummaryComponent } from './components/summary/summary.component';
import { PaymentOptionComponent } from './components/payment-option/payment-option.component';


@NgModule({
  declarations: [
    SummaryComponent,
    PaymentOptionComponent
  ],
  imports: [
    CommonModule,
    ProposalRoutingModule
  ]
})
export class ProposalModule { }
