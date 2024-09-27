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
    AdminPensionSummaryComponent,
    ProductsComponent,
    QuickQuoteComponent,
    QuoteMenuBarComponent,
    NormalQuoteInitComponent,
    AdminCoverageDetailsComponent,
    AdminQuoteSummaryComponent,
    AdminInvestmentDetailsComponent,
    AdminCreditLifeSummaryComponent,
    ServiceRequestsDashboardComponent,
    ServiceRequestLogsComponent,
    ServiceRequestComponent,
    MemberServiceRequestComponent,
    AgentDashboardComponent,
    AgentPoliciesComponent,
    AgentQuotesComponent,
    AgentClaimsComponent,
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
