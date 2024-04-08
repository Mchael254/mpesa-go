import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {ViewEmployeeComponent} from "./components/staff-performance/view-employee/view-employee.component";
import {
  ViewEmployeeTransactionsComponent
} from "./components/staff-performance/view-employee-transactions/view-employee-transactions.component";
import {ViewTicketsComponent} from "./components/tickets/view-tickets/view-tickets.component";
import { TicketDetailsComponent } from './components/tickets/ticket-details/ticket-details.component';
import {
  MassDocumentDispatchComponent
} from "./components/tickets/mass-document-dispatch/mass-document-dispatch.component";

const routes: Routes = [
    {
      path: '',
      component: UserProfileComponent
    },
    {
      path: 'employee/transactions',
      component: ViewEmployeeTransactionsComponent
    },
    {
      path: 'employee/transactions/:username',
      component: ViewEmployeeTransactionsComponent
    },
    {
      path: 'employees',
      component: ViewEmployeeComponent
    },
    {
      path: 'tickets',
      component: ViewTicketsComponent
    },
    {
      path: 'ticket/details/:id',
      component: TicketDetailsComponent
    },
    {
      path: 'ticket/details',
      component: TicketDetailsComponent
    },
  {
    path: 'document-dispatch',
    component: MassDocumentDispatchComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
