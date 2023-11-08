import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedAnalysisRoutingModule } from './need-analysis-routing.module';
import { NeedAnalysisComponent } from './components/need-analysis/need-analysis.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { AnalysisProductListComponent } from './components/analysis-product-list/analysis-product-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductDataComponent } from './components/product-data/product-data.component';


@NgModule({
  declarations: [
    NeedAnalysisComponent,
    QuestionsComponent,
    AnalysisProductListComponent,
    ProductDataComponent
  ],
  imports: [
    CommonModule,
    NeedAnalysisRoutingModule,
    SharedModule
  ]
})
export class NeedAnalysisModule { }
