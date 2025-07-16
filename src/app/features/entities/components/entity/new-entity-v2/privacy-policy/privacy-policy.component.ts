import {Component, Input} from '@angular/core';
import {FieldModel} from "../../../../data/form-config.model";
import {UtilService} from "../../../../../../shared/services";
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {

  @Input() otpFormFields: FieldModel[];

  selectedTab: string = 'otp_phone_number';
  shouldShowFields: boolean = false
  language: string = 'en';
  otpForm!: FormGroup;

  constructor(
    private utilService: UtilService,
    private fb: FormBuilder,
  ) {
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });

    this.otpForm = this.fb.group({
      fields: this.fb.array([]) // initialize FormArray
    });

  }

  get fields(): FormArray {
    return this.otpForm.get('fields') as FormArray;
  }

  private setFields(): void {
    const group: { [key: string]: FormControl } = {};

    this.otpFormFields.forEach((field: FieldModel) => {

      const validators: ValidatorFn[] = [];

      if (field.isMandatory) {
        validators.push(Validators.required);
      }
      group[field.fieldId] = new FormControl('', validators);
    });

    this.otpForm = this.fb.group(group);
  }

  showSelectedTab(selectedTab: string): void {
    this.selectedTab = selectedTab;
    this.shouldShowFields = true;
  }

  processInput(fieldId: string): void {
    const formValues = this.otpForm.getRawValue();
    console.log(formValues, fieldId);
  }


  ngOnChanges(): void {
    if (this.otpFormFields) {
      this.setFields();
    }
    setTimeout(() => {
      this.showSelectedTab('otp_sms')
    }, 2000)
  }

}
