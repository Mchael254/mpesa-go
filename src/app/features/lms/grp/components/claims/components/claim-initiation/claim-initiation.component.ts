import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-claim-initiation',
  templateUrl: './claim-initiation.component.html',
  styleUrls: ['./claim-initiation.component.css']
})
export class ClaimInitiationComponent implements OnInit, OnDestroy {
  steps = stepData;
  claimInitForm: FormGroup;
  @ViewChild('op') overlayPanel: OverlayPanel;

  constructor(
    private fb: FormBuilder,
  ) {}
  
  ngOnInit(): void {
    this.claimForm();
    
  }

  ngOnDestroy(): void {
    
  }

  onSelectClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('add-causation-link')) {
      this.showOverlay(event);
    }
  }

  showOverlay(event: MouseEvent) {
    this.overlayPanel.toggle({
      target: event.target as HTMLElement,
      currentTarget: event.currentTarget as HTMLElement,
      originalEvent: event
    });
  }

  claimForm() {
    this.claimInitForm = this.fb.group({
      product: [""],
      policy: [""],
      policyMember: [""],
      causationType: [""],
      actualCause: [""],
      reportDate: [""],
      occurenceDate: [""],
      locationOfIncident: [""],
    });
  }

  submitClaimInitFormData() {
  }

  actualCauses = [
    'Cause 1',
    'Cause 2',
    'Cause 3',
    'Cause 4',
    'Cause 5'
  ];

}
