import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimsInitiationComponent } from './components/claims-initiation/claims-initiation.component';
import { ClaimsInvestigationComponent } from './components/claims-investigation/claims-investigation.component';
import { ClaimsPaymentProcessingComponent } from './components/claims-payment-processing/claims-payment-processing.component';
import { PolicyAndClaimsDetailsComponent } from './components/policy-and-claims-details/policy-and-claims-details.component';
import {ClaimsProcessComponent} from "./components/claims-process/claims-process.component";


const routes: Routes = [
  {
    path: '',
    component: ClaimsProcessComponent
  },
  {
    path: 'claims-investigation',
    component: ClaimsInvestigationComponent
  },
  {
    path: 'claims-payment-processing',
    component: ClaimsPaymentProcessingComponent
  },
  {
    path: 'policy-and-claims-details',
    component: PolicyAndClaimsDetailsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule { }
