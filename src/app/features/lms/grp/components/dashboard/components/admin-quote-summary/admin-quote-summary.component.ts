import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-quote-summary',
  templateUrl: './admin-quote-summary.component.html',
  styleUrls: ['./admin-quote-summary.component.css']
})
export class AdminQuoteSummaryComponent implements OnInit, OnDestroy {


  constructor(
    private router: Router,
    ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  onProceed () {}

  onBack() {
    this.router.navigate(['/home/lms/grp/dashboard/cover-details']);
  }

}