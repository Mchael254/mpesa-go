import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassSubclassRoutingModule } from './class-subclass-routing.module';
import { DynamicSetupWizardWelcomeScreenComponent } from 'src/app/shared/components/dynamic-setup-wizard-welcome-screen/dynamic-setup-wizard-welcome-screen.component';
import { ClassSetupWizardComponent } from './class-setup-wizard/class-setup-wizard.component';
import { ClassesComponent } from './classes/classes.component';
import { SharedModule } from 'src/app/shared/shared.module';
// import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/dynamic-form.component';
@NgModule({
  declarations: [
    // DynamicSetupWizardWelcomeScreenComponent,
    ClassSetupWizardComponent,
    ClassesComponent,
    // DynamicFormComponent
  ],
  imports: [
    CommonModule,
    ClassSubclassRoutingModule,
    SharedModule
  ]
})
export class ClassSubclassModule { }
