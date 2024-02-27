import { Component, OnInit, signal } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { finalize, first, mergeMap, switchMap, tap } from 'rxjs/operators';
import { PayFrequencyService } from 'src/app/features/lms/grp/components/quotation/service/pay-frequency/pay-frequency.service';
import { QuotationService } from 'src/app/features/lms/service/quotation/quotation.service';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { Utils } from 'src/app/features/lms/util/util';
import { of } from 'rxjs/internal/observable/of';
import { ClientService } from 'src/app/features/entities/services/client/client.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  steps = stepData;
  validationData: any[];
  productForm: FormGroup;
  productList:any[] =[];
  coverTypeList = signal([]);
  productOptionList: any[];
  isOptionReady: boolean;
  isTermReady: boolean;
  option_product_code: number = 0;
  productTermList = signal([]);
  agentList: any[] = [];
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Quotation', url: '/home/lms/quotation/list' },
    {
      label: 'Client Details(Data Entry)',
      url: '/home/lms/ind/quotation/client-details',
    },
  ];
  paymentOfFrequencyList: any[];
  util: any;
  web_quote: any = null;



  constructor(
    private session_storage: SessionStorageService,
    private route: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private product_service: ProductService,
    private toast: ToastService,
    private Payment_freq_service: PayFrequencyService,
    private quotation_service: QuotationService,
    private crm_client_service: ClientService
  ) {
     this.util = new Utils(this.session_storage);


  }
  ngOnInit(): void {
    let quote  = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS))
    this.getProduct().pipe(switchMap(
      (products) => {
        console.log(products);

         this.productList = [
          ...products,
        ]
        return this.getWebQuote();

      }
    ),
      finalize(() => this.spinner.hide('product_view')))
      .subscribe(data =>{
        console.log(quote);
        this.productForm.get('term').patchValue(quote['policy_term']);
        this.productForm.get('freq_payment').patchValue(quote['payment_frequency']);
        this.productForm.get('term').patchValue(quote['policy_term']);
        this.productForm.get('term').patchValue(quote['policy_term']);

      })
    this.productForm = this.getproductForm()
    this.getPayFrequencies();
    
  }


  getWebQuote(){
    let quote  = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS));
    if(quote){
      return this.quotation_service.getLmsIndividualQuotationWebQuoteByCode(quote['code'])
      .pipe(
        switchMap((web_quote :any) =>{
          console.log(web_quote);

        this.web_quote = web_quote
        let product = web_quote['product_code'];
        this.productForm.patchValue(web_quote);
        this.productForm.get('product').patchValue(product);
        this.selectProduct({target: {value: product}})
        return of(web_quote)
      }),
      switchMap((web_quote) =>{
        return this.product_service.getProductOptionByCode(web_quote['pop_code']).pipe(
          switchMap((data) =>

        {
          let option = data['code']
          this.productForm.get('option').patchValue(option);
          this.selectProductOption({target: {value: data['code']}});
          
          return of(data)
        }))
      })
      )
    }else {
      return of(null)
    }
  }

  getClientList() {
    this.crm_client_service.getClients().subscribe((data) => {
      this.agentList = data['content']?.map((d) => {
        d['full_name'] = `${d.firstName} ${d.lastName ? d.lastName : ''}`;
        d['details'] = `${d.firstName} ${d.lastName ? d.lastName : ''} - ${
          d?.emailAddress ? d?.emailAddress : ''
        }`;
        return d;
      });
    });
  }

  coverTypeState(cover: any) {
    this.coverTypeList.mutate((data) => {
      return data.map((d) => {
        if (d['id'] === cover['id']) {
          d['selected'] = !cover['selected'];
        }
        return d;
      });
    });
  }

  getPayFrequencies() {
    this.Payment_freq_service.getPayFrequencies().subscribe((freqs: any) => {
      this.paymentOfFrequencyList = freqs;
    });
  }

  selectDate() {
    this.spinner.show('whole');
    this.spinner.hide('whole');
  }

  getproductForm(){
    return this.fb.group({
      product: [],
      option: [],
      term: [],
      sa_prem_select: [],
      sa_prem_amount: [],
      freq_payment: [],
      proposal_date: [],
      proposal_sign_date: [],
      agent: [],
      escalation_question: [],
      coinsurance_question: []
    });
  }

  getProduct(){
    this.spinner.show('product_view');
    return this.product_service
      .getListOfProduct()
      
      
  }

  selectProduct(event) {
    // this.quickQuoteSummary_ = { ...this.quickQuoteSummaryDefault };
    // this.productForm.get('option').setValue(-1);
    // this.productForm.get('term').setValue(-1);
    // this.productForm.get('sa_prem_amount').setValue(0);

    let productCode = +event.target.value;
    if (productCode > 0) {
      this.spinner.show('product_view');
      this.product_service
        .getListOfProductOptionByProductCode(productCode)
        .pipe(
          finalize(() => {
            this.spinner.hide('product_view');
          })
        )
        .subscribe((productOptions) => {
          this.productOptionList = [ ...productOptions];
          this.isOptionReady = true;
          let prod;
          prod = this.productList.filter((m) => {
            return m['code'] === productCode;
          });

          this.coverTypeList.set([]);
          this.spinner.hide('product_view');
        });
    } else {
      this.isOptionReady = false;
      this.isTermReady = false;
      this.spinner.hide('product_view');
      // this.isPremAssuredReady = false;
    }
  }

  selectProductOption(pCode: any) {
    let pPopItem = +pCode.target.value;
    if (pPopItem > 0) {
      this.spinner.show('product_view');
      let age = 30;
        // new Date().getFullYear() -
        // new Date(this.productForm.get('date_of_birth').value).getFullYear();
      let option;
      option = this.productOptionList.filter((m) => {
        return m['code'] === pPopItem;
      });
      this.option_product_code = option.length > 0 ? option[0]['prod_code'] : 0;
      this.product_service
        .getListOfProductTermByProductCode(
          this.option_product_code,
          pPopItem,
          age > 0 ? age : 0
        )
        .pipe(
          tap((data) => {
            let d = data['prod_terms'];
            data['prod_terms'] = [...d];
            this.productTermList.set(data);
          }),
          first(),
          mergeMap(() => {
            return this.product_service.getListOfProductCoverTypeByProductCode(
              this.option_product_code
            );
          }),

          finalize(() => {
            this.spinner.hide('product_view');
            this.isTermReady = true;
          })
        )
        .subscribe((covers) => {
          this.coverTypeList.set(covers);
          this.spinner.hide('product_view');
        },
        (err: any)=>{
          this.spinner.hide('product_view');
        });
    }
  }

  selectProductTerm(pCode: any) {
    let pTermVal = +pCode.target.value;
  }

  getFormData(name: string) {
    const foundData = this.validationData.find((data) => data['name'] === name);
    return foundData !== undefined ? foundData : null;
  }

  isRequired(name: string) {
    let control = this.productForm.get(name);
    return (
      (control.hasError('required') || control.hasError('pattern')) &&
      control.touched
    );
  }

  getValue(name="prem"){
    return ''
  }
  selectClient(event: any) {
    // console.log('select client');
    console.log(event?.value);
    // let val = this.clientForm.get('client');
    // this.productForm.patchValue(event?.value);
  }

  nextPage(){
    this.spinner.show('product_view');
    let quote = {};
    let quote_details = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS));
    let formValue = this.productForm.value;
    // if(formValue['sa_prem_select']===null){
    //   this.toast.danger('select either PREMIUM or SUM ASSURED', 'PRODUCT DETAILS')
    // }
    let cover_list = this.coverTypeList().filter(data => data?.selected ===true).map(data => data?.id);    

    // if(this.web_quote){
    //   quote = {...this.web_quote}
    // }

     quote = {
      "code":  this.web_quote===null ? null: this.web_quote['code'],   
      "quote_no": this.util.getTelQuoteCode(),
      "proposal_no": this.util.getProposalCode(),
      "premium": formValue['sa_prem_select'] === 'P'? formValue['sa_prem_amount']: null,
      "sum_insured": formValue['sa_prem_select']==='SA'? formValue['sa_prem_amount']: null,
      "client_code": this.util.getClientCode(),
      "client_type": "C",
      "policy_term": formValue['term'],
      "product_code": formValue['product'],
      "agent_code": 0,
      // formValue['agent'],
      "payment_frequency": formValue['freq_payment'],
      "pop_code": formValue['option'],
      "quote_type": "PR",
      "quote_status": "DR",
      "payout_frequency": "D",
      "payment_status": "PENDING",
      "life_cover": "Y",
      "auto_esc": "Y",
      "cover_type_codes": cover_list,
      "created_at": new Date(),
      "updated_at": new Date(),
    }
    this.quotation_service.saveWebQuote(quote).subscribe(data =>{
      this.session_storage.set(SESSION_KEY.WEB_QUOTE_DETAILS, data)
      this.toast.success('succesfully create/update quote', 'QUOTATION CREATION/UPDATE');
      this.route.navigate(['/home/lms/ind/quotation/beneficiaries-dependents'])
      console.log(data);
      this.spinner.hide('product_view');
      
    })
  }

}
