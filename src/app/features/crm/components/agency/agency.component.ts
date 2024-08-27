import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import stepData from '../../data/steps.json';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { OrganizationService } from '../../services/organization.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import {
  BranchAgencyDTO,
  ManagersDTO,
  OrganizationBranchDTO,
  OrganizationDTO,
} from '../../data/organization-dto';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';
import { ReusableInputComponent } from 'src/app/shared/components/reusable-input/reusable-input.component';
import { ReplaySubject, combineLatest, filter, takeUntil } from 'rxjs';

const log = new Logger('AgencyComponent');

/* The `AgencyComponent` class in TypeScript handles the management of organization branch agencies,
including creating, updating, deleting, and transferring agencies, as well as handling form
validations and fetching necessary data. */
@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css'],
})
export class AgencyComponent implements OnInit {
  @ViewChild('agencyTable') agencyTable: Table;
  @ViewChild('branchAgencyConfirmationModal')
  branchAgencyConfirmationModal!: ReusableInputComponent;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public createAgencyForm: FormGroup;
  public createAgencyTransferForm: FormGroup;

  public agenciesData: BranchAgencyDTO[] = [];
  public organizationsData: OrganizationDTO[] = [];
  public branchesData: OrganizationBranchDTO[] = [];
  public managersData: ManagersDTO[] = [];
  public statusesData: StatusDTO[];
  public selectedOrg: OrganizationDTO;
  public selectedBra: OrganizationBranchDTO;
  public selectedAgency: BranchAgencyDTO;
  public selectedManager: any;
  public selectedOrganizationId: number | null = null;
  public selectedBranch: number;
  public transferBranch: number;

  public steps = stepData;

  public groupId: string = 'organizationAgencyTab';
  public response: any;
  public submitted = false;
  public errorOccurred = false;
  public errorMessage: string = '';
  public visibleStatus: any = {};

  organizationBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/crm',
    },
    {
      label: 'Organization',
      url: '/home/crm/organization',
    },
    {
      label: 'Agencies',
      url: '/home/crm/agencies',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private statusService: StatusService,
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.AgencyCreateForm();
    this.AgencyTransferCreateForm();
    this.fetchOrganization();
    this.fetchStatuses();

    // Combine observables to wait for both organization and branch selection
    combineLatest([
      this.organizationService.selectedOrganizationId$,
      this.organizationService.selectedBranch$,
    ])
      .pipe(
        filter(([organizationId, selectedBranch]) => organizationId !== null),
        takeUntil(this.destroyed$)
      )
      .subscribe(([organizationId, selectedBranch]) => {
        this.selectedOrganizationId = organizationId;
        this.selectedBranch = selectedBranch;
        this.fetchOrganizationBranch(this.selectedOrganizationId);
        this.fetchOrganizationBranchAgency(this.selectedBranch);
      });
  }

  ngOnDestroy(): void {}

  AgencyCreateForm() {
    this.createAgencyForm = this.fb.group({
      code: [{ value: '', disabled: true }],
      id: [{ value: '', disabled: true }],
      name: [''],
      status: [''],
      manager: [''],
      managerAllowed: [''],
      commission: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          this.visibleStatus[field.frontedId] = field.visibleStatus;
          if (field.visibleStatus === 'Y' && field.mandatoryStatus === 'Y') {
            const key = field.frontedId;
            this.createAgencyForm.controls[key].setValidators(
              Validators.required
            );
            this.createAgencyForm.controls[key].updateValueAndValidity();
            const label = document.querySelector(`label[for=${key}]`);
            if (label) {
              const asterisk = document.createElement('span');
              asterisk.innerHTML = ' *';
              asterisk.style.color = 'red';
              label.appendChild(asterisk);
            }
          }
        });
        this.cdr.detectChanges();
      });
  }

  get f() {
    return this.createAgencyForm.controls;
  }

  AgencyTransferCreateForm() {
    this.createAgencyTransferForm = this.fb.group({
      currentBranch: [''],
      agencyName: [''],
      transferDate: [''],
      transferBranch: [''],
    });
  }

  /**
   * The function `onOrganizationChange` resets selected organization and branch data, fetches
   * organization branches and managers, and sets the selected organization ID in the service.
   */
  onOrganizationChange() {
    this.selectedOrg = null;
    this.selectedBra = null;
    this.branchesData = null;
    const selectedOrganizationId = this.selectedOrganizationId;
    this.selectedOrg = this.organizationsData.find(
      (organization) => organization.id === selectedOrganizationId
    );
    this.fetchOrganizationBranch(this.selectedOrg?.id);
    this.fetchBranchManagers(this.selectedOrg?.id);
    // Set the selected organization ID in the service
    this.organizationService.setSelectedOrganizationId(
      this.selectedOrganizationId
    );
  }

  /**
   * The function `onBranchChange` handles the change of selected branch within a TypeScript class,
   * fetching organization branch agency data if an organization is selected.
   */
  onBranchChange() {
    const selectedBranchId = this.selectedBranch;

    if (!this.selectedOrg) {
      this.selectedOrg = this.organizationsData.find(
        (organization) => organization.id === this.selectedOrganizationId
      );
    }

    if (this.selectedOrg) {
      this.selectedBra = this.branchesData.find(
        (branch) => branch.id === selectedBranchId
      );
      this.fetchOrganizationBranchAgency(this.selectedBra?.id);
    } else {
      log.error('Selected Organization is null');
    }
  }

  /**
   * The `filterAgency` function filters the data in the agency table based on the input value provided
   * by the user.
   * @param {Event} event - The `event` parameter in the `filterAgency` function is an Event object that
   * is passed as an argument when the function is called. It is used to capture the event that triggered
   * the filtering action, such as a user input event on an HTML input element.
   */
  filterAgency(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.agencyTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function `openAgencyTransferModal` opens a modal for agency transfer if it exists in the
   * document.
   */
  openAgencyTransferModal() {
    const modal = document.getElementById('agencyTransferModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeAgencyTransferModal` closes a modal by removing the 'show' class and setting
   * its display to 'none'.
   */
  closeAgencyTransferModal() {
    const modal = document.getElementById('agencyTransferModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The `openAgencyModal` function displays the agency modal by adding the 'show' class and setting
   * the display style to 'block'.
   */
  openAgencyModal() {
    const modal = document.getElementById('agencyModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeAgencyModal` hides and removes the 'show' class from the agency modal element.
   */
  closeAgencyModal() {
    const modal = document.getElementById('agencyModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `onAgencyRowSelect` assigns the selected agency to a variable called
   * `selectedAgency`.
   * @param {any} agency - The `onAgencyRowSelect` function takes an `agency` parameter, which is of
   * type `any`. When this function is called, it assigns the value of the `agency` parameter to the
   * `selectedAgency` property of the class or component where this function is defined.
   */
  onAgencyRowSelect(agency: BranchAgencyDTO) {
    this.selectedAgency = agency;
  }

  /**
   * The `fetchStatuses` function fetches status data using a service, stores it in `statusesData`, and
   * logs the fetched data.
   */
  fetchStatuses() {
    this.statusService
      .getStatus()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.statusesData = data;
        log.info('Fetched Statuses', this.statusesData);
      });
  }

  /**
   * The `fetchBranchManagers` function fetches branch managers data for a specific organization ID and
   * logs the fetched data.
   * @param {number} [organizationId] - The `organizationId` parameter is an optional parameter of type
   * number that is used to specify the ID of the organization for which you want to fetch branch
   * managers. If `organizationId` is provided, the function will fetch branch managers for that
   * specific organization. If `organizationId` is not provided,
   */
  fetchBranchManagers(organizationId?: number) {
    this.organizationService
      .getBranchManagers(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.managersData = data;
        log.info('Fetched Managers', this.managersData);
      });
  }

  /**
   * The `fetchOrganization` function fetches organization data using a service, subscribes to the data
   * stream, and logs the retrieved data.
   */
  fetchOrganization() {
    this.organizationService
      .getOrganization()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.organizationsData = data;
        log.info('Organization Data', this.organizationsData);
      });
  }

  /**
   * The fetchOrganizationBranch function retrieves organization branch data based on the provided
   * organization and region IDs.
   * @param {number} [organizationId] - The `organizationId` parameter is used to specify the ID of the
   * organization for which you want to fetch branch data. It is an optional parameter, meaning it can
   * be provided or left undefined.
   * @param {number} [regionId] - The `regionId` parameter in the `fetchOrganizationBranch` function is
   * used to specify the region for which you want to fetch organization branches. It is an optional
   * parameter, meaning you can provide a specific regionId to filter the branches based on a
   * particular region. If you do not provide a `
   */
  fetchOrganizationBranch(organizationId?: number, regionId?: number) {
    this.organizationService
      .getOrganizationBranch(organizationId, regionId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.branchesData = data;
        log.info('Branch Data', this.branchesData);
      });
  }

  /**
   * The function fetches organization branch agency data for a given branch ID and logs the result.
   * @param {number} branchId - The `branchId` parameter is a number that represents the unique
   * identifier of a branch within an organization. This function `fetchOrganizationBranchAgency` is
   * used to retrieve agency data associated with a specific branch by making a call to the
   * `organizationService` and subscribing to the response data.
   */
  fetchOrganizationBranchAgency(branchId: number) {
    this.organizationService
      .getOrganizationBranchAgency(branchId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.agenciesData = data;
        log.info('Branch Agencies', this.agenciesData);
      });
  }

  /**
   * The `saveAgency` function in TypeScript handles the saving and updating of organization branch
   * agencies, displaying success or error messages accordingly.
   * @returns The `saveAgency()` function returns either nothing (undefined) or exits early if the form
   * is invalid and focuses on the first unfilled invalid control. If the form is valid, it either
   * creates a new organization branch agency or updates an existing one based on the conditions within
   * the function.
   */
  saveAgency() {
    this.submitted = true;
    this.createAgencyForm.markAllAsTouched();

    if (this.createAgencyForm.invalid) {
      const invalidControls = Array.from(
        document.querySelectorAll('.is-invalid')
      ) as Array<HTMLInputElement | HTMLSelectElement>;

      let firstInvalidUnfilledControl:
        | HTMLInputElement
        | HTMLSelectElement
        | null = null;

      for (const control of invalidControls) {
        if (!control.value) {
          firstInvalidUnfilledControl = control;
          break;
        }
      }

      if (firstInvalidUnfilledControl) {
        firstInvalidUnfilledControl.focus();
        const scrollContainer = this.utilService.findScrollContainer(
          firstInvalidUnfilledControl
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop;
        }
      } else {
        const firstInvalidControl = invalidControls[0];
        if (firstInvalidControl) {
          firstInvalidControl.focus();
          const scrollContainer =
            this.utilService.findScrollContainer(firstInvalidControl);
          if (scrollContainer) {
            scrollContainer.scrollTop = firstInvalidControl.offsetTop;
          }
        }
      }
      return;
    }
    this.closeAgencyModal();
    if (!this.selectedAgency) {
      const branchAgencyFormValues = this.createAgencyForm.getRawValue();
      const branchId = this.selectedBra?.id;

      const saveBranchAgency: BranchAgencyDTO = {
        agentCode: null,
        branchId: branchId,
        code: null,
        manager: branchAgencyFormValues.manager,
        managerAllowed: branchAgencyFormValues.managerAllowed,
        managerSequenceNo: null,
        name: branchAgencyFormValues.name,
        overrideCommEarned: branchAgencyFormValues.commission,
        policySequenceNo: null,
        postLevel: null,
        propertySequenceNo: null,
        sequenceNo: null,
        shortDescription: null,
        status: branchAgencyFormValues.status,
      };
      //create a new organization branch agency
      this.organizationService
        .createOrganizationBranchAgency(saveBranchAgency, branchId)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Created an Organization Branch Agency'
              );
              this.createAgencyForm.reset();
              this.fetchOrganizationBranchAgency(branchId);
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
    } else {
      const branchAgencyFormValues = this.createAgencyForm.getRawValue();
      const branchId = this.selectedBra?.id;
      const branchAgencyId = this.selectedAgency.code;

      const updateBranchAgency: BranchAgencyDTO = {
        agentCode: this.selectedAgency.agentCode,
        branchId: branchId,
        code: branchAgencyId,
        manager: branchAgencyFormValues.manager,
        managerAllowed: branchAgencyFormValues.managerAllowed,
        managerSequenceNo: this.selectedAgency.managerSequenceNo,
        name: branchAgencyFormValues.name,
        overrideCommEarned: branchAgencyFormValues.commission,
        policySequenceNo: this.selectedAgency.policySequenceNo,
        postLevel: this.selectedAgency.postLevel,
        propertySequenceNo: this.selectedAgency.propertySequenceNo,
        sequenceNo: this.selectedAgency.sequenceNo,
        shortDescription: this.selectedAgency.shortDescription,
        status: branchAgencyFormValues.status,
      };
      //update an organization branch agency
      this.organizationService
        .updateOrganizationBranchAgency(
          updateBranchAgency,
          branchAgencyId,
          branchId
        )
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated an Organization Branch Agency'
              );
              this.createAgencyForm.reset();
              this.selectedAgency = null;
              this.fetchOrganizationBranchAgency(branchId);
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
  }

  /**
   * The `editAgency` function populates a form with data from a selected agency for editing.
   */
  editAgency() {
    if (this.selectedAgency) {
      this.openAgencyModal();
      this.createAgencyForm.patchValue({
        code: this.selectedAgency.code,
        id: this.selectedAgency.shortDescription,
        name: this.selectedAgency.name,
        status: this.selectedAgency.status,
        manager: this.selectedAgency.manager,
        managerAllowed: this.selectedAgency.managerAllowed,
        commission: this.selectedAgency.overrideCommEarned,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Organization Branch Agency is Selected!'
      );
    }
  }

  /**
   * The `deleteAgency` function displays a confirmation modal for deleting a branch agency.
   */
  deleteAgency() {
    this.branchAgencyConfirmationModal.show();
  }

  /**
   * The function `confirmBranchAgencyDelete` deletes a selected organization branch agency and
   * displays success or error messages accordingly.
   */
  confirmBranchAgencyDelete() {
    if (this.selectedAgency) {
      const branchId = this.selectedBra?.id;
      const branchAgencyId = this.selectedAgency?.code;
      this.organizationService
        .deleteOrganizationBranchAgency(branchAgencyId, branchId)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'success',
                'Successfully Deleted an Organization Branch Agency'
              );
              this.selectedAgency = null;
              this.fetchOrganizationBranchAgency(branchId);
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
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Organization Branch Agency is selected.'
      );
    }
  }

  transferBranchAgency() {
    if (this.selectedAgency) {
      this.openAgencyTransferModal();
      const date = new Date();
      const formattedDate = date.toISOString().substring(0, 10);
      this.createAgencyTransferForm.patchValue({
        agencyName: this.selectedAgency.name,
        transferDate: formattedDate,
      });
    }
  }

  transferAgency() {
    this.closeAgencyTransferModal();
    const branchAgencyTransferFormValues =
      this.createAgencyTransferForm.getRawValue();
    const fromBranchId = branchAgencyTransferFormValues.currentBranch;
    const toBranchId = branchAgencyTransferFormValues.transferBranch;
    const branchAgencyId = this.selectedAgency?.code;

    this.organizationService
      .transferOrganizationBranchAgency(
        branchAgencyId,
        fromBranchId,
        toBranchId
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully Transfered Organization Branch Agency'
            );
            this.createAgencyTransferForm.reset();
            this.selectedAgency = null;
            this.fetchOrganizationBranchAgency(fromBranchId);
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
}
