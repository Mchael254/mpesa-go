import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Class } from 'leaflet';
import { ClassSetupWizardComponent } from './class-setup-wizard/class-setup-wizard.component';
import { ClassesComponent } from './classes/classes.component';
const routes: Routes = [
  {
    path:'setup-wizard',
    component: ClassSetupWizardComponent
  },
  {
    path:'classes',
    component:ClassesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassSubclassRoutingModule { }
