import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import {
  OccupationDTO,
  PostOccupationDTO,
} from '../../../../shared/data/common/occupation-dto';
import {
  PostSectorDTO,
  SectorDTO,
} from '../../../../shared/data/common/sector-dto';
import { SectorService } from '../../../../shared/services/setups/sector/sector.service';
import { OccupationService } from '../../../../shared/services/setups/occupation/occupation.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { Table } from 'primeng/table';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';
import { Logger } from '../../../../shared/services/logger/logger.service';

const log = new Logger('SectorOccupationComponent');

/* This TypeScript class represents a component for managing sectors and occupations within a CRM
system. */
@Component({
  selector: 'app-sector-occupation',
  templateUrl: './sector-occupation.component.html',
  styleUrls: ['./sector-occupation.component.css'],
})
export class SectorOccupationComponent implements OnInit {
  @ViewChild('sectorTable') sectorTable: Table;
  @ViewChild('occupationTable') occupationTable: Table;
  @ViewChild('sectorConfirmationModal')
  sectorConfirmationModal!: ReusableInputComponent;
  @ViewChild('occupationConfirmationModal')
  occupationConfirmationModal!: ReusableInputComponent;

  public createSectorForm: FormGroup;
  public createOccupationForm: FormGroup;

  public sectorsData: SectorDTO[];
  public sectorsData2: SectorDTO[];
  public occupationsData: OccupationDTO[];
  public occupationsData2: OccupationDTO[];
  public selectedSector: SectorDTO;
  public selectedOccupation: OccupationDTO;
  public selectedOccupations: any[] = [];
  public selectedSectors: SectorDTO[] = [];
  public currentOccupations: OccupationDTO[];

  public groupId: string = 'sectorTab';
  public ogroupId: string = 'occupationTab';
  public response: any;
  public submitted = false;
  public visibleStatus: any = {};
  public errorOccurred = false;
  public errorMessage: string = '';

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
      label: 'Account Management',
      url: 'home/crm/dashboard',
    },

    {
      label: 'Sectors and Occupations',
      url: 'home/crm/sectors-occupations',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private sectorService: SectorService,
    private occupationServive: OccupationService,
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.SectorsForm();
    this.OccupationsForm();
    this.fetchSectors();
    this.fetchOccupations();
  }

  ngOnDestroy(): void {}

  SectorsForm() {
    this.createSectorForm = this.fb.group({
      shortDescription: [''],
      name: [''],
      occupation: [[]],
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
            this.createSectorForm.controls[key].setValidators(
              Validators.required
            );
            this.createSectorForm.controls[key].updateValueAndValidity();
            const label = document.querySelector(`label[for=${key}]`);
            if (label) {
              const asterisk = document.createElement('span');
              asterisk.innerHTML = ' *';
              asterisk.style.color = 'red';
              label.appendChild(asterisk);
            }
          }
        });
      });
  }

  get f() {
    return this.createSectorForm.controls;
  }

  OccupationsForm() {
    this.createOccupationForm = this.fb.group({
      occupation_shortDescription: [''],
      occupation_name: [''],
      sector: [[]],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.ogroupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          this.visibleStatus[field.frontedId] = field.visibleStatus;
          if (field.visibleStatus === 'Y' && field.mandatoryStatus === 'Y') {
            const key = field.frontedId;
            this.createOccupationForm.controls[key].setValidators(
              Validators.required
            );
            this.createOccupationForm.controls[key].updateValueAndValidity();
            const label = document.querySelector(`label[for=${key}]`);
            if (label) {
              const asterisk = document.createElement('span');
              asterisk.innerHTML = ' *';
              asterisk.style.color = 'red';
              label.appendChild(asterisk);
            }
          }
        });
      });
  }

  get g() {
    return this.createOccupationForm.controls;
  }

  updateSelectedOccupations(selectedOccupations: any[]) {
    this.selectedOccupations = selectedOccupations;
  }

  updateSelectedSectors(selectedSectors: SectorDTO[]) {
    this.selectedSectors = selectedSectors;
  }

  /**
   * The `fetchSectors` function in TypeScript fetches sector data for a given organization ID and
   * handles success and error responses accordingly.
   * @param {number} organizationId - The `organizationId` parameter in the `fetchSectors` function is
   * used to specify the ID of the organization for which you want to fetch the sectors. This ID is
   * passed to the `getSectors` method of the `sectorService` to retrieve the sectors data associated
   * with that particular organization
   */
  fetchSectors(organizationId?: number) {
    this.sectorService
      .getSectors(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.sectorsData = data;
            this.sectorsData2 = data;
            log.info(`Fetched Sectors Data`, this.sectorsData);
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

  /**
   * The fetchOccupations function retrieves occupation data based on a sector ID and handles success
   * and error responses accordingly.
   * @param {number} sectorId - The `fetchOccupations` function takes a `sectorId` parameter of type
   * number. This function calls the `getOccupationBySectorId` method from the `occupationServive`
   * service to fetch occupation data based on the provided `sectorId`. The fetched data is then stored
   * in the `
   */
  fetchOccupations(organizationId?: number) {
    this.occupationServive
      .getOccupations(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.occupationsData = data;
            this.occupationsData2 = data;
            log.info(`Fetched Occuption Data`, this.occupationsData);
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

  fetchOccupationBySectorId(sectorId: number) {
    this.occupationServive
      .getOccupationBySectorId(sectorId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            // // Append the fetched data to existing occupationsData array
            // this.occupationsData.push(...data);
            this.occupationsData = data;
            log.info(
              `Fetched Occuption Data By Sector ID`,
              this.occupationsData
            );
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

  /**
   * The function `filterSectors` filters a table based on a user input value.
   * @param {Event} event - The `event` parameter in the `filterSectors` function is an Event object
   * that is passed as an argument when the function is called. It is used to capture the event that
   * triggered the filtering action, such as a user input event like typing in an input field.
   */
  filterSectors(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.sectorTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function filterOccupations takes an event as input, extracts the filter value from an HTML
   * input element, and filters a table based on the filter value using a 'contains' filter.
   * @param {Event} event - The `event` parameter in the `filterOccupations` function is an Event
   * object that is passed as an argument when the function is called. It is used to capture the event
   * that triggered the filtering action, such as a user input event like typing in a search box.
   */
  filterOccupations(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.occupationTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function `onSectorsRowSelect` sets the selected sector and fetches occupations based on the
   * selected sector's ID.
   * @param {SectorDTO} sector - The `onSectorsRowSelect` function takes a parameter `sector` of type
   * `SectorDTO`. When this function is called, it sets the `selectedSector` property to the `sector`
   * that was passed as an argument, and then it calls the `fetchOccupations` function with the
   */
  onSectorsRowSelect(sector: SectorDTO) {
    this.selectedSector = sector;
    this.occupationsData = [];
    this.fetchOccupationBySectorId(this.selectedSector.id);
  }

  /**
   * The function `onOccupationsRowSelect` assigns the selected occupation to the `selectedOccupation`
   * property.
   * @param {OccupationDTO} occupation - It looks like you are showing a method called
   * `onOccupationsRowSelect` that takes an `OccupationDTO` object as a parameter named `occupation`.
   * This method sets the `selectedOccupation` property to the provided `occupation` object. If you
   * have any specific questions or need further assistance
   */
  onOccupationsRowSelect(occupation: OccupationDTO) {
    this.selectedOccupation = occupation;
  }

  /**
   * The function `openSectorModal` displays a modal by adding a 'show' class and setting its display
   * property to 'block'.
   */
  openSectorModal() {
    const modal = document.getElementById('sectorModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeSectorModal` hides the sector modal by removing the 'show' class and setting
   * the display style to 'none'.
   */
  closeSectorModal() {
    const modal = document.getElementById('sectorModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `openOccupationModal` displays a modal with the id 'occupationModal' by adding the
   * 'show' class and setting its display style to 'block'.
   */
  openOccupationModal() {
    const modal = document.getElementById('occupationModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeOccupationModal` hides the occupation modal by removing the 'show' class and
   * setting the display style to 'none'.
   */
  closeOccupationModal() {
    const modal = document.getElementById('occupationModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The `saveSector` function in TypeScript handles form validation, creation, and updating of sector
   * data with error handling and success messaging.
   * @returns The `saveSector()` function returns either nothing (undefined) or exits early if the form
   * is invalid and focuses on the first invalid control. If the form is valid, it either creates a new
   * sector or updates an existing sector based on the form values and selected sector.
   */
  saveSector() {
    this.submitted = true;
    this.createSectorForm.markAllAsTouched();

    if (this.createSectorForm.invalid) {
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

    this.closeSectorModal();

    if (!this.selectedSector) {
      const sectorFormValues = this.createSectorForm.getRawValue();

      const saveSector: PostSectorDTO = {
        id: null,
        shortDescription: sectorFormValues.shortDescription,
        name: sectorFormValues.name,
        organizationId: 2,
        sectorWefDate: new Date().toISOString(),
        sectorWetDate: null,
        assignedOccupations: sectorFormValues.occupation.map(
          (occupation: OccupationDTO) => ({
            occupationId: occupation.id,
            sectorId: 0,
            wefDate: new Date().toISOString(),
            wetDate: null,
          })
        ),
      };
      this.sectorService.createSector(saveSector).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Created a Sector'
            );
            this.createSectorForm.reset();
            this.fetchSectors();
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
      const sectorFormValues = this.createSectorForm.getRawValue();

      const sectorId = this.selectedSector.id;

      const selectedOccupation = this.occupationsData2.filter((occupation) =>
        this.selectedSector.assignedOccupations.some(
          (sectorOccupation) => sectorOccupation.occupationId === occupation.id
        )
      );

      const updatedOccupations: OccupationDTO[] = sectorFormValues.occupation;

      const removedOccupations: OccupationDTO[] = selectedOccupation.filter(
        (currentOccupation) =>
          !updatedOccupations.some(
            (updatedOccupation) => updatedOccupation.id === currentOccupation.id
          )
      );

      const addedOccupations: OccupationDTO[] = updatedOccupations.filter(
        (updatedOccupation) =>
          !this.occupationsData.some(
            (currentOccupation) => currentOccupation.id === updatedOccupation.id
          )
      );

      // Prepare the updateSector DTO
      const updateSector: PostSectorDTO = {
        id: sectorId,
        shortDescription: sectorFormValues.shortDescription,
        name: sectorFormValues.name,
        organizationId: this.selectedSector.organizationId,
        sectorWefDate: this.selectedSector.sectorWefDate,
        sectorWetDate: this.selectedSector.sectorWetDate,
        assignedOccupations: [
          // Include occupations that are not removed
          ...selectedOccupation
            .filter(
              (occupation) =>
                !removedOccupations.some(
                  (removed) => removed.id === occupation.id
                )
            )
            .map((occupation: OccupationDTO) => ({
              occupationId: occupation.id,
              sectorId: sectorId,
              wefDate: occupation.wefDate,
              wetDate: occupation.wetDate,
            })),
          // Include newly added occupations
          ...addedOccupations.map((occupation: OccupationDTO) => ({
            occupationId: occupation.id,
            sectorId: sectorId,
            wefDate: new Date().toISOString(),
            wetDate: null,
          })),
        ],
      };

      this.sectorService.updateSector(sectorId, updateSector).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Updated a Sector'
            );
            this.createSectorForm.reset();
            this.fetchSectors();
            this.fetchOccupations();
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

  editSector() {
    if (this.selectedSector) {
      this.openSectorModal();

      const selectedOccupation = this.occupationsData2.filter((occupation) =>
        this.selectedSector.assignedOccupations.some(
          (sectorOccupation) => sectorOccupation.occupationId === occupation.id
        )
      );

      this.createSectorForm.patchValue({
        shortDescription: this.selectedSector.shortDescription,
        name: this.selectedSector.name,
        occupation: selectedOccupation,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Sector is selected!.'
      );
    }
  }

  deleteSector() {
    this.sectorConfirmationModal.show();
  }

  confirmSectorDelete() {
    if (this.selectedSector) {
      const sectorId = this.selectedSector.id;
      this.sectorService.deleteSector(sectorId).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted a Sector'
            );
            this.selectedSector = null;
            this.fetchOccupationBySectorId(sectorId);
            this.fetchSectors();
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
        'No Sector is selected!.'
      );
    }
  }

  saveOccupation() {
    this.submitted = true;
    this.createOccupationForm.markAllAsTouched();

    if (this.createOccupationForm.invalid) {
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

    this.closeOccupationModal();

    if (!this.selectedOccupation) {
      const occupationFormValues = this.createOccupationForm.getRawValue();

      const saveOccupation: PostOccupationDTO = {
        id: null,
        shortDescription: occupationFormValues.shortDescription,
        name: occupationFormValues.name,
        organizationId: 2,
        wefDate: new Date().toISOString(),
        wetDate: null,
        assignedSectors: occupationFormValues.sector.map(
          (sector: SectorDTO) => ({
            occupationId: 0,
            sectorId: sector.id,
            wefDate: new Date().toISOString(),
            wetDate: null,
          })
        ),
      };

      console.log('SAVING oCCUPATION', saveOccupation);

      this.occupationServive.createOccupation(saveOccupation).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Created an Occupation'
            );
            this.fetchOccupations();
            this.createOccupationForm.reset();
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
      const occupationFormValues = this.createOccupationForm.getRawValue();
      const occupationId = this.selectedOccupation.id;

      const selectedSectors = this.sectorsData.filter((sector) =>
        this.selectedOccupation.assignedSectors.some(
          (occupationSector) => occupationSector.sectorId === sector.id
        )
      );

      const updatedSectors: SectorDTO[] = occupationFormValues.sector;

      const removedSectors: SectorDTO[] = selectedSectors.filter(
        (currentSector) =>
          !updatedSectors.some(
            (updatedSector) => updatedSector.id === currentSector.id
          )
      );

      const addedSectors: SectorDTO[] = updatedSectors.filter(
        (updatedSector) =>
          !selectedSectors.some(
            (currentSector) => currentSector.id === updatedSector.id
          )
      );

      // Prepare the updateOccupation DTO
      const updateOccupation: PostOccupationDTO = {
        id: occupationId,
        shortDescription: occupationFormValues.shortDescription,
        name: occupationFormValues.name,
        organizationId: this.selectedOccupation.organizationId,
        wefDate: this.selectedOccupation.wefDate,
        wetDate: this.selectedOccupation.wetDate,
        assignedSectors: [
          // Include sectors that are not removed
          ...selectedSectors
            .filter(
              (sector) =>
                !removedSectors.some((removed) => removed.id === sector.id)
            )
            .map((sector: SectorDTO) => ({
              occupationId: occupationId,
              sectorId: sector.id,
              wefDate: sector.sectorWefDate,
              wetDate: sector.sectorWetDate,
            })),
          // Include newly added sectors
          ...addedSectors.map((sector: SectorDTO) => ({
            occupationId: occupationId,
            sectorId: sector.id,
            wefDate: new Date().toISOString(),
            wetDate: null,
          })),
        ],
      };
      this.occupationServive
        .updateOccupation(occupationId, updateOccupation)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated an Occupation'
              );
              this.fetchOccupations();
              this.selectedOccupation = null;
              this.createOccupationForm.reset();
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

  editOccupation() {
    if (this.selectedOccupation) {
      this.openOccupationModal();
      const selectedSectors = this.sectorsData.filter((sector) =>
        this.selectedOccupation.assignedSectors.some(
          (occupationSector) => occupationSector.sectorId === sector.id
        )
      );
      this.createOccupationForm.patchValue({
        shortDescription: this.selectedOccupation.shortDescription,
        name: this.selectedOccupation.name,
        sector: selectedSectors,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Occupation is selected!.'
      );
    }
  }

  deleteOccupation() {
    this.occupationConfirmationModal.show();
  }

  confirmOccupationDelete() {
    if (this.selectedOccupation) {
      const occupationId = this.selectedOccupation.id;
      this.occupationServive.deleteOccupation(occupationId).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted Occupation'
            );
            this.selectedOccupation = null;
            this.fetchOccupations();
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
        'No Occupation is selected!.'
      );
    }
  }
}
