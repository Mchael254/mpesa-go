import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalsRoutingModule } from './medicals-routing.module';
import { PolicyListingComponent } from './components/policy-listing/policy-listing.component';
import { MedicalRequirementsComponent } from './components/medical-requirements/medical-requirements.component';
import { MedicalUploadsDecisionsComponent } from './components/medical-uploads-decisions/medical-uploads-decisions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PolicyListingComponent,
    MedicalRequirementsComponent,
    MedicalUploadsDecisionsComponent
  ],
  imports: [
    CommonModule,
    MedicalsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule,
    
  ]
})
export class MedicalsModule { }
