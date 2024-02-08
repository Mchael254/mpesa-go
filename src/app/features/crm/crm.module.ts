import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

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
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    TooltipModule,
    DialogModule,
    SharedModule,
  ],
  providers: [DatePipe],
})
export class CrmModule {}
