import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterestedPartiesComponent } from './interested-parties/interested-parties.component';

const routes: Routes = [
  {
    path:'interested-parties',
    component:InterestedPartiesComponent
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientInsuredRoutingModule { 
 
}
