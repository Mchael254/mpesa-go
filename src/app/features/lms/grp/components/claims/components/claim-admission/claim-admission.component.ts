import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';

@Component({
  selector: 'app-claim-admission',
  templateUrl: './claim-admission.component.html',
  styleUrls: ['./claim-admission.component.css']
})
export class ClaimAdmissionComponent implements OnInit, OnDestroy {
  steps = stepData;
  claimDetails = 'claim'

  constructor() {}
  
  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  documents = [
    { label: 'National ID', path: 'assets/documents/id.pdf', name: 'id.pdf' },
    { label: 'Passport', path: 'assets/documents/passport.pdf', name: 'passportpassportpassport.pdf' },
    { label: 'Driver\'s License', path: 'assets/documents/license.pdf', name: 'ilicense.pdf' },
    { label: 'Social Security Card', path: 'assets/documents/ssc.pdf', name: 'card.pdf' }
  ];
}
