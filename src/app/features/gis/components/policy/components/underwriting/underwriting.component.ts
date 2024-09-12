import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {Logger, untilDestroyed} from '../../../../../../shared/shared.module'

const log = new Logger("UnderwritingComponent");

@Component({
  selector: 'app-underwriting',
  templateUrl: './underwriting.component.html',
  styleUrls: ['./underwriting.component.css']
})
export class UnderwritingComponent {
  selectedOption: string = 'new-business';
  newBusinessForm: FormGroup;


  constructor(
    public fb: FormBuilder,
    private router: Router,

  ) { }

  ngOnInit() {
    this.createNewBusinessForm();
  }

  createNewBusinessForm() {
    this.newBusinessForm = this.fb.group({
      isClientNew: ['', Validators.required],
      isPolicyShortPeriod: [''],
      isPolicyRenewable: ['']
    });
  }

    onNextClick() {
      if (this.selectedOption === 'new-business') {
        console.log("Is it a new Client?", this.newBusinessForm.get('isClientNew').value);
    
        const isNewClient: boolean = this.newBusinessForm.get('isClientNew').value;
        console.log("isNewClient:", isNewClient);
    
        if (isNewClient === true) {
          console.log("Navigating to entity page");
    
          // Constructing the route using array of route segments
          const timestamp = new Date().getTime(); // Get current timestamp
          const queryParams = { entityType: 'Client', timestamp: timestamp };
    
          console.log("Time Stamp", timestamp);
          console.log("Query Parameters", queryParams);
          
          const timestampString = JSON.stringify(timestamp);
          sessionStorage.setItem('Timestamp', timestampString);
          console.log("Passed Time Stamp(GIS)", timestampString);
          sessionStorage.setItem('selectedTransactionType', this.selectedOption);

          this.router.navigate(['/home/entity/new'], { queryParams: queryParams }).then(r => {
            // Check for errors during navigation
            if (!r) {
              console.error("Error navigating to new client page");
            }
          });
        } else {
          console.log("Navigating to products page");
          this.router.navigate(['/home/gis/policy/policy-product']);
          sessionStorage.setItem('selectedTransactionType', this.selectedOption);

        }
      } else {
        // Handle other transaction types
      }
  }
  onCancelClick(){
    this.router.navigate(['/home/lms/policy/list']);

  }
  
  
  

}
