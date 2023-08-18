import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicSetupFormScreenComponent } from 'src/app/shared/components/dynamic-setup-form-screen/dynamic-setup-form-screen.component';
import { DynamicSetupSearchListScreenComponent } from 'src/app/shared/components/dynamic-setup-search-list-screen/dynamic-setup-search-list-screen.component';
import {
  DynamicSetupTableScreenComponent
} from "../../shared/components/dynamic-setup-table-screen/dynamic-setup-table-screen.component";

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
    path: 'setup',
    loadChildren: () => import('./components/setups/setups.module').then(m => m.SetupsModule),
  },
  {
    path: 'dynamic-test',
    component:DynamicSetupFormScreenComponent,
  },
  {
    path: 'dynamic-list',
    component:DynamicSetupSearchListScreenComponent
  },
  {
    path: 'dynamic-setup-table',
    component:DynamicSetupTableScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GisRoutingModule { }
