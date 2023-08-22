import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDefinitionComponent } from './product-definition/product-definition.component';

const routes: Routes = [{
  path:'product-definition', component: ProductDefinitionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
