import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PremiumRateRoutingModule } from './premium-rate-routing.module';
import { PremiumRateComponent } from './premium-rate/premium-rate.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    PremiumRateComponent
  ],
  imports: [
    CommonModule,
    PremiumRateRoutingModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    NgxSpinnerModule,

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PremiumRateModule { }
