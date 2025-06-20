import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Logger, UtilService} from '../../services';
import {GlobalMessagingService} from '../../services/messaging/global-messaging.service';
import {QuotationsService} from '../../../features/gis/components/quotation/services/quotations/quotations.service';
import {Router} from '@angular/router';
import {QuotationList} from '../../../features/gis/components/quotation/data/quotationsDTO';
import {untilDestroyed} from '../../shared.module';
import {TableLazyLoadEvent} from 'primeng/table';
import {LazyLoadEvent} from 'primeng/api';
import {ClientService} from '../../../features/entities/services/client/client.service';
import {tap} from 'rxjs';
import {Pagination} from '../../data/common/pagination';
import {ClientDTO} from '../../../features/entities/data/ClientDTO';
import {NgxSpinnerService} from 'ngx-spinner';
import {Modal} from 'bootstrap';

const log = new Logger('clientSearchComponent');

@Component({
  selector: 'app-client-search-modal',
  templateUrl: './client-search-modal.component.html',
  styleUrls: ['./client-search-modal.component.css'],
  standalone: false,
})
export class ClientSearchModalComponent implements  OnDestroy, OnInit {

  @ViewChild('closebutton') closebutton;
  @Output() clientSelected = new EventEmitter<{ clientName: string; clientCode: number }>();
  @Input() convertToPolicy: boolean;
  @Output() onClickSaveClient: EventEmitter<any> = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  private modalInstance: Modal;
  @ViewChild('clientSearchModalElement') modalElementRef: ElementRef;

  gisQuotationList: QuotationList[] = [];
  tableDetails: any = {
    rows: [], // Initially empty array for rows
    totalElements: 0 // Default total count
  };
  pageSize: number = 5;
  isSearching = false;
  searchTerm = '';
  public clientsData: Pagination<ClientDTO> = <Pagination<ClientDTO>>{};
  filterObject: {
    name: string, idNumber: string,
  } = {
    name: '', idNumber: '',
  };
  clientDetails: ClientDTO;
  globalFilterFields = ['idNumber', 'firstName', 'lastName'];
  clientName: any;
  clientCode: any;
  clientType: any;
  idValue: string;
  emailValue: string;
  phoneValue: string;
  selectedClient: ClientDTO;
  showActionButtons: boolean;

  constructor(
    private router: Router,
    public quotationService: QuotationsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,
    private spinner: NgxSpinnerService,
    public utilService: UtilService,
    private elementRef: ElementRef,
  ) {

  }

  ngOnInit(): void {
    log.debug("Convert to policy flag:", this.convertToPolicy)
    this.showActionButtons = !!this.convertToPolicy;
  }
  private showModal(): void {
    if (!this.modalInstance) {
      this.modalInstance = new Modal(this.modalElementRef.nativeElement);
      this.modalElementRef.nativeElement.addEventListener('hidden.bs.modal', () => {
        this.modalClosed.emit();
      });
    }
    this.modalInstance.show();
  }

  private hideModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  ngOnDestroy(): void {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  }

  getClients(pageIndex: number,
             pageSize: number,
             sortField: any = 'createdDate',
             sortOrder: string = 'desc') {
    return this.clientService
      .getClients(pageIndex, pageSize, sortField, sortOrder)
      .pipe(
        untilDestroyed(this),
      );
  }

  /**
   * The function "lazyLoadClients" is used to fetch clients data with pagination, sorting, and filtering options.
   * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter is of type `LazyLoadEvent` or
   * `TableLazyLoadEvent`. It is used to determine the pagination, sorting, and filtering options for fetching clients.
   */
  lazyLoadClients(event: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.spinner.show();

    this.getClients(pageIndex, pageSize, sortField, sortOrder)
      .pipe(
        untilDestroyed(this),
        tap((data) => log.info(`Fetching Clients>>>`, data))
      )
      .subscribe({
        next: (data: Pagination<ClientDTO>) => {
          data.content.forEach(client => {
            client.clientTypeName = client.clientType.clientTypeName;
            client.clientFullName = client.firstName + ' ' + (client.lastName || '');
          });
          this.clientsData = data;
          this.tableDetails.rows = this.clientsData?.content;
          this.tableDetails.totalElements = this.clientsData?.totalElements;
          this.cdr.detectChanges();

          this.spinner.hide();
          if (!this.modalInstance?.isInitialized) {
            this.showModal();
          }
        },
        error: (err) => {
          this.spinner.hide();
          log.error('Failed to fetch clients', err);
          this.modalClosed.emit();
        }
      });
  }

  filter(event, pageIndex: number = 0, pageSize: number = event.rows) {
    this.clientsData = null;
    let columnName;
    let columnValue;
    if (this.emailValue) {
      columnName = 'emailAddress';
      columnValue = this.emailValue;
    } else if (this.phoneValue) {
      columnName = 'phoneNumber';
      columnValue = this.phoneValue;
    }

    this.isSearching = true;
    this.spinner.show();
    this.quotationService
      .searchClients(
        columnName,
        columnValue,
        pageIndex,
        pageSize,
        this.filterObject?.name,
        this.filterObject?.idNumber
      )
      .subscribe(
        (data) => {
          this.clientsData = data;
          this.spinner.hide();
          if (!this.modalInstance?.isInitialized) {
            this.showModal();
          }
        },
        (error) => {
          this.spinner.hide();
          this.modalClosed.emit();
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
  loadClientDetails(id) {
    this.clientService.getClientById(id).subscribe((data) => {
      this.clientDetails = data;
      this.clientType = this.clientDetails.clientType.clientTypeName;
      log.debug('Selected Client Details:', this.clientDetails);
      const clientDetailsString = JSON.stringify(this.clientDetails);
      sessionStorage.setItem('clientDetails', clientDetailsString);
      log.debug('Selected code client:', this.clientType);
      this.saveclient();
      this.hideModal();
    });
  }

  cancel() {
    this.hideModal();
  }

  /**
   * Saves essential client details for further processing.
   * - Assigns client ID, name, email, and phone from 'clientDetails'.
   * @method saveClient
   * @return {void}
   */
  saveclient() {
    this.clientCode = Number(this.clientDetails.id);
    this.clientName =
      this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
    sessionStorage.setItem('clientCode', this.clientCode);
    this.clientSelected.emit({
      clientName: this.clientName,
      clientCode: this.clientCode,
    });
  }

  saveSelectedClient() {
    this.onClickSaveClient.emit(this.selectedClient);
    this.hideModal();
  }


  inputName(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['name'] = value;
  }


  inputEmail(event) {
    const value = (event.target as HTMLInputElement).value;
    this.emailValue = value;
  }

  inputPhone(event) {
    const value = (event.target as HTMLInputElement).value;
    this.phoneValue = value;
  }

}
