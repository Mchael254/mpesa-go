import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassSubclassRoutingModule } from './class-subclass-routing.module';
import { DynamicSetupWizardWelcomeScreenComponent } from 'src/app/shared/components/dynamic-setup-wizard-welcome-screen/dynamic-setup-wizard-welcome-screen.component';
import { ClassSetupWizardComponent } from './class-setup-wizard/class-setup-wizard.component';

@NgModule({
  declarations: [
    DynamicSetupWizardWelcomeScreenComponent,
    ClassSetupWizardComponent
  ],
  imports: [
    CommonModule,
    ClassSubclassRoutingModule,
    
  ]
})
export class ClassSubclassModule { }
