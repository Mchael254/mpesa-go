import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { tap } from 'rxjs';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { QuotationsService } from '../../../features/gis/components/quotation/services/quotations/quotations.service';
import { GlobalMessagingService } from '../../services/messaging/global-messaging.service';
import { untilDestroyed } from '../../shared.module';
import { Logger } from '../../services';
import { Products } from '../../../features/gis/components/setups/data/gisDTO';
import { ProductsService } from '../../../features/gis/components/setups/services/products/products.service';
import { Modal } from 'bootstrap';

const log = new Logger('ProductSearchModalComponent');

@Component({
  selector: 'app-product-search-modal',
  templateUrl: './product-search-modal.component.html',
  styleUrls: ['./product-search-modal.component.css'],
  standalone: false
})
export class ProductSearchModalComponent implements OnInit, OnDestroy {

  @ViewChild('productSearchModalElement') modalElementRef: ElementRef;
  @ViewChild('closebutton') closebutton;
  @ViewChild('dt1') table: any;
  @Output() productSelected = new EventEmitter<{ productName: string; productCode: number }>();

  private modalInstance: Modal;
  private filterSubject = new Subject<void>();

  tableDetails: any = {
    rows: [],
    totalElements: 0
  };
  pageSize: number = 10;
  isSearching = false;
  searchTerm = '';
  shouldLoadProducts = false;
  hasTriggeredReset = false;

  filterObject: {
    code: number | null;
    productName: string;
  } = {
    code: null,
    productName: ''
  };

  productList: Products[];
  selectedProduct: Products;
  selectedProductCode: any;

  private _onShown?: () => void;
  private _onHidden?: () => void;

  constructor(
    private router: Router,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public productService: ProductsService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    log.debug('ProductSearchModalComponent initialized');
    
    // Subscribe to filter changes with debounce
    this.filterSubject
      .pipe(
        debounceTime(300),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.executeFilter();
      });
  }

  ngAfterViewInit(): void {
    const modalElement = this.modalElementRef?.nativeElement;
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();

      // Store the listener references so we can remove them later
      this._onShown = () => {
        this.shouldLoadProducts = true;
        if (!this.hasTriggeredReset) {
          this.hasTriggeredReset = true;
          this.cdr.detectChanges();
          this.table?.reset();
        }
      };

      this._onHidden = () => {
        this.shouldLoadProducts = false;
      };

      modalElement.addEventListener('shown.bs.modal', this._onShown);
      modalElement.addEventListener('hidden.bs.modal', this._onHidden);
    }
  }

  hideModal(): void {
    const modalElement = this.modalElementRef?.nativeElement;

    if (this.modalInstance && modalElement && document.body.contains(modalElement)) {
      setTimeout(() => {
        try {
          this.modalInstance?.hide();
        } catch (err) {
          log.error('Error while hiding modal:', err);
        }
      }, 0);
    }
  }

  ngOnDestroy(): void {
    const modalElement = this.modalElementRef?.nativeElement;

    try {
      this.modalInstance?.hide();
    } catch (_) {}

    // Clean up event listeners
    if (modalElement) {
      if (this._onShown) modalElement.removeEventListener('shown.bs.modal', this._onShown);
      if (this._onHidden) modalElement.removeEventListener('hidden.bs.modal', this._onHidden);
    }

    this.modalInstance = null;
  }

  getProducts(
    page: number,
    size: number,
    code: number,
    productName: string
  ) {
    return this.productService
      .fetchAllProducts(page, size, code, productName)
      .pipe(
        untilDestroyed(this)
      );
  }

  executeFilter(): void {
    this.productList = null;
    this.isSearching = true;
    this.spinner.show();
    this.table?.reset(); // Reset pagination to first page

    this.productService.fetchAllProducts(
      0, // Start from first page
      this.pageSize, // Use actual page size
      this.filterObject?.code,
      this.filterObject?.productName
    ).subscribe(
      (data) => {
        this.productList = data;
        this.tableDetails.rows = data;
        this.tableDetails.totalElements = data.length;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error => {
        log.error('Error fetching products:', error);
        this.spinner.hide();
      }
    );
  }

  onProductSelected(product: Products) {
    this.selectedProduct = product;
    log.debug('Selected Product:', this.selectedProduct);
  }

  saveSelectedProduct(): void {
    if (!this.selectedProduct) {
      log.warn('No product selected');
      return;
    }

    this.productSelected.emit({
      productName: this.selectedProduct.description,
      productCode: this.selectedProduct.code
    });

    this.hideModal();
  }

  inputCode(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject.code = value ? +value : null;
    this.filterSubject.next(); // Trigger debounced filter
  }

  inputDescription(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject.productName = value;
    this.filterSubject.next(); // Trigger debounced filter
  }

  lazyLoadProducts(event: LazyLoadEvent | TableLazyLoadEvent) {
    // Only load if modal is shown
    if (!this.shouldLoadProducts) {
      return;
    }

    const pageIndex = Math.floor(event.first / event.rows);
    const pageSize = event.rows;

    if (this.isSearching) {
      // If we're already searching/filtering, don't reload
      return;
    }

    this.spinner.show();
    this.getProducts(pageIndex, pageSize, null, null)
      .pipe(
        untilDestroyed(this),
        tap((data) => log.debug('Fetching products>>>', data))
      )
      .subscribe(
        (data: any[]) => {
          this.productList = data;
          this.tableDetails.rows = data;
          this.tableDetails.totalElements = data.length;
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        error => {
          log.error('Error loading products:', error);
          this.spinner.hide();
        }
      );
  }
}