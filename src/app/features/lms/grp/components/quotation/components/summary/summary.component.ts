import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Logger } from 'src/app/shared/services';


const log = new Logger('SummaryComponent');
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {
  getPayFrequencies() {
    throw new Error('Method not implemented.');
  }

  constructor( private fb: FormBuilder) {}
  
  public premiumForScreen3: string = '$460.00';
  public sumAssuredForScreen3: string = '$38,000'
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


  showCoverSummary() {
    const modal = document.getElementById('coverSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  showCategorySummary() {
    const modal = document.getElementById('categorySummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  showMembersSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeCoverSummary() {
    const modal = document.getElementById('coverSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  closeMembersSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }
  closeCategorySummary() {
    const modal = document.getElementById('categorySummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  onProceed () {
  }


}
