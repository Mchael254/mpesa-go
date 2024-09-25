import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { QuickService } from '../../../quotation/service/quick/quick.service';
import { DurationTypes, FacultativeType, QuotationCovers, UnitRate } from '../../../quotation/models/quotationCovers';
import { PayFrequencyService } from '../../../quotation/service/pay-frequency/pay-frequency.service';
import { PayFrequency } from '../../../quotation/models/payFrequency';
import { Currency } from '../../../quotation/models/currency';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

const log = new Logger("NormalQuoteInitComponent");
!AutoUnsubscribe
@Component({
  selector: 'app-normal-quote-init',
  templateUrl: './normal-quote-init.component.html',
  styleUrls: ['./normal-quote-init.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormalQuoteInitComponent implements OnInit, OnDestroy {
  normalQuoteForm: FormGroup;
  productList$: Observable<any[]>;
  quotationCovers$:Observable<QuotationCovers[]>;
  durationType$: Observable<DurationTypes[]>;
  facultativeType$: Observable<FacultativeType[]>;
  unitRate$: Observable<UnitRate[]>;
  payFrequencies$: Observable<PayFrequency[]>
  currencyList$: Observable<Currency[]>;
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private product_service: ProductService,
    private cdr: ChangeDetectorRef,
    private quickService: QuickService,
    private payFrequenciesService: PayFrequencyService,
    private currencyService: CurrencyService,
  ) { }


  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.quoteForm();
    this.getProducts();
    this.getQuotationCovers();
    this.getDurationTypes();
    this.getFacultativeTypes();
    this.getUnitRate();
    this.getPayFrequencies();
    this.getAllCurrencies();
  }

  ngOnDestroy(): void {

  }


  quoteForm() {
    this.normalQuoteForm = this.fb.group({
      product: [""],
      durationType: [""],
      facultativeType: [""],
      quotationCovers: [""],
      freqOfPayment: [""],
      unitRateOption: [""],
      currency: [""],
      effectiveDate: [""],
    });
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Normal quote', url: '/home/lms/grp/dashboard/normal-quote' },
    ];
  }

  /**
   * The function `getProducts` retrieves a list of products of type 'G', that is Group and returns
   * it as an observable.
   */
  getProducts(): Observable<any[]> {
    this.productList$ =  this.product_service.getListOfProduct('G');
    this.cdr.detectChanges();
    return this.productList$;
  }

  getQuotationCovers(): void {
    this.quotationCovers$ = this.quickService.getQuotationCovers() as Observable<QuotationCovers[]>;
  }

  getDurationTypes() {
    this. durationType$ = this.quickService.getDurationTypes() as Observable<DurationTypes[]>;
  }

  getFacultativeTypes() {
    this.facultativeType$ = this.quickService.getFacultativeTypes() as Observable<FacultativeType[]>;
  }

  getUnitRate() {
    this.unitRate$ = this.quickService.getUnitRate() as Observable<UnitRate[]>;
  }

  getPayFrequencies() {
    this.payFrequencies$ = this.payFrequenciesService.getPayFrequencies() as  Observable<PayFrequency[]>;
  }

  getAllCurrencies() {
    this. currencyList$ = this.currencyService.getAllCurrencies() as Observable<Currency[]>
  }

  submitnormalQuoteFormData() {
    log.info("quickFormData", this.normalQuoteForm.value)
    this.router.navigate(['/home/lms/grp/dashboard/cover-details']);
  }
}
