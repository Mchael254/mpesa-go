import { Injectable } from '@angular/core';
import {ConfigFormFieldsDto} from "../../../shared/data/common/dynamic-screens-dto";
import {FormBuilder, FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class EntityUtilService {

  constructor(
    private fb: FormBuilder,
  ) { }

  /**
   * Checks for fieldType as tel
   * @param mainStr
   * @Return True|False
   */
  checkTelNumber(mainStr: string): boolean {
    const subStrs: string[] = [
      'mobile_no', 'tel_no',
      'sms_number',
      'telephone_number',
      'landline_number',
      'mobile_money_number'
    ];

    return subStrs.some(subStr => mainStr.includes(subStr));
  }


  /**
   * create save/edit form dynamically.
   * @param fields
   */
  createEditForm(fields: ConfigFormFieldsDto[]): FormGroup {
    const group: { [key: string]: any } = {};
    fields.forEach(field => {
      group[field.fieldId] = [
        field.defaultValue,
        // field.isMandatory ? Validators.required : []
      ];
    });
    return this.fb.group(group);
  }


  /**
   * add data value to form fields for patching and display
   * @param fields
   * @param row
   */
  addDataToFormFields(fields: ConfigFormFieldsDto[], row): any {
    fields.forEach((field: ConfigFormFieldsDto) => {
      field.dataValue = row[field.fieldId];
      if (field.type === 'date') {
        field.dataValue = row[field.fieldId]?.split('T')[0];
      }
    });
    return fields;
  }

}
