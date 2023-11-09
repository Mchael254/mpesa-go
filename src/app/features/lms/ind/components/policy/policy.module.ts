import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { UnderwritingComponent } from './underwriting/underwriting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { ExceptionsComponent } from './exceptions/exceptions.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { MaturitiesComponent } from './maturities/maturities.component';


@NgModule({
  declarations: [
    UnderwritingComponent,
    AccountDetailsComponent,
    ExceptionsComponent,
    ReceiptsComponent,
    MaturitiesComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    SharedModule
  ]
})
export class PolicyModule { }
