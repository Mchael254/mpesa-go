import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingScreenComponent } from './components/landing-screen/landing-screen.component';
import { LandingDashboardComponent } from './components/landing-dashboard/landing-dashboard.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';

const routes: Routes = [
  { path: 'dashboard', component: LandingScreenComponent }, //admin
  { path: 'dashboard-screen', component: LandingDashboardComponent }, //member
  { path: 'policy-details', component: PolicyDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
