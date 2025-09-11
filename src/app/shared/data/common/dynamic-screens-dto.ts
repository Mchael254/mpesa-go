export interface SubModulesDto {
  code: number;
  moduleCode: number;
  moduleName: string;
  subModuleId: string;
  originalLabel: string;
  label: MultilingualText,
  visible: boolean;
  order: number;
  fields?: ConfigFormFieldsDto[],
}

export interface ScreensDto {
  code: number;
  subModuleCode: number;
  screenId: string;
  originalLabel: string;
  label: MultilingualText,
  visible: boolean;
  order: number;
  hasFields: boolean;
  subModuleId?: string,
}

export interface ScreenFormsDto {
  code: number;
  screenCode: number;
  formId: string;
  originalLabel: string;
  label: MultilingualText,
  visible: boolean;
  order: number;
  hasFields: boolean;
  screenId?: string,
  subModuleId?: string,
}

export interface FormGroupsDto {
  code: number;
  formCode: number;
  groupId: string;
  originalLabel: string;
  label: MultilingualText,
  order: number;
  screenCode: number;
  subModuleCode: number;
  visible: boolean,
  subGroup: FormSubGroupsDto[],
  hasFields: boolean,
  screenId?: string,
  subModuleId?: string,
  formId?: string,
}

export interface FormSubGroupsDto {
  code: number;
  formGroupingCode: number;
  originalLabel: string;
  subGroupId: string;
  label: MultilingualText,
  addButtonTextLabel: MultilingualText,
  visible: boolean;
  order: number;
  hasFields: boolean;
  formGroupingId: string,
}

export interface ConfigFormFieldsDto {
  code: number;
  fieldId: string,
  type: string,
  label: MultilingualText,
  dynamicLabel: {
    field: string,
    mapping: {
      INDIVIDUAL: MultilingualText,
      CORPORATE: MultilingualText
    }
  },
  defaultValue: string,
  visible: boolean;
  disabled: boolean;
  validations: Validation[],
  conditions: Condition[],
  originalLabel?: string;
  placeholder: MultilingualText,
  tooltip: MultilingualText,
  order: number;
  options: any[],
  formCode: number;
  formGroupingCode: number;
  formSubGroupingCode: number;
  screenCode: number;
  subModuleCode: number;
  mandatory: boolean;
  isProtected?: boolean;
  showTooltip: boolean;
  formId?: string,
  formGroupingId?: string,
  formSubGroupingId?: string,
  screenId?: string,
  subModuleId?: string,
}

export interface MultilingualText {
  en: string;
  ke: string;
  fr: string;
}

export interface Validation {
  type: string;
  value: string;
  message: MultilingualText;
}

export interface Condition {
  field: string;
  value: any;
  visible: boolean;
  config: ConditionConfig;
}

export interface ConditionConfig {
  defaultValue: string;
  validations: Validation[];
}

export enum options {
  INDIVIDUAL = "I",
  CORPORATE = "C"
}

export interface DynamicScreenSetupUpdateDto {
  fields?: ConfigFormFieldsDto[];
  groups: FormGroupsDto[];
  forms: ScreenFormsDto[];
  screens: ScreensDto[];
  subModules: SubModulesDto[];
}

export interface DynamicSetupImportDto {
  subModules: SubModulesDto[],
  screens: ScreensDto[],
  forms: ScreenFormsDto[],
  groups: FormGroupsDto[],
  fields: ConfigFormFieldsDto[],
  subGroup: FormSubGroupsDto[],
}

export interface DynamicScreenSetupDto {
  fields: ConfigFormFieldsDto[];
  groups: FormGroupsDto[];
  forms: ScreenFormsDto[];
  screens: ScreensDto;
  subModules: SubModulesDto;
}
