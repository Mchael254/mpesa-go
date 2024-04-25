import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceRequestComponent } from './components/service-request/service-request.component';

const routes: Routes = [
  { path: 'service-request', component: ServiceRequestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRequestRoutingModule { }
