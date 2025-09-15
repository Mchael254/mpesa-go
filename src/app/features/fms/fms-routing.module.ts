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
import { PreviewReceiptComponent } from './components/preview-receipt/preview-receipt.component';
import { ReceiptPreviewGuard } from './services/receipt-preview-guard.service';

import { NewBankingProcessComponent } from './components/new-banking-process/new-banking-process.component';
import { BankingDashboardComponent } from './components/banking-dashboard/banking-dashboard.component';


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
  component:ReceiptPreviewComponent,
   canDeactivate: [ReceiptPreviewGuard] 
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
  component:ReceiptPrintPreviewComponent,
  canDeactivate: [ReceiptPreviewGuard] 
  
 },
 {
  path:'preview-receipt',
  component:PreviewReceiptComponent
 },
 {
  path:'banking-dashboard',
  component:BankingDashboardComponent
 },
 {
  path:'new-banking-process',
  component:NewBankingProcessComponent
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
   providers: [ReceiptPreviewGuard]
})
export class FmsRoutingModule { }
