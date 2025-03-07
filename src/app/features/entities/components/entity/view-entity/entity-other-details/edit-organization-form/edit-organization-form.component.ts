import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, map, of, take } from 'rxjs';

import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import { Extras } from '../entity-other-details.component';
import {
  OrganizationDTO,
  OrganizationDivisionDTO,
} from '../../../../../../../features/crm/data/organization-dto';
import { StaffDto } from '../../../../../../../features/entities/data/StaffDto';
import { SystemsDto } from '../../../../../../../shared/data/common/systemsDto';
import { ProductsService } from '../../../../../../../features/gis/components/setups/services/products/products.service';
import { ProductService } from '../../../../../../../features/lms/service/product/product.service';
import { Logger } from '../../../../../../../shared/services/logger/logger.service';
import { untilDestroyed } from '../../../../../../../shared/services/until-destroyed';
import { SystemsService } from '../../../../../../../shared/services/setups/systems/systems.service';
import { OrganizationService } from '../../../../../../../features/crm/services/organization.service';
import { StaffService } from '../../../../../../../features/entities/services/staff/staff.service';
import { IntermediaryService } from '../../../../../../../features/entities/services/intermediary/intermediary.service';
import { LeadsService } from '../../../../../../../features/crm/services/leads.service';

const log = new Logger('EditOrganizationFormComponent');

@Component({
  selector: 'app-edit-organization-form',
  templateUrl: './edit-organization-form.component.html',
  styleUrls: ['./edit-organization-form.component.css'],
})
export class EditOrganizationFormComponent implements OnInit {
  @Output('closeEditModal') closeEditModal: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('isFormDetailsReady') isFormDetailsReady: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public organizationDetailForm: FormGroup;

  public organizationsData: OrganizationDTO[] = [];
  public assignedToData: StaffDto[] = [];
  public teamsData: StaffDto[] = [];
  public systemsData: SystemsDto[] = [];
  public productsData: any[] = [];
  public accountsData: any[] = [];
  public divisionsData: OrganizationDivisionDTO[] = [];
  public selectedOrg: OrganizationDTO;
  public selectedOrganization: number;

  public selectedSystem: number;
  public organizationDetails: any;
  public extras: Extras;
  public errorOccurred = false;
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private gisProductService: ProductsService,
    private lmsProductService: ProductService,
    private systemService: SystemsService,
    private organizationService: OrganizationService,
    private staffService: StaffService,
    private intermediaryService: IntermediaryService,
    private leadService: LeadsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.CreateOrganizationForm();
    this.fetchSystemApps();
    this.fetchAssignedTo();
    this.fetchTeams();
    this.fetchAgents();
    this.fetchOrganizations();
  }

  ngOnDestroy(): void {}

  CreateOrganizationForm() {
    this.organizationDetailForm = this.fb.group({
      assignedTo: [''],
      organization: [''],
      division: [''],
      team: [''],
      system: [''],
      product: [''],
      accountName: [''],
    });
  }

  onSystemChange(systemId: number) {
    this.selectedSystem = systemId;
    this.productsData = [];

    if (systemId === 37) {
      this.fetchGisProducts();
    } else if (systemId === 27) {
      this.fetchLmsProducts();
    } else {
      return of();
    }
  }

  fetchGisProducts() {
    this.gisProductService.getAllProducts().pipe(
      take(1),
      map((data) => {
        this.productsData = data.map((product) => ({
          code: product.code,
          description: product.description,
        }));
        log.info('GIS products:', this.productsData);
        return this.productsData;
      })
    ).subscribe(
      (data) => {
        this.productsData = data;
        log.info('GIS products:', this.productsData);
      });
  }

  fetchLmsProducts() {
    this.lmsProductService.getListOfProduct().pipe(
      take(1),
      map((data) => {
        this.productsData = data.map((product) => ({
          code: product.code,
          description: product.description,
        }));
        log.info('LMS products:', this.productsData);
        return this.productsData;
      })
    ).subscribe(
      (data) => {
        this.productsData = data;
        log.info('LMS products:', this.productsData);
      });
  }

  fetchSystemApps(organizationId?: number) {
    this.systemService
      .getSystems(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.systemsData = data;
            log.info('Systems Data:', this.systemsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchOrganizations() {
    this.organizationService
      .getOrganization()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.organizationsData = data;
            log.info(`Fetched Organization Data`, this.organizationsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.errors[0];
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchAssignedTo() {
    this.staffService
      .getStaff(0, 1000, 'U', 'dateCreated', 'desc', null)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.assignedToData = data.content;
            log.info('Fetch All Users:', this.assignedToData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchTeams() {
    this.staffService
      .getStaff(0, 1000, 'G', 'dateCreated', 'desc', null)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.teamsData = data.content;
            log.info('Fetch All Group Users:', this.teamsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchAgents() {
    this.intermediaryService
      .getAgents(0, 1000)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.accountsData = data.content;
            log.info('Fetch All Agents:', this.accountsData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.error?.error;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  prepareUpdateDetails(organizationDetails: any, extras: Extras): void {
    this.organizationDetails = organizationDetails;
    this.extras = extras;
    log.info(`Organization Details for Edit`, this.organizationDetails);
    this.organizationDetailForm.patchValue({
      assignedTo: this.organizationDetails.userCode,
      organization: this.organizationDetails.organizationCode,
      division: this.organizationDetails.divisionCode,
      team: this.organizationDetails.teamCode,
      system: this.organizationDetails.systemCode,
      product: this.organizationDetails.productCode,
      accountName: this.organizationDetails.accountCode,
    });
    this.selectedSystem = this.organizationDetails.systemCode;
    this.onSystemChange(this.selectedSystem).subscribe(() => {
      this.organizationDetailForm.patchValue({
        product: this.organizationDetails.productCode,
      });
    });
    this.cdr.detectChanges();
    this.isFormDetailsReady.emit(true);
  }

  updateDetails(): void {
    const formValues = this.organizationDetailForm.getRawValue();

    const updateOrganizationDetails = {
      userCode: formValues.assignedTo,
      organizationCode: formValues.organization,
      teamCode: formValues.team,
      systemCode: formValues.system,
      productCode: formValues.product,
      accountCode: formValues.accountName,
    };
    log.info(`Organization Details to be Update`, updateOrganizationDetails);
    this.leadService
      .updateLead(updateOrganizationDetails, this.extras.leadId)
      .subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated Organization Details'
          );
          this.closeEditModal.emit();
          this.isFormDetailsReady.emit(false);
        },
        error: (err) => {
          const errorMessage = err?.error?.message ?? err.message;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            errorMessage
          );
        },
      });
  }
}
