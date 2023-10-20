import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import stepData from '../../data/steps.json'
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrganizationService } from '../../services/organization.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { OrganizationDTO, OrganizationRegionDTO } from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';

const log = new Logger( 'BranchComponent');

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  public createBranchForm: FormGroup;

  public steps = stepData;

  public organizationsData: OrganizationDTO[];
  public regionData: OrganizationRegionDTO[];
  public branchData: any;
  public branchContacts: any;
  public branchDivision: any;
  public selectedOrg: OrganizationDTO;

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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.BranchCreateForm();
    this.fetchOrganization();
  }

  ngOnDestroy(): void {}

  BranchCreateForm() {
    this.createBranchForm = this.fb.group({
      organization: [''],
      region: [''],
    })
   }

  get f() { return this.createBranchForm.controls; }

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
  }

  fetchOrganizationRegion(organizationId: number) {
    this.organizationService.getOrganizationRegion(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.regionData = data;
        log.info('Region Data', this.regionData);
      })
  }

  onNext() {}

}
