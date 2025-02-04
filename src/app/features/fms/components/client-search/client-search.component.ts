import { Component } from '@angular/core';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountTypeDTO, BranchDTO, ClientsDTO, Receipt, TransactionDTO } from '../../data/receipting-dto';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { OrganizationService } from 'src/app/features/crm/services/organization.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css']
})
export class ClientSearchComponent {
  globalReceiptNumber:number;
  receiptingDetailsForm: FormGroup;
  //control flags
  isAccountTypeSelected = false;
  globalAccountTypeSelected:any;
  accountTypeArray:AccountTypeDTO[]=[];
      // 1.2 User & Organization and Branch Details
      loggedInUser: any;
      GlobalUser: any;
      organization: OrganizationDTO[];
      defaultOrgId: number;
      users:any;
      branches:BranchDTO[]=[];  
      organizationId: number;
      selectedCountryId: number | null = null;
      defaultCountryId: number;
      selectedOrganization: string | null = null; // Currently selected organization
      selectedOrgId:number;
      selectedBranchId:any;
    defaultBranchId:any;
    defaultBranchName:string;
    selectedBranch:number;
    userId:number;
    orgId:number;
  // 1.4 Client & Transaction Details
  selectedClient: any;
  transactions: TransactionDTO[] = [];
  accountTypes:AccountTypeDTO[]=[];
clients:ClientsDTO[]=[];
loading = false; 
isClientSelected: boolean = false;

first: number = 0; // First row index
    rows: number = 10; // Rows per page
    totalRecords: number = 0; // Total number of records

constructor(
  private receiptDataService:ReceiptDataService,
  private globalMessagingService:GlobalMessagingService,
  private receiptService:ReceiptService,
  private staffService:StaffService,
  private organizationService:OrganizationService,
  private authService:AuthService,
  private fb:FormBuilder,
  private router:Router
){}

ngOnInit(
  
):void{
 this.captureReceiptForm();
  const storedData = this.receiptDataService.getReceiptData();
  let storedReceiptNumber = localStorage.getItem('receiptNumber');
  // let loggedInUser = localStorage.getItem('this.loggedInUser');
  this.loggedInUser = this.authService.getCurrentUser();
  console.log('logged in user',this.loggedInUser);
if (storedReceiptNumber) {
this.globalReceiptNumber = Number(storedReceiptNumber);
}
console.log('receipt no>',this.globalReceiptNumber)
console.log('Data from previous screen:', storedData);
let globalSelectedOrgId=localStorage.getItem('selectedOrgId');
this.selectedOrgId= globalSelectedOrgId ? Number(globalSelectedOrgId) : null;
let globalDefaultBranch=localStorage.getItem('defaultBranchId');
this.defaultBranchId = globalDefaultBranch ? Number(globalDefaultBranch) : null;
let globalSelectedBranch=localStorage.getItem('selectedBranch');
this.selectedBranch = globalSelectedBranch ? Number(globalSelectedBranch) : null;
let globalOrgId=localStorage.getItem('OrgId');
this.orgId=  globalOrgId? Number(globalOrgId) : null;
let globalUserId=localStorage.getItem('UserId');
this.userId = globalUserId ? Number(globalUserId ) : null;
console.log('USERID>>',this.userId);
console.log('selectedorgId>>',this.selectedOrgId);
console.log('defaultBranchId>>',this.defaultBranchId);
console.log('globalSelectedBranch>>',this.selectedBranch);
console.log('orgId>>',this.orgId);
this.fetchAccountTypes();
  }
  
captureReceiptForm(){
  this.receiptingDetailsForm = this.fb.group({
 
    allocationType: [''],
    accountType: ['', Validators.required],
      searchCriteria: [{ value: '', disabled: true }, Validators.required],
      searchQuery: [{ value: '', disabled: true }, Validators.required],
      allocatedAmount: this.fb.array([]) // FormArray for allocated amounts
   

   
  });
}

 


  
  fetchAccountTypes() {
    this.receiptService.getAccountTypes(this.orgId || this.selectedOrgId, this.defaultBranchId || this.selectedBranchId,this.userId).subscribe({
      next: (response) => {
        this.accountTypes = response.data || [];
       // console.log('response>>',response);
       this.accountTypeArray=response.data;
      
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.error);
       
      },
    });
  }
  
  // Enable search fields when account type is selected
onAccountTypeChange(): void {
  const accountType = this.receiptingDetailsForm.get('accountType')?.value;
  this.isAccountTypeSelected = !!accountType;

  if (this.isAccountTypeSelected) {
    this.globalAccountTypeSelected=this.accountTypeArray.find((account)=>
account.name===accountType

    );
    this.receiptDataService.setSelectedClient(this.globalAccountTypeSelected); // Save in service
    this.receiptingDetailsForm.get('searchCriteria')?.enable();
    this.receiptingDetailsForm.get('searchQuery')?.enable();
  } else {
    this.receiptingDetailsForm.get('searchCriteria')?.disable();
    this.receiptingDetailsForm.get('searchQuery')?.disable();
  }
}
onSearch(): void {
 
   
  const { accountType, searchCriteria, searchQuery } = this.receiptingDetailsForm.value;

  if (!accountType || !searchCriteria || !searchQuery) {
   
    this.globalMessagingService.displayErrorMessage('Error','Please provide all the required fields');
    return;
  }

  const criteriaMapping = {
    clientName: 'CLIENT_NAME',
    policyNumber: 'POL_NO',
    accountNumber: 'ACC_NO',
    debitNote: 'DR_CR_NO',
  };

  const apiSearchCriteria = criteriaMapping[searchCriteria];
  if (!apiSearchCriteria) {
    
    this.globalMessagingService.displayErrorMessage('Error','Invalid search criteria selected');
    return;
  }

  this.fetchClients(apiSearchCriteria, searchQuery.trim());

}
// The onClickClient method sets this.selectedClient and fetches transactions based on the selected client's details. This allows the UI to reflect the transactions specific to the selected client.
onClickClient(selectedClient) {
 
  if (this.selectedClient?.code === selectedClient.code) {
    return; // Avoid unnecessary API call
  }
//  this.onReclicked=true;
  this.selectedClient = selectedClient; // Store the selected client
  this.receiptDataService.setSelectedClient(selectedClient); // Save in service
 
  this.isClientSelected = true; // Set flag when client is selected
 //console.log('new SELECTED CLIENT',this.selectedClient);
  this.fetchTransactions(
    selectedClient.systemShortDesc,
    selectedClient.code,
    selectedClient.accountCode,
    selectedClient.receiptType,
    selectedClient.shortDesc,
    

  );
  //  Ensure the allocation table is displayed
   //this.allocation = true;
  
  // Recalculate total allocated amount for the new client
  //this.calculateTotalAllocatedAmount();
  
}

fetchTransactions(systemShortDesc: string,
  clientCode: number,
  accountCode: number,
  receiptType: string,
  clientShtDesc: string): void {
  this.receiptService.getTransactions(systemShortDesc, clientCode, accountCode, receiptType, clientShtDesc).subscribe({
    next: (response) => {
      this.transactions = response.data;
      if(this.transactions.length>0){
        console.log('returned>>',this.transactions);

        // Store transactions in the service
        this.receiptDataService.setTransactions(this.transactions);
        this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
        // Navigate to client-allocation component
        this.router.navigate(['/home/fms/allocation']); 
      }else{
        this.globalMessagingService.displayErrorMessage('Error:','No transactions found!');
        return;
      }
      
      // Clear existing controls
      // while (this.allocatedAmountControls.length !== 0) {
      //   this.allocatedAmountControls.removeAt(0);
      // }

      // Add new controls for each transaction
      // this.transactions.forEach(() => {
      //   this.allocatedAmountControls.push(
      //     this.fb.group({
      //       allocatedAmount: [0, Validators.required],
      //       commissionChecked: ['N']
      //     })
      //   );
      // });
    
 // Recalculate total allocated amount
 //this.calculateTotalAllocatedAmount();
      
      // Retain cumulative amount
      //this.calculateTotalAllocatedAmount();
      //console.log('Form Controls:', this.allocatedAmountControls.value);
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    }
  });
}
fetchClients(searchCriteria: string, searchValue: string): void {
  const accountType = this.receiptingDetailsForm.get('accountType')?.value;
  const selectedAccountType = this.accountTypes.find((type) => type.name === accountType);

  if (selectedAccountType) {
    const { systemCode, accCode } = selectedAccountType;
    //this.loading = true;

    this.receiptService.getClients(systemCode, accCode, searchCriteria, searchValue).subscribe({
      next: (response) => {
        this.clients = response.data || [];
      //console.log('Clients:', this.clients);
      this.totalRecords = this.clients.length; // Set total records count

        if (!this.clients.length) {
          
          this.globalMessagingService.displayErrorMessage('Error','No clients found for the given criteria');
        }
      },
      error: (err) => {
        
        this.globalMessagingService.displayErrorMessage('Error', err.error.error);
       
      },
      complete: () => {
        this.loading = false;
      },
    });
  } else {
   
    this.globalMessagingService.displayErrorMessage('Error','Invalid account type!');
  }
}
onNext() {
  this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
  this.router.navigate(['/home/fms/allocation']);  // Navigate to the next screen
}
onBack() {
  //this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
  this.router.navigate(['/home/fms/screen1']);  // Navigate to the next screen
}
}
