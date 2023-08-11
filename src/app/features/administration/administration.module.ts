import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './components/profile/administration.component';
import { ViewEmployeeComponent } from './components/staff-performance/view-employee/view-employee.component';
import {TableModule} from "primeng/table";
import { ViewEmployeeTransactionsComponent } from './components/staff-performance/view-employee-transactions/view-employee-transactions.component';
import { ViewTicketsComponent } from './components/tickets/view-tickets/view-tickets.component';
import { RiskDetailsComponent } from './components/tickets/view-tickets/risk-details/risk-details.component';
import { TaxDetailsComponent } from './components/tickets/view-tickets/tax-details/tax-details.component';
import {SharedModule} from "../../shared/shared.module";
import { TicketDetailsComponent } from './components/tickets/ticket-details/ticket-details.component';


@NgModule({
  declarations: [
    AdministrationComponent,
    ViewEmployeeComponent,
    ViewEmployeeTransactionsComponent,
    ViewTicketsComponent,
    RiskDetailsComponent,
    TaxDetailsComponent,
    TicketDetailsComponent
  ],
    imports: [
        CommonModule,
        AdministrationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        SharedModule,
        TableModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AdministrationModule { }
