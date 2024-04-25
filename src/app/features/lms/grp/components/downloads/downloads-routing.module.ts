import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberDownloadsComponent } from './components/member-downloads/member-downloads.component';

const routes: Routes = [
  { path: 'member-downloads', component: MemberDownloadsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadsRoutingModule { }
