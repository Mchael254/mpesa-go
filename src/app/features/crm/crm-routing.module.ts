import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CountryComponent } from './components/country/country.component';
import { OrganizationComponent } from './components/organization/organization.component';

const routes: Routes = [
  {
    path: 'organization',
    component: OrganizationComponent
  },
  {
    path: 'country',
    component: CountryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
