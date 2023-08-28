import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDefinitionComponent } from './product-definition/product-definition.component';
import { ProductSetupWizardComponent } from './product-setup-wizard/product-setup-wizard.component';

const routes: Routes = [
  {
    path: 'product-definition', component: ProductDefinitionComponent,
  },
  {
    path: 'product-wizard', component: ProductSetupWizardComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
