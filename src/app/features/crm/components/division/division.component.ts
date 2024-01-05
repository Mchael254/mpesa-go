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
  OrganizationDTO,
  OrganizationDivisionDTO,
} from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { Router } from '@angular/router';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';

const log = new Logger('DivisionComponent');

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css'],
})
export class DivisionComponent implements OnInit {
  @ViewChild('divisionModal') divisionModal: ElementRef;
  @ViewChild('confirmationModal') confirmationModal: ElementRef;
  @ViewChild('divisionConfirmationModal')
  divisionConfirmationModal!: ReusableInputComponent;
  // @Input() selectOrganization: OrganizationDTO;

  public createDivisionForm: FormGroup;
  showModal = false;

  public steps = stepData;

  public organizationsData: OrganizationDTO[];
  public divisionData: OrganizationDivisionDTO[];
  public divisionBranchData: any;
  public selectedRadioValue: string | null = null;
  public selectedOrg: OrganizationDTO;
  public selectOrganization: OrganizationDTO;
  public selectedOrganization: number;
  public selectedOrganizationId: number | null;
  public selectedDivision: OrganizationDivisionDTO;
  public selectedDefaultStatus: string = 'No';
  public statusesData: StatusDTO[];

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
    private renderer: Renderer2,
    private organizationService: OrganizationService,
    private statusService: StatusService,
    private globalMessagingService: GlobalMessagingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to the selectedOrganizationId$ observable
    this.organizationService.selectedOrganizationId$.subscribe(
      (selectedOrganizationId) => {
        // Update the selected organization ID in your component
        this.selectedOrganizationId = selectedOrganizationId;
        // Check if the selected organization ID is already set
        if (this.selectedOrganizationId !== null) {
          // Call the fetchOrganizationDivision method
          this.fetchOrganizationDivision(this.selectedOrganizationId);
        }
      }
    );
    this.DivisionCreateForm();
    this.fetchOrganization();
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
      .getStatus()
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

  openDivisionModal() {
    this.renderer.addClass(this.divisionModal.nativeElement, 'show');
    this.renderer.setStyle(
      this.divisionModal.nativeElement,
      'display',
      'block'
    );
  }

  closeDivisionModal() {
    this.renderer.removeClass(this.divisionModal.nativeElement, 'show');
    this.renderer.setStyle(this.divisionModal.nativeElement, 'display', 'none');
  }

  openConfirmationModal() {
    this.renderer.addClass(this.confirmationModal.nativeElement, 'show');
    this.renderer.setStyle(
      this.confirmationModal.nativeElement,
      'display',
      'block'
    );
  }

  closeConfirmationModal() {
    this.renderer.removeClass(this.confirmationModal.nativeElement, 'show');
    this.renderer.setStyle(
      this.confirmationModal.nativeElement,
      'display',
      'none'
    );
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
        status: formValues.divisionStatus,
      };
      this.organizationService
        .createOrganizationDivision(saveOrganizationDivision)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Created a Division'
          );
          this.createDivisionForm.reset();
          this.fetchOrganizationDivision(this.selectedOrg.id);
          this.onNext();
        });
    } else {
      const divisionId = this.selectedDivision.id;

      const saveOrganizationDivision: OrganizationDivisionDTO = {
        id: divisionId,
        is_default_division: isDefault,
        name: formValues.name,
        order: formValues.divisionOrder,
        organization_id: this.selectedOrg.id,
        short_description: formValues.shortDescription,
        status: formValues.divisionStatus,
      };
      this.organizationService
        .updateOrganizationDivision(divisionId, saveOrganizationDivision)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated a Division'
          );
          this.selectedDivision = null;
          this.fetchOrganizationDivision(this.selectedOrg.id);
          this.createDivisionForm.reset();
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
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deactivated a Division'
          );
          this.fetchOrganizationDivision(this.selectedOrg.id);
          this.selectedDivision = null;
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
