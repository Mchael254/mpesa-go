# Entities module (EntitiesModule)

The EntitiesModule is an Angular module that provides the entities features for the application.

It contains components for entities list, entity details, entity creation and entity update functionalities. It also imports the SharedModule, which contains common components and services that are used throughout the application.

## Components

The components are located in the `src/app/feature/entities/components` folder.


The EntitiesModule declares and exports the following components:

- [_ListEntityComponent_](./components/entity/list-entity-component-doc.md)

  The component that displays a list of entities. It also provides a button to create a new entity.

  Route: `/entity/list` or `/entity`


- [_NewEntityComponent_](./components/entity/new-entity-component-doc.md)

  The component that allows the user to create a new entity.

  Route: `/entity/new`


- [_ViewEntityComponent_](./components/entity/view-entity-component-doc.md)

  The component that displays the details of an entity. It also provides buttons to update the entity or assign new roles (staff/agent/client/service-provider) to the entity.

  Route: `/entity/view/:id` where `:id` is the id of the entity


- [_RelatedAccountsComponent_](./components/entity/related-accounts-component-doc.md)

  The component that displays the list of accounts related to an entity. It provides a dropdown component (**_SelectStatusComponent_**) to change the status of the entity's account.

  Route: `/entity/manage-roles/:id` where `:id` is the id of the entity


- [_SelectStatusComponent_](./components/entity/select-status-component-doc.md)

  The component that displays a dropdown to change the status of the entity's account.

  Route: `/entity/manage-roles/:id` where `:id` is the id of the entity


- [_ListClientComponent_](./components/client/list-client-component-doc.md)

  The component that displays a list of clients. It also provides a button to create a new client.

  Route: `/entity/client/list` 


- [_NewClientComponent_](./components/client/new-client-component-doc.md)
  
  The component that allows the user to create a new client.

  Route: `/entity/client/new`


- [_ListStaffComponent_](./components/staff/list-staff-component-doc.md)
  
    The component that displays a list of staff. It also provides a button to create a new staff.
  
    Route: `/entity/staff/list`


- [_NewStaffComponent_](./components/staff/new-staff-component-doc.md)
  
    The component that allows the user to create a new staff.
  
    Route: `/entity/staff/new`


- [_StaffModalComponent_](./components/staff/staff-modal-component-doc.md)

  The component that allows the user to select a staff from a list of staff.


- [_AssignAppsComponent_](./components/staff/assign-apps-component-doc.md)

  The component that allows the user to assign apps to a staff.


-  [_StaffProfileComponent_](./components/staff/staff-profile-component-doc.md)

   The component that displays the form for creating a staff.



- [_ListServiceProviderComponent_](./components/service-provider/list-service-provider-component-doc.md)
  
    The component that displays a list of service providers. It also provides a button to create a new service provider.
  
    Route: `/entity/service-provider/list`


- [_NewServiceProviderComponent_](./components/service-provider/new-service-provider-component-doc.md)
  
    The component that allows the user to create a new service provider.
  
    Route: `/entity/service-provider/new`


- [_ListIntermediaryComponent_](./components/intermediary/list-intermediary-component-doc.md)
  
    The component that displays a list of intermediaries. It also provides a button to create a new intermediary.
  
    Route: `/entity/intermediary/list`


- [_NewIntermediaryComponent_](./components/intermediary/new-intermediary-component-doc.md)
  
    The component that allows the user to create a new intermediary.
  
    Route: `/entity/intermediary/new`


- [_EditComponent_](./components/edit/edit-component-doc.md)
  
    The component that allows the user to edit an entity.
  
    Route: `/entity/edit/:id` where `:id` is the id of the entity


## Folder Structure

<details>
  <summary>Click to see the view the entities module's folder structure</summary>
  
  ```bash
  
    |-- entities
     |   |   |-- components
       |   |   |   |-- client
  
         |   |   |   |   |-- list-client
            |   |   |   |   |   |   |-- list-client.component.css
            |   |   |   |   |   |   |-- list-client.component.html
            |   |   |   |   |   |   |-- list-client.component.spec.ts
            |   |   |   |   |   |   |-- list-client.component.ts
  
         |   |   |   |   |   |-- new-client
            |   |   |   |   |   |   |-- new-client.component.css
            |   |   |   |   |   |   |-- new-client.component.html
            |   |   |   |   |   |   |-- new-client.component.spec.ts
            |   |   |   |   |   |   |-- new-client.component.ts
  
       |   |   |   |   |-- edit
            |   |   |   |   |   |-- edit.component.css
            |   |   |   |   |   |-- edit.component.html
            |   |   |   |   |   |-- edit.component.spec.ts
            |   |   |   |   |   |-- edit.component.ts
  
       |   |   |   |   |-- entity
          |   |   |   |   |   |-- list-entity
            |   |   |   |   |   |   |-- list-entity.component.css
            |   |   |   |   |   |   |-- list-entity.component.html
            |   |   |   |   |   |   |-- list-entity.component.spec.ts
            |   |   |   |   |   |   |-- list-entity.component.ts
  
          |   |   |   |   |   |-- new-entity
            |   |   |   |   |   |   |-- new-entity.component.css
            |   |   |   |   |   |   |-- new-entity.component.html
            |   |   |   |   |   |   |-- new-entity.component.spec.ts
            |   |   |   |   |   |   |-- new-entity.component.ts
  
          |   |   |   |   |   |-- related-accounts
            |   |   |   |   |   |   |-- related-accounts.component.css
            |   |   |   |   |   |   |-- related-accounts.component.html
            |   |   |   |   |   |   |-- related-accounts.component.spec.ts
            |   |   |   |   |   |   |-- related-accounts.component.ts
  
          |   |   |   |   |   |-- select-status
            |   |   |   |   |   |   |-- select-status.component.css
            |   |   |   |   |   |   |-- select-status.component.html
            |   |   |   |   |   |   |-- select-status.component.spec.ts
            |   |   |   |   |   |   |-- select-status.component.ts
  
          |   |   |   |   |   |-- view-entity
            |   |   |   |   |   |   |-- view-entity.component.css
            |   |   |   |   |   |   |-- view-entity.component.html
            |   |   |   |   |   |   |-- view-entity.component.spec.ts
            |   |   |   |   |   |   |-- view-entity.component.ts
  
       |   |   |   |   |-- intermediary
            |   |   |   |   |   |-- list-intermediary
              |   |   |   |   |   |   |-- list-intermediary.component.css
              |   |   |   |   |   |   |-- list-intermediary.component.html
              |   |   |   |   |   |   |-- list-intermediary.component.spec.ts
              |   |   |   |   |   |   |-- list-intermediary.component.ts
  
            |   |   |   |   |   |-- new-intermediary
              |   |   |   |   |   |   |-- new-intermediary.component.css
              |   |   |   |   |   |   |-- new-intermediary.component.html
              |   |   |   |   |   |   |-- new-intermediary.component.spec.ts
              |   |   |   |   |   |   |-- new-intermediary.component.ts
  
       |   |   |   |   |-- service-provider
            |   |   |   |   |   |-- list-service-provider
              |   |   |   |   |   |   |-- list-service-provider.component.css
              |   |   |   |   |   |   |-- list-service-provider.component.html
              |   |   |   |   |   |   |-- list-service-provider.component.spec.ts
              |   |   |   |   |   |   |-- list-service-provider.component.ts
  
            |   |   |   |   |   |-- new-service-provider
              |   |   |   |   |   |   |-- new-service-provider.component.css
              |   |   |   |   |   |   |-- new-service-provider.component.html
              |   |   |   |   |   |   |-- new-service-provider.component.spec.ts
              |   |   |   |   |   |   |-- new-service-provider.component.ts
  
       |   |   |   |   |-- staff
            |   |   |   |   |   |-- assign-apps
            |   |   |   |   |   |   |-- assign-apps.component.css
            |   |   |   |   |   |   |-- assign-apps.component.html
            |   |   |   |   |   |   |-- assign-apps.component.spec.ts
            |   |   |   |   |   |   |-- assign-apps.component.ts
            
            |   |   |   |   |   |-- list-staff
            |   |   |   |   |   |   |-- list-staff.component.css
            |   |   |   |   |   |   |-- list-staff.component.html
            |   |   |   |   |   |   |-- list-staff.component.spec.ts
            |   |   |   |   |   |   |-- list-staff.component.ts
            
            |   |   |   |   |   |-- new-staff
            |   |   |   |   |   |   |-- new-staff.component.css
            |   |   |   |   |   |   |-- new-staff.component.html
            |   |   |   |   |   |   |-- new-staff.component.spec.ts
            |   |   |   |   |   |   |-- new-staff.component.ts
            |   |   |   |   |   |-- staff-modal
            |   |   |   |   |   |   |-- staff-modal.component.css
            |   |   |   |   |   |   |-- staff-modal.component.html
            |   |   |   |   |   |   |-- staff-modal.component.spec.ts
            |   |   |   |   |   |   |-- staff-modal.component.ts
            
            |   |   |   |   |   |-- staff-profile
            |   |   |   |   |   |   |-- staff-profile.component.css
            |   |   |   |   |   |   |-- staff-profile.component.html
            |   |   |   |   |   |   |-- staff-profile.component.spec.ts
            |   |   |   |   |   |   |-- staff-profile.component.ts
            
     |   |   |   |-- data
            |   |   |   |   |-- AccountStatus.ts
            |   |   |   |   |-- AccountTypeStatusList.ts
            |   |   |   |   |-- AgentDTO.ts
            |   |   |   |   |-- ClientDTO.ts
            |   |   |   |   |-- ServiceProviderDTO.ts
            |   |   |   |   |-- StaffDto.ts
            |   |   |   |   |-- TabElements.ts
            |   |   |   |   |-- UpdateAccountStatusDto.ts
            |   |   |   |   |-- accountDTO.ts
            |   |   |   |   |-- entity-details-data.ts
            |   |   |   |   |-- entityDto.ts
            
            |   |   |   |   |-- enums
                |   |   |   |   |   |-- AccountType.ts
                |   |   |   |   |   |-- Status.ts
                |   |   |   |   |-- partyTypeDto.ts
                
     |   |   |   |-- entities-routing.module.ts
     |   |   |   |-- entities.module.ts
       
     |   |   |   |-- services
            |   |   |   |   |-- account-status
              |   |   |   |   |   |-- account-status.service.spec.ts
              |   |   |   |   |   |-- account-status.service.ts
              
            |   |   |   |   |-- account
              |   |   |   |   |   |-- account.service.spec.ts
              |   |   |   |   |   |-- account.service.ts
                
            |   |   |   |   |-- client
              |   |   |   |   |   |-- client.service.spec.ts
              |   |   |   |   |   |-- client.service.ts
              
            |   |   |   |   |-- entity
              |   |   |   |   |   |-- entity.service.spec.ts
              |   |   |   |   |   |-- entity.service.ts
              
            |   |   |   |   |-- intermediary
              |   |   |   |   |   |-- intermediary.service.spec.ts
              |   |   |   |   |   |-- intermediary.service.ts
              
            |   |   |   |   |-- service-provider
              |   |   |   |   |   |-- service-provider.service.spec.ts
              |   |   |   |   |   |-- service-provider.service.ts
                
            |   |   |   |   |-- staff
              |   |   |   |   |   |-- staff.service.spec.ts
              |   |   |   |   |   |-- staff.service.ts            
  ```
</details>

## Imports

The EntitiesModule imports the following modules:

- _CommonModule_: The module that provides common Angular directives and pipes, such as ngIf, ngFor, etc.
- _ReactiveFormsModule_: The module that provides reactive forms functionality, such as FormGroup, FormControl, Validators, etc.
- _SharedModule_: The module that provides common components and services that are used throughout the application.
- _EntitiesRoutingModule_: The module that provides the routing functionality for the entities module.
- _TabViewModule_: The primeng library module that provides the tab view functionality for the entities module.
- _DropdownModule_: The primeng library module that provides the dropdown functionality for the entities module.
- _InputTextModule_: The primeng library module that provides the input text functionality for the entities module.
- _StepsModule_: The primeng library module that provides the steps functionality for the entities module.
- _TableModule_: The primeng library module that provides the table functionality for the entities module.





