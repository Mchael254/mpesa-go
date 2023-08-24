## Dynamic Setup Wizard 

- This component is used to display the setup wizard majorly used on some of the GIS setup screens.
- The code for the setup wizard delineates its structure into two distinct sections: the left-sided menu and the right-sided content area. The content segment encompasses a variety of cards, with the initial card being the welcome card. The remaining cards feature forms that exhibit dynamic behavior, primarily powered by the dynamic form component.



## Table of Contents
- [Input Properties](#input-properties)
- [Output Properties](#output-properties)
- [Usage](#usage)
-[Contributing](#contributing)



## Input Properties
*setupWizard*
*Description*: An array of objects containing details about the setup wizard's configuration.
*Type*: Array of setupWizard objects.
*Usage*: This input property defines various settings for the setup wizard, such as column definitions, row data, and interactive options.

*Example* :

````typescript
 wizardConfig: setupWizard[] = [
    {
      tabTitle: 'Classes and Subclasses',
      url: '/home/classes'
    }
  
  ];
````
````html:
<app-dynamic-setup-wizard-welcome-screen [setupWizard]="wizardConfig"></app-dynamic-setup-wizard-welcome-screen>

````
*setupListItem*

*Description*: An array of objects specifying the list items for the setup wizard.
*Type*: Array of setupListItem objects.
*Usage*: This input property populates the list of selectable items within the setup wizard. Each item represents a specific configuration or action.



*Example*:

````typescript 
  classesListItem: setupListItem[]=[
    {
      listLabel:'Classes Setup',
      listPosition:'1'
    },
    {
      listLabel:'Subclass Setup',
      listPosition:'2'
    },
    {
      listLabel:'Class Perils',
      listPosition:'3'
    },
    {
      listLabel:'Class Excesses',
      listPosition:'4'
    }
  ]
````

````html
 <app-dynamic-setup-wizard-welcome-screen [setupWizard]="wizardConfig" [setupListItem]="classesListItem" ></app-dynamic-setup-wizard-welcome-screen>
 ````



## Output Properties
*selectedCard(cardLabel: string)*
Description: An event emitted when a card is selected within the setup wizard's left menu.
Parameters:
cardLabel: A string representing the label of the selected card.
Usage: This event allows the parent component to respond to card selections and display the selected card on the content section of the setup wizard screen(the right side).

## Usage
To integrate the Dynamic Setup Wizard Component into your application, follow these steps:

1.Import the component where needed:

````typescript
import { DynamicTableComponent } from './path/to/dynamic-setup-wizard-weclome-screen.component';
````
2.Add the component to your template:

````html
<app-dynamic-table [setupWizard]="wizardConfig" [setupListItem]="listItems"></app-dynamic-table>
````
3.Customize the setupWizard and setupListItem objects as per your application's requirements.



 *Feel free to replace the placeholders (wizardConfig, listItems, etc.) with actual values and descriptions specific to your application. This documentation provides a general template that you can adapt to your project's needs.*



## Contributing
If you encounter any issues or have suggestions for enhancements, please consider contributing to this component by opening issues or pull requests in the repository.