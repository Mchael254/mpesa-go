import { Injectable } from "@angular/core";
import { DynamicFormFields } from "./dynamic.form.fields";

@Injectable({
  providedIn: 'root'
})
export class QuotationFormSetUp {


  quotationDetailsForms(): DynamicFormFields[]{
    return  [
      {
        name: 'product',
        label: 'Product',
        type: 'dropdown',
        required: true,
        disabled:false,
        placeholder: 'Select your Gender',
        options: [
          { value: 'male', label: 'MALE' },
          { value: 'female', label: 'FEMALE' }
        ]
      },
      {
        name: 'term',
        label: 'Term',
        type: 'dropdown',
        required: true,
        disabled:false,
        placeholder: 'Select your Gender',
        options: [
          { value: 'male', label: 'MALE' },
          { value: 'female', label: 'FEMALE' }
        ]
      },
      {
        name: 'option',
        label: 'Option',
        type: 'dropdown',
        required: true,
        disabled:false,
        placeholder: 'Select your Gender',
        options: [
          { value: 'male', label: 'MALE' },
          { value: 'female', label: 'FEMALE' }
        ]
      },

      {
        name: 'payment_frequency',
        label: 'Payment Frequency',
        type: 'dropdown',
        required: true,
        disabled:false,
        placeholder: 'Select your Gender',
        options: [
          { value: 'male', label: 'MALE' },
          { value: 'female', label: 'FEMALE' }
        ]
      },

      {
        name: 'cover_type',
        label: 'Cover Type',
        type: 'dropdown',
        required: true,
        disabled:false,
        placeholder: 'Select your Gender',
        options: [
          { value: 'male', label: 'MALE' },
          { value: 'female', label: 'FEMALE' }
        ]
      },
      {
        name: 'sum_assured',
        label: 'Sum Assured',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Enter your Sum Assured'
      },
    ];
    ;
  }
  personalDetailForms(): DynamicFormFields[]{
    return  [
      {
        name: 'webClntFirstName',
        label: 'First Name',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Enter your first name'
      },
      {
        name: 'webClntLastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Enter your last name'
      },
      {
        name: 'webClntEmail',
        label: 'Email',
        type: 'text', // Ensure the type is 'text' for email
        required: true,
        disabled:false,

        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', // Add the email pattern
        placeholder: 'Enter your email address'
      },
      {
        name: 'webClntMobileNo',
        label: 'Phone No.',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Enter your Phone No.'
      },
      {
        name: 'webClntDob',
        label: 'Date of Birth',
        type: 'date', // Ensure the type is 'date' for date of birth
        required: true,
        disabled:false,

        placeholder: 'Select your date of birth'
      },
      {
        name: 'webClntGender',
        label: 'Gender',
        type: 'dropdown',
        required: true,
        disabled:false,
        placeholder: 'Select your Gender',
        options: [
          { value: 'M', label: 'MALE' },
          { value: 'F', label: 'FEMALE' }
        ]
      },

    ];
    ;
  }

  actionButtonConfig() : DynamicFormButtons {
    return {
      submit: { label: 'Next', visible: true, alignment: 'end', icon:'fa-solid fa-arrow-right'  },
      back: { label: 'Second', visible: false, alignment: 'start', icon:''  },
      center: { label: 'Center', visible: false, alignment: 'center', icon:'' },

    };
  }

  quotationDetailsActionButtonConfig() : DynamicFormButtons {
    return {
      submit: { label: 'Save and Continue', visible: true, alignment: 'end', icon:'fa-solid fa-arrow-right'  },
      back: { label: 'Back To Personal Details', visible: true, alignment: 'start', icon:''  },
      center: { label: 'Center', visible: false, alignment: 'center', icon:''  },

    };
  }
}

interface DynamicFormButtons {
  submit: {
    label: string;
    visible: boolean;
    icon?: string;
    alignment: 'start' | 'center' | 'end';
  };
  back: {
    label: string;
    visible: boolean;
    icon?: string;
    alignment: 'start' | 'center' | 'end';
  };
  center: {
    label: string;
    visible: boolean;
    icon?: string;
    alignment: 'start' | 'center' | 'end';
  };
}
