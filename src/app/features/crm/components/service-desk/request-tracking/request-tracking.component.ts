import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ServiceRequestService} from "../../../services/service-request.service";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {ServiceRequestsDTO} from "../../../data/service-request-dto";

const log = new Logger('RequestTrackingComponent');
@Component({
  selector: 'app-request-tracking',
  templateUrl: './request-tracking.component.html',
  styleUrls: ['./request-tracking.component.css']
})
export class RequestTrackingComponent implements OnInit {
  pageSize: 5;
  requestTrackingData: Pagination<ServiceRequestsDTO> = <Pagination<ServiceRequestsDTO>>{};
  mainStatusData: any;
  requestAccTypesData: any;

  requestTrackingSortingForm: FormGroup;
  requestTrackingForm: FormGroup;
  allUsersModalVisible: boolean = false;
  zIndex= 1;
  selectedMainUser: StaffDto;

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
      owner: [''],
      accountType: ['']
    });
  }

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
    const pageIndex = event.first / event.rows;
    // const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.spinner.show();
    this.serviceRequestService.getServiceRequests(pageIndex, pageSize, sortOrder)
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

  requestTrackingFilters() {
    const sortValues = this.requestTrackingForm.getRawValue();
    log.info('form value', sortValues);
    const payload: any = {
      status: sortValues.status,
      accountType: sortValues.accountType,
      ownerCode: sortValues.owner,
    }

    this.serviceRequestService.getServiceRequests(
      0,
      this.pageSize,
      null,
      payload.status,
      null,
      payload.accountType,
      null,
      null,
      this.selectedMainUser.userType,
      payload.ownerCode
    )
      .subscribe({
        next: (data) => {
          this.requestTrackingData = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  openAllUsersModal() {
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
  }

  getSelectedUser(event: StaffDto) {
    this.requestTrackingForm.patchValue({
      owner: event?.id
    });
    this.selectedMainUser = event;
    this.requestTrackingFilters();
  }

  closeServiceRequestTrackingModal() {
    // this.editMode = false;
    const modal = document.getElementById('requestTrackingModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openRequestTrackingModal() {
    const modal = document.getElementById('requestTrackingModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  viewRequest(requestTracking: any) {
    this.openRequestTrackingModal();
    log.info('values', requestTracking)
    this.requestTrackingForm.patchValue({
      categoryType: requestTracking.categoryCode,
      requestIncidence: requestTracking.incidentCode,
      requestSource: null,
      accType: requestTracking.accType,
      acc: requestTracking.accCode,
      summary: requestTracking.summary,
      requestDate: new Date(requestTracking.requestDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      dueDate: new Date(requestTracking.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      desc: requestTracking.desc,
      assignee: requestTracking.assignee,
      owner: requestTracking.ownerCode,
      ownerAccType: requestTracking.ownerType,
      status: requestTracking.statusCode,
      resDate: new Date(requestTracking.resolutionDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      solution: requestTracking.solution,
      comments: requestTracking.comments,
    })
  }
}
