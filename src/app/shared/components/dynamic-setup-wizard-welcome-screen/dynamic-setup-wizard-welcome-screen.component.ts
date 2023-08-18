import { Component, Input } from '@angular/core';
import { setupListItem, setupWizard } from '../../data/common/setup-wizard';

@Component({
  selector: 'app-dynamic-setup-wizard-welcome-screen',
  templateUrl: './dynamic-setup-wizard-welcome-screen.component.html',
  styleUrls: ['./dynamic-setup-wizard-welcome-screen.component.css']
})
export class DynamicSetupWizardWelcomeScreenComponent {
      @Input() setupWizard: setupWizard[]
      @Input() setupListItem: setupListItem[]
}
