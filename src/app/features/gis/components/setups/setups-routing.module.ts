import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'class-subclass',
    loadChildren: () => import('./class-subclass/class-subclass.module').then(m => m.ClassSubclassModule),
  },
  {
    path: 'clause',
    loadChildren: () => import('./clause/clause.module').then(m => m.ClauseModule),
  },
  {
    path: 'client-insured',
    loadChildren: () => import('./client-insured/client-insured.module').then(m => m.ClientInsuredModule),
  },
  {
    path: 'covertype-setup',
    loadChildren: () => import('./covertype-setup/covertype-setup.module').then(m => m.CovertypeSetupModule),
  },
  {
    path: 'general-parameter',
    loadChildren: () => import('./general-parameter/general-parameter.module').then(m => m.GeneralParameterModule),
  },
  {
    path: 'peril-territory',
    loadChildren: () => import('./peril-territory/peril-territory.module').then(m => m.PerilTerritoryModule),
  },
  {
    path: 'premium-rate',
    loadChildren: () => import('./premium-rate/premium-rate.module').then(m => m.PremiumRateModule),
  },
  {
    path: 'product',
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
  },
  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule),
  },
  {
    path: 'short-period',
    loadChildren: () => import('./short-period/short-period.module').then(m => m.ShortPeriodModule),
  },
  {
    path: 'tax',
    loadChildren: () => import('./tax/tax.module').then(m => m.TaxModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupsRoutingModule { }
