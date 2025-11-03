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
  presentationType?: PresentationType,
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
  presentationType?: PresentationType,
  targetEntityShortDescription?: string,
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
  presentationType?: PresentationType,
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
  presentationType?: PresentationType,
  fields?: ConfigFormFieldsDto[],
  table?: any;
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
  presentationType?: PresentationType,
  fields?: ConfigFormFieldsDto[],
  table?: any;
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
  dataValue?: any;
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

export enum PresentationType {
  fields = "fields",
  table_columns = "table_columns",
  fields_and_table_columns = "fields_and_table_columns",
}

export enum SaveAction {
  // SAVE_CONTACT_DETAILS = 'SAVE_CONTACT_DETAILS',
  EDIT_CONTACT_DETAILS = 'EDIT_CONTACT_DETAILS',
  SAVE_CONTACT_PERSON = 'SAVE_CONTACT_PERSON',
  EDIT_CONTACT_PERSON = 'EDIT_CONTACT_PERSON',

  SAVE_AML_DETAILS = 'SAVE_AML_DETAILS',
  EDIT_AML_DETAILS = 'EDIT_AML_DETAILS',

  SAVE_CR12_DETAILS = 'SAVE_CR12_DETAILS',
  EDIT_CR12_DETAILS = 'EDIT_CR12_DETAILS',

  SAVE_OWNERSHIP_DETAILS = 'SAVE_OWNERSHIP_DETAILS',
  EDIT_OWNERSHIP_DETAILS = 'EDIT_OWNERSHIP_DETAILS',

  EDIT_ADDRESS_DETAILS = 'EDIT_ADDRESS_DETAILS',
  EDIT_BRANCH = 'EDIT_BRANCH',
  SAVE_BRANCH = 'SAVE_BRANCH',

  EDIT_FINANCE_DETAILS = 'EDIT_FINANCE_DETAILS',
  EDIT_PAYEE = 'EDIT_PAYEE',
  SAVE_PAYEE = 'SAVE_PAYEE',
}

/*export enum SaveAddressAction {
  EDIT_ADDRESS_DETAILS = 'EDIT_ADDRESS_DETAILS',
  EDIT_BRANCH = 'EDIT_BRANCH',
  SAVE_BRANCH = 'SAVE_BRANCH',
}

export enum SaveFinanceAction {
  EDIT_FINANCE_DETAILS = 'EDIT_FINANCE_DETAILS',
  EDIT_PAYEE = 'EDIT_PAYEE',
  SAVE_PAYEE = 'SAVE_PAYEE',
}*/

export enum FieldType {
  text = "text",
  number = "number",
  email = "email",
  password = "password",
  date = "date",
  datetime = "datetime",
  select = "select",
  multi_select = "multi_select",
  checkbox = "checkbox",
  radio = "radio",
  textarea = "textarea",
  file = "file",
  hidden = "hidden",
  tel = "tel",
  button = "button",
  table_select = "table_select",
  multiple_document_uploads = "multiple_document_uploads",
}

export enum UserCategory {
  INDIVIDUAL = "INDIVIDUAL",
  CORPORATE = "CORPORATE",
}
