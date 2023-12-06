import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as bootstrap from 'bootstrap';

import stepData from '../../data/steps.json'

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import {
  BranchContactDTO, BranchDivisionDTO, OrganizationBranchDTO,
  OrganizationDTO, OrganizationRegionDTO
} from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { OrganizationService } from '../../services/organization.service';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { CountryDto, StateDto, TownDto } from '../../../../shared/data/common/countryDto';
import { StaffDto } from '../../../../features/entities/data/StaffDto';
import { Table } from 'primeng/table';

const log = new Logger( 'BranchComponent');

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  @ViewChild('branchModal ') branchModal: ElementRef;
  @ViewChild('branchTransferModal ') branchTransferModal: ElementRef;
  @ViewChild('branchTable') branchTable: Table;
  @ViewChild('branchContactTable') branchContactTable : Table;

  public createBranchForm: FormGroup;
  public createBranchDivisionForm: FormGroup;
  public createBranchContactForm: FormGroup;
  public createBranchTransferForm: FormGroup;

  public steps = stepData;

  public organizationsData: OrganizationDTO[] = [];
  public regionData: OrganizationRegionDTO[] = [];
  public BranchesData: OrganizationBranchDTO[] = [];
  public BranchDivisionData: BranchDivisionDTO[] = [];
  public branchContacts: BranchContactDTO[] = [];
  public countriesData: CountryDto[];
  public stateData: StateDto[] = [];
  public townData: TownDto[] = [];
  public managersData: StaffDto[] = [];
  public selectedOrg: OrganizationDTO;
  public selectedReg: OrganizationRegionDTO;
  public selectedBranch: OrganizationBranchDTO;
  public countrySelected: CountryDto;
  public stateSelected: StateDto;
  public selectedCountry: number;
  public selectedOrganization: number;
  public selectedRegion: number;
  public selectedState: number;
  public selectedTown = '';
  public selectedManager = '';
  public selectedStateName: string | null = null;
  public selectedFile: File;
  public url = '';

  organizationBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard'
    },
    {
      label: 'CRM Setups',
      url: '/home/dashboard',
    },
    {
      label: 'Organization',
      url: '/home/crm/organization'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private countryService: CountryService,
    private staffService: StaffService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.BranchCreateForm();
    this.BranchContactCreateForm();
    this.fetchOrganization();
    this.fetchCountries();
    this.fetchStaffData();
  }
  
  ngOnDestroy(): void { }
  
  BranchCreateForm() {
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
      branchLogo: ['']
    })
  }

  get f() { return this.createBranchForm.controls; }

  BranchContactCreateForm() {
    this.createBranchContactForm = this.fb.group({
      name: [''],
      destination: [''],
      mobileNumber: [''],
      telephoneNumber: [''],
      ninNumber: [''],
      homeAddress: [''],
      emailAddress: ['']
    })
  }

  BranchTransferCreateForm() {
    this.createBranchTransferForm = this.fb.group({
      currentRegion: [''],
      branchName: [''],
      transferDate: [''],
      transferRegion: ['']
    })
  }

  // onOrganizationChange() {
  //   const selectedOrganizationId = this.selectedOrganization;
  //   log.info('Selected Organization', selectedOrganizationId);
  //   this.selectedOrg = this.organizationsData.find(organization => organization.id === selectedOrganizationId);
  //   this.fetchOrganizationRegion(this.selectedOrg.id)
  // }

  // onRegionChange() {
  //   const selectedRegionId = this.selectedRegion;
  //   log.info('selected RegionCode', selectedRegionId);
  //   this.selectedReg = this.regionData.find(region => region.code === selectedRegionId);
  //   this.fetchOrganizationBranch(this.selectedReg.code);
  // }

  onOrganizationChange(event: Event) { 
    const selectedOrgId = (event.target as HTMLSelectElement).value;
    const selectedOrgIdAsNumber = parseInt(selectedOrgId, 10);
    this.selectedOrg = this.organizationsData.find(organization => organization.id === selectedOrgIdAsNumber);
    this.fetchOrganizationRegion(this.selectedOrg.id);
  }

  onRegionChange($event: Event) {
    const selectedRegionId = (event.target as HTMLSelectElement).value;
    const selectedRegIdAsNumber = parseInt(selectedRegionId, 10);
    this.selectedReg = this.regionData.find(organization => organization.code === selectedRegIdAsNumber);
    this.fetchOrganizationBranch(this.selectedReg.code);
  }

  onBranchRowSelect(branch: OrganizationBranchDTO) {
    this.selectedBranch = branch;
    this.fetchOrganizationBranchDivision(this.selectedBranch.id);
    this.fetchOrganizationBranchContact(this.selectedBranch.id);
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
      town: null
    });

    const selectedCountryId = this.selectedCountry;
    this.countrySelected = this.countriesData.find(country => country.id === selectedCountryId)

    this.countryService.getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
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
    this.stateSelected = this.stateData.find(state => state.id === selectedStateId)
    this.countryService.getTownsByMainCityState(this.selectedState)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.townData = data;
      })
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
    this.organizationService.getOrganization()
      .pipe(untilDestroyed(this))
      .subscribe((data) => { 
        this.organizationsData = data;
        log.info('Organization Data', this.organizationsData);
      });
  }

  fetchOrganizationRegion(organizationId: number) {
    this.organizationService.getOrganizationRegion(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.regionData = data;
        log.info('Region Data', this.regionData);
      })
  }

  fetchOrganizationBranchDivision(branchId: number) {
    this.organizationService.getOrganizationBranchDivision(branchId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.BranchDivisionData = data;
        log.info('Branch Division Data', this.BranchDivisionData);
      })
  }

  fetchOrganizationBranchContact(branchId: number) {
    this.organizationService.getOrganizationBranchContact(branchId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.branchContacts = data;
        log.info('Branch Contact Data', this.branchContacts);
      })

  }

  fetchOrganizationBranch(regionId: number) {
    this.organizationService.getOrganizationBranch(this.selectedOrg.id, regionId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.BranchesData = data;
        log.info('Branch Data', this.BranchesData);
      })
  }

   fetchCountries(){
    this.countryService.getCountries()
      .subscribe( (data) => {
        this.countriesData = data;
      });
  }

  fetchStaffData() {
    this.staffService
      .getStaff(0, 10, 'U', 'dateCreated', 'desc', null)
      .subscribe(
        (data) => {
          this.managersData = data.content;
          console.log('Fetched staff data:', this.managersData);
        },
        (error) => {
          console.error('Error fetching staff data:', error);
        }
      );
  }

  saveBranch() {
    this.closeBranchModal();
    if (!this.selectedBranch) {
      const branchFormValues = this.createBranchForm.getRawValue();
      const organizationId = this.selectedOrg.id;
      const regionId = this.selectedReg.code;

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
        townName: null
      }
      // Create a new organization branch
      this.organizationService.createOrganizationBranch(saveBranch)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created an Organization Branch');
          this.fetchOrganizationBranch(regionId);
        });
    }
    else {
      const branchFormValues = this.createBranchForm.getRawValue();
      const organizationId = this.selectedOrg.id;
      const regionId = this.selectedReg.code;
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
        townName: null
      }
      // Update organization branch
      this.organizationService.updateOrganizationBranch(branchId, saveBranch)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated Organization Branch');
          this.selectedBranch = null;
          this.fetchOrganizationBranch(regionId);
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
      this.url = this.selectedBranch.logo ?
                   'data:image/jpeg;base64,' + this.selectedBranch.logo
                  : '';

    }
    else {
      log.info('No Organization Branch is selected!.')
    }
  }

  deleteBranch() {
    if (this.selectedBranch) {
      const branchId = this.selectedBranch.id;
      this.organizationService.deleteOrganizationBranch(branchId)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('success', 'Successfully deleted an Organizatio Branch');
          this.selectedBranch = null;
          this.fetchOrganizationRegion(this.selectedOrg.id);
        })
    }
    else {
      log.info('No Organization Branch is selected.');
    }
  }

  transferBranch() { }

  saveBranchDivision() {}
  
  saveBranchContact() {}

  onNext() {}

}
