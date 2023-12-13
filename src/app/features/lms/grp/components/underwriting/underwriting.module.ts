import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { EndorsementComponent } from './components/endorsement/endorsement.component';
import { SummaryComponent } from './components/summary/summary.component';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UnderwritingRoutingModule } from './underwriting-routing.module';


@NgModule({
  declarations: [
    UnderwritingComponent,
    EndorsementComponent,
    SummaryComponent
  ],
  imports: [
    CommonModule,
    UnderwritingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule
  ]
})
export class UnderwritingModule { }
