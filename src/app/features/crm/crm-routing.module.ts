import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryComponent } from './components/country/country.component';
import { BaseCrmComponent } from './components/base-crm/base-crm.component';
import { OrganizationComponent } from './components/organization/organization.component';
import { DivisionComponent } from './components/division/division.component';
import { RegionComponent } from './components/region/region.component';
import { BranchComponent } from './components/branch/branch.component';
import { UserParametersComponent } from './components/user-parameters/user-parameters.component';

const routes: Routes = [
  {
    path: '',
    component: BaseCrmComponent
  },
  {
    path: 'country',
    component: CountryComponent
  },
  {
    path: 'organization',
    component: OrganizationComponent
  },
  {
    path: 'disivion',
    component: DivisionComponent
  },
  {
    path: 'region',
    component: RegionComponent
  },
  {
    path: 'branch',
    component: BranchComponent
  },
  {
    path: 'user-parameters',
    component: UserParametersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
