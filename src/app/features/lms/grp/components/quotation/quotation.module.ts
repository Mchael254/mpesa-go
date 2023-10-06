import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { QuickComponent } from './components/quick/quick.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CoverageDetailsComponent } from './components/coverage-details/coverage-details.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    QuickComponent,
    CoverageDetailsComponent
  ],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    TableModule
  ]
})
export class QuotationModule { }
