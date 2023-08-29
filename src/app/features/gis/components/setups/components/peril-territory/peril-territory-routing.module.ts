import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerritoryComponent } from './territory/territory.component';
import { PerilComponent } from './peril/peril.component';
import { QuakeZonesComponent } from './quake-zones/quake-zones.component';

const routes: Routes = [
  {
    path:'territories',
    component: TerritoryComponent
},
{
  path:'perils',
  component:PerilComponent
},
{
  path:'quake-zones',
  component:QuakeZonesComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerilTerritoryRoutingModule { }
