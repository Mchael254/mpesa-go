import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListQuotationsComponent } from './components/list-quotations/list-quotations.component';

const routes: Routes = [
  {
    path: 'list', component:ListQuotationsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
