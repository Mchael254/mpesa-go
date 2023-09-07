import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';


@NgModule({
  declarations: [
    QuotationListComponent
  ],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    SharedModule
  ]
})
export class QuotationModule { }
