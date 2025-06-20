export interface FieldError {
  showErrorMessage: boolean;
  errorMessage: string;
}

export interface RegexErrorMessages {
  [fieldName: string]: FieldError;
}
