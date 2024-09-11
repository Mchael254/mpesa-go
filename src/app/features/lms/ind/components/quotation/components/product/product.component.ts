import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap, finalize, first, mergeMap, switchMap, tap } from 'rxjs/operators';
import {Observable, of, ReplaySubject} from 'rxjs';
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";
import {ProductService} from "../../../../../service/product/product.service";
import {ToastService} from "../../../../../../../shared/services/toast/toast.service";
import {PayFrequencyService} from "../../../../../grp/components/quotation/service/pay-frequency/pay-frequency.service";
import {QuotationService} from "../../../../../service/quotation/quotation.service";
import {ClientService} from "../../../../../../entities/services/client/client.service";
import {Utils} from "../../../../../util/util";
import {StringManipulation} from "../../../../../util/string_manipulation";
import {SESSION_KEY} from "../../../../../util/session_storage_enum";
import { EscalationRateDTO } from '../../models/escalation-rate';

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
  productList: any[] = [];
  coverTypeList = signal([]);
  productOptionList: any[];
  isOptionReady: boolean;
  isTermReady: boolean;
  option_product_code: number = 0;
  productTermList = signal([]);
  agentList: any[] = [];
  paymentOfFrequencyList: any[];
  util: any;
  web_quote: any = null;
  getQuotationSubscribe: Observable<any>;
  escalationRate: EscalationRateDTO[];
  pop_code: number = 2021415;

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
    console.log(quote);

    if (!quote) {
      this.getQuotationSubscribe = this.getProduct().pipe(
        concatMap((products) => {
          this.productList = [...products];
          return this.getTelQuote();
        }),
        finalize(() => this.spinner.hide('product_view'))
      );
    } else {
      this.getQuotationSubscribe = this.getProduct().pipe(
        concatMap((products) => {

          this.productList = [...products];
          return this.getWebQuote();
        }),
        finalize(() => this.spinner.hide('product_view'))
      );
    }
    this.getQuotationSubscribe
    .pipe(concatMap((data: any)=>{
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
      this.productForm
        .get('freq_payment')
        .patchValue(final_quote['payment_frequency']);
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
      coinsurance_question: [],
      escalationOption: [],
      escalationRate: [],
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
