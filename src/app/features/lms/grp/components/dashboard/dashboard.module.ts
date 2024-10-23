import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LandingScreenComponent } from './components/landing-screen/landing-screen.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingDashboardComponent } from './components/member/landing-dashboard/landing-dashboard.component';
import { PolicyDetailsComponent } from './components/member/policy-details/policy-details.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminPolicyListingComponent } from './components/admin/admin-policy-listing/admin-policy-listing.component';
import { AdminPolicyDetailsComponent } from './components/admin/admin-policy-details/admin-policy-details.component';
import { AdminPensionListingComponent } from './components/admin/admin-pension-listing/admin-pension-listing.component';
import { AdminClaimsListingComponent } from './components/admin/admin-claims-listing/admin-claims-listing.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ServiceRequestDetailsComponent } from './components/common/service-request/service-request-details/service-request-details.component';
import { ServiceRequestsListingComponent } from './components/common/service-request/service-requests-listing/service-requests-listing.component';


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
    AgentDashboardComponent,
    AgentPoliciesComponent,
    AgentQuotesComponent,
    AgentClaimsComponent,
    MyPoliciesComponent,
    PolicySummaryComponent,
    NewServiceRequestComponent,
    ServiceRequestDetailsComponent,
    ServiceRequestsListingComponent,
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
