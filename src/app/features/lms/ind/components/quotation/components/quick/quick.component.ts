import {
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from 'src/app/features/lms/ind/service/product/product.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { first, mergeMap, tap, debounceTime, switchMap, of } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.css'],
})
@AutoUnsubscribe
export class QuickComponent implements OnInit, OnDestroy {
  quickQuoteSummaryDefault = {
    isSummaryReady: false,
    product: -1,
    option: -1,
    policy_term: 0,
    coverTypeList: [],
    prem_result: -1,
  };
  quickQuoteSummary_: {} = { ...this.quickQuoteSummaryDefault };
  quickQuoteSummary = signal({ ...this.quickQuoteSummaryDefault });
  quickForm: FormGroup;
  shareForm: FormGroup;
  productList: any[] = [];
  productOptionList: any[];
  productTermList = signal([]);
  coverTypeList = signal([]);
  shareInputType: string = '';

  isProductReady: boolean = false;
  isOptionReady: boolean = false;
  isTermReady: boolean = false;
  isPremAssuredReady: boolean = false;
  isSummaryReady: boolean = false;
  option_product_code: number = 0;

  constructor(
    private session_storage: SessionStorageService,
    private route: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private product_service: ProductService,
    private toast: ToastService
  ) {
    this.quickForm = this.fb.group({
      date_of_birth: [''],
      gender: ['M'],
      product: [-1],
      option: [-1],
      term: [-1],
      sa_prem_select: ['P'],
      sa_prem_amount: [],
    });

    this.shareForm = this.fb.group({
      name: [''],
    });
  }

  ngOnInit(): void {
    this.spinner.show('whole');
    this.product_service
      .getListOfProduct()
      .pipe(finalize(() => this.spinner.hide('whole')))
      .subscribe(
        (products) =>
          (this.productList = [
            { code: 0, description: 'SELECT PRODUCT' },
            ...products,
          ])
      );
  }

  getValue(name: string = 'sa_prem_select') {
    return this.quickForm.get(name).value;
  }

  selectDate() {
    this.spinner.show('whole');
    this.isProductReady = true;
    this.spinner.hide('whole');
    this.computePremium();
  }

  selectProduct(event) {
    this.quickQuoteSummary_ = { ...this.quickQuoteSummaryDefault };
    this.quickForm.get('option').setValue(-1);
    this.quickForm.get('term').setValue(-1);
    this.quickForm.get('sa_prem_amount').setValue(0);

    let productCode = +event.target.value;
    if (productCode > 0) {
      this.spinner.show('whole');
      this.product_service
        .getListOfProductOptionByProductCode(productCode)
        .pipe(
          finalize(() => {
            this.spinner.hide('whole');
          })
        )
        .subscribe((productOptions) => {
          this.productOptionList = [
            { code: 0, product_code: 0, desc: 'SELECT PRODUCT OPTION' },
            ...productOptions,
          ];
          this.isOptionReady = true;
          let prod;
          prod = this.productList.filter((m) => {
            return m['code'] === productCode;
          });

          this.quickQuoteSummary.mutate((data) => {
            if (prod.length > 0) {
              data['product'] = prod[0];
              data['isSummaryReady'] = false;
              data['coverTypeList'] = [];
              data['option'] = -1;
              data['policy_term'] = 0;
              data['prem_result'] = 0;
              return data;
            }

            return data;
          });
          this.coverTypeList.set([]);
          this.quickQuoteSummary_ = { ...this.quickQuoteSummary() };
          this.computePremium();
        });
    } else {
      this.isOptionReady = false;
      this.isTermReady = false;
      this.isPremAssuredReady = false;
    }
  }

  selectProductOption(pCode: any) {
    this.quickForm.get('term').setValue(-1);
    this.quickForm.get('sa_prem_amount').setValue(0);
    let pPopItem = +pCode.target.value;
    if (pPopItem > 0) {
      this.spinner.show('whole');
      let age =
        new Date().getFullYear() -
        new Date(this.quickForm.get('date_of_birth').value).getFullYear();
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
            data['prod_terms'] = [
              { term: 0, anb: 0, max_age: 0, desc: 'Select Term' },
              ...d,
            ];
            this.productTermList.set(data);
          }),
          first(),
          mergeMap(() => {
            return this.product_service.getListOfProductCoverTypeByProductCode(
              this.option_product_code
            );
          }),

          finalize(() => {
            this.spinner.hide('whole');
            this.isTermReady = true;
            this.isPremAssuredReady = true;
          })
        )
        .subscribe((covers) => {
          this.coverTypeList.set(covers);
          this.quickQuoteSummary.mutate((data) => {
            if (option.length > 0) {
              data['option'] = option[0];
              return data;
            }
            return data;
          });

          this.quickQuoteSummary_ = { ...this.quickQuoteSummary() };
          this.computePremium();
        });
    }
  }

  selectProductTerm(pCode: any) {
    let pTermVal = +pCode.target.value;
    this.quickQuoteSummary.mutate((data) => {
      data['policy_term'] = pTermVal;
      return data;
    });
    this.quickQuoteSummary_ = { ...this.quickQuoteSummary() };
    this.computePremium();
  }

  private checkifAllFieldsAreNotEmpty() {
    let date = this.getValue('date_of_birth');
    let product = +this.getValue('product');
    let option = +this.getValue('option');
    let term = +this.getValue('term');
    let premium_amt = +this.getValue('sa_prem_amount');
    return (
      date !== '' &&
      product !== -1 &&
      option !== -1 &&
      term !== -1 &&
      premium_amt !== 0
    );
  }

  computePremium() {
    if (this.checkifAllFieldsAreNotEmpty()) {
      this.spinner.show('prem_view');
      let summaryQuote = { ...this.quickQuoteSummary() };
      let prem_obj = { lead: {}, quote: {} };
      prem_obj['lead']['dob'] = this.getValue('date_of_birth');
      prem_obj['lead']['gender'] = this.getValue('gender');

      prem_obj['quote']['smoker'] = 'Y';
      prem_obj['quote']['payment_frequency'] = 'M';
      prem_obj['quote']['product_code'] = summaryQuote['product']['code'];
      prem_obj['quote']['product_option_code'] = summaryQuote['option']['code'];
      prem_obj['quote']['policy_term'] = summaryQuote['policy_term'];
      prem_obj['quote']['premium_term'] = summaryQuote['policy_term'];
      prem_obj['quote']['quote_no'] = null;
      prem_obj['quote']['cover_type_codes'] = summaryQuote['coverTypeList'].map(
        (data) => {
          return data['id'];
        }
      );
      this.quickQuoteSummary.mutate((da: any) => {
        da['isSummaryReady'] = true;
        return da;
      });

      this.quickQuoteSummary_ = { ...this.quickQuoteSummary() };

      of(+this.getValue('sa_prem_amount'))
        .pipe(
          debounceTime(200),
          switchMap((sm: any) => {
            if (this.getValue('sa_prem_select') === 'P') {
              prem_obj['quote']['sum_insured'] = 0;
              prem_obj['quote']['premium'] = sm;
            } else {
              prem_obj['quote']['sum_insured'] = sm;
              prem_obj['quote']['premium'] = 0;
            }
            return this.product_service.premium_computation(prem_obj);
          })
        )
        .subscribe(
          (prem) => {
            // console.log(prem);
            this.session_storage.set('quote_code',prem['quote_code'])
            this.session_storage.set('client_code',prem['client_code'])

            this.quickQuoteSummary.mutate((da: any) => {
              da['prem_result'] = prem['premium'];
              return da;
            });
            this.quickQuoteSummary_ = { ...this.quickQuoteSummary() };
            if (prem['error_type'] === 'WARNING') {
              this.toast.danger(
                prem['message'].replaceAll('ANB', 'Age(Date of Birth)'),
                'InCorrect Data Computation!'
              );
              this.quickQuoteSummary_['prem_result'] = 0;
            }
            this.spinner.hide('prem_view');
          },
          (err) => {
            this.spinner.hide('prem_view');
          }
        );
    }
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

    this.quickQuoteSummary.mutate((da: any) => {
      da['coverTypeList'] = this.coverTypeList().filter((m) => {
        return m['selected'] === true;
      });
      return da;
    });
    this.quickQuoteSummary_ = { ...this.quickQuoteSummary() };
    this.computePremium();
  }

  selectShareType(value: string) {
    this.shareInputType = value === 'email' ? 'email' : 'phone';
  }

  closeModal() {
    const modal = document.getElementById('QuoteShareModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  nextPage(){
    this.route.navigate(["/home/lms/ind/quotation/client-details"])

  }

  ngOnDestroy(): void {
    console.log('QuickComponent UNSUBSCRIBE');
  }
}
