import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingScreenComponent } from './components/landing-screen/landing-screen.component';
import { LandingDashboardComponent } from './components/landing-dashboard/landing-dashboard.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: LandingScreenComponent }, //agent
  { path: 'dashboard-screen', component: LandingDashboardComponent }, //scheme-member
  { path: 'policy-details', component: PolicyDetailsComponent}, //scheme-member details
  { path: 'admin', component: AdminDashboardComponent} //scheme-admin
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
