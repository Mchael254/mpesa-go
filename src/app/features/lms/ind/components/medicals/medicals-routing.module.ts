import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestsComponent } from './components/tests/tests.component';
import { ResultProcessingComponent } from './components/result-processing/result-processing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'test',
    pathMatch: 'full',
  },
  {
    path: 'test',
    component: TestsComponent
  },
  {
    path: 'result-processing',
    component: ResultProcessingComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalsRoutingModule { }
