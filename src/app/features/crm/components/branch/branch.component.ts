import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import stepData from '../../data/steps.json';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import {
  BranchContactDTO,
  BranchDivisionDTO,
  OrganizationBranchDTO,
  OrganizationDTO,
  OrganizationRegionDTO,
} from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { OrganizationService } from '../../services/organization.service';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import {
  CountryDto,
  StateDto,
  TownDto,
} from '../../../../shared/data/common/countryDto';
import { StaffDto } from '../../../../features/entities/data/StaffDto';
import { Table } from 'primeng/table';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';
import { ReplaySubject, combineLatest, filter, takeUntil } from 'rxjs';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { UtilService } from '../../../../shared/services/util/util.service';

const log = new Logger('BranchComponent');

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css'],
})
export class BranchComponent implements OnInit {
  @ViewChild('branchModal ') branchModal: ElementRef;
  @ViewChild('branchTransferModal ') branchTransferModal: ElementRef;
  @ViewChild('branchDivisionModal ') branchDivisionModal: ElementRef;
  @ViewChild('branchContactModal ') branchContactModal: ElementRef;
  @ViewChild('branchTable') branchTable: Table;
  @ViewChild('branchContactTable') branchContactTable: Table;
  @ViewChild('branchConfirmationModal')
  branchConfirmationModal!: ReusableInputComponent;
  @ViewChild('branchDivisionConfirmationModal')
  branchDivisionConfirmationModal!: ReusableInputComponent;
  @ViewChild('branchContactConfirmationModal')
  branchContactConfirmationModal!: ReusableInputComponent;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public createBranchForm: FormGroup;
  public createBranchDivisionForm: FormGroup;
  public createBranchContactForm: FormGroup;
  public createBranchTransferForm: FormGroup;

  public steps = stepData;

  public organizationsData: OrganizationDTO[] = [];
  public regionData: OrganizationRegionDTO[] = [];
  public branchesData: OrganizationBranchDTO[] = [];
  public branchDivisionData: BranchDivisionDTO[] = [];
  public branchContacts: BranchContactDTO[] = [];
  public countriesData: CountryDto[];
  public stateData: StateDto[] = [];
  public townData: TownDto[] = [];
  public managersData: StaffDto[] = [];
  public selectedOrg: OrganizationDTO;
  public selectedReg: OrganizationRegionDTO;
  public selectedBranch: OrganizationBranchDTO;
  public selectedBranchDivision: BranchDivisionDTO;
  public selectedBranchContact: BranchContactDTO;
  public countrySelected: CountryDto;
  public stateSelected: StateDto;
  public selectedCountry: number;
  public selectedOrganization: number;
  public selectedOrganizationId: number | null = null;
  public selectedRegion: number;
  public selectedState: number;
  public selectedTown = '';
  public selectedManager = '';
  public selectedStateName: string | null = null;
  public selectedFile: File;
  public url = '';
  public groupId: string = 'organizationBranchTab';
  public response: any;
  public submitted = false;
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
      url: '/home/crm/organization',
    },
    {
      label: 'Branches',
      url: '/home/crm/branch',
    },
  ];

  public visibleStatus: any = {};

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private organizationService: OrganizationService,
    private countryService: CountryService,
    private staffService: StaffService,
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.branchCreateForm();
    this.branchContactCreateForm();
    this.branchDivisionCreateForm();
    this.branchTransferCreateForm();
    this.fetchOrganization();
    this.fetchCountries();
    this.fetchStaffData();

    // Combine observables to wait for both organization and region selection
    combineLatest([
      this.organizationService.selectedOrganizationId$,
      this.organizationService.selectedRegion$,
    ])
      .pipe(
        filter(([organizationId, selectedRegion]) => organizationId !== null),
        takeUntil(this.destroyed$)
      )
      .subscribe(([organizationId, selectedRegion]) => {
        this.selectedOrganizationId = organizationId;
        this.selectedRegion = selectedRegion;
        // call the fetchOrganizationRegion method
        this.fetchOrganizationRegion(this.selectedOrganizationId);
        // call the fetchOrganizationBranch method
        this.fetchOrganizationBranch(
          this.selectedOrganizationId,
          this.selectedRegion
        );
      });
  }

  ngOnDestroy(): void {}

  branchCreateForm() {
    this.createBranchForm = this.fb.group({
      shortDescription: [''],
      branchName: [''],
      country: [''],
      state: [''],
      town: [''],
      physicalAddress: [''],
      postalAddress: [''],
      postalCode: [''],
      telephone: [''],
      emailAddress: [''],
      managerAllowed: [''],
      branchManager: [''],
      commission: [''],
      branchLogo: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          this.visibleStatus[field.frontedId] = field.visibleStatus;
          if (field.visibleStatus === 'Y' && field.mandatoryStatus === 'Y') {
            const key = field.frontedId;
            this.createBranchForm.controls[key].setValidators(
              Validators.required
            );
            this.createBranchForm.controls[key].updateValueAndValidity();
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
    return this.createBranchForm.controls;
  }

  branchContactCreateForm() {
    this.createBranchContactForm = this.fb.group({
      name: [''],
      designation: [''],
      mobileNumber: [''],
      telephoneNumber: [''],
      idNumber: [''],
      homeAddress: [''],
      emailAddress: [''],
    });
  }

  branchTransferCreateForm() {
    this.createBranchTransferForm = this.fb.group({
      currentRegion: [''],
      branchName: [''],
      transferDate: [''],
      transferRegion: [''],
    });
  }

  branchDivisionCreateForm() {
    this.createBranchDivisionForm = this.fb.group({
      division: [''],
    });
  }

  onOrganizationChange() {
    this.selectedOrg = null;
    this.selectedReg = null;
    this.branchesData = null;
    this.branchDivisionData = null;
    this.branchContacts = null;
    const selectedOrganizationId = this.selectedOrganizationId;
    this.selectedOrg = this.organizationsData.find(
      (organization) => organization.id === selectedOrganizationId
    );
    this.fetchOrganizationRegion(this.selectedOrg.id);
  }

  onRegionChange() {
    this.branchDivisionData = null;
    this.branchContacts = null;

    const selectedRegionId = this.selectedRegion;

    // Check if selectedOrg is null, fetch it based on selectedOrganizationId
    if (!this.selectedOrg) {
      this.selectedOrg = this.organizationsData.find(
        (organization) => organization.id === this.selectedOrganizationId
      );
    }

    // Ensure this.selectedOrg is not null before calling fetchOrganizationBranch
    if (this.selectedOrg) {
      this.selectedReg = this.regionData.find(
        (region) => region.code === selectedRegionId
      );
      this.fetchOrganizationBranch(this.selectedOrg.id, this.selectedReg.code);
    } else {
      // Handle the case where this.selectedOrg is null
      log.error('Selected Organization is null');
    }
  }

  onBranchRowSelect(branch: OrganizationBranchDTO) {
    this.selectedBranch = branch;
    this.fetchOrganizationBranchDivision(this.selectedBranch.id);
    this.fetchOrganizationBranchContact(this.selectedBranch.id);
  }

  onBranchDivisionRowSelect(division: BranchDivisionDTO) {
    this.selectedBranchDivision = division;
  }

  onBranchContactRowSelect(contact: BranchContactDTO) {
    this.selectedBranchContact = contact;
  }

  openBranchModal() {
    const modal = document.getElementById('branchModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeBranchModal() {
    const modal = document.getElementById('branchModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openBranchTransferModal() {
    const modal = document.getElementById('branchTransferModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeBranchTransferModal() {
    const modal = document.getElementById('branchTransferModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openBranchDivisionModal() {
    const modal = document.getElementById('branchDivisionModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeBranchDivisionModal() {
    const modal = document.getElementById('branchDivisionModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openBranchContactModal() {
    const modal = document.getElementById('branchContactModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeBranchContactModal() {
    const modal = document.getElementById('branchContactModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  onLogoChange(event) {
    if (event.target.files) {
      const reader = new FileReader();
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        // Set the 'logo' control value with the base64 string
        this.createBranchForm.get('branchLogo').setValue(this.url);
        this.cdr.detectChanges();
      };
    }
  }

  onCountryChange() {
    this.createBranchForm.patchValue({
      state: null,
      town: null,
    });

    const selectedCountryId = this.selectedCountry;
    this.countrySelected = this.countriesData.find(
      (country) => country.id === selectedCountryId
    );

    this.countryService
      .getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.stateData = data;

        if (data.length > 0) {
          this.selectedStateName = data[0].name;
        } else {
          this.selectedStateName = null;
        }
      });
    this.cdr.detectChanges();
  }

  onCityChange() {
    const selectedStateId = this.selectedState;
    this.stateSelected = this.stateData.find(
      (state) => state.id === selectedStateId
    );
    this.countryService
      .getTownsByMainCityState(this.selectedState)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.townData = data;
      });
  }

  filterBranch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.branchTable.filterGlobal(filterValue, 'contains');
  }

  filterBranchContact(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.branchContactTable.filterGlobal(filterValue, 'contains');
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

  fetchOrganizationRegion(organizationId: number) {
    this.organizationService
      .getOrganizationRegion(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.regionData = data;
        log.info('Region Data', this.regionData);
      });
  }

  fetchOrganizationBranchDivision(branchId: number) {
    this.organizationService
      .getOrganizationBranchDivision(branchId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.branchDivisionData = data;
        log.info('Branch Division Data', this.branchDivisionData);
      });
  }

  fetchOrganizationBranchContact(branchId: number) {
    this.organizationService
      .getOrganizationBranchContact(branchId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.branchContacts = data;
        log.info('Branch Contact Data', this.branchContacts);
      });
  }

  fetchOrganizationBranch(organizationId: number, regionId: number) {
    this.organizationService
      .getOrganizationBranch(organizationId, regionId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.branchesData = data;
        log.info('Branch Data', this.branchesData);
      });
  }

  fetchCountries() {
    this.countryService.getCountries().subscribe((data) => {
      this.countriesData = data;
    });
  }

  fetchStaffData() {
    this.staffService
      .getStaff(0, 10, 'U', 'dateCreated', 'desc', null)
      .subscribe(
        (data) => {
          this.managersData = data.content;
          log.info('Fetched staff data:', this.managersData);
        },
        (error) => {
          log.error('Error fetching staff data:', error);
        }
      );
  }

  saveBranch() {
    this.submitted = true;
    this.createBranchForm.markAllAsTouched();

    if (this.createBranchForm.invalid) {
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

    this.closeBranchModal();
    if (!this.selectedBranch) {
      const branchFormValues = this.createBranchForm.getRawValue();
      const organizationId = this.selectedOrganizationId;
      const regionId = this.selectedRegion;

      const saveBranch: OrganizationBranchDTO = {
        bnsCode: null,
        countryId: branchFormValues.country,
        countryName: null,
        emailAddress: branchFormValues.emailAddress,
        generalPolicyClaim: null,
        id: null,
        logo: this.createBranchForm.get('branchLogo').value,
        managerAllowed: branchFormValues.managerAllowed,
        managerId: branchFormValues.branchManager,
        managerName: null,
        managerSeqNo: null,
        name: branchFormValues.branchName,
        organizationId: organizationId,
        overrideCommissionAllowed: branchFormValues.commission,
        physicalAddress: branchFormValues.physicalAddress,
        policyPrefix: null,
        policySequence: null,
        postalAddress: branchFormValues.postalAddress,
        postalCode: branchFormValues.postalCode,
        regionId: regionId,
        regionName: null,
        shortDescription: branchFormValues.shortDescription,
        stateId: branchFormValues.state,
        stateName: null,
        telephone: branchFormValues.telephone,
        townId: branchFormValues.town,
        townName: null,
      };
      // Create a new organization branch
      this.organizationService.createOrganizationBranch(saveBranch).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Created an Organization Branch'
            );
            this.createBranchForm.reset();
            this.fetchOrganizationBranch(organizationId, regionId);
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
      const branchFormValues = this.createBranchForm.getRawValue();
      const organizationId = this.selectedOrganizationId;
      const regionId = this.selectedRegion;
      const branchId = this.selectedBranch.id;

      const saveBranch: OrganizationBranchDTO = {
        bnsCode: this.selectedBranch.bnsCode,
        countryId: branchFormValues.country,
        countryName: null,
        emailAddress: branchFormValues.emailAddress,
        generalPolicyClaim: this.selectedBranch.generalPolicyClaim,
        id: branchId,
        logo: this.createBranchForm.get('branchLogo').value,
        managerAllowed: branchFormValues.managerAllowed,
        managerId: branchFormValues.branchManager,
        managerName: null,
        managerSeqNo: this.selectedBranch.managerSeqNo,
        name: branchFormValues.branchName,
        organizationId: organizationId,
        overrideCommissionAllowed: branchFormValues.commission,
        physicalAddress: branchFormValues.physicalAddress,
        policyPrefix: this.selectedBranch.policyPrefix,
        policySequence: this.selectedBranch.policySequence,
        postalAddress: branchFormValues.postalAddress,
        postalCode: branchFormValues.postalCode,
        regionId: regionId,
        regionName: null,
        shortDescription: branchFormValues.shortDescription,
        stateId: branchFormValues.state,
        stateName: null,
        telephone: branchFormValues.telephone,
        townId: branchFormValues.town,
        townName: null,
      };
      // Update organization branch
      this.organizationService
        .updateOrganizationBranch(branchId, saveBranch)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated Organization Branch'
              );
              this.selectedBranch = null;
              this.createBranchForm.reset();
              this.fetchOrganizationBranch(organizationId, regionId);
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

  editBranch() {
    if (this.selectedBranch) {
      this.openBranchModal();
      this.createBranchForm.patchValue({
        shortDescription: this.selectedBranch.shortDescription,
        branchName: this.selectedBranch.name,
        country: this.selectedBranch.countryId,
        state: this.selectedBranch.stateId,
        town: this.selectedBranch.townId,
        physicalAddress: this.selectedBranch.physicalAddress,
        postalAddress: this.selectedBranch.postalAddress,
        postalCode: this.selectedBranch.postalCode,
        telephone: this.selectedBranch.telephone,
        emailAddress: this.selectedBranch.emailAddress,
        managerAllowed: this.selectedBranch.managerAllowed,
        branchManager: this.selectedBranch.managerId,
        commission: this.selectedBranch.overrideCommissionAllowed,
        // branchLogo: this.selectedBranch.logo
      });
      this.url = this.selectedBranch.logo
        ? 'data:image/jpeg;base64,' + this.selectedBranch.logo
        : '';
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Organization Branch is selected!.'
      );
    }
  }

  deleteBranch() {
    this.branchConfirmationModal.show();
  }

  confirmBranchDelete() {
    if (this.selectedBranch) {
      const branchId = this.selectedBranch.id;
      const organizationId = this.selectedOrganizationId;
      const regionId = this.selectedRegion;
      this.organizationService.deleteOrganizationBranch(branchId).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted an Organizatio Branch'
            );
            this.selectedBranch = null;
            this.fetchOrganizationBranch(organizationId, regionId);
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
        'No Organization Branch is selected.'
      );
    }
  }

  transferBranch() {}

  saveBranchDivision() {
    this.closeBranchDivisionModal();
    if (!this.selectedBranchDivision) {
      const divisionFormValues = this.createBranchDivisionForm.getRawValue();
      const branchId = this.selectedBranch.id;

      const saveBranchDivision: BranchDivisionDTO = {
        branchId: branchId,
        branchName: this.selectedBranch.name,
        divisionId: null,
        divisionName: divisionFormValues.division,
        id: null,
        withEffectiveFrom: '',
        withEffectiveTo: '',
      };
      this.organizationService
        .createOrganizationBranchDivision(branchId, saveBranchDivision)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Created a Branch Division'
              );
              this.fetchOrganizationBranchDivision(branchId);
              this.createBranchDivisionForm.reset();
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
      const divisionFormValues = this.createBranchDivisionForm.getRawValue();
      const branchDivisionId = this.selectedBranchDivision.id;
      const branchId = this.selectedBranch.id;

      const saveBranchDivision: BranchDivisionDTO = {
        branchId: branchId,
        branchName: this.selectedBranch.name,
        divisionId: branchDivisionId,
        divisionName: divisionFormValues.division,
        id: branchDivisionId,
        withEffectiveFrom: this.selectedBranchDivision.withEffectiveFrom,
        withEffectiveTo: this.selectedBranchDivision.withEffectiveTo,
      };
      this.organizationService
        .updateOrganizationBranchDivision(
          branchDivisionId,
          saveBranchDivision,
          branchId
        )
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Update a Branch Division'
              );
              this.fetchOrganizationBranchDivision(branchId);
              this.createBranchDivisionForm.reset();
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
  editBranchDivision() {
    if (this.selectedBranchDivision) {
      this.openBranchDivisionModal();
      this.createBranchDivisionForm.patchValue({
        division: this.selectedBranchDivision.id,
      });
    }
  }
  deleteBranchDivision() {
    this.branchDivisionConfirmationModal.show();
  }

  confirmBranchDivisionDelete() {
    if (this.selectedBranchDivision) {
      const branchId = this.selectedBranch.id;
      const branchDivisionId = this.selectedBranchDivision.id;
      this.organizationService
        .deleteOrganizationBranchDivision(branchDivisionId, branchId)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'success',
                'Successfully deleted an Organizatio Branch Division'
              );
              this.selectedBranchDivision = null;
              this.fetchOrganizationBranchDivision(branchId);
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
        'No Organization Branch Division is selected.'
      );
    }
  }

  saveBranchContact() {
    this.closeBranchContactModal();
    if (!this.selectedBranchContact) {
      const branchContactFormValues =
        this.createBranchContactForm.getRawValue();
      const branchId = this.selectedBranch.id;

      const saveBranchContact: BranchContactDTO = {
        branchId: branchId,
        designation: branchContactFormValues.designation,
        emailAddress: branchContactFormValues.emailAddress,
        id: null,
        idNumber: branchContactFormValues.idNumber,
        mobile: branchContactFormValues.mobileNumber,
        name: branchContactFormValues.name,
        physicalAddress: branchContactFormValues.homeAddress,
        telephone: branchContactFormValues.telephoneNumber,
      };
      this.organizationService
        .createOrganizationBranchContact(saveBranchContact)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Created an Organization Branch Contact'
              );
              this.fetchOrganizationBranchContact(this.selectedBranch.id);
              this.createBranchContactForm.reset();
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
      const branchContactFormValues =
        this.createBranchContactForm.getRawValue();
      const branchId = this.selectedBranchContact.branchId;
      const branchContactId = this.selectedBranchContact.id;

      const saveBranchContact: BranchContactDTO = {
        branchId: branchId,
        designation: branchContactFormValues.designation,
        emailAddress: branchContactFormValues.emailAddress,
        id: branchContactId,
        idNumber: branchContactFormValues.idNumber,
        mobile: branchContactFormValues.mobileNumber,
        name: branchContactFormValues.name,
        physicalAddress: branchContactFormValues.homeAddress,
        telephone: branchContactFormValues.telephoneNumber,
      };
      this.organizationService
        .updateOrganizationBranchContact(branchContactId, saveBranchContact)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated an Organization Branch Contact'
              );
              this.fetchOrganizationBranchContact(this.selectedBranch.id);
              this.selectedBranchContact = null;
              this.createBranchContactForm.reset();
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

  editBranchContact() {
    if (this.selectedBranchContact) {
      this.openBranchContactModal();
      this.createBranchContactForm.patchValue({
        name: this.selectedBranchContact.name,
        destination: this.selectedBranchContact.designation,
        mobileNumber: this.selectedBranchContact.mobile,
        telephoneNumber: this.selectedBranchContact.telephone,
        idNumber: this.selectedBranchContact.idNumber,
        homeAddress: this.selectedBranchContact.physicalAddress,
        emailAddress: this.selectedBranchContact.emailAddress,
      });
    }
  }

  deleteBranchContact() {
    this.branchContactConfirmationModal.show();
  }

  confirmBranchContactDelete() {
    if (this.selectedBranchContact) {
      const branchContactId = this.selectedBranchContact.id;
      this.organizationService
        .deleteOrganizationBranchContact(branchContactId)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'success',
                'Successfully deleted an Organizatio Branch Contact'
              );
              this.fetchOrganizationBranchContact(this.selectedBranch.id);
              this.selectedBranchContact = null;
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
        'No Organization Branch Contact is selected.'
      );
    }
  }

  onNext() {}
}
