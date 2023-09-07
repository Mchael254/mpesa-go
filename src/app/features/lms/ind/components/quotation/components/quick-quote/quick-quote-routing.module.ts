import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { QuotationDetailsComponent } from './components/quotation-details/quotation-details.component';
import { QuotationSummaryComponent } from './components/quotation-summary/quotation-summary.component';
import { QuickComponent } from './components/quick/quick.component';

const routes: Routes = [
  {path: 'quick', component:QuickComponent },
  {path: 'personal-details', component:PersonalDetailsComponent },
  {path: 'quotation-details', component:QuotationDetailsComponent },
  {path: 'quotation-summary', component:QuotationSummaryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickQuoteRoutingModule { }
