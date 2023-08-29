import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoverComponent } from './cover/cover.component';
import { SectionComponent } from './section/section.component';
import {
  SubClassSectionsAndCoverTypesComponent
} from "./sub-class-sections-and-cover-types-grouped/sub-class-sections-and-cover-types/sub-class-sections-and-cover-types.component";

const routes: Routes = [
  {
    path: 'cover', component: CoverComponent
  },
  {
    path: 'section', component: SectionComponent
  },
  {
    path:'subclasses-sections-and-covertypes',
    component:SubClassSectionsAndCoverTypesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CovertypeSetupRoutingModule { }
