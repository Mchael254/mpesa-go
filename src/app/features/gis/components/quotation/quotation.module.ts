import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { ListQuotationsComponent } from './components/list-quotations/list-quotations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { QuickQuoteDetailsComponent } from './components/quick-quote-details/quick-quote-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuickQuoteFormComponent } from './components/quick-quote-form/quick-quote-form.component';
import { CoverTypesDetailsComponent } from './components/cover-types-details/cover-types-details.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component';
import { QuotationsClientDetailsComponent } from './components/quotations-client-details/quotations-client-details.component';
import { RiskSectionDetailsComponent } from './components/risk-section-details/risk-section-details.component';
import { QuotationDetailsComponent } from './components/quotation-details/quotation-details.component';
import { NormalQuoteComponent } from './components/normal-quote/normal-quote.component';
import { QuoteAssigningComponent } from './components/quote-assigning/quote-assigning.component';
import { ImportRisksComponent } from './components/import-risks/import-risks.component';
import { CalendarModule } from 'primeng/calendar';
import { QuotationSummaryComponent } from './components/quotation-summary/quotation-summary.component';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    ListQuotationsComponent,
    QuickQuoteDetailsComponent,
    QuickQuoteFormComponent,
    CoverTypesDetailsComponent,
    QuoteSummaryComponent,
    QuotationsClientDetailsComponent,
    RiskSectionDetailsComponent,
    QuotationDetailsComponent,
    NormalQuoteComponent,
    QuoteAssigningComponent,
    ImportRisksComponent,
    QuotationSummaryComponent
  ],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CalendarModule,
    DialogModule
  ]
})
export class QuotationModule { }
