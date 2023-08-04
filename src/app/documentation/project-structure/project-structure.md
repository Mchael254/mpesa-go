# Project structure

This document explains the structure of the project that follows a modular approach to organize the code into core, feature, and shared modules. Each module has its own folder under the `src/app` folder. The project also has a services folder that contains all the services that are needed by the other features. The project uses Angular 16, nodejs version v18.16.0 and npm version 9.5.1.

## [Core Module](../core/core-module-doc.md)

The core module (`src/app/core`) contains all the guards, interceptors, models, enums, constants, configs, app settings or anything that is not component based. The core module is imported only once in the app module and provides singleton services and common functionality to the entire app.

## Features Folder

The features folder (`src/app/features`) contains all the feature modules that are related to a specific feature or functionality of the app. The feature modules are:

- [crm](../features/crm/crm-doc.md) module : for all crm related submodules
- [lms](../features/lms/lms-doc.md) module: for all lms related submodules
- [gis](../features/gis/gis-doc.md) module: for all gis related submodules
- [auth](../features/auth/auth-doc.md) module: for authentication components such as home , login, register, forget-password, reset-password components
- [base](../features/base/base-layout-doc.md) module: components such as header, sidebar, user's dashboard and dashboard layout
- [entities](../features/entities/entities-doc.md) module: for entity-related submodules i.e entity, staff, clients, service providers, and intermediary submodules

Each feature module has its own folder under the `src/app/feature` folder and contains its specific components. that are specific to that feature. The feature submodules are lazy-loaded using the router whenever possible to improve performance and reduce bundle size.

## [Shared Module](../shared/shared-doc.md)

The shared module (`src/app/shared`) contains all the components or services that are reusable across multiple feature modules. The shared module is imported in the feature modules that need its contents. The shared module has two sub-folders: components (`src/app/shared/components`) and services (`src/app/shared/services`). The components folder contains all the reusable components such as buttons, inputs, dialogs, etc. The services folder contains all the reusable services such as setups, dms, session-storage, messaging etc.
