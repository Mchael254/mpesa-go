import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickComponent } from './components/quick/quick.component';
import { CoverageDetailsComponent } from './components/coverage-details/coverage-details.component';
import { SummaryComponent } from './components/summary/summary.component';

const routes: Routes = [
  {path:'quick', component: QuickComponent},
  {path:'coverage', component: CoverageDetailsComponent},
  {path:'summary', component: SummaryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
