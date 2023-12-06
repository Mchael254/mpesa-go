import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import stepData from '../../data/steps.json'
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrganizationService } from '../../services/organization.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { ManagersDTO, OrganizationDTO, OrganizationRegionDTO, PostOrganizationRegionDTO, YesNoDTO } from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { BankRegionDTO } from '../../../../shared/data/common/bank-dto';
import { Router } from '@angular/router';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { Table } from 'primeng/table';

const log = new Logger( 'RegionComponent');

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {

  @ViewChild('regionModal') regionModal: ElementRef;
  @ViewChild('bankModal') bankModal: ElementRef;
  @ViewChild('regionTable') regionTable: Table;
  @ViewChild('bankRegionTable') bankRegionTable: Table;

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
      url: 'home/crm/organization'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private organizationService: OrganizationService,
    private bankService: BankService,
    private globalMessagingService: GlobalMessagingService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.RegionCreateForm();
    this.RegionBankForm(); 
    this.fetchOrganization();
    this.fetchOptions();
  }

  ngOnDestroy(): void {}

  RegionCreateForm() {
    this.createRegionForm = this.fb.group({
      organization: [''],
      shortDescription: [''],
      name: [''],
      manager: [''],
      managerAllowed: [''],
      wef: [''],
      wet: [''],
      commissionEarned: ['']
    })
   }

  get f() { return this.createRegionForm.controls; }

  RegionBankForm() {
    this.createRegionBankForm = this.fb.group({
      shortDescription: [''],
      name: [''],
      wef: [''],
      wet: [''],
      manager: [''],
    })
  }

  openRegionModal() {
    this.renderer.addClass(this.regionModal.nativeElement, 'show');
    this.renderer.setStyle(this.regionModal.nativeElement, 'display', 'block');
  }

  closeRegionModal() {
    this.renderer.removeClass(this.regionModal.nativeElement, 'show');
    this.renderer.setStyle(this.regionModal.nativeElement, 'display', 'none');
  }

  openBankModal() {
    this.renderer.addClass(this.bankModal.nativeElement, 'show');
    this.renderer.setStyle(this.bankModal.nativeElement, 'display', 'block');
  }

  closeBankModal() {
    this.renderer.removeClass(this.bankModal.nativeElement, 'show');
    this.renderer.setStyle(this.bankModal.nativeElement, 'display', 'none');
  }

  fetchOrganization() {
    this.organizationService.getOrganization()
      .pipe(untilDestroyed(this))
      .subscribe((data) => { 
        this.organizationsData = data;
        log.info('Organization Data', this.organizationsData);
      });
  }

  onOrganizationChange(event: Event) { 
    const selectedOrgId = (event.target as HTMLSelectElement).value;
    const selectedOrgIdAsNumber = parseInt(selectedOrgId, 10);
    this.selectedOrg = this.organizationsData.find(organization => organization.id === selectedOrgIdAsNumber);
    log.info(`Slected organization details`, this.selectedOrg);
    this.fetchOrganizationRegion(this.selectedOrg.id);
    this.fetchManager(this.selectedOrg.id);
  }

  fetchOrganizationRegion(organizationId: number) {
    this.organizationService.getOrganizationRegion(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.regionData = data;
        log.info('Region Data', this.regionData);
      })
  }

  fetchManager(organizationId: number) {
    this.organizationService.getRegionManagers(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.regionManagersData = data;
        log.info('Manager Data', this.regionManagersData);
      })
  }

  fetchOptions() {
    this.organizationService.getOptionValues()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.optionData = data;
      })
  }

  fetchBankRegions(code: number) {
    this.bankService.getBankRegion(code)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.bankRegionData = data;
        log.info(`Bank Region Data`, this.bankRegionData);
      })
  }

  onRegionRowClick(region: OrganizationRegionDTO) {
    this.selectedRegion = region;
    this.fetchBankRegions(this.selectedRegion.code);
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
        shortDescription: regionFormValues.shortDescription
      };
      this.organizationService.createOrganizationRegion(saveOrganizationRegion)
      .subscribe(data => { 
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a Region');
        this.fetchOrganizationRegion(this.selectedOrg.id);
      });
    }
    else {
      const regionFormValues = this.createRegionForm.getRawValue();
      const organizationId = this.selectedOrg.id;
      const regionCode = this.selectedRegion.code

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
        shortDescription: regionFormValues.shortDescription
      };
      this.organizationService.updateOrganizationRegion(regionCode, saveOrganizationRegion)
        .subscribe(data => { 
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated a Region');
          this.selectedRegion = null;
          this.fetchOrganizationRegion(this.selectedOrg.id);
        });
    }
    this.createRegionForm.reset();
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
        wet: regionBankFormValues.wet
      };
      this.bankService.createBankRegion(saveRegionBank)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a RegionBank');
          this.fetchBankRegions(this.selectedRegion.code);
        })
    }
    else {
      const regionBankFormValues = this.createRegionBankForm.getRawValue();
      const organizationId = this.selectedOrg.id;
      const regionCode = this.selectedRegion.code;
      const regionBankId = this.selectedRegionBank.id

      const saveRegionBank: BankRegionDTO = {
        bankRegionName: regionBankFormValues.name,
        id: regionBankId,
        managerId: regionBankFormValues.manager,
        organizationId: organizationId,
        regionCode: regionCode,
        shortDescription: regionBankFormValues.shortDescription,
        wef: regionBankFormValues.wef,
        wet: regionBankFormValues.wet
      };
      this.bankService.updateBankRegion(regionBankId, saveRegionBank)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated a RegionBank');
          this.selectedRegionBank = null;
          this.fetchBankRegions(this.selectedRegion.code);
        })
    }
    this.createRegionForm.reset();
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
        commissionEarned: this.selectedRegion.overrideCommissionEarned
      });
    }
    else {
      log.error('Error', 'No Region is selected.')
    }
  }

  deleteRegion() {
    if (this.selectedRegion) {
      const regionCode = this.selectedRegion.code;
      this.organizationService.deleteOrganizationRegion(regionCode)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('success', 'Successfully deleted a Region');
          this.selectedRegion = null;
          this.fetchOrganizationRegion(this.selectedOrg.id);
        })
    }
    else {
      log.error('Error', 'No Region is Selected!');
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
    }
    else {
      log.error('Error', 'No Region Bank is selected.')
    }
  }

  deleteRegionBank() {
    if (this.selectedRegionBank) {
      const regionBankId = this.selectedRegionBank.id;
      this.bankService.deleteBankRegion(regionBankId)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('success', 'Successfully deleted a Region Bank');
          this.selectedRegionBank = null;
          this.fetchBankRegions(this.selectedRegion.code);
        })
    }
    else {
      log.error('Error', 'No Region Bank is Selected!');
    }
  }

  

  onNext() {
    this.router.navigate(['/home/crm/branch'])
  }

}
