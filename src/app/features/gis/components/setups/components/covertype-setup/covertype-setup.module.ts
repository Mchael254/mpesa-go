import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListboxModule} from "primeng/listbox";
import {NgxSpinnerModule} from "ngx-spinner";

import { CovertypeSetupRoutingModule } from './covertype-setup-routing.module';
import { SubClassSectionsAndCoverTypesComponent } from './sub-class-sections-and-cover-types-grouped/sub-class-sections-and-cover-types/sub-class-sections-and-cover-types.component';
import {SharedModule} from "../../../../../../shared/shared.module";
import { SubClassListingComponent } from './sub-class-sections-and-cover-types-grouped/sub-class-listing/sub-class-listing.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {PickListModule} from "primeng/picklist";
import {ButtonModule} from "primeng/button";
import { CoverComponent } from './cover/cover.component';
import { SectionComponent } from './section/section.component';


@NgModule({
  declarations: [
    CoverComponent,
    SectionComponent,
    SubClassSectionsAndCoverTypesComponent,
    SubClassListingComponent,
  ],
  imports: [
    CommonModule,
    CovertypeSetupRoutingModule,
    NgxSpinnerModule,
    ListboxModule,
    ReactiveFormsModule,
    CovertypeSetupRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    PickListModule,
    ButtonModule
  ]
})
export class CovertypeSetupModule { }
