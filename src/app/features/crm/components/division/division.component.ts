import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import stepData from '../../data/steps.json';
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { OrganizationService } from '../../services/organization.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import {
  BranchDivisionDTO,
  OrganizationDTO,
  OrganizationDivisionDTO,
} from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { Router } from '@angular/router';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';
import { Table } from 'primeng/table';

const log = new Logger('DivisionComponent');

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css'],
})
export class DivisionComponent implements OnInit {
  @ViewChild('divisionModal') divisionModal: ElementRef;
  @ViewChild('divisionTable') divisionTable: Table;
  @ViewChild('confirmationModal') confirmationModal: ElementRef;
  @ViewChild('divisionConfirmationModal')
  divisionConfirmationModal!: ReusableInputComponent;

  public createDivisionForm: FormGroup;
  showModal = false;

  public steps = stepData;

  public organizationsData: OrganizationDTO[];
  public divisionData: OrganizationDivisionDTO[];
  public divisionBranchData: BranchDivisionDTO[];
  public selectedRadioValue: string | null = null;
  public selectedOrg: OrganizationDTO;
  public selectOrganization: OrganizationDTO;
  public selectedOrganization: number;
  public selectedOrganizationId: number | null;
  public selectedDivision: OrganizationDivisionDTO;
  public selectedDefaultStatus: string = 'No';
  public statusesData: StatusDTO[];

  public errorOccurred = false;
  public errorMessage: string = '';

  organizationBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/dashboard',
    },
    {
      label: 'Organization',
      url: 'home/crm/organization',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private statusService: StatusService,
    private globalMessagingService: GlobalMessagingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.DivisionCreateForm();
    this.fetchOrganization();
    this.organizationService.selectedOrganizationId$.subscribe(
      (selectedOrganizationId) => {
        this.selectedOrganizationId = selectedOrganizationId;
        if (this.selectedOrganizationId !== null) {
          this.fetchOrganizationDivision(this.selectedOrganizationId);
        }
      }
    );
    this.fetchStatuses();
  }

  ngOnDestroy(): void {}

  DivisionCreateForm() {
    this.createDivisionForm = this.fb.group({
      shortDescription: [''],
      name: [''],
      divisionOrder: [''],
      divisionStatus: [''],
      default: [''],
    });
  }

  get f() {
    return this.createDivisionForm.controls;
  }

  fetchOrganization() {
    this.organizationService
      .getOrganization()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.organizationsData = data;
        log.info('Organization Data', this.organizationsData);
      });
  }

  fetchStatuses() {
    this.statusService
      .getDivisionStatus()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.statusesData = data;
        log.info('Fetched Statuses', this.statusesData);
      });
  }

  onOrganizationChange() {
    this.selectedOrg = null;
    this.selectedDivision = null;
    const selectedOrganizationId = this.selectedOrganizationId;
    this.selectedOrg = this.organizationsData.find(
      (organization) => organization.id === selectedOrganizationId
    );
    this.fetchOrganizationDivision(this.selectedOrg.id);
    // Set the selected organization ID in the service
    this.organizationService.setSelectedOrganizationId(
      this.selectedOrganizationId
    );
  }

  fetchOrganizationDivision(organizationId: number) {
    this.organizationService
      .getOrganizationDivision(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.divisionData = data;
        log.info('Division Data', this.divisionData);
      });
  }

  fetchOrganizationDivisionBranch(divisionId: number) {
    this.organizationService
      .getOrganizationDivisionBranch(divisionId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.divisionBranchData = data;
        log.info('Division Branch Data', this.divisionBranchData);
      });
  }

  filterDivision(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.divisionTable.filterGlobal(filterValue, 'contains');
  }

  openDivisionModal() {
    const modal = document.getElementById('divisionModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeDivisionModal() {
    const modal = document.getElementById('divisionModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  onDivisionRowSelect(division: OrganizationDivisionDTO) {
    this.selectedDivision = division;
    this.fetchOrganizationDivisionBranch(this.selectedDivision.id);
  }

  saveDivision() {
    this.closeDivisionModal();
    const organizationFormValues = this.createDivisionForm.getRawValue();
    const selectedValue = organizationFormValues.default;

    const existingDefault = this.divisionData.find(
      (division) => division.is_default_division === 'Y'
    );

    if (selectedValue === 'Y' && existingDefault) {
      this.openConfirmationModal();
    } else {
      this.finalizeDivisionSave(organizationFormValues, selectedValue);
    }
  }

  confirmDefaultDivision(selectedValue: string) {
    this.selectedDefaultStatus = selectedValue;
    this.closeConfirmationModal();

    const organizationFormValues = this.createDivisionForm.getRawValue();

    if (selectedValue === 'Y') {
      const existingDefault = this.divisionData.find(
        (division) => division.is_default_division === 'Y'
      );

      if (existingDefault) {
        existingDefault.is_default_division = 'N';
      }
    }

    this.finalizeDivisionSave(organizationFormValues, selectedValue);
  }

  protected finalizeDivisionSave(formValues: any, isDefault: string) {
    if (!this.selectedDivision) {
      const saveOrganizationDivision: OrganizationDivisionDTO = {
        id: null,
        is_default_division: isDefault,
        name: formValues.name,
        order: formValues.divisionOrder,
        organization_id: this.selectedOrganizationId,
        short_description: formValues.shortDescription,
        status: formValues.divisionStatus,
      };
      this.organizationService
        .createOrganizationDivision(saveOrganizationDivision)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Created a Division'
              );
              this.createDivisionForm.reset();
              this.fetchOrganizationDivision(this.selectedOrganizationId);
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
            this.globalMessagingService.displayErrorMessage(
              'Error',
              err?.error?.errors[0]
            );
            log.info(`error >>>`, err);
          },
        });
    } else {
      const divisionId = this.selectedDivision.id;

      const saveOrganizationDivision: OrganizationDivisionDTO = {
        id: divisionId,
        is_default_division: isDefault,
        name: formValues.name,
        order: formValues.divisionOrder,
        organization_id: this.selectedOrganizationId,
        short_description: formValues.shortDescription,
        status: formValues.divisionStatus,
      };
      this.organizationService
        .updateOrganizationDivision(divisionId, saveOrganizationDivision)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated a Division'
              );
              this.selectedDivision = null;
              this.fetchOrganizationDivision(this.selectedOrganizationId);
              this.createDivisionForm.reset();
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
            this.globalMessagingService.displayErrorMessage(
              'Error',
              err?.error?.errors[0]
            );
            log.info(`error >>>`, err);
          },
        });
    }
  }

  editDivision() {
    if (this.selectedDivision) {
      this.openDivisionModal();
      this.createDivisionForm.patchValue({
        shortDescription: this.selectedDivision.short_description,
        name: this.selectedDivision.name,
        divisionOrder: this.selectedDivision.order,
        divisionStatus: this.selectedDivision.status,
        default: this.selectedDivision.is_default_division,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Division is selected.'
      );
    }
  }

  deleteDivision() {
    this.divisionConfirmationModal.show();
  }

  confirmDivisionDelete() {
    if (this.selectedDivision) {
      const divisionId = this.selectedDivision.id;
      this.organizationService
        .deleteOrganizationDivision(divisionId)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'success',
                'Successfully deactivated a Division'
              );
              this.selectedDivision = null;
              this.fetchOrganizationDivision(this.selectedOrg.id);
              this.cdr.detectChanges();
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
            this.globalMessagingService.displayErrorMessage(
              'Error',
              err?.error?.errors[0]
            );
            log.info(`error >>>`, err);
          },
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Division is Selected!'
      );
    }
  }

  onNext() {
    this.router.navigate(['/home/crm/region']);
  }
}
