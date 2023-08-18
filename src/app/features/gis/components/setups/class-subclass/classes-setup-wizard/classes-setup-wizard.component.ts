import { Component } from '@angular/core';
import { setupListItem, setupWizard } from 'src/app/shared/data/common/setup-wizard';

@Component({
  selector: 'app-classes-setup-wizard',
  templateUrl: './classes-setup-wizard.component.html',
  styleUrls: ['./classes-setup-wizard.component.css']
})
export class ClassesSetupWizardComponent {
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
