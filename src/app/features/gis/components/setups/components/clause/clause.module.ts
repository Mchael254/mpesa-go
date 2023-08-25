import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClauseRoutingModule } from './clause-routing.module';
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ClauseRoutingModule,
    TableModule,
    DropdownModule
  ]
})
export class ClauseModule { }
