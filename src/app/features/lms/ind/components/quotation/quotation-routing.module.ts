import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationListComponent } from './components/quotation-list/quotation-list.component';

const routes: Routes = [
  {path: 'list', component: QuotationListComponent},
  { path: 'quick-quote', loadChildren: () => import('./components/quick-quote/quick-quote.module').then(m => m.QuickQuoteModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
