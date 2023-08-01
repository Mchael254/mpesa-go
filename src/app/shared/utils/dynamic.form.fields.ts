export interface DynamicFormFields {
  name: string;
  label: string;
  type:string;
  required?: boolean;
  disabled:boolean;
  placeholder?: string;
  pattern?: string;
  options?: {}[]
}
