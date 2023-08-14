import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { ListQuotationsComponent } from './components/list-quotations/list-quotations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    ListQuotationsComponent
  ],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class QuotationModule { }
