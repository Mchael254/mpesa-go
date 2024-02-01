import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {
  data = 257;
  columnOptions: SelectItem[];
  selectedColumns: string[];

  dummyData = [
    { cvt_desc: 'Member1', dty_descriptiontitlecase: '12345', use_cvr_rate: '10000', premium_mask_short_description: 'Premium1', premium_rate: '500', rate_division_factor: 0.25 },
    { cvt_desc: 'Member2', dty_descriptiontitlecase: '67890', use_cvr_rate: '15000', premium_mask_short_description: 'Premium2', premium_rate: '700', rate_division_factor: 0.30 },
    { cvt_desc: 'Member2', dty_descriptiontitlecase: '67890', use_cvr_rate: '15000', premium_mask_short_description: 'Premium2', premium_rate: '700', rate_division_factor: 0.30 },
   
  ];

  yourDataArray = [
    { coverType: 'Cover type A', totalSumAssured: 100000, grossPremium: 5000, commission: 200, netPremium: 4800 },
    { coverType: 'Cover type B', totalSumAssured: 150000, grossPremium: 7000, commission: 300, netPremium: 6700 },
    { coverType: 'Cover type C', totalSumAssured: 200000, grossPremium: 9000, commission: 400, netPremium: 8600 },
  ];

  constructor (
    private router: Router,
  ) {}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  finish() {

  }

  back() {
    this.router.navigate(['/home/lms/grp/reinsurance/selection'])
  }

  showMemberDetailedSummary() {
    const modal = document.getElementById('memberDetailedSummary');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeMemberDetailedSummary() {
    const modal = document.getElementById('memberDetailedSummary');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

}
