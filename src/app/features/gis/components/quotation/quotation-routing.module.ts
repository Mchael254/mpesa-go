import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListQuotationsComponent } from './components/list-quotations/list-quotations.component';
import { QuickQuoteDetailsComponent } from './components/quick-quote-details/quick-quote-details.component';
import { QuickQuoteFormComponent } from './components/quick-quote-form/quick-quote-form.component';
import { CoverTypesDetailsComponent } from './components/cover-types-details/cover-types-details.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component';
import { QuotationsClientDetailsComponent } from './components/quotations-client-details/quotations-client-details.component';
import { RiskSectionDetailsComponent } from './components/risk-section-details/risk-section-details.component';
import { QuotationDetailsComponent } from './components/quotation-details/quotation-details.component';
import { QuoteAssigningComponent } from './components/quote-assigning/quote-assigning.component';
import { ImportRisksComponent } from './components/import-risks/import-risks.component';
import { QuotationSummaryComponent } from './components/quotation-summary/quotation-summary.component';
import { CoverTypesComparisonComponent } from './components/cover-types-comparison/cover-types-comparison.component';
import { CreateClientComponent } from './components/create-client/create-client.component';
import { ReviseReuseQuotationComponent } from './components/revise-reuse-quotation/revise-reuse-quotation.component';
import { QuotationConversionComponent } from './components/quotation-conversion/quotation-conversion.component';

const routes: Routes = [
  {
    path: 'list', component:ListQuotationsComponent
  },
  // {
  //   path: 'quick-quote', component:QuickQuoteDetailsComponent
  // },
  {
    path: 'quick-quote', component:QuickQuoteFormComponent
  },

  //  {
  //   path: 'cover-type-details', component:CoverTypesDetailsComponent
  // },
  {
    path: 'cover-type-details', component:CoverTypesComparisonComponent
  },
  {
    path: 'quote-summary', component:QuoteSummaryComponent
  },
{
    path:'quotations-client-details',component:QuotationsClientDetailsComponent
  },
  {
    path:'risk-section-details',component:RiskSectionDetailsComponent
  },
  {
    path:'quotation-details',component:QuotationDetailsComponent
  },
  {
    path:'quote-assigning',component:QuoteAssigningComponent
  },
  {
    path:'import-risks',component:ImportRisksComponent
  },
  {
    path:'quotation-summary',component:QuotationSummaryComponent
  },
  {
    path:'create-client',component:CreateClientComponent
  },
  {
    path:'revise-reuse-quote',component:ReviseReuseQuotationComponent
  },
  {
    path:'quotation-conversion',component:QuotationConversionComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
