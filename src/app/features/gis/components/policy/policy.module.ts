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


@NgModule({
  declarations: [
    ListPoliciesComponent,
    UnderwritingComponent,
    PolicyProductComponent,
    RiskDetailsComponent,
    CoinsuaranceDetailsComponent,
    ImportRisksComponent
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
    TabViewModule

  ]
})
export class PolicyModule { }
