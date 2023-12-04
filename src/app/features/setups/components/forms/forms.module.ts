import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { BaseComponent } from './base/base.component';
import { GisComponent } from './components/gis/gis.component';
import { LmsIndividualComponent } from './components/lms-individual/lms-individual.component';
import { LmsGroupComponent } from './components/lms-group/lms-group.component';


@NgModule({
  declarations: [
    BaseComponent,
    GisComponent,
    LmsIndividualComponent,
    LmsGroupComponent
  ],
  imports: [
    CommonModule,
    FormsRoutingModule
  ]
})
export class FormsModule { }
