import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { EndorsementService } from 'src/app/features/lms/service/endorsement/endorsement.service';
import { PoliciesService } from 'src/app/features/lms/service/policies/policies.service';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

@Component({
  selector: 'app-underwriting',
  templateUrl: './underwriting.component.html',
  styleUrls: ['./underwriting.component.css'],
})
export class UnderwritingComponent implements OnInit {
  rejectForm: FormGroup
  items: MenuItem[];
  activeItem: MenuItem;
  accountDetailActiveItem: MenuItem;
  activeTab: string = 'ACCOUNT_DETAILS';
  accountDetailItemsActiveTab: string = 'RECIEPTS';
  accountDetailItems: MenuItem[] = [];
  productList: any[] = [];
  policyUnderwritingSummary: any = {};

  constructor(private policies_service: PoliciesService, 
    private spinner_service: NgxSpinnerService, 
    private product_service: ProductService, 
    private fb: FormBuilder,
    private endorsement_service: EndorsementService,
    private session_storage_service: SessionStorageService) {}

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
    this.rejectForm = this.fb.group({
      cancellation_source: ['', Validators.required]
    })

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
        this.policyUnderwritingSummary['endr_pay_method'] = this.getPaymentMethod(this.policyUnderwritingSummary['endr_pay_method']);
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

  authorizePolicy(){
    let end_code =this.session_storage_service.getItem(SESSION_KEY.ENDR_CODE);
    this.endorsement_service.authorizePolicy(end_code)
    // .subscribe(data =>{
    //   console.log(data);
      
    // })
  }
  rejectQuote(){
    let val = {...this.rejectForm.value};
    val['rdc_code'] = 201942
    this.endorsement_service.rejectPolicy(val)
    // .subscribe(d=>{
    //   console.log(d)
    // });
    
  }

  private getPaymentMethod(g=''){
    if(g==='C'){
      return 'CARD'
    }
    return ''
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
