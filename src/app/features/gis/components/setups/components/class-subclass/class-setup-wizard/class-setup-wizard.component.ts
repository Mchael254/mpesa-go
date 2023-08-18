import { Component } from '@angular/core';
import { setupListItem, setupWizard } from 'src/app/shared/data/common/setup-wizard';

@Component({
  selector: 'app-class-setup-wizard',
  templateUrl: './class-setup-wizard.component.html',
  styleUrls: ['./class-setup-wizard.component.css']
})
export class ClassSetupWizardComponent {
  classesSetupWizard: setupWizard[] = [
    {
      tabTitle: 'Classes and Subclasses',
      url: '/home/dashboard'
    }
  
  ];
  classesListItem: setupListItem[]=[
    {
      listLabel:'Classes Setup',
      listPosition:'1'
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
}
