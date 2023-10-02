import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListQuotationsComponent } from './components/list-quotations/list-quotations.component';
import { QuickQuoteDetailsComponent } from './components/quick-quote-details/quick-quote-details.component';
import { QuickQuoteFormComponent } from './components/quick-quote-form/quick-quote-form.component';
import { CoverTypesDetailsComponent } from './components/cover-types-details/cover-types-details.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
