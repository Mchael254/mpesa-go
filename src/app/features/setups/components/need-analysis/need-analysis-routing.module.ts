import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemComponent } from './components/system/system.component';
import { LmsModuleComponent } from './components/lms-module/lms-module.component';
import { NewBussinessComponent } from './components/new-bussiness/new-bussiness.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
  },
  {
    path:'lms-modules',
    component:LmsModuleComponent
  },

  {
    path:'new-bussiness',
    component:NewBussinessComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NeedAnalysisRoutingModule {}
