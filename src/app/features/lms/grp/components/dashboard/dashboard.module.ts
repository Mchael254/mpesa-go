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
import { AdminPensionListingComponent } from './components/admin-pension-listing/admin-pension-listing.component';
import { AdminClaimsListingComponent } from './components/admin-claims-listing/admin-claims-listing.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminPensionSummaryComponent } from './components/admin-pension-summary/admin-pension-summary.component';


@NgModule({
  declarations: [
    LandingScreenComponent,
    LandingDashboardComponent,
    PolicyDetailsComponent,
    AdminDashboardComponent,
    AdminPolicyListingComponent,
    AdminPolicyDetailsComponent,
    AdminPensionListingComponent,
    AdminClaimsListingComponent,
    AdminPensionSummaryComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DashboardModule { }
