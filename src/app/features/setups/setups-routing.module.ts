import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { SystemComponent } from './components/system/system.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        redirectTo: 'system',
        pathMatch: 'full',
      },
      {
        path:'system',
        component:SystemComponent
      },
      {
        path: 'forms',
        loadChildren: () => import('./components/forms/forms.module').then(m => m.FormsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupsRoutingModule {}
