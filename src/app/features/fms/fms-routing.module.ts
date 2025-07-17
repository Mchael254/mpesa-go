import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChequeAuthorizationComponent} from "./cheque-authorization/cheque-authorization.component";

import { ReceiptAuthorizationComponent } from './components/receipt-authorization/receipt-authorization.component';
import { BaseFmsComponent } from './components/base-fms/base-fms.component';
import { ReceiptCaptureComponent } from './components/receipt-capture/receipt-capture.component';
import { ClientSearchComponent } from './components/client-search/client-search.component';
import { ClientAllocationComponent } from './components/client-allocation/client-allocation.component';
import { ReceiptPreviewComponent } from './components/receipt-preview/receipt-preview.component';
import { PdSlipPreviewComponent } from './components/pd-slip-preview/pd-slip-preview.component';
import { ReceiptManagementComponent } from './components/receipt-management/receipt-management.component';
import { ReceiptPrintPreviewComponent } from './components/receipt-print-preview/receipt-print-preview.component';


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
 },
 {
  path:'receipt-print-preview',
  component:ReceiptPrintPreviewComponent
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FmsRoutingModule { }
