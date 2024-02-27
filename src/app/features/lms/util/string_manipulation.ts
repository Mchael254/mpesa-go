import { FormGroup } from "@angular/forms";

export   class StringManipulation {

  static returnNullIfEmpty<T extends string | number | {} | null> (value: T): T | null | Number | {} {  
    if (value === null) {
      return null;
    } else if (typeof value === 'string' && value.trim() === '') {
      return null;
    } else if (!!Number(value)) {
      return Number(value);
    } else if (typeof value === 'string') {
      return value;
    }
     else if (typeof value === 'object') {
      return value;
    }
    return null;

  }

  static isEmpty(value: string | number | null): boolean {
    if (value === null) {
      return true;
    } else if (typeof value === 'string' && value.trim() === '') {
      return true;
    } else if (!!Number(value)) {
      return false;
    } else if (typeof value === 'string' && value.trim() !== '') {
      return false;
    }
    return true;
  }

  static formatNumberWithCommasforThousands(x): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

static enableControlsWithErrors(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach((controlName) => {
    const control = formGroup.get(controlName);

    if (control && control.invalid) {
      control.enable();
    }

    if (control instanceof FormGroup) {
      this.enableControlsWithErrors(control);
    }
  });
}


  // static isNull(value: string | number | boolean | object | null | undefined): boolean {
  //   `
  //   Checks if a given value is considered empty.
  
  //   Args:
  //     value: The value to check for emptiness.
  
  //   Returns:
  //     True if the value is empty, False otherwise.
  //   `
  
  //   if (value === null || value === undefined) {
  //     return true;
  //   } else if (typeof value === 'string' && value.trim() === '') {
  //     return true;
  //   } else if (typeof value === 'number' && !isNaN(value)) {
  //     return false;
  //   } else if (typeof value === 'boolean') {
  //     return !value;
  //   } else if (typeof value === 'object' && value.length === 0) {
  //     return true;
  //   } else if (typeof value === 'object' && !Object.keys(value).length) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
