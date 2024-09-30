import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListClaimsComponent } from './components/list-claims/list-claims.component';
import { ClaimDetailsComponent } from './components/claim-details/claim-details.component';
import { ClaimOpeningComponent } from './components/claim-opening/claim-opening.component';
import { PerilManagementComponent } from './components/peril-management/peril-management.component';
import { ClaimTransactionComponent } from './components/claim-transaction/claim-transaction.component';
const routes: Routes = [
  {
    path: 'list/:id', component:ListClaimsComponent
  },
  {
    path:'claim-details',
    component: ClaimDetailsComponent
  },
  {
    path:'claim-opening',
    component: ClaimOpeningComponent
  },
  {
    path:'claim-opening2',
    component:PerilManagementComponent
  },
  {
    path:'claim-transaction',
    component:ClaimTransactionComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule { }
