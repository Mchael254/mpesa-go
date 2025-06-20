import {Component, OnInit} from '@angular/core';
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {HttpClient} from "@angular/common/http";
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../shared/services";
import {Condition, FieldModel, FormConfig, Group} from "../../../data/form-config.model";
import {RegexErrorMessages} from "../../../data/field-error.model";

const log = new Logger('NewEntityV2Component');

@Component({
  selector: 'app-new-entity-v2',
  templateUrl: './new-entity-v2.component.html',
  styleUrls: ['./new-entity-v2.component.css']
})
export class NewEntityV2Component implements OnInit {

  entityBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'New Entity',
      url: '/home/entity/new',
    },
  ];

  formFieldPayload!: FormConfig;
  uploadFormFields!: FieldModel[]
  formGroupSections!: any[];
  uploadGroupSections: { selects: FieldModel[], buttons: FieldModel[] }
  entityForm!: FormGroup;
  uploadForm!: FormGroup;
  language: string = 'en'
  category: string = '';
  idType: string = 'NATIONAL_ID'
  validationObject = {} // todo: add type to this

  regexErrorMessages: RegexErrorMessages = {};


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private utilService: UtilService,
  ) {

    this.entityForm = this.fb.group({
      fields: this.fb.array([])
    });

    this.uploadForm = this.fb.group({
      fields: this.fb.array([]),
    });
  }

  get fields(): FormArray {
    return this.entityForm.get('fields') as FormArray;
  }

  ngOnInit(): void {
    // this.fetchFormFields();
    this.fetchUploadFormFields();
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

  /**
   * fetches all form categories based on category (individual | corporate)
   * @param category
   */
  fetchFormFields(category: string): void {
    this.http.get<any>( 'assets/data/formFields.json').subscribe({
      next: (data: any) => {

        data.category.forEach((item) => { // todo: define type for item
          if (item.label === category) {
            this.formFieldPayload = item.category;
            const groups: Group[] = item?.groups;
            const fields: FieldModel[] = item?.fields;
            this.orderFormGroup(groups, fields);
            this.addField(fields);
            log.info('FormFields loaded', item);
          }
        })
      },
      error: err => {
        log.error(err);
      }
    })
  }


  /**
   * fetches all form fields for the upload section
   * defines the roles and category selection dropdowns
   */
  fetchUploadFormFields(): void {
    this.http.get<any>( 'assets/data/uploadFormFields.json').subscribe({
      next: (data: any) => {
        this.uploadFormFields = data.fields;
        log.info('Upload FormFields loaded', data);
        this.addUploadFormFields();
      },
      error: err => {
        log.error(err);
      }
    })
  }

  /**
   * add fields to the entity form
   * @param fields
   */
  addField(fields:FieldModel[]): void {
    const group: { [key: string]: FormControl } = {};

    fields.forEach((field: FieldModel) => {
      const defaultValue: boolean | string = field.type === 'checkbox' ? false : '';

      // 👉 Create a fresh validator array for each field
      const validators: ValidatorFn[] = [];

      if (field.isMandatory) {
        validators.push(Validators.required);
      }

      if (field.type === 'text' && field.conditions.length > 0) {
        this.collateValidations(field.conditions)
      }

      group[field.fieldId] = new FormControl(defaultValue, validators);
    });

    this.entityForm = this.fb.group(group);
  }

  /**
   * add fields to the upload form section
   */
  addUploadFormFields(): void {
    const group: { [key: string]: FormControl } = {};

    this.uploadFormFields.forEach((field: FieldModel) => {

      const validators: ValidatorFn[] = [];

      if (field.isMandatory) {
        validators.push(Validators.required);
      }
      group[field.fieldId] = new FormControl('', validators);
    });

    this.uploadForm = this.fb.group(group);
    this.assignUploadFieldsToGroupByType(this.uploadFormFields)
  }


  /**
   * assign form fields to the different sections on the upload form page
   * @param fields
   */
  assignUploadFieldsToGroupByType(fields: FieldModel[]): void {
    let visibleFormFields = fields.filter(field => field.visible); // todo: create Model for FormFields

    this.uploadGroupSections = { selects: [], buttons: []}

    visibleFormFields.forEach(field => {
      if (field.type === 'select') {
        this.uploadGroupSections.selects.push(field);
      } else if (field.type === 'button') {
       this.uploadGroupSections.buttons.push(field);
      }
    });
  }


  /**
   * collate all validations that will be used to test different fields
   * @param conditions
   */
  collateValidations(conditions: any[]): void { // todo: define type condition
    conditions.forEach((condition) => {
      const type = condition.value;
      const validators = condition?.config?.validations;
      if (validators && validators.length > 0) {
        this.validationObject[type] = validators;
      }
    })
  }


  /**
   * sort form by groupOrder
   * @param groups
   * @param fields
   */
  orderFormGroup(groups: Group[], fields: FieldModel[]) : void {
    const formGroupSections: any[] = groups?.sort(
      (a: { groupOrder: number; }, b: { groupOrder: number; }) => a.groupOrder - b.groupOrder
    );
    this.assignFieldsToGroupByGroupId(fields, formGroupSections);
  }


  /**
   * assign fields to group on entity screen
   * @param fields
   * @param formGroupSections
   */
  assignFieldsToGroupByGroupId(fields: FieldModel[], formGroupSections: any[]): void { // todo: create Model for formGroupSections
    let visibleFormFields = fields.filter(field => field.visible); // todo: create Model for FormFields

    formGroupSections.forEach(section => { // initialize fields to empty array
      section.fields = []
    })

    visibleFormFields.forEach(field => {
      formGroupSections.forEach(section => {
        if (field.groupId === section.groupId) {
          section.fields.push(field)
        }
      })
    });

    this.formGroupSections = formGroupSections;
    log.info(`formGroupSections >>> `, this.formGroupSections);
  }


  /**
   * save details from form
   * filter out fields with no data
   * create payload for prime identity (primeIdentityPayload)
   */
  saveDetails() : void {
    const formValues = this.entityForm.getRawValue();
    log.info('formValues: ', formValues);

    // log.info(`pattern validation errors >>>`, this.regexErrorMessages) // todo: travel this and check if any validation failed
    if (this.entityForm.valid) {
      const filtered = Object.fromEntries(
        Object.entries(formValues).filter(([_, value]) => value != null && value !== '')
      );

      const primeIdentityPayload = {
        citizenshipCountryId: formValues.citizenshipCountryId,
        clientTypeId: formValues.clientTypeId,
        dateOfBirth: formValues.dateOfBirth,
        gender: formValues.gender,
        idNumber: formValues.idNumber,
        lastName: formValues.lastName,
        maritalStatus: formValues.maritalStatus,
        modeOfIdentityId: formValues.modeOfIdentityId,
        otherNames: formValues.otherName,
        pinNumber: formValues.pinNumber,
        wef: formValues.wef,
        wet: formValues.wet,
      }
      log.info(`primary identity details >>> `, primeIdentityPayload);

      const contactDetailsPayload = {
        branchId: formValues.branchId,
        titleId: formValues.titleId,
        smsNumber: formValues.smsNumber,
        telNumber: formValues.telNumber,
        email: formValues.email,
        contactChannel: formValues.contactChannel,
      }
      log.info(`contactDetailsPayload >>> `, contactDetailsPayload);

    } else {
      this.entityForm.markAllAsTouched(); // show validation errors
    }

  }


  /**
   * process select option based on the item selected
   * @param event
   * @param fieldId
   */
  processSelectOption(event: any, fieldId: string) : void {
    log.info(`processSelectOptions >>> `, event.target.value, fieldId);
    switch (fieldId) {
      case 'modeOfIdentityId':
        this.idType = event.target.value;
        break;
      case 'idType':
        break;
      case 'language':
        this.language = event.target.value;
        break;
      case 'category':
      case 'role':
        log.info(this.uploadForm.getRawValue())
        this.category = event.target.value;
        const formValues = this.uploadForm.getRawValue();
        if (formValues.category && formValues.role) this.fetchFormFields(formValues.category);
        break;
      default:
          log.info(`no fieldId found`)
    }
  }


  /**
   * validate regex
   * @param field
   * @param placeholder
   */
  validateRegex(field: FieldModel, placeholder?: any): void {

    const fieldId = field.fieldId;
    let pattern: RegExp;
    let input: string;
    let errorMessage: string;

    switch (fieldId) {
      case 'idNumber':
        // compare idType and search validation types
        const regexToUse = {};
        for (const key of Object.keys(this.validationObject)) {
          if (key === this.idType) {
            regexToUse[key] = this.validationObject[key];
          }
        }

        pattern = regexToUse[this.idType][0].type === 'pattern'
          ? new RegExp(regexToUse[this.idType][0].value)
          : null;

        input =  this.entityForm.getRawValue()[fieldId];
        errorMessage = regexToUse[this.idType][0].message[this.language];
        this.generateRegexErrorMessage(pattern, input, errorMessage, fieldId);
        break;

      default:
        pattern = new RegExp(field.validations[0]?.value);
        input =  this.entityForm.getRawValue()[fieldId];
        errorMessage = field.validations[0]?.message[this.language];
        this.generateRegexErrorMessage(pattern, input, errorMessage, fieldId);
    }

    log.info(`regex to use`, this.regexErrorMessages);

  }

  /**
   * generate error messages for regex
   * @param pattern
   * @param input
   * @param errorMessage
   * @param fieldId
   */
  generateRegexErrorMessage(pattern: RegExp, input: string, errorMessage: string, fieldId: string): void {
    if (pattern.test(input)) {
      this.regexErrorMessages[fieldId] = {
        showErrorMessage: false,
        errorMessage: ''
      }
    } else {
      this.regexErrorMessages[fieldId] = {
        showErrorMessage: true,
        errorMessage: errorMessage
      }
    }
  }


}

