import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntitiesRoutingModule } from './entities-routing.module';
import { NewClientComponent } from './components/client/new-client/new-client.component';
import { ListClientComponent } from './components/client/list-client/list-client.component';
import { NewEntityComponent } from './components/entity/new-entity/new-entity.component';
import { ListEntityComponent } from './components/entity/list-entity/list-entity.component';
import { NewIntermediaryComponent } from './components/intermediary/new-intermediary/new-intermediary.component';
import { ListIntermediaryComponent } from './components/intermediary/list-intermediary/list-intermediary.component';
import { NewServiceProviderComponent } from './components/service-provider/new-service-provider/new-service-provider.component';
import { ListServiceProviderComponent } from './components/service-provider/list-service-provider/list-service-provider.component';
import { NewStaffComponent } from './components/staff/new-staff/new-staff.component';
import { ListStaffComponent } from './components/staff/list-staff/list-staff.component';
import { EditComponent } from './components/edit/edit.component';
import { ViewEntityComponent } from './components/entity/view-entity/view-entity.component';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { StaffProfileComponent } from './components/staff/staff-profile/staff-profile.component';
import { AssignAppsComponent } from './components/staff/assign-apps/assign-apps.component';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { RelatedAccountsComponent } from './components/entity/related-accounts/related-accounts.component';
import { SelectStatusComponent } from './components/entity/select-status/select-status.component';
import { StaffModalComponent } from './components/staff/staff-modal/staff-modal.component';
import { EntityBasicInfoComponent } from './components/entity/view-entity/entity-basic-info/entity-basic-info.component';
import { EntityOtherDetailsComponent } from './components/entity/view-entity/entity-other-details/entity-other-details.component';
import { EntityTransactionsComponent } from './components/entity/view-entity/entity-transactions/entity-transactions.component';
import { EditBankFormComponent } from './components/entity/view-entity/entity-other-details/edit-bank-form/edit-bank-form.component';
import { EditWealthFormComponent } from './components/entity/view-entity/entity-other-details/edit-wealth-form/edit-wealth-form.component';
import { EditAmlFormComponent } from './components/entity/view-entity/entity-other-details/edit-aml-form/edit-aml-form.component';
import { EditNokFormComponent } from './components/entity/view-entity/entity-other-details/edit-nok-form/edit-nok-form.component';
import { ListLeadComponent } from './components/lead/list-lead/list-lead.component';
import { NewLeadComponent } from './components/lead/new-lead/new-lead.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditPrimaryFormComponent } from './components/entity/view-entity/entity-other-details/edit-primary-form/edit-primary-form.component';
import { EditContactFormComponent } from './components/entity/view-entity/entity-other-details/edit-contact-form/edit-contact-form.component';
import { EditResidentialFormComponent } from './components/entity/view-entity/entity-other-details/edit-residential-form/edit-residential-form.component';
import { EditOrganizationFormComponent } from './components/entity/view-entity/entity-other-details/edit-organization-form/edit-organization-form.component';
import { EditOtherDetailsFormComponent } from './components/entity/view-entity/entity-other-details/edit-other-details-form/edit-other-details-form.component';
import { EditCommentFormComponent } from './components/entity/view-entity/entity-other-details/edit-comment-form/edit-comment-form.component';
import { EditActivityFormComponent } from './components/entity/view-entity/entity-other-details/edit-activity-form/edit-activity-form.component';
import { EditLeadContactFormComponent } from './components/entity/view-entity/entity-other-details/edit-lead-contact-form/edit-lead-contact-form.component';
import { EntityDocsComponent } from './components/entity/view-entity/entity-docs/entity-docs.component';
@NgModule({
  declarations: [
    NewClientComponent,
    ListClientComponent,
    NewEntityComponent,
    ListEntityComponent,
    NewIntermediaryComponent,
    ListIntermediaryComponent,
    NewServiceProviderComponent,
    ListServiceProviderComponent,
    NewStaffComponent,
    ListStaffComponent,
    EditComponent,
    ViewEntityComponent,
    StaffProfileComponent,
    AssignAppsComponent,
    RelatedAccountsComponent,
    SelectStatusComponent,
    StaffModalComponent,
    EntityBasicInfoComponent,
    EntityOtherDetailsComponent,
    EntityTransactionsComponent,
    EditBankFormComponent,
    EditWealthFormComponent,
    EditAmlFormComponent,
    EditNokFormComponent,
    ListLeadComponent,
    NewLeadComponent,
    EditPrimaryFormComponent,
    EditContactFormComponent,
    EditResidentialFormComponent,
    EditOrganizationFormComponent,
    EditOtherDetailsFormComponent,
    EditCommentFormComponent,
    EditActivityFormComponent,
    EditLeadContactFormComponent,
    EntityDocsComponent,
  ],
  imports: [
    CommonModule,
    EntitiesRoutingModule,
    TabViewModule,
    InputTextModule,
    ReactiveFormsModule,
    SharedModule,
    DropdownModule,
    MultiSelectModule,
    StepsModule,
    TableModule,
    FormsModule,
  ],
  exports: [StaffModalComponent],
  providers: [DatePipe],
})
export class EntitiesModule {}
