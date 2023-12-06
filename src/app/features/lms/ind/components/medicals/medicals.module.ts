import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalsRoutingModule } from './medicals-routing.module';
import { TestsComponent } from './components/tests/tests.component';
import { ResultProcessingComponent } from './components/result-processing/result-processing.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TestsComponent,
    ResultProcessingComponent
  ],
  imports: [
    CommonModule,
    MedicalsRoutingModule,
    SharedModule
  ]
})
export class MedicalsModule { }
