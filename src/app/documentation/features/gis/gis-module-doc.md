# GIS Documentation

This is the official documentation for the GIS module `(src/app/feature/gis)`.

### Dependencies
The GIS module depends on the following modules:

- **core**: for using the common functionality and singleton services provided by the core module
- **shared**: for using the reusable components and services provided by the shared module
- **services**: for using the services that are related to the GIS module.All GIS services are located in the `src/app/services/gis` folder

The GIS module imports these modules in its module file `(src/app/feature/gis/gis.module.ts)`.

### Routes
The GIS module defines its own routes in its routing file (src/app/feature/gis/gis-routing.module.ts). The routes are prefixed with `/gis`.
