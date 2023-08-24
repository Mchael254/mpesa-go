import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ScreenCodesComponent} from "./screen-codes/screen-codes.component";
import {WordingsComponent} from "./wordings/wordings.component";
import {LiabilityComponent} from "./liability/liability.component";

const routes: Routes = [
  { path: 'screen-codes', component: ScreenCodesComponent },
  { path: 'liability', component: LiabilityComponent },
  { path: 'wordings', component: WordingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
