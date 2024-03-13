import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicySummaryComponent } from './components/policy-summary/policy-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyListingComponent } from './components/policy-listing/policy-listing.component';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';


@NgModule({
  declarations: [
    PolicySummaryComponent,
    PolicyListingComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
    AccordionModule,
    MultiSelectModule,
  ],
  exports: [PolicyListingComponent]
})
export class PolicyModule { }
