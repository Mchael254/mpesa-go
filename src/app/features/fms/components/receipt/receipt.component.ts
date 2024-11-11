import { Component, OnInit,NgZone,ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ReceiptingService } from '../../services/receipting.service';
import {DrawersBankDTO,NarrationDTO,ReceiptingPointsDTO,Transaction,Receipt,Client, PaymentModesDTO} from '../../data/receipting-dto'
import { Modal } from 'bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, Subscriber } from 'rxjs';
import {AuthService} from 'src/app/shared/services/auth.service';
import * as bootstrap from 'bootstrap'; // Import Bootstrap's JavaScript library
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SessionStorageService} from "../../../../shared/services/session-storage/session-storage.service";
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Logger } from 'src/app/shared/services';
import { ReceiptService } from '../../services/receipt.service';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { BankDTO, CurrencyDTO } from 'src/app/shared/data/common/bank-dto';
//import {AuthService} from "../../../shared/services/auth.service";
import { PaymentModesService } from 'src/app/shared/services/setups/payment-modes/payment-modes.service';
import { PaymentModesDto } from 'src/app/shared/data/common/payment-modes-dto';

const log = new Logger('ReceiptComponent');


@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],

})


export class ReceiptComponent implements OnInit {
  receiptingDetailsForm: FormGroup;

    backdatingEnabled = false;

    minDate: string = '';
    loggedInUser:any;
    // chargesEnabled = false;
    chargesEnabled: boolean = false;
    selectedChargeType: string = 'charges';
    chargeAmount: number = 0;
    private chargesModal: Modal | undefined;
    chargeTypes: string[]=[];
  // chargeTypes: string[] = ['charges', 'bank charges']; // Predefined values for dropdown
  // chequeTypes = ['normal Cheque', 'pd Cheque'];
  chequeTypes =[];
  chargeAmountInput: number = 0;
  chargeList: { type: string; amount: number }[] = [];
  editingIndex: number | null = null;
  
  searchClients: any[] = [];
  allocatedClients: any[] = [];
  totalAllocatedAmount = 0;
  isAccountTypeSelected = false;
  accountType: string = '';
  transactions: Transaction[] = [];
  searchQuery: string = '';
  // accountTypes: string[] = ['Savings', 'Current', 'Loan']; // Mock data for account types
  accountTypes: string[] =[];
  canAddAllocation = false; // Ensure this is mutable and not readonly
  paymentModes:PaymentModesDTO[]=[];
bankAccounts:BankDTO[]=[];
    drawersBank:DrawersBankDTO[]=[];
   
    
narrations:NarrationDTO[]=[];
filteredNarrations: NarrationDTO[] = []; // Updated to store filtered narrations
   
currencies:CurrencyDTO[]=[];
receiptingPoints: any[]=[];
    // receiptingPoints: any[] = [
    //   { code: 'BR1', name: 'Branch 1', prefix: 'BR1' },
    //   { code: 'BR2', name: 'Branch 2', prefix: 'BR2' }
    // ];
   // Example mock data for testing
  //  mockClientData = [
  //   {
  //     clientName: 'John Doe',
  //     policyNumber: 'P12345',
  //     accountNumber: 'A1001',
  //     debitNote: 'DN001',
  //     amountInsured: 5000,
  //     accountType: 'Savings',
  //   },
  //   {
  //     clientName: 'Jane Smith',
  //     policyNumber: 'P67890',
  //     accountNumber: 'A2002',
  //     debitNote: 'DN002',
  //     amountInsured: 10000,
  //     accountType: 'Current',
  //   },
  // ];
  mockClientData:any[]=[];
     
    countryId:number=1100;
    branchCode:number=344;
    groupBusinessAccounts: any[] = []; // Initialize an empty array for group business accounts
    glAccounts: any[] = []; // Initialize an empty array for GL accounts



// filteredNarrations: any[] = [...this.narrations]; // Copy of the narrations
originalNarration: string | null = null; // Track selected narration from dropdown
isNarrationFromLov = false; // Flag to indicate if narration is from dropdown

//get currencies-not reas
  orgCode: string;

constructor(
  private fb: FormBuilder,
  private translateService: TranslateService,
  private receiptingService: ReceiptingService,
  private modalService: NgbModal,
  private ngZone: NgZone,
  private sessionStorage: SessionStorageService,
  private globalMessagingService:GlobalMessagingService,
  private receiptService:ReceiptService,
  private bankService: BankService,
  private currencyService: CurrencyService,
  private paymentModeService: PaymentModesService,
 
  private authService:AuthService
) {

  
  // this.receiptingDetailsForm.get('charges')?.valueChanges.subscribe((value: string) => {
  //   this.chargesEnabled = value === 'yes';
  //   if (this.chargesEnabled) {
  //     this.showChargesModal();
  //   }
  // });

  translateService.setDefaultLang('en');
  translateService.use('en'); // Initial language

  // Add supported languages
  translateService.addLangs(['en', 'es', 'fr', 'zh', 'sw', 'de']);
  // Add validation for drawers bank based on payment mode
  // this.receiptingDetailsForm.get('paymentMode')?.valueChanges.subscribe(paymentMode => {
  //   if (paymentMode === 'CASH') {
  //     this.receiptingDetailsForm.get('drawersBank')?.disable();
  //   } else {
  //     this.receiptingDetailsForm.get('drawersBank')?.enable();
  //     this.receiptingDetailsForm.get('drawersBank')?.setValidators([Validators.required, Validators.minLength(1)]);
  //   }
  //   this.receiptingDetailsForm.get('drawersBank')?.updateValueAndValidity();
  // });

 

}
ngOnInit(): void {
  this.captureReceiptForm();
  this.fetchAllCurrencies();
  this.fetchPaymentModes();
  //this.fetchCurrencies();
  this.fetchDrawersBank();
  this.fetchNarrations();
  this.getPaymentModeSelected();
   this.disableDrawersBank();
  //this.fetchCurrencies();
  // this.fetchPaymentModes();
  //this.fetchBanks();
 this.loggedInUser = this.authService.getCurrentUser();
console.log('logged user>',this.loggedInUser.code);
console.log(this.currencies);
  // this.fetchReceiptingPoints()
  // this.initializeForm();
//   this.receiptingDetailsForm.get('bankAccount')?.valueChanges.subscribe(bank => {
//     this.toggleChargeField(bank);
//   });
//   this.receiptingDetailsForm.get('receiptNumber')?.disable();

//   this.receiptingService.getBackdatingEnabled().subscribe(isEnabled => {
//     this.backdatingEnabled = isEnabled; // Set the backdating flag
//   },
//   error => {
//     console.error('Error fetching backdating status:', error);
//   }
// );

// this.receiptingService.getBackdatingEnabled().subscribe(
//   (isEnabled: boolean) => {
//     this.backdatingEnabled = isEnabled;
//     this.setDateRestrictions();
//   },
//   (error) => console.error('Error fetching backdating status:', error)
// )
//alert("orgcode set to:  " + this.sessionStorage.getItem('SESSION_ORG_CODE'));
// console.log('>>>',this.sessionStorage.getItem("SESSION_ORG_CODE"));
// this.orgCode = this.sessionStorage.getItem("SESSION_ORG_CODE");
// alert(this.orgCode);





//   this.receiptingService.getBackdatingEnabled().subscribe(
//     (isEnabled: boolean) => {
//       this.backdatingEnabled = isEnabled;
//       this.setDateRestrictions();
//     },
//     (error) => console.error('Error fetching backdating status:', error)
//   );

//   this.receiptingDetailsForm.get('receiptNumber')?.disable();

//   this.receiptingDetailsForm.get('receiptingPoint')?.disable();

//   const modalElement = document.getElementById('chargesModal');
//   if (modalElement) {
//     this.chargesModal = new Modal(modalElement); // Initialize the modal
//   }
 

}
captureReceiptForm(){
  this.receiptingDetailsForm = this.fb.group({
    amountIssued: ['', Validators.required],
    openCheque: [''],
    receiptNumber: [{ value: '', disabled: true }],
    ipfFinancier: [''],
    grossReceiptAmount: [''],
    receivedFrom: ['', Validators.required],
    drawersBank: [ '',[Validators.required, Validators.minLength(1)]], // Drawers bank required if not cash
    receiptDate: ['', Validators.required],
    narration: ['', [Validators.required, Validators.maxLength(255)]],
    paymentRef: ['', Validators.required],
    otherRef: [''],
    documentDate: [''],
    manualRef: [''],
    currency: ['KES', Validators.required], // Default currency is KES
    paymentMode: ['', Validators.required],
    chequeType: [{ value: '', disabled: true }],
    bankAccount: [''],
    receiptingPoint: [{ value: '', disabled: true }],
    charges: ['no', Validators.required],
      chargeAmount: [{ value: '', disabled: true }],
      selectedChargeType:['', Validators.required],
      modalChargeAmount: ['', [Validators.required, Validators.min(1)]],
      allocatedAmount: ['', [Validators.required, Validators.min(1)]],
    deductions: [''], 
    exchangeRate:[''],
    capitalInjection: [''], 
    allocationType: [''],
    accountType: ['', Validators.required],
      searchCriteria: [{ value: '', disabled: true }, Validators.required],
      searchQuery: [{ value: '', disabled: true }, Validators.required],
      allocations:[''],
   

    // multiOrgSearchTerm: [''],
    multiOrgAllocatedAmount: [''],
    multiOrgAllocationEnabled: [false],
    transactions: this.fb.array([]), // Array of transactions
  });
}
fetchCurrencies(){
this.currencyService.getCurrencies().subscribe({
    next: (data) => {
      this.currencies = data;
  log.info("requests>>", data);
    },
    error: (err) => {
      
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    }
  });

 
}

fetchPaymentModes(){
this.receiptService.getPaymentModes().subscribe({
    next: (response) => {
      this.paymentModes = response.data;
      console.log("requests>>", this.paymentModes);
  // log.info("requests>>", response);
    },
    error: (err) => {
      
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    }
  });
}
// fetchPaymentModes(){
//   this.receiptService.getPaymentModes(2).subscribe(
//     {
//       next:(data) => {
//         this.paymentModes = data;
//     log.info("requests>>", data);
//       },
//       error:(err) => {
//       console.log(err);
        
//          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
//       }
   
//     });
// }
fetchReceiptingPoints(){
  this.receiptService.getReceiptingPoints(this.branchCode).subscribe({
        next: (data) => {
          this.receiptingPoints = data;
      log.info("requests>>", data);
        },
        error: (err) => {
             console.log(err);
          // this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
}
fetchDrawersBank(){
  this.receiptService.getDrawersBanks()
      .subscribe({
        next: (data) => {
          this.drawersBank = data;
      log.info("requests>>", data);
        },
        error: (err) => {
          console.log(err); 
          // this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
}
getPaymentModeSelected(){
  this.receiptingDetailsForm.get('paymentMode')?.valueChanges.subscribe((paymentMode) => {
    this.updatePaymentModeFields(paymentMode);
  });
}

fetchNarrations() {
  this.receiptService.getNarrations().subscribe({
    next: (response) => {
      // Access the `data` property from the response and assign to `this.narrations`
      this.narrations = response.data || []; // Use an empty array as fallback
      this.filteredNarrations = [...this.narrations]; // Copy for display

      console.log("Fetched narrations:", this.narrations); // Log to verify
    },
    error: (err) => {
      console.log("Error fetching narrations:", err);
     
      // this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    }
  });
}
fetchAllCurrencies(){
  this.currencyService.getCurrencies().subscribe(
    {
      next:(data)=>{
        this.currencies=data;
        log.info('reuquests>>',data);
      },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    }
    }
  )
}
fetchBanks(){
  this.bankService.getBanks(this.countryId)
      .subscribe({
        next: (data) => {
          this.bankAccounts = data;
      log.info("requests>>", data);
        },
        error: (err) => {
           console.log(err);
          // this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
}


   // Open the modal dynamically and clear form values
   showChargesModal(): void {
    const modalElement = document.getElementById('chargesModal') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);

    // Clear the form on every opening of the modal
    this.receiptingDetailsForm.reset({
      selectedChargeType: 'charges',
      modalChargeAmount: '',
    });

    this.editingIndex = null; // Reset editing state
    modal.show();
  }
   // Save the charge details
   saveCharges(): void {
    const type = this.receiptingDetailsForm.get('selectedChargeType')?.value;
    const amount = this.receiptingDetailsForm.get('modalChargeAmount')?.value;

    if (type && amount !== null && !isNaN(amount)) {
      const charge = { type, amount: parseFloat(amount) };

      if (this.editingIndex !== null) {
        // Update the existing charge
        this.chargeList[this.editingIndex] = charge;
        this.editingIndex = null;
      } else {
        // Add a new charge
        this.chargeList.push(charge);
      }

      // Enable charges section in the main form
      this.chargesEnabled = true;

      // Close the modal
      const modalElement = document.getElementById('chargesModal') as HTMLElement;
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    } else {
      alert('Please fill in all fields correctly.');
    }
  }

   // Edit an existing charge
   editCharge(index: number): void {
    const charge = this.chargeList[index];
    this.receiptingDetailsForm.patchValue({
      selectedChargeType: charge.type,
      modalChargeAmount: charge.amount,
    });

    this.editingIndex = index; // Set the editing index

    const modalElement = document.getElementById('chargesModal') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
     // Delete a charge
  deleteCharge(index: number): void {
    this.chargeList.splice(index, 1);

    if (this.chargeList.length === 0) {
      // Disable charges section if no charges are left
      this.chargesEnabled = false;
    }
  }
  
onNarrationDropdownChange(event: any): void {
  const selectedValue = event.target.value;

  if (selectedValue) {
    this.originalNarration = selectedValue;
    this.isNarrationFromLov = true;

    // Populate the textarea with the selected narration
    this.receiptingDetailsForm.get('narration')?.patchValue(selectedValue);

    // Reset the dropdown to visually empty state
    setTimeout(() => (event.target.value = ''), 0);

    // Remove the selected narration from the dropdown
    this.filteredNarrations = this.narrations.filter(
      (data) => data.narration !== selectedValue
    );
  }
}
onNarrationTextChange(): void {
  const narrationText = this.receiptingDetailsForm.get('narration')?.value;

  // If the user clears the narration, add it back to the dropdown
  if (!narrationText && this.originalNarration) {
    this.filteredNarrations = [...this.narrations]; // Restore narrations
    this.originalNarration = null; // Reset original narration
    this.isNarrationFromLov = false; // Reset flag
  }
}

  onChargesChange(value: string): void {
    if (value === 'yes') {
      const modalElement = document.getElementById('chargesModal') as HTMLElement;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      this.chargesEnabled = false;
      this.receiptingDetailsForm.patchValue({ chargeAmount: '' });
    }
  }
updateChargeAmount(amount: string): void {
  this.chargeAmount = parseFloat(amount);
  console.log('Updated Charge Amount:', this.chargeAmount);
}








toggleChargeField(bank: string): void {
  if (bank) {
    this.receiptingDetailsForm.get('chargeAmount')?.enable();
  } else {
    this.receiptingDetailsForm.get('chargeAmount')?.disable();
    this.receiptingDetailsForm.patchValue({ chargeAmount: '' });
  }
}




openChargesModal(): void {
  const modalRef = this.modalService.open('#chargesModal');
  modalRef.result.then(
    () => {
      this.chargesEnabled = true;
    },
    () => {
      this.chargesEnabled = false;
    }
  );
}
disableDrawersBank(){
  this.receiptingDetailsForm.get('paymentMode')?.valueChanges.subscribe((paymentMode) => {
    this.updatePaymentModeFields(paymentMode);
  });
}





onPaymentModeSelected(): void {
  const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;
  console.log(`Payment Mode Selected: ${paymentMode}`);
  this.updatePaymentModeFields(paymentMode);
}

private updatePaymentModeFields(paymentMode: string): void {
  const chequeTypeModalElement = document.getElementById('chequeTypeModal');
  const chequeTypeModal = chequeTypeModalElement
    ? Modal.getOrCreateInstance(chequeTypeModalElement)
    : null;

  if (paymentMode === 'CASH') {
    this.handleCashMode(chequeTypeModal);
    // this.receiptingDetailsForm.patchValue({ drawersBank: 'N/A' });
    // chequeTypeModal?.hide();
    // this.receiptingDetailsForm.get('drawersBank')?.disable();
  } else if (paymentMode === 'CHEQUE') {
    this.handleChequeMode(chequeTypeModal);
    // this.showChequeTypeModal(chequeTypeModal);
  } else {
    this.resetChequeFields(chequeTypeModal);
    // chequeTypeModal?.hide();
    // this.receiptingDetailsForm.get('chequeType')?.disable();
    // this.receiptingDetailsForm.patchValue({ chequeType: '' });
  }

  // this.receiptingDetailsForm.get('drawersBank')?.updateValueAndValidity();
  // this.receiptingDetailsForm.get('chequeType')?.updateValueAndValidity();
}
private handleCashMode(chequeTypeModal: Modal | null): void {
  this.receiptingDetailsForm.patchValue({ drawersBank: 'N/A' });
  chequeTypeModal?.hide();
  this.receiptingDetailsForm.get('drawersBank')?.disable();
}
private handleChequeMode(chequeTypeModal: Modal | null): void {
  this.receiptingDetailsForm.get('chequeType')?.enable();
  chequeTypeModal?.show();

  // Reset payment mode to allow re-triggering
  setTimeout(() => {
    this.receiptingDetailsForm.patchValue({ paymentMode: '' }, { emitEvent: false });
  }, ); // Slight delay to avoid glitches
}
private resetChequeFields(chequeTypeModal: Modal | null): void {
  chequeTypeModal?.hide();
  this.receiptingDetailsForm.get('chequeType')?.disable();
  this.receiptingDetailsForm.patchValue({ chequeType: '' });
}



onChequeTypeSelected(): void {
  const chequeType = this.receiptingDetailsForm.get('chequeType')?.value;
  console.log('Selected Cheque Type:', chequeType);

  const chequeTypeModalElement = document.getElementById('chequeTypeModal');
  const chequeTypeModal = chequeTypeModalElement
    ? Modal.getOrCreateInstance(chequeTypeModalElement)
    : null;

  chequeTypeModal?.hide(); // Close the modal after selection
}

setDateRestrictions(): void {
  const today = new Date().toISOString().split('T')[0]; // Get today's date

  if (!this.backdatingEnabled) {
    // If backdating is not allowed, restrict to current or future dates
    this.minDate = today;
    this.receiptingDetailsForm.get('receiptDate')?.patchValue(today); // Default to today’s date
  } else {
    // Allow all dates including past ones
    this.minDate = ''; // No restriction
  }
}







  receiptCaptureAmount: number = 15000;
  
    // Initialize the reactive form with a FormArray for client allocations
  initializeForm(): void {
    this.receiptingDetailsForm = this.fb.group({
      
    });
    
  }
  // Access the FormArray of allocations
  get allocations(): FormArray {
    return this.receiptingDetailsForm.get('allocations') as FormArray;
  }
   // Helper method to safely access FormGroup at an index
   getAllocationGroup(index: number): FormGroup {
    return this.allocations.at(index) as FormGroup;
  }

    // Add clients to allocations form dynamically
    addClientToAllocations(client: any): void {
      const allocationForm = this.fb.group({
        allocatedAmount: ['', [Validators.required, Validators.min(1)]],
        client: [client], // Store the client object in the form
      });
  
      this.allocations.push(allocationForm);
    }
   
  
// Add allocation logic
addAllocation(client: any, index: number): void {
  const allocationGroup = this.getAllocationGroup(index);
  const allocatedAmount = allocationGroup.get('allocatedAmount')?.value;

  if (this.isClientAlreadyAllocated(client.accountNumber)) {
    alert('This client has already been allocated.');
    return;
  }

  // Add client to allocatedClients array with the allocated amount
  this.allocatedClients.push({ ...client, allocatedAmount });

  // Remove from FormArray and reset state
  this.allocations.removeAt(index);
  this.canAddAllocation = this.allocatedClients.length > 0;
}
// Check if a client is already allocated
private isClientAlreadyAllocated(accountNumber: string): boolean {
  return this.allocatedClients.some((c) => c.accountNumber === accountNumber);
}

// Enable search fields when account type is selected
onAccountTypeChange(): void {
  const accountType = this.receiptingDetailsForm.get('accountType')?.value;
  this.isAccountTypeSelected = !!accountType;

  if (this.isAccountTypeSelected) {
    this.receiptingDetailsForm.get('searchCriteria')?.enable();
    this.receiptingDetailsForm.get('searchQuery')?.enable();
  } else {
    this.receiptingDetailsForm.get('searchCriteria')?.disable();
    this.receiptingDetailsForm.get('searchQuery')?.disable();
  }
}
// Handle search functionality
onSearch(): void {
  const formValues = this.receiptingDetailsForm.value;
  const { accountType, searchCriteria, searchQuery } = formValues;

  this.searchClients = this.mockClientData.filter(
    (client) =>
      client.accountType === accountType &&
      client[searchCriteria]?.toString().toLowerCase() === searchQuery.toLowerCase()
  );

  if (this.searchClients.length === 0) {
    alert(`No matching records found for '${searchQuery}' with account type '${accountType}'`);
  }

  // Add the filtered clients to the allocations form
  this.allocations.clear();
  this.searchClients.forEach((client) => this.addClientToAllocations(client));
}
   
  
    // Remove allocated client
    removeAllocation(client: any): void {
      this.allocatedClients = this.allocatedClients.filter(
        (allocated) => allocated !== client
      );
      this.canAddAllocation = this.allocatedClients.length > 0;
    }
  
    // Save allocated clients
    onAddAllocationClick(): void {
      console.log('Allocations saved:', this.allocatedClients);
      alert('Allocations saved successfully!');
    }
 

  onAllocationAmountChange(client: any, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = parseFloat(inputElement.value);

    if (!isNaN(value)) {
      client.allocatedAmount = value;
      console.log(`Allocated Amount for ${client.clientName}: ${value}`);
    } else {
      console.warn('Invalid allocation amount');
    }
  }

  updateTotalAllocatedAmount() {
    this.totalAllocatedAmount = this.allocatedClients.reduce(
      (sum, client) => sum + client.allocatedAmount, 0
    );
  }

 
 
  

 
  

  totAlloc: number = 0;

  /**
   * Array to store allocated amounts for clients
   */
  allocatedAmounts: { client: { name: string, date: Date, narration: string, amount: number }, allocatedAmount: number, allocationType: string }[] = [];


  isNextClicked: boolean = false;

  /**
   * Receipt object to store the captured receipt data
   */
  receipt: Receipt = {
    amountIssued: 0,
    openCheque: '',
    ipfFinancier: '',
    grossReceiptAmount: '',
    receivedFrom: '',
    drawersBank: '',
    receiptDate: new Date(),
    narration: '',
    paymentRef: '',
    otherRef: '',
    documentDate: '',
    manualRef: '',
    currency: '',
    paymentMode: '',
    bankAccount: '',
    receiptingPoint: '',
    chargeAmount: '',
    deductions: '',
   selectedChargeType:'',

    capitalInjection: '',
    transactions: [],
    receiptNumber: '', // Add receipt number
  };

  /**
   * Array to store uploaded files
   */
  uploadedFiles: File[] = [];
  multiOrgAllocationEnabled: any;
  searchTerm: any;
  currentTab: string;

  selectedCurrency: string = 'KES'; // Default currency
  exchangeRate: number = 1; // Default exchange rate
  useDefaultExchangeRate: boolean = false; // Mock parameter (replace with real logic)

  onCurrencySelected(): void {
    const currencyCode = this.receiptingDetailsForm.get('currency')?.value;
    this.selectedCurrency = currencyCode;

    if (currencyCode !== 'KES') {
      // Mock: Check if the client prefers the default exchange rate
      this.useDefaultExchangeRate = this.checkClientPreference();

      // Show the exchange rate modal
      this.showExchangeRateModal();
    }

   // console.log(`Currency Selected: ${currencyCode}`);
  }

  // Mock function to simulate checking client preference (replace with API logic)
  checkClientPreference(): boolean {
    // Replace with actual logic to determine the client’s preference
    return Math.random() < 0.5; // Random yes/no for demo purposes
  }

  // Show the Bootstrap modal
  showExchangeRateModal(): void {
    const modalElement = document.getElementById('exchangeRateModal') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  // Confirm and proceed with the exchange rate
  confirmExchangeRate(): void {
    console.log(`Exchange Rate: ${this.exchangeRate}`);
    // Close the modal
    const modalElement = document.getElementById('exchangeRateModal') as HTMLElement;
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }






   onBankSelected(): void {
    // Access the selected bank account from the form
    const bank = this.receiptingDetailsForm.get('bankAccount')?.value;

    // Check if a bank account is actually selected
    if (bank) {
    //  const selectedBank = this.bankAccounts.find(b => b.accountNumber === bank);
        const selectedBank:any='';
        if (selectedBank) {
            // Find the correct receipting point
            const receiptingPoint = this.receiptingPoints.find(rp => rp.code === this.getReceiptingPointForBankAccount(selectedBank));

            if (receiptingPoint) {
                this.receiptingDetailsForm.patchValue({
                    receiptingPoint: receiptingPoint.code,
                    receiptNumber: `${receiptingPoint.prefix}-${1}`
                });

                // ... you may need to update the values and their validations

            } else {
                console.warn("No corresponding receipting point found for this bank.");
            }
        } else {
            console.error("Selected bank account does not exist:", bank);
        }
    }
}

private generateReceiptNumber() {
// **Important:** Generate your receipt number based on selected bank information

// Use a separate helper function or get it from your backend. Example (assuming 'prefix' in your mock data):

let prefix = this.receiptingDetailsForm.get('receiptingPoint')?.value; //  Get the value
  const nextNumber = 1;

  const generatedReceiptNumber = `${prefix || 'DEFAULT'}-${nextNumber}`;

  // Now patch this into your form (Important to patch so we can bind correctly in the template):
  this.receiptingDetailsForm.patchValue({ receiptNumber: generatedReceiptNumber });

  this.receiptingDetailsForm.get('receiptNumber')?.updateValueAndValidity(); // Re-validate the control after patchValue
}

// ... your other methods ...
    // Function to determine receipting point from bank account.
    // Replace with actual logic based on your bank-receipting point mapping.
    getReceiptingPointForBankAccount(bank: any): string {
      // Here, you will define the mapping between banks and receipting points.
      if (bank.accountName === 'Acme Bank') {
          return 'BR1';
      } else if (bank.accountName === 'First National Bank') {
          return 'BR2';
      } else {
          return 'BR1'; // Default
      }
    }




  /**
   * Method to handle the receipting point selection
   */
  onReceiptingPointSelected(): void {
    const receiptingPoint = this.receiptingDetailsForm.get('receiptingPoint')?.value;

    // Update session with receipting point details
    this.receiptingService.updateReceiptingPoint(receiptingPoint);

    // Fetch and update the default "Printer Name" (if applicable)
    this.updateDefaultPrinter();

    // Generate the receipt number
    if (receiptingPoint) {
      // Find the selected receipting point in the array
      const selectedPoint = this.receiptingPoints.find(point => point.code === receiptingPoint);

      if (selectedPoint) {
        const receiptNumberPrefix = this.getReceiptNumberPrefix(selectedPoint);
        const nextNumber = this.getNextReceiptNumber(selectedPoint);
        this.receiptingDetailsForm.patchValue({ receiptNumber: `${receiptNumberPrefix}-${nextNumber}` });
      }
    }

    console.log(`Receipting Point Selected: ${receiptingPoint}`);
  }

  getReceiptNumberPrefix(receiptingPoint: any): string {
    // You need to define the logic to get the prefix based on the selected receipting point
    // Example:
    // Assuming each receipting point has a 'prefix' property
    return receiptingPoint.prefix || 'DEFAULT';
  }

  getNextReceiptNumber(receiptingPoint: any): number {
    let nextNumber = 1;
    // ... (fetch the last receipt number for this receipting point from your API)
    // Example:
    // this.receiptingService.getLastReceiptNumber(receiptingPoint.code).subscribe(lastNumber => {
    //   nextNumber = lastNumber + 1;
    // });
    return nextNumber;
  }




  /**
   * Method to handle the save receipt action
   */
  onSaveReceipt(searchClients: Client[]): void { // Pass searchClients as a parameter
    // Perform validation checks
    if (this.receiptingDetailsForm.valid) {
      // Create a Receipt object from the form data
      this.receipt = this.receiptingDetailsForm.value;

      // **Replaced mock API call with an API call using ReceiptingService**
      this.receiptingService.saveReceipt(this.receipt, this.transactions, searchClients, this.groupBusinessAccounts, this.glAccounts).subscribe(
        (response) => {
          // Handle successful save
          console.log('Receipt saved successfully');
          // Refresh the page and clear the receipt details
          // ...
        },
        (error) => {
          // Handle error
          console.error('Error saving receipt:', error);
          // Display an appropriate error message
          // ...
        }
      );
    } else {
      // Display an error message for invalid form
      console.error('Invalid form data');
      // Show an alert
      alert("Please fill all required fields");
      // ...
    }
  }



  handleReceiptAction(action: string, searchClients: Client[]): void { // Pass searchClients
    if (this.receiptingDetailsForm.valid) {
      // Create a Receipt object from the form data
      this.receipt = this.receiptingDetailsForm.value;

      if (action === 'save') {
        // **Replaced mock API call with an API call using ReceiptingService**
        this.receiptingService.saveReceipt(this.receipt, this.transactions, searchClients, this.groupBusinessAccounts, this.glAccounts).subscribe(
          (response) => {
            // Handle successful save
            console.log('Receipt saved successfully');
            // Refresh the page and clear the receipt details
            // ...
          },
          (error) => {
            // Handle error
            console.error('Error saving receipt:', error);
            // Display an appropriate error message
            // ...
          }
        );
      } else if (action === 'print') {
        // **Replaced mock API call with an API call using ReceiptingService**
        this.receiptingService.printReceipt(this.receipt, this.transactions, searchClients, this.groupBusinessAccounts, this.glAccounts).subscribe(
          (response) => {
            // Handle successful save
            console.log('Receipt printed successfully');
            // Refresh the page and clear the receipt details
            // ...
          },
          (error) => {
            // Handle error
            console.error('Error printing receipt:', error);
            // Display an appropriate error message
            // ...
          }
        );
      }
    } else {
      // Display an error message for invalid form
      console.error('Invalid form data');
      // Show an alert
      alert("Please fill all required fields");
      // ...
    }
  }
  /**
   * Method to handle the cancel receipt action
   */
  onCancelReceipt(): void {
    // Reset receipt details
    this.receiptingDetailsForm.reset();
    alert('Receipt cancelled successfully!');
    // Navigate back to the "Receipt Details" tab or the previous page
    // ...
  }

  /**
   * Reset form fields based on the selected currency
   */
  private resetReceiptFields(): void {
    // ... logic to reset fields based on currency, payment mode, etc. ...
    this.receiptingDetailsForm.patchValue({
      amountIssued: '',
      openCheque: '',
      ipfFinancier: '',
      grossReceiptAmount: '',
      receivedFrom: '',
      drawersBank: '',
      receiptDate: new Date(),
      narration: '',
      paymentRef: '',
      otherRef: '',
      documentDate: '',
      manualRef: '',
      bankAccount: '',
      receiptingPoint: '',
      chargeAmount: '',
      deductions: '',
      capitalInjection: '',
      allocationType: '',
      allocatedAmount: '',
      multiOrgSearchTerm: '',
      multiOrgAllocatedAmount: '',
      charges: 'no', // Reset charges

    });
  }

  /**
   * Update form fields based on the selected payment mode
   * @param paymentMode - The payment mode selected by the user
   */

  /**
   * Update default receipting point based on bank selection
   */
  private updateDefaultReceiptingPoint(): void {
    // ... logic to fetch and update the default receipting point ...
  }

  /**
   * Update default printer based on receipting point selection
   */
  private updateDefaultPrinter(): void {
    // ... logic to fetch and update the default printer ...
  }

  /**
   * Generate a new receipt number
   */


  /**
   * Method to update the allocated amount for a transaction
   * @param transaction - The transaction to update
   * @param event - The event triggered by the input change
   */
  onTransactionAllocatedAmountChange(transaction: any): void {
    // Instead of directly updating transaction.allocatedAmount,
    // use the form control to update the value:
    const transactionControl = this.receiptingDetailsForm.get('transactions')?.get(transaction.id.toString()) as FormGroup;
    transactionControl.patchValue({ allocatedAmount: event });
    this.updateTotalAllocatedAmount();
  }

  /**
   * Method to update the allocated amount for a policy
   * @param policy - The policy to update
   * @param event - The event triggered by the input change
   */
  onPolicyAllocatedAmountChange(policy: any): void {
    policy.allocatedAmount = event;
    this.updateTotalAllocatedAmount();
  }

  /**
   * Method to update the allocated amount for a group business account
   * @param account - The group business account to update
   * @param event - The event triggered by the input change
   */
  onGroupBusinessAccountAllocatedAmountChange(account: any): void {
    account.allocatedAmount = event;
    this.updateTotalAllocatedAmount();
  }

  /**
   * Method to update the allocated amount for a GL account
   * @param account - The GL account to update
   * @param event - The event triggered by the input change
   */
  onGlAccountAllocatedAmountChange(account: any): void {
    account.allocatedAmount = event;
    this.updateTotalAllocatedAmount();
  }

  /**
   * Method to update the total allocated amount
   */





  /**
   * Method to handle the manage account type action
   */


  /*
   * Method to handle print confirmation
   * @param printStatus - The print status selected by the user
   */
  onConfirmPrintStatus(printStatus: string): void {
    // ... logic to handle print confirmation
    console.log(`Print Status Confirmed: ${printStatus}`);
  }


  onMultiOrgAllocationChange(event: any) {
    const multiOrgAllocationEnabled = event.target.checked;
    this.receiptingDetailsForm.patchValue({ multiOrgAllocationEnabled });
    // ... any other logic you need
  }


  /**
   * Method to handle printing the receipt
   */
  onPrintReceipt(): void {
    //  - Display the preview using showReceiptPreview() instead of making a backend call.
    this.showReceiptPreview();
  }



  /**
   * Method to handle file selection for upload
   * @param event - The event triggered by the file input
   */
  onFileSelected(event: any): void {
  const files = event.target.files;
  if (files && files.length > 0) {
    this.uploadedFiles = Array.from(files); // Convert to array
    console.log('Files Selected:', this.uploadedFiles);
  }
}

onUploadFiles(): void {
  // Handle the file upload logic here using fileUploadService
  console.log('Files to upload:', this.uploadedFiles);
}



  /**
   * Method to handle removing a file from the uploaded files list
   * @param index - The index of the file to remove
   */
  onRemoveFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  /**
   * Method to handle changes in the allocated amount for a client
   * @param allocation - The allocation object
   * @param amount - The new amount
   */




  // Function to add a new transaction to the form array
  addTransaction(): void {
    const transactionsArray = this.receiptingDetailsForm.get('transactions') as FormArray;
    transactionsArray.push(this.createTransactionFormGroup());
  }

  // Function to create a new transaction form group
  createTransactionFormGroup(): FormGroup {
    return this.fb.group({
      id: ['', Validators.required], // Use a unique ID for each transaction
      clientName: ['', Validators.required],
      amount: ['', Validators.required],
      allocatedAmount: [''],
      narration: [''],
      date: ['', Validators.required], // Use a Date control
    });
  }
   previewError: HttpErrorResponse | null = null;

   showReceiptPreview(): void {
    if (this.receiptingDetailsForm.valid) {
      this.receipt = this.receiptingDetailsForm.value;

      this.receiptingService.getReceiptPreviewData(
        this.receipt,
        this.transactions,
        this.allocatedClients,
        this.groupBusinessAccounts,
        this.glAccounts
      ).subscribe(
        previewData => {
          console.log("Preview Data:", previewData);

          const receiptPreviewModalElement = document.getElementById('receiptPreviewModal');
          if (receiptPreviewModalElement) {
            const receiptPreviewModal = Modal.getInstance(receiptPreviewModalElement) || new Modal(receiptPreviewModalElement);
            receiptPreviewModal.show();
          }
        },
        error => {
          this.previewError = error;
          this.showModal();
        }
      );
    } else {
      console.error("Form is invalid, cannot show preview.");
    }
  }

private showModal() {
  const receiptPreviewModalElement = document.getElementById('receiptPreviewModal');
  if (receiptPreviewModalElement) {
    const receiptPreviewModal =
      Modal.getInstance(receiptPreviewModalElement) ||
      new Modal(receiptPreviewModalElement);
    receiptPreviewModal.show();
  } else {
    console.error('Modal element not found.');
  }
}


  /**
   * Method to handle the actual printing of the receipt
   */
  onPrintActualReceipt(): void {
    // Actual print logic using 'this.receiptingService' after the user confirms the preview
    // Call your service's 'printReceipt' method
    // ...
    const receiptPreviewModalElement = document.getElementById('receiptPreviewModal');
    if (receiptPreviewModalElement) {
      const receiptPreviewModal = Modal.getInstance(receiptPreviewModalElement) || new Modal(receiptPreviewModalElement);
      receiptPreviewModal.hide();
    }
  }


}