import {Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ServiceRequestService} from "../../../services/service-request.service";
import {ServiceRequestStatusDTO} from "../../../data/service-request-dto";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('RequestStatusComponent');
@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css']
})
export class RequestStatusComponent implements OnInit {

  pageSize: 5;
  requestStatusData: ServiceRequestStatusDTO[];
  selectedRequestStatus: ServiceRequestStatusDTO;
  mainStatusData: any;

  editMode: boolean = false;
  serviceRequestStatusForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private serviceRequestService: ServiceRequestService,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,
  ) {}

  ngOnInit(): void {
    this.serviceRequestStatusCreateForm();
    this.fetchRequestStatus();
    this.fetchMainStatus();
  }

  /**
   * Initialize the form for creating a new service request status
   */
  serviceRequestStatusCreateForm() {
    this.serviceRequestStatusForm = this.fb.group({
      name: [''],
      shtDesc: [''],
      status: ['']
    });
  }

  /**
   * Open the modal for creating a new service request status.
   */
  openServiceRequestStatusModal() {
    const modal = document.getElementById('serviceRequestStatusModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Close the modal for creating a new service request status.
   */
  closeServiceRequestStatusModal() {
    this.editMode = false;
    const modal = document.getElementById('serviceRequestStatusModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Fetches the list of service request statuses from the server.
   */
  fetchRequestStatus() {
    this.spinner.show();
    this.serviceRequestService.getRequestStatus()
      .subscribe((data) => {
        this.requestStatusData = data;
        this.spinner.hide();

        log.info("request status>>", data);
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
   * Save the service request status.
   *
   * This function is called when the user clicks the "Save details" button in the modal for creating a new service request status.
   * It takes the values from the form and sends them to the server, either to create a new service request status or to update an existing one.
   */
  saveServiceRequestStatus() {
    const serviceRequestStatusFormValues = this.serviceRequestStatusForm.getRawValue();
    const serviceRequestStatusCode = Array.isArray(serviceRequestStatusFormValues?.products) && serviceRequestStatusFormValues.products.length > 0
      ? serviceRequestStatusFormValues.products[0].code
      : null;

    const saveRequestStatusPayload: ServiceRequestStatusDTO = {
      srsCode: serviceRequestStatusCode,
      srsName: serviceRequestStatusFormValues?.name,
      srsShortDescription: serviceRequestStatusFormValues?.shtDesc,
      srsMainStatus: serviceRequestStatusFormValues?.status
    };

    const serviceRequestServiceCall = this.selectedRequestStatus
      ? this.serviceRequestService.updateRequestStatus(this.selectedRequestStatus.srsCode, saveRequestStatusPayload)
      : this.serviceRequestService.createRequestStatus(saveRequestStatusPayload);

    return serviceRequestServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage('Success', this.selectedRequestStatus ? 'Successfully updated request status' : 'Successfully created request status');
        this.serviceRequestStatusForm.reset();
        this.closeServiceRequestStatusModal();
        this.fetchRequestStatus();
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Error saving request status');
        throw error;
      });
  }

  /**
   * Toggle the edit mode on and off.
   *
   * If the edit mode is turned on and a service request status is selected, open the modal for editing the selected service request status.
   * If the edit mode is turned off and the user is currently editing a service request status, close the modal.
   * If no service request status is selected and the user tries to turn on the edit mode, show an error message.
   */
  editRequestStatus() {
    this.editMode = !this.editMode;
    if (this.selectedRequestStatus) {
      this.openServiceRequestStatusModal();
      this.serviceRequestStatusForm.patchValue({
        name: this.selectedRequestStatus.srsName,
        shtDesc: this.selectedRequestStatus.srsShortDescription,
        status: this.selectedRequestStatus.srsMainStatus
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No request status is selected!'
      );
    }
  }

  /**
   * Delete the selected service request status.
   */
  deleteRequestStatus() {
    if (this.selectedRequestStatus) {
      const serviceRequestStatusCode = this.selectedRequestStatus?.srsCode;
      this.serviceRequestService.deleteRequestStatus(serviceRequestStatusCode).subscribe( {
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted request status'
          );
          this.selectedRequestStatus = null;
          this.fetchRequestStatus();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No request status is selected.'
      );
    }
  }
}
