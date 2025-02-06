import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service'
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { QuotationList, Sources, UserDetails } from '../../data/quotationsDTO';
import { FormBuilder } from '@angular/forms';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { SidebarMenu } from '../../../../../base/model/sidebar.menu';
import { MenuService } from '../../../../../base/services/menu.service';
import { Router } from '@angular/router';

const log = new Logger('ReviseReuseQuotationComponent');

@Component({
  selector: 'app-revise-reuse-quotation',
  templateUrl: './revise-reuse-quotation.component.html',
  styleUrls: ['./revise-reuse-quotation.component.css']
})
export class ReviseReuseQuotationComponent {

  user: string;
  userDetails: any;
  dateFormat: string;
  selectedDateFrom: string;
  sourceList: any;
  sourceDetail: Sources[] = [];
  gisQuotationList: QuotationList[] = [];
  selectedDateTo: string;
  selectedSource:string;
  quotationSubMenuList: SidebarMenu[];
  clientName: string = '';
  clientCode: number;
  quotationNumber: string;
  fromDate: Date | null = null;
  toDate: Date | null = null;

  constructor(
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    public sharedService: SharedQuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public fb: FormBuilder,
    public quotationService: QuotationsService,
    private menuService: MenuService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.getuser();
    this.loadAllQoutationSources();
    this.fetchGISQuotations();
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.dynamicSideBarMenu(this.quotationSubMenuList[4]);
  }
  ngOnDestroy(): void { }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  }

  setQuotationNumber(quotationNumber: string, productCode: number, clientCode: number): void {
    sessionStorage.setItem('quotationNum', quotationNumber);
    sessionStorage.setItem('productCode', JSON.stringify(productCode));
    sessionStorage.setItem('clientCode', JSON.stringify(clientCode));
    log.debug(`Quotation number ${quotationNumber} has been saved to session storage.`);
    log.debug(`ClientCode ${clientCode} has been saved to session storage.`);
    log.debug(`Productcode ${productCode} has been saved to session storage.`);
    this.router.navigate(['/home/gis/quotation/quotation-summary']);
  }

  /**
  * Retrieves user information from the authentication service.
  * - Sets the 'user' property with the current user's name.
  * - Sets the 'userDetails' property with the current user's details.
  * - Logs the user details for debugging purposes.
  * - Retrieves and sets the 'userBranchId' property with the branch ID from user details.
  * @method getUser
  * @return {void}
  */
  getuser() {
    this.user = this.authService.getCurrentUserName();
    this.userDetails = this.authService.getCurrentUser();
    log.debug('User Details:', this.userDetails);
    log.debug('User:', this.user);

    this.dateFormat = this.userDetails?.orgDateFormat;
    log.debug('Organization Date Format:', this.dateFormat);

  }
  onDateFromInputChange(date: any) {
    log.debug('selected Date from raaw', date);
    this.fromDate = date;
    if(this.fromDate){
    const SelectedFormatedDate = this.formatDate(this.fromDate)
    this.selectedDateFrom=SelectedFormatedDate
    log.debug(" SELECTED FORMATTED DATE from:", this.selectedDateFrom)
    // this.fetchGISQuotations()
    }
  }

  onDateToInputChange(date: any) {
    log.debug('selected Date To raaw', date);
    this.toDate = date;
    if(this.toDate){
    const SelectedFormatedDateTo = this.formatDate(this.toDate)
    this.selectedDateTo=SelectedFormatedDateTo
    log.debug(" SELECTED FORMATTED DATE to:", this.selectedDateTo)
    // this.fetchGISQuotations()
    }
  }
  /**
 * Loads all quotation sources.
 * - Subscribes to 'getAllQuotationSources' from QuotationService.
 * - Populates 'sourceList' and assigns 'sourceDetail'.
 * - Logs source details.
 * @method loadAllQuotationSources
 * @return {void}
 */
  loadAllQoutationSources() {
    this.quotationService.getAllQuotationSources().subscribe((data) => {
      this.sourceList = data;
      this.sourceDetail = data.content;
      log.debug(this.sourceDetail, 'Source list');
      log.debug(this.sourceList, 'Source list');
    });
  }
  onSourceSelected(selectedValue: any) {

    this.selectedSource = selectedValue;

    log.debug('Selected Source:', this.selectedSource);


  }

  fetchGISQuotations() {
    const clientType= null
    const clientCode = this.clientCode || null
    const productCode = null
    const quotationNumber= this.quotationNumber || null
    const status= "Confirmed"
    const dateFrom =this.selectedDateFrom || null
    const dateTo =this.selectedDateTo || null
    const source =this.selectedSource
    const clientName = this.clientName || null
    const agentCode=null

    log.debug("Selected Date from:",this.selectedDateFrom)
    log.debug("Selected Date to:",this.selectedDateTo)

    this.quotationService
      .searchQuotations(0, 10,clientType,clientCode,productCode,dateFrom,dateTo,agentCode,quotationNumber,status,source,clientName)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.gisQuotationList = response._embedded
          log.debug("LIST OF GIS QUOTATIONS ", this.gisQuotationList);

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch quotation list. Try again later');
        }
      });
  }
  formatDate(date: Date): string {
    log.debug("Date (formatDate method):", date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  onClientSelected(event: { clientName: string; clientCode: number }) {
    this.clientName = event.clientName;
    this.clientCode = event.clientCode;

    // Optional: Log for debugging
    log.debug('Selected Client:', event);

    // Call fetchQuotations when the client code changes
    // this.fetchGISQuotations();
  }
  onQuotationBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.quotationNumber = inputElement.value;
    log.debug('Quotation number:', this.quotationNumber);

  }
  clearDateFilters(): void {
    this.selectedDateFrom = null;
    this.selectedDateTo = null;
    this.fromDate = null
    this.toDate = null
    this.cdr.detectChanges();
  }
  clearFilters() {
    // Clear client
    this.clientName = '';
    this.clientCode = null;

   
    // Clear source
    this.selectedSource = null;

    // Clear date from
    this.selectedDateFrom = null;
    this.clearDateFilters();

    // Clear date to
    this.selectedDateTo = null;


    // Clear quotation number
    this.quotationNumber = '';
    // Clear status to null
   this.fetchGISQuotations()    // Trigger change detection
    this.cdr.detectChanges();
  }
}
