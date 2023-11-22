import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListQuotationsComponent } from './components/list-quotations/list-quotations.component';
import { QuickQuoteDetailsComponent } from './components/quick-quote-details/quick-quote-details.component';
import { QuickQuoteFormComponent } from './components/quick-quote-form/quick-quote-form.component';

const routes: Routes = [
  {
    path: 'list', component:ListQuotationsComponent
  },
  {
    path: 'quick-quote', component:QuickQuoteDetailsComponent
  },
  {
    path: 'quick-quote-details', component:QuickQuoteDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
