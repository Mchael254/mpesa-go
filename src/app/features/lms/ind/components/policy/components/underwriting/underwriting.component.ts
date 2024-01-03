import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { PoliciesService } from 'src/app/features/lms/service/policies/policies.service';
import { ProductService } from 'src/app/features/lms/service/product/product.service';

@Component({
  selector: 'app-underwriting',
  templateUrl: './underwriting.component.html',
  styleUrls: ['./underwriting.component.css'],
})
export class UnderwritingComponent implements OnInit {
  items: MenuItem[];
  activeItem: MenuItem;
  accountDetailActiveItem: MenuItem;
  activeTab: string = 'ACCOUNT_DETAILS';
  accountDetailItemsActiveTab: string = 'RECIEPTS';
  accountDetailItems: MenuItem[] = [];
  productList: any[] = [];
  policyUnderwritingSummary: any = {};

  constructor(private policies_service: PoliciesService, private spinner_service: NgxSpinnerService, private product_service: ProductService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Account Details',
        command: () => (this.activeTab = 'ACCOUNT_DETAILS'),
      },
      { label: 'Exceptions', command: () => (this.activeTab = 'EXCEPTIONS') },
    ];
    this.accountDetailItems = [
      {
        label: 'Reciepts',
        command: () => (this.accountDetailItemsActiveTab = 'RECIEPTS'),
      },
      {
        label: 'Maturities',
        command: () => (this.accountDetailItemsActiveTab = 'MATURTIES'),
      },
    ];

    this.activeItem = this.items[0];
    this.accountDetailActiveItem = this.accountDetailItems[0];
    this.listPolicySummaryByPolCodeAndEndrCode();
    this.getProductList();

  }

  listPolicySummaryByPolCodeAndEndrCode() {
    this.spinner_service.show('underwriting');
    this.policies_service
      .listPolicySummaryByPolCodeAndEndrCode()
      .subscribe((data) => {
        this.policyUnderwritingSummary = data
        console.log(data);
        this.spinner_service.hide('underwriting')

      },
      err=>{
        this.spinner_service.hide('underwriting')

      });
  }

  getProductList(){
    this.product_service.getListOfProduct().subscribe(data =>{
      this.productList = data
    })
  }

  openModal() {
    const modal = document.getElementById('UnderWritingModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  closeModal() {
    const modal = document.getElementById('UnderWritingModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
}
