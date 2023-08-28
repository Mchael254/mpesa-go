import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicSetupFormScreenComponent } from 'src/app/shared/components/dynamic-setup-form-screen/dynamic-setup-form-screen.component';
import { DynamicSetupSearchListScreenComponent } from 'src/app/shared/components/dynamic-setup-search-list-screen/dynamic-setup-search-list-screen.component';
import {DynamicSetupTableScreenComponent} from "../../shared/components/dynamic-setup-table-screen/dynamic-setup-table-screen.component";
import { DynamicTableComponent } from 'src/app/shared/components/dynamic-table/dynamic-table.component';
import { DynamicSetupWizardWelcomeScreenComponent } from 'src/app/shared/components/dynamic-setup-wizard-welcome-screen/dynamic-setup-wizard-welcome-screen.component';
import {ClausesComponent} from "./components/setups/components/clause/clauses/clauses.component";
import {
  SubclassClausesComponent
} from "./components/setups/components/clause/subclass-clauses/subclass-clauses.component";

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
    },{
    path:'classes-subclasses',
    loadChildren: () => import('./components/setups/components/class-subclass/class-subclass.module').then(m => m.ClassSubclassModule),

  },
  {
    path: 'clauses',
    component:ClausesComponent
  },
  {
    path: 'subclass-clauses',
    component:SubclassClausesComponent
  },
  {
    path:'class-subclass',
    loadChildren: () => import('./components/setups/components/class-subclass/class-subclass.module').then(m => m.ClassSubclassModule),
   },
  {
    path:'tax-rate',
    loadChildren:() => import('./components/setups/components/tax/tax.module').then(m => m.TaxModule),
   },
   {
    path:'interested-parties',
    loadChildren:() => import('./components/setups/components/client-insured/client-insured.module').then(m => m.ClientInsuredModule),
   },
   {
    path:'client-remarks',
    loadChildren:() => import('./components/setups/components/client-insured/client-insured.module').then(m => m.ClientInsuredModule),
   },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GisRoutingModule { }
