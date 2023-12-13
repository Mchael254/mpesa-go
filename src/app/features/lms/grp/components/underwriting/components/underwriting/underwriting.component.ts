import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-underwriting',
  templateUrl: './underwriting.component.html',
  styleUrls: ['./underwriting.component.css']
})
export class UnderwritingComponent implements OnInit, OnDestroy {
  quoteSummary = 'underwriting'

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  onConvert() {
    this.router.navigate(['/home/lms/grp/underwriting/endorsement']);
  }

}
