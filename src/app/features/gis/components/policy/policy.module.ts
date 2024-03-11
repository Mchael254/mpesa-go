import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { ListPoliciesComponent } from './components/list-policies/list-policies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PolicyProductComponent } from './components/policy-product/policy-product.component';


@NgModule({
  declarations: [
    ListPoliciesComponent,
    UnderwritingComponent,
    PolicyProductComponent
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
