import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPoliciesComponent } from './components/list-policies/list-policies.component';

const routes: Routes = [
  {
    path: 'list/:id', component:ListPoliciesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
