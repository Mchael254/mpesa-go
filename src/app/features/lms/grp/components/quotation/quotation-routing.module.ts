import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickComponent } from './components/quick/quick.component';

const routes: Routes = [
  {path:'quick', component: QuickComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
