import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseComponent} from "./components/base/base.component";
import {CrmScreensConfigComponent} from "./components/crm-screens-config/crm-screens-config.component";

const routes: Routes = [
  {
    path: '',
    component: BaseComponent
  },
  {
    path: 'crm-screen-setup',
    component: CrmScreensConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicScreensConfigRoutingModule { }
