import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { DmsService } from 'src/app/features/lms/service/dms/dms.service';
import { EndorsementService } from 'src/app/features/lms/service/endorsement/endorsement.service';
import { PartyService } from 'src/app/features/lms/service/party/party.service';
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
  documentList: any[] = [];
  endorsementCoverTypeList: any[] = [];
  policyDependents: any[];

  constructor(private policies_service: PoliciesService, 
    private spinner_service: NgxSpinnerService, 
    private product_service: ProductService, 
    private fb: FormBuilder,
    private endorsement_service: EndorsementService,
    private dms_service: DmsService,
    private party_service: PartyService,
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
    this.getDocumentsByClientId();
    this.listCoverTypesByEndrCode();
    this.getListPolicyDependents();

  }

  listPolicySummaryByPolCodeAndEndrCode() {
    this.spinner_service.show('underwriting');
    this.policies_service
      .listPolicySummaryByPolCodeAndEndrCode()
      .subscribe((data) => {        
        this.policyUnderwritingSummary = data
        this.policyUnderwritingSummary['endr_pay_method'] = this.getPaymentMethod(this.policyUnderwritingSummary['endr_pay_method']);
        this.spinner_service.hide('underwriting')

      },
      err=>{
        this.spinner_service.hide('underwriting')

      });
  }

  listCoverTypesByEndrCode() {
    // this.spinner_service.show('underwriting');
    this.endorsement_service
      .listCoverTypesByEndrCode()
      .subscribe((data: any[]) => {
        this.endorsementCoverTypeList = data;
        
        // this.spinner_service.hide('underwriting')

      },
      err=>{
        console.log(err);
        
        // this.spinner_service.hide('underwriting')

      });
  }

  getProductList(){
    this.product_service.getListOfProduct().subscribe(data =>{
      this.productList = data
    })
  }
  
  getListPolicyDependents(){
    this.party_service.getListPolicyDependents().subscribe((data: any[]) =>{
      this.policyDependents = data;
      console.log(data);
      
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

  getDocumentsByClientId(){
    let client_code = this.session_storage_service.get(SESSION_KEY.CLIENT_CODE);
    this.dms_service.getClientDocumentById(client_code)
    .subscribe(data =>{
      this.documentList = data['content']
    });
  }

  downloadBase64File(url:string) {
    // this.spinner.show('download_view');
    this.dms_service.downloadFileById(url)
    // .pipe(finalize(()=>{
    //   // this.spinner.hide('download_view');
    // }))
    .subscribe(()=>{
      // this.spinner.hide('download_view');
    })
  }
  
  private getPaymentMethod(g=''){
    if(g==='C'){
      return 'CARD'
    }
    return ''
  }

  openModal(name ='UnderWritingModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  closeModal(name ='UnderWritingModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
}
