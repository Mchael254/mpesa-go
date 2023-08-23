import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { setupListItem, setupWizard } from '../../data/common/setup-wizard';
import { DynamicFormFields } from '../../utils/dynamic.form.fields';
import { DynamicFormButtons } from '../../utils/dynamic.form.button';

@Component({
  selector: 'app-dynamic-setup-wizard-welcome-screen',
  templateUrl: './dynamic-setup-wizard-welcome-screen.component.html',
  styleUrls: ['./dynamic-setup-wizard-welcome-screen.component.css']
})
export class DynamicSetupWizardWelcomeScreenComponent {
      @Input() setupWizard: setupWizard[]
      @Input() setupListItem: setupListItem[]
      @Input() formContent: DynamicFormFields[]
      page:String 
      active:boolean = true;

      constructor(
       
         public cdr: ChangeDetectorRef,
        
      ) { }

      selectCard(card:String): void {
        this.page = card
        this.cdr.detectChanges();
        
      }

       buttonConfig : DynamicFormButtons[] =[
        {
          submit: { label: 'Save and Continue', visible: true, alignment: 'end' },
          back: { label: 'Second', visible: false, alignment: 'start' },
          center: { label: 'Center', visible: false, alignment: 'center' },
  
        }
      
    ]
     
}
