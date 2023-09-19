import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { QuickComponent } from './components/quick/quick.component';


@NgModule({
  declarations: [
    QuickComponent
  ],
  imports: [
    CommonModule,
    QuotationRoutingModule
  ]
})
export class QuotationModule { }
