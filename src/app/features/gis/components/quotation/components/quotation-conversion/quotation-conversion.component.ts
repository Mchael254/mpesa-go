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

interface SearchOption {
  name: string;
  value: string;
  label: string;
}

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
  dateFormat: any;
  coverFrom: any;
  coverTo: any;
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
  fieldNames: string[] = [];
  searchOptions: { name: string, value: string }[] = []; // Define dropdown options
  selectedSearchType: { name: string, value: string } | undefined;
  selectedSearchValue: any = null;
  filteredOptions: any[] = [];
  defaultPlaceholder: string = 'Select a value'; // Default placeholder
  focusedPlaceholder: string = 'Type to search'; // Placeholder on focus
  currentPlaceholder: string = this.defaultPlaceholder; // Placeholder in use

  products: Product[];
  status: Status[];

  // Field name to display name mapping
  fieldNameMapping: { [key: string]: string } = {
    quotationCode: "Quotation Code",
    quotationNumber: "Quotation Number",
    clientCode: "Client Code",
    clientName: "Client Name",
    fromDate: "From Date",
    toDate: "To Date",
    comments: "Comments",
    expiryDate: "Expiry Date",
    status: "Status",
    quotDate: "Quotation Date",
    source: "Source",
    currencyCode: "Currency Code",
    currency: "Currency",
    agentCode: "Agent Code",
    agentShortDescription: "Agent Description",
    premium: "Premium",
    sumInsured: "Sum Insured",
  };

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

    // this.fetchGISQuotations({
    //   first: 0,
    //   rows: 1000
    // });
  }

  ngOnDestroy(): void { }

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

  onSearchValueChange() {
    if (this.selectedSearchType && this.selectedSearchValue) {
      log.debug("selectedSearchType", this.selectedSearchType);
      log.debug("selectedSearchValue", this.selectedSearchValue);
      // Reset pagination when search value changes
      this.fetchQuotations({
        first: 0,
        rows: this.pageSize
      });
    }
  }

  onTableLazyLoad(event: any) {
    if (this.selectedSearchType && this.selectedSearchValue) {
      this.fetchQuotations(event);
    } else {
      this.fetchGISQuotations(event);
    }
  }

  fetchQuotations(event: any) {
    const pageIndex = event.first / event.rows;
    const pageSize = event.rows;

    let clientCode: number | undefined;
    let clientName: string | undefined;

    if (this.selectedSearchType?.value === 'clientName') {
      clientName = this.selectedSearchValue.name;
    } else {
      // Ensure we're parsing to number
      clientCode = Number(this.selectedSearchValue.name);
      // Handle potential NaN case
      if (isNaN(clientCode)) {
        clientCode = undefined;
      }
    }

    this.quotationService.searchQuotations(
      pageIndex,
      pageSize,
      undefined,
      clientCode,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      clientName
    ).pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          if (response._embedded) {
            this.tableDetails = {
              rows: response._embedded,
              totalElements: response._embedded.length
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
      });
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
          this.updateFilteredOptions();

          if (this.gisQuotationList && Array.isArray(this.gisQuotationList)) {
            // Assuming gisQuotationList is an array of objects
            if (this.gisQuotationList.length > 0) {
              // Extract keys from the first object in the array
              this.fieldNames.push(...Object.keys(this.gisQuotationList[0]));
            }
          } else if (this.gisQuotationList && typeof this.gisQuotationList === 'object') {
            // If gisQuotationList is a single object
            this.fieldNames.push(...Object.keys(this.gisQuotationList));
          }

          log.debug("Field names",this.fieldNames);

          // Transform fieldNames into dropdown options
          this.searchOptions = this.fieldNames.map(field => ({
            name: this.fieldNameMapping[field],
            value: field
          }));

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

  formatFieldName(field: string): string {
    // Replace underscores with spaces and capitalize first letters
    return field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  onSearchTypeChange() {
    log.debug('Previous selection:', this.selectedSearchValue);
    this.selectedSearchValue = null;
    log.debug('Selection cleared');

    log.debug('Selected search type:', this.selectedSearchType?.value);
    this.updateFilteredOptions();
    log.debug('Options updated for type:', this.selectedSearchType?.value);
    this.updatePlaceholder();
  }

  updateFilteredOptions() {
    if (!this.selectedSearchType || !this.gisQuotationList) return;

    if (this.selectedSearchType.value === 'clientName') {
      // Create unique list of client names
      this.filteredOptions = Array.from(new Set(
        this.gisQuotationList.map(quote => quote.clientName)
      )).map(name => ({ name: name }));
    } else {
      // Create unique list of client IDs
      this.filteredOptions = Array.from(new Set(
        this.gisQuotationList.map(quote => quote.clientCode)
      )).map(code => ({ name: code }));
    }
  }

  getPlaceholder(): string {
    return this.selectedSearchType
      ? `Select ${this.selectedSearchType.name}`
      : this.defaultPlaceholder;
  }

  updatePlaceholder(): void {
    this.currentPlaceholder = this.getPlaceholder();
  }

  onFocus(): void {
    this.currentPlaceholder = this.focusedPlaceholder;
  }

  onBlur(): void {
    this.currentPlaceholder = this.selectedSearchValue
      ? ''
      : this.getPlaceholder();
  }

}
