import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimRoutingModule } from './claim-routing.module';
import { ListClaimsComponent } from './components/list-claims/list-claims.component';


@NgModule({
  declarations: [
    ListClaimsComponent
  ],
  imports: [
    CommonModule,
    ClaimRoutingModule
  ]
})
export class ClaimModule { }
