import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassSubclassRoutingModule } from './class-subclass-routing.module';
import { ClassesSetupWizardComponent } from './classes-setup-wizard/classes-setup-wizard.component';
import { DynamicSetupWizardWelcomeScreenComponent } from 'src/app/shared/components/dynamic-setup-wizard-welcome-screen/dynamic-setup-wizard-welcome-screen.component';

@NgModule({
  declarations: [
    ClassesSetupWizardComponent,
    DynamicSetupWizardWelcomeScreenComponent
  ],
  imports: [
    CommonModule,
    ClassSubclassRoutingModule,
    
  ]
})
export class ClassSubclassModule { }
