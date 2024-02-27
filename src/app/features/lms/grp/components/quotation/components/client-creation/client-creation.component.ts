import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.clientCreationForm();
    this.adminCreationForm();
  }

  ngOnDestroy(): void {
    
  }

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


}
