import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LmsRoutingModule } from './lms-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PolicyListComponent } from './components/policy-list/policy-list.component';
import { BaseComponent } from './base/base.component';
import { EndorsementTypePipe } from './pipe/endorsement-type/endorsement-type.pipe';

@NgModule({
    declarations: [
        PolicyListComponent,
        BaseComponent,
        EndorsementTypePipe,
    ],
  exports: [
  ],
    imports: [
        CommonModule,
        LmsRoutingModule,
        SharedModule,


    ]
})
export class LmsModule { }
