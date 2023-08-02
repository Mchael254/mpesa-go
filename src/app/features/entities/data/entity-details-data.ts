import {DynamicFormFields} from "../../../shared/utils/dynamic.form.fields";
import {DynamicFormButtons} from "../../../shared/utils/dynamic.form.button";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class EntityDetails  {
  entityDetails(): DynamicFormFields[]{
    return [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Enter your first name'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text', // Ensure the type is 'text' for email
        required: true,
        disabled:false,

        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', // Add the email pattern
        placeholder: 'Enter your email address'
      },
      {
        name: 'country',
        label: 'Country',
        type: 'dropdown',
        required: false,
        disabled:false,
        placeholder: 'Select your country',
        options: [
          { value: 'usa', label: 'USA' },
          { value: 'canada', label: 'Canada' },
          { value: 'uk', label: 'UK' }
        ]
      },
    ];
  }

  actionButtonConfig() : DynamicFormButtons{
    return {
      submit: { label: 'Save and Continue', visible: true, alignment: 'end' },
      back: { label: 'Second', visible: false, alignment: 'start' },
      center: { label: 'Center', visible: false, alignment: 'center' },

    };
  }


}

