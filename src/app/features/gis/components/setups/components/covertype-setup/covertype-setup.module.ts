import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListboxModule} from "primeng/listbox";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import {NgxSpinnerModule} from "ngx-spinner";

import { CovertypeSetupRoutingModule } from './covertype-setup-routing.module';
import { CoverComponent } from './cover/cover.component';
import { SectionComponent } from './section/section.component';


@NgModule({
  declarations: [
    CoverComponent,
    SectionComponent
  ],
  imports: [
    CommonModule,
    CovertypeSetupRoutingModule,
    NgxSpinnerModule,
    ListboxModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CovertypeSetupModule { }
