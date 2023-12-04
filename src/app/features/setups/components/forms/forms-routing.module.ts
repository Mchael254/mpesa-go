import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { LmsIndividualComponent } from './components/lms-individual/lms-individual.component';
import { LmsGroupComponent } from './components/lms-group/lms-group.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'system',
      //   pathMatch: 'full',
      // },
      {
        path:'lms-individual',
        component:LmsIndividualComponent
      },
      {
        path:'lms-group',
        component:LmsGroupComponent
      },
    ],
  },
];;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
