import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ServiceRequestService} from "../../../services/service-request.service";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";

const log = new Logger('RequestTrackingComponent');
@Component({
  selector: 'app-request-tracking',
  templateUrl: './request-tracking.component.html',
  styleUrls: ['./request-tracking.component.css']
})
export class RequestTrackingComponent implements OnInit {
  pageSize: 5;
  requestTrackingData: Pagination<any> = <Pagination<any>>{};
  mainStatusData: any;
  requestAccTypesData: any;

  requestTrackingForm: FormGroup;

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
    this.requestTrackingCreateForm();
  }

  /**
   * Initializes the reactive form for the request tracking component.
   * The form consists of 3 form controls: `status`, `owner`, and `accountType`.
   * The values of these form controls are initially set to empty strings.
   */
  requestTrackingCreateForm() {
    this.requestTrackingForm = this.fb.group({
      status: [''],
      owner: [''],
      accountType: ['']
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

}
