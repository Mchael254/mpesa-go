import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ind',
    children:
    [
      {path:'quotation', loadChildren: () => import('./ind/components/quotation/quotation.module').then(m => m.QuotationModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
