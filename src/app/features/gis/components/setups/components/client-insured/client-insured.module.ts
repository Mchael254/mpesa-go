import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientInsuredRoutingModule } from './client-insured-routing.module';
import { InterestedPartiesComponent } from './interested-parties/interested-parties.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InterestedPartiesComponent
  ],
  imports: [
    CommonModule,
    ClientInsuredRoutingModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ClientInsuredModule { }
