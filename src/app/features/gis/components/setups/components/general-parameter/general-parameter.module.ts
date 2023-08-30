import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralParameterRoutingModule } from './general-parameter-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {SystemParameterComponent} from "./system-parameter/system-parameter.component";
import {NgxSpinnerModule} from "ngx-spinner";
import { SystemSequencesComponent } from './system-sequences/system-sequences.component';
import { TreeModule } from 'primeng/tree';
import { TableModule } from 'primeng/table';
@NgModule({
  declarations: [
    SystemParameterComponent,
    SystemSequencesComponent
  ],
  imports: [
    CommonModule,
    GeneralParameterRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TreeModule,
    TableModule
  ]
})
export class GeneralParameterModule { }
