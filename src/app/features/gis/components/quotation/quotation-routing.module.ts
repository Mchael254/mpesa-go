import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListQuotationsComponent } from './components/list-quotations/list-quotations.component';
import { QuickQuoteFormComponent } from './components/quick-quote-form/quick-quote-form.component';

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
import { QuotationInquiryComponent } from './components/quotation-inquiry/quotation-inquiry.component';
import { QuotationSourcesComponent } from './components/quotation-sources/quotation-sources.component';
import { QuotationManagementComponent } from './components/quotation-management/quotation-management.component';
import { RiskCentreComponent } from './components/risk-centre/risk-centre.component';
import { QuoteReportComponent } from './components/quote-report/quote-report.component';
import { QuoteSummaryComponent } from './components/quoute-summary/quote-summary.component';
import { ShareQuotesComponent } from './components/share-quotes/share-quotes.component';
import { PaymentAdviceComponent } from './components/payment-advice/payment-advice.component';
import { PaymentCheckoutComponent } from './components/payment-checkout/payment-checkout.component';


const routes: Routes = [
  {
    path: 'list', component:ListQuotationsComponent
  },
  {
    path: 'quick-quote', component:QuickQuoteFormComponent
  },
  {
    path: 'cover-type-details', component:CoverTypesComparisonComponent
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
  {
    path:'quotation-sources',component:QuotationSourcesComponent
  },
  {
    path:'quotation-inquiry',component:QuotationInquiryComponent
  },
  {
    path:'quotation-management',component:QuotationManagementComponent
  },
  {
    path:'risk-center',component:RiskCentreComponent
  },
  {
    path:'i',component:QuotationInquiryComponent
  },
  {
    path:'quotation-report',component:QuoteReportComponent
  },
    {
    path:'quote-summary',component:QuoteSummaryComponent
  },
  {
    path:'share-quoute',component:ShareQuotesComponent
  },
  {
    path:'payment-advice',component:PaymentAdviceComponent
  },
  {
    path:'payment-checkout',component:PaymentCheckoutComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
