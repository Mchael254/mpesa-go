import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShortPeriodRoutingModule } from './short-period-routing.module';
import { StandardShortPeriodRatesComponent } from './standard-short-period-rates/standard-short-period-rates.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StandardShortPeriodRatesComponent
  ],
  imports: [
    CommonModule,
    ShortPeriodRoutingModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule
    

  ]
})
export class ShortPeriodModule { }
