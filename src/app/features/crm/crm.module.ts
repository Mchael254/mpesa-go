import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { CrmRoutingModule } from './crm-routing.module';
import { CountryComponent } from './components/country/country.component';
import { SharedModule } from '../../shared/shared.module';
import { OrganizationComponent } from './components/organization/organization.component';
import { BaseCrmComponent } from './components/base-crm/base-crm.component';
import { DivisionComponent } from './components/division/division.component';
import { RegionComponent } from './components/region/region.component';
import { BranchComponent } from './components/branch/branch.component';


@NgModule({
  declarations: [
    CountryComponent,
    OrganizationComponent,
    BaseCrmComponent,
    DivisionComponent,
    RegionComponent,
    BranchComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    SharedModule,
  ]
})
export class CrmModule { }
