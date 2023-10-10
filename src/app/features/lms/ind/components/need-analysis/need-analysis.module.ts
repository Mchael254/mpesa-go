import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAnalysisRoutingModule } from './need-analysis-routing.module';
import { NeedAnalysisComponent } from './components/need-analysis/need-analysis.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { AnalysisProductListComponent } from './components/analysis-product-list/analysis-product-list.component';


@NgModule({
  declarations: [
    NeedAnalysisComponent,
    QuestionsComponent,
    AnalysisProductListComponent
  ],
  imports: [
    CommonModule,
    NeedAnalysisRoutingModule
  ]
})
export class NeedAnalysisModule { }
