import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { tap } from 'rxjs';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import { Pagination } from '../../data/common/pagination';
import { GlobalMessagingService } from '../../services/messaging/global-messaging.service';
import { Logger, untilDestroyed } from '../../shared.module';
import { Products } from 'src/app/features/gis/components/setups/data/gisDTO';
import { ProductsService } from 'src/app/features/gis/components/setups/services/products/products.service';

// const log = new Logger('ProductSearchModalComponent');

@Component({
  selector: 'app-product-search-modal',
  templateUrl: './product-search-modal.component.html',
  styleUrls: ['./product-search-modal.component.css']
})
export class ProductSearchModalComponent {

  @ViewChild('closebutton') closebutton;
  @Output() productSelected = new EventEmitter<{ productName: string; productCode: number }>();


  tableDetails: any = {
    rows: [], // Initially empty array for rows
    totalElements: 0 // Default total count
  };
  pageSize: number = 20;
  isSearching = false;
  searchTerm = '';
  // public clientsData: Pagination<ClientDTO> = <Pagination<ClientDTO>>{};
  filterObject: {
    code: number, productName: string,
  } = {
      code: null, productName: '',
    };
  
  shortDescription: string;

  productList: Products[];
  ProductDescriptionArray: any = [];
  selectedProduct: Products;
  selectedProductCode: any;
  code: string;

  constructor(
    private router: Router,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,
    private spinner: NgxSpinnerService,
    public productService: ProductsService,

  ) { }

  ngOnDestroy(): void { }

  // SEARCHING CLIENT USING KYC
  getProducts(
    page: number,
    size: number,
    code: number,
    productName: string
  ) {
    return this.productService
      .fetchAllProducts(page, code, productName, size)
      .pipe(
        untilDestroyed(this),
      );
  }
  /**
   * The function "lazyLoadClients" is used to fetch clients data with pagination, sorting, and filtering options.
   * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter is of type `LazyLoadEvent` or
   * `TableLazyLoadEvent`. It is used to determine the pagination, sorting, and filtering options for fetching clients.
  */
 
  filter(event, pageIndex: number = 0, pageSize: number = 1000) {
    this.productList = null; // Initialize with an empty array or appropriate structure
    // let columnName;
    // let columnValue;

    // if (this.shortDescription) {
    //   columnName = "shortDescription";
    //   columnValue = this.shortDescription
    // }


    this.isSearching = true;
    this.spinner.show();
    this.productService.fetchAllProducts(
      pageIndex, this.filterObject?.code,
      this.filterObject?.productName, pageSize,

    ).subscribe((data) => {
      this.productList = data;
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
      }
    );
  }

  /**
   * - Get A specific client's details on select.
   * - populate the relevant fields with the client details.
   * - Retrieves and logs client type and country.
   * - Invokes 'getCountries()' to fetch countries data.
   * - Calls 'saveClient()' and closes the modal.
   * @method loadClientDetails
   * @param {number} id - ID of the client to load.
   * @return {void}
   */
  onProductSelected(product) {
    this.selectedProduct = product;
    console.log("Selected Product:",this.selectedProduct)
    this.productSelected.emit({
        productName: this.selectedProduct.description,
        productCode: this.selectedProduct.code
      });
    this.closebutton.nativeElement.click();

   
  }

  /**
   * Saves essential client details for further processing.
   * - Assigns client ID, name, email, and phone from 'clientDetails'.
   * @method saveClient
   * @return {void}
   */
  // saveclient() {
  //   this.clientCode = Number(this.clientDetails.id);
  //   this.clientName =
  //     this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
  //   sessionStorage.setItem('clientCode', this.clientCode);

  // // Emit the clientName and clientCode as an object
  // this.clientSelected.emit({
  //   clientName: this.clientName,
  //   clientCode: this.clientCode,
  // });
  // }

  inputCode(event) {
    // const value = (event.target as HTMLInputElement).value;
    const value = +(event.target as HTMLInputElement).value;
    // this.code = value
    this.filterObject['code'] = value;

  }

  inputDescription(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['productName'] = value;
  }
  
  lazyLoadProducts(event:LazyLoadEvent | TableLazyLoadEvent){
      // const pageIndex = event.first / event.rows;
      // const sortField = event.sortField;
      // const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
      // const pageSize = event.rows;

      const pageIndex = event.first / event.rows;
      const pageSize = event.rows; // Number of items per page
      const code = null
      const productName = null;
  
  
      if (this.isSearching) {
        const searchEvent = {
          target: {value: this.searchTerm}
        };
        this.filter(searchEvent, pageIndex, pageSize);
      }
      else {
        this.getProducts(pageIndex,pageSize,code,productName)
          .pipe(
            untilDestroyed(this),
            tap((data) => console.log(`Fetching products>>>`, data))
          )
          .subscribe(
            (data: any[]) => {
              data.forEach( product => {
                // client.clientTypeName = client.clientType.clientTypeName;
                // client.clientFullName = client.firstName + ' ' + (client.lastName || ''); //the client.clientFullName will be set to just firstName,
                // // as the null value for lastName is handled  using the logical OR (||) operator
              });
              this.productList = data;
              this.tableDetails.rows = this.productList;
                // Perform manual pagination
            const paginatedData = data.slice(
              pageIndex * pageSize,
              (pageIndex + 1) * pageSize
            );
            // Update the table with paginated data
            this.tableDetails.rows = paginatedData;
            this.tableDetails.totalElements = data.length; // Total number of records
              // this.tableDetails.totalElements = this.clientsData?.totalElements;
              this.cdr.detectChanges();
              this.spinner.hide();
            },
            error => {
              this.spinner.hide();
            }
          );
      }
    }
}
