import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import stepData from '../../data/steps.json';
import { UnderwritingService } from '../../service/underwriting.service';

@Component({
  selector: 'app-underwriting',
  templateUrl: './underwriting.component.html',
  styleUrls: ['./underwriting.component.css']
})
export class UnderwritingComponent implements OnInit, OnDestroy {
  quoteSummary = 'underwriting'
  steps = stepData;
  quotationCode = 20247640;

  constructor(
    private router: Router,
    private underwritingService: UnderwritingService
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  onConvert() {
  this.underwritingService.convertQuoteToPolicy(this.quotationCode).subscribe((policySummary) => {
    console.log("policySummary", policySummary);
    this.router.navigate(['/home/lms/grp/underwriting/endorsement']);
  });
  }

}
