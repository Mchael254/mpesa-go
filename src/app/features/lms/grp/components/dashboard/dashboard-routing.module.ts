import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingScreenComponent } from './components/landing-screen/landing-screen.component';
import { LandingDashboardComponent } from './components/landing-dashboard/landing-dashboard.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminPolicyListingComponent } from './components/admin-policy-listing/admin-policy-listing.component';
import { AdminPolicyDetailsComponent } from './components/admin-policy-details/admin-policy-details.component';
import { AdminPensionListingComponent } from './components/admin-pension-listing/admin-pension-listing.component';
import { AdminClaimsListingComponent } from './components/admin-claims-listing/admin-claims-listing.component';

const routes: Routes = [
  { path: 'dashboard', component: LandingScreenComponent }, //agent
  { path: 'dashboard-screen', component: LandingDashboardComponent }, //scheme-member
  { path: 'policy-details', component: PolicyDetailsComponent}, //scheme-member details
  { path: 'admin', component: AdminDashboardComponent}, //scheme-admin
  { path: 'admin-policy-listing', component: AdminPolicyListingComponent}, //scheme-admin policy listing
  { path: 'admin-policy-details', component: AdminPolicyDetailsComponent}, //scheme-admin policy details
  { path: 'admin-pension-listing', component: AdminPensionListingComponent}, //scheme-admin pension listing
  { path: 'admin-claims-listing', component: AdminClaimsListingComponent}, //scheme-admin claims listing
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
