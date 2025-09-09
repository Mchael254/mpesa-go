import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BaseComponent } from './base.component';

const routes: Routes = [
  {
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
      path: 'entity',
      loadChildren: () => import('../entities/entities.module').then(m => m.EntitiesModule),
    },
    {
      path: 'reports',
      loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule)
    },
    {
      path: 'reportsv2',
      loadChildren: () => import('../reports-v2/reports-v2.module').then(m => m.ReportsV2Module)
    },
    {
      path: 'administration',
      loadChildren: () => import('../administration/administration.module').then(m => m.AdministrationModule)
    },
    {
      path: 'setups',
      loadChildren: () => import('../setups/setups.module').then(m => m.SetupsModule)
    },
    {
      path: 'fms',
      loadChildren: () => import('../fms/fms.module').then(m => m.FmsModule)
    },
    {
      path: 'screens-config',
      loadChildren: () => import('../dynamic-screens-config/dynamic-screens-config.module').then(m => m.DynamicScreensConfigModule),
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseRoutingModule {
}
