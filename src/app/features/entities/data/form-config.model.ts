/**
 * Define Form field model
 */

export interface FormConfig {
  label: string;
  groups: Group[];
  fields: FieldModel[];
  category: any[];
}

export interface Group {
  label: string;
  groupId: string;
  groupOrder: number;
  subGroup: SubGroup[];
}

export interface SubGroup {
  label: string;
  subGroupId: string;
}

export interface FieldModel {
  groupId: string;
  subGroupId: string;
  fieldId: string;
  type: string;
  label: TranslatableText;
  dynamicLabel: string | null;
  defaultValue: any;
  visible: boolean;
  disabled: boolean;
  validations: Validation[];
  conditions: Condition[];
  order: number;
  tooltip: TranslatableText;
  placeholder: TranslatableText;
  isMandatory: boolean;
  options: any[];
  doc?: any;
}

export interface Validation {
  type: string;
  value: string;
  message: TranslatableText;
}

export interface Condition {
  field: string;
  value: any;
  visible: boolean;
}

export interface TranslatableText {
  en: string;
  ke: string;
  fr: string;
}
