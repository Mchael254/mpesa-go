import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListClaimsComponent } from './components/list-claims/list-claims.component';

const routes: Routes = [
  {
    path: 'list/:id', component:ListClaimsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule { }
