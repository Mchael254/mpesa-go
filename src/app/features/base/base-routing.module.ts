import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BaseComponent } from './base.component';

const routes: Routes = [{
  path: '',
  component: BaseComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
      path: 'lms',
      loadChildren: () => import('../lms/lms.module').then(m => m.LmsModule),
    },
    {
      path: 'gis',
      loadChildren: () => import('../gis/gis.module').then(m => m.GisModule),
    },
    {
      path: 'crm',
      loadChildren: () => import('../crm/crm.module').then(m => m.CrmModule),
    },
    {
      path: 'report',
      loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule),
    },
    {
      path: 'entity',
      loadChildren: () => import('../entities/entities.module').then(m => m.EntitiesModule),
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseRoutingModule {
}
