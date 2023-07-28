# CRM Documentation

This is the official documentation for the CRM (Customer Relationship Management) module `(src/app/feature/crm)`. This module contains all the submodules related to managing the customers, leads, contacts, opportunities, campaigns, etc. of the app.

### Dependencies
The CRM module depends on the following modules:

- **core**: for using the common functionality and singleton services provided by the core module
- **shared**: for using the reusable components and services provided by the shared module
- **services**: for using the services that are related to the CRM module.All CRM services are located in the `src/app/services/crm` folder

The CRM module imports these modules in its module file `(src/app/feature/crm/crm.module.ts)`.

### Routes
The CRM module defines its own routes in its routing file `(src/app/feature/crm/crm-routing.module.ts)`. 

The routes are prefixed with `/crm` and have the following structure (for example):
/crm/lead: for displaying the lead list and details

