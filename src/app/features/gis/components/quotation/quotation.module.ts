import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { ListQuotationsComponent } from './components/list-quotations/list-quotations.component';


@NgModule({
  declarations: [
    ListQuotationsComponent
  ],
  imports: [
    CommonModule,
    QuotationRoutingModule
  ]
})
export class QuotationModule { }
