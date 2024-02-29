import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingScreenComponent } from './components/landing-screen/landing-screen.component';
import { LandingDashboardComponent } from './components/landing-dashboard/landing-dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: LandingScreenComponent },
  { path: 'dashboard-screen', component: LandingDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
