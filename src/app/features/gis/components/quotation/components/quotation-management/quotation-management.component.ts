import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { QuotationList, Status, StatusEnum } from '../../data/quotationsDTO';
import { Logger } from '../../../../../../shared/services';
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';
import { Router } from '@angular/router';
import { SidebarMenu } from '../../../../../base/model/sidebar.menu';
import { MenuService } from '../../../../../base/services/menu.service';
import {QuotationsService} from '../../services/quotations/quotations.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import {MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

const log = new Logger('QuotationConcersionComponent');

@Component({
  selector: 'app-quotation-management',
  templateUrl: './quotation-management.component.html',
  styleUrls: ['./quotation-management.component.css']
})


export class QuotationManagementComponent {
  @ViewChild('menu') menu: Menu;

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

  constructor (
    private menuService: MenuService,
    private router: Router,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
  ) {
    this.menuItems = [
      {
        label: 'View Quote',
        // icon: 'pi pi-eye',
        command: (event) => this.viewQuote(this.selectedQuotation)
      },
      {
        label: 'Edit Quote',
        // icon: 'pi pi-pencil',
        command: (event) => this.editQuote(this.selectedQuotation)
      },
      {
        label: 'Revise Quote',
        // icon: 'pi pi-print',
        command: (event) => this.printQuote(this.selectedQuotation)
      },
      {
        label: 'Reuse Quote',
        // icon: 'pi pi-trash',
        command: (event) => this.deleteQuote(this.selectedQuotation)
      },
      {
        label: 'Reassign Quote',
        // icon: 'pi pi-trash',
        command: (event) => this.deleteQuote(this.selectedQuotation)
      }
    ];
  }

  ngOnInit(): void {
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.dynamicSideBarMenu(this.quotationSubMenuList[2]);
    this.fetchGISQuotations();

  }

  ngOnDestroy(): void { }

  toggleMenu(event: Event, quotation: any) {
    this.selectedQuotation = quotation;
    this.menu.toggle(event);
  }

  viewQuote(quotation: any): void {
    console.log('View quote clicked:', quotation);
    this.setQuotationNumber(
      quotation.quotationNumber,
      quotation.productCode,
      quotation.clientCode
    );
  }

  setQuotationNumber(quotationNumber: string, productCode: number, clientCode: number): void {
    if (quotationNumber && quotationNumber.trim() !== '') {
      sessionStorage.setItem('quotationNum', quotationNumber);
      if (productCode != null) {
        sessionStorage.setItem('productCode', productCode.toString());
      } else {
        console.warn('Invalid productCode:', productCode);
      }
      if (clientCode != null) {
        sessionStorage.setItem('clientCode', clientCode.toString());
      } else {
        console.warn('Invalid clientCode:', clientCode);
      }
      console.debug(`Quotation number ${quotationNumber} has been saved to session storage.`);
      console.debug(`ClientCode ${clientCode} has been saved to session storage.`);
      console.debug(`ProductCode ${productCode} has been saved to session storage.`);
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
    console.log('Edit quote:', quotation);
  }

  printQuote(quotation: any) {
    // Implement print quote functionality
    console.log('Print quote:', quotation);
  }

  deleteQuote(quotation: any) {
    // Implement delete quote functionality
    console.log('Delete quote:', quotation);
  }

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
    const clientName = null

    log.debug("clientCode", clientCode);
    log.debug("productCode", productCode);
    log.debug("agentCode", agentCode);
    log.debug("status", status);
    log.debug("quote", quotationNumber);

    log.debug("Selected Date from:", this.selectedDateFrom)
    log.debug("Selected Date to:", this.selectedDateTo)

    this.quotationService
      .searchQuotations(
        0,
        10000,
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

  onClientSelected(event: { clientName: string; clientCode: number }) {
    this.clientName = event.clientName;
    this.clientCode = event.clientCode;

    // Optional: Log for debugging
    log.debug('Selected Client:', event);

  }

  onAgentSelected(event: { agentName: string; agentId: number }) {
    this.agentName = event.agentName;
    this.agentId = event.agentId;

    // Optional: Log for debugging
    log.debug('Selected Agent:', event);
    log.debug("AgentId", this.agentId);

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
      // this.fetchGISQuotations();
    }
  }

  onDateToInputChange(date: any) {
    log.debug('selected Date To raaw', date);
    const selectedDateTo = date;
    if (selectedDateTo) {
      const SelectedFormatedDateTo = this.formatDate(selectedDateTo)
      this.selectedDateTo = SelectedFormatedDateTo
      log.debug(" SELECTED FORMATTED DATE to:", this.selectedDateTo)
      // this.fetchGISQuotations();
    }
  }

  // onExpiryDateInputChange(date: any) {
  //   log.debug('selected expiry date raaw', date);
  //   const selectedExpiryDate = date;
  //   if (selectedExpiryDate) {
  //     const SelectedFormatedExpiryDate = this.formatDate(selectedExpiryDate)
  //     this.selectedExpiryDate = SelectedFormatedExpiryDate
  //     log.debug(" SELECTED FORMATTED EXPIRY DATE:", this.selectedExpiryDate)
  //   }
  // }

  clearDateFilters(): void {
    this.fromDate = null;
    this.toDate = null;
    this.minToDate = null;
    this.expiryDate = null;

    // Reset to original data
    this.gisQuotationList = [...this.originalQuotationList];
    this.tableDetails = {
      rows: this.gisQuotationList,
      totalElements: this.gisQuotationList.length
    };
    this.cdr.detectChanges();
  }

}
