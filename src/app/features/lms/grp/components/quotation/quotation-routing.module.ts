import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickComponent } from './components/quick/quick.component';
import { CoverageDetailsComponent } from './components/coverage-details/coverage-details.component';

const routes: Routes = [
  {path:'quick', component: QuickComponent},
  {path:'coverage', component: CoverageDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
