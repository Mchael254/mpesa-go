import { ChangeDetectionStrategy, Component } from '@angular/core';
import stepData from "../../data/steps.json";

@Component({
  selector: 'app-claims-process',
  templateUrl: './claims-process.component.html',
  styleUrls: ['./claims-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimsProcessComponent {
  steps = stepData;
  dbStep = 4
  eachStep = this.dbStep

  onStepChange(step: number) {
    this.eachStep = step;  // Update the current step
  }
}
