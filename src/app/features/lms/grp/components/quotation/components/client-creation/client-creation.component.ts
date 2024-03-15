import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { MessageService, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from 'src/app/shared/services/setups/country/country.service';
import { CountryDto, StateDto, TownDto } from 'src/app/shared/data/common/countryDto';
import { map, of, switchMap } from 'rxjs';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { ClientDTO, ClientTypeDTO } from 'src/app/features/entities/data/ClientDTO';
import { Dropdown } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-client-creation',
  templateUrl: './client-creation.component.html',
  styleUrls: ['./client-creation.component.css']
})
export class ClientCreationComponent implements OnInit, OnDestroy {
  steps = stepData;
  columnOptions: SelectItem[];
  selectedColumns: string[];
  clientDetailsForm: FormGroup;
  adminDetailsForm: FormGroup;
  countryList: CountryDto[];
  currencyList: any[];
  stateList: StateDto[] = [];
  townList: TownDto[] = [];
  clientList: { label: string, value: number }[] = [];
  clientId: number;
  OrganizationClientType: ClientTypeDTO[];
  clientCode: number;
  patchedClientId: number

  @ViewChild('clientDropdown') clientDropdown: Dropdown;

  constructor(
    private fb: FormBuilder,
    private country_service: CountryService,
    private client_service: ClientService,
    private router: Router,
    private spinner_Service: NgxSpinnerService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.clientCreationForm();
    this.adminCreationForm();
    this.getCountryList();
    this.searchClient();
    this.getClientList();
    this.clientTypeChanges();
    this.getClntTypes();
  }

  ngOnDestroy(): void {
    
  }

  // dummy data for administrator details table
  data = [
    { 
        name: 'John Doe',
        dob: '1990-05-15',
        idNumber: '123456789',
        position: 'Manager',
        address: '123 Main St, Cityville',
        contact: '+1234567890',
        email: 'john.doe@example.com',
        fromDate: '2023-01-01',
        toDate: '2023-12-31'
    },
    { 
        name: 'Jane Smith',
        dob: '1985-08-25',
        idNumber: '987654321',
        position: 'Developer',
        address: '456 Elm St, Townsville',
        contact: '+9876543210',
        email: 'jane.smith@example.com',
        fromDate: '2022-07-01',
        toDate: '2023-06-30'
    },
    { 
        name: 'Alice Johnson',
        dob: '1978-03-10',
        idNumber: '456123789',
        position: 'Sales Representative',
        address: '789 Oak St, Villageton',
        contact: '+4561237890',
        email: 'alice.johnson@example.com',
        fromDate: '2022-09-15',
        toDate: '2023-09-14'
    },
    { 
        name: 'Bob Williams',
        dob: '1995-11-30',
        idNumber: '789456123',
        position: 'Accountant',
        address: '321 Pine St, Hamletville',
        contact: '+7894561230',
        email: 'bob.williams@example.com',
        fromDate: '2023-03-01',
        toDate: '2024-02-29'
    },
    { 
        name: 'Emily Brown',
        dob: '1980-02-20',
        idNumber: '321654987',
        position: 'HR Manager',
        address: '654 Cedar St, Countryside',
        contact: '+3216549870',
        email: 'emily.brown@example.com',
        fromDate: '2022-12-01',
        toDate: '2023-11-30'
    },
    { 
        name: 'Michael Davis',
        dob: '1992-07-05',
        idNumber: '987123654',
        position: 'IT Specialist',
        address: '987 Maple St, Riverside',
        contact: '+9871236540',
        email: 'michael.davis@example.com',
        fromDate: '2023-02-15',
        toDate: '2024-02-14'
    },
    { 
        name: 'Sophia Wilson',
        dob: '1987-09-18',
        idNumber: '654789321',
        position: 'Marketing Manager',
        address: '147 Birch St, Lakeside',
        contact: '+6547893210',
        email: 'sophia.wilson@example.com',
        fromDate: '2023-05-01',
        toDate: '2024-04-30'
    },
    { 
        name: 'David Martinez',
        dob: '1975-01-08',
        idNumber: '987321654',
        position: 'CEO',
        address: '369 Walnut St, Hillside',
        contact: '+9873216540',
        email: 'david.martinez@example.com',
        fromDate: '2023-01-01',
        toDate: '2024-12-31'
    }
]

clientCreationForm() {
  this.clientDetailsForm = this.fb.group({
    clientType: [""],
    clientName: ["", Validators.required],
    status: ["", Validators.required],
    type: ["", Validators.required],
    incorporationDate: ["", Validators.required],
    registrationNumber: ["", Validators.required],
    occupation: ["", Validators.required],
    pinNumber: ["", Validators.required],
    phoneNumber: ["", Validators.required],
    email: ["", Validators.required],
    address: ["", Validators.required],
    country: ["", Validators.required],
    county: ["", Validators.required],
    city: ["", Validators.required],
    affiliatedToInsurer: [""],
    representation: ["", Validators.required],
  })
}

adminCreationForm() {
  this.adminDetailsForm = this.fb.group({
    name: ["", Validators.required],
    position: ["", Validators.required],
    gender: ["", Validators.required],
    dob: ["", Validators.required],
    identificationType: ["", Validators.required],
    IdentificationNumber: ["", Validators.required],
    address: [""],
    phoneNumber: ["", Validators.required],
    email: ["", Validators.required],
    wef: ["", Validators.required],
    wet: [""],
  })
}

showAdminDetailsModal() {
  const modal = document.getElementById('adminDetailsModal');
  if (modal) {
    modal.classList.add('show');
    modal.style.display = 'block';
  }

}

closeAdminDetailsModal() {
  const modal = document.getElementById('adminDetailsModal');
  if (modal) {
    modal.classList.remove('show')
    modal.style.display = 'none';
  }
}

// Helps enable or disbale phone number and email fields based on client type chosen
clientTypeChanges() {
  this.clientDetailsForm.get('clientType').valueChanges.subscribe((value: string) => {
    const emailControl = this.clientDetailsForm.get('email');
    const phoneControl = this.clientDetailsForm.get('phoneNumber');
    if (value === 'existingClient') {
      emailControl.disable();
      phoneControl.disable();
    } else {
      emailControl.enable();
      phoneControl.enable();
    }
  });
}

capitalizeFirstLetterOfEachWord(str) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

// Function to patch data into the clientDetailsForm
patchClientData(client: ClientDTO) {
  this.clientDetailsForm.patchValue({
    clientName: `${client.firstName} ${client.lastName}`,
    status: client.status,
    type: client.clientType.code,
    incorporationDate: client.withEffectFromDate,
    registrationNumber: client.idNumber,
    occupation: client.physicalAddress,
    pinNumber: client.pinNumber,
    phoneNumber: client.phoneNumber,
    email: client.emailAddress,
    address: client.physicalAddress,
    country: client.country,
    county: client.country,
    city: client.country,
    affiliatedToInsurer: client.country,
    representation: client.country,
  });
  this.patchedClientId = client.id
  console.log("IdOfPAtched", this.patchedClientId)
}

/* Method to show searched clients names in dropdown 
that match typed letters in existing client search field. 
It oauto opens dropdown
*/
openDropdown() {
  if (this.clientDropdown) {
    this.clientDropdown.overlayVisible = true;
  }
}

// Method to clear all other form fields when selected client is removed
onDropdownClear() {
  Object.keys(this.clientDetailsForm.controls).forEach(controlName => {
    if (controlName !== 'clientType') {
      this.clientDetailsForm.get(controlName).reset();
      this.getClientList();
    }
  });
}


searchClient() {
  this.clientDetailsForm.get('clientName').valueChanges.pipe(debounceTime(900), distinctUntilChanged())
  .subscribe((clientTyped) => {
    this.clientId = clientTyped.value;
    
    console.log("clientSelectedID", this.clientId)
    if(this.clientId !== null || this.clientId !== undefined) {
      this.getClientById(this.clientId);
    }

    if(clientTyped.length > 0) {
      this.client_service.searchClients(0, 10, clientTyped).subscribe((data: Pagination<ClientDTO>) => {
        this.clientList = data.content.map(client =>({
          label: this.capitalizeFirstLetterOfEachWord(
            `${client.firstName} ${client.lastName ? client.lastName : ''}  - ${client.emailAddress}`),
          value: client.id
        }));
        this.openDropdown();
      })
    }
    else {
      this.getClientList();
    }
  });
}


getClientList() {
  this.client_service.getClients().subscribe((data: Pagination<ClientDTO>) => {
    console.log("clients", data)
    this.clientList = data.content.map(client => ({
      label: this.capitalizeFirstLetterOfEachWord(`${client.firstName} ${client.lastName}`),
      value: client.id
    }));
  });
}

getClientById(clientId){
    this.client_service.getClientById(this.clientId).subscribe(data =>{
      console.log("searchedByClientId", data)
      this.patchClientData(data);
    },
    err => {
      console.log(err);
    })
}


private returnLowerCase(data: any) {
  let mapData = data.map((da: any) => {
    da['name'] = da['name'].toLowerCase();
    return da;
  });
  return mapData;
}


getCountryList() {
  this.country_service
    .getCountries()
    .pipe(
      map((data) => {
        return this.returnLowerCase(data);
      })
    )
    .subscribe((data: any[]) => {
      this.countryList = data;
      console.log("countryList", this.countryList)
      this.currencyList = this.countryList.filter(
        (data) => data?.currency?.name !== null
      );
    });
}

selectCountry(_event: any) {
  let e = +_event.target.value;
  of(e)
    .pipe(
      switchMap((data: number) => {
        return this.country_service.getMainCityStatesByCountry(data);
      })
    )
    .subscribe((data) => {
      this.stateList = data;
      this.townList = [];
    });
}

selectState(_event: any) {
  let e = +_event.target.value;
  of(e)
    .pipe(
      switchMap((data: number) => {
        return this.country_service.getTownsByMainCityState(data);
      })
    )
    .subscribe((data) => {
      this.townList = data;
    });
}

getClntTypes() {
  this.client_service.getClientType('').subscribe((clntType: ClientTypeDTO[]) => {
console.log("clntType", clntType)
this.OrganizationClientType = clntType;
  })
}

// highlights a touched/clicked/dirtified field that is not filled or option not selected
highlightInvalid(field: string): boolean {
  const control = this.clientDetailsForm.get(field);
  return control.invalid && (control.dirty || control.touched);
}

  onContinue() {
    const formValues = this.clientDetailsForm.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailControl = this.clientDetailsForm.get('email');
    const emailValue = emailControl.value;

    const payload = {
      "id": null,
      "system": "LMS",
      "firstName": null,
      "lastName": formValues.clientName,
      "modeOfIdentityId": 1,
      "modeOfIdentity": "NATIONAL_ID",
      "modeOfIdentityNumber": formValues.registrationNumber,
      "gender": formValues.gender,
      "pinNumber": formValues.pinNumber,
      "clientTypeId": formValues.type,
      "shortDescription": null,
      "address": {
        "id": null,
        "box_number": null,
        "postal_code": "00100",
        "town_id": formValues.city,
        "state_id": formValues.county,
        "country_id": formValues.country,
        "physical_address": formValues.address,
        "residential_address": null,
        "road": null,
        "estate": null,
        "house_number": null,
        "is_utility_address": "N",
        "utility_address_proof": null,
        "fax": null,
        "zip": null,
        "phoneNumber": formValues.phoneNumber,
        "account": null
      },
      "passportNumber": null,
      "dateOfBirth": "1985-05-20",
      "effectiveDateFrom": "2024-03-01T08:00:00.000Z",
      "effectiveDateTo": "2024-03-01T08:00:00.000Z",
      "category": "I",
      "status": formValues.status,
      "branchId": 410,
      "branchName": null,
      "countryId": formValues.country,
      "townId": formValues.city,
      "stateId": formValues.county,
      "partyId": null,
      "organizationId": 2,
      "partyAccountId": null,
      "proposerCode": 0,
      "dateCreated": formValues.incorporationDate,
      "contactDetails": {
        "id": 0,
        "title": null,
        "receivedDocuments": "N",
        "emailAddress": formValues.email,
        "smsNumber": null,
        "phoneNumber": formValues.phoneNumber,
        "preferredChannel": "EMAIL",
        "account": null,
        "accountId": null
      }
    };

    if (this.clientDetailsForm.get('clientType').value === null || this.clientDetailsForm.get('clientType').value === ''
        || this.clientDetailsForm.get('clientType').value === undefined) {
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: 'Select New or Existing client'
          });
          return;
        }

    if (this.clientDetailsForm.get('clientType').value === 'existingClient') {
      console.log("updating Existing client")

      if (this.clientDetailsForm.get('clientName').value === null || this.clientDetailsForm.get('clientName').value === ''
        || this.clientDetailsForm.get('clientName').value === undefined) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Select Client to update'
          });
        return;
      } else {
        console.log("Client to updateID", this.patchedClientId)
        this.client_service.updateClient(this.patchedClientId, payload).subscribe((updateClnt) => {
          console.log("client successfully updated", updateClnt)
          // move activated router below here once the PUT method works.
        },
          (error) => {
            let errorMessage = 'Unknown error'; // Default message
            if (error.error && error.error.errors && error.error.errors.length > 0) {
              errorMessage = error.error.errors[0]; // Extract the first error message
            } else if (error.error && typeof error.error === 'string') {
              errorMessage = error.error; // If the error is a string, use it as the message
            }
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMessage
            });
          });

          // to be moved after update method above is fixed
          this.router.navigate(['/home/lms/grp/quotation/quick'], {
            queryParams: {
              clientCode: this.patchedClientId,
            },
          });

      }
    } else {

      if (this.clientDetailsForm.invalid) {

        /*
        together with the method -highlightInvalid(field: string), it helps 
         highlight all invalid form fields on click of Continue button 
         */
        Object.keys(this.clientDetailsForm.controls).forEach(field => {
          const control = this.clientDetailsForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });

        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Fill all the mandatory fields!'
        });
        return;
      } else if(emailValue && !emailPattern.test(emailValue)) {
        emailControl.setErrors({ 'invalidEmail': true });
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Email is invalid'
        });
        return;
      }

      else {

        this.client_service.save(payload).subscribe(
          (clientPayload) => {
            this.clientCode = clientPayload?.id;
            console.log("clientProposerCode", this.clientCode);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'New client successfully created'
            });
        
            this.router.navigate(['/home/lms/grp/quotation/quick'], {
              queryParams: {
                clientCode: this.clientCode,
              },
            });
          },
          (error) => {
            let errorMessage = 'Unknown error'; // Default message
            if (error.error && error.error.errors && error.error.errors.length > 0) {
              errorMessage = error.error.errors[0]; // Extract the first error message
            } else if (error.error && typeof error.error === 'string') {
              errorMessage = error.error; // If the error is a string, use it as the message
            }
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMessage
            });
          }
        );
        
      }

    }
  }

onSaveAdminDets() {
  const formValues = this.adminDetailsForm.value;
    console.log('AdminFormValues', formValues);

}


}
