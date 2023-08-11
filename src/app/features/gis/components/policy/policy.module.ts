import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { ListPoliciesComponent } from './components/list-policies/list-policies.component';


@NgModule({
  declarations: [
    ListPoliciesComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule
  ]
})
export class PolicyModule { }
