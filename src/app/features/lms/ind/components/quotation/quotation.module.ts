import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuotationListComponent } from '../../../components/quotation-list/quotation-list.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { QuickComponent } from './components/quick/quick.component';
import { QuotationDetailsComponent } from './components/quotation-details/quotation-details.component';
import { QuotationSummaryComponent } from './components/quotation-summary/quotation-summary.component';
import { InsuranceHistoryComponent } from './components/insurance-history/insurance-history.component';
import { LifestyleDetailsComponent } from './components/lifestyle-details/lifestyle-details.component';
import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';
import { BeneficiaryPipe } from '../../../pipe/beneficiary/beneficiary.pipe';
import { RelationTypePipe } from '../../../pipe/relation-type/relation-type.pipe';
import { ProductPipe } from '../../../pipe/product/product.pipe';
import { CoverTypePipe } from '../../../pipe/cover-type/cover-type.pipe';

const components = [
  QuotationListComponent,
  PersonalDetailsComponent,
  QuotationSummaryComponent,
  QuotationDetailsComponent,
  QuickComponent,
  InsuranceHistoryComponent,
  LifestyleDetailsComponent,
  MedicalHistoryComponent,
];
const pipes = [BeneficiaryPipe, RelationTypePipe, ProductPipe, CoverTypePipe];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [CommonModule, QuotationRoutingModule, SharedModule],
})
export class QuotationModule {}
