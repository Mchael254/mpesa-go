import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxRoutingModule } from './tax-routing.module';
import { DynamicBreadcrumbComponent } from 'src/app/shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component';


@NgModule({
  declarations: [
    // DynamicBreadcrumbComponent
  ],
  imports: [
    CommonModule,
    TaxRoutingModule,
  ]
})
export class TaxModule { }
