import { Component } from '@angular/core';
import { setupListItem, setupWizard } from 'src/app/shared/data/common/setup-wizard';
import { DynamicFormFields } from 'src/app/shared/utils/dynamic.form.fields';

@Component({
  selector: 'app-class-setup-wizard',
  templateUrl: './class-setup-wizard.component.html',
  styleUrls: ['./class-setup-wizard.component.css']
})
export class ClassSetupWizardComponent {
  wizardConfig: setupWizard[] = [
    {
      tabTitle: 'Classes and Subclasses',
      url: '/home/gis/setup/class-subclass/classes'
    }
  
  ];
  classesListItem: setupListItem[]=[
    {
      listLabel:'Classes Setup',
      listPosition:'1',
      formName:'classForm'

    },
    {
      listLabel:'Subclass Setup',
      listPosition:'2'
    },
    {
      listLabel:'Class Perils',
      listPosition:'3'
    },
    {
      listLabel:'Class Excesses',
      listPosition:'4'
    }
  ]
  formContent: DynamicFormFields[]=[
    { name: 'classCode',
      label: 'code',
      type:'text',
      required: true,
      disabled:false,
      placeholder:'Enter Class Code',
      pattern:null,
      value:null,
      options:null
    }
  ]
}
