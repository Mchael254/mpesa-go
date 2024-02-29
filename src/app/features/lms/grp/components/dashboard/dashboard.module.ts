import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LandingScreenComponent } from './components/landing-screen/landing-screen.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingDashboardComponent } from './components/landing-dashboard/landing-dashboard.component';


@NgModule({
  declarations: [
    LandingScreenComponent,
    LandingDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
