import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandardShortPeriodRatesComponent } from './standard-short-period-rates/standard-short-period-rates.component';

const routes: Routes = [
  {
    path:'standard-short-period-rates',
    component:StandardShortPeriodRatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortPeriodRoutingModule { }
