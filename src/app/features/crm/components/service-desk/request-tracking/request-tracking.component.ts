import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ServiceRequestService} from "../../../services/service-request.service";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {LazyLoadEvent} from "primeng/api";
import {Table, TableLazyLoadEvent} from "primeng/table";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {ServiceRequestsDTO} from "../../../data/service-request-dto";
import {StaffModalComponent} from "../../../../entities/components/staff/staff-modal/staff-modal.component";

const log = new Logger('RequestTrackingComponent');
@Component({
  selector: 'app-request-tracking',
  templateUrl: './request-tracking.component.html',
  styleUrls: ['./request-tracking.component.css']
})
export class RequestTrackingComponent implements OnInit {
  pageSize: 10;
  pageIndex: number;
  requestTrackingData: Pagination<ServiceRequestsDTO> = <Pagination<ServiceRequestsDTO>>{};
  mainStatusData: any;
  requestAccTypesData: any;

  requestTrackingSortingForm: FormGroup;
  requestTrackingForm: FormGroup;
  allUsersModalVisible: boolean = false;
  zIndex= 1;
  selectedMainUser: StaffDto;

  public activeFormField:
    | 'requestOwner'
    | 'accType'
    | null = null;
  selectedEntity: any;
  selectedUserType: string;

  @ViewChild('staffModal') staffModal: StaffModalComponent;
  @ViewChild('requestTrackingTable') requestTrackingTable: Table;
  isFiltering: boolean = false;

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private serviceRequestService: ServiceRequestService,
  ) {}
  ngOnInit(): void {
    this.fetchMainStatus();
    this.fetchRequestAccountTypes();
    this.requestTrackingSortingCreateForm();
    this.requestTrackingCreateForm();
  }

  /**
   * Initializes the reactive form for the request tracking component.
   * The form consists of 3 form controls: `status`, `owner`, and `accountType`.
   * The values of these form controls are initially set to empty strings.
   */
  requestTrackingSortingCreateForm() {
    this.requestTrackingSortingForm = this.fb.group({
      status: [''],
      owner: [{value: '', disabled: true}],
      accountType: [''],
      entity: [{value: '', disabled: true}],
    });
  }

  /**
   * Initializes the reactive form for the request tracking component.
   * The values of these form controls are initially set to empty strings and are disabled.
   */
  requestTrackingCreateForm() {
    this.requestTrackingForm = this.fb.group({
      categoryType: [{value: '', disabled: true}],
      requestIncidence: [{value: '', disabled: true}],
      requestSource: [{value: '', disabled: true}],
      accType: [{value: '', disabled: true}],
      acc: [{value: '', disabled: true}],
      summary: [{value: '', disabled: true}],
      requestDate: [{value: '', disabled: true}],
      dueDate: [{value: '', disabled: true}],
      desc: [{value: '', disabled: true}],
      assignee: [{value: '', disabled: true}],
      owner: [{value: '', disabled: true}],
      ownerAccType: [{value: '', disabled: true}],
      status: [{value: '', disabled: true}],
      resDate: [{value: '', disabled: true}],
      solution: [{value: '', disabled: true}],
      comments: [{value: '', disabled: true}],
    });
  }

  /**
   * Fetches the list of service requests based on the current page index,
   * page size, and sort order from the server.
   * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter
   * is of type `LazyLoadEvent` or `TableLazyLoadEvent`. It is used to
   * determine the pagination, sorting, and filtering options for fetching
   * service requests.
   */
  fetchServiceRequests(event:LazyLoadEvent | TableLazyLoadEvent) {
    this.pageIndex = event.first / event.rows;
    // const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.spinner.show();

    if (this.isFiltering == true) {
      this.requestTrackingFilters();
      return;
    }

    this.serviceRequestService.getServiceRequests(this.pageIndex, pageSize, sortOrder)
      .subscribe({
        next: (data) => {
          this.requestTrackingData = data;
          this.spinner.hide();

          log.info("requests>>", data);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches the list of service request main statuses from the server.
   */
  fetchMainStatus() {
    this.serviceRequestService.getMainStatus()
      .subscribe((data) => {
        this.mainStatusData = data;

        log.info("main status>>", data);
      });
  }

  /**
   * Fetches the list of account types for service requests from the server
   */
  fetchRequestAccountTypes() {
    this.spinner.show();
    this.serviceRequestService.getRequestAccTypes()
      .subscribe((data) => {
        this.requestAccTypesData = data;
        this.spinner.hide();

        log.info("acc types>>", data);
      });
  }

  /**
   * Applies filters to the list of service requests and fetches the filtered list.
   * @see `getServiceRequests` method in `ServiceRequestService` for more details.
   */
  requestTrackingFilters() {
    this.isFiltering = true;
    const sortValues = this.requestTrackingSortingForm.getRawValue();
    log.info('form value', sortValues);
    const payload: any = {
      status: sortValues.status,
      accountType: sortValues.accountType,
      accCode: this.activeFormField === 'accType' ? this.selectedEntity?.id : this.selectedMainUser?.id,
      ownerType: this.selectedMainUser?.userType === "U" ? "USER" : this.selectedMainUser?.userType,
      ownerCode: this.selectedMainUser?.id
    }
    log.info('payload', payload);
    this.serviceRequestService.getServiceRequests(
      this.pageIndex,
      this.pageSize,
      'desc',
      payload.status,
      null,
      payload.accountType,
      payload.accCode,
      null,
      payload.ownerType,
      payload.ownerCode
    )
      .subscribe({
        next: (data) => {
          this.requestTrackingData = data;
          this.spinner.hide();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
          this.spinner.hide();
        }
      })
  }

  /**
   * Opens the "Select User" modal for selecting the owner or account type of a Service Request.
   * @param {string} formField - The name of the form field to associate with the selected user.
   * The possible values are 'requestOwner' (for selecting the owner of a service request)
   * and 'accType' (for selecting the account type of a service request).
   */
  openAllUsersModal(formField: 'requestOwner' | 'accType') {
    this.activeFormField = formField;
    log.info('Active field', this.activeFormField);

    switch (this.activeFormField) {
      case 'requestOwner':
        this.selectedUserType = 'USER';
        this.staffModal.fetchAccountByAccountType('USER');
        break;

      case 'accType':
        this.selectedUserType = this.requestTrackingSortingForm.get('accountType').value;
        this.staffModal.fetchAccountByAccountType(this.requestTrackingSortingForm.get('accountType').value);
        break;
      default:
    }
    this.cdr.detectChanges();

    this.zIndex  = -1;
    this.toggleAllUsersModal(true);
  }

  /**
   * Toggles the visibility of the all users modal based on the provided display parameter.
   */
  private toggleAllUsersModal(display: boolean) {
    this.allUsersModalVisible = display;
  }
  /**
   * Closes the "Select User" modal after a user has been selected.
   */
  processSelectedUser($event: void) {
    this.toggleAllUsersModal(false);
    this.zIndex = 1;
    this.activeFormField = null;
  }

  /**
   * Patches the selected user value into the request tracking form.
   * @param event the selected user
   */
  getSelectedUser(event: StaffDto) {
    let name: string;
    switch (this.activeFormField) {
      case 'requestOwner':
        this.selectedMainUser = event;
        this.requestTrackingSortingForm.patchValue({
          owner: event?.name
        });
        break;
      case 'accType':
        this.selectedEntity = event;
        name =
          this.selectedEntity.name ||
          this.selectedEntity.username ||
          this.selectedEntity.firstName;
        this.requestTrackingSortingForm.patchValue({
          entity: name,
        });
        break;
      default:
        log.warn('No active form field set for patching.');
    }
    this.requestTrackingFilters()
    this.activeFormField = null;
  }

  /**
   * Clears the sorting form and table state for request tracking.
   */
  clearRequestTrackingSort() {
    this.requestTrackingSortingForm.reset();
    this.requestTrackingTable.reset();
  }

  /**
   * Closes the "Service Request Tracking" modal.
   */
  closeServiceRequestTrackingModal() {
    const modal = document.getElementById('requestTrackingModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the "Service Request Tracking" modal.
   */
  openRequestTrackingModal() {
    const modal = document.getElementById('requestTrackingModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Patches the request tracking form with the selected request tracking data.
   * @param requestTracking - The selected request tracking data.
   */
  viewRequest(requestTracking: any) {
    this.openRequestTrackingModal();
    log.info('values', requestTracking)
    this.requestTrackingForm.patchValue({
      categoryType: requestTracking.categoryCode,
      requestIncidence: requestTracking?.incidentDto?.name,
      requestSource: requestTracking.source,
      accType: requestTracking.accType,
      acc: requestTracking?.accountDto?.name,
      summary: requestTracking.summary,
      requestDate: new Date(requestTracking.requestDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      dueDate: new Date(requestTracking.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      desc: requestTracking.desc,
      assignee: requestTracking?.assigneeDto?.name,
      owner: requestTracking?.ownerDto?.name,
      ownerAccType: requestTracking.ownerType,
      status: requestTracking?.statusDto?.srsName,
      resDate: new Date(requestTracking.resolutionDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      solution: requestTracking.solution,
      comments: requestTracking.comments,
    })
  }
}
