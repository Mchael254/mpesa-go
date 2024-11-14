import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { ListPoliciesComponent } from './components/list-policies/list-policies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PolicyProductComponent } from './components/policy-product/policy-product.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TreeModule } from 'primeng/tree';
import { RiskDetailsComponent } from './components/risk-details/risk-details.component';
import { TabViewModule } from 'primeng/tabview';
import { CoinsuaranceDetailsComponent } from './components/coinsuarance-details/coinsuarance-details.component';
import { ImportRisksComponent } from './components/import-risks/import-risks.component';
import { PolicySummaryComponent } from './components/policy-summary/policy-summary.component';
import { PolicySummaryDetailsComponent } from './components/policy-summary-details/policy-summary-details.component';
import { PolicySummaryOtherDetailsComponent } from './components/policy-summary-other-details/policy-summary-other-details.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ClientDdDetailsComponent } from './components/client-dd-details/client-dd-details.component';
import { PolicyClausesDetailsComponent } from './components/policy-clauses-details/policy-clauses-details.component';
import { PolicyLevelPerilsComponent } from './components/policy-level-perils/policy-level-perils.component';
import { PolicyTaxesComponent } from './components/policy-taxes/policy-taxes.component';
import { PolicySubclasessClausesComponent } from './components/policy-subclasess-clauses/policy-subclasess-clauses.component';
import { ExternalClaimsComponent } from './components/external-claims/external-claims.component';
import { ServiceProvidersComponent } from './components/service-providers/service-providers.component';
@NgModule({
  declarations: [
    ListPoliciesComponent,
    UnderwritingComponent,
    PolicyProductComponent,
    RiskDetailsComponent,
    CoinsuaranceDetailsComponent,
    ImportRisksComponent,
    PolicySummaryComponent,
    PolicySummaryDetailsComponent,
    PolicySummaryOtherDetailsComponent,
    ClientDdDetailsComponent,
    PolicyClausesDetailsComponent,
    PolicyLevelPerilsComponent,
    PolicyTaxesComponent,
    PolicySubclasessClausesComponent,
    ExternalClaimsComponent,
    ServiceProvidersComponent,
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    DialogModule,
    InputTextModule,
    MenuModule,
    PanelMenuModule,
    TreeModule,
    TabViewModule,
    InputTextareaModule

  ]
})
export class PolicyModule { }
