import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './components/profile/administration.component';
import { ViewEmployeeComponent } from './components/staff-performance/view-employee/view-employee.component';
import {TableModule} from "primeng/table";
import { ViewEmployeeTransactionsComponent } from './components/staff-performance/view-employee-transactions/view-employee-transactions.component';
import { ViewTicketsComponent } from './components/tickets/view-tickets/view-tickets.component';
import { RiskDetailsComponent } from './components/tickets/ticket-details/risk-details/risk-details.component';
import { TaxDetailsComponent } from './components/tickets/ticket-details/tax-details/tax-details.component';
import {SharedModule} from "../../shared/shared.module";
import { TicketDetailsComponent } from './components/tickets/ticket-details/ticket-details.component';
import {EntitiesModule} from "../entities/entities.module";
import { ReassignTicketModalComponent } from './components/tickets/reassign-ticket-modal/reassign-ticket-modal.component';
import {TabViewModule} from "primeng/tabview";
import { TicketReportsComponent } from './components/tickets/ticket-details/ticket-reports/ticket-reports.component';
import { TicketDocumentsComponent } from './components/tickets/ticket-details/ticket-documents/ticket-documents.component';
import {DialogModule} from "primeng/dialog";


@NgModule({
  declarations: [
    AdministrationComponent,
    ViewEmployeeComponent,
    ViewEmployeeTransactionsComponent,
    ViewTicketsComponent,
    RiskDetailsComponent,
    TaxDetailsComponent,
    TicketDetailsComponent,
    ReassignTicketModalComponent,
    TicketReportsComponent,
    TicketDocumentsComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    SharedModule,
    TableModule,
    EntitiesModule,
    TabViewModule,
    DialogModule
  ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AdministrationModule { }
