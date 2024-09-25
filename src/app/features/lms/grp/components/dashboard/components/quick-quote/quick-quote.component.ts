import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { CoverType } from 'src/app/features/gis/components/setups/data/gisDTO';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { CoverageService } from '../../../quotation/service/coverage/coverage.service';
import { CoverTypePerProdDTO } from '../../../quotation/models/coverTypes/coverTypesDto';
import { QuotationCovers } from '../../../quotation/models/quotationCovers';
import { QuickService } from '../../../quotation/service/quick/quick.service';

const log = new Logger("QuickQuoteComponent");
@AutoUnsubscribe
@Component({
  selector: 'app-quick-quote',
  templateUrl: './quick-quote.component.html',
  styleUrls: ['./quick-quote.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickQuoteComponent implements OnInit, OnDestroy {
  quickQuoteForm: FormGroup;
  breadCrumbItems: BreadCrumbItem[] = [];
  productList$: Observable<any[]>;
  productCode: number;
  coverTypesPerProduct$: Observable<CoverTypePerProdDTO[]>;
  quotationCovers$:Observable<QuotationCovers[]>;

  constructor(
    private fb: FormBuilder,
    private product_service: ProductService,
    private messageService: MessageService,
    private coverageService: CoverageService,
    private cdr: ChangeDetectorRef,
    private quickService: QuickService,
  ) {}

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.quickForm();
    this.getProducts();
    this.getProductCode();
    this.getQuotationCovers();
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Quick quote', url: '/home/lms/grp/dashboard/quick-quote' },
    ];
  }

  quickForm() {
    this.quickQuoteForm = this.fb.group({
      product: [""],
      coverType: [""],
      coverageType: [""],
      multipleOfEarnings: [""],
      NoOfMembers: [""],
      averageAge: [""],
      annualEarnings: [""],
      coverFrom: [""],
      coverTo: [""],
    });
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

  /**
   * The `getProductCode` function listens for changes in the selected product code in a form and
   * triggers related actions, that is assigns selected product code to variable productCode to be used in getting coverTypes.
   */
  getProductCode() {
    this.quickQuoteForm.get('product')?.valueChanges.pipe(untilDestroyed(this)).subscribe((selectedProductCode: number) => {
      this.productCode = selectedProductCode;
      this.cdr.detectChanges();
      this.getCoverTypesPerProduct()
    });
  }

 /**
  * The function `checkProductSelection` checks if a product is selected and displays a message if
  * not.
  */
  checkProductSelection(): void {
    if (this.productCode === null || this.productCode === undefined) {
      this.messageService.add({severity: 'info', summary: 'info', detail: 'Select a product first!'});
    }
  }

  /**
   * The function `getCoverTypesPerProduct` retrieves cover types per product and triggers change
   * detection.
   */
  getCoverTypesPerProduct(): void {
    this.coverTypesPerProduct$ = this.coverageService.getCoverTypesPerProduct(this.productCode) as Observable<CoverTypePerProdDTO[]>;
    this.cdr.detectChanges();
  }

  getQuotationCovers(): void {
    this.quotationCovers$ = this.quickService.getQuotationCovers() as Observable<QuotationCovers[]>;
  }


  submitQuickFormData() {
    log.info("quickFormData", this.quickQuoteForm.value)
  }

}
