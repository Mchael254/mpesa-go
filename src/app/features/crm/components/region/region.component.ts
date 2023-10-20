import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import stepData from '../../data/steps.json'
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrganizationService } from '../../services/organization.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { ManagersDTO, OrganizationDTO, OrganizationRegionDTO, PostOrganizationRegionDto, YesNoDTO } from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { Router } from '@angular/router';

const log = new Logger( 'RegionComponent');

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {

  public createRegionForm: FormGroup;
  public steps = stepData;

  public organizationsData: OrganizationDTO[];
  public regionData: OrganizationRegionDTO[];
  public banksData: BankDTO[];
  public selectedOrg: OrganizationDTO;
  public regionManagersData: ManagersDTO[];
  public optionData: YesNoDTO[];

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
    private organizationService: OrganizationService,
    private globalMessagingService: GlobalMessagingService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.RegionCreateForm();
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

  saveRegion() {
    const regionFormValues = this.createRegionForm.getRawValue();
    const organizationId = this.selectedOrg.id;

    const saveOrganizationRegion: PostOrganizationRegionDto = {
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
      });
    
    // this.onNext();
  }

  onNext() {
    this.router.navigate(['/home/crm/branch'])
  }

}
