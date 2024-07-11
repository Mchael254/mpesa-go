import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-claim-admission',
  templateUrl: './claim-admission.component.html',
  styleUrls: ['./claim-admission.component.css']
})
export class ClaimAdmissionComponent implements OnInit, OnDestroy {
  steps = stepData;
  claimDetails = 'claim'
  isClaimAdmitted: boolean = false;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {}
  
  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  shareAcknowledgementForm = this.fb.group({
    clientName: ['', Validators.required],
    email: ['', Validators.required],
    sms: ['', Validators.required],
    whatsapp: ['', Validators.required],
    communicationType: ['', Validators.required],
  })

  documents = [
    { label: 'National ID', path: 'assets/documents/id.pdf', name: 'id.pdf' },
    { label: 'Passport', path: 'assets/documents/passport.pdf', name: 'passportpassportpassport.pdf' },
    { label: 'Driver\'s License', path: 'assets/documents/license.pdf', name: 'ilicense.pdf' },
    { label: 'Social Security Card', path: 'assets/documents/ssc.pdf', name: 'card.pdf' }
  ];

  onAdmitClaim() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'claim admitted successfully'
    });
    this.isClaimAdmitted = true;
  }

  onProcessClaim() {

  }

  showShareAcknowledgmentModal() {
    const modal = document.getElementById('shareAcknowledgementModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeShareAcknowledgmentModal() {
    const modal = document.getElementById('shareAcknowledgementModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }
}
