# LMS Documentation

This is the official documentation for the LMS module `(src/app/feature/lms)`.

### Dependencies
The LMS module depends on the following modules:

- **core**: for using the common functionality and singleton services provided by the core module
- **shared**: for using the reusable components and services provided by the shared module
- **services**: for using the services that are related to the LMS module.All LMS services are located in the `src/app/services/lms` folder

The LMS module imports these modules in its module file `(src/app/feature/lms/lms.module.ts)`.

### Routes
The LMS module defines its own routes in its routing file (src/app/feature/lms/lms-routing.module.ts). The routes are prefixed with `/lms`.
