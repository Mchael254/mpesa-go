import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import options from '../../data/options.json';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from 'src/app/features/lms/ind/service/product/product.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Subscription } from 'rxjs/internal/Subscription';
import { first, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.css'],
})
export class QuickComponent implements OnInit, OnDestroy {
  quickQuoteSummary = signal({
    isSummaryReady: false,
    product: '',
    option: '',
  });
  quickForm: FormGroup;
  shareForm: FormGroup;
  productList: any[] = [];
  productOptionList: any[];
  productTermList = signal([]);
  coverTypeList = signal([]);
  coverTypeListSelected = signal([]);
  shareInputType: string = '';

  isProductReady: boolean = false;
  isOptionReady: boolean = false;
  isTermReady: boolean = false;
  isPremAssuredReady: boolean = false;
  isSummaryReady: boolean = false;
  subscriptions!: Subscription;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private product_service: ProductService
  ) {
    this.quickForm = this.fb.group({
      date_of_birth: [''],
      gender: ['M'],
      product: [0],
      option: [0],
      term: [''],
      sa_prem_select: ['P'],
      sa_prem_amount: [0],
    });

    this.shareForm = this.fb.group({
      name: [''],
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.subscriptions = this.product_service
      .getListOfProduct()
      .pipe(finalize(() => this.spinner.hide()))
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

  selectDate(event) {
    this.spinner.show();
    this.isProductReady = true;
    this.spinner.hide();
  }

  selectProduct(event) {
    let productCode = +event.target.value;
    if (productCode > 0) {
      this.spinner.show();
      this.coverTypeList.set([]);
      this.coverTypeListSelected.set([]);
      this.subscriptions = this.product_service
        .getListOfProductOptionByProductCode(productCode)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe((productOptions) => {
          // console.log(productOptions);

          this.productOptionList = [
            { code: 0, product_code: 0, desc: 'SELECT PRODUCT OPTION' },
            ...productOptions,
          ];
          this.isOptionReady = true;
          // console.log(this.productList);

          let prod;
          // if(prod.length > 0)
          prod = this.productList.filter((m) => {
            return m['code'] === productCode;
          });

          this.quickQuoteSummary.update((data) => {
            if (prod.length > 0) {
              data['product'] = prod[0];
              console.log(data);

              return data;
            }

            return data;
          });
        });
    } else {
      this.isOptionReady = false;
      this.isTermReady = false;
      this.isPremAssuredReady = false;
    }
  }
  selectProductOption(pCode: any) {
    let pPopItem = +pCode.target.value;
    // console.log(pPopItem);
    // console.log(this.productOptionList);

    // let pCodeItem = 0;

    // if(product.length>0) pCodeItem = product ['code']

    if (pPopItem > 0) {
      this.spinner.show();
      this.coverTypeList.set([]);
      this.coverTypeListSelected.set([]);
      let option;
      option = this.productOptionList.filter((m) => {
        // console.log(m);
        // console.log(pPopItem);

        return m['code'] === pPopItem;
      });
      // console.log(option);

      this.subscriptions = this.product_service

      .getListOfProductTermByProductCode(option.length > 0 ? option[0]['prod_code'] : 0, pPopItem, this.quickForm.get('date_of_birth').value)
        .pipe(
          tap((data) => {
            this.productTermList.set(data);
            console.log(this.productTermList());

            // return this.product_service.getListOfProductCoverTypeByProductCode(pCodeItem);
          }),
          first(),
          mergeMap(() => {
            return this.product_service

            .getListOfProductCoverTypeByProductCode(
              option.length > 0 ? option[0]['prod_code'] : 0);
            // return this.product_service.getListOfProductTermByProductCode(option.length > 0 ? option[0]['prod_code'] : 0, pPopItem, this.quickForm.get('date_of_birth').value);
          }),

          finalize(() => {
            this.spinner.hide();
            this.isTermReady = true;
            this.isPremAssuredReady = true;
          })
        )
        .subscribe((covers) => {
          this.coverTypeList.set(covers);
          // console.log(covers);

          this.quickQuoteSummary.update((data) => {
            data['isSummaryReady'] = true;
            if (option.length > 0) {
              data['option'] = option[0];
              return data;
            }

            return data;
          });
        });
    }
  }

  selectProductTerm(pCode: any) {
    let pCodeItem = +pCode.target.value;

    if (pCodeItem > 0) {
      this.spinner.show();
      this.coverTypeList.set([]);
      this.coverTypeListSelected.set([]);
      this.subscriptions = this.product_service
        .getListOfProductCoverTypeByProductCode(pCodeItem)
        .pipe(
          finalize(() => {
            this.spinner.hide();
            this.isTermReady = true;
            this.isPremAssuredReady = true;
          })
        )
        .subscribe((covers) => {
          this.coverTypeList.set(covers);
        });
    }
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

  ngOnDestroy(): void {
    this.subscriptions && this.subscriptions.unsubscribe();
  }
}
