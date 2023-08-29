import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerilTerritoryRoutingModule } from './peril-territory-routing.module';
import { TerritoryComponent } from './territory/territory.component';
import { PerilComponent } from './peril/peril.component';
import { QuakeZonesComponent } from './quake-zones/quake-zones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    TerritoryComponent,
    PerilComponent,
    QuakeZonesComponent,
  ],
  imports: [
    CommonModule,
    PerilTerritoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PerilTerritoryModule { }
