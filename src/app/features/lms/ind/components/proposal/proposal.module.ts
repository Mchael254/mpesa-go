import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProposalRoutingModule } from './proposal-routing.module';
import { SummaryComponent } from './components/summary/summary.component';
import { PaymentOptionComponent } from './components/payment-option/payment-option.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SummaryComponent,
    PaymentOptionComponent
  ],
  imports: [
    CommonModule,
    ProposalRoutingModule,
    SharedModule
  ]
})
export class ProposalModule { }
