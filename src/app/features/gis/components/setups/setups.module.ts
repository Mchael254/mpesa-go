import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupsRoutingModule } from './setups-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SetupsRoutingModule,
    SharedModule
  ]
})
export class SetupsModule { }
