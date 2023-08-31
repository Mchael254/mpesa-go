import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SystemParameterComponent} from "./system-parameter/system-parameter.component";
import { SystemSequencesComponent } from './system-sequences/system-sequences.component';

const routes: Routes = [
  { 
    path: 'system-parameters', 
    component: SystemParameterComponent
   },
  {
    path: 'system-sequences', 
    component: SystemSequencesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralParameterRoutingModule { }
