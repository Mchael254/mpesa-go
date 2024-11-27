import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChequeAuthorizationComponent} from "./cheque-authorization/cheque-authorization.component";
import { ReceiptComponent } from './components/receipt/receipt.component';
import { ReceiptAuthorizationComponent } from './components/receipt-authorization/receipt-authorization.component';
const routes: Routes = [
  {
    path: 'cheque-authorization',
    component: ChequeAuthorizationComponent
  },
  {
    path:'receipt',
    component: ReceiptComponent
  },
  {
    path:'authorize',
    component:ReceiptAuthorizationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FmsRoutingModule { }
