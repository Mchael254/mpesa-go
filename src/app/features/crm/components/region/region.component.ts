import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import stepData from '../../data/steps.json';
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrganizationService } from '../../services/organization.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import {
  ManagersDTO,
  OrganizationDTO,
  OrganizationRegionDTO,
  PostOrganizationRegionDTO,
  YesNoDTO,
} from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { BankRegionDTO } from '../../../../shared/data/common/bank-dto';
import { Router } from '@angular/router';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { Table } from 'primeng/table';
import { ReusableInputComponent } from 'src/app/shared/components/reusable-input/reusable-input.component';

const log = new Logger('RegionComponent');

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css'],
})
export class RegionComponent implements OnInit {
  @ViewChild('regionModal') regionModal: ElementRef;
  @ViewChild('bankModal') bankModal: ElementRef;
  @ViewChild('regionTable') regionTable: Table;
  @ViewChild('bankRegionTable') bankRegionTable: Table;
  @ViewChild('regionConfirmationModal')
  regionConfirmationModal!: ReusableInputComponent;
  @ViewChild('regionBankConfirmationModal')
  regionBankConfirmationModal!: ReusableInputComponent;

  public createRegionForm: FormGroup;
  public createRegionBankForm: FormGroup;
  public steps = stepData;

  public organizationsData: OrganizationDTO[];
  public regionData: OrganizationRegionDTO[];
  public bankRegionData: BankRegionDTO[];
  public selectedOrg: OrganizationDTO;
  public regionManagersData: ManagersDTO[];
  public optionData: YesNoDTO[];
  public selectedRegion: OrganizationRegionDTO;
  public selectedRegionBank: BankRegionDTO;
  public selectedOrganization: number;
  public selectedOrganizationId: number | null;
  public errorOccurred = false;
  public errorMessage: string = '';

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
      url: 'home/crm/organization',
    },
    {
      label: 'Region',
      url: 'home/crm/region',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private bankService: BankService,
    private globalMessagingService: GlobalMessagingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.RegionCreateForm();
    this.RegionBankForm();
    this.fetchOrganization();
    this.organizationService.selectedOrganizationId$.subscribe(
      (selectedOrganizationId) => {
        this.selectedOrganizationId = selectedOrganizationId;
        if (this.selectedOrganizationId !== null) {
          this.fetchOrganizationRegion(this.selectedOrganizationId);
          this.fetchManager(this.selectedOrganizationId);
        }
      }
    );
    this.fetchOptions();
  }

  ngOnDestroy(): void {}

  RegionCreateForm() {
    this.createRegionForm = this.fb.group({
      shortDescription: [''],
      name: [''],
      manager: [''],
      managerAllowed: [''],
      wef: [''],
      wet: [''],
      commissionEarned: [''],
    });
  }

  get f() {
    return this.createRegionForm.controls;
  }

  RegionBankForm() {
    this.createRegionBankForm = this.fb.group({
      shortDescription: [''],
      name: [''],
      wef: [''],
      wet: [''],
      manager: [''],
    });
  }

  openRegionModal() {
    const modal = document.getElementById('regionModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeRegionModal() {
    const modal = document.getElementById('regionModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openBankModal() {
    const modal = document.getElementById('bankModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeBankModal() {
    const modal = document.getElementById('bankModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
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

  onOrganizationChange() {
    this.selectedOrg = null;
    this.selectedRegion = null;
    this.selectedRegionBank = null;
    this.bankRegionData = null;
    const selectedOrganizationId = this.selectedOrganizationId;
    this.selectedOrg = this.organizationsData.find(
      (organization) => organization.id === selectedOrganizationId
    );
    this.fetchOrganizationRegion(this.selectedOrg?.id);
    this.fetchManager(this.selectedOrg?.id);
    // Set the selected organization ID in the service
    this.organizationService.setSelectedOrganizationId(
      this.selectedOrganizationId
    );
  }

  fetchOrganizationRegion(organizationId: number) {
    this.organizationService
      .getOrganizationRegion(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.regionData = data;
        log.info('Region Data', this.regionData);
      });
  }

  fetchManager(organizationId?: number) {
    this.organizationService
      .getRegionManagers(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.regionManagersData = data;
        log.info('Manager Data', this.regionManagersData);
      });
  }

  fetchOptions() {
    this.organizationService
      .getOptionValues()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.optionData = data;
        log.info('Option Data', this.optionData);
      });
  }

  fetchBankRegions(code: number) {
    this.bankService
      .getBankRegion(code)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.bankRegionData = data;
        log.info(`Bank Region Data`, this.bankRegionData);
      });
  }

  onRegionRowClick(region: OrganizationRegionDTO) {
    this.selectedRegion = region;
    this.fetchBankRegions(this.selectedRegion.code);

    // Set the selected region in the service
    this.organizationService.setSelectedRegion(this.selectedRegion.code);
  }

  onRegionBankRowClick(bank: BankRegionDTO) {
    this.selectedRegionBank = bank;
  }

  filterRegion(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.regionTable.filterGlobal(filterValue, 'contains');
  }

  filterRegionBank(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bankRegionTable.filterGlobal(filterValue, 'contains');
  }

  saveRegion() {
    this.closeRegionModal();
    if (!this.selectedRegion) {
      const regionFormValues = this.createRegionForm.getRawValue();
      const organizationId = this.selectedOrg.id;

      const saveOrganizationRegion: PostOrganizationRegionDTO = {
        agentSeqNo: null,
        branchMgrSeqNo: null,
        clientSequence: null,
        code: null,
        computeOverOwnBusiness: '',
        dateFrom: regionFormValues.wef,
        dateTo: regionFormValues.wet,
        managerAllowed: regionFormValues.managerAllowed,
        managerId: regionFormValues.manager,
        name: regionFormValues.name,
        organizationId: organizationId,
        overrideCommissionEarned: regionFormValues.overrideCommissionEarned,
        policySeqNo: null,
        postingLevel: null,
        preContractAgentSeqNo: null,
        shortDescription: regionFormValues.shortDescription,
      };
      this.organizationService
        .createOrganizationRegion(saveOrganizationRegion)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Created a Region'
              );
              this.createRegionForm.reset();
              this.fetchOrganizationRegion(this.selectedOrg.id);
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
      const regionFormValues = this.createRegionForm.getRawValue();
      const organizationId = this.selectedOrg.id;
      const regionCode = this.selectedRegion.code;

      const saveOrganizationRegion: PostOrganizationRegionDTO = {
        agentSeqNo: null,
        branchMgrSeqNo: null,
        clientSequence: null,
        code: regionCode,
        computeOverOwnBusiness: '',
        dateFrom: regionFormValues.wef,
        dateTo: regionFormValues.wet,
        managerAllowed: regionFormValues.managerAllowed,
        managerId: regionFormValues.manager,
        name: regionFormValues.name,
        organizationId: organizationId,
        overrideCommissionEarned: regionFormValues.overrideCommissionEarned,
        policySeqNo: null,
        postingLevel: null,
        preContractAgentSeqNo: null,
        shortDescription: regionFormValues.shortDescription,
      };
      this.organizationService
        .updateOrganizationRegion(regionCode, saveOrganizationRegion)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated a Region'
              );
              this.selectedRegion = null;
              this.createRegionForm.reset();
              this.fetchOrganizationRegion(this.selectedOrg.id);
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

  saveRegionBank() {
    this.closeBankModal();
    if (!this.selectedRegionBank) {
      const regionBankFormValues = this.createRegionBankForm.getRawValue();
      const organizationId = this.selectedOrg.id;
      const regionCode = this.selectedRegion.code;

      const saveRegionBank: BankRegionDTO = {
        bankRegionName: regionBankFormValues.name,
        id: null,
        managerId: regionBankFormValues.manager,
        organizationId: organizationId,
        regionCode: regionCode,
        shortDescription: regionBankFormValues.shortDescription,
        wef: regionBankFormValues.wef,
        wet: regionBankFormValues.wet,
      };
      this.bankService.createBankRegion(saveRegionBank).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Created a RegionBank'
            );
            this.createRegionForm.reset();
            this.fetchBankRegions(this.selectedRegion.code);
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
      const regionBankFormValues = this.createRegionBankForm.getRawValue();
      const organizationId = this.selectedOrg.id;
      const regionCode = this.selectedRegion.code;
      const regionBankId = this.selectedRegionBank.id;

      const saveRegionBank: BankRegionDTO = {
        bankRegionName: regionBankFormValues.name,
        id: regionBankId,
        managerId: regionBankFormValues.manager,
        organizationId: organizationId,
        regionCode: regionCode,
        shortDescription: regionBankFormValues.shortDescription,
        wef: regionBankFormValues.wef,
        wet: regionBankFormValues.wet,
      };
      this.bankService
        .updateBankRegion(regionBankId, saveRegionBank)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated a RegionBank'
              );
              this.selectedRegionBank = null;
              this.createRegionForm.reset();
              this.fetchBankRegions(this.selectedRegion.code);
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

  editRegion() {
    if (this.selectedRegion) {
      this.openRegionModal();
      this.createRegionForm.patchValue({
        organization: this.selectedRegion.organization,
        shortDescription: this.selectedRegion.shortDescription,
        name: this.selectedRegion.name,
        manager: this.selectedRegion.managerId,
        managerAllowed: this.selectedRegion.managerAllowed,
        wef: this.selectedRegion.dateFrom,
        wet: this.selectedRegion.dateTo,
        commissionEarned: this.selectedRegion.overrideCommissionEarned,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Region is selected.'
      );
    }
  }

  deleteRegion() {
    this.regionConfirmationModal.show();
  }

  confirmRegionDelete() {
    if (this.selectedRegion) {
      const regionCode = this.selectedRegion.code;
      this.organizationService.deleteOrganizationRegion(regionCode).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted a Region'
            );
            this.selectedRegion = null;
            this.fetchOrganizationRegion(this.selectedOrg.id);
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
        'No Region is Selected!'
      );
    }
  }

  editRegionBank() {
    if (this.selectedRegionBank) {
      this.openBankModal();
      this.createRegionBankForm.patchValue({
        shortDescription: this.selectedRegionBank.shortDescription,
        name: this.selectedRegionBank.bankRegionName,
        wef: this.selectedRegionBank.wef,
        wet: this.selectedRegionBank.wet,
        manager: this.selectedRegionBank.managerId,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Region Bank is selected.'
      );
    }
  }

  deleteRegionBank() {
    this.regionBankConfirmationModal.show();
  }

  confirmRegionBankDelete() {
    if (this.selectedRegionBank) {
      const regionBankId = this.selectedRegionBank.id;
      this.bankService.deleteBankRegion(regionBankId).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted a Region Bank'
            );
            this.fetchBankRegions(this.selectedRegion.code);
            this.selectedRegionBank = null;
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
        'No Region Bank is Selected!'
      );
    }
  }

  onNext() {
    this.router.navigate(['/home/crm/branch']);
  }
}
