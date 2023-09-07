import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickQuoteRoutingModule } from './quick-quote-routing.module';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuotationSummaryComponent } from './components/quotation-summary/quotation-summary.component';
import { QuotationDetailsComponent } from './components/quotation-details/quotation-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuickComponent } from './components/quick/quick.component';


@NgModule({
  declarations: [
    PersonalDetailsComponent,
    QuotationSummaryComponent,
    QuotationDetailsComponent,
    QuickComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuickQuoteRoutingModule,
    SharedModule
  ]
})
export class QuickQuoteModule { }
