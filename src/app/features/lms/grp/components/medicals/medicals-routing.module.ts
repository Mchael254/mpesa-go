import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyListingComponent } from './components/policy-listing/policy-listing.component';
import { MedicalRequirementsComponent } from './components/medical-requirements/medical-requirements.component';
import { MedicalUploadsDecisionsComponent } from './components/medical-uploads-decisions/medical-uploads-decisions.component';

const routes: Routes = [
  { path: 'policy-listing', component: PolicyListingComponent },
  { path: 'requirements', component: MedicalRequirementsComponent },
  { path: 'uploads', component: MedicalUploadsDecisionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalsRoutingModule { }
