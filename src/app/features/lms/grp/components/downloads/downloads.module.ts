import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadsRoutingModule } from './downloads-routing.module';
import { MemberDownloadsComponent } from './components/member-downloads/member-downloads.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MemberDownloadsComponent
  ],
  imports: [
    CommonModule,
    DownloadsRoutingModule,
    SharedModule
  ]
})
export class DownloadsModule { }
