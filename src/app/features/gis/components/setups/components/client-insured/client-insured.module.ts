import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientInsuredRoutingModule } from './client-insured-routing.module';
import { InterestedPartiesComponent } from './interested-parties/interested-parties.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRemarksComponent } from './client-remarks/client-remarks.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    InterestedPartiesComponent,
    ClientRemarksComponent
  ],
  imports: [
    CommonModule,
    ClientInsuredRoutingModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule

  ]
})
export class ClientInsuredModule { }
