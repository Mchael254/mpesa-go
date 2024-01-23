import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { ListQuotationsComponent } from './components/list-quotations/list-quotations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { QuickQuoteDetailsComponent } from './components/quick-quote-details/quick-quote-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuickQuoteFormComponent } from './components/quick-quote-form/quick-quote-form.component';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { QuotationsClientDetailsComponent } from './components/quotations-client-details/quotations-client-details.component';
import { QuotationDetailsComponent } from './components/quotation-details/quotation-details.component';
import { ImportRisksComponent } from './components/import-risks/import-risks.component';
import { QuoteAssigningComponent } from './components/quote-assigning/quote-assigning.component';
import { RiskSectionDetailsComponent } from './components/risk-section-details/risk-section-details.component';
import { QuotationSummaryComponent } from './components/quotation-summary/quotation-summary.component';

import { InputTextModule } from 'primeng/inputtext';
import { CoverTypesDetailsComponent } from './components/cover-types-details/cover-types-details.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component'; 

@NgModule({
  declarations: [
    ListQuotationsComponent,
    QuickQuoteDetailsComponent,
    QuickQuoteFormComponent,
    CoverTypesDetailsComponent,
    QuoteSummaryComponent,
    QuotationsClientDetailsComponent,
    QuotationDetailsComponent,
    ImportRisksComponent,
    QuoteAssigningComponent,
    RiskSectionDetailsComponent,
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
    DialogModule,
    InputTextModule,
    DropdownModule,
    MenuModule,
    PanelMenuModule
  ],
  
})
export class QuotationModule { }
