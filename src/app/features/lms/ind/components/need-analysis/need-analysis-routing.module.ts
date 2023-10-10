import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeedAnalysisComponent } from './components/need-analysis/need-analysis.component';

const routes: Routes = [
  {path: '', component:NeedAnalysisComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedAnalysisRoutingModule { }
