import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationListComponent } from './ind/components/quotation/components/quotation-list/quotation-list.component';

const routes: Routes = [
  {
    path:'quotation',
    children: [
      {path: 'list', component: QuotationListComponent},
    ]
  },


  {
    path: 'ind',
    children:
    [
      {path:'quotation', loadChildren: () => import('./ind/components/quotation/quotation.module').then(m => m.QuotationModule) },
      {path:'policy', loadChildren: () => import('./ind/components/policy/policy.module').then(m => m.PolicyModule) },
      {path:'claim', loadChildren: () => import('./ind/components/claims/claims.module').then(m => m.ClaimsModule) },
    ]
  },

  {
    path: 'grp',
    children: [
      {path:'quotation', loadChildren: () => import('./grp/components/quotation/quotation.module').then(m => m.QuotationModule) },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
