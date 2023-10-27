import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { UnderwritingComponent } from './underwriting/underwriting.component';


@NgModule({
  declarations: [
    UnderwritingComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule
  ]
})
export class PolicyModule { }
