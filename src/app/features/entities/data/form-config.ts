export interface FormField {
  fieldId: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
  label: string; // i18n labels: { en: string, fr: string, etc. }
  visible?: boolean;
  disabled?: boolean;
  validations?: FormValidation[];
  conditions?: any[]; // For conditional logic
  tooltip?: string; // i18n tooltips
  placeholder?: string; // i18n placeholders
  groupId?: string;
  order?: number | string;
  defaultValue?: any;
  options?: Array<{ value: any; label: string }>;
  className?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  multiple?: boolean;
  accept?: string;
  rows?: number;
  cols?: number;
  prefix?: {
    text: string;
    className?: string;
  };
  suffix?: {
    text: string;
    className?: string;
  };
}

export interface FormGroup {
  groupId: string;
  labels: Record<string, string>; // i18n labels
  groupOrder: number;
  description?: string;
  collapsible?: boolean;
  collapsed?: boolean;
}

export interface FormValidation {
  type: string;
  message: string | Record<string, string>; // i18n messages
  value?: any;
}

export interface FormConfig {
  id: string;
  locale: string;
  formGroups: FormGroup[];
  fields: FormField[];
}
