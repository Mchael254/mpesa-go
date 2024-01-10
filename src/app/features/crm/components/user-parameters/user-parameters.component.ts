import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { ParameterService } from '../../services/parameter.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { UserParameterDTO } from '../../data/user-parameter-dto';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { Table } from 'primeng/table';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';

const log = new Logger('UserParametersComponent');

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
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.ParametersForm();
    this.fetchParameters();
    this.fetchStatuses();
  }

  ngOnDestroy(): void {}

  ParametersForm() {
    this.createParameterForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      value: [''],
      status: [''],
      description: [''],
    });
  }

  get f() {
    return this.createParameterForm.controls;
  }

  fetchParameters(name?: string, organizationId?: number) {
    this.parameterService
      .getParameter(name, organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.userParametersData = data;
        log.info('Fetched Parameters', this.userParametersData);
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

  onParamsRowClick(param: UserParameterDTO) {
    this.selectedParameter = param;
  }

  filterParameters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.parameterTable.filterGlobal(filterValue, 'contains');
  }

  openParameterModal() {
    const modal = document.getElementById('parameterModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeParameterModal() {
    const modal = document.getElementById('parameterModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  sliceString(str: string): string {
    const slicedString = str.length > 50 ? str.slice(0, 50) + '...' : str;
    return slicedString;
  }

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

  updateParameters() {
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
