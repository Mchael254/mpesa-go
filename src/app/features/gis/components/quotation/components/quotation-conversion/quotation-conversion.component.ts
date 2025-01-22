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
  agentName: string = '';
  agentId: number;
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
    this.fetchGISQuotations({ first: 0, rows: 10 }); // You can adjust `first` and `rows` as need
  }

  onAgentSelected(event: { agentName: string; agentId: number }) {
    this.agentName = event.agentName;
    this.agentId = event.agentId;

    // Optional: Log for debugging
    log.debug('Selected Agent:', event);
    log.debug("AgentId", this.agentId);

    // Call fetchQuotations when the client code changes
    this.fetchGISQuotations({ first: 0, rows: 10 }); // You can adjust `first` and `rows` as need
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


  //fetch the quotations with specific serach parameters
  fetchGISQuotations(event: any) {
    const pageIndex = event.first / event.rows;
    const pageSize = event.rows;

    // Determine search parameters based on available values
    let searchParams: any = {};
    if (this.agentId) {
      searchParams.agentCode = this.agentId;
    } else if (this.clientCode) {
      searchParams.clientCode = this.clientCode;
    }
    log.debug("search parameters", searchParams);

    this.quotationService.searchQuotations(
      pageIndex,
      pageSize,
      undefined,
      searchParams.clientCode,
      undefined,
      undefined,
      undefined,
      searchParams.agentCode,
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
        const recordFromDate = new Date(quote.fromDate); // Convert fromDate to Date object
        const recordToDate = new Date(quote.toDate); // Convert toDate to Date object

        if (this.fromDate && this.toDate) {
          // Both dates selected
          return recordFromDate >= this.fromDate && recordToDate <= this.toDate;
        } else if (this.fromDate) {
          // Only from date selected
          return recordFromDate >= this.fromDate;
        } else if (this.toDate) {
          // Only to date selected
          return recordToDate <= this.toDate;
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

  clearFilters() {
    // Clear client
    this.clientName = '';
    this.clientCode = null;

    // Clear agent
    this.agentName = '';
    this.agentId = null;

    // Clear product
    this.selectedProduct = null;

    // Clear status
    this.selectedStatus = null;

    // Clear dates
    this.clearDateFilters()

    // Refresh the table with cleared filters
    this.onTableLazyLoad({
      first: 0,
      rows: this.pageSize || 5
    });

    // Trigger change detection
    this.cdr.detectChanges();
  }

}
