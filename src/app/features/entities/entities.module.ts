import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntitiesRoutingModule } from './entities-routing.module';
import { NewClientComponent } from './components/client/new-client/new-client.component';
import { ListClientComponent } from './components/client/list-client/list-client.component';
import { NewEntityComponent } from './components/entity/new-entity/new-entity.component';
import { ListEntityComponent } from './components/entity/list-entity/list-entity.component';
import { NewIntermediaryComponent } from './components/intermediary/new-intermediary/new-intermediary.component';
import { ListIntermediaryComponent } from './components/intermediary/list-intermediary/list-intermediary.component';
import { NewServiceProviderComponent } from './components/service-provider/new-service-provider/new-service-provider.component';
import { ListServiceProviderComponent } from './components/service-provider/list-service-provider/list-service-provider.component';
import { NewStaffComponent } from './components/staff/new-staff/new-staff.component';
import { ListStaffComponent } from './components/staff/list-staff/list-staff.component';
import { EditComponent } from './components/edit/edit.component';
import { ViewEntityComponent } from './components/entity/view-entity/view-entity.component';


@NgModule({
  declarations: [
    NewClientComponent,
    ListClientComponent,
    NewEntityComponent,
    ListEntityComponent,
    NewIntermediaryComponent,
    ListIntermediaryComponent,
    NewServiceProviderComponent,
    ListServiceProviderComponent,
    NewStaffComponent,
    ListStaffComponent,
    EditComponent,
    ViewEntityComponent
  ],
  imports: [
    CommonModule,
    EntitiesRoutingModule
  ]
})
export class EntitiesModule { }
