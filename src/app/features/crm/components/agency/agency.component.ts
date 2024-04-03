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
  OrganizationBranchDTO,
  OrganizationDTO,
} from '../../data/organization-dto';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { Logger } from '../../../../shared/services/logger/logger.service';

const log = new Logger('AgencyComponent');

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css'],
})
export class AgencyComponent implements OnInit {
  @ViewChild('agencyTable') agencyTable: Table;

  public createAgencyForm: FormGroup;
  public createAgencyTransferForm: FormGroup;

  public agenciesData: any;
  public organizationsData: OrganizationDTO[] = [];
  public branchesData: OrganizationBranchDTO[] = [];
  public managersData: any;
  public statusesData: any;
  public selectedOrg: OrganizationDTO;
  public selectedBra: any;
  public selectedAgency: any;
  public selectedManager: any;
  public selectedOrganizationId: number | null = null;
  public selectedBranch: number;

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
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.AgencyCreateForm();
    this.AgencyTransferCreateForm();
    this.fetchOrganization();
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

  onOrganizationChange() {
    this.selectedOrg = null;
    this.selectedBra = null;
    this.branchesData = null;
    const selectedOrganizationId = this.selectedOrganizationId;
    this.selectedOrg = this.organizationsData.find(
      (organization) => organization.id === selectedOrganizationId
    );
    this.fetchOrganizationBranch(this.selectedOrg.id);
  }

  onBranchChange() {}

  onSort(event: Event, dataArray: any[], sortKey: string): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    switch (selectedValue) {
      case 'asc':
        this.sortArrayAsc(dataArray, sortKey);
        break;
      case 'desc':
        this.sortArrayDesc(dataArray, sortKey);
        break;
      default:
        // Handle default case or no sorting
        break;
    }
  }

  sortArrayAsc(dataArray: any[], sortKey: string): void {
    dataArray.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  }

  sortArrayDesc(dataArray: any[], sortKey: string): void {
    dataArray.sort((a, b) => b[sortKey].localeCompare(a[sortKey]));
  }

  filterAgency(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.agencyTable.filterGlobal(filterValue, 'contains');
  }

  openAgencyTransferModal() {
    const modal = document.getElementById('agencyTransferModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeAgencyTransferModal() {
    const modal = document.getElementById('agencyTransferModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openAgencyModal() {
    const modal = document.getElementById('agencyModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeAgencyModal() {
    const modal = document.getElementById('agencyModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  onAgencyRowSelect(agency: any) {
    this.selectedAgency = agency;
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

  fetchOrganizationBranch(organizationId?: number, regionId?: number) {
    this.organizationService
      .getOrganizationBranch(organizationId, regionId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.branchesData = data;
        log.info('Branch Data', this.branchesData);
      });
  }

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
  }

  editAgency() {}

  deleteAgency() {}

  transferAgency() {}
}
