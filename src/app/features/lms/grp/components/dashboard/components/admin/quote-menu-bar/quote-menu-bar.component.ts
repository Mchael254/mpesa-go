import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-quote-menu-bar',
  templateUrl: './quote-menu-bar.component.html',
  styleUrls: ['./quote-menu-bar.component.css']
})
export class QuoteMenuBarComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.populateBreadCrumbItems();
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Quote', url: '/home/lms/grp/dashboard/quote' },
    ];
  }

  onQuickQuoteClick() {
    this.router.navigate(['/home/lms/grp/dashboard/quick-quote']);
  }

 onNormalQuoteClick() {
  this.router.navigate(['/home/lms/grp/dashboard/normal-quote']);
 }

}
