import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPoliciesComponent } from './components/list-policies/list-policies.component';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { PolicyProductComponent } from './components/policy-product/policy-product.component';

const routes: Routes = [
  {
    path: 'list/:id', component:ListPoliciesComponent
  },
  {
    path: 'underwriting', component:UnderwritingComponent
  },
  {
    path: 'policy-product', component:PolicyProductComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
