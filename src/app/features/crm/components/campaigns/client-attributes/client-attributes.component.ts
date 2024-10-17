import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {CampaignsService} from "../../../services/campaigns..service";
import {NgxSpinnerService} from "ngx-spinner";
import {Logger} from "../../../../../shared/services";
import {ClientAttributesDTO, ClientSearchAttributesDTO} from "../../../data/campaignsDTO";
import {Table} from "primeng/table";

const log = new Logger('CampaignDefinitionComponent');
@Component({
  selector: 'app-client-attributes',
  templateUrl: './client-attributes.component.html',
  styleUrls: ['./client-attributes.component.css']
})
export class ClientAttributesComponent implements OnInit {
  clientAttributesData: ClientAttributesDTO[] = [];
  selectedClientAttribute: ClientAttributesDTO;
  clientSearchAttributesData: ClientSearchAttributesDTO[];
  pageSize: 5;

  editMode: boolean = false;

  createClientAttributesForm: FormGroup;

  visibleStatus: any = {
    clientAttributeName: 'Y',
    clientAttributeDescription: 'Y',
    clientAttributePrompt: 'Y',
    clientAttributeRange: 'Y',
    clientAttribute: 'Y',
  }

  groupIdClientAttributes: string = 'campaignClientAttributesTab';

  @ViewChild('clientAttributesTable') clientAttributesTable: Table;

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private campaignsService: CampaignsService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.campaignDefinitionCreateForm();
    this.fetchClientAttributes();
    this.fetchClientSearchAttributes();
  }

  /**
   * The function `campaignDefinitionCreateForm` creates a form for client attributes, sets validators
   * for mandatory fields, and updates the form's visibility based on the response from a service call.
   */
  campaignDefinitionCreateForm() {
    this.createClientAttributesForm = this.fb.group({
      clientAttributeName: [''],
      clientAttributeDescription: [''],
      clientAttributePrompt: [''],
      clientAttributeRange: [''],
      clientAttribute: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupIdClientAttributes).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.createClientAttributesForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createClientAttributesForm.controls[key].addValidators(Validators.required);
                this.createClientAttributesForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  /**
   * The function returns the controls of a form named createClientAttributesForm.
   * @returns The function `f()` is returning the controls of the `createClientAttributesForm` form
   * group.
   */
  get f() {
    return this.createClientAttributesForm.controls;
  }

  /**
   * The function `openDefineClientAttributesModal` displays a modal for defining client attributes if
   * it exists in the DOM.
   */
  openDefineClientAttributesModal() {
    const modal = document.getElementById('campaignClientAttribute');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeDefineClientAttributesModal` sets `editMode` to false and hides the modal with
   * the id 'campaignClientAttribute'.
   */
  closeDefineClientAttributesModal() {
    this.editMode = false;
    const modal = document.getElementById('campaignClientAttribute');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function `editClientAttribute` toggles the edit mode and opens a modal for defining client
   * attributes.
   */
  editClientAttribute() {
    this.editMode = !this.editMode;
    if(this.selectedClientAttribute) {
      this.openDefineClientAttributesModal();
      this.createClientAttributesForm.patchValue(
        {
          clientAttributeName: this.selectedClientAttribute.name,
          clientAttributeDescription: this.selectedClientAttribute.description,
          clientAttributePrompt: this.selectedClientAttribute.prompt,
          clientAttributeRange: this.selectedClientAttribute.range,
          clientAttribute: this.selectedClientAttribute.columnName
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No client attribute is selected.'
      )
    }
  }

  /**
   * The function `fetchClientAttributes` fetches all client attributes and stores them in the component's
   * `clientAttributesData` property. It also shows a spinner while the data is being fetched and hides
   * the spinner once the data is fetched.
   */
  fetchClientAttributes() {
    this.spinner.show();
    this.campaignsService.getClientAttributes()
      .subscribe((data) => {
        this.clientAttributesData = data;
        this.spinner.hide();

        log.info("client attributes>>", data);
      });
  }

  /**
   * The function `fetchClientSearchAttributes` fetches all search attributes for clients and stores
   * them in the component's `clientSearchAttributesData` property.
   */
  fetchClientSearchAttributes() {
    this.campaignsService.getClientSearchAttributes()
      .subscribe((data) => {
        this.clientSearchAttributesData = data;

        log.info("columns>>", data);
      });
  }

  /**
   * The function `saveClientAttribute` is called when the user clicks the save button
   * in the create client attribute modal. It creates or updates a client attribute
   * based on whether the `selectedClientAttribute` property is truthy or falsy.
   */
  saveClientAttribute() {
    this.createClientAttributesForm.markAllAsTouched();
    if (this.createClientAttributesForm.invalid) return;

    const clientAttributeFormValues = this.createClientAttributesForm.getRawValue();
    const clientAttributeCode = this.selectedClientAttribute?.code ? this.selectedClientAttribute?.code : null;

    const saveClientAttributePayload: ClientAttributesDTO = {
      code: clientAttributeCode,
      columnName: clientAttributeFormValues.clientAttribute,
      description: clientAttributeFormValues.clientAttributeDescription,
      inputType: null,
      name: clientAttributeFormValues.clientAttributeName,
      prompt: clientAttributeFormValues.clientAttributePrompt,
      range: clientAttributeFormValues.clientAttributeRange,
      tableName: "TQC_CLIENTS"
    }
    log.info("attr>", saveClientAttributePayload);

    const clientAttributeServiceCall = this.selectedClientAttribute
      ? this.campaignsService.updateClientAttribute(this.selectedClientAttribute.code, saveClientAttributePayload)
      : this.campaignsService.createClientAttribute(saveClientAttributePayload);

    return clientAttributeServiceCall.subscribe({
      next: (data) => {
        this.globalMessagingService.displaySuccessMessage('Success', `Successfully ${this.selectedClientAttribute ? 'updated' : 'created'} a client attribute`);

        this.createClientAttributesForm.reset();
        this.closeDefineClientAttributesModal();
        this.fetchClientAttributes();
        this.selectedClientAttribute = null;
      },
      error: (err) => {
        log.info('>>>>>>>>>', err.error.message)
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      }
    });

  }

  /**
   * Deletes a client attribute.
   */
  deleteClientAttribute() {
    if (this.selectedClientAttribute) {
      const clientAttributeId = this.selectedClientAttribute?.code;
      this.campaignsService.deleteClientAttribute(clientAttributeId).subscribe( {
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a client attribute'
          );
          this.selectedClientAttribute = null;
          this.fetchClientAttributes();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No client attribute is selected.'
      );
    }
  }

  /**
   * Filters the client attributes table based on the input value from an HTML input element.
   */
  filterClientAttributes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clientAttributesTable.filterGlobal(filterValue, 'contains');
  }

  ngOnDestroy(): void {}
}
