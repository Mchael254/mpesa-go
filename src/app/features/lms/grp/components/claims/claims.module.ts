import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimsRoutingModule } from './claims-routing.module';
import { ClaimInitiationComponent } from './components/claim-initiation/claim-initiation.component';
import { ClaimAdmissionComponent } from './components/claim-admission/claim-admission.component';
import { ClaimInvestigationComponent } from './components/claim-investigation/claim-investigation.component';
import { PaymentProcessingComponent } from './components/payment-processing/payment-processing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';


@NgModule({
  declarations: [
    ClaimInitiationComponent,
    ClaimAdmissionComponent,
    ClaimInvestigationComponent,
    PaymentProcessingComponent
  ],
  imports: [
    CommonModule,
    ClaimsRoutingModule,
    SharedModule,
    OverlayPanelModule,
    RadioButtonModule
  ]
})
export class ClaimsModule { }
