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

const routes: Routes = [
  {
    path: 'list', component:ListQuotationsComponent
  },
  // {
  //   path: 'quick-quote', component:QuickQuoteDetailsComponent
  // },
  {
    path: 'quick-quote-details', component:QuickQuoteFormComponent
  },
  {
    path: 'cover-type-details', component:CoverTypesDetailsComponent
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
    path:'quotation-details',
    component:QuotationDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
