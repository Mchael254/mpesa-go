# Shared Module
This module is used to hold all the shareable components and services that can be reused across different modules and components in the Angular application. It has two folders: components and services.

## Components
The components folder contains the following components:

  - [dynamic-table](./components/dynamic-table/dynamic-table-doc.md):
    
    This component is used to display data in a tabular format with various features such as pagination, sorting, filtering, and lazy loading. <br/><br/>
    It uses the p-table component from the PrimeNG library as the base template and adds some customizations and input properties. For more details, see the [dynamic table documentation](./components/dynamic-table/dynamic-table-doc.md).<br/><br/>

  - [dynamic-breadcrumbs](./components/dynamic-breadcrumb/dynamic-breadcrumb-doc.md):
   
    This component is used to display a navigation trail that shows the user’s current location in the application and allows them to navigate back to previous levels. <br/><br/> 
    It uses the breadrumb component from the Boostrap library as the base template and adds some customizations and input properties. For more details, see the [dynamic breadcrumbs documentation](./components/dynamic-breadcrumb/dynamic-breadcrumb-doc.md)..<br/><br/>

  - [dynamic-form](./components/dynamic-form/dynamic-form-doc.md): 

    This component is used to create dynamic forms that can be customized according to the input properties. <br/>
    It uses the Reactive Forms approach from Angular and supports various types of form controls, validations, and layouts. For more details, see the dynamic form documentation. <br/><br/>

  - [dynamic-chart](./components/dynamic-chart/dynamic-chart-doc.md):
    
    This component is used to create dynamic charts that can be customized according to the input properties.<br/> 
    It uses the Chart.js library as the base library and supports various types of charts, such as line, bar, pie, doughnut, etc. For more details, see the [dynamic chart documentation](./components/dynamic-chart/dynamic-chart-doc.md).<br/><br/>

  - [doc-viewer](./components/doc-viewer/doc-viewer-documentation.md): 
    
    This component is used to display documents such as PDF and Images in a viewer that supports zooming, scrolling, printing, downloading, etc. <br/>
    It uses an iframe and adds some customizations and input properties. For more details, see the [doc viewer documentation](./components/doc-viewer/doc-viewer-documentation.md).<br/><br/>

  - [otp](./components/otp/otp-doc.md): 
    
    This component is used to display a screen that asks the user to enter a one-time password (OTP) that is sent to their phone or email. <br/> 
    It has input fields to enter the OTP and a button that allows the user to resend the OTP if needed. <br/>
    It also has a validation logic that checks if the OTP entered by the user is correct or not. For more details, see the [otp screen documentation](./components/otp/otp-doc.md).<br/><br/>

  - [loader](./components/loader/loader-doc.md): 
    
    This component is used to display a loader animation that indicates that some data or content is being loaded or processed. It adds some customizations and input properties. For more details, see the [loader documentation](./components/loader/loader-doc.md). <br/><br/>

  - [notifications](./components/notifications/notifications-doc.md): 
  
     This component is used to display notifications or messages that inform the user about some events or actions in the application.<br/> 
    It uses the p-toast component from the PrimeNG library as the base template and adds some customizations and input properties. For more details, see the [notifications documentation](./components/notifications/notifications-doc.md).<br/><br/>
