import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import stepData from '../../data/steps.json';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {

  quoteSummary = 'summary'
  steps = stepData;


  constructor(
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  searchFormMemberDets = this.fb.group({
    filterby: [""],
    greaterOrEqual: [""],
    valueEntered: [""],
    searchMember: [""],
  })

  shareSummaryForm = this.fb.group({
    clientName: ['', Validators.required],
    email: ['', Validators.required],
    sms: ['', Validators.required],
    whatsapp: ['', Validators.required],
    communicationType: ['', Validators.required],
  })

  showCoverSummary() {
    const modal = document.getElementById('coverSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  addMemberDetailsModal() {
    const modal = document.getElementById('addMemberModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  showShareSummaryModal() {
    const modal = document.getElementById('shareSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeShareSummaryModal() {
    const modal = document.getElementById('shareSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  showRejectSummaryModal() {
    const modal = document.getElementById('rejectSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeRejectSummaryModal() {
    const modal = document.getElementById('rejectSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  showAccountSummaryModal() {
    const modal = document.getElementById('accountSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeAccountSummaryModal() {
    const modal = document.getElementById('accountSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  closeAddMemberDetailsModal() {
    const modal = document.getElementById('addMemberModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  closeCoverSummary() {
    const modal = document.getElementById('coverSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  showMemberSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeMembersSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  onProceed() {
    this.router.navigate(['/home/lms/grp/underwriting/summary']);
  }

  onBack() {
    this.router.navigate(['/home/lms/grp/underwriting/endorsement']);
  }
}
