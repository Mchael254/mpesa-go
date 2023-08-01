import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListEntityComponent} from "./components/entity/list-entity/list-entity.component";
import {NewEntityComponent} from "./components/entity/new-entity/new-entity.component";
import {ListStaffComponent} from "./components/staff/list-staff/list-staff.component";
import {NewStaffComponent} from "./components/staff/new-staff/new-staff.component";
import {ListClientComponent} from "./components/client/list-client/list-client.component";
import {NewClientComponent} from "./components/client/new-client/new-client.component";
import {ListIntermediaryComponent} from "./components/intermediary/list-intermediary/list-intermediary.component";
import {NewIntermediaryComponent} from "./components/intermediary/new-intermediary/new-intermediary.component";
import {
  ListServiceProviderComponent
} from "./components/service-provider/list-service-provider/list-service-provider.component";
import {
  NewServiceProviderComponent
} from "./components/service-provider/new-service-provider/new-service-provider.component";
import {EditComponent} from "./components/edit/edit.component";
import { ViewEntityComponent } from './components/entity/view-entity/view-entity.component';

const routes: Routes = [
    {
      path: '',
      component: ListEntityComponent
    },
    {
      path: 'list',
      component: ListEntityComponent,
    },
    {
      path: 'new',
      component: NewEntityComponent,
    },
    {
      path: 'view/:id',
      component: ViewEntityComponent,
    },
    {
      path: 'staff',
      component: ListStaffComponent,
      children: [
        {
          path: 'list',
          component: ListStaffComponent,
        },
        {
          path: 'new',
          component: NewStaffComponent,
        },
      ],
    },
    {
      path: 'client',
      component: ListClientComponent,
      children: [
        {
          path: 'list',
          component: ListClientComponent,
        },
        {
          path: 'new',
          component: NewClientComponent,
        },
      ],
    },
    {
      path: 'intermediary',
      component: ListIntermediaryComponent,
      children: [
        {
          path: 'list',
          component: ListIntermediaryComponent,
        },
        {
          path: 'new',
          component: NewIntermediaryComponent,
        },
      ],
    },
  {
    path: 'service-provider',
    component: ListServiceProviderComponent,
    children: [
      {
        path: 'list',
        component: ListServiceProviderComponent,
      },
      {
        path: 'new',
        component: NewServiceProviderComponent,
      },
    ],
  },
  {
    path: 'edit',
    component: EditComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesRoutingModule {

}
