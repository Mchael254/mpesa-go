import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";

@Component({
  selector: 'app-client-attributes',
  templateUrl: './client-attributes.component.html',
  styleUrls: ['./client-attributes.component.css']
})
export class ClientAttributesComponent implements OnInit {
  clientAttributesData: any;
  selectedClientAttributes: any;
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

  constructor(
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.campaignDefinitionCreateForm();
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
    this.openDefineClientAttributesModal();
  }

  ngOnDestroy(): void {}
}
