import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { QuotationList, Status, StatusEnum } from '../../data/quotationsDTO';
import { Logger, UtilService } from '../../../../../../shared/services';
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';
import { Router } from '@angular/router';
import { SidebarMenu } from '../../../../../base/model/sidebar.menu';
import { MenuService } from '../../../../../base/services/menu.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Table } from 'primeng/table';
import { NgxCurrencyConfig } from 'ngx-currency';

const log = new Logger('QuotationConcersionComponent');

@Component({
  selector: 'app-quotation-management',
  templateUrl: './quotation-management.component.html',
  styleUrls: ['./quotation-management.component.css']
})


export class QuotationManagementComponent {
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



  constructor(
    private menuService: MenuService,
    private router: Router,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private utilService: UtilService,

  ) {

    this.menuItems = [];
  }

  ngOnInit(): void {
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.dynamicSideBarMenu(this.quotationSubMenuList[6]);
    this.initializeCurrency();
    this.fetchGISQuotations();

  }

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

  ngOnDestroy(): void { }

  toggleMenu(event: Event, quotation: any) {
    this.selectedQuotation = quotation;

    // Create base menu items
    const items = [
      {
        label: 'View',
        command: () => this.viewQuote(quotation)
      }
    ];

    // Only add Edit Quote if status is Draft
    if (quotation.status === 'Draft') {
      items.push({
        label: 'Edit Quote',
        command: () => this.editQuote(quotation)
      });
    }

    // Add the rest of the items
    items.push(
      // {
      //   label: 'Revise Quote',
      //   command: () => this.printQuote(quotation)
      // },
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
    log.debug('View quote clicked:', quotation);
    this.setQuotationNumber(
      quotation.quotationCode,
      quotation.quotationNumber,
      quotation.clientCode
    );
  }
  process(quotation: QuotationList): void {
    log.debug('View quote clicked:', quotation);
    this.processSelectedQuote(
      quotation.quotationCode,
      quotation.quotationNumber,
      quotation.clientCode
    );
  }
  setQuotationNumber(quotationCode: number, quotationNumber: string, clientCode: number): void {
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


      this.router.navigate(['/home/gis/quotation/quotation-summary']);
    }
  }
  processSelectedQuote(quotationCode: number, quotationNumber: string, clientCode: number): void {
    if (quotationNumber && quotationNumber.trim() !== '') {
      sessionStorage.setItem('quotationNum', quotationNumber);
      sessionStorage.setItem('quotationCode', JSON.stringify(quotationCode));




      this.router.navigate(['/home/gis/quotation/quotation-summary']);
    }
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

          log.debug("LIST OF GIS QUOTATIONS ", this.gisQuotationList);

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
  reviseQuote(selectedQuotation: any) {
    log.debug("Selected Quote to be revised:", selectedQuotation)
    const quotationCode = selectedQuotation.quotationCode
    if (quotationCode) {
      this.quotationService
        .reviseQuotation(quotationCode)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (response: any) => {
            const revisedQuoteNumber = response._embedded.quotationNumber
            log.debug("Revised Quotation number ", revisedQuoteNumber);
            sessionStorage.setItem('revisedQuotationNo', revisedQuoteNumber);
            if (revisedQuoteNumber) {

              this.router.navigate(['/home/gis/quotation/quotation-summary']);
            }

          },
          error: (error) => {
            this.globalMessagingService.displayErrorMessage('Error', error.error.message);
          }
        });
    }

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
    const items = [
      {
        label: 'View',
        command: () => this.viewQuote(quotation)
      }
    ];

    // Only add Edit Quote if status is Draft
    if (quotation.status === 'Draft') {
      items.push({
        label: 'Edit',
        command: () => this.editQuote(quotation)
      });
    }

    // Add additional actions
    items.push(
      {
        label: 'Revise',
        command: () => this.reviseQuote(quotation)
      },
      {
        label: 'Reuse',
        command: () => this.reuseQuote(quotation)
      },
      {
        label: 'Reassign',
        command: () => this.reassignQuote(quotation)
      },
      {
        label: 'Edit',
        command: () => this.process(quotation)
      }
      // {
      //   label: 'Print',
      //   command: () => this.printQuote(quotation)
      // },
      // {
      //   label: 'Delete',
      //   command: () => this.deleteQuote(quotation)
      // }
    );

    return items;
  }

  getFirstThreeActions(quotation: any): MenuItem[] {
    const allActions = this.getAllActions(quotation);
    return allActions.slice(0, 3);
  }

  hasMoreThanThreeActions(quotation: any): boolean {
    const allActions = this.getAllActions(quotation);
    return allActions.length > 3;
  }


  executeAction(action: MenuItem, quotation: any, event?: Event): void {
    if (action.command) {
      action.command({ originalEvent: event, item: action });
    }
  }

  showMoreActions(event: Event, quotation: any): void {
    this.selectedQuotation = quotation;
    const allActions = this.getAllActions(quotation);
    this.remainingMenuItems = allActions.slice(3);
    this.moreActionsMenu.toggle(event);
  }

  reuseQuote(quotation: any): void {
    console.log('Reuse quote:', quotation);
  }

  reassignQuote(quotation: any): void {
    console.log('Reassign quote:', quotation);

  }

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.quotationTable) {
      this.quotationTable.filterGlobal(filterValue, 'contains');
    }
  }


}

