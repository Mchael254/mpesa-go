import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicSetupFormScreenComponent } from 'src/app/shared/components/dynamic-setup-form-screen/dynamic-setup-form-screen.component';

const routes: Routes = [
  {
    path: 'quotation',
    loadChildren: () => import('./components/quotation/quotation.module').then(m => m.QuotationModule),
  },
  {
    path: 'policy',
    loadChildren: () => import('./components/policy/policy.module').then(m => m.PolicyModule),
  },
  {
    path: 'claim',
    loadChildren: () => import('./components/claim/claim.module').then(m => m.ClaimModule),
  },
  {
    path: 'dynamic-test',
    component:DynamicSetupFormScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GisRoutingModule { }
