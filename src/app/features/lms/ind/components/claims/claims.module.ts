import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsRoutingModule } from './claims-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClaimsInitiationComponent } from './components/claims-initiation/claims-initiation.component';
import { ClaimsInvestigationComponent } from './components/claims-investigation/claims-investigation.component';
import { ClaimsPaymentProcessingComponent } from './components/claims-payment-processing/claims-payment-processing.component';
import { PolicyAndClaimsDetailsComponent } from './components/policy-and-claims-details/policy-and-claims-details.component';


@NgModule({
  declarations: [
    ClaimsInitiationComponent,
    ClaimsInvestigationComponent,
    ClaimsPaymentProcessingComponent,
    PolicyAndClaimsDetailsComponent
  ],
  imports: [
    CommonModule,
    ClaimsRoutingModule,
    SharedModule
  ],
})
export class ClaimsModule { }
