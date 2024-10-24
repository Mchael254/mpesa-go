import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingScreenComponent } from './components/landing-screen/landing-screen.component';
import { LandingDashboardComponent } from './components/member/landing-dashboard/landing-dashboard.component';
import { PolicyDetailsComponent } from './components/member/policy-details/policy-details.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminPolicyListingComponent } from './components/admin/admin-policy-listing/admin-policy-listing.component';
import { AdminPolicyDetailsComponent } from './components/admin/admin-policy-details/admin-policy-details.component';
import { AdminPensionListingComponent } from './components/admin/admin-pension-listing/admin-pension-listing.component';
import { AdminClaimsListingComponent } from './components/admin/admin-claims-listing/admin-claims-listing.component';
import { AdminPensionSummaryComponent } from './components/admin/admin-pension-summary/admin-pension-summary.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { QuickQuoteComponent } from './components/admin/quick-quote/quick-quote.component';
import { QuoteMenuBarComponent } from './components/admin/quote-menu-bar/quote-menu-bar.component';
import { NormalQuoteInitComponent } from './components/admin/normal-quote-init/normal-quote-init.component';
import { AdminQuoteSummaryComponent } from './components/admin/admin-quote-summary/admin-quote-summary.component';
import { AdminCoverageDetailsComponent } from './components/admin/admin-coverage-details/admin-coverage-details.component';
import { AdminInvestmentDetailsComponent } from './components/admin/admin-investment-details/admin-investment-details.component';
import { AdminCreditLifeSummaryComponent } from './components/admin/admin-credit-life-summary/admin-credit-life-summary.component';
import { AgentDashboardComponent } from './components/agent/components/agent-dashboard/agent-dashboard.component';
import { AgentPoliciesComponent } from './components/agent/components/agent-policies/agent-policies.component';
import { AgentQuotesComponent } from './components/agent/components/agent-quotes/agent-quotes.component';
import { AgentClaimsComponent } from './components/agent/components/agent-claims/agent-claims.component';
import { MyPoliciesComponent } from './components/agent/components/payment/my-policies/my-policies.component';
import { PolicySummaryComponent } from './components/agent/components/payment/policy-summary/policy-summary.component';
import { NewServiceRequestComponent } from './components/common/service-request/new-service-request/new-service-request.component';
import { ServiceRequestsListingComponent } from './components/common/service-request/service-requests-listing/service-requests-listing.component';
import { ServiceRequestDetailsComponent } from './components/common/service-request/service-request-details/service-request-details.component';

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
  { path: 'agent', component: AgentDashboardComponent}, //agent landing dashboard
  { path: 'agent-policies', component: AgentPoliciesComponent}, //agent policies listing
  { path: 'agent-quotes', component: AgentQuotesComponent}, //agent quotes listing
  { path: 'agent-claims', component: AgentClaimsComponent}, //agent claims listing
  { path: 'agent-individual-policies', component: MyPoliciesComponent}, //individal agent  policies listing
  { path: 'policy-summary', component: PolicySummaryComponent}, //individal agent  policies listing
  { path: 'new-service-request', component: NewServiceRequestComponent}, //new service request screen
  { path: 'service-requests-listing', component: ServiceRequestsListingComponent}, //Service requests listing screen
  { path: 'service-request-details', component: ServiceRequestDetailsComponent}, //Service request details summary
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
