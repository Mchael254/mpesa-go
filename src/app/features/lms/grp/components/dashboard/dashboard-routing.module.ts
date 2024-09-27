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
import { NormalQuoteInitComponent } from './components/normal-quote-init/normal-quote-init.component';
import { AdminQuoteSummaryComponent } from './components/admin-quote-summary/admin-quote-summary.component';
import { AdminCoverageDetailsComponent } from './components/admin-coverage-details/admin-coverage-details.component';
import { AdminInvestmentDetailsComponent } from './components/admin-investment-details/admin-investment-details.component';
import { AdminCreditLifeSummaryComponent } from './components/admin-credit-life-summary/admin-credit-life-summary.component';
import { ServiceRequestsDashboardComponent } from './components/admin-service-requests/service-requests-dashboard/service-requests-dashboard.component';
import { ServiceRequestLogsComponent } from './components/admin-service-requests/service-request-logs/service-request-logs.component';
import { ServiceRequestComponent } from './components/admin-service-requests/service-request/service-request.component';
import { MemberServiceRequestComponent } from './components/member-service-requests/member-service-request/member-service-request.component';
import { AgentDashboardComponent } from './components/agent/components/agent-dashboard/agent-dashboard.component';
import { AgentPoliciesComponent } from './components/agent/components/agent-policies/agent-policies.component';
import { AgentQuotesComponent } from './components/agent/components/agent-quotes/agent-quotes.component';
import { AgentClaimsComponent } from './components/agent/components/agent-claims/agent-claims.component';

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
  { path: 'normal-quote', component: NormalQuoteInitComponent}, //scheme admin normal quote initialization
  { path: 'cover-details', component: AdminCoverageDetailsComponent}, //scheme admin coverage details
  { path: 'quote-summary', component: AdminQuoteSummaryComponent}, //scheme admin normal quote summary
  { path: 'investment', component: AdminInvestmentDetailsComponent}, //scheme admin investment product summary
  { path: 'credit-life', component: AdminCreditLifeSummaryComponent}, //scheme admin credit life product summary
  { path: 'service-req-dashboard', component: ServiceRequestsDashboardComponent}, //scheme admin service request listing dashboard
  { path: 'service-req-logs', component: ServiceRequestLogsComponent}, //scheme admin service request logs
  { path: 'service-request', component: ServiceRequestComponent}, //scheme admin service requests
  { path: 'member-service-request', component: MemberServiceRequestComponent}, //scheme member service requests screen
  { path: 'agent', component: AgentDashboardComponent}, //agent landing dashboard
  { path: 'agent-policies', component: AgentPoliciesComponent}, //agent policies listing
  { path: 'agent-quotes', component: AgentQuotesComponent}, //agent quotes listing
  { path: 'agent-claims', component: AgentClaimsComponent}, //agent claims listing
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
