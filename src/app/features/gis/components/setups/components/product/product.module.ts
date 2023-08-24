import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeModule} from 'primeng/tree';
import { ButtonModule } from 'primeng/button';

import { ProductRoutingModule } from './product-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDefinitionComponent } from './product-definition/product-definition.component';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ProductDefinitionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule,
    SharedModule,
    ButtonModule,
    TableModule,
    // Ng2SearchPipeModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
