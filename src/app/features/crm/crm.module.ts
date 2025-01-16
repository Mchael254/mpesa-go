import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { ListboxModule } from 'primeng/listbox';

import { CrmRoutingModule } from './crm-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CountryComponent } from './components/country/country.component';
import { BaseCrmComponent } from './components/base-crm/base-crm.component';
import { OrganizationComponent } from './components/organization/organization.component';
import { DivisionComponent } from './components/division/division.component';
import { RegionComponent } from './components/region/region.component';
import { BranchComponent } from './components/branch/branch.component';
import { UserParametersComponent } from './components/user-parameters/user-parameters.component';
import { CurrenciesComponent } from './components/currencies/currencies.component';
import { BankComponent } from './components/bank/bank.component';
import { PaymentModesComponent } from './components/payment-modes/payment-modes.component';
import { RequiredDocumentsComponent } from './components/required-documents/required-documents.component';
import { ChannelComponent } from './components/channel/channel.component';
import { ServiceProviderTypesComponent } from './components/service-provider-types/service-provider-types.component';
import { SectorOccupationComponent } from './components/sector-occupation/sector-occupation.component';
import { ClientTypeComponent } from './components/client-type/client-type.component';
import { AgencyComponent } from './components/agency/agency.component';
import { MessagingTemplateComponent } from './components/messaging-template/messaging-template.component';
import { MessagesComponent } from './components/messages/messages.component';
import { SystemRolesComponent } from './components/system-roles/system-roles.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { CampaignDefinitionComponent } from './components/campaigns/campaign-definition/campaign-definition.component';
import { CampaignAnalyticsComponent } from './components/campaigns/campaign-analytics/campaign-analytics.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { ClientAttributesComponent } from './components/campaigns/client-attributes/client-attributes.component';
import { ProductAttributesComponent } from './components/campaigns/product-attributes/product-attributes.component';
import { ActivitiesComponent } from './components/activity-management/activities/activities.component';
import { EntitiesModule } from '../entities/entities.module';
import { ActivityTypesComponent } from './components/activity-management/activity-types/activity-types.component';
import { PriorityLevelsActivityStatusComponent } from './components/activity-management/priority-levels-activity-status/priority-levels-activity-status.component';
import { LeadSourcesStatusesComponent } from './components/lead-sources-statuses/lead-sources-statuses.component';
import { RequestStatusComponent } from './components/service-desk/request-status/request-status.component';
import { RequestCategoriesComponent } from './components/service-desk/request-categories/request-categories.component';
import { RequestTrackingComponent } from './components/service-desk/request-tracking/request-tracking.component';
import {ServiceDeskComponent} from "./components/service-desk/service-desk.component";
import {
  ServiceDeskDetailsComponent
} from "./components/service-desk/service-desk-details/service-desk-details.component";
import { HierarchyComponent } from './components/hierarchy/hierarchy.component';
import { RequestReportComponent } from './components/service-desk/request-report/request-report.component';
import { ProspectsComponent } from './components/activity-management/prospects/prospects.component';

@NgModule({
  declarations: [
    CountryComponent,
    BaseCrmComponent,
    OrganizationComponent,
    DivisionComponent,
    RegionComponent,
    BranchComponent,
    UserParametersComponent,
    CurrenciesComponent,
    BankComponent,
    PaymentModesComponent,
    RequiredDocumentsComponent,
    ChannelComponent,
    ServiceProviderTypesComponent,
    SectorOccupationComponent,
    ClientTypeComponent,
    AgencyComponent,
    MessagingTemplateComponent,
    MessagesComponent,
    SystemRolesComponent,
    CampaignsComponent,
    CampaignDefinitionComponent,
    CampaignAnalyticsComponent,
    SchedulerComponent,
    ClientAttributesComponent,
    ProductAttributesComponent,
    ActivitiesComponent,
    ActivityTypesComponent,
    PriorityLevelsActivityStatusComponent,
    LeadSourcesStatusesComponent,
    RequestStatusComponent,
    RequestCategoriesComponent,
    RequestTrackingComponent,
    ServiceDeskComponent,
    ServiceDeskDetailsComponent,
    HierarchyComponent,
    RequestReportComponent,
    ProspectsComponent,
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    ListboxModule,
    TooltipModule,
    DialogModule,
    TabViewModule,
    SharedModule,
    ScrollPanelModule,
    EntitiesModule,
  ],
  providers: [DatePipe],
})
export class CrmModule {}
