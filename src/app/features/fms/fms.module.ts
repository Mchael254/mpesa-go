import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FmsRoutingModule } from './fms-routing.module';
import { ChequeAuthorizationComponent } from './cheque-authorization/cheque-authorization.component';
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {NgxSpinnerModule} from "ngx-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../shared/shared.module";
import { ReceiptComponent } from './components/receipt/receipt.component';
import { ReceiptAuthorizationComponent } from './components/receipt-authorization/receipt-authorization.component';
import { BaseFmsComponent } from './components/base-fms/base-fms.component';
import { ReceiptCaptureComponent } from './components/receipt-capture/receipt-capture.component';
import { ClientSearchComponent } from './components/client-search/client-search.component';
import { ClientAllocationComponent } from './components/client-allocation/client-allocation.component';
import { ReceiptPreviewComponent } from './components/receipt-preview/receipt-preview.component';
import { PdSlipPreviewComponent } from './components/pd-slip-preview/pd-slip-preview.component';
import { ReceiptManagementComponent } from './components/receipt-management/receipt-management.component';
import { DynamicBreadcrumbComponent } from 'src/app/shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component';





@NgModule({
  declarations: [
    ChequeAuthorizationComponent,
    ReceiptComponent,
    ReceiptAuthorizationComponent,
    BaseFmsComponent,
   
    ReceiptCaptureComponent,
    ClientSearchComponent,
    ClientAllocationComponent,
    ReceiptPreviewComponent,
    PdSlipPreviewComponent,
    ReceiptManagementComponent
    
   
  ],
    imports: [
        CommonModule,
        FmsRoutingModule,
        DropdownModule,
        TableModule,
        NgxSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        SharedModule,
        
    ]
})
export class FmsModule { }
