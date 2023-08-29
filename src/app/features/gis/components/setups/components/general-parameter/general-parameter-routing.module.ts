import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SystemParameterComponent} from "./system-parameter/system-parameter.component";

const routes: Routes = [
  { path: 'system-parameters', component: SystemParameterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralParameterRoutingModule { }
