import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
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
      { label: 'Products', url: '/home/lms/grp/dashboard/products' },
    ];
  }

  showProductOverview() {
    const modal = document.getElementById('productOverviewModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeProductOverview() {
    const modal = document.getElementById('productOverviewModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  getQuote() {
    this.router.navigate(['/home/lms/grp/dashboard/quote']);
  }

}
