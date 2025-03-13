import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChequeAuthorizationComponent} from "./cheque-authorization/cheque-authorization.component";
import { ReceiptComponent } from './components/receipt/receipt.component';
import { ReceiptAuthorizationComponent } from './components/receipt-authorization/receipt-authorization.component';
import { BaseFmsComponent } from './components/base-fms/base-fms.component';
import { ReceiptCaptureComponent } from './components/receipt-capture/receipt-capture.component';
import { ClientSearchComponent } from './components/client-search/client-search.component';
import { ClientAllocationComponent } from './components/client-allocation/client-allocation.component';
import { ReceiptPreviewComponent } from './components/receipt-preview/receipt-preview.component';
import { PdSlipPreviewComponent } from './components/pd-slip-preview/pd-slip-preview.component';
import { ReceiptManagementComponent } from './components/receipt-management/receipt-management.component';


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
    path:'client-search',
    component:ClientSearchComponent
  },
  {
    path:'receipt-capture',
    component:ReceiptCaptureComponent
  },
  {
    path:'client-allocation',
    component:ClientAllocationComponent
  },
 {
  path:'receipt-preview',
  component:ReceiptPreviewComponent
 },
 {
  path:'slip-preview',
  component:PdSlipPreviewComponent
 },
 {
  path:'receipt-management',
  component:ReceiptManagementComponent
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FmsRoutingModule { }
