import { Component, OnInit,NgZone,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import {DrawersBankDTO,NarrationDTO,ReceiptNumberDTO,GenericResponse,ReceiptingPointsDTO,Transaction,Receipt,Client, PaymentModesDTO, AccountTypeDTO, CurrencyDTO, BankDTO, ClientsDTO, ChargesDTO, TransactionDTO, ExchangeRateDTO, ChargeManagementDTO, AllocationDTO, ExistingChargesResponseDTO} from '../../data/receipting-dto'
import { Modal } from 'bootstrap';

import * as bootstrap from 'bootstrap'; 

import {SessionStorageService} from "../../../../shared/services/session-storage/session-storage.service";
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';

import { ReceiptService } from '../../services/receipt.service';



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
  chargesEnabled: boolean = false;
   // selectedChargeType: string = 'charges';
    chargeAmount: number = 0;
    private chargesModal: Modal | undefined;
    chargeTypes: string[]=[];
  
   chequeTypes = ['normal Cheque', 'pd Cheque'];

  chargeAmountInput: number = 0;

  editingIndex: number | null = null;
  searchClients: any[] = [];
  selectedClient: any;
  allocatedClients: any[] = [];
  totalAllocatedAmount = 0;
   isAccountTypeSelected = false;
transactions:TransactionDTO[]=[];
  searchQuery: string = '';
  canAddAllocation = false; 
  paymentModes:PaymentModesDTO[]=[];
bankAccounts:BankDTO[]=[];
    drawersBank:DrawersBankDTO[]=[];
   narrations:NarrationDTO[]=[];
filteredNarrations: NarrationDTO[] = [];
loading = false; 

selectedCurrencySymbol: string | undefined; // To store the currency symbol for checks
selectedCurrencyCode: any;
currencyGlobal: number | null = null;
currencies:CurrencyDTO[]=[];
receiptingPoints: any[]=[];
    charges:ChargesDTO[]=[];
  accountTypes:AccountTypeDTO[]=[];
  clients:ClientsDTO[]=[];
  receiptNumber: string = '';
  branchNo:number;
  receiptChargeId!: number; // Component-level variable to store the selected charge ID
  chargeList:ExistingChargesResponseDTO[];
  editReceiptExpenseId: number | null = null; // To hold the receiptExpenseId of the edited charge
    
    countryId:number=1100;
 
originalNarration: string | null = null; 
isNarrationFromLov = false; 
orgCode: string;

currencySymbolGlobal:string | undefined;
exchangeRates: string | undefined; // Fetched exchange rate
exchangeRate: number ; // Default exchange rate
rate:any;
uploadedFiles: File[] = [];
fileDescriptions: { file: File; description: string }[] = [];
  currentFileIndex: number | null = null;
currentReceiptingPoint:any;
  manualExchangeRate:any;
  allocatedAmounts: number[] = []; // Array to store allocated amounts
  totalAllocatedAmounts: number = 0;
  isSubmitButtonVisible = false;
isSaveBtnActive=true;
  @ViewChild('fileDescriptionModal', { static: false }) fileDescriptionModal!: ElementRef;

constructor(
  private fb: FormBuilder,

  
  private sessionStorage: SessionStorageService,
  private globalMessagingService:GlobalMessagingService,
  private receiptService:ReceiptService,
 
) {


}
ngOnInit(): void {
  
 // this.transactions = []; // Initialize here as well
 // this.fetchReceiptingPoints();
  
  this.captureReceiptForm();
  this.fetchCurrencies();
  this.fetchPaymentModes();
  this.fetchDefaultExchangeRate();
  this.fetchExistingCharges();
  this.fetchAccountTypes();
  this.fetchBanks();
this.fetchAccountTypes();
  this.fetchDrawersBank();
 this.fetchNarrations();

this.fetchManualExchangeRateParameter();
// this.fetchExchangeRate();
 // this.fetchReceiptNumber();


 //this.fetchCharges();
//this.submitChargeManagement();

//   this.getPaymentModeSelected();

//this.submitAllocation();
// this.loggedInUser = this.authService.getCurrentUser();
//console.log('logged user>',this.loggedInUser.code);
//console.log('logged user>',this.loggedInUser);
//console.log(this.currencies);
//console.log('>>>',this.sessionStorage.getItem("SESSION_ORG_CODE"));
//this.orgCode = this.sessionStorage.getItem("SESSION_ORG_CODE");
//console.log(this.orgCode);


}

onClickClient(selectedClient) {
  this.fetchTransactions(
    selectedClient.systemShortDesc,
    selectedClient.code,
    selectedClient.accountCode,
    selectedClient.receiptType,
    selectedClient.shortDesc
  );
 // console.log("selected client>>", selectedClient.accountCode);
  
}

captureReceiptForm(){
  this.receiptingDetailsForm = this.fb.group({
    amountIssued: ['', Validators.required],
    openCheque: [''],
    receiptNumber:['',Validators.required],
    // receiptNumber: [{ value: '', disabled: true }],
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
    currency: ['', Validators.required], // Default currency is KES
    paymentMode: ['', Validators.required],
    chequeType: [{ value: '', disabled: true }],
    bankAccount: [''],
    receiptingPoint:['',Validators.required],
 charges: ['no', Validators.required],
      // chargeAmount: [{ value: '', disabled: true }],
      chargeAmount: [ ''],
      selectedChargeType:['', Validators.required],
      
      description: ['', Validators.required],
      //chargeAmount: ['', [Validators.required, Validators.min(1)]],
    //  allocatedAmount: ['', [Validators.required, Validators.min(1)]],
      // allocatedAmount: this.fb.array([]),
      allocatedAmount: this.fb.array(this.initializeAllocatedAmounts()),
    deductions: [''], 
    exchangeRate:[''],
    exchangeRates:[''],
    capitalInjection: [''], 
    allocationType: [''],
    accountType: ['', Validators.required],
      searchCriteria: [{ value: '', disabled: true }, Validators.required],
      searchQuery: [{ value: '', disabled: true }, Validators.required],
    allocations: this.fb.array([]), // Dynamically add transaction allocations here
    transactions: this.fb.array([]), 
  });
}
initializeAllocatedAmounts(): FormControl[] {
  return this.transactions.map(() => this.fb.control('', [Validators.required, Validators.min(1)]));
}
get allocatedAmountControls(): FormArray {
  return this.receiptingDetailsForm.get('allocatedAmount') as FormArray;
}





fetchManualExchangeRateParameter() {
  this.receiptService.getManualExchangeRateParameter('YES').subscribe({
    next: (response) => {
      this.manualExchangeRate = response.data;
      
     // this.system = response.Systemshortdesc
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
      
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    }
  });
}

fetchReceiptNumber(): void {
  this.receiptService.getReceiptNumber(1, 940).subscribe({
    next: (response: ReceiptNumberDTO[]) => {
      if (response && response.length > 0) {
        alert('sucesss')
        const receipt = response[0];
        this.receiptingDetailsForm.get('receiptNumber')?.patchValue(receipt.receiptNumber);

        // Optional: Log or store the fetched receipt number
        this.receiptNumber = receipt.receiptNumber;
      //  console.log('Fetched Receipt:', this.receiptNumber);
      } else {
        console.warn('No receipt numbers returned from API.');
        alert('error');
      }
    },
    error: (err) => {
      
      this.globalMessagingService.displayErrorMessage('Error', err.error?.error || 'Failed to fetch receipt number.');
    },
  });
}



fetchReceiptingPoints(){
  this.receiptService.getReceiptingPoints(1).subscribe({
        next: (response) => {
          this.receiptingPoints = response.data;
       
        },
        error: (err) => {
            
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
}

fetchDrawersBank(){
  this.receiptService.getDrawersBanks()
      .subscribe({
        next: (data) => {
          this.drawersBank = data;
     
        },
        error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
}


get allocations(): FormArray {
  return this.receiptingDetailsForm.get('allocations') as FormArray;
}
// fetchTransactions(
//   systemShortDesc: string,
//   clientCode: number,
//   accountCode: number,
//   receiptType: string,
//   clientShtDesc: string
// ): void {
//   this.receiptService
//     .getTransactions(systemShortDesc, clientCode, accountCode, receiptType, clientShtDesc)
//     .subscribe({
//       next: (response) => {
//         this.transactions = response.data;
//         console.log('transactios>>',this.transactions);
//         this.populateAllocations(); // Add form controls for each transaction
//       },
//       error: (err) => console.error('Error fetching transactions', err),
//     });
// }
fetchTransactions( 
  systemShortDesc: string,
  clientCode: number,
  accountCode: number,
  receiptType: string,
  clientShtDesc: string): void {
  this.receiptService.getTransactions(systemShortDesc, clientCode, accountCode, receiptType, clientShtDesc)
  .subscribe({
    next: (response) => {
      this.transactions = response.data;

      // Populate the form array
      // const transactionsFormArray = this.receiptingDetailsForm.get('transactions') as FormArray;
      // transactionsFormArray.clear();

      // this.transactions.forEach((transaction) => {
      //   transactionsFormArray.push(
      //     this.fb.group({
      //       receiptNumber: [147], // Handcoded for now
      //       allocatedAmount: [0, Validators.required], // Default allocation
      //     })
      //   );
      // });

      // console.log('Form transactions:', transactionsFormArray.value);
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
      
    },
  });
}

// onAllocatedAmountChanged(index: number,transaction:any): void {
//  // const allocatedAmount = this.allocations.at(index).get('allocatedAmount')?.value || 0;
// const allocatedamount= this.receiptingDetailsForm.get('allocatedAmount')?.value;
// console.log('allocated amount>',allocatedamount,index);
//   // Validate the allocated amount
//   // if (allocatedAmount < 0) {
//   //   alert('Allocated amount must be a positive number!');
//   //   this.allocations.at(index).get('allocatedAmount')?.setValue(0);
//   //   return;
//   // }

//   // Update the total allocated amount
//   // this.updateTotalAllocatedAmount();

//   // Ensure allocatedAmounts array has the same size as rows
//   this.allocatedAmounts[index] = Number(allocatedamount[index] || 0); // Update the specific index with the new value

//   // Calculate the sum
//   this.totalAllocatedAmounts = this.allocatedAmounts.reduce((sum, amount) => sum + amount, 0);

//   console.log('Updated allocated amount>', allocatedamount, index);
//   console.log('Current sum of allocated amounts>', this.totalAllocatedAmounts);

// }
onAllocatedAmountChanged(index: number, transaction: any): void {
  const allocatedAmountArray = this.receiptingDetailsForm.get('allocatedAmount')?.value;

  if (allocatedAmountArray && Array.isArray(allocatedAmountArray)) {
    // Ensure the specific index value is updated
    // allocatedAmountArray[index] = this.sanitizeInput(allocatedAmountArray[index]);

    // Calculate the sum, converting strings to numbers
    // this.totalAllocatedAmounts = allocatedAmountArray.reduce((sum, value) => {
    //   const numericValue = Number(value || 0); // Convert to number, defaulting to 0 if empty
    //   return sum + numericValue;
    // }, 0);
  //  console.log(allocatedAmountArray);
    this.totalAllocatedAmount = allocatedAmountArray.reduce((sum, value) => {
      const numericValue = Number(value || 0); // Convert to number, defaulting to 0
      return sum + (numericValue >= 1 ? numericValue : 0); // Include only valid numbers
    }, 0);

   // console.log('Updated allocated amount>', allocatedAmountArray, index, transaction);
   // console.log('Current sum of allocated amounts>', this.totalAllocatedAmounts);
  }
}

// Utility function to sanitize input
private sanitizeInput(input: string | null): string {
  return input?.trim() || ''; // Remove extra spaces and ensure no null values
}
updateTotalAllocatedAmount(): void {
  this.totalAllocatedAmount = this.allocations.controls.reduce((sum, control) => {
    return sum + (control.get('allocatedAmount')?.value || 0);
  }, 0);
}

populateAllocations(): void {
  this.allocations.clear(); // Clear previous allocations
  this.transactions.forEach((transaction) => {
    this.allocations.push(
      this.fb.group({
        // receiptNumber: [  this.branchNo],
        receiptNumber: [147, Validators.required], // Manually set receiptNumber to 147
        allocatedAmount: [0, [Validators.required, Validators.min(0)]],
      })
    );
  });
}
calculateTotalAllocated(): void {
  this.totalAllocatedAmount = this.allocations.controls
    .map((control) => control.value.allocatedAmount || 0)
    .reduce((a, b) => a + b, 0);
}


  onAllocate(): void {
    const amountIssued = this.receiptingDetailsForm.get('amountIssued')?.value;
    const transactions = this.receiptingDetailsForm.get('transactions') as FormArray;
  
    // Sum allocated amounts
    const totalAllocated = transactions.controls.reduce((sum, control) => {
      return sum + (control.get('allocatedAmount')?.value || 0);
    }, 0);
  
    if (totalAllocated > amountIssued) {
      alert('The sum of allocated amounts exceeds the issued amount!');
      return;
    }
  
    // Filter transactions with allocatedAmount > 0
    const receiptParticulars = transactions.controls
      .filter((control) => control.get('allocatedAmount')?.value > 0)
      .map((control) => ({
        receiptNumber: control.get('receiptNumber')?.value,
        allocatedAmount: control.get('allocatedAmount')?.value,
      }));
  
    if (receiptParticulars.length === 0) {
      alert('No valid transactions to allocate!');
      return;
    }
  
    const payload = { receiptParticulars };
  
   // console.log('Payload to submit:', payload);
  
    // Submit payload
    this.submitAllocation(payload);
  }
  
  

submitAllocation(payload: any): void {
  this.receiptService.postAllocation(940,payload).subscribe({
    next: (response) => {
    //  console.log('Allocation successful:', response);
      alert('Allocation posted successfully!');
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    
      alert('Failed to post allocation. Please try again.');
    },
  });
}


// submitAllocation(): void {
//   const payload: AllocationDTO = {
//     receiptParticulars: [
//       {
//         receiptNumber: 12345,
//         capturedBy: 940,
//         systemCode: 567,
//         branchCode: 1,
//         clientCode: 7890,
//         clientShortDescription: 'Test Client',
//         receiptType: 'Manual',
//         clientName: 'John Doe',
//         sslAccountCode: 2345,
//         accountTypeId: 'Savings',
//         referenceNumber: 'REF123',
//         receiptParticularDetails: [
//           {
//             policyNumber: 'POL123',
//             referenceNumber: 'REF001',
//             transactionNumber: 1001,
//             batchNumber: 5001,
//             premiumAmount: 10000,
//             loanAmount: 5000,
//             pensionAmount: 2000,
//             miscAmount: 300,
//             endorsementCode: 2,
//             endorsementDrCrNumber: 'END123',
//             includeCommission: 'Y',
//             commissionAmount: 200,
//             overAllocated: 0,
//             includeVat: 'Y',
//             clientPolicyNumber: 'CP123'
//           }
//         ]
//       }
//     ]
//   };

//   this.receiptService.postAllocation(940, payload).subscribe({
//     next: (response) => {
//       console.log('Allocation saved successfully:', response);
//       alert('Allocation posted successfully!');
//     },
//     error: (err) => {
//       console.error('Error posting allocation:', err);
//       this.globalMessagingService.displayErrorMessage(
//         'Error',
//         'Failed to post allocation. Please try again.'
//       );
//     },
//   });
// }

fetchNarrations() {
  this.receiptService.getNarrations().subscribe({
    next: (response) => {
      this.narrations = response.data || []; 
      this.filteredNarrations = [...this.narrations]; // Copy for display
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    }
  });
}


fetchCurrencies(): void {
  this.receiptService.getCurrencies(2).subscribe({
    next: (response) => {
     
      this.currencies = response.data; // Assign fetched currencies
     // console.log(this.currencies);

      if (this.currencies.length > 0) {
        // Use the first currency as the default
        const defaultCurrency = this.currencies[0].code;
       this.currencySymbolGlobal=this.currencies[0].symbol;
       
        this.currencyGlobal = defaultCurrency; // Assign the first currency's code as default
        
       
    this.receiptingDetailsForm.get('currency')?.patchValue(defaultCurrency);
      
        // this.receiptingDetailsForm.get('currency')?.patchValue( this.currencySymbolGlobal); // Set default in the form field
   
      } else {
        //console.warn('No currencies found in the response.');
      }
    },
    error: (err) => {
      
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
      
    }
  });
}



onCurrencyChanged(event: Event): void {
  this.selectedCurrencyCode = (event.target as HTMLSelectElement).value;
// Find the currency from the list
const selectedCurrency = this.currencies.find(
  (currency) => currency.code === this.selectedCurrencyCode
);

// Get the symbol of the selected currency
this.selectedCurrencySymbol = selectedCurrency ? selectedCurrency.symbol : '';

 this.selectedCurrencyCode= (event.target as HTMLSelectElement).value;
// console.log("global currency>", this.selectedCurrencyCode)
  
  this.receiptService.getManualExchangeRateParameter('YES')
.subscribe({
  next: (response) => {
    
    const isManualRateSetup = response.data === "N"; // Now works as expected
    console.log(response);
    if(isManualRateSetup){
     
      this.fetchDefaultExchangeRate();
    }else if(!isManualRateSetup){
      this.showExchangeRateModal2();
    }
   
   
  },
  error: (err) => {
    this.globalMessagingService.displayErrorMessage('Error', err.error.error);
   
  }
});

}


fetchDefaultExchangeRate(): void {
  this.receiptService.getExchangeRate(this.selectedCurrencyCode, 2)
    .subscribe({
      next: (response) => {
     
        this.exchangeRates = response.data; // `data` is now a string
       // alert(`the exchange rate is ${this.exchangeRates}`);
        this.showExchangeRateModal(); // Show modal with exchange rate
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.error);
      
      }
    });
}


confirmExchangeRateValue():void{
if(this.exchangeRate > 0){
  
  this.receiptService.postManualExchangeRate(this.selectedCurrencyCode,1,'FMSADMIN',this.exchangeRate).subscribe({
    next: (response) => {

      this.closeModal2(); // Close modal on success
    },
    error: (err) => {
     
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Failed to save manual exchange rate. Please try again.'
      );
    },
  });
}else{
  alert('please enter a valid value!');
}
}
confirmExchangeRate(): void {
    this.closeModal();
}

closeModal2(): void {
  const modalElement = document.getElementById('exchangeRateModal2');
  if (modalElement) {
    const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
    bootstrapModal?.hide();
  }
}
closeModal(): void {
  const modalElement = document.getElementById('exchangeRateModal');
  if (modalElement) {
    const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
    bootstrapModal?.hide();
  }
}

showExchangeRateModal(): void {
  const modal = new bootstrap.Modal(document.getElementById('exchangeRateModal')!);
  modal.show();
}
showExchangeRateModal2():void{
  const modal = new bootstrap.Modal(document.getElementById('exchangeRateModal2')!);
  modal.show();
}


fetchBanks(){
  this.receiptService.getBanks(1,268)
      .subscribe({
        next: (response) => {
        this.bankAccounts = response.data;
        
       },
        error: (err) => {
          
           this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
}

showChargesModal(): void {
  // Open the modal programmatically every time "Yes" is clicked
  const chargesModal = new bootstrap.Modal(
    document.getElementById('chargesModal')
  );
  chargesModal.show();
}

  // Handle changes in charge radio button
  onChargesChange(option: string): void {
    if (option === 'yes') {
      this.chargesEnabled = true;
      this.fetchCharges();
      // this.fetchExistingCharges();
      const chargeType = this.receiptingDetailsForm.get('selectedChargeType')?.value;
      const chargeAmount = this.receiptingDetailsForm.get('chargeAmount')?.value;
      this.chargeAmount=chargeAmount;
     // console.log(chargeAmount);
      //this.receiptingDetailsForm.get('chargeAmount')?.setValue(null); // Clear charge amount
      const modal = document.getElementById('chargesModal');
      if (modal) {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    }
  }

  // Fetch charge types
  fetchCharges(): void {
    this.receiptService.getCharges(2, 1).subscribe({
      next: (response) => {
        this.charges = response.data;
       // console.log(this.charges);
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.error);
       
      },
    });
  }

  // Fetch existing charges
  fetchExistingCharges(): void {
    
    this.receiptService.getExistingCharges(147).subscribe({
      next: (response) => {
        this.chargeList = response.data;
        
      //  console.log('Existing charges:', this.chargeList);
      },
      error: (err) => {
       
        this.globalMessagingService.displayErrorMessage('Error', err.error.error);
      },
    });
  }

  
   
    
    
  
    // Edit a charge
    editCharge(index: number): void {
      const charge = this.chargeList[index];
      this.editReceiptExpenseId = charge.id; // Store receiptExpenseId for this charge
      this.receiptChargeId = charge.receiptChargeId; // Store receiptChargeId if needed
  
      // Populate the form with the charge details
      this.receiptingDetailsForm.patchValue({
        selectedChargeType: charge.receiptChargeName,
        chargeAmount: charge.amount,
      });
  
      // Show the Submit button and hide Save button
      this.isSubmitButtonVisible = true;
      this.isSaveBtnActive = false;
    }
  
    // Submit edited charge
    onEditSubmit(): void {

      const chargeAmount = this.receiptingDetailsForm.get('chargeAmount')?.value;
      const selectedChargeType = this.receiptingDetailsForm.get('selectedChargeType')?.value;
   // Populate the form with the charge details
      
      if (!chargeAmount || !selectedChargeType || !this.editReceiptExpenseId || !this.receiptChargeId) {
        alert('All fields are required!');
        return;
      }
  
      const payload = {
        addEdit: 'E',
        receiptExpenseId: this.editReceiptExpenseId, // Use the stored receiptExpenseId
        receiptNo: 147, // Assuming a static receipt number for now
        receiptChargeId: this.receiptChargeId, // Use the stored receiptChargeId
        receiptChargeAmount: chargeAmount, // Use the updated charge amount
        suspenseRct: 'N',
      };
  
      this.receiptService.postChargeManagement(payload).subscribe({
        next: (response) => {
         // alert('Charge updated successfully!');
         
             // Update chargeAmount input field with saved value
     
          
          this.isSubmitButtonVisible = false; // Hide the Submit button after submission
          
            // Reset the form to clear input fields
             // Update chargeAmount input field with edited value
      this.receiptingDetailsForm.patchValue({
        chargeAmount: chargeAmount,
      });
          // Optionally refresh the charge list or handle other UI updates'
          const modalElement = document.getElementById('chargesModal');
          const modalInstance = bootstrap.Modal.getInstance(modalElement!);
          
          if (modalInstance) {
            modalInstance.hide();
            
          }
          this.refreshCharges();
        },
        error: (err) => {
         
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to update charge. Please try again.'
          );
        },
      });
      this.receiptingDetailsForm.patchValue(
       
        chargeAmount,
      );
      this.isSaveBtnActive=true;
    }
  
  
  // Delete a charge
  deleteCharge(index: number): void {
    const charge = this.chargeList[index];
    
    const payload = {
      addEdit: 'D',
      receiptExpenseId: charge.id,
      receiptNo: 147,
      receiptChargeId: charge.receiptChargeId,
      receiptChargeAmount:this.chargeAmount,
      suspenseRct: 'N'
    };

    this.receiptService.postChargeManagement(payload).subscribe({
      next: (response) => {
      //  console.log('Charge deleted successfully:', response);
      //  alert('deleted successfully');
        this.chargeList.splice(index, 1); // Remove from list
      },
      error: (err) => {
        
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Failed to delete charge. Please try again.'
        );
      },
    });
  }

  // Save a charge
  saveCharges(): void {
    const chargeType = this.receiptingDetailsForm.get('selectedChargeType')?.value;
  const chargeAmount = this.receiptingDetailsForm.get('chargeAmount')?.value;
  this.chargeAmount = chargeAmount;

  const selectedCharge = this.charges.find((charge) => charge.name === chargeType);
   this.receiptChargeId = selectedCharge.id; // Fetch the receiptChargeId
 
  if(chargeAmount && chargeType){
    this.submitChargeManagement();
   
  }else{
    alert('all fields are required!');
  }
  this.fetchExistingCharges();
  }



submitChargeManagement(): void {
  const payload: ChargeManagementDTO = {
    addEdit: 'A',
    //receiptExpenseId: 12345678,
    // receiptNo: this.branchNo,
    receiptNo:147,
    receiptChargeId: this.receiptChargeId,
    receiptChargeAmount:this.chargeAmount,
    suspenseRct: 'N'
  };


  this.receiptService.postChargeManagement(payload).subscribe({
    next: (response) => {
       // Ensure modal is active before hiding
       const modalElement = document.getElementById('chargesModal');
       const modalInstance = bootstrap.Modal.getInstance(modalElement!);
       const getAmount=this.receiptingDetailsForm.get('chargeAmount')?.value;
        // Reset the form to clear input fields
    // Update chargeAmount input field with saved value
    this.receiptingDetailsForm.patchValue({
      chargeAmount: this.chargeAmount,
    });
       if (modalInstance) {
         modalInstance.hide();
        
       } else {
       
       }
   
      
    },
    error: (err) => {
     
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Failed to post charge management. Please try again.'
      );
    },
  });
}
// Refresh charges list after add or edit 
refreshCharges(): void {
  // Call your service to fetch the updated charges
  this.fetchCharges();
}

fetchAccountTypes() {
  this.receiptService.getAccountTypes(2, 2003, 1).subscribe({
    next: (response) => {
      this.accountTypes = response.data || [];
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
      alert('Please provide all the required fields.');
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
      alert('Invalid search criteria selected.');
      return;
    }
  
    this.fetchClients(apiSearchCriteria, searchQuery.trim());
  }
  
  fetchClients(searchCriteria: string, searchValue: string): void {
    const accountType = this.receiptingDetailsForm.get('accountType')?.value;
    const selectedAccountType = this.accountTypes.find((type) => type.name === accountType);
  
    if (selectedAccountType) {
      const { systemCode, accCode } = selectedAccountType;
      this.loading = true;
  
      this.receiptService.getClients(systemCode, accCode, searchCriteria, searchValue).subscribe({
        next: (response) => {
          this.clients = response.data || [];
         // console.log('Clients:', this.clients);
          //alert('clients found');

          if (!this.clients.length) {
            alert('No clients found for the given criteria.');
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
      alert('Invalid account type selected.');
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

onPaymentModeSelected(): void {
  const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;
 // console.log(`Payment Mode Selected: ${paymentMode}`);
  this.updatePaymentModeFields(paymentMode);
}

updatePaymentModeFields(paymentMode: string): void {
  const chequeTypeModalElement = document.getElementById('chequeTypeModal');
  const chequeTypeModal = chequeTypeModalElement
    ? Modal.getOrCreateInstance(chequeTypeModalElement)
    : null;

  if (paymentMode === 'CASH') {
    
     this.receiptingDetailsForm.patchValue({ drawersBank: 'N/A' });
     chequeTypeModal?.hide();
     this.receiptingDetailsForm.patchValue({ chequeType: '' });
     this.receiptingDetailsForm.get('drawersBank')?.disable();
     this.handleCashMode(chequeTypeModal);
  } else if (paymentMode === 'CHEQUE') {
    this.handleChequeMode(chequeTypeModal);
    this.receiptingDetailsForm.get('drawersBank')?.enable();
  
  } else {
   this.resetChequeFields(chequeTypeModal);
   this.receiptingDetailsForm.get('drawersBank')?.enable();
  }

 
}

private handleCashMode(chequeTypeModal: Modal | null): void {
  this.receiptingDetailsForm.patchValue({ drawersBank: 'N/A' });
  chequeTypeModal?.hide();

  this.receiptingDetailsForm.get('drawersBank')?.disable();
}

private handleChequeMode(chequeTypeModal: Modal | null): void {
  this.receiptingDetailsForm.get('chequeType')?.enable();
  chequeTypeModal?.show();

  // Set the payment mode to CHEQUE
  this.receiptingDetailsForm.patchValue({ paymentMode: 'CHEQUE' });

}

private resetChequeFields(chequeTypeModal: Modal | null): void {
  chequeTypeModal?.hide();
  this.receiptingDetailsForm.get('chequeType')?.disable();
  this.receiptingDetailsForm.patchValue({ chequeType: '' });
}

onCancelChequModal(chequeTypes:any){
  if(this.chequeTypes == null){
alert('please select cheque type');
  }else{
   
    const ChequeTypeModal= new bootstrap.Modal(document.getElementById('chequeTypeModal')!);
    ChequeTypeModal.hide();
   
  }

}

onChequeTypeSelected(): void {
  const chequeType = this.receiptingDetailsForm.get('chequeType')?.value;
  //console.log('Selected Cheque Type:', chequeType);

  const chequeTypeModalElement = document.getElementById('chequeTypeModal');
  const chequeTypeModal = chequeTypeModalElement
    ? Modal.getOrCreateInstance(chequeTypeModalElement)
    : null;

  chequeTypeModal?.hide(); // Close the modal after selection
}

// setDateRestrictions(): void {
//   const today = new Date().toISOString().split('T')[0]; // Get today's date

//   if (!this.backdatingEnabled) {
//     // If backdating is not allowed, restrict to current or future dates
//     this.minDate = today;
//     this.receiptingDetailsForm.get('receiptDate')?.patchValue(today); // Default to today’s date
//   } else {
//     // Allow all dates including past ones
//     this.minDate = ''; // No restriction
//   }
// }




onBank(event: Event): void {
  const selectedBankName = (event.target as HTMLSelectElement).value;

  this.receiptService.getReceiptingPoints(1).subscribe({
    next: (response: { data: ReceiptingPointsDTO[] }) => {
      if (response.data.length > 0) {
        const receiptingPoint = response.data[0]; // Use the first receipting point
        this.receiptingDetailsForm.get('receiptingPoint')?.setValue(receiptingPoint.name);

        // Optionally store the receiptingPoint for further use
        this.currentReceiptingPoint = receiptingPoint;
       // console.log(this.currentReceiptingPoint.name);
      } else {
        this.globalMessagingService.displayErrorMessage('Error', 'No receipting point data found.');
      }
    },
    error: (err) => {
      
      this.globalMessagingService.displayErrorMessage('Error', err.error?.message || 'Failed to fetch receipting points.');
    }
  });
  this.fetchReceiptNumber();

}



onFileSelected(event: any): void {
  const files = event.target.files;
  if (files && files.length > 0) {
    const fileArray = Array.from(files) as File[];
    this.fileDescriptions.push(...fileArray.map(file => ({ file, description: '' })));
    this.openModal(0); // Open modal for the first file
  }
}

openModal(index: number): void {
  const modalElement= document.getElementById('fileDescriptionModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
  
}


saveFileDescription(): void {

   

    this.receiptingDetailsForm.patchValue({description:'description'});
    const description = this.receiptingDetailsForm.get('description')?.value;
  //  this.fileDescriptions[this.currentFileIndex].description = description;
   console.log(description);
  const modalElement = document.getElementById('fileDescriptionModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement!);
   
  if (modalInstance) {
    modalInstance.hide();
    
  }

}

closeFileModal(): void {
  const modalElement = document.getElementById('fileDescriptionModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement!);
  if (modalInstance) {
    modalInstance.hide();
    
  }
}
onRemoveFile(index: number): void {
  this.fileDescriptions.splice(index, 1);
}


 }