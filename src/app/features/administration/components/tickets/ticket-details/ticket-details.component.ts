import { Component, OnInit } from '@angular/core';
import { EntityDetails } from 'src/app/features/entities/data/entity-details-data';
import { DynamicFormButtons } from 'src/app/shared/utils/dynamic.form.button';
import { DynamicFormFields } from 'src/app/shared/utils/dynamic.form.fields';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {

  fieldsets: DynamicFormFields[];
  stepsData: DynamicFormFields[];
  buttonConfig: DynamicFormButtons;
  modalVisible: boolean;
  constructor( private entityDetails: EntityDetails) {}
  ngOnInit(): void {
    this.fieldsets = this.entityDetails.entityDetails();
    this.buttonConfig = this.entityDetails.actionButtonConfig();  }

  toggleModal(visible: boolean) {
    this.modalVisible = visible;
  }

  openModal() {
    this.toggleModal(true);
  }

  submitForm(data:any){
    console.log("submitted Form :", data);
  }

  changeModal(event: any) {
    console.log(event);
    this.toggleModal(false); // Close the modal after performing the action
  }

}
