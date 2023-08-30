import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PremiumRateComponent } from './premium-rate/premium-rate.component';

const routes: Routes = [
  {
    path:'premium-rates',
    component:PremiumRateComponent
 },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PremiumRateRoutingModule { }
