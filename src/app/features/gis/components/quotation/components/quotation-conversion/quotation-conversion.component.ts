import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarMenu } from 'src/app/features/base/model/sidebar.menu';
import { MenuService } from 'src/app/features/base/services/menu.service';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import { QuotationList } from '../../data/quotationsDTO';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Logger } from '../../../../../../shared/services';

interface Product {
  id: string;
  name: string;
}

interface Status {
  id: string;
  name: string;
}

const log = new Logger('QuotationConcersionComponent');

@Component({
  selector: 'app-quotation-conversion',
  templateUrl: './quotation-conversion.component.html',
  styleUrls: ['./quotation-conversion.component.css']
})
export class QuotationConversionComponent {
  fromDate: Date | null = null;
  toDate: Date | null = null;
  minToDate: Date | null = null;
  dateFormat: string = 'dd-mm-yy';
  todaysDate: string;
  minDate: Date | undefined;
  quotationSubMenuList: SidebarMenu[];

  selectedProduct: Product;
  selectedStatus: Status;
  filterValue = '';
  gisQuotationList: QuotationList[] = [];
  tableDetails: any = {
    rows: [], // Initially empty array for rows
    totalElements: 0 // Default total count
  };
  pageSize: number = 19;
  clientName: string = '';
  clientCode: number;
  originalQuotationList: QuotationList[] = [];


  products: Product[];
  status: Status[];

  constructor(
    private menuService: MenuService,
    private router: Router,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,

  ) {

    this.products = [
      { id: 'P001', name: 'Comprehensive Car Insurance' },
      { id: 'P002', name: 'Homeowners Insurance' },
      { id: 'P003', name: 'Health Insurance' },
      { id: 'P004', name: 'Travel Insurance' },
      { id: 'P005', name: 'Professional Liability Insurance' }
    ];

    this.status = [
      { id: 'S001', name: 'Active' },
      { id: 'S002', name: 'Pending' },
      { id: 'S003', name: 'Expired' },
      { id: 'S004', name: 'Lapsed' },
      { id: 'S005', name: 'Cancelled' }
    ];
  }

  ngOnInit(): void {
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();

    this.dynamicSideBarMenu(this.quotationSubMenuList[3]);

  }

  ngOnDestroy(): void { }

  onClientSelected(event: { clientName: string; clientCode: number }) {
    this.clientName = event.clientName;
    this.clientCode = event.clientCode;

    // Optional: Log for debugging
    log.debug('Selected Client:', event);

    // Call fetchQuotations when the client code changes
    this.fetchQuotations({ first: 0, rows: 10 }); // You can adjust `first` and `rows` as need
  }

  openClientSearch() {
    const modal = document.getElementById('clientSearchModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  myResetFunction(options: DropdownFilterOptions) {
    options.reset();
    this.filterValue = '';
  }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  }

  onTableLazyLoad(event: any) {
    this.fetchGISQuotations(event);
  }


  fetchGISQuotations(event: any) {
    log.debug("FETCHING GIS QUOTATIONS LIST")
    const pageIndex = event.first / event.rows;
    const pageSize = event.rows;

    // Call the API without sorting parameters
    this.quotationService.searchQuotations(
      pageIndex,
      pageSize
    ).pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          // Assuming response._embedded holds the list of quotations
          this.gisQuotationList = response._embedded;
          log.debug("GIS quotations list", this.gisQuotationList);

          // Set the table data (including rows and totalElements)
          this.tableDetails = {
            rows: this.gisQuotationList,  // List of quotations to display
            totalElements: this.gisQuotationList.length  // Total records (current page data length)
          };
          // this.updateFilteredOptions();

          this.cdr.detectChanges();
          // this.spinner.hide(); // Hide the loading spinner
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch quotations. Please try again later.');
          // this.spinner.hide();
        }
      }
    );
  }

  fetchQuotations(event: any) {
    const pageIndex = event.first / event.rows;
    const pageSize = event.rows;

    this.quotationService.searchQuotations(
      pageIndex,
      pageSize,
      undefined,
      this.clientCode,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ).pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          if (response._embedded) {

            // Store the original data
            this.originalQuotationList = [...response._embedded];
            // Initialize filtered data with all data
            this.gisQuotationList = [...this.originalQuotationList];

            this.tableDetails = {
              rows: this.gisQuotationList,
              totalElements: this.gisQuotationList.length
            };
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to fetch quotations. Please try again later.'
          );
        }
      }
    );
  }

  formatFieldName(field: string): string {
    // Replace underscores with spaces and capitalize first letters
    return field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  applyDateFilter(): void {
    if (!this.fromDate && !this.toDate) {
      // If no dates selected, show all data
      this.gisQuotationList = [...this.originalQuotationList];
    } else {
      this.gisQuotationList = this.originalQuotationList.filter(quote => {
        const quoteDate = new Date(quote.quotDate); // Adjust property name based on your data structure

        if (this.fromDate && this.toDate) {
          // Both dates selected
          return quoteDate >= this.fromDate && quoteDate <= this.toDate;
        } else if (this.fromDate) {
          // Only from date selected
          return quoteDate >= this.fromDate;
        } else if (this.toDate) {
          // Only to date selected
          return quoteDate <= this.toDate;
        }
        return true;
      });
    }

    // Update table data
    this.tableDetails = {
      rows: this.gisQuotationList,
      totalElements: this.gisQuotationList.length
    };

    this.cdr.detectChanges();
    log.debug('Filtered quotations:', this.tableDetails);
  }

  handleDateSelection(selectedDate: Date, type: 'from' | 'to'): void {
    if (type === 'from') {
      this.fromDate = selectedDate;
      this.minToDate = this.fromDate;
    } else {
      this.toDate = selectedDate;
    }
    this.applyDateFilter();
  }

  clearDateFilters(): void {
    this.fromDate = null;
    this.toDate = null;
    this.minToDate = null;

    // Reset to original data
    this.gisQuotationList = [...this.originalQuotationList];
    this.tableDetails = {
      rows: this.gisQuotationList,
      totalElements: this.gisQuotationList.length
    };
    this.cdr.detectChanges();
  }

}
