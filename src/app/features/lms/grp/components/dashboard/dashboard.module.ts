import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LandingScreenComponent } from './components/landing-screen/landing-screen.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingDashboardComponent } from './components/landing-dashboard/landing-dashboard.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminPolicyListingComponent } from './components/admin-policy-listing/admin-policy-listing.component';
import { AdminPolicyDetailsComponent } from './components/admin-policy-details/admin-policy-details.component';


@NgModule({
  declarations: [
    LandingScreenComponent,
    LandingDashboardComponent,
    PolicyDetailsComponent,
    AdminDashboardComponent,
    AdminPolicyListingComponent,
    AdminPolicyDetailsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    OverlayPanelModule,
    ConfirmDialogModule,
  ]
})
export class DashboardModule { }
