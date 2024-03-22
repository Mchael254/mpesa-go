import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FmsRoutingModule } from './fms-routing.module';
import { ChequeAuthorizationComponent } from './cheque-authorization/cheque-authorization.component';
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {NgxSpinnerModule} from "ngx-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ChequeAuthorizationComponent
  ],
  imports: [
    CommonModule,
    FmsRoutingModule,
    DropdownModule,
    TableModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FmsModule { }
