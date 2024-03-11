import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPoliciesComponent } from './components/list-policies/list-policies.component';
import { NewBusinessComponent } from './components/new-business/new-business.component';

const routes: Routes = [
  {
    path: 'list/:id', component:ListPoliciesComponent
  },
  {
    path: 'new-business', component:NewBusinessComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
