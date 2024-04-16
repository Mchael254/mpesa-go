import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { ParameterService } from '../../services/parameter.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { UserParameterDTO } from '../../data/user-parameter-dto';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { Table } from 'primeng/table';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { UtilService } from '../../../../shared/services/util/util.service';

const log = new Logger('UserParametersComponent');

/* The UserParametersComponent class is a TypeScript component that handles the management and display
of user parameters in a CRM system. */
@Component({
  selector: 'app-user-parameters',
  templateUrl: './user-parameters.component.html',
  styleUrls: ['./user-parameters.component.css'],
})
export class UserParametersComponent implements OnInit {
  @ViewChild('parameterTable') parameterTable: Table;

  public createParameterForm: FormGroup;

  public userParametersData: UserParameterDTO[];
  public selectedParameter: UserParameterDTO;
  public statusesData: StatusDTO[];

  public groupId: string = 'userParameterTab';
  public response: any;
  public submitted = false;
  public visibleStatus: any = {};
  public errorOccurred = false;
  public errorMessage: string = '';

  isModalOpen = false;
  modalColumnName: string = '';
  modalColumnValue: string = '';

  userParametersBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/crm',
    },
    {
      label: 'Org Parameters',
      url: '/home/crm',
    },
    {
      label: 'User Parameters',
      url: '/home/crm/user-parameters',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private parameterService: ParameterService,
    private statusService: StatusService,
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  /**
   * The ngOnInit function initializes the component by calling other functions to set up the
   * parameters form and fetch data for parameters, statuses, and branches.
   */
  ngOnInit(): void {
    this.ParametersForm();
    this.fetchParameters();
    this.fetchStatuses();
  }

  ngOnDestroy(): void {}

  /**
   * The function creates a form with parameters for a ParametersForm component in TypeScript.
   */
  ParametersForm() {
    this.createParameterForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      value: [''],
      status: [''],
      description: [{ value: '', disabled: true }],
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
            const control = this.createParameterForm.get(key);
            if (control) {
              control.setValidators(Validators.required);
              control.updateValueAndValidity();
              const label = document.querySelector(`label[for=${key}]`);
              if (label) {
                const asterisk = document.createElement('span');
                asterisk.innerHTML = ' *';
                asterisk.style.color = 'red';
                label.appendChild(asterisk);
              }
            }
          }
        });
      });
  }

  /**
   * The function returns the controls of a parameter form.
   * @returns The createParameterForm controls are being returned.
   */
  get f() {
    return this.createParameterForm.controls;
  }

  /**
   * The function fetches parameters based on the provided name and organization ID and stores the
   * fetched data in the userParametersData variable.
   * @param {string} [name] - The name parameter is a string that represents the name of the parameter
   * to fetch. It is optional and can be omitted if not needed.
   * @param {number} [organizationId] - The organizationId parameter is an optional parameter of type
   * number. It is used to specify the ID of the organization for which the parameters should be
   * fetched. If no organizationId is provided, the function will fetch parameters for all
   * organizations.
   */
  fetchParameters(name?: string, organizationId?: number) {
    this.parameterService
      .getParameter(name, organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.userParametersData = data;
        log.info('Fetched Parameters', this.userParametersData);
      });
  }

  /**
   * The function fetches statuses from the status service and assigns the data to the statusesData
   * variable.
   */
  fetchStatuses() {
    this.statusService
      .getStatus()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.statusesData = data;
        log.info('Fetched Statuses', this.statusesData);
      });
  }

  /**
   * The function assigns the clicked parameter to the selectedParameter variable.
   * @param {UserParameterDTO} param - The parameter "param" is of type UserParameterDTO.
   */
  onParamsRowClick(param: UserParameterDTO) {
    this.selectedParameter = param;
  }

  /**
   * The function filters a parameter table based on a filter value entered by the user.
   * @param {Event} event - The event parameter is an object that represents an event that has
   * occurred, such as a user input or a browser event. It is typically passed to event handlers or
   * callback functions to provide information about the event that occurred. In this case, the event
   * parameter is used to get the value of an HTML input
   */
  filterParameters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.parameterTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function opens a modal by adding a 'show' class and setting the display property to 'block'.
   */
  openParameterModal() {
    const modal = document.getElementById('parameterModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function "closeParameterModal" hides and removes the "parameterModal" element from the DOM.
   */
  closeParameterModal() {
    const modal = document.getElementById('parameterModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `sliceString` takes a string as input and returns a sliced version of the string if
   * it is longer than 35 characters, otherwise it returns the original string.
   * @param {string} str - The parameter `str` is a string that represents the input string that needs
   * to be sliced.
   * @returns The function `sliceString` returns a string.
   */
  sliceString(str: string): string {
    if (str) {
      const slicedString = str.length > 35 ? str.slice(0, 35) + '...' : str;
      return slicedString;
    } else {
      return '';
    }
  }

  /**
   * The function `openModal` sets the `isModalOpen` flag to true and assigns values to
   * `modalColumnName` and `modalColumnValue`.
   * @param {string} columnName - A string representing the name of the column.
   * @param {string} columnValue - The value of the column that you want to display in the modal.
   */
  openModal(columnName: string, columnValue: string): void {
    this.isModalOpen = true;
    this.modalColumnName = columnName;
    this.modalColumnValue = columnValue;
  }

  /**
   * The function `editParameter()` opens a modal and populates it with the values of the selected
   * parameter for editing, or displays an error message if no parameter is selected.
   */
  editParameter() {
    if (this.selectedParameter) {
      this.openParameterModal();
      this.createParameterForm.patchValue({
        name: this.selectedParameter.name,
        value: this.selectedParameter.value,
        status: this.selectedParameter.status,
        description: this.selectedParameter.description,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Userparameter is selected.'
      );
    }
  }

  /**
   * The `updateParameters()` function is responsible for updating user parameters, performing form
   * validation, and displaying success messages.
   * @returns If the form is invalid, the function will return without performing any further actions.
   * If the form is valid and the selectedParameter exists, the function will update the parameter and
   * return the result of the update operation.
   */
  updateParameters() {
    this.submitted = true;
    this.createParameterForm.markAllAsTouched();

    if (this.createParameterForm.invalid) {
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
    this.closeParameterModal();

    if (this.selectedParameter) {
      const parameterFormValues = this.createParameterForm.getRawValue();
      const parameterId = this.selectedParameter.id;

      const saveParameter: UserParameterDTO = {
        description: parameterFormValues.description,
        id: parameterId,
        name: parameterFormValues.name,
        organizationId: this.selectedParameter.organizationId,
        parameterError: this.selectedParameter.parameterError,
        status: parameterFormValues.status,
        value: parameterFormValues.value,
      };

      this.parameterService
        .updateParameter(parameterId, saveParameter)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated a User Parameter'
          );
          this.fetchParameters();
          this.selectedParameter = null;
        });
    }
  }
}
