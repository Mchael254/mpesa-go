import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Logger, untilDestroyed } from 'src/app/shared/shared.module';
import { QuotationList, Sources, UserDetails } from '../../data/quotationsDTO';
import { FormBuilder } from '@angular/forms';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import { Products } from '../../../setups/data/gisDTO';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SidebarMenu } from 'src/app/features/base/model/sidebar.menu';
import { MenuService } from 'src/app/features/base/services/menu.service';
import { Router } from '@angular/router';
const log = new Logger('ReviseReuseQuotationComponent');

@Component({
  selector: 'app-quotation-inquiry',
  templateUrl: './quotation-inquiry.component.html',
  styleUrls: ['./quotation-inquiry.component.css']
})
export class QuotationInquiryComponent {
  user: string;
  userDetails: any;
  dateFormat: string;
  selectedDateFrom: string;
  sourceList: any;
  sourceDetail: Sources[] = [];
  gisQuotationList: QuotationList[] = [];
  selectedDateTo: string;
  selectedSource: string;
  productList: Products[];
  ProductDescriptionArray: any = [];
  selectedProduct: Products[];
  selectedProductCode: any;
  statuses = [
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Lapsed', value: 'Lapsed' },
    { label: 'Draft', value: 'Draft' }
  ];
  selectedStatus: string = ''; // Holds the selected value
  productName: string = '';
  productCode: number;
  quotationSubMenuList: SidebarMenu[];

  constructor(
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    public sharedService: SharedQuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public fb: FormBuilder,
    public quotationService: QuotationsService,
    public productService: ProductsService,
    public menuService: MenuService,
    public router: Router

  ) { }

  ngOnInit(): void {
    this.getuser();
    this.loadAllQoutationSources();
    this.fetchGISQuotations();
    this.loadAllproducts();
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.dynamicSideBarMenu(this.quotationSubMenuList[5]);
  }
  ngOnDestroy(): void { }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
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
    const selectedDateFrom = date;
    if (selectedDateFrom) {
      const SelectedFormatedDate = this.formatDate(selectedDateFrom)
      this.selectedDateFrom = SelectedFormatedDate
      log.debug(" SELECTED FORMATTED DATE from:", this.selectedDateFrom)
      // this.fetchGISQuotations()
    }
  }

  onDateToInputChange(date: any) {
    log.debug('selected Date To raaw', date);
    const selectedDateTo = date;
    if (selectedDateTo) {
      const SelectedFormatedDateTo = this.formatDate(selectedDateTo)
      this.selectedDateTo = SelectedFormatedDateTo
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

  fetchGISQuotations() {
    const clientType = null
    const clientCode = null
    const productCode = this.productCode|| null
    const agentCode = null
    const quotationNumber = null
    const status = null
    const dateFrom = this.selectedDateFrom || null
    const dateTo = this.selectedDateTo || null
    const source = this.selectedSource
    const clientName = null

    log.debug("Selected Date from:", this.selectedDateFrom)
    log.debug("Selected Date to:", this.selectedDateTo)

    this.quotationService
      .searchQuotations(0, 10000, clientType, clientCode, productCode, dateFrom, dateTo, agentCode, quotationNumber, status, source, clientName)
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
  /**
 * Loads all products by making an HTTP GET request to the ProductService.
 * Retrieves a list of products and updates the component's productList property.
 * Also logs the received product list for debugging purposes.
 * @method loadAllProducts
 * @return {void}
 */
  loadAllproducts() {
    const productDescription = [];
    const modifiedArray = [];

    this.productService.getAllProducts().subscribe((data) => {
      this.productList = data;
      log.info(this.productList, 'this is a product list');
      this.productList.forEach((product) => {
        // Access each product inside the callback function
        let capitalizedDescription =
          product.description.charAt(0).toUpperCase() +
          product.description.slice(1).toLowerCase();
        productDescription.push({
          code: product.code,
          description: capitalizedDescription,
        });
      });

      // Combine the characters back into words
      const combinedWords = productDescription.join(',');
      this.ProductDescriptionArray.push(...productDescription);

      // Now 'combinedWords' contains the result with words instead of individual characters
      log.info('modified product description', this.ProductDescriptionArray);

      this.cdr.detectChanges();
    });
  }
  /**
* Handles the selection of a product.
* - Retrieves the selected product code from the event.
* - Fetches and loads product subclasses.
* - Loads dynamic form fields based on the selected product.
* @method onProductSelected
* @param {any} event - The event triggered by product selection.
* @return {void}
*/
  // onProductSelected(selectedValue: any) {
  //   this.selectedProductCode = selectedValue.code;
  //   log.debug('Selected Product Code:', this.selectedProductCode);


  // }
  openClientSearch() {
    const modal = document.getElementById('productSearchModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }
  onProductSelected(event: { productName: string; productCode: number }) {
    this.productName = event.productName;
    this.productCode = event.productCode;

    // Optional: Log for debugging
    log.debug('Selected Product:', event);

    // Call fetchQuotations when the client code changes
    this.fetchGISQuotations(); // You can adjust `first` and `rows` as need
  }
}
