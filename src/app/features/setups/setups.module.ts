import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupsRoutingModule } from './setups-routing.module';
import { BaseComponent } from './base/base.component';
import { SystemComponent } from './components/system/system.component';
import { DistinctPipe } from './pipe/distinct/distinct.pipe';


@NgModule({
  declarations: [
    BaseComponent,
    SystemComponent,
  ],
  imports: [
    CommonModule,
    SetupsRoutingModule
  ]
})
export class SetupsModule { }
