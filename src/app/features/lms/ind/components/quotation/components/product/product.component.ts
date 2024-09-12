import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap, finalize, first, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';
import { SessionStorageService } from "../../../../../../../shared/services/session-storage/session-storage.service";
import { ProductService } from "../../../../../service/product/product.service";
import { ToastService } from "../../../../../../../shared/services/toast/toast.service";
import { PayFrequencyService } from "../../../../../grp/components/quotation/service/pay-frequency/pay-frequency.service";
import { QuotationService } from "../../../../../service/quotation/quotation.service";
import { ClientService } from "../../../../../../entities/services/client/client.service";
import { Utils} from "../../../../../util/util";
import { StringManipulation } from "../../../../../util/string_manipulation";
import { SESSION_KEY } from "../../../../../util/session_storage_enum";
import { EscalationRateDTO } from '../../models/escalation-rate';
import { LeaderOptionDTO } from '../../models/leader-option';
import { CoinsurerOptionDTO } from '../../models/coinsurer-option';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Quotation', url: '/home/lms/quotation/list' },
    {
      label: 'Client Details(Data Entry)',
      url: '/home/lms/ind/quotation/client-details',
    },
  ];
  steps = stepData;
  validationData: any[];
  productForm: FormGroup;
  productList: any[] = []; // List of products to choose from
  coverTypeList = signal([]); // Dynamic cover type list based on product selection
  productOptionList: any[]; // Options for the selected product
  isOptionReady: boolean;
  isTermReady: boolean;
  option_product_code: number = 0;
  productTermList = signal([]); // Term list that may be dependent on the product
  agentList: any[] = [];
  paymentOfFrequencyList: any[];
  util: any;
  web_quote: any = null;
  getQuotationSubscribe: Observable<any>;
  escalationRate: EscalationRateDTO[];
  leaderOption: LeaderOptionDTO[] = [];
  coinsurerOption: CoinsurerOptionDTO[] = [];
  pop_code: number = 2021415;
  endr_code: number = 2024642021;
  coverageOptionLabel: string = 'Coverage Option';  // Default label

  escalationOption: { value: string, label: string }[] = [
    { value: 'PREMIUM ESCALATION', label: 'Premium Escalation' },
    { value: 'SUM ASSURED ESCALATION', label: 'Sum Assured Escalation' }
  ];

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

    this.productForm = this.fb.group ({
      escalation_question: [''],
      coinsurance_question: ['']
    });
  }

  get isEscalationYes(): boolean {
    return this.productForm.get('escalation_question').value === 'Y';
  }

  get isCoinsuranceYes(): boolean {
    return this.productForm.get('coinsurance_question').value === 'Y';
  }

  ngOnInit(): void {
    let quote = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    );
    this.productForm = this.getproductForm();
    this.getPayFrequencies();
    this.getAgentList();
    this.getEscalationRate();
    this.getLeaderOption();
    this.getCoinsurerOption();
    console.log(quote);

    if (!quote) {
      this.getQuotationSubscribe = this.getProduct().pipe(
        concatMap((products) => {
          this.productList = [...products];
          return this.getTelQuote(); // Telephone-based quote if no existing quote
        }),
        finalize(() => this.spinner.hide('product_view'))
      );
    } else {
      this.getQuotationSubscribe = this.getProduct().pipe(
        concatMap((products) => {

          this.productList = [...products];
          return this.getWebQuote(); // Web-based quote if quote exists
        }),
        finalize(() => this.spinner.hide('product_view'))
      );
    }
    this.getQuotationSubscribe
    .pipe(concatMap((data: any)=>{
      // Check if agent code exists, fetch agent details if found
      if(data?.agent_code){
        return this.getAgentByCode(data?.agent_code).pipe(concatMap(agent_details =>{
          this.productForm.get('agent').patchValue(agent_details);

          return of(data);
        }))

      }
      this.toast.info('Agent is not defined', 'Product Selection'.toUpperCase())
      return of(data);

    }))
    .subscribe((final_quote) => {
      // Patch the form with the final quote data
      this.productForm.get('freq_payment').patchValue(final_quote['payment_frequency']);
      this.productForm.get('term').patchValue(final_quote['policy_term']);
      this.productForm.get('agent').patchValue(final_quote['agent_code']);

      if (quote?.sum_insured && quote?.sum_insured>0) {
        this.productForm.get('sa_prem_select').patchValue('SA'); 
        this.productForm.get('sa_prem_amount').patchValue(final_quote['sum_insured']);
      }else{
        this.productForm.get('sa_prem_select').patchValue('P'); 
      }
      this.toast.success('Fetch data successfully', 'Product Selection'.toUpperCase())
    },
    err =>{
      // Handle fetch failure
      this.toast.danger('Fail to fetch data successfully, try again!', 'Product Selection'.toUpperCase())

    });

  }

  getWebQuote() {
    let quote = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    );
    if (quote) {
      return this.quotation_service
        .getLmsIndividualQuotationWebQuoteByCode(quote['code'])
        .pipe(
          concatMap((web_quote: any) => {
            this.web_quote = web_quote;
            let product = web_quote['product_code'];
            this.productForm.patchValue(web_quote);
            this.productForm.get('product').patchValue(product);
            this.selectProduct({ target: { value: product } });
            return of(web_quote);
          }),
          concatMap((web_quote) => {
            return this.product_service
              .getProductOptionByCode(web_quote['pop_code'])
              .pipe(
                concatMap((product_option) => {
                  let option = product_option['code'];
                  this.productForm.get('option').patchValue(option);
                  this.selectProductOption({
                    target: { value: product_option['code'] },
                  });

                  // return of(product_option);
                  return of(web_quote);

                })
              );

          })
        );
    } else {
      return of(null);
    }
  }

  getTelQuote() {
    let quote = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.QUOTE_DETAILS)
    );
    if (quote) {
      return this.quotation_service
        .getLmsIndividualQuotationTelQuoteByCode(quote['tel_quote_code'])
        .pipe(
          switchMap((tel_quote: any) => {
            // console.log(tel_quote);

            this.web_quote = tel_quote;
            let product = tel_quote['product_code'];
            this.productForm.patchValue(tel_quote);
            this.productForm.get('product').patchValue(product);
            this.selectProduct({ target: { value: product } });
            return of(tel_quote);
          }),
          switchMap((tel_quote) => {
            this.product_service
              .getProductOptionByCode(tel_quote['pop_code'])
              .pipe(
                switchMap((data) => {
                  let option = data['code'];
                  this.productForm.get('option').patchValue(option);
                  this.selectProductOption({ target: { value: data['code'] } });
                  return of(tel_quote);
                })
              );

            return of(tel_quote);
          })
        );
    } else {
      return of(null);
    }
  }

  getAgentList() {
    this.crm_client_service.getAgents().subscribe((data) => {
      this.agentList = data['content']?.map((d) => {
        d['details'] = `${d?.name} - ${d?.emailAddress ? d?.emailAddress : ''}`;
        return d;
      });
    });
  }

  getAgentByCode(code: any) {
    return this.crm_client_service.getAgentById(code);
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

  getproductForm() {
    return this.fb.group({
      // Product-related fields
      product: ['', Validators.required], // Product selection (required)
      option: ['', Validators.required], // Option (required)
      term: ['', Validators.required], // Term (required)

      // Sum Assured / Premium selection
      sa_prem_select: ['', Validators.required],
      sa_prem_amount: ['', [Validators.required, Validators.min(0)]], // Ensures non-negative values

      // Frequency of payment and agent
      freq_payment: ['', Validators.required], // Frequency of payment (required)
      agent: ['', Validators.required], 

       // Proposal dates
      proposal_date: ['', Validators.required], // Proposal date (required)
      proposal_sign_date: ['', Validators.required], // Proposal sign date (required)
      
      escalation_question: ['', Validators.required],
      coinsurance_question: ['', Validators.required],
      escalationOption: ['', Validators.required],
      escalationRate: ['', Validators.required],
      leaderOption: ['', Validators.required],
      leaderShare: ['', Validators.required],
      coinsurerShare: ['', Validators.required]
    });
  }

  getProduct() {
    this.spinner.show('product_view');
    return this.product_service.getListOfProduct();
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
          this.productOptionList = [...productOptions];
          this.isOptionReady = true;

          // Find the selected product from the product list
          let selectedProduct = this.productList.find((m) => m['code'] === productCode);

          // Extract the calculate_from field
          let calculateFrom = selectedProduct?.calculate_from;

          // Set the label based on the calculate_from value
          if (calculateFrom === 'S') {
            this.coverageOptionLabel = 'Sum Assured';
          } else if (calculateFrom === 'P') {
            this.coverageOptionLabel = 'Premium';
          } else if (calculateFrom === 'B') {
            this.coverageOptionLabel = 'Both';
          } else  {
            this.coverageOptionLabel = 'Null';  
          }

          // Clear the cover type list (if needed)
          this.coverTypeList.set([]);
          this.spinner.hide('product_view');
        });
    } else {
      this.isOptionReady = false;
      this.isTermReady = false;
      this.spinner.hide('product_view');
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
        .subscribe(
          (covers) => {
            this.coverTypeList.set(covers);
            this.spinner.hide('product_view');
          },
          (err: any) => {
            this.spinner.hide('product_view');
          }
        );
    }
  }

  selectProductTerm(pCode: any) {
    let pTermVal = +pCode.target.value;
  }

  getEscalationRate() {
    this.product_service
      .getProductEscalationRate(this.pop_code).subscribe((data) => {
      this.escalationRate = data;
    })
  }
  
  getLeaderOption() {
    this.product_service.getProductLeaderOption(this.endr_code).subscribe((data) => {
      this.leaderOption = data;
    })
  }

  getCoinsurerOption() {
    this.product_service.getProductCoinsurerOption(this.endr_code).subscribe((data) => {
      this.coinsurerOption = data;
    })
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

  getValue(name = 'prem') {
    return '';
  }
  selectClient(event: any) {
    // console.log('select client');
    // console.log(event?.value);
    // let val = this.clientForm.get('client');
    // this.productForm.patchValue(event?.value);
  }

  nextPage() {
    if (!this.util.getClientCode()) {
      this.toast.danger('ÍNCOMPLETE DATA', 'INCOMPLETE_DATA');
    }
    this.spinner.show('product_view');
    let quote = {};
    // let quote_details = StringManipulation.returnNullIfEmpty(
    //   this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    // );
    let formValue = this.productForm.value;

    if(formValue['sa_prem_select']===null){
      this.toast.danger('select either PREMIUM or SUM ASSURED', 'PRODUCT DETAILS')
    }
    let cover_list = this.coverTypeList()
      .filter((data) => data?.selected === true)
      .map((data) => data?.id);
    quote = {
      code: this.web_quote === null ? null : this.web_quote['code'],
      quote_no: this.util.getTelQuoteCode(),
      proposal_no: this.util.getProposalCode(),
      premium:
        formValue['sa_prem_select'] === 'P'
          ? formValue['sa_prem_amount']
          : null,
      sum_insured:
        formValue['sa_prem_select'] === 'SA'
          ? formValue['sa_prem_amount']
          : null,
      client_code: this.util.getClientCode(),
      client_type: 'C',
      policy_term: formValue['term'],
      product_code: formValue['product'],
      agent_code: formValue?.agent?.id | 0,
      payment_frequency: formValue['freq_payment'],
      pop_code: formValue['option'],
      quote_type: 'PR',
      quote_status: 'DR',
      payout_frequency: 'D',
      payment_status: 'PENDING',
      life_cover: 'Y',
      auto_esc: 'Y',
      cover_type_codes: cover_list,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.quotation_service.saveWebQuote(quote).subscribe(
      (data) => {
        this.session_storage.set(SESSION_KEY.WEB_QUOTE_DETAILS, data);
        this.toast.success(
          'succesfully create/update quote',
          'QUOTATION CREATION/UPDATE'
        );
        this.route.navigate(['/home/lms/ind/quotation/beneficiaries-dependents'])
        this.spinner.hide('product_view');
      },
      (err) => {
        this.spinner.hide('product_view');
        this.toast.danger(err?.error?.errors[0], 'QUOTATION CREATION/UPDATE');
      }
    );
  }
}
