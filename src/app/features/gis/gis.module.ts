import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GisRoutingModule } from './gis-routing.module';
import { ListPoliciesComponent } from './components/policy/components/list-policies/list-policies.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GisRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,

  ]
})
export class GisModule { }
