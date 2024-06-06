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
import { AdminPensionSummaryComponent } from './components/admin-pension-summary/admin-pension-summary.component';
import { ProductsComponent } from './components/products/products.component';
import { QuickQuoteComponent } from './components/quick-quote/quick-quote.component';
import { QuoteMenuBarComponent } from './components/quote-menu-bar/quote-menu-bar.component';

const routes: Routes = [
  { path: 'dashboard', component: LandingScreenComponent }, //agent
  { path: 'dashboard-screen', component: LandingDashboardComponent }, //scheme-member
  { path: 'policy-details', component: PolicyDetailsComponent}, //scheme-member details
  { path: 'admin', component: AdminDashboardComponent}, //scheme-admin
  { path: 'admin-policy-listing', component: AdminPolicyListingComponent}, //scheme-admin policy listing
  { path: 'admin-policy-details', component: AdminPolicyDetailsComponent}, //scheme-admin policy details
  { path: 'admin-pension-listing', component: AdminPensionListingComponent}, //scheme-admin pension listing
  { path: 'admin-claims-listing', component: AdminClaimsListingComponent}, //scheme-admin claims listing
  { path: 'admin-pension-summary', component: AdminPensionSummaryComponent}, //scheme-admin pension summary
  { path: 'products', component: ProductsComponent}, //scheme available products
  { path: 'quick-quote', component: QuickQuoteComponent}, //scheme admin quick quote
  { path: 'quote', component: QuoteMenuBarComponent}, //scheme admin quote
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
