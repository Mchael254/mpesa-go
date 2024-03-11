import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { ListPoliciesComponent } from './components/list-policies/list-policies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NewBusinessComponent } from './components/new-business/new-business.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListPoliciesComponent,
    NewBusinessComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PolicyModule { }
