import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAnalysisRoutingModule } from './need-analysis-routing.module';
import { SystemComponent } from './components/system/system.component';
import { LmsModuleComponent } from './components/lms-module/lms-module.component';
import { NewBussinessComponent } from './components/new-bussiness/new-bussiness.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DistinctPipe } from '../../pipe/distinct/distinct.pipe';


@NgModule({
  declarations: [
    SystemComponent,
    LmsModuleComponent,
    NewBussinessComponent,
    DistinctPipe
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    NeedAnalysisRoutingModule
  ]
})
export class NeedAnalysisModule { }
