import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { GisRoutingModule } from './gis-routing.module';
import { ListPoliciesComponent } from './components/policy/components/list-policies/list-policies.component';
import { TaxRatesComponent } from './components/setups/components/tax/tax-rates/tax-rates.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ClausesComponent } from './components/setups/components/clause/clauses/clauses.component';
import {ListboxModule} from "primeng/listbox";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    TaxRatesComponent,
    ClausesComponent
  ],
  imports: [
    CommonModule,
    GisRoutingModule,
    SharedModule,
    TabViewModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    StepsModule,
    TableModule,
    FormsModule,
    ListboxModule,
    SharedModule,


  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class GisModule { }
