import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPoliciesComponent } from './components/list-policies/list-policies.component';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { PolicyProductComponent } from './components/policy-product/policy-product.component';
import { RiskDetailsComponent } from './components/risk-details/risk-details.component';
import { CoinsuaranceDetailsComponent } from './components/coinsuarance-details/coinsuarance-details.component';
import { ImportRisksComponent } from './components/import-risks/import-risks.component';
import { PolicySummaryComponent } from './components/policy-summary/policy-summary.component';

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
  {
    path: 'policy-summary', component:PolicySummaryComponent
  },
  {
    path:'policy-product/edit/:policyNo', component:PolicyProductComponent
  },
  {
    path: 'risk-details/edit/:policyNo', component:RiskDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
