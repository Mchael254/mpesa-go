import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LmsRoutingModule } from './lms-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PolicyListComponent } from './components/policy-list/policy-list.component';
import { CoverTypePipe } from './pipe/cover-type/cover-type.pipe';
import { BaseComponent } from './base/base.component';


@NgModule({
  declarations: [
    PolicyListComponent,
    BaseComponent,


  ],
  imports: [

    CommonModule,
    LmsRoutingModule,
    SharedModule,


  ]
})
export class LmsModule { }
