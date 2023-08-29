import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'class-subclass',
    loadChildren: () => import('./components/class-subclass/class-subclass.module').then(m => m.ClassSubclassModule),
  },
  {
    path: 'clause',
    loadChildren: () => import('./components/clause/clause.module').then(m => m.ClauseModule),
  },
  {
    path: 'client-insured',
    loadChildren: () => import('./components/client-insured/client-insured.module').then(m => m.ClientInsuredModule),
  },
  {
    path: 'covertype-setup',
    loadChildren: () => import('./components/covertype-setup/covertype-setup.module').then(m => m.CovertypeSetupModule),
  },
  {
    path: 'general-parameter',
    loadChildren: () => import('./components/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule),
  },
  {
    path: 'peril-territory',
    loadChildren: () => import('./components/peril-territory/peril-territory.module').then(m => m.PerilTerritoryModule),
  },
  {
    path: 'premium-rate',
    loadChildren: () => import('./components/premium-rate/premium-rate.module').then(m => m.PremiumRateModule),
  },
  {
    path: 'product',
    loadChildren: () => import('./components/product/product.module').then(m => m.ProductModule),
  },
  {
    path: 'schedule',
    loadChildren: () => import('./components/schedule/schedule.module').then(m => m.ScheduleModule),
  },
  {
    path: 'short-period',
    loadChildren: () => import('./components/short-period/short-period.module').then(m => m.ShortPeriodModule),
  },
  {
    path: 'tax',
    loadChildren: () => import('./components/tax/tax.module').then(m => m.TaxModule),
  },
  {
    path: 'parameters',
    loadChildren: () => import('./components/general-parameter/general-parameter.module').then(m => m.GeneralParameterModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupsRoutingModule { }
