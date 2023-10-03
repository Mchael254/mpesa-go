import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from 'primeng/table';

import { CrmRoutingModule } from './crm-routing.module';
import { CountryComponent } from './components/country/country.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    CountryComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    SharedModule,
  ]
})
export class CrmModule { }
