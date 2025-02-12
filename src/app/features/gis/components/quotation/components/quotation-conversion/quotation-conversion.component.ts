import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarMenu } from '../../../../../base/model/sidebar.menu';
import { MenuService } from '../../../../../base/services/menu.service';
import { QuotationsService } from '../../../../../gis/services/quotations/quotations.service';
import { QuotationDetails, QuotationList, QuotationProduct, Status, StatusEnum } from '../../data/quotationsDTO';
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { Logger } from '../../../../../../shared/services';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Products } from '../../../setups/data/gisDTO';
import  { QuotationsService as Q2 } from '../../services/quotations/quotations.service';
import { Policy } from '../../../policy/data/policy-dto';


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

  selectedStatus: Status;
  selectedDateFrom: string;
  selectedDateTo: string;
  selectedSource: string;
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
  productCode: number;
  productList: Products[];
  ProductDescriptionArray: any = [];
  productName: string = '';
  quotationNumber: string = '';
  quoteNumber: string = "";
  selectedQuotation: QuotationList;
  status: Status[] = [
    { status: StatusEnum.Lapsed },
    { status: StatusEnum.Confirmed },
    { status: StatusEnum.Pending },
    { status: StatusEnum.Rejected },
    { status: StatusEnum.None },
    { status: StatusEnum.Accepted },
    { status: StatusEnum.Draft }
  ];
  quotationDetails: QuotationDetails;
  quotationProducts: QuotationProduct[];
  selectedQuotationProduct:QuotationProduct;
  policyData: Policy[];
  selectedPolicy: Policy;
  globalFilterFields = ['policyNumber'];
  policyNumber: number;
  showModal: boolean = false;

  constructor(
    private menuService: MenuService,
    private router: Router,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public productService: ProductsService,
    public quotationsService: Q2

  ) { }

  ngOnInit(): void {
    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.dynamicSideBarMenu(this.quotationSubMenuList[3]);
    this.fetchGISQuotations();

  }

  ngOnDestroy(): void { }

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

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  }

  onInputChange() {
    this.quoteNumber = this.quotationNumber;
  }

  //fetch the quotations with specific serach parameters
  fetchGISQuotations() {
    log.debug("Quotation Number entered:", this.quoteNumber);
    const clientType = null
    const clientCode = this.clientCode || null
    const productCode = this.productCode || null
    const agentCode = this.agentId || null
    const quotationNumber = this.quoteNumber
    const status = this.selectedStatus?.status || null;
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

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch quotation list. Try again later');
        }
      }
      );
  }

  formatFieldName(field: string): string {
    // Replace underscores with spaces and capitalize first letters
    return field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
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

  onProductSelected(event: { productName: string; productCode: number }) {
    this.productName = event.productName;
    this.productCode = event.productCode;

    // Optional: Log for debugging
    log.debug('Selected Product:', event);

    // Call fetchQuotations when the client code changes
    // this.fetchGISQuotations(); // You can adjust `first` and `rows` as need
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

  clearFilters() {
    // Clear client
    this.clientName = '';
    this.clientCode = null;

    // Clear agent
    this.agentName = '';
    this.agentId = null;

    // Clear product
    this.productName = '';
    this.productCode = null;

    // Clear source
    this.selectedSource = null;

    // Clear dates
    this.clearDateFilters()

    // Clear quotation number
    this.quotationNumber = '';
    this.quoteNumber = '';

    // Clear status to null
    this.selectedStatus = null;

    // Restore the original quotation list
    this.gisQuotationList = [...this.originalQuotationList];

    // Trigger change detection
    this.cdr.detectChanges();
  }
  onQuotationSelect(quotationItem: any): void {
    this.selectedQuotation = quotationItem;
    log.debug('Selected Quotation item:', this.selectedQuotation);
    if (this.selectedQuotation) {
      this.loadClientQuotation()
    }
  }
  loadClientQuotation() {
    log.debug("Load CLient quotation has been called")
    const selectedQuotationNo = this.selectedQuotation.quotationNumber
    this.quotationService.getClientQuotations(selectedQuotationNo).subscribe((data: QuotationDetails) => {
      this.quotationDetails = data;
      log.debug("Quotation Details:", this.quotationDetails)
      this.quotationProducts = this.quotationDetails.quotationProducts

    })
  }
  convertToPolicy(){
    log.debug("Selected Quotation Product", this.selectedQuotationProduct)
    if(!this.selectedQuotationProduct){
      this.globalMessagingService.displayInfoMessage('Error', 'Select a quotation product to continue');
    }else{
      const selctedQuotationCode = this.selectedQuotationProduct.quotCode
      this.quotationService.convertQuoteToPolicy(selctedQuotationCode).subscribe(data => {
        log.debug("Response after converting quote to a policy:", data)

      })
    }

  }
  onProductSelection(event: Event, product: any): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      // Add the product to the selectedProducts array
      this.selectedQuotationProduct= product;
      log.debug('Product selected:', product);
    } else {
      // // Remove the product from the selectedProducts array
      // this.selectedQuotationProduct = this.selectedQuotationProduct.filter(
      //   (p) => p.id !== product.id
      // );
      // console.log('Product deselected:', product);
    }

   log.debug('Current selected products:', this.selectedQuotationProduct);
  }

  openPolicyModal(): void {
    if (this.selectedQuotationProduct) {
      this.showModal = true;
      document.body.classList.add('modal-open'); // Prevents background scrolling
    } else {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a quotation product to continue');
    }
  }

  closeModal(): void {
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }

  fetchPolicies() {
    log.debug("fetch policies");
    const productCode = this.selectedQuotationProduct.product;
    const quotationCode = this.selectedQuotationProduct.quotCode;


    this.quotationsService.getPolicies(quotationCode, productCode)
      .subscribe((data: Policy[]) => {
        log.debug("Response after fetching policies:", data);

        this.policyData = data;
      }
    );
  }

  loadPolicyDetails(policyData) {
    log.debug("load policy details");

    this.selectedPolicy = policyData;
  }

  inputPolicyNumber(event) {
    const value = (event.target as HTMLInputElement).value;
    this.policyNumber = Number(value);
  }

  mergeQuoteToPolicy() {
    log.debug("merge to policy button clicked");


  }


}
