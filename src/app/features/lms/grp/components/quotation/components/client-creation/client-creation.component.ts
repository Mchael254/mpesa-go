import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
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
import { AdministratorService } from '../../service/contact-person/administrator.service';
import { ContactPersonDTO } from '../../models/contactPerson/administratoDto';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { ClientTypeService } from 'src/app/shared/services/setups/client-type/client-type.service';
import { IdentityTypeDTO } from '../../models/IdentityTypes/IdentityTypeDTO';
import { OccupationDTO } from '../../models/coverTypes/coverTypesDto';
import { CoverageService } from '../../service/coverage/coverage.service';

@AutoUnsubscribe
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
  patchedClientId: number;
  organizationId: number;
  administratorDetails: ContactPersonDTO[];
  isEditMode: boolean = false;
  contactPersonCode: number;
  storedClientCode: number;
  createAdmin: boolean = false;
  identityType: IdentityTypeDTO[];
  modeOfIdentityId: number;
  modeOfIdentityName: string;
  modeOfIdentityFormat: string;
  modeOfIdentityErrorMessage: string;
  occupation: OccupationDTO[];
  maxDate: Date;
  over18Date: Date;

  @ViewChild('clientDropdown') clientDropdown: Dropdown;

  constructor(
    private fb: FormBuilder,
    private country_service: CountryService,
    private client_service: ClientService,
    private router: Router,
    private spinner_Service: NgxSpinnerService,
    private messageService: MessageService,
    private adminService: AdministratorService,
    private session_storage: SessionStorageService,
    private confirmationService: ConfirmationService,
    private clientType_service: ClientTypeService,
    private coverageService: CoverageService,
    
    
  ) {
    this.maxDate = new Date();
    const currentDate: Date = new Date();
    this.over18Date = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
  }

  ngOnInit(): void {
    this.clientCreationForm();
    this.adminCreationForm();
    this.getCountryList();
    this.searchClient();
    this.getClientList();
    this.clientTypeChanges();
    this.getClntTypes();
    this.getAdministratorDetails();
    this.adminDetsTableColumns();
    this.getIdentifierTypeList();
    this.getOccupations();
    this.retrievClientDets();
  }

  ngOnDestroy(): void {
    
  }

clientCreationForm() {
  this.clientDetailsForm = this.fb.group({
    clientType: [""],
    clientName: ["", Validators.required],
    status: ["", Validators.required],
    type: [27, Validators.required],
    incorporationDate: ["", Validators.required],
    modeOfIdentity: ["", Validators.required],
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

  this.isEditMode = false
  this.adminDetailsForm.reset();
}

  adminDetsTableColumns() {
    this.columnOptions = [
      { label: 'Name', value: 'contact_person_name' },
      { label: 'Date of birth', value: 'date_of_birth' },
      { label: 'ID number', value: 'identification_number' },
      { label: 'Position', value: 'position' },
      { label: 'Physical address', value: 'contact_person_physical_address' },
      { label: 'Contact', value: 'phone_number' },
      { label: 'Email', value: 'contact_person_email' },
      { label: 'With effect from', value: 'wef' },
      { label: 'With effect to', value: 'wet' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

// Helps enable or disbale phone number and email fields based on client type chosen
clientTypeChanges() {
  this.clientDetailsForm.get('clientType').valueChanges.subscribe((value: string) => {
    const emailControl = this.clientDetailsForm.get('email');
    const phoneControl = this.clientDetailsForm.get('phoneNumber');
    if (value === 'existingClient') {
      emailControl.disable();
      phoneControl.disable();
      Object.keys(this.clientDetailsForm.controls).forEach(controlName => {
        if (controlName !== 'clientType' && controlName !== 'type') {
          this.clientDetailsForm.get(controlName).reset();
        }
      });
      this.getClientList();
    } else {

      /*...Clears admin table when new client option is selected.
      New client does not have administrators yet.
      */
      this.administratorDetails = [];


      /*...Ensures clientType selected(Which is New Client) do not get cleared when
      resetting the form, because they are part of the clientDetailsForm.
      */
      Object.keys(this.clientDetailsForm.controls).forEach(controlName => {
        if (controlName !== 'clientType' && controlName !== 'type') {
          this.clientDetailsForm.get(controlName).reset();
        }
      });
      emailControl.enable();
      phoneControl.enable();
    }
  });
}

capitalizeFirstLetterOfEachWord(str) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

/* Function to patch data into the clientDetailsForm 
when existing client is selected.*/
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
    modeOfIdentity: client.modeOfIdentity,
  });
  this.patchedClientId = client.id
  this.storedClientCode = this.patchedClientId;
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
      this.administratorDetails = [];//removes admin details associated with cleared client.
    }
  });
}


searchClient() {
  this.clientDetailsForm.get('clientName').valueChanges.pipe(debounceTime(900), distinctUntilChanged())
  .subscribe((clientTyped) => {
    this.clientId = clientTyped.value;
    
    console.log("clientSelectedID", this.clientId)

    /*...Help get selected client's details.
    These detailes are what is patched to all other fields.
      */
    if(this.clientId !== null || this.clientId !== undefined) {
      this.getClientById(this.clientId);
    }

      /*...Fetches admin details for every client 
      whenever a client is selected.
      */
    if(this.storedClientCode !== null || this.storedClientCode !== undefined) {
      this.getAdministratorDetails();
    }

    // if(clientTyped.length > 0) {
    //   this.client_service.searchClients(0, 10, clientTyped).subscribe((data: Pagination<ClientDTO>) => {
    //     this.clientList = data.content.map(client =>({
    //       label: this.capitalizeFirstLetterOfEachWord(
    //         `${client.firstName} ${client.lastName ? client.lastName : ''}  - ${client.emailAddress}`),
    //       value: client.id
    //     }));
    //     this.openDropdown();
    //   })
    // }
    if (clientTyped.length > 0) {
      this.client_service.searchClients(0, 10, clientTyped).subscribe((data: Pagination<ClientDTO>) => {
        this.clientList = data.content.map(client => {
          let fullName = client.firstName ? client.firstName.trim() : '';
          if (fullName.toLowerCase().includes('null')) {
            fullName = fullName.replace(/null/gi, '').trim();
          }
          const lastName = client.lastName ? client.lastName.trim() : '';
          return {
            label: this.capitalizeFirstLetterOfEachWord(`${fullName} ${lastName ? lastName : ''}  - ${client.emailAddress}`),
            value: client.id
          };
        });
        this.openDropdown();
      });
    }    
    else {
      this.getClientList();
    }
  });
}


/**Gets a list of five clients that is displayed by default.
 The rest are obtained by searching.
*/
// getClientList() {
//   this.client_service.getClients().subscribe((data: Pagination<ClientDTO>) => {
//     console.log("clients", data)
//     this.clientList = data.content.map(client => ({
//       label: this.capitalizeFirstLetterOfEachWord(`${client.firstName} ${client.lastName}`),
//       value: client.id
//     }));
//   });
// }
getClientList() {
  this.client_service.getClients().subscribe((data: Pagination<ClientDTO>) => {
    console.log("clients", data);
    this.clientList = data.content.map(client => {
      let fullName = client.firstName ? client.firstName.trim() : '';
      if (fullName.toLowerCase().includes('null')) {
        fullName = fullName.replace(/null/gi, '').trim();
      }
      const lastName = client.lastName ? client.lastName.trim() : '';
      const trimmedFullName = fullName + (fullName && lastName ? ' ' : '') + lastName;
      return {
        label: this.capitalizeFirstLetterOfEachWord(trimmedFullName),
        value: client.id
      };
    });
  });
}

/*...Gets Client details based on the Client_id provided
The details are patched to the clientDetailsForm when client/searched_client is selected
*/
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

getOccupations() {
  this.coverageService.getOccupation().subscribe((occupation: OccupationDTO[]) => {
    this.occupation = occupation;
  })
}

  getIdentifierTypeList() {
    this.clientType_service.getIdentifierTypes().subscribe((data: IdentityTypeDTO[]) => {
      this.identityType = data;
      console.log("getIdentifierTypeList", this.identityType)
    });
  }

  //Get regex and error message for mode of Identity chosen.
  onModeOfIdentitySelected(event: any) {
    this.clientDetailsForm.get('registrationNumber').reset();
    const selectedModeId = parseInt(event.target.value); // Convert value to number

    // Find the selected mode based on its ID
    const selectedMode = this.identityType.find(mode => mode.id === selectedModeId);

    // Check if the selected mode exists and then access its properties
    if (selectedMode) {
      this.modeOfIdentityId = selectedMode.id;
      this.modeOfIdentityFormat = selectedMode.identityFormat;
      this.modeOfIdentityErrorMessage = selectedMode.identityFormatError;
      this.modeOfIdentityName = selectedMode.name;
    }
  }

  /* Prevents typing to registration NO when mode of 
    identity is not selected */
  onRegistrationNumberKeydown(event: KeyboardEvent) {
    if (!this.modeOfIdentityId) {
        event.preventDefault();
        this.messageService.add({
          severity: 'info',
          summary: 'Information',
          detail: 'Please select a mode of identity first'
        });
    }
}

  /* Gets format of the typed registration number and compare with format
  of selected mode of Identity then display error message. */
  validateRegistrationNumber() {
    const registrationNumber = this.clientDetailsForm.get('registrationNumber').value;
  
    if (registrationNumber === null || registrationNumber === undefined) {
      this.modeOfIdentityErrorMessage = 'Registration number is required';
      return this.modeOfIdentityErrorMessage;
    }
  
    if (this.modeOfIdentityFormat && registrationNumber) {
      const regex = new RegExp(this.modeOfIdentityFormat);
      if (!regex.test(registrationNumber)) {
        // Display error message with format example
        let errorMessage = 'Incorrect format. Expected format example: ';
        switch (this.modeOfIdentityFormat) {
          case '^[0-9]{3}\/[0-9]{5}$':
            errorMessage += '123/45678';
            break;
          case '^[0-9]{8}$':
            errorMessage += '12345678';
            break;
          case '^[A-Z]{1,2}[0-9]{6,8}[A-Z]{0,1}$':
            errorMessage += 'AB123456DE';
            break;
          case '^A[0-9]{8}$':
            errorMessage += 'A12345678';
            break;
          case '^[0-9]{5}-[0-9]{5}-[0-9]{4}$':
            errorMessage += '12345-67890-1234';
            break;
          case '^[0-9]{5}\\/[0-9]{5}$':
            errorMessage += '12345/67890';
            break;
          case '^[a-zA-Z0-9_]{3}\\/[a-zA-Z0-9_]{3}\\/[0-9]{6}$':
            errorMessage += 'ABC/DEF/123456';
            break;
          case '^[0-9]{3}\\/[0-9]{5}$':
            errorMessage += '123/45678';
            break;
          default:
            errorMessage += 'Please enter the correct format.';
        }
        
        // Set form control errors and return error message
        this.clientDetailsForm.get('registrationNumber').setErrors({ 'incorrectFormat': true });
        this.modeOfIdentityErrorMessage = errorMessage;
        return this.modeOfIdentityErrorMessage;
      }
    }
    
    return null;
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
  this.client_service.getClientType(this.organizationId).subscribe((clntType: ClientTypeDTO[]) => {
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
      // "firstName": null,
      "lastName": formValues.clientName,
      "modeOfIdentityId": formValues.modeOfIdentity,
      "modeOfIdentity": this.modeOfIdentityName,
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

    this.session_storage.set('clientDetails', JSON.stringify(formValues));

    if (this.clientDetailsForm.get('clientType').value === null || this.clientDetailsForm.get('clientType').value === ''
        || this.clientDetailsForm.get('clientType').value === undefined) {
          this.spinner_Service.hide('download_view');
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: 'Select New or Existing client'
          });
          return;
        }

    if (this.clientDetailsForm.get('clientType').value === 'existingClient') {
      this.spinner_Service.hide('download_view');
      console.log("updating Existing client", formValues)

      if (this.clientDetailsForm.get('clientName').value === null || this.clientDetailsForm.get('clientName').value === ''
        || this.clientDetailsForm.get('clientName').value === undefined) {
          this.spinner_Service.hide('download_view');
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Select Client to update'
          });
        return;
      } else {
        console.log("Client to updateID", this.patchedClientId)
        this.spinner_Service.show('download_view');
        // this.client_service.updateClient(this.patchedClientId, payload).subscribe((updateClnt) => {
        //   this.session_storage.set('newClientCode', JSON.stringify(this.patchedClientId));
        //   console.log("client successfully updated", updateClnt)
        //   // move activated router below here once the PUT method works.
        // },
        //   (error) => {
        //     this.session_storage.set('newClientCode', JSON.stringify(this.patchedClientId));
        //     let errorMessage = 'Unknown error'; // Default message
        //     if (error.error && error.error.errors && error.error.errors.length > 0) {
        //       errorMessage = error.error.errors[0]; // Extract the first error message
        //     } else if (error.error && typeof error.error === 'string') {
        //       errorMessage = error.error; // If the error is a string, use it as the message
        //     }
        //     this.messageService.add({
        //       severity: 'error',
        //       summary: 'Error',
        //       detail: errorMessage
        //     });
        //   });

          // to be moved after update method above is fixed
          this.session_storage.set('newClientCode', JSON.stringify(this.patchedClientId));
          this.router.navigate(['/home/lms/grp/quotation/quick']);
          this.spinner_Service.hide('download_view');

      }
    } else {

      if (this.clientDetailsForm.invalid) {
        this.spinner_Service.hide('download_view');

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
        this.spinner_Service.hide('download_view');
        emailControl.setErrors({ 'invalidEmail': true });
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Email is invalid'
        });
        return;
      }

      else {
        this.spinner_Service.show('download_view');

        this.client_service.save(payload).subscribe(
          (clientPayload) => {
            this.clientCode = clientPayload?.id;
            this.session_storage.set('newClientCode', JSON.stringify(this.clientCode));
            this.storedClientCode = this.clientCode;
            this.spinner_Service.hide('download_view');
            console.log("clientProposerCode", this.clientCode);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'New client successfully created'
            });

            //Choose whether to create administrator or not, for the created client
            this.confirmationService.confirm({
              target: event.target as EventTarget,
              message: 'Do you wish to create administrator for this client?',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              acceptIcon: "none",
              rejectIcon: "none",
              rejectButtonStyleClass: "p-button-text",
              accept: () => {
                this.session_storage.set('newClientCode', JSON.stringify(this.clientCode));
                this.createAdmin = true;
                this.messageService.add({
                  severity: 'info',
                  summary: 'Information',
                  detail: 'Navigate to administrator section and click on add(+) button'
                });
              },
              reject: () => {
                this.session_storage.set('newClientCode', JSON.stringify(this.clientCode));
                this.router.navigate(['/home/lms/grp/quotation/quick']);
              }
            });
          },
          (error) => {
            this.spinner_Service.hide('download_view');
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

  /*Method to call on press of continue after 
  selecting add administrator for created client*/
  continueAfterAddingAdmin() {
    this.router.navigate(['/home/lms/grp/quotation/quick']);
    // this.createAdmin = false;
  }

  /*...Retreives new client's details or existing client's
  when navigating to this screen after proceeding to second/other screens.
  Rereives from session storage.
      */
  retrievClientDets() {
    const storedClientData = this.session_storage.get('clientDetails');
    const newClientCodeString = this.session_storage.get('newClientCode');
    const newClientCode = JSON.parse(newClientCodeString);
    this.storedClientCode = newClientCode;

    if (storedClientData) {
      const clientData = JSON.parse(storedClientData);
      this.clientDetailsForm.patchValue(clientData);
      this.clientDetailsForm.patchValue({
        clientName: {
          label: clientData.clientName,
          value: this.storedClientCode
        },
      })
      console.log("clientDetailsFormData",this.clientDetailsForm, clientData, newClientCode);
    }
  }

  onSaveAdminDets() {
    this.spinner_Service.show('download_view');
    const formValues = this.adminDetailsForm.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailControl = this.adminDetailsForm.get('email');
    const emailValue = emailControl.value;
    console.log('AdminFormValues', formValues);
    const adminDetails = {
      contact_person_name: formValues.name,
      telephone_number: formValues.phoneNumber,
      contact_person_email: formValues.email,
      wef: formValues.wef,
      wet: formValues.wet,
      date_of_birth: formValues.dob,
      phone_number: formValues.phoneNumber,
      gender: formValues.gender,
      client_code: this.storedClientCode,
      // position: formValues.position
      // idType: formValues.identificationType
      //address: formValues.address
    }

    if(emailValue && !emailPattern.test(emailValue)) {
      this.spinner_Service.hide('download_view');
      emailControl.setErrors({ 'invalidEmail': true });
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Email is invalid'
      });
      return;
    } else {
    this.adminService.saveAdminDetails(adminDetails).subscribe((res) => {
      this.closeAdminDetailsModal()
      this.getAdministratorDetails();
      this.spinner_Service.hide('download_view');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Administrator saved successfully'
      });
    },(error) => {
      this.spinner_Service.hide('download_view');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error occured, check form details'
      });
    })
  }
  }

  getAdministratorDetails() {
    this.adminService.getAdministratorDetails(this.storedClientCode).subscribe((adminDets: ContactPersonDTO[]) => {
      this.administratorDetails = adminDets;
      console.log("Admin/ContactPerson", this.administratorDetails);
    });
  }


  showEditAdminDetailsModal(administratorDetails) {
    this.isEditMode = true;
    this.contactPersonCode = administratorDetails.contact_person_code;
    const modal = document.getElementById('adminDetailsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    if (administratorDetails) {
      this.adminDetailsForm.patchValue({
        name: administratorDetails.contact_person_name,
        phoneNumber: administratorDetails.phone_number,
        email: administratorDetails.contact_person_email,
        wef: administratorDetails.wef,
        wet: administratorDetails.wet,
        dob: administratorDetails.date_of_birth,
        gender: administratorDetails.gender,
        // position: formValues.position
        // idType: formValues.identificationType
        //address: formValues.address
      });
    }
  }

  editAdminDetails() {
    this.spinner_Service.show('download_view');
    const formValues = this.adminDetailsForm.value;
    const adminDetails = {
      contact_person_name: formValues.name,
      telephone_number: formValues.phoneNumber,
      contact_person_email: formValues.email,
      wef: formValues.wef,
      wet: formValues.wet,
      date_of_birth: formValues.dob,
      phone_number: formValues.phoneNumber,
      gender: formValues.gender,
      client_code: this.storedClientCode,
    }

    this.adminService.updateAdministratorDetails(this.contactPersonCode, adminDetails).subscribe((res) => {
      this.getAdministratorDetails();
      this.spinner_Service.hide('download_view');
      this.closeAdminDetailsModal()
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Edit successful'
      });
    })
  }

  deleteAdminDetails(administratorDetails, event: Event) {
    const contactPerson_code = administratorDetails.contact_person_code;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to Delete this Administrator?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.adminService.deleteAdministrator(contactPerson_code).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Deleted'
          });
          this.getAdministratorDetails();
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Cancelled', life: 3000 });
      }
    });
  }


}
