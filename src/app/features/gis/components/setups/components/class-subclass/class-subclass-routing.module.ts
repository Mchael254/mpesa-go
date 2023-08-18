import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesSetupWizardComponent } from './classes-setup-wizard/classes-setup-wizard.component';

const routes: Routes = [
  {
    path:'setup-wizard',
    component:ClassesSetupWizardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassSubclassRoutingModule { }
