import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';
import { SESSION_KEY } from '../../../features/lms/util/session_storage_enum';

import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { GroupQuotationsListDTO } from '../../../features/lms/models';
import { MenuService } from '../../../features/base/services/menu.service';
import { SidebarMenu } from '../../../features/base/model/sidebar.menu';
import { untilDestroyed, UtilService } from '../../shared.module';
import { QuotationList, Status, StatusEnum, SystemDetails } from '../../../features/gis/components/quotation/data/quotationsDTO';
import { GlobalMessagingService } from '../../services/messaging/global-messaging.service';
import { QuotationsService } from '../../../features/gis/components/quotation/services/quotations/quotations.service';
import { CurrencyDTO } from '../../data/common/currency-dto';
import { NgxCurrencyConfig } from 'ngx-currency';
import { Menu } from 'primeng/menu';
import { Table } from 'primeng/table';
import { AuthService } from '../../services/auth.service';
import { BankService } from '../../services/setups/bank/bank.service';
import { Logger } from '../../services/logger/logger.service';
import { ClaimsService } from 'src/app/features/gis/components/claim/services/claims.service';
import { switchMap } from 'rxjs';
import { GroupedUser } from 'src/app/features/gis/components/quotation/data/quotationsDTO';


const log = new Logger('QuotationLandingScreenComponent');

@Component({
  selector: 'app-quotation-landing-screen',
  templateUrl: './quotation-landing-screen.component.html',
  styleUrls: ['./quotation-landing-screen.component.css'],
  standalone: false
})
export class QuotationLandingScreenComponent implements OnInit, OnChanges {
  @ViewChild('dt') table!: Table;
  @ViewChild('closeReassignButton') closeReassignButton: any;
  @ViewChild('reassignQuotationModal') reassignQuotationModalElement!: ElementRef;
  @ViewChild('chooseUserReassignModal') chooseUserReassignModal!: ElementRef;
  @ViewChild('reassignTable') reassignTable!: any;

  @Input() LMS_IND: any[];
  @Input() LMS_GRP: GroupQuotationsListDTO[];
  @Input() GIS: any[];
  @Input() PEN: any[];
  activeIndex: number = 0;
  filteredLMS_GRP: GroupQuotationsListDTO[];
  selectedColumn: string = '';
  selectedCondition: string = '';
  filterValue: string = '';
  // fromDate: Date | null = null;
  // toDate: Date | null = null;
  // minToDate: Date | null = null;
  selectedRowIndex: number;
  // gisQuotationList: QuotationList[] = [];
  // tableDetails: any = {
  //   rows: [], // Initially empty array for rows
  //   totalElements: 0 // Default total count
  // };
  pageSize: number = 5;
  // quotationSubMenuList: SidebarMenu[];
  sortField: string = '';
  sortOrder: number = 1;

  @ViewChild('menu') menu: Menu;
  @ViewChild('moreActionsMenu') moreActionsMenu: Menu;
  @ViewChild('quotationTable') quotationTable!: Table;

  clientsData: null;
  isSearching: boolean;
  filterObject: any;
  gisQuotationList: QuotationList[] = [];
  clientCode: number;
  clientName: string;
  productCode: number;
  agentId: number;
  selectedStatus: string;
  selectedSource: any;
  quotationNumber: string = '';
  quoteNumber: string = "";
  selectedQuotation: QuotationList;
  originalQuotationList: QuotationList[] = [];
  quotationSubMenuList: SidebarMenu[];
  agentName: string;
  selectedDateFrom: string;
  selectedDateTo: string;
  selectedExpiryDate: string;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  expiryDate: Date | null = null;
  minToDate: Date | null = null;
  tableDetails: any = {
    rows: [], // Initially empty array for rows
    totalElements: 0 // Default total count
  };
  dateFormat: string = 'dd-mm-yy';
  todaysDate: string;
  minDate: Date | undefined;
  status: Status[] = [
    { status: StatusEnum.Lapsed },
    { status: StatusEnum.Confirmed },
    { status: StatusEnum.Pending },
    { status: StatusEnum.Rejected },
    { status: StatusEnum.None },
    { status: StatusEnum.Accepted },
    { status: StatusEnum.Draft }
  ];

  menuItems: MenuItem[];
  viewQuoteFlag: Boolean = false;
  isClientSearchModalVisible = false;
  remainingMenuItems: MenuItem[] = [];
  public currencyObj: NgxCurrencyConfig;

  // Tooltip descriptions for actions
  actionDescriptions: { [key: string]: string } = {
    'Edit': 'Change client details and process the quote',
    'Revise': 'Create another version of this quote',
    'Reuse': 'Use the existing quote details to create a new quote',
    'View': 'Have a look at the quote details, without making any changes',
    'Reassign': 'Assign to another user',
    'Process': 'Process the quote to create a policy'
  };

  // Action icons mapping
  actionIcons: { [key: string]: string } = {
    'Edit': 'pi pi-pencil',
    'Revise': 'pi pi-sync',
    'Reuse': 'pi pi-replay',
    'View': 'pi pi-eye',
    'Reassign': 'pi pi-user-edit',
    'Process': 'pi pi-cog'
  };

  // Tooltip state management
  hoveredAction: string | null = null;
  tooltipPosition = { x: 0, y: 0 };
  private tooltipTimer: any;
  currencyDelimiter: any;
  defaultCurrencyName: string;
  defaultCurrencySymbol: string;
  defaultCurrency: CurrencyDTO;
  user: any;
  userDetails: any;
  currency: CurrencyDTO[]

  // Actions cache to prevent infinite loops
  private actionsCache = new Map<string, MenuItem[]>();
  userCode: number;
  systemsAssigned: SystemDetails[] = [];
  visibleTabs = {
    LMS: false,
    GIS: false,
    LMS_ORD: false,
    PENSION: false
  };
  showTabs = false;
  users: any;
  selectedUser: any;
  globalSearch: string = '';
  fullNameSearch: string = '';
  noUserChosen: boolean = false;
  reassignComment: string = '';
  comment: boolean = false;

  // Additional properties for two-modal reassignment approach
  departmentSelected: boolean = false;
  userToReassignQuotation: any;
  reassignQuotationComment: string = '';
  noCommentLeft: boolean = false;
  groupUsers: any[] = [];
  selectedGroupUserId!: number;
  private modals: { [key: string]: any } = {};
  groupLeaderName: string = '';



  constructor(
    private session_service:
      SessionStorageService,
    private utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private menuService: MenuService,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public authService: AuthService,
    public bankService: BankService,
    public claimsService: ClaimsService,
  ) {
    this.menuItems = [];

  }

  ngOnInit(): void {
    this.fetchGISQuotations();

    this.session_service.clear_store();
    this.getParams();
    // this.getGroupQuotationsList();
    // this.quotationSubMenuList = this.menuService.quotationSubMenuList();

    // if (this.activeIndex === 0) {
    //   this.dynamicSideBarMenu(this.quotationSubMenuList[2]);
    // }
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.dynamicSideBarMenu(this.quotationSubMenuList[2]);
    this.initializeCurrency();
    this.getUser();
    this.fetchCurrencies();
  }

  ngAfterViewInit() {
    if (this.reassignQuotationModalElement && this.chooseUserReassignModal) {
      this.modals['reassignQuotation'] = new (window as any).bootstrap.Modal(this.reassignQuotationModalElement.nativeElement);
      this.modals['chooseUserReassign'] = new (window as any).bootstrap.Modal(this.chooseUserReassignModal.nativeElement);
    }
    if (!this.showTabs && this.visibleTabs.GIS) {
      this.cdr.detectChanges(); // forces p-table to recalc layout
    }
  }

  openModals(modalName: string) {
    this.modals[modalName]?.show();
  }

  closeModals(modalName: string) {
    this.modals[modalName]?.hide();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['LMS_GRP']) {
    //   this.getGroupQuotationsList();
    // }
  }




  selectLmsIndRow(i: any) {
    if (!i || !i.client_code || !i.account_code) {
      return;
    }
    this.session_service.set(SESSION_KEY.WEB_QUOTE_DETAILS, i)
    let quote = {};
    quote['client_code'] = i['client_code'];
    quote['account_code'] = i['account_code'];
    quote['web_quote_code'] = i['code'];
    quote['proposal_no'] = i['proposal_no'];
    quote['tel_quote_code'] = i['quote_no'];
    quote['page'] = 'WEB';
    this.session_service.set(SESSION_KEY.QUOTE_DETAILS, quote);

    this.router.navigate(['/home/lms/ind/quotation/client-details']);
  }

  selectNormalQuotation() {
    let quote = {};
    quote['page'] = 'NEW';
    this.session_service.set(SESSION_KEY.QUOTE_DETAILS, quote);
    this.router.navigate(['/home/lms/ind/quotation/client-details']);

  }

  //gets params to automatically open General tab when navigating from quote summary
  getParams() {
    this.route.queryParams.subscribe(params => {
      console.log('Received query params:', params);
      if (params['tab'] === 'group-life') {
        this.activeIndex = 1; // Set the active index to the desired tab index (1-based)
        this.dynamicSideBarMenu(this.quotationSubMenuList[2]); // Use appropriate menu index
      } else if (params['tab'] === 'general') {
        this.activeIndex = 2;
        this.dynamicSideBarMenu(this.quotationSubMenuList[0]); // Use menu index for general
        console.log('Setting activeIndex to 2 for general tab');
      }
    });
  }

  getGroupQuotationsList(): void {
    if (this.LMS_GRP && this.LMS_GRP.length > 0) {
      this.filteredLMS_GRP = [...this.LMS_GRP];
      console.log("this.filteredLMS_GRP", this.filteredLMS_GRP);
    } else {
      this.filteredLMS_GRP = []
    }
  }

  grpQuotationsColumns = [
    { field: 'clear', label: 'Clear Filters' },
    { field: 'quotation_number', label: 'Quotation No.' },
    { field: 'product', label: 'Product' },
    { field: 'client_name', label: 'Client' },
    { field: 'agency_name', label: 'Intermediary' },
    { field: 'sum_assured', label: 'Sum Assured' },
    { field: 'total_premium', label: 'Premium' },
    { field: 'cover_from_date', label: 'Cover from' },
    { field: 'cover_to_date', label: 'Cover to' },
    { field: 'quotation_date', label: 'Date Created' },
    { field: 'quotation_status', label: 'Status' }
  ];

  // This method is triggered when the user types in the search box
  onSearch(event: Event): void {
    if (!this.LMS_GRP) {
      this.filteredLMS_GRP = []; // Handles undefined
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.toLowerCase().trim().replace(/,/g, '');

    // Apply filtering based on relevant fields
    this.filteredLMS_GRP = this.LMS_GRP.filter(quote =>
      this.matchesQuote(quote, searchTerm)
    );
  }

  // Unified function to check if a quote matches the search term across various fields
  matchesQuote(quote: any, searchTerm: string): boolean {
    return Object.values({
      quotation_number: quote.quotation_number,
      client_name: quote.client_name,
      agency_name: quote.agency_name,
      quotation_status: quote.quotation_status,
      branch_name: quote.branch_name,
      sum_assured: quote.sum_assured?.toString().replace(/,/g, ''),  // Normalize sums Assured
      total_premium: quote.total_premium?.toString().replace(/,/g, '', ''),
      quotation_date: this.formatDate(quote.quotation_date)
    }).some(fieldValue =>
      fieldValue?.toString().toLowerCase().includes(searchTerm) // Check if any field matches
    );
  }

  // Function to format the date, allowing for multiple input formats
  // formatDate(value: string): string {
  //   return value.replace(/-/g, '/');
  // }

  //  method to handle changes for column, condition, and filter value
  onColumnChange(event: Event): void {
    this.selectedColumn = (event.target as HTMLSelectElement).value;
    if (this.selectedColumn === 'clear') {
      this.clearFilters();
    } else {
      this.applyFilter();
    }
  }

  onConditionChange(event: Event): void {
    this.selectedCondition = (event.target as HTMLSelectElement).value;
    this.applyFilter();
  }

  onFilterInput(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.validateFilter();
    this.applyFilter();
  }

  isNumericField(column: string): boolean {
    // Define which fields are numeric
    const numericFields = ['sum_assured', 'total_premium'];
    return numericFields.includes(column);
  }

  // Validate filter selections
  validateFilter(): void {
    if (this.filterValue && !this.selectedColumn) {
      this.messageService.add({ severity: 'info', summary: 'Information', detail: 'Please select a option first.' });
      this.filterValue = '';
      return;
    }

    if (this.filterValue && this.isNumericField(this.selectedColumn) && !this.selectedCondition) {
      this.messageService.add({ severity: 'info', summary: 'Information', detail: 'Please select a condition first.' });
      return;
    }

    if (this.filterValue && this.selectedColumn && this.isNumericField(this.selectedColumn) && !this.selectedCondition) {
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Please select a condition for the numeric field.'
      });
      return;
    }
  }

  // Handle date range selection
  handleDateSelection(selectedDate: Date, type: string): void {
    if (type === 'from') {
      this.fromDate = selectedDate;
      this.minToDate = this.fromDate;
    } else if (type === 'to') {
      this.toDate = selectedDate;
    }
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.LMS_GRP) {
      this.filteredLMS_GRP = [];
      return;
    }

    if (!this.selectedColumn || (!this.filterValue && !this.fromDate && !this.toDate)) {
      this.filteredLMS_GRP = [...this.LMS_GRP];
      return;
    }

    // Handle date filtering for 'cover_from_date', 'cover_to_date', or 'quotation_date'
    if (this.selectedColumn === 'cover_from_date' || this.selectedColumn === 'cover_to_date' || this.selectedColumn === 'quotation_date') {

      // Function to convert picked date (e.g., '17-October-2024') to 'YYYY-MM-DD'
      const formatPickedDate = (pickedDate: Date | null): string | null => {
        if (!pickedDate) return null;
        const day = pickedDate.getDate().toString().padStart(2, '0'); // Get day, ensure 2 digits
        const month = (pickedDate.getMonth() + 1).toString().padStart(2, '0'); // Get month, ensure 2 digits
        const year = pickedDate.getFullYear().toString(); // Get year
        return `${year}-${month}-${day}`; // Return formatted date in 'YYYY-MM-DD'
      };

      // Convert the selected dates to 'YYYY-MM-DD' format
      const formattedFromDate = formatPickedDate(this.fromDate);
      const formattedToDate = formatPickedDate(this.toDate);

      // Filter the dataset
      this.filteredLMS_GRP = this.LMS_GRP.filter(item => {
        const columnValue = item[this.selectedColumn]; // the date in the dataset is in 'YYYY-MM-DD' format

        if (formattedFromDate && formattedToDate) {
          // Both fromDate and toDate are selected
          return columnValue >= formattedFromDate && columnValue <= formattedToDate;
        } else if (formattedFromDate) {
          // Only fromDate is selected
          return columnValue >= formattedFromDate;
        } else if (formattedToDate) {
          // Only toDate is selected
          return columnValue <= formattedToDate;
        }
        return true; // No filtering if no dates are selected
      });
    }
    // Handle numeric filtering
    else if (this.isNumericField(this.selectedColumn) && this.filterValue) {
      // Sanitize the filterValue by removing commas
      const sanitizedFilterValue = this.filterValue.replace(/,/g, ''); // Remove commas

      const value = Number(sanitizedFilterValue);

      if (isNaN(value)) {
        this.filteredLMS_GRP = [...this.LMS_GRP];
        return;
      }

      this.filteredLMS_GRP = this.LMS_GRP.filter(item => {
        const columnValue = Number(item[this.selectedColumn]);
        switch (this.selectedCondition) {
          case 'greater':
            return !isNaN(columnValue) && columnValue > value;
          case 'less':
            return !isNaN(columnValue) && columnValue < value;
          case 'equals':
            return columnValue === value;
          default:
            return true;
        }
      });
    }
    // Handle string filtering
    else if (this.filterValue) {
      this.filteredLMS_GRP = this.LMS_GRP.filter(item => {
        const columnValue = item[this.selectedColumn]
          ? item[this.selectedColumn].toString().trim().toLowerCase()
          : '';
        const filterValueLower = this.filterValue.trim().toLowerCase();
        return columnValue.includes(filterValueLower);
      });
    } else {
      // Reset the filtered data if no filter is applied
      this.filteredLMS_GRP = [...this.LMS_GRP];
      return;
    }
  }


  // clearFilters(): void {
  //   this.selectedColumn = null;
  //   this.selectedCondition = null;
  //   this.filterValue = '';
  //   this.filteredLMS_GRP = [...this.LMS_GRP];

  //   // Get the input element by its ID and reset its value:
  //   const inputElement = document.getElementById('otherNames') as HTMLInputElement;
  //   if (inputElement) {
  //     inputElement.value = '';
  //   }
  // }

  onQuotationTableRowClick(filteredLMS_GRP, index: number) {
    this.selectedRowIndex = index;
    if (filteredLMS_GRP) {

    }
  }

  // createQuote(type: string) {
  //   this.utilService.clearSessionStorageData()
  //   let nextPage = '/home/gis/quotation/quick-quote'
  //   if (type === 'NORMAL') {
  //     this.utilService.clearNormalQuoteSessionStorage()
  //     nextPage = '/home/gis/quotation/quotation-details'
  //   }
  //   this.router.navigate([nextPage]).then(r => {
  //   })
  // }

  onProcess() {
  }

  onReassign() {
  }

  // fetchGISQuotations(event: any) {
  //   console.log("FETCHING GIS QUOTATIONS LIST")
  //   const pageIndex = event.first / event.rows;
  //   const pageSize = event.rows;

  //   // Call the API without sorting parameters
  //   this.quotationService.searchQuotations(
  //     pageIndex,
  //     pageSize
  //   ).pipe(untilDestroyed(this))
  //     .subscribe({
  //       next: (response: any) => {
  //         // Assuming response._embedded holds the list of quotations
  //         this.gisQuotationList = response._embedded;


  //         // Set the table data (including rows and totalElements)
  //         this.tableDetails = {
  //           rows: this.gisQuotationList,  // List of quotations to display
  //           totalElements: this.gisQuotationList.length  // Total records (current page data length)
  //         };

  //         this.cdr.detectChanges();
  //         // this.spinner.hide(); // Hide the loading spinner
  //       },
  //       error: (error) => {
  //         this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch quotations. Please try again later.');
  //         // this.spinner.hide();
  //       }
  //     });
  // }

  // fetchGISQuotations(event: any) {
  //   console.log("FETCHING GIS QUOTATIONS LIST");

  //   const pageIndex = event.first / event.rows;
  //   const pageSize = event.rows;
  //   const sortField = event.sortField;
  //   const sortOrder = event.sortOrder; // 1 (asc), -1 (desc)

  //   this.quotationService.searchQuotations(pageIndex, pageSize)
  //     .pipe(untilDestroyed(this))
  //     .subscribe({
  //       next: (response: any) => {
  //         const quotations = response._embedded || [];

  //         // ✅ Sort manually if sortField is defined
  //         if (sortField) {
  //           quotations.sort((a: any, b: any) => {
  //             const valueA = a[sortField];
  //             const valueB = b[sortField];

  //             if (valueA == null) return sortOrder === 1 ? -1 : 1;
  //             if (valueB == null) return sortOrder === 1 ? 1 : -1;

  //             if (typeof valueA === 'string' && typeof valueB === 'string') {
  //               return valueA.localeCompare(valueB) * sortOrder;
  //             }

  //             return (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) * sortOrder;
  //           });
  //         }

  //         this.gisQuotationList = quotations;

  //         this.tableDetails = {
  //           rows: this.gisQuotationList,
  //           totalElements: this.gisQuotationList.length
  //         };

  //         this.cdr.detectChanges();
  //       },
  //       error: () => {
  //         this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch quotations. Please try again later.');
  //       }
  //     });
  // }


  onRevise() {
  }

  onTabChange(event: any): void {
    this.activeIndex = event.index; // Update the active index

    if (this.activeIndex === 2) {
      this.dynamicSideBarMenu(this.quotationSubMenuList[0]);
      // Update URL to reflect the general tab without triggering navigation
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { tab: 'general' },
          queryParamsHandling: 'merge'
        }
      );
    } else {
      this.dynamicSideBarMenu(this.quotationSubMenuList[2]);
      // Clear the tab parameter if not on general tab
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { tab: null },
          queryParamsHandling: 'merge'
        }
      );
    }
  }

  // dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
  //   if (sidebarMenu.link.length > 0) {
  //     this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
  //   }
  //   this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  // }
  private initializeCurrency(): void {
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol');
    log.debug("currency Object:", currencySymbol);
    log.debug("currency Delimeter:", currencyDelimiter);
    this.currencyObj = {
      prefix: currencySymbol + ' ',
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter,
      suffix: ' ',
      nullable: true,
      align: 'left',
    };
  }


  // hide tooltip
  immediateHideTooltip(): void {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
      this.tooltipTimer = null;
    }
    this.hoveredAction = null;
  }

  ngOnDestroy(): void {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
    }
  }

  toggleMenu(event: Event, quotation: any) {
    this.selectedQuotation = quotation;

    const items = [
      {
        label: 'View',
        command: () => this.viewQuote(quotation)
      }
    ];

    if (quotation.status === 'Draft') {
      items.push({
        label: 'Edit Quote',
        command: () => this.editQuote(quotation)
      });
    }

    // Add the rest of the items
    items.push(
      //  {
      //    label: 'Revise Quote',
      // command: () => this.reviseQuote(quotation)
      //  },
      // {
      //   label: 'Reuse Quote',
      //   command: () => this.deleteQuote(quotation)
      // },
      // {
      //   label: 'Reassign Quote',
      //   command: () => this.deleteQuote(quotation)
      // },
      {
        label: 'Process',
        command: () => this.process(quotation)
      }
    );

    this.menuItems = items;
    this.menu.toggle(event);
  }

  viewQuote(quotation: QuotationList): void {
    console.log('=== viewQuote method called ===');
    console.log('Quotation data:', quotation);

    // Validate required data before proceeding
    if (!quotation.quotationNumber || !quotation.quotationCode) {
      console.error('Invalid quotation data:', { quotationNumber: quotation.quotationNumber, quotationCode: quotation.quotationCode });
      this.globalMessagingService.displayErrorMessage('Error', 'Invalid quotation data. Please try again.');
      return;
    }

    console.log('Calling setQuotationNumber with:', {
      quotationCode: quotation.quotationCode,
      quotationNumber: quotation.quotationNumber,
      clientCode: quotation.clientCode
    });

    this.setQuotationNumber(
      quotation.quotationCode,
      quotation.quotationNumber,
      quotation.clientCode
    );
  }
  process(quotation: QuotationList): void {
    log.debug('Process quotation clicked:', quotation);
    this.processSelectedQuote(
      quotation.quotationCode,
      quotation.quotationNumber,
      quotation.clientCode
    );
  }
  setQuotationNumber(quotationCode: number, quotationNumber: string, clientCode: number): void {
    log.debug('setQuotationNumber called with:', { quotationCode, quotationNumber, clientCode });

    if (quotationNumber && quotationNumber.trim() !== '') {
      sessionStorage.setItem('quotationNum', quotationNumber);
      sessionStorage.setItem('quotationCode', JSON.stringify(quotationCode));

      if (clientCode != null) {
        sessionStorage.setItem('clientCode', clientCode.toString());
      } else {
        console.warn('Invalid clientCode:', clientCode);
      }
      console.debug(`Quotation number ${quotationNumber} has been saved to session storage.`);
      console.debug(`ClientCode ${clientCode} has been saved to session storage.`);

      this.viewQuoteFlag = true;
      sessionStorage.setItem('viewQuoteFlag', JSON.stringify(this.viewQuoteFlag));

      log.debug('Navigating to quotation-summary...');
      this.router.navigate(['/home/gis/quotation/quotation-summary']).then(
        (success) => log.debug('Navigation successful:', success),
        (error) => log.error('Navigation failed:', error)
      );
    } else {
      log.error('Invalid quotation number:', quotationNumber);
    }
  }

  processSelectedQuote(quotationCode: number, quotationNumber: string, clientCode: number): void {
    if (!quotationNumber || quotationNumber.trim() === '') {
      console.warn('Quotation number is missing or empty.');
      return;
    }

    log.debug('Selected quotationCode:', quotationCode, 'QuotationNumber:', quotationNumber, 'ClientCode:', clientCode);

    // Store basic info in sessionStorage
    sessionStorage.setItem('quotationNum', quotationNumber);
    // sessionStorage.setItem('activeQuotationCode', JSON.stringify(quotationCode));
    sessionStorage.setItem('quotationCode', quotationCode.toString());

    sessionStorage.setItem('clientCode', JSON.stringify(clientCode));

    // Fetch the full quotation details
    this.quotationService.getQuotationDetails(quotationCode).subscribe({
      next: (response: any) => {
        log.debug('Quotation details response:', response);

        const taskName = response?.processFlowResponseDto?.taskName?.trim();
        log.debug('Task name from processFlowResponseDto:', taskName);

        switch (taskName) {
          case 'Quotation Data Entry':
            taskName && sessionStorage.setItem('ticketStatus', taskName);

            this.router.navigate(['/home/gis/quotation/quotation-details']);
            break;

          case 'Authorize Quotation':
            taskName && sessionStorage.setItem('ticketStatus', taskName);

            this.router.navigate(['/home/gis/quotation/quotation-summary']);
            break;
          case 'Authorize Exception':
            taskName && sessionStorage.setItem('ticketStatus', taskName);

            this.router.navigate(['/home/gis/quotation/quotation-summary']);
            break;

          case 'Confirm Quotation':
            taskName && sessionStorage.setItem('ticketStatus', taskName);

            sessionStorage.setItem('confirmMode', 'true');
            this.router.navigate(['/home/gis/quotation/quotation-summary']);
            break;

          case null:
          case undefined:
          case '':
            sessionStorage.setItem('viewOnlyMode', 'true');
            this.router.navigate(['/home/gis/quotation/quotation-summary']);
            log.warn('No task name found — defaulting to view-only summary screen.');
            break;

          default:
            console.warn('Unknown task name from processFlowResponseDto:', taskName);
            break;
        }
      },
      error: (err) => {
        console.error('Failed to fetch quotation details:', err);
      }
    });
  }

  onStatusSelected(selectedValue: any) {

    this.selectedStatus = selectedValue;
    log.debug('Selected Status:', this.selectedStatus);
    this.fetchGISQuotations();

  }

  editQuote(quotation: any) {
    // Implement edit quote functionality
    log.debug('Edit quote:', quotation);
    log.debug('View quote clicked on edit quote:', quotation);

    const quoteToEdit = quotation;
    const status = quoteToEdit.status;

    if (status === "Draft") {
      // navigate to client creation screen with quote details
      sessionStorage.setItem("quoteToEditData", JSON.stringify(quoteToEdit));
      this.router.navigate(['/home/gis/quotation/quotations-client-details']);
    } else {
      this.globalMessagingService.displayInfoMessage('Info', 'Can only edit quotes with status Draft');
    }

  }

  // printQuote(quotation: any) {
  //   log.debug('Print quote:', quotation);
  // }

  // deleteQuote(quotation: any) {
  //   log.debug('Delete quote:', quotation);
  // }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  }

  fetchGISQuotations() {
    log.debug("Quotation Number entered:", this.quoteNumber);
    const clientType = null
    const clientCode = this.clientCode || null
    const productCode = this.productCode || null
    const agentCode = this.agentId || null
    const quotationNumber = this.quoteNumber
    const status = this.selectedStatus || null;
    const dateFrom = this.selectedDateFrom || null
    const dateTo = this.selectedDateTo || null
    const source = this.selectedSource
    const clientName = (this.clientName && this.clientName.trim() !== '') ? this.clientName.trim() : null;

    log.debug("clientCode", clientCode);
    log.debug("productCode", productCode);
    log.debug("agentCode", agentCode);
    log.debug("status", status);
    log.debug("quote", quotationNumber);
    log.debug("clientName", clientName);

    log.debug("Selected Date from:", this.selectedDateFrom)
    log.debug("Selected Date to:", this.selectedDateTo)

    this.quotationService
      .searchQuotations(
        0,
        100,
        clientType,
        clientCode,
        productCode,
        dateFrom,
        dateTo,
        agentCode,
        quotationNumber,
        status,
        source,
        clientName)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.gisQuotationList = response._embedded;

          // Store a copy of the original list when first fetching
          if (this.originalQuotationList.length === 0) {
            this.originalQuotationList = [...this.gisQuotationList];
          }

          // Clear actions cache when quotation list is updated
          this.actionsCache.clear();

          log.debug("LIST OF GIS QUOTATIONS ", this.gisQuotationList);
          setTimeout(() => {
            this.quotationTable?.reset(); // forces table to re-render
          }, 0);
        },
        error: (error) => {
          console.error("erro fetching quotations", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch quotation list. Try again later');
        }
      }
      );
  }

  inputQuotationNo(event) {
    const value = (event.target as HTMLInputElement).value;
    this.quoteNumber = value;
  }

  onClientSelected(event: any) {
    let cleanClientName = event.clientFullName;
    if (cleanClientName) {
      cleanClientName = cleanClientName.replace(/\bnull\b/gi, '').trim();
      cleanClientName = cleanClientName === '' ? null : cleanClientName;
    }

    this.clientName = cleanClientName;
    this.clientCode = event.id;

    // Close the modal after selection
    this.isClientSearchModalVisible = false;
    this.cdr.detectChanges();

    // Optional: Log for debugging
    log.debug('Selected Client-quote management:', event);
    log.debug('Cleaned client name:', cleanClientName);
    this.fetchGISQuotations();
  }

  onAgentSelected(event: { agentName: string; agentId: number }) {
    this.agentName = event.agentName;
    this.agentId = event.agentId;

    // Trigger p-table filtering when agent is selected
    if (this.quotationTable && this.agentName) {
      this.quotationTable.filterGlobal(this.agentName, 'contains');
    }

    // Optional: Log for debugging
    log.debug('Selected Agent:', event);
    log.debug("AgentId", this.agentId);

    // Also fetch quotations for backend filtering
    this.fetchGISQuotations();
  }

  formatDate(date: Date): string {
    log.debug("Date (formatDate method):", date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onDateFromInputChange(date: any) {
    log.debug('selected Date from raaw', date);
    const selectedDateFrom = date;
    if (selectedDateFrom) {
      const SelectedFormatedDate = this.formatDate(selectedDateFrom)
      this.selectedDateFrom = SelectedFormatedDate
      log.debug(" SELECTED FORMATTED DATE from:", this.selectedDateFrom)
    } else {
      this.selectedDateFrom = null;
      log.debug("Date from cleared");
      // If both dates are cleared, reset to original list
      if (!this.selectedDateTo) {
        this.gisQuotationList = [...this.originalQuotationList];
      }
    }
    this.fetchGISQuotations();
  }

  onDateToInputChange(date: any) {
    log.debug('selected Date To raaw', date);
    const selectedDateTo = date;
    if (selectedDateTo) {
      const SelectedFormatedDateTo = this.formatDate(selectedDateTo)
      this.selectedDateTo = SelectedFormatedDateTo
      log.debug(" SELECTED FORMATTED DATE to:", this.selectedDateTo)
    } else {
      this.selectedDateTo = null;
      log.debug("Date to cleared");
      // If both dates are cleared, reset to original list
      if (!this.selectedDateFrom) {
        this.gisQuotationList = [...this.originalQuotationList];
      }
    }
    this.fetchGISQuotations();
  }

  get displayAgentName(): string {
    if (!this.agentName) return '';
    return this.agentName.length > 10 ? this.agentName.substring(0, 15) + '...' : this.agentName;
  }

  get displayClientName(): string {
    // this.fetchGISQuotations()

    if (!this.clientName) return '';
    return this.clientName.length > 10 ? this.clientName.substring(0, 15) + '...' : this.clientName;
  }

  clearDateFilters(): void {
    this.fromDate = null;
    this.toDate = null;
    this.minToDate = null;
    this.expiryDate = null;
    this.selectedDateFrom = null;
    this.selectedDateTo = null;

    // Reset to original list when date filters are cleared
    if (this.originalQuotationList.length > 0) {
      this.gisQuotationList = [...this.originalQuotationList];
    }
  }
  // reviseQuote(selectedQuotation: any) {
  //   log.debug("Selected Quote to be revised:", selectedQuotation)
  //   const quotationCode = selectedQuotation.quotationCode
  //   if (quotationCode) {
  //     this.quotationService
  //       .reviseQuote(quotationCode)
  //       .pipe(untilDestroyed(this))
  //       .subscribe({
  //         next: (response: any) => {
  //           const revisedQuoteNumber = response._embedded.quotationNumber
  //           log.debug("Revised Quotation number ", revisedQuoteNumber);
  //           sessionStorage.setItem('revisedQuotationNo', revisedQuoteNumber);
  //           if (revisedQuoteNumber) {

  //             this.router.navigate(['/home/gis/quotation/quotation-summary']);
  //           }

  //         },
  //         error: (error) => {
  //           this.globalMessagingService.displayErrorMessage('Error', error.error.message);
  //         }
  //       });
  //   }

  // }


  reviseQuotation(selectedQuotation: any, createNew: 'Y' | 'N' = 'N') {
    log.debug("Selected Quote to be revised:", selectedQuotation);

    const quotationCode = selectedQuotation?.quotationCode;
    if (!quotationCode) {
      console.warn("Invalid quotation data:", selectedQuotation);
      return;
    }

    sessionStorage.removeItem('reusedQuotation');
    sessionStorage.removeItem('revisedQuotation'); 
    sessionStorage.removeItem('activeTicket');

    this.quotationService
      .reviseQuote(quotationCode, createNew)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          log.debug("Response for revise", response)

          const quotationCode = response._embedded.newQuotationCode
          sessionStorage.removeItem('reusedQuotation');
          sessionStorage.setItem('revisedQuotation', JSON.stringify(response));
          // sessionStorage.setItem('isRevision', 'true');
          sessionStorage.setItem('quotationCode', quotationCode)

          const ticketStatus = response._embedded.processFlowResponseDto.taskName
          sessionStorage.setItem('ticketStatus', ticketStatus);

          // Navigate to quotation summary
          this.router.navigate(['/home/gis/quotation/quotation-details']);

        },
        error: (error) => {
          log.error("Error revising quotation:", error);
          this.globalMessagingService.displayErrorMessage('Error', error.error?.message || 'Failed to revise quotation');
        }
      });
  }

  reuseQuotation(selectedQuotation: any) {
    const quotationCode = selectedQuotation?.quotationCode;
    if (!quotationCode) {
      console.warn("Invalid quotation data:", selectedQuotation);
      return;
    }

    sessionStorage.removeItem('reusedQuotation');
    sessionStorage.removeItem('revisedQuotation');
    sessionStorage.removeItem('activeTicket');

    this.quotationService
      .reviseQuote(quotationCode, 'Y')
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          sessionStorage.removeItem('revisedQuotation');
          sessionStorage.setItem('reusedQuotation', JSON.stringify(response));
          const quotationCode = response._embedded.newQuotationCode
          sessionStorage.setItem('quotationCode', quotationCode);
          const ticketStatus = response._embedded.processFlowResponseDto.taskName
          sessionStorage.setItem('ticketStatus', ticketStatus);


          this.router.navigate(['/home/gis/quotation/quotation-details']);

        },
        error: (error) => {
          log.error("Error revising quotation:", error);
          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error?.message || 'Failed to revise quotation'
          );
        }
      });
  }


  clearQuotationNo(): void {
    // Assuming you have a variable to store the quotation number value
    this.quotationNumber = '';
    this.fetchGISQuotations();
    this.cdr.detectChanges();
  }

  clearClientName(): void {
    this.clientName = '';
    this.clientCode = null;
    this.fetchGISQuotations();
    this.cdr.detectChanges();
  }

  clearAgentName(): void {
    this.agentName = '';
    this.agentId = null;

    // Clear p-table filtering when agent is cleared
    if (this.quotationTable) {
      this.quotationTable.filterGlobal('', 'contains');
    }

    this.fetchGISQuotations();
    this.cdr.detectChanges();
  }

  clearFromDate(): void {
    this.fromDate = null;
    // If you need to reset min dates for other fields
    this.clearDateFilters();
    this.fetchGISQuotations();
    this.cdr.detectChanges();
  }

  clearToDate(): void {
    this.toDate = null;
    this.fetchGISQuotations();
    this.cdr.detectChanges();
  }

  clearFilters() {
    // Clear client
    this.clientName = '';
    this.clientCode = null;

    // Clear agent
    this.agentName = '';
    this.agentId = null;

    // Clear source
    this.selectedSource = null;

    // Clear dates
    this.clearDateFilters();

    // Clear quotation number
    this.quotationNumber = '';
    this.quoteNumber = '';

    // Clear status to null
    this.selectedStatus = null;

    // Clear p-table global filtering
    if (this.quotationTable) {
      this.quotationTable.clear();
    }

    // Fetch quotations with cleared filters
    this.fetchGISQuotations();

    // Restore the original quotation list
    this.gisQuotationList = [...this.originalQuotationList];

    // Trigger change detection
    this.cdr.detectChanges();
  }
  openClientSearchModal() {
    // Reset modal state to ensure it works consistently
    this.isClientSearchModalVisible = false;
    this.cdr.detectChanges();
    // Set to true after change detection to ensure proper modal state
    setTimeout(() => {
      this.isClientSearchModalVisible = true;
      this.cdr.detectChanges();
    }, 0);
  }

  openAgentSearchModal() {
    log.debug('Agent input clicked - modal will open and trigger agent loading...');
  }


  createQuote(type: string) {
    this.utilService.clearSessionStorageData()
    this.utilService.clearNormalQuoteSessionStorage()

    let nextPage = '/home/gis/quotation/quick-quote'
    if (type === 'NORMAL') {
      this.utilService.clearNormalQuoteSessionStorage()
      nextPage = '/home/gis/quotation/quotation-details'
    }
    this.router.navigate([nextPage]).then(r => {
    })
  }

  getAllActions(quotation: any): MenuItem[] {
    const cacheKey = `${quotation.quotationNumber}-${quotation.status}`;

    // Return cached actions if available
    if (this.actionsCache.has(cacheKey)) {
      return this.actionsCache.get(cacheKey)!;
    }

    const items = [
      {
        label: 'View',
        icon: 'pi pi-eye',
        title: this.actionDescriptions['View'],
        command: () => {
          this.viewQuote(quotation);
        }
      }
    ];

    // Only add Edit Quote if status is Draft
    if (quotation.status === 'Draft') {
      items.push({
        label: 'Edit',
        icon: 'pi pi-pencil',
        title: this.actionDescriptions['Edit'],
        command: () => this.editQuote(quotation)
      });
    }

    // Add additional actions
    items.push(
      {
        label: 'Revise Quote',
        icon: 'pi pi-sync',
        title: this.actionDescriptions['Revise'],
        command: () => this.reviseQuotation(quotation)

      },
      {
        label: 'Reuse Quote',
        icon: 'pi pi-replay',
        title: this.actionDescriptions['Reassign'],
        command: () => this.reassignQuote(quotation)
      },
      {
        label: 'Process',
        icon: 'pi pi-cog',
        title: 'Process the quote to create a policy',
        command: () => this.process(quotation)
      }
    );

    // Cache the actions
    this.actionsCache.set(cacheKey, items);

    return items;
  }


  updateTooltipPosition(event: MouseEvent): void {
    const tooltipWidth = 300;
    const tooltipHeight = 60;
    const offset = 15;

    let x = event.clientX - (tooltipWidth / 2);
    let y = event.clientY - tooltipHeight - offset;

    if (x < 10) x = 10;
    if (x + tooltipWidth > window.innerWidth - 10) x = window.innerWidth - tooltipWidth - 10;
    if (y < 10) y = event.clientY + offset;

    this.tooltipPosition = { x, y };
  }

  getFirstThreeActions(quotation: any): MenuItem[] {
    const allActions = this.getAllActions(quotation);
    return allActions.slice(0, 3);
  }

  hasMoreThanThreeActions(quotation: any): boolean {
    const allActions = this.getAllActions(quotation);
    return allActions.length > 3;
  }



  // Legacy method - kept for compatibility if needed elsewhere
  executeAction(action: MenuItem, quotation: any, event?: Event): void {
    this.immediateHideTooltip();

    if (action.command) {
      action.command({ originalEvent: event, item: action });
    }
  }

  showMoreActions(event: Event, quotation: any): void {
    this.selectedQuotation = quotation;

    // Create remaining menu items dynamically
    this.remainingMenuItems = [];

    // Add Edit if status is Draft
    if (quotation.status === 'Draft') {
      this.remainingMenuItems.push({
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editQuote(quotation)
      });
    }

    // Add other actions
    this.remainingMenuItems.push(
      {
        label: 'Reassign',
        icon: 'pi pi-user-edit',
        command: () => this.reassignQuote(quotation)
      },
      {
        label: 'Process',
        icon: 'pi pi-cog',
        command: () => this.process(quotation)
      }
    );

    this.moreActionsMenu.toggle(event);
  }

  reuseQuote(quotation: any): void {
    log.debug('Reuse quote:', quotation);
    // Implement reuse functionality here
    // For now, navigate to quotation details with the reuse flag
    sessionStorage.setItem('quoteToReuseData', JSON.stringify(quotation));
    sessionStorage.setItem('reuseQuoteFlag', 'true');
    this.router.navigate(['/home/gis/quotation/quotation-details']);
  }

  reassignQuote(quotation: any): void {
    console.log('Reassign quote:', quotation);

    // Validate required data before proceeding
    if (!quotation.quotationNumber || !quotation.quotationCode) {
      console.error('Invalid quotation data:', { quotationNumber: quotation.quotationNumber, quotationCode: quotation.quotationCode });
      this.globalMessagingService.displayErrorMessage('Error', 'Invalid quotation data. Please try again.');
      return;
    }

    // Store the selected quotation for use in reassignQuotation method
    this.selectedQuotation = quotation;

    // Open the reassign modal
    this.openReassignQuotationModal();
  }

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.quotationTable) {
      this.quotationTable.filterGlobal(filterValue, 'contains');
    }
  }

  getUsers() {
    this.claimsService.getUsers(0, 1000).subscribe({
      next: (res => {
        this.users = res;
        this.users = this.users.content;
        log.debug('users>>>', this.users)

      }),
      error: (error => {
        log.debug('error', error)
        this.globalMessagingService.displayErrorMessage('Error', 'failed to feth users')
      })
    })
  }

  filterGlobal(event: any): void {
    const value = event.target.value;
    this.globalSearch = value;
    this.reassignTable.filterGlobal(value, 'contains');
  }


  filterByFullName(event: any): void {
    const value = event.target.value;
    this.reassignTable.filter(value, 'name', 'contains');
  }

  onUserSelect(): void {
    if (this.selectedUser) {
      log.debug("Selected user>>>", this.selectedUser);
      this.globalSearch = this.selectedUser.id;
      this.fullNameSearch = this.selectedUser.name;
      this.fetchGroupedUserDetails(this.selectedUser);
    }
  }

  onUserUnselect(): void {
    this.selectedUser = null;
    this.globalSearch = '';
    this.fullNameSearch = '';
  }

  fetchGroupedUserDetails(selectedUser: any) {
    const groupedUserId = selectedUser.id;
    this.quotationService.getGroupedUserDetails(groupedUserId)
      .subscribe({
        next: (res: GroupedUser[]) => {
          this.groupUsers = res;

          // Find the team leader
          const groupLeader = res.find(user => user.isTeamLeader === "Y");
          if (groupLeader) {
            this.selectedGroupUserId = groupLeader.id;
            this.groupLeaderName = groupLeader.userDetails.name;
          }
        },
        error: (error) => {
          console.error("Error fetching group users", error);
        }
      });
  }

  /**
   * Common validation for reassignment
   * @returns true if validation passes, false otherwise
   */
  private validateReassignment(): boolean {
    if (!this.userToReassignQuotation) {
      this.noUserChosen = true;
      setTimeout(() => {
        this.noUserChosen = false;
      }, 3000);
      return false;
    }

    if (!this.reassignQuotationComment) {
      this.noCommentLeft = true;
      setTimeout(() => {
        this.noCommentLeft = false;
      }, 3000);
      return false;
    }

    return true;
  }

  /**
   * Common cleanup after successful reassignment
   */
  private cleanupAfterReassignment(): void {
    this.closeReassignQuotationModal();
    this.onUserUnselect();
    this.fetchGISQuotations();
  }

  /**
   * Main reassignment method for quotations
   */
  reassignQuotation() {
    if (!this.validateReassignment()) {
      return;
    }

    // Get quotation code from the selected quotation
    if (!this.selectedQuotation || !this.selectedQuotation.quotationCode) {
      log.warn('No quotation selected for reassignment');
      this.globalMessagingService.displayWarningMessage('Warning', 'No quotation selected');
      return;
    }

    const quotationCode = this.selectedQuotation.quotationCode;

    log.debug('Selected Quotation:', this.selectedQuotation);
    log.debug('Quotation to Code:', quotationCode);


    // Call getTaskById service to get the taskId 
    this.quotationService.getTaskById(quotationCode.toString()).pipe(
      switchMap((response) => {
        log.debug('Task details from getTaskById:', response);

        // Extract taskId from response
        const taskId = response?.taskId;
        const newAssignee = this.userToReassignQuotation;

        if (!taskId) {
          throw new Error('Task ID not found in response');
        }

        log.debug('Extracted taskId:', taskId);
        log.debug('New assignee:', newAssignee);

        // Call reassignTicket service with the extracted taskId
        return this.quotationService.reassignTicket(taskId, newAssignee, this.reassignQuotationComment);
      }),
      untilDestroyed(this)
    ).subscribe({
      next: (reassignResponse) => {
        log.debug('Quotation reassigned successfully:', reassignResponse);
        this.globalMessagingService.displaySuccessMessage('Success', 'Quotation reassigned successfully');
        this.cleanupAfterReassignment();
        this.fetchGISQuotations();
      },
      error: (error) => {
        log.error('Error during reassignment:', error);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to reassign quotation');
      }
    });
  }

  closeModal(): void {
    // Try using the close button if it exists
    if (this.closeReassignButton?.nativeElement) {
      this.closeReassignButton.nativeElement.click();
    } else {
      // Fallback: Use Bootstrap modal API to close the modal
      const modalElement = document.getElementById('reassignQuotation');
      if (modalElement) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  openReassignQuotationModal() {
    this.getUsers();
    this.openModals('reassignQuotation');
  }

  closeReassignQuotationModal() {
    this.userToReassignQuotation = null;
    this.reassignQuotationComment = '';
    this.selectedUser = null;
    this.selectedQuotation = null;
    this.noUserChosen = false;
    this.noCommentLeft = false;
    this.closeModals('reassignQuotation');
  }

  openChooseUserReassignModal() {
    this.closeModals('reassignQuotation');
    this.openModals('chooseUserReassign');
  }

  closeChooseUserReassignModal(): void {
    this.selectedUser = null;
    this.noUserChosen = false;
    this.closeModals('chooseUserReassign');
  }

  selectUser() {
    if (!this.selectedUser) {
      this.noUserChosen = true;
      setTimeout(() => {
        this.noUserChosen = false;
      }, 3000);
      return;
    }

    this.userToReassignQuotation = this.selectedUser.name;
    this.closeModals('chooseUserReassign');
    this.openModals('reassignQuotation');
  }


  //  getuser(): void {
  //   this.user = this.authService.getCurrentUserName();
  //   this.userDetails = this.authService.getCurrentUser();
  //   log.info('Login UserDetails', this.userDetails);
  //   this.currencyDelimiter = this.userDetails?.currencyDelimiter;
  //   log.debug('Organization currency delimiter', this.currencyDelimiter);
  //   sessionStorage.setItem('currencyDelimiter', this.currencyDelimiter);
  // }


  getActionIcon(actionLabel: string): string {
    return this.actionIcons[actionLabel] || 'pi pi-info-circle';
  }


  showMenuTooltip(actionLabel: string, event: MouseEvent): void {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
      this.tooltipTimer = null;
    }
    this.hoveredAction = actionLabel;
    this.updateTooltipPosition(event);
  }

  hideMenuTooltip(): void {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
    }

    this.hoveredAction = null;
    this.tooltipTimer = null;

  }





  fetchCurrencies() {
    this.bankService.getCurrencies()
      .subscribe({
        next: (currencies: any[]) => {
          // CURRENCIES
          this.currency = currencies.map((value) => {
            let capitalizedDescription = value.name.charAt(0).toUpperCase() + value.name.slice(1).toLowerCase();
            return { ...value, name: capitalizedDescription };
          });

          log.info(this.currency, 'this is a currency list');

          const defaultCurrency = this.currency.find(currency => currency.currencyDefault === 'Y');
          if (defaultCurrency) {
            log.debug('DEFAULT CURRENCY', defaultCurrency);
            this.defaultCurrency = defaultCurrency;
            this.defaultCurrencyName = defaultCurrency.name;
            this.defaultCurrencySymbol = defaultCurrency.symbol;
            sessionStorage.setItem('currencySymbol', this.defaultCurrencySymbol);

            log.debug('DEFAULT CURRENCY Name', this.defaultCurrencyName);
            log.debug('DEFAULT CURRENCY Symbol', this.defaultCurrencySymbol);
          }
        },
        error: (error) => {
          console.error("Error fetching group users", error);
        }
      });
  }

  hideTooltip(): void {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
    }

    this.tooltipTimer = setTimeout(() => {
      this.hoveredAction = null;
      this.tooltipTimer = null;
    }, 5);
  }


  getTooltipDescription(actionLabel: string): string {
    return this.actionDescriptions[actionLabel] || '';
  }

  showTooltip(actionLabel: string, event: MouseEvent): void {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
      this.tooltipTimer = null;
    }

    this.hoveredAction = actionLabel;
    this.updateTooltipPosition(event);
  }
  getUser() {
    this.user = this.authService.getCurrentUserName();
    log.debug("Username", this.user)
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    this.user = this.userDetails.fullName || this.authService.getCurrentUserName();
    this.userCode = this.userDetails.code;
    log.debug('User Code ', this.userCode);
    this.fetchSystemsAssignedToUser(this.userCode)

  }

  // fetchSystemsAssignedToUser(userId: number) {
  //   this.quotationService.getSystemsAssignedToUser(userId)
  //     .subscribe({
  //       next: (systems: any[]) => {
  //         this.systemsAssigned = systems
  //         log.debug("Systems assigned to logged in user", this.systemsAssigned)
  //         this.setVisibleTabs();
  //       },
  //       error: (error) => {
  //         console.error("Error fetching group users", error);
  //       }
  //     });
  // }
  fetchSystemsAssignedToUser(userId: number) {
    this.quotationService.getSystemsAssignedToUser(userId)
      .subscribe({
        next: (systems: any[]) => {
          // Filter core systems
          const coreSystems = systems.filter(s => s.isCoreSystem === 'Y');
          this.systemsAssigned = coreSystems;
          sessionStorage.setItem('systemsAssigned', JSON.stringify(this.systemsAssigned))

          // Extract shortDesc values for easier checking
          const assignedSystems = coreSystems.map(s => s.shortDesc);

          // Set visibleTabs based on assigned systems
          this.visibleTabs.LMS = assignedSystems.includes('LMS');
          this.visibleTabs.LMS_ORD = assignedSystems.includes('LMS_ORD');
          this.visibleTabs.GIS = assignedSystems.includes('GIS');
          this.visibleTabs.PENSION = assignedSystems.includes('PENSION');

          // Determine whether to show tabs (your existing logic)
          const visibleTabKeys = Object.entries(this.visibleTabs)
            .filter(([_, visible]) => visible)
            .map(([key]) => key);

          this.showTabs = !(visibleTabKeys.length === 1 && visibleTabKeys.includes('GIS'));

          console.log('Visible Tabs:', this.visibleTabs);
          console.log('Show Tabs:', this.showTabs);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error("Error fetching group users", error);
        }
      });
  }

  // private setVisibleTabs() {
  //   this.visibleTabs = {
  //     LMS: this.hasSystem('LMS'),
  //     GIS: this.hasSystem('GIS'),
  //     LMS_ORD: this.hasSystem('LMS_ORD')
  //   };
  //   console.log("Visible Tabs:", this.visibleTabs);

  //   const coreSystems = Object.entries(this.visibleTabs)
  //     .filter(([_, visible]) => visible)
  //     .map(([key]) => key);
  //   console.log("Core Systems:", coreSystems);

  //   this.showTabs = !(coreSystems.length === 1 && coreSystems.includes('GIS'));
  //   console.log("Show Tabs:", this.showTabs);
  // }


  // private hasSystem(shortDesc: string): boolean {
  //   return this.systemsAssigned.some(
  //     s => s.shortDesc === shortDesc && s.isCoreSystem === 'Y'
  //   );
  // }

}
