import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { CampaignDefinitionComponent } from './components/campaigns/campaign-definition/campaign-definition.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { ClientAttributesComponent } from './components/campaigns/client-attributes/client-attributes.component';
import { ProductAttributesComponent } from './components/campaigns/product-attributes/product-attributes.component';
import { ActivitiesComponent } from './components/activity-management/activities/activities.component';
import { ActivityTypesComponent } from './components/activity-management/activity-types/activity-types.component';
import { PriorityLevelsActivityStatusComponent } from './components/activity-management/priority-levels-activity-status/priority-levels-activity-status.component';
import { LeadSourcesStatusesComponent } from './components/lead-sources-statuses/lead-sources-statuses.component';
import {RequestStatusComponent} from "./components/service-desk/request-status/request-status.component";
import {RequestCategoriesComponent} from "./components/service-desk/request-categories/request-categories.component";
import {RequestTrackingComponent} from "./components/service-desk/request-tracking/request-tracking.component";
import {ServiceDeskComponent} from "./components/service-desk/service-desk.component";
/*import {
  ServiceDeskDetailsComponent
} from "./components/service-desk/service-desk-details/service-desk-details.component";*/

const routes: Routes = [
  {
    path: '',
    component: BaseCrmComponent,
  },
  {
    path: 'country',
    component: CountryComponent,
  },
  {
    path: 'organization',
    component: OrganizationComponent,
  },
  {
    path: 'disivion',
    component: DivisionComponent,
  },
  {
    path: 'region',
    component: RegionComponent,
  },
  {
    path: 'branch',
    component: BranchComponent,
  },
  {
    path: 'user-parameters',
    component: UserParametersComponent,
  },
  {
    path: 'currencies',
    component: CurrenciesComponent,
  },
  {
    path: 'bank',
    component: BankComponent,
  },
  {
    path: 'payment-modes',
    component: PaymentModesComponent,
  },
  {
    path: 'required-documents',
    component: RequiredDocumentsComponent,
  },
  {
    path: 'channel',
    component: ChannelComponent,
  },
  {
    path: 'service-provider-types',
    component: ServiceProviderTypesComponent,
  },
  {
    path: 'sectors-occupations',
    component: SectorOccupationComponent,
  },
  {
    path: 'client-type',
    component: ClientTypeComponent,
  },
  {
    path: 'agencies',
    component: AgencyComponent,
  },
  {
    path: 'messaging-template',
    component: MessagingTemplateComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
  },
  {
    path: 'system-roles',
    component: SystemRolesComponent,
  },
  {
    path: 'campaigns',
    component: CampaignsComponent,
  },
  {
    path: 'campaign-definition',
    component: CampaignDefinitionComponent,
  },
  {
    path: 'scheduler',
    component: SchedulerComponent,
  },
  {
    path: 'client-attributes',
    component: ClientAttributesComponent,
  },
  {
    path: 'product-attributes',
    component: ProductAttributesComponent,
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
  },
  {
    path: 'activity-types',
    component: ActivityTypesComponent,
  },
  {
    path: 'priority-level-activity-status',
    component: PriorityLevelsActivityStatusComponent,
  },
  {
    path: 'lead-sources-statuses',
    component: LeadSourcesStatusesComponent,
  },
  {
    path: 'request-status',
    component: RequestStatusComponent,
  },
  {
    path: 'request-categories',
    component: RequestCategoriesComponent,
  },
  {
    path: 'request-tracking',
    component: RequestTrackingComponent,
  },
  {
    path: 'service-desk',
    component: ServiceDeskComponent,
  },
  /*{
    path: 'service-desk-details',
    component: ServiceDeskDetailsComponent,
  },*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrmRoutingModule {}
