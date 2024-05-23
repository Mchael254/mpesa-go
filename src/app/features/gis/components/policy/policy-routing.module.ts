import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPoliciesComponent } from './components/list-policies/list-policies.component';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { PolicyProductComponent } from './components/policy-product/policy-product.component';
import { RiskDetailsComponent } from './components/risk-details/risk-details.component';
import { CoinsuaranceDetailsComponent } from './components/coinsuarance-details/coinsuarance-details.component';
import { ImportRisksComponent } from './components/import-risks/import-risks.component';

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
  {
    path: 'risk-details', component:RiskDetailsComponent
  }, 
  {
    path: 'coinsuarance-details', component:CoinsuaranceDetailsComponent
  },
  {
    path: 'import-risks', component:ImportRisksComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
