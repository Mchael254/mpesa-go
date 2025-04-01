import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";
import {Logger} from "../../../../../shared/services";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {ServiceRequestService} from "../../../services/service-request.service";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {
  ServiceRequestCategoryDTO,
  ServiceRequestDocumentsDTO, ServiceRequestIncidentDTO,
  ServiceRequestsDTO, ServiceRequestStatusDTO
} from "../../../data/service-request-dto";
import {ActivatedRoute} from "@angular/router";
import {SessionStorageService} from "../../../../../shared/services/session-storage/session-storage.service";
import {AuthService} from "../../../../../shared/services/auth.service";
import {Profile} from "../../../../../shared/data/auth/profile";
import {MaritalStatusService} from "../../../../../shared/services/setups/marital-status/marital-status.service";

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
  clientsCommentsData: any;
  serviceRequestDocsData: ServiceRequestDocumentsDTO[] = [];
  selectedRequestDoc: ServiceRequestDocumentsDTO;
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

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService,
    private serviceRequestService: ServiceRequestService,
    private activatedRoute: ActivatedRoute,
    private sessionStorage: SessionStorageService,
    private authService: AuthService,
    private maritalStatusService: MaritalStatusService,
  ) { }
  ngOnInit(): void {
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

    log.info('session', this.sessionStorage.getItem('selectedEntity'));
    this.selectedEntity = this.sessionStorage.getItem('selectedEntity');
    this.activatedRoute.queryParams.subscribe(params => {
      log.info(`query Params >>>`, params);
      this.entity = params['entity'];
      this.entityId = params['entityId'];
    });
    this.loggedInUser = this.authService.getCurrentUser();
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
      account: [''],
      summary: [''],
      desc: [''],
      captureDate: [''],
      requestDate: [''],
      receiveDate: [''],
      dueDate: [''],
      assignee: [''],
      reporter: [''],
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
      dateCaptured: [''],
      postedBy: [''],
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

  openClientDetailsModal() {
    this.editMode = true;
    const modal = document.getElementById('clientDetailsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeClientDetailsModal() {
    this.editMode = false;
    const modal = document.getElementById('clientDetailsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openRequestDetailsModal() {
    const modal = document.getElementById('newCaseModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeRequestDetailsModal() {
    this.editMode = false;
    const modal = document.getElementById('newCaseModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openClientCommentModal() {
    const modal = document.getElementById('clientCommentsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeClientCommentModal() {
    this.editMode = false;
    const modal = document.getElementById('clientCommentsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openRequestDocsModal() {
    const modal = document.getElementById('requestDocsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeRequestDocsModal() {
    this.editMode = false;
    const modal = document.getElementById('requestDocsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openServiceProviderFeesModal() {
    const modal = document.getElementById('serviceProviderFeesModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  closeServiceProviderFeesModal() {
    this.editMode = false;
    const modal = document.getElementById('serviceProviderFeesModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  fetchOpenServiceRequests(event:LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    // const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.spinner.show();
    this.serviceRequestService.getServiceRequests(pageIndex, pageSize, sortOrder, 'Open',
      null, null, null, this.loggedInUser.code, null, null)
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

  fetchClosedServiceRequests(event:LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    // const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.spinner.show();
    this.serviceRequestService.getServiceRequests(pageIndex, pageSize, sortOrder, 'Closed',
      null, null, null, this.loggedInUser.code, null, null)
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

  fetchMainStatus() {
    this.serviceRequestService.getMainStatus()
      .subscribe((data) => {
        this.mainStatusData = data;

        log.info("main status>>", data);
      });
  }

  fetchCommunicationModes() {
    this.serviceRequestService.getRequestCommunicationModes()
      .subscribe((data) => {
        this.communicationModesData = data;

        log.info("communication modes>>", data);
      });
  }

  fetchRequestAccountTypes() {
    this.spinner.show();
    this.serviceRequestService.getRequestAccTypes()
      .subscribe((data) => {
        this.requestAccTypesData = data;
        this.spinner.hide();

        log.info("acc types>>", data);
      });
  }

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

  saveClientDetails() {

  }


  saveRequestDetails() {
    this.requestDetailsForm.markAllAsTouched();
    if (this.requestDetailsForm.invalid) return;
    const serviceRequestFormValues = this.requestDetailsForm.getRawValue();
    const selectedRequest = {
      id: null
    };
    const serviceRequestCode = !this.editMode ? null : selectedRequest?.id;

    // requestSource NOT THERE
    const saveRequestPayload: ServiceRequestsDTO = {
      accCode: serviceRequestFormValues.account,
      accType: serviceRequestFormValues.accountType,
      assignee: serviceRequestFormValues.assignee,
      captureDate: serviceRequestFormValues.captureDate,
      captureDateAlternate: "",
      categoryCode: serviceRequestFormValues.requestCategory,
      clientStatus: "",
      closedBy: serviceRequestFormValues.closedBy,
      comments: serviceRequestFormValues.comments,
      communicationMode: serviceRequestFormValues.prefCommMode,
      communicationModeValue: serviceRequestFormValues.primaryMode,
      date: null,
      desc: serviceRequestFormValues.desc,
      dueDate: serviceRequestFormValues.dueDate,
      endorsementCode: null,
      id: serviceRequestCode,
      incidentCode: serviceRequestFormValues.incident,
      initiator: null,
      mainStatus: null,
      ownerCode: null,
      ownerType: serviceRequestFormValues.ownerAccountType,
      policyNo: serviceRequestFormValues.polNo,
      receiveDate: serviceRequestFormValues.receiveDate,
      refNumber: null,
      reminder: null,
      reopennedDate: null,
      reporter: serviceRequestFormValues.reporter,
      requestDate: serviceRequestFormValues.requestDate,
      source: null,
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

    log.info(saveRequestPayload)
    // const serviceRequestServiceCall = selectedRequest
    //   ? this.serviceRequestService.updateRequestCategory(selectedRequest.id, saveRequestPayload)
    //   : this.serviceRequestService.createServiceRequest(saveRequestPayload);
    const serviceRequestServiceCall = this.serviceRequestService.createServiceRequest(saveRequestPayload);

    return serviceRequestServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage('Success', selectedRequest ? 'Successfully updated request' : 'Successfully created request');
        this.requestDetailsForm.reset();
        this.closeRequestDetailsModal();
        /*this.fetchOpenServiceRequests(null, this.pageSize, null, 'Open',
      null, null, null, null, null, null);
        this.fetchClosedServiceRequests(null, this.pageSize, null, 'Closed',
      null, null, null, null, null, null);*/
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Error saving request');
        throw error;
      });
  }

  saveServiceProviderFeeDetails() {

  }

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

    console.log(saveRequestDocPayload)
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
}
