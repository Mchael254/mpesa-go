import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
