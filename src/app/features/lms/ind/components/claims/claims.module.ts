import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsRoutingModule } from './claims-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClaimsInitiationComponent } from './components/claims-initiation/claims-initiation.component';
import { ClaimsInvestigationComponent } from './components/claims-investigation/claims-investigation.component';
import { ClaimsPaymentProcessingComponent } from './components/claims-payment-processing/claims-payment-processing.component';
import { PolicyAndClaimsDetailsComponent } from './components/policy-and-claims-details/policy-and-claims-details.component';
import { ClaimsProcessComponent } from './components/claims-process/claims-process.component';
import { UploadDocumentsComponent } from './components/claims-initiation/upload-documents/upload-documents.component';
import { DeathClaimsComponent } from './components/claims-initiation/death-claims/death-claims.component';
import { ClaimsOptionsComponent } from './components/claims-initiation/claims-options/claims-options.component';
import {LmsModule} from "../../../lms.module";
import { SurrenderClaimsComponent } from './components/claims-initiation/surrender-claims/surrender-claims.component';


@NgModule({
  declarations: [
    ClaimsInitiationComponent,
    ClaimsInvestigationComponent,
    ClaimsPaymentProcessingComponent,
    PolicyAndClaimsDetailsComponent,
    ClaimsProcessComponent,
    UploadDocumentsComponent,
    DeathClaimsComponent,
    ClaimsOptionsComponent,
    SurrenderClaimsComponent,
  ],
  imports: [
    CommonModule,
    ClaimsRoutingModule,
    SharedModule,
  ],
})
export class ClaimsModule { }
