import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimRoutingModule } from './claim-routing.module';
import { ListClaimsComponent } from './components/list-claims/list-claims.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ClaimDetailsComponent } from './components/claim-details/claim-details.component';
import { PerilManagementComponent } from './components/peril-management/peril-management.component';
import { ClaimOpeningComponent } from './components/claim-opening/claim-opening.component';
import { StepsModule } from 'primeng/steps';
import {ButtonModule} from 'primeng/button'; 
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog'; 
import {RippleModule} from 'primeng/ripple';
import { AddPerilModalComponent } from './components/add-peril-modal/add-peril-modal.component';
import { ClaimTransactionComponent } from './components/claim-transaction/claim-transaction.component';
import { ClaimantManagementComponent } from './components/claimant-management/claimant-management.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ClaimEnquiryComponent } from './components/claim-enquiry/claim-enquiry.component';
import { LettersAndMemosComponent } from './components/letters-and-memos/letters-and-memos.component';
import { ClaimBookingComponent } from './components/claim-booking/claim-booking.component';
import { ClaimantDetailsComponent } from './components/claimant-details/claimant-details.component';
import { ClaimRevisionsComponent } from './components/claim-revisions/claim-revisions.component';
import { DocumentManagementComponent } from './components/document-management/document-management.component';
import { RequiredDocumentsComponent } from './components/required-documents/required-documents.component';
import { CourtCaseManagementComponent } from './components/court-case-management/court-case-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionsComponent } from './components/transactions/transactions.component'; 
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewTransactionComponent } from './components/view-transaction/view-transaction.component';
import { RevisionSummaryComponent } from './components/revision-summary/revision-summary.component';


@NgModule({
  declarations: [
    ListClaimsComponent,
    ClaimDetailsComponent,
    PerilManagementComponent,
    ClaimOpeningComponent,
    AddPerilModalComponent,
    ClaimTransactionComponent,
    ClaimantManagementComponent,
    ClaimEnquiryComponent,
    LettersAndMemosComponent,
    ClaimBookingComponent,
    ClaimantDetailsComponent,
    ClaimRevisionsComponent,
    DocumentManagementComponent,
    RequiredDocumentsComponent,
    CourtCaseManagementComponent,
    TransactionsComponent,
    ViewTransactionComponent,
    RevisionSummaryComponent
  ],
  imports: [
    CommonModule,
    ClaimRoutingModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    TableModule,
    DialogModule,
    RippleModule,
    ConfirmDialogModule,
    TranslateModule,
    SharedModule
    // StepsModule
  ]
})
export class ClaimModule { }
