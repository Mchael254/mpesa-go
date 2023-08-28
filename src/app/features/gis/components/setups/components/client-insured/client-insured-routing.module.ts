import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterestedPartiesComponent } from './interested-parties/interested-parties.component';
import { ClientRemarksComponent } from './client-remarks/client-remarks.component';

const routes: Routes = [
  {
    path:'interested-parties',
    component:InterestedPartiesComponent
 },
 {
  path:'client-remarks',
  component:ClientRemarksComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientInsuredRoutingModule { 
 
}
