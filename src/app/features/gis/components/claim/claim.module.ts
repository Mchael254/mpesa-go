import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimRoutingModule } from './claim-routing.module';
import { ListClaimsComponent } from './components/list-claims/list-claims.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    ListClaimsComponent
  ],
  imports: [
    CommonModule,
    ClaimRoutingModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ClaimModule { }
