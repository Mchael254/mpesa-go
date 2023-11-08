import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import stepData from '../../data/steps.json'
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { OrganizationService } from '../../services/organization.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { OrganizationDTO, OrganizationDivisionDTO } from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { Router } from '@angular/router';

const log = new Logger( 'DivisionComponent');

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css']
})
export class DivisionComponent implements OnInit {

  @ViewChild('divisionModal') divisionModal: ElementRef;
  @ViewChild('confirmationModal') confirmationModal: ElementRef;

  public createDivisionForm: FormGroup;
  showModal = false;
  
  public steps = stepData;

  public organizationsData: OrganizationDTO[];
  public divisionData: OrganizationDivisionDTO[];
  public divisionBranchData: any;
  public selectedRadioValue: string | null = null;
  public selectedOrg: OrganizationDTO;
  public selectedDivision: OrganizationDivisionDTO;
  public selectedDefaultStatus: string = 'No';

  public statuses = [
    { name: 'Active', value: 'ACTIVE' },
    { name: 'Inactive', value: 'INACTIVE' },
    { name: 'Unknown', value: 'UNKNOWN' },
    { name: 'Blacklisted', value: 'BALCKLISTED' }
  ]

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
    private globalMessagingService: GlobalMessagingService,
    private router: Router, 
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.DivisionCreateForm();
    this.fetchOrganization();
  }

  ngOnDestroy(): void {}

  DivisionCreateForm() {
    this.createDivisionForm = this.fb.group({
      shortDescription: [''],
      name: [''],
      divisionOrder: [''],
      divisionStatus: [''],
      default: [''],
    })
   }

  get f() { return this.createDivisionForm.controls; }

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
    this.fetchOrganizationDivision(this.selectedOrg.id);
  }

  fetchOrganizationDivision(organizationId: number) {
    this.organizationService.getOrganizationDivision(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.divisionData = data;
        log.info('Division Data', this.divisionData);
      })

  }

  openDivisionModal() {
    this.renderer.addClass(this.divisionModal.nativeElement, 'show');
    this.renderer.setStyle(this.divisionModal.nativeElement, 'display', 'block');
  }

  closeDivisionModal() {
    this.renderer.removeClass(this.divisionModal.nativeElement, 'show');
    this.renderer.setStyle(this.divisionModal.nativeElement, 'display', 'none');
  }

  openConfirmationModal() {
    this.renderer.addClass(this.confirmationModal.nativeElement, 'show');
    this.renderer.setStyle(this.confirmationModal.nativeElement, 'display', 'block');
  }

  closeConfirmationModal() {
    this.renderer.removeClass(this.confirmationModal.nativeElement, 'show');
    this.renderer.setStyle(this.confirmationModal.nativeElement, 'display', 'none');
  }

  onDivisionRowSelect(division: OrganizationDivisionDTO) {
    this.selectedDivision = division;
  }

  saveDivision() {
    this.closeDivisionModal();
    const organizationFormValues = this.createDivisionForm.getRawValue();
    const selectedValue = organizationFormValues.default;

    const existingDefault = this.divisionData.find(
      (division) => division.is_default_division === 'YES'
    );

    if (selectedValue === 'YES' && existingDefault) {
      this.openConfirmationModal();
    } else {
      this.finalizeDivisionSave(organizationFormValues, selectedValue);
    }
  }

  confirmDefaultDivision(selectedValue: string) {
    this.selectedDefaultStatus = selectedValue;
    this.closeConfirmationModal();

    const organizationFormValues = this.createDivisionForm.getRawValue();
    
    if (selectedValue === 'Yes') {
      const existingDefault = this.divisionData.find(
        (division) => division.is_default_division === 'Yes'
      );

      if (existingDefault) {
        existingDefault.is_default_division = 'No';
      }
    }

    this.finalizeDivisionSave(organizationFormValues, selectedValue);
  }

  private finalizeDivisionSave(formValues: any, isDefault: string) {

    

    if (!this.selectedDivision) {
      const saveOrganizationDivision: OrganizationDivisionDTO = {
        id: null,
        is_default_division: isDefault,
        name: formValues.name,
        order: formValues.divisionOrder,
        organization_id: this.selectedOrg.id,
        short_description: formValues.shortDescription,
        status: formValues.divisionStatus
      };
      this.organizationService.createOrganizationDivision(saveOrganizationDivision)
        .subscribe(data => { 
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created a Division');
        });
    }
    else {
      const divisionId = this.selectedDivision.id;

      const saveOrganizationDivision: OrganizationDivisionDTO = {
        id: divisionId,
        is_default_division: isDefault,
        name: formValues.name,
        order: formValues.divisionOrder,
        organization_id: this.selectedOrg.id,
        short_description: formValues.shortDescription,
        status: formValues.divisionStatus
      };
      this.organizationService.updateOrganizationDivision(divisionId, saveOrganizationDivision)
        .subscribe(data => { 
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated a Division');
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
    }
    else {
      log.error('Error', 'No Division is selected.')
    }
  }

  deleteDivision() {
    if (this.selectedDivision) {
      const divisionId = this.selectedDivision.id;
      this.organizationService.deleteOrganizationDivision(divisionId)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('success', 'Successfully deleted a Division');
        })
    }
    else {
      log.error('Error', 'No Division is Selected!');
    }
  }

  onNext() {
    this.router.navigate(['/home/crm/region'])
  }


}
