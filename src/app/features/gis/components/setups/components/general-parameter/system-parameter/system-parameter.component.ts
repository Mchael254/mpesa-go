import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ParametersService} from "../../../services/parameters/parameters.service";
import {take} from "rxjs/operators";
import {Params} from "../../../data/gisDTO";
import {Logger} from "../../../../../../../shared/services";
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup} from "@angular/forms";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";


const log = new Logger();

@Component({
  selector: 'app-system-parameter',
  templateUrl: './system-parameter.component.html',
  styleUrls: ['./system-parameter.component.css']
})
export class SystemParameterComponent implements OnInit {

  private allParams: Params[];
  public filteredParams: Params[];
  public selectedParam: Params;
  public parameterForm: FormGroup;
  private isUpdateParam: boolean = false;

  public breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'GIS Setups',
      url: '/home/gis/setup/parameters/system-parameters',
    },
    {
      label: 'System Parameters',
      url: '/home/gis/setup/parameters/system-parameters'
    }
  ];

  constructor(
    private paramsService: ParametersService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private messageService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.getAllParams();
    this.createParameterForm();
    this.spinner.show();
  }

  createParameterForm(): void {
    this.parameterForm = this.fb.group({
      name: [''],
      value: [''],
      status: [''],
      description: [''],
      organizationCode:2,
      version: 0,
    })
  }

  getAllParams(): void {
    this.paramsService.getAllParams()
      .pipe(take(1))
      .subscribe({
        next: (params) => {
          this.allParams = params;
          this.filteredParams = params;
          log.info(`filteredParams >>> `, this.filteredParams);
          this.spinner.hide();
        },
        error: (e) => { log.info(e)}
      });
  }

  filterParams(event: any): void {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredParams = this.allParams.filter((el) => el.name.includes(searchValue));
    this.cdr.detectChanges();
  }

  selectParam(param: Params): void {
    this.selectedParam = param;
    this.parameterForm.patchValue(this.selectedParam);
    this.isUpdateParam = true;
    log.info(`param >>>`, param);
  }

  saveParameter(): void {
    const formValues = this.parameterForm.getRawValue();
    const param: Params = {
      name: formValues.name,
      value: formValues.value,
      status: formValues.status,
      description: formValues.description,
      organizationCode:2,
      version: 0,
    }

    if (this.isUpdateParam) {
      this.updateParameter(param);
    } else {
      this.createParameter(param);
    }
  }

  createParameter(param: Params): void {
    this.paramsService.createParam(param)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.messageService.displaySuccessMessage('success', 'Parameter successfully created');
          this.getAllParams();
        },
        error: (e) => {
          this.messageService.displayErrorMessage('error', 'Parameter failed to create')
        }
      })
  }

  updateParameter(param: Params): void {
    param.code = null;
    param.version = this.selectedParam.version;
    log.info(`code type >>> `, typeof param.code, param);

    this.paramsService.updateParam(param, this.selectedParam.code)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.messageService.displaySuccessMessage('success', 'Parameter successfully updated');
          this.getAllParams();
        },
        error: (e) => {
          this.messageService.displayErrorMessage('error', 'Parameter failed to update')
        }
      });
  }

  resetForm(): void {
    this.parameterForm.reset();
    this.isUpdateParam = false;
  }

  deleteParameter() {
    this.paramsService.deleteParameter(this.selectedParam.code)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.messageService.displaySuccessMessage('success', 'Parameter successfully deleted')
          this.getAllParams();
        },
        error: (e) => {
          this.messageService.displayErrorMessage('error', 'Parameter failed to delete')
        }
      })
    log.info(`selected parameter >>>`, this.selectedParam);
  }
}
