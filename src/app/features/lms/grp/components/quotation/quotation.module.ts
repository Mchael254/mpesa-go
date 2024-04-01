import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { QuickComponent } from './components/quick/quick.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CoverageDetailsComponent } from './components/coverage-details/coverage-details.component';
import { TableModule } from 'primeng/table';
import { SummaryComponent } from './components/summary/summary.component';
// import { StepperComponent } from './components/stepper/stepper.component';
import { CheckboxModule } from 'primeng/checkbox';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientCreationComponent } from './components/client-creation/client-creation.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    QuickComponent,
    CoverageDetailsComponent,
    SummaryComponent,
    ClientCreationComponent,
    // StepperComponent
  ],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    CheckboxModule,
    NgxSpinnerModule,
    MultiSelectModule,
    ProgressBarModule,
    RadioButtonModule,
    SharedModule,
    OverlayPanelModule,
    ConfirmDialogModule,
  ]
})
export class QuotationModule { }
