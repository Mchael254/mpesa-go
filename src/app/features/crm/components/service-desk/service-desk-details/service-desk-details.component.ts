import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LazyLoadEvent} from "primeng/api";
import {Table, TableLazyLoadEvent} from "primeng/table";
import {Logger} from "../../../../../shared/services";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {ServiceRequestService} from "../../../services/service-request.service";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {
  ServiceRequestCommentsDTO,
  ServiceRequestCategoryDTO,
  ServiceRequestDocumentsDTO, ServiceRequestIncidentDTO,
  ServiceRequestsDTO, ServiceRequestStatusDTO
} from "../../../data/service-request-dto";
import {ActivatedRoute} from "@angular/router";
import {SessionStorageService} from "../../../../../shared/services/session-storage/session-storage.service";
import {AuthService} from "../../../../../shared/services/auth.service";
import {Profile} from "../../../../../shared/data/auth/profile";
import {MaritalStatusService} from "../../../../../shared/services/setups/marital-status/marital-status.service";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {StaffModalComponent} from "../../../../entities/components/staff/staff-modal/staff-modal.component";

const log = new Logger('ServiceDeskDetailsComponent');
@Component({
  selector: 'app-service-desk-details',
  templateUrl: './service-desk-details.component.html',
  styleUrls: ['./service-desk-details.component.css']
})
export class ServiceDeskDetailsComponent implements OnInit {
  pageSize: 5;
  openRequestsData: Pagination<ServiceRequestsDTO> = <Pagination<ServiceRequestsDTO>>{};
  closedRequestsData: Pagination<ServiceRequestsDTO> = <Pagination<ServiceRequestsDTO>>{};
  clientsCommentsData: ServiceRequestCommentsDTO[] = [];
  serviceRequestDocsData: ServiceRequestDocumentsDTO[] = [];
  selectedRequestDoc: ServiceRequestDocumentsDTO;
  selectedComment: ServiceRequestCommentsDTO;
  selectedRequest: ServiceRequestsDTO;
  agencyCommissionData: any;
  serviceProviderFeesData: any;
  requestCategoriesData: ServiceRequestCategoryDTO[];
  incidentsData: ServiceRequestIncidentDTO[];

  editMode: boolean = false;
  clientDetailsForm: FormGroup;
  requestDetailsForm: FormGroup;
  clientCommentsForm: FormGroup;
  requestDocsForm: FormGroup;
  serviceProviderFeesForm: FormGroup;
  requestSourcesData: any;
  mainStatusData: any;
  communicationModesData: any;
  requestAccTypesData: any;
  requestStatusData: ServiceRequestStatusDTO[];
  maritalStatusData: any[];

  entity: any;
  entityId: number;
  selectedEntity: any;
  loggedInUser: Profile;

  activeFormField: "assignee" | "reporter" | "accType" | 'owner' | null = null;
  allUsersModalVisible: boolean = false;
  zIndex= 1;
  selectedMainUser: StaffDto;
  selectedUserType: any;

  dateToday = new Date().toISOString().slice(0, 10);

  @ViewChild('staffModal') staffModal: StaffModalComponent;
  @ViewChild('openRequestsTable') openRequestsTable: Table;
  @ViewChild('closedRequestsTable') closedRequestsTable: Table;
  selectedAccountType: any;
  assignee: number;
  owner: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,
    private serviceRequestService: ServiceRequestService,
    private activatedRoute: ActivatedRoute,
    private sessionStorage: SessionStorageService,
    private authService: AuthService,
    private maritalStatusService: MaritalStatusService,
    private cdr: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this.loggedInUser = this.authService.getCurrentUser();
    this.clientDetailsCreateForm();
    this.requestDetailsCreateForm();
    this.clientCommentsCreateForm();
    this.requestDocsCreateForm();
    this.serviceProviderFeesCreateForm();
    this.fetchServiceDocuments();
    this.fetchServiceCategory();
    this.fetchServiceIncidents();
    this.fetchServiceRequestSources();
    this.fetchMainStatus();
    this.fetchCommunicationModes();
    this.fetchRequestAccountTypes();
    this.fetchRequestStatus();
    this.fetchMaritalStatus();
    this.fetchServiceRequestComment();

    log.info('session', this.sessionStorage.getItem('selectedEntity'));
    this.selectedEntity = this.sessionStorage.getItem('selectedEntity');
    this.activatedRoute.queryParams.subscribe(params => {
      log.info(`query Params >>>`, params);
      this.entity = params['entity'];
      this.entityId = params['entityId'];
    });
  }

  clientDetailsCreateForm() {
    this.clientDetailsForm = this.fb.group({
      telNo: [''],
      telNoTwo: [''],
      emailAddress: [''],
      emailAddressTwo: [''],
      gender: [''],
      marital: [''],
      tinNo: [''],
      postalAddress: [''],
      physicalAddress: ['']
    });
  }

  requestDetailsCreateForm() {
    this.requestDetailsForm = this.fb.group({
      polNo: [''],
      requestCategory: [''],
      incident: [''],
      requestSource: [''],
      accountType: [''],
      account: [{ value: '', disabled: true }],
      summary: [''],
      desc: [''],
      captureDate: [{ value: this.dateToday, disabled: true }],
      requestDate: [''],
      receiveDate: [''],
      dueDate: [''],
      assignee: [{ value: this.loggedInUser?.userName, disabled: true }],
      reporter: [{ value: this.loggedInUser?.userName, disabled: true }],
      owner: [''],
      ownerAccountType: [''],
      status: [''],
      closedBy: [''],
      resolutionDate: [''],
      solution: [''],
      comments: [''],
      prefCommMode: [''],
      primaryMode: ['']
    });
  }

  clientCommentsCreateForm() {
    this.clientCommentsForm = this.fb.group({
      dateCaptured: [this.dateToday],
      // dateCaptured: [''],
      postedBy: [{ value: '', disabled: true }],
      clientComments: [''],
      solution: ['']
    });
  }

  requestDocsCreateForm() {
    this.requestDocsForm = this.fb.group({
      docType: [''],
      referenceNo: [{ value: '', disabled: true }],
      receivedBy: [{ value: '', disabled: true }],
      dateCreated: [''],
      remarks: ['']
    });
  }

  serviceProviderFeesCreateForm() {
    this.serviceProviderFeesForm = this.fb.group({
      clientName: [''],
      policyNo: [''],
      description: [''],
      fee: ['']
    });
  }

  /**
   * Opens the "Client Details" modal by adding a "show" class and displaying it.
   */
  openClientDetailsModal() {
    this.editMode = true;
    const modal = document.getElementById('clientDetailsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the "Client Details" modal by removing the "show" class and hiding it.
   */
  closeClientDetailsModal() {
    this.editMode = false;
    const modal = document.getElementById('clientDetailsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the "Request Details" modal by adding a "show" class and displaying it.
   */
  openRequestDetailsModal() {
    const modal = document.getElementById('newCaseModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the "Request Details" modal by removing the "show" class and hiding it.
   */
  closeRequestDetailsModal() {
    this.editMode = false;
    const modal = document.getElementById('newCaseModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the "Client Comments" modal by adding a "show" class and displaying it.
   */
  openClientCommentModal() {
    const modal = document.getElementById('clientCommentsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the "Client Comments" modal by removing the "show" class and hiding it.
   */
  closeClientCommentModal() {
    this.editMode = false;
    const modal = document.getElementById('clientCommentsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the "Request Documents" modal by adding a "show" class and displaying it.
   */
  openRequestDocsModal() {
    const modal = document.getElementById('requestDocsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the "Request Documents" modal by removing the "show" class and hiding it.
   */
  closeRequestDocsModal() {
    this.editMode = false;
    const modal = document.getElementById('requestDocsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the "Service Provider Fees" modal by adding the "show" class and displaying it.
   */
  openServiceProviderFeesModal() {
    const modal = document.getElementById('serviceProviderFeesModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Hides and removes the "show" class from the "serviceProviderFeesModal" element.
   */
  closeServiceProviderFeesModal() {
    this.editMode = false;
    const modal = document.getElementById('serviceProviderFeesModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the "Select User" modal for selecting the assignee, reporter, account type, or owner.
   * @param {string} formField - The form field to associate with the selected user.
   */
  openAllUsersModal(formField: 'assignee' | 'reporter' | 'accType' | 'owner') {
    this.activeFormField = formField;
    switch (formField) {
      case 'assignee':
      case 'reporter':
        this.selectedUserType = 'USER';
        this.staffModal.fetchAccountByAccountType('USER');
        break;

      case 'accType':
        this.selectedUserType = this.requestAccTypesData.find(accType => accType.code === this.requestDetailsForm.get('accountType').value && accType.value);
        this.staffModal.fetchAccountByAccountType(this.selectedUserType?.value);
        break;

      case 'owner':
        this.selectedUserType = this.requestAccTypesData.find(ownerAccType => ownerAccType.code === this.requestDetailsForm.get('ownerAccountType').value && ownerAccType.value);
        this.staffModal.fetchAccountByAccountType(this.selectedUserType?.value);
        break;
      default:
    }

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
      case 'assignee':
        this.selectedMainUser = event;
        this.assignee = event?.id;
        this.requestDetailsForm.patchValue({
          assignee: event?.name
        });
        break;
      case 'reporter':
        this.requestDetailsForm.patchValue({
          reporter: event?.name,
        });
        break;
      case 'owner':
        this.owner = event;
        log.info("owner", this.owner)
        name =
          this.owner.name ||
          this.owner.username ||
          this.owner.firstName;
        this.requestDetailsForm.patchValue({
          owner: name,
        });
        break;
      case 'accType':
        this.selectedAccountType = event;
        name =
          this.selectedAccountType.name ||
          this.selectedAccountType.username ||
          this.selectedAccountType.firstName;
        this.requestDetailsForm.patchValue({
          account: name,
        });
        break;
      default:
        log.warn('No active form field set for patching.');
    }
    this.activeFormField = null;
  }

  /**
   * Fetches the list of service requests that are in the "Open" state.
   * Displays a spinner while loading and logs the received data.
   * Handles errors by displaying an error message to the user.
   * @param event The lazy load event.
   */
  fetchOpenServiceRequests(event:LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    // const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.spinner.show();
    this.serviceRequestService.getServiceRequests(pageIndex, pageSize, sortOrder, 'Open',
      null, null, null, this.loggedInUser?.code, null, null)
      .subscribe({
        next: (data) => {
          this.openRequestsData = data;
          this.spinner.hide();

          log.info("open requests>>", this.openRequestsData);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches the list of service requests that are in the "Closed" state.
   * Displays a spinner while loading and logs the received data.
   * Handles errors by displaying an error message to the user.
   * @param event The lazy load event.
   */
  fetchClosedServiceRequests(event:LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    // const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.spinner.show();
    this.serviceRequestService.getServiceRequests(pageIndex, pageSize, sortOrder, 'Closed',
      null, null, null, this.loggedInUser?.code, null, null)
      .subscribe({
        next: (data) => {
          this.closedRequestsData = data;
          this.spinner.hide();

          log.info("closed requests>>", this.closedRequestsData);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches the list of service request documents.
   * Displays a spinner while loading and logs the received data.
   * Handles errors by displaying an error message to the user.
   */
  fetchServiceDocuments() {
    this.spinner.show();
    this.serviceRequestService.getRequestDocuments()
      .subscribe({
        next: (data) => {
          this.serviceRequestDocsData = data;
          this.spinner.hide();

          log.info("docs>>", data);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches the list of service request categories.
   * Displays a spinner while loading and logs the received data.
   * Handles errors by displaying an error message to the user.
   */
  fetchServiceCategory() {
    this.spinner.show();
    this.serviceRequestService.getRequestCategory()
      .subscribe({
        next: (data) => {
          this.requestCategoriesData = data;
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
   * Fetches the list of service request incidents from the server.
   * Logs the received data.
   * Handles errors by displaying an error message to the user.
   */
  fetchServiceIncidents() {
    this.spinner.show();
    this.serviceRequestService.getRequestIncidents()
      .subscribe({
        next: (data) => {
          this.incidentsData = data;
          this.spinner.hide();

          log.info("incidents>>", data);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches the list of service request sources from the server.
   * Logs the received data.
   * Handles errors by displaying an error message to the user.
   */
  fetchServiceRequestSources() {
    this.spinner.show();
    this.serviceRequestService.getRequestSources()
      .subscribe({
        next: (data) => {
          this.requestSourcesData = data;
          this.spinner.hide();

          log.info("request Sources>>", data);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches the list of service request main statuses from the server.
   * Logs the received data.
   * Handles errors by displaying an error message to the user.
   */
  fetchMainStatus() {
    this.serviceRequestService.getMainStatus()
      .subscribe({
        next: (data) => {
          this.mainStatusData = data;

          log.info("main status>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches communication modes data from the server and updates the local state.
   * Logs the received data.
   * Handles errors by displaying an error message to the user.
   */
  fetchCommunicationModes() {
    this.serviceRequestService.getRequestCommunicationModes()
      .subscribe({
        next: (data) => {
          this.communicationModesData = data;

          log.info("communication modes>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches account types for service requests from the server and updates the local state.
   * Displays a loading spinner during the fetch and logs the received data.
   * Handles errors by displaying an error message to the user.
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
   * Fetches service request status data from the server and updates the local state.
   * Displays a loading spinner during the fetch and logs the received data.
   * Handles errors by displaying an error message to the user.
   */
  fetchRequestStatus() {
    this.spinner.show();
    this.serviceRequestService.getRequestStatus()
      .subscribe({
        next: (data) => {
          this.requestStatusData = data;
          this.spinner.hide();
          log.info("request status>>", data);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches marital status data from the server and updates the local state.
   * Displays a loading spinner during the fetch and logs the received data.
   * Handles errors by displaying an error message to the user.
   */
  fetchMaritalStatus() {
    this.spinner.show();
    this.maritalStatusService.getMaritalStatus()
      .subscribe({
        next: (data) => {
          this.maritalStatusData = data;
          this.spinner.hide();
          log.info("marital status>>", data);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Fetches service request comments from the server and updates the local state.
   * Displays a loading spinner during the fetch and logs the received data.
   * Handles errors by displaying an error message to the user.
   */
  fetchServiceRequestComment() {
    this.spinner.show();
    this.serviceRequestService.getRequestComments()
      .subscribe({
        next: (data) => {
          this.clientsCommentsData = data;
          this.spinner.hide();
          log.info("comments>>", data);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  saveClientDetails() {

  }


  /**
   * Save the request details.
   * This function validates the request details form, constructs the payload,
   * and calls the appropriate service to save or update the request.
   */
  saveRequestDetails() {
    this.requestDetailsForm.markAllAsTouched();
    if (this.requestDetailsForm.invalid) return;

    const serviceRequestFormValues = this.requestDetailsForm.getRawValue();
    const serviceRequestCode = !this.editMode ? null : this.selectedRequest?.id;

    const saveRequestPayload: ServiceRequestsDTO = {
      accCode: this.selectedRequest ? this.selectedRequest?.accountDto?.id : this.selectedAccountType?.id,
      accType: serviceRequestFormValues.accountType,
      assignee: this.selectedRequest ? this.selectedRequest?.assigneeDto?.id : this.assignee == undefined ? this.loggedInUser?.code : this.assignee,
      captureDate: serviceRequestFormValues.captureDate,
      captureDateAlternate: "",
      categoryCode: serviceRequestFormValues.requestCategory,
      clientStatus: "",
      closedBy: serviceRequestFormValues.closedBy,
      comments: serviceRequestFormValues.comments,
      communicationMode: serviceRequestFormValues.prefCommMode,
      communicationModeValue: serviceRequestFormValues.primaryMode,
      date: this.selectedRequest ? this.selectedRequest?.date : this.dateToday,
      desc: serviceRequestFormValues.desc,
      dueDate: serviceRequestFormValues.dueDate,
      endorsementCode: null,
      id: serviceRequestCode,
      incidentCode: serviceRequestFormValues.incident,
      initiator: null,
      mainStatus: null,
      ownerCode: this.selectedRequest ? this.selectedRequest?.ownerDto?.id : this.owner.id,
      ownerType: serviceRequestFormValues.ownerAccountType,
      policyNo: serviceRequestFormValues.polNo,
      receiveDate: serviceRequestFormValues.receiveDate,
      refNumber: null,
      reminder: null,
      reopennedDate: null,
      reporter: serviceRequestFormValues.reporter,
      requestDate: serviceRequestFormValues.requestDate,
      source: serviceRequestFormValues.requestSource,
      resolutionDate: serviceRequestFormValues.resolutionDate,
      secondaryCommunicationMode: null,
      secondaryCommunicationModeValue: null,
      solution: serviceRequestFormValues.solution,
      statusCode: serviceRequestFormValues.status,
      stsCode: null,
      summary: serviceRequestFormValues.summary,
      tcbCode: null,
      timeOfCommunication: null
    };

    log.info(saveRequestPayload, this.owner);

    const serviceRequestServiceCall = this.selectedRequest
      ? this.serviceRequestService.updateServiceRequest(this.selectedRequest.id, saveRequestPayload)
      : this.serviceRequestService.createServiceRequest(saveRequestPayload);

    return serviceRequestServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage('Success', this.selectedRequest ? 'Successfully updated request' : 'Successfully created request');
        this.requestDetailsForm.reset();
        this.closeRequestDetailsModal();
        this.openRequestsTable.reset();
        this.closedRequestsTable.reset();
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Error saving request');
        throw error;
      });
  }

  saveServiceProviderFeeDetails() {

  }

  /**
   * Save the client comments.
   * This function validates the client comments form, constructs the payload,
   * and calls the appropriate service to save or update the comment.
   */
  saveClientComments() {
    this.clientCommentsForm.markAllAsTouched();
    if (this.clientCommentsForm.invalid) return;
    const clientCommentsFormValues = this.clientCommentsForm.getRawValue();
    const clientCommentsCode = !this.editMode ? null : this.selectedComment?.id;

    const saveClientCommentsPayload: ServiceRequestCommentsDTO = {
      id: clientCommentsCode,
      srcClientComment: clientCommentsFormValues.clientComments,
      srcSolution: clientCommentsFormValues.solution,
      srcTsrCode: 2,
      srcCapturedDate: clientCommentsFormValues.dateCaptured,
      srcPostedBy: this.loggedInUser?.code,
    };

    log.info(saveClientCommentsPayload);
    const serviceRequestServiceCall = this.selectedComment
      ? this.serviceRequestService.updateRequestComment(this.selectedComment.id, saveClientCommentsPayload)
      : this.serviceRequestService.createRequestComment(saveClientCommentsPayload);

    return serviceRequestServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage('Success', this.selectedComment ? 'Successfully updated request comment' : 'Successfully created request comment');
        this.clientCommentsForm.reset();
        this.closeClientCommentModal();
        this.fetchServiceRequestComment();
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Error saving request comment');
        throw error;
      });
  }

  /**
   * Save the service request documents.
   * This function validates the request documents form, constructs the payload, and
   * calls the appropriate service to save or update the document.
   */
  saveRequestDocuments() {
    this.requestDocsForm.markAllAsTouched();
    if (this.requestDocsForm.invalid) return;
    const serviceRequestDocFormValues = this.requestDocsForm.getRawValue();
    const serviceRequestDocCode = !this.editMode ? null : this.selectedRequestDoc?.id;

    const saveRequestDocPayload: ServiceRequestDocumentsDTO = {
      id: serviceRequestDocCode,
      desc: serviceRequestDocFormValues.docType,
      docId: "",
      fileName: "",
      mimeType: "",
      name: "",
      postedBy: serviceRequestDocFormValues.receivedBy,
      postedOn: serviceRequestDocFormValues.dateCreated,
      refNo: serviceRequestDocFormValues.referenceNo,
      remarks: serviceRequestDocFormValues.remarks,
      srdCode: 0,
      srdDesc: "",
      tsrCode: 0,
    };

    log.info(saveRequestDocPayload);
    const serviceRequestServiceCall = this.selectedRequestDoc
      ? this.serviceRequestService.updateRequestDocument(this.selectedRequestDoc.id, saveRequestDocPayload)
      : this.serviceRequestService.createRequestDocument(saveRequestDocPayload);

    return serviceRequestServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage('Success', this.selectedRequestDoc ? 'Successfully updated request document' : 'Successfully created request document');
        this.requestDocsForm.reset();
        this.closeRequestDocsModal();
        this.fetchServiceDocuments();
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Error saving request docs');
        throw error;
      });
  }

  /**
   * Handles the edit event for a service request comment.
   * If the comment is selected, its details are populated in the modal.
   * If no comment is selected, an error message is displayed.
   */
  editRequestComment() {
    this.editMode = !this.editMode;
    if (this.selectedComment) {
      this.openClientCommentModal();
      this.clientCommentsForm.patchValue({
        dateCaptured: new Date(this.selectedComment.srcCapturedDate).toISOString().split('T')[0],
        postedBy: this.selectedComment?.postedBy?.name,
        clientComments: this.selectedComment.srcClientComment,
        solution: this.selectedComment.srcSolution
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No request comment is selected!'
      );
    }
  }

  /**
   * Handles the edit event for a service request.
   * If the request is selected from the closed table, it is opened in the open status.
   * @param request - The service request to be edited.
   * @param fromClosedTable - If true, the request is selected from the closed table.
   */
  editRequests(request:ServiceRequestsDTO, fromClosedTable: boolean = false) {
    this.editMode = !this.editMode;
    this.selectedRequest = request;

    let status;

    if (fromClosedTable) {
      status = this.requestStatusData.find(s => s.srsMainStatus === 'Open');
    } else {
      status = this.requestStatusData.find(s => s.srsMainStatus === this.selectedRequest.mainStatus);
    }
    log.info("status", status);

    if (this.selectedRequest) {
      this.openRequestDetailsModal();
      this.requestDetailsForm.patchValue({
        polNo: this.selectedRequest?.policyNo,
        requestCategory: this.selectedRequest?.categoryDto?.id,
        incident: this.selectedRequest?.incidentDto?.id,
        requestSource: this.selectedRequest?.source,
        accountType: this.selectedRequest?.accType,
        account: this.selectedRequest?.accountDto?.name,
        summary: this.selectedRequest?.summary,
        desc: this.selectedRequest?.desc,
        captureDate: new Date(this.selectedRequest?.captureDate).toISOString().split('T')[0],
        requestDate: new Date(this.selectedRequest?.requestDate).toISOString().split('T')[0],
        receiveDate: new Date(this.selectedRequest?.receiveDate).toISOString().split('T')[0],
        dueDate: new Date(this.selectedRequest?.dueDate).toISOString().split('T')[0],
        assignee: this.selectedRequest?.assigneeDto?.name,
        reporter: this.selectedRequest?.reporter,
        owner: this.selectedRequest?.ownerDto?.name,
        ownerAccountType: this.selectedRequest?.ownerType,
        status: status?.srsCode,
        closedBy: this.selectedRequest?.closedBy,
        resolutionDate: new Date(this.selectedRequest?.resolutionDate).toISOString().split('T')[0],
        solution: this.selectedRequest?.solution,
        comments: this.selectedRequest?.comments,
        prefCommMode: this.selectedRequest?.communicationMode,
        primaryMode: this.selectedRequest?.communicationModeValue,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No request is selected!'
      );
    }
  }

  /**
   * Handles the status change event. Updates the form controls based on the selected status.
   */
  onStatusClick() {
    const statusSelected = this.requestDetailsForm.get('status').value;
    log.info('status', statusSelected);

    const selectedStatus = this.requestStatusData.find(item => item.srsCode == statusSelected);
    log.info('selectedStatus', selectedStatus?.srsMainStatus);

    if (selectedStatus?.srsMainStatus === 'Closed') {
      this.requestDetailsForm.get('closedBy').disable();
      this.requestDetailsForm.get('closedBy').patchValue(this.loggedInUser?.userName);
      this.requestDetailsForm.get('resolutionDate').patchValue(this.dateToday);
    } else {
      this.requestDetailsForm.get('closedBy').reset();
      this.requestDetailsForm.get('closedBy').enable();
      this.requestDetailsForm.get('resolutionDate').reset();
    }
  }
}
