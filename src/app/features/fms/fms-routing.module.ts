import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChequeAuthorizationComponent} from "./cheque-authorization/cheque-authorization.component";
import { ReceiptComponent } from './components/receipt/receipt.component';
import { ReceiptAuthorizationComponent } from './components/receipt-authorization/receipt-authorization.component';
import { BaseFmsComponent } from './components/base-fms/base-fms.component';
import { ReceiptCaptureComponent } from './components/receipt-capture/receipt-capture.component';
import { ClientSearchComponent } from './components/client-search/client-search.component';
import { ClientAllocationComponent } from './components/client-allocation/client-allocation.component';


const routes: Routes = [
  {
    path:'',
    component:BaseFmsComponent
  },
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
  },
  {
    path:'client',
    component:ClientSearchComponent
  },
  {
    path:'screen1',
    component:ReceiptCaptureComponent
  },
  {
    path:'allocation',
    component:ClientAllocationComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FmsRoutingModule { }
