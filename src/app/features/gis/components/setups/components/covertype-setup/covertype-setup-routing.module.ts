import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoverComponent } from './cover/cover.component';
import { SectionComponent } from './section/section.component';

const routes: Routes = [
  {
    path: 'cover', component: CoverComponent
  },
  {
    path: 'section', component: SectionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CovertypeSetupRoutingModule { }
