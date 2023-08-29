import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralParameterRoutingModule } from './general-parameter-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {SystemParameterComponent} from "./system-parameter/system-parameter.component";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
  declarations: [
    SystemParameterComponent
  ],
  imports: [
    CommonModule,
    GeneralParameterRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class GeneralParameterModule { }
