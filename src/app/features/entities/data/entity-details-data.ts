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
        placeholder: 'Enter your first name',
        value: ""

      },
      {
        name: 'date_of_birth_file',
        label: 'Date of Birth File',
        type: 'file',
        required: true,
        disabled:false,
        placeholder: 'Date of Birth File'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text', // Ensure the type is 'text' for email
        required: true,
        disabled:false,
        value: "",
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', // Add the email pattern
        placeholder: 'Enter your email address'
      },
      {
        name: 'country',
        label: 'Country',
        type: 'dropdown',
        required: false,
        disabled:false,
        value: "",
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

  newEntityDetails(): DynamicFormFields[]{
    return [
      {
        name: 'category',
        label: 'Party Type',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Primary Party Type'
      },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Date of Birth'
      },
      {
        name: 'entity_name',
        label: 'Entity',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Entity Name'
      },
      {
        name: 'mode_of_identity',
        label: 'Primary ID Type',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Primary ID Type'
      },
      {
        name: 'identity_number',
        label: 'ID Number',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'ID Number'
      },
      {
        name: 'pin_number',
        label: 'Pin Number',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Pin Number'
      },
      {
        name: 'assign_role',
        label: 'Assign Role (Optional)',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'selected Role'
      },
      {
        name: 'profilePiture',
        label: 'Profile Picture',
        type: 'text',
        required: true,
        disabled:false,
        placeholder: 'Primary Party Type'
      },

    ]
  }
  entityActionButtonConfig() : DynamicFormButtons{
    return {
      submit: { label: 'Next', visible: true, alignment: 'end' },
      back: { label: 'Second', visible: false, alignment: 'start' },
      center: { label: 'Center', visible: false, alignment: 'center' },

    };
  }


}
