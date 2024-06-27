import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimInitiationComponent } from './components/claim-initiation/claim-initiation.component';
import { ClaimAdmissionComponent } from './components/claim-admission/claim-admission.component';
import { ClaimInvestigationComponent } from './components/claim-investigation/claim-investigation.component';
import { PaymentProcessingComponent } from './components/payment-processing/payment-processing.component';

const routes: Routes = [
  { path: 'initiation', component: ClaimInitiationComponent },
  { path: 'admission', component: ClaimAdmissionComponent },
  { path: 'investigation', component: ClaimInvestigationComponent },
  { path: 'payment', component: PaymentProcessingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule { }
