import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { ParameterService } from '../../services/parameter.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';
import { UserParameterDTO } from '../../data/user-parameter-dto';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { Logger } from 'src/app/shared/services/logger/logger.service';
import { Table } from 'primeng/table';

const log = new Logger( 'UserParametersComponent');

@Component({
  selector: 'app-user-parameters',
  templateUrl: './user-parameters.component.html',
  styleUrls: ['./user-parameters.component.css']
})
export class UserParametersComponent implements OnInit {

   @ViewChild('parameterTable') parameterTable: Table;

  public createParameterForm: FormGroup;

  public userParametersData: UserParameterDTO[];
  public selectedParameter: UserParameterDTO;

  userParametersBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard'
    },
    {
      label: 'CRM Setups',
      url: '/home/crm',
    },
    {
      label: 'Org Parameters',
      url: '/home/crm'
    },
    {
      label: 'User Parameters',
      url: '/home/crm/user-parameters'
    }
  ];

  public statuses = [
    { name: 'Active', value: 'A' },
    { name: 'Inactive', value: 'IN' },
    { name: 'Unknown', value: 'U' },
    { name: 'Blacklisted', value: 'B' }
  ]

  constructor(
    private fb: FormBuilder,
    private parameterService: ParameterService,
    private globalMessagingService: GlobalMessagingService,
  ) {}

  ngOnInit(): void {
    this.fetchParameters();
    this.ParametersForm();
  }

  ngOnDestroy(): void {}

  ParametersForm() {
    this.createParameterForm = this.fb.group({
      name: [''],
      value: [''],
      status: [''],
      description: [''],
    })
  }

  get f() { return this.createParameterForm.controls; }

  // fetchParameters() {
  //   this.parameterService.getParameter()
  //     .pipe(untilDestroyed(this))
  //     .subscribe((data) => {
  //       this.userParametersData = data;
  //     })
  // }

  fetchParameters(name?: string, organizationId?: number) {
    this.parameterService.getParameter(name, organizationId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.userParametersData = data;
        log.info('Fetched Parameters', this.userParametersData);
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

  editParameter() {
    if (this.selectedParameter) {
      this.openParameterModal();
      this.createParameterForm.patchValue({
        name: this.selectedParameter.name,
        value: this.selectedParameter.value,
        status: this.selectedParameter.status,
        description: this.selectedParameter.description
      });
    }
    else {
      log.error('Error', 'No Region is selected.')
    }
  }

  deleteParameter() {
    if (this.selectedParameter) {
      const paramId = this.selectedParameter.id;
      this.parameterService.deleteParameter(paramId)
        .subscribe(data => {
          this.globalMessagingService.displaySuccessMessage('success', 'Successfully deleted a User-Parameter');
          this.fetchParameters();
        })
    }
    else {
      log.error('Error', 'No Region is Selected!');
    }
  }
  
  updateParameters() {
    this.closeParameterModal();

    if (this.selectedParameter) { 
      const parameterFormValues = this.createParameterForm.getRawValue();
      const parameterId = this.selectedParameter.id

      const saveParameter: UserParameterDTO = {
        description: parameterFormValues.description,
        id: parameterId,
        name: parameterFormValues.name,
        organizationId: this.selectedParameter.organizationId,
        parameterError: this.selectedParameter.parameterError,
        status: parameterFormValues.status,
        value: parameterFormValues.value
      }

      this.parameterService.updateParameter(parameterId, saveParameter)
        .subscribe(data => { 
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated a User Parameter');
          this.fetchParameters();
        });

    }
  }

}
