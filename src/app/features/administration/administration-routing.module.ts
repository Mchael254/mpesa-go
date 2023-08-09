import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './components/profile/administration.component';
import {ViewEmployeeComponent} from "./components/staff-performance/view-employee/view-employee.component";
import {
  ViewEmployeeTransactionsComponent
} from "./components/staff-performance/view-employee-transactions/view-employee-transactions.component";

const routes: Routes = [{
  path: '',
  component: AdministrationComponent},

    {
      path: 'view-employee-transactions',
      component: ViewEmployeeTransactionsComponent
    },
    {
      path: 'view-employee-transactions/:username',
      component: ViewEmployeeTransactionsComponent
    },
    {
      path: 'view-employees',
      component: ViewEmployeeComponent
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
