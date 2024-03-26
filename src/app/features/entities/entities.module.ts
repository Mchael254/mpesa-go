import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

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
import {TabViewModule} from "primeng/tabview";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {DropdownModule} from "primeng/dropdown";
import { StaffProfileComponent } from './components/staff/staff-profile/staff-profile.component';
import { AssignAppsComponent } from './components/staff/assign-apps/assign-apps.component';
import {StepsModule} from "primeng/steps";
import {TableModule} from "primeng/table";


import { DatePipe } from '@angular/common';
import { RelatedAccountsComponent } from './components/entity/related-accounts/related-accounts.component';
import { SelectStatusComponent } from './components/entity/select-status/select-status.component';
import { StaffModalComponent } from './components/staff/staff-modal/staff-modal.component';
import { EntityBasicInfoComponent } from './components/entity/view-entity/entity-basic-info/entity-basic-info.component';
import { EntityOtherDetailsComponent } from './components/entity/view-entity/entity-other-details/entity-other-details.component';
import { EntityTransactionsComponent } from './components/entity/view-entity/entity-transactions/entity-transactions.component';
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
    ],
    imports: [
        CommonModule,
        EntitiesRoutingModule,
        TabViewModule,
        InputTextModule,
        ReactiveFormsModule,
        SharedModule,
        DropdownModule,
        StepsModule,
        TableModule,
        FormsModule
    ],
    exports: [
        StaffModalComponent
    ],
    providers: [DatePipe]
})
export class EntitiesModule { }
