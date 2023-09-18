import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { QuickComponent } from './components/quick/quick.component';
import { QuotationDetailsComponent } from './components/quotation-details/quotation-details.component';
import { QuotationSummaryComponent } from './components/quotation-summary/quotation-summary.component';
import { InsuranceHistoryComponent } from './components/insurance-history/insurance-history.component';
import { LifestyleDetailsComponent } from './components/lifestyle-details/lifestyle-details.component';
import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';

const routes: Routes = [
  {path: 'list', component: QuotationListComponent},
  {path: 'quick', component:QuickComponent },
  {path: 'client-details', component:PersonalDetailsComponent },
  {path: 'insurance-history', component:InsuranceHistoryComponent },
  {path: 'lifestyle-details', component:LifestyleDetailsComponent },
  {path: 'medical-history', component:MedicalHistoryComponent },
  {path: 'summary', component:QuotationSummaryComponent },
  // { path: 'quotation', loadChildren: () => import('./components/quotation/quick-quote.module').then(m => m.QuickQuoteModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
