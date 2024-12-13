import { Component, OnInit,NgZone,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import {DrawersBankDTO,NarrationDTO,ReceiptNumberDTO,GenericResponse,ReceiptingPointsDTO,Transaction,Receipt,Client, PaymentModesDTO, AccountTypeDTO, CurrencyDTO, BankDTO, ClientsDTO, ChargesDTO, TransactionDTO, ExchangeRateDTO, ChargeManagementDTO, AllocationDTO, ExistingChargesResponseDTO, UploadReceiptDocsDTO, ReceiptSaveDTO, ReceiptParticularDetailsDTO, GetAllocationDTO, DeleteAllocationResponseDTO} from '../../data/receipting-dto'
import { Modal } from 'bootstrap';

import * as bootstrap from 'bootstrap'; 

import {SessionStorageService} from "../../../../shared/services/session-storage/session-storage.service";
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';

import { ReceiptService } from '../../services/receipt.service';
import { descriptors } from 'chart.js/dist/core/core.defaults';
import { AuthService } from 'src/app/shared/services/auth.service';



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
  getAllocation:GetAllocationDTO[]=[];
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
currentReceiptingPoint:any;
  manualExchangeRate:any;
  allocation:boolean=true;
  // allocatedAmounts: number[] = []; // Array to store allocated amounts
  totalAllocatedAmounts: number = 0;
  isSubmitButtonVisible = false;
isSaveBtnActive=true;
  @ViewChild('fileDescriptionModal', { static: false }) fileDescriptionModal!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  // receiptingDetailsForm!: FormGroup;
  fileDescriptions: { file: File; description: string }[] = [];
  currentFileIndex = 0;
  username = 'frank'; // Replace with actual user retrieval
  //receiptNumberFile = 147; // Replace with actual receipt number
  userCode = 940;     // Replace with actual user code
  isAllocationCompleted = false;
 
  totalAllocatedAmount = 0;
  amountIssued: number = 0; // Initialize amountIssued
constructor(
  private fb: FormBuilder,

  
  private sessionStorage: SessionStorageService,
  private globalMessagingService:GlobalMessagingService,
  private receiptService:ReceiptService,
 private authService:AuthService
) {


}
ngOnInit(): void {
   this.captureReceiptForm();
   this.fetchCurrencies();
  this.fetchPaymentModes();
 
  //this.fetchExistingCharges();
  this.fetchAccountTypes();
  this.fetchBanks();

this.fetchDrawersBank();
this.fetchNarrations();

 // this.fetchDefaultExchangeRate();
// this.fetchManualExchangeRateParameter();
// this.fetchExchangeRate();
 //this.fetchCharges();
//this.submitChargeManagement();

this.loggedInUser = this.authService.getCurrentUser();
//console.log('my alogged in user',this.loggedInUser.code);
//console.log('logged user>',this.loggedInUser);
//console.log(this.currencies);
//console.log('>>>',this.sessionStorage.getItem("SESSION_ORG_CODE"));
// this.orgCode = this.sessionStorage.getItem("SESSION_ORG_CODE");
 this.userCode=this.sessionStorage.getItem('SESSION__USER_CODE');
//console.log('user org code',this.userCode);
//alert(this.loggedInUser.code);


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
      
      chargeAmount: [ ''],
      selectedChargeType:['', Validators.required],
      
      description: ['', Validators.required],
     // allocatedAmount: this.fb.array([]) ,
//      allocatedAmount: this.fb.array(this.initializeAllocatedAmounts()),
    deductions: [''], 
    exchangeRate:[''],
    exchangeRates:[''],
    capitalInjection: [''], 
    allocationType: [''],
    accountType: ['', Validators.required],
      searchCriteria: [{ value: '', disabled: true }, Validators.required],
      searchQuery: [{ value: '', disabled: true }, Validators.required],
      allocatedAmount: this.fb.array([]) // FormArray for allocated amounts
   // allocations: this.fb.array([]), // Dynamically add transaction allocations here
   // transactions: this.fb.array([]), 
  });
}






fetchManualExchangeRateParameter() {
  this.receiptService.getManualExchangeRateParameter('YES').subscribe({
    next: (response) => {
      this.manualExchangeRate = response.data;
      
     // this.system = response.Systemshortdesc
    },
    error: (err) => {
      //console.log(err)
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
  this.receiptService.getReceiptNumber(1, this.loggedInUser.code).subscribe({
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
    //console.log(response);
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
      this.fetchExistingCharges();
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
  this.receiptService.getAccountTypes(2, 940, 1).subscribe({
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
      //this.loading = true;
  
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
 // this.fetchReceiptNumber();

}

onFileSelected(event: any): void {
  const files: FileList | null = event.target.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.fileDescriptions.push({ file, description: '' });
    }
    this.openModal(this.fileDescriptions.length -1); // Open modal for the last added file
  }
}

openModal(index: number): void {
  this.currentFileIndex = index;
  const modalElement = document.getElementById('fileDescriptionModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }

}
saveFileDescription(): void {
  // console.log("Form Valid?", this.receiptingDetailsForm.valid);
  // console.log("Description Control Valid?", this.receiptingDetailsForm.get('description')?.valid);
  // console.log("Description Value:", this.receiptingDetailsForm.get('description')?.value);
  if (this.receiptingDetailsForm.get('description')?.valid) {
    const description = this.receiptingDetailsForm.get('description')?.value;
    if (description) { //Check if description is not empty
      
      this.fileDescriptions[this.currentFileIndex].description = description;
      this.receiptingDetailsForm.reset(); // Reset the form
      const modalElement = document.getElementById('fileDescriptionModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement!);
      if (modalInstance) {
        modalInstance.hide();
      }
    } else {
      alert('Description is required!'); //User-friendly message
    }
  } else {
      alert('Please fill in the description field.');
  }
}
// saveFileDescription(): void {
//   this.receiptingDetailsForm.patchValue({description:''})
//   const getdesc=this.receiptingDetailsForm.get('description')?.value;
//   alert(getdesc);
//   // if (this.receiptingDetailsForm.valid) {
   
//   //   const description = this.receiptingDetailsForm.get('description')?.value;
//   //   this.fileDescriptions[this.currentFileIndex].description = description;
//   //   alert(description);
//   //   this.receiptingDetailsForm.reset(); // Reset the form after saving
//   //   const modalElement = document.getElementById('fileDescriptionModal');
//   //   const modalInstance = bootstrap.Modal.getInstance(modalElement!);
//   //   if (modalInstance) {
//   //     modalInstance.hide();
//   //   }
//   // }else{
//   //   alert('invalid');
//   // }
// }

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

uploadFiles(): void {
  if (this.fileDescriptions.length === 0) return;

  const formData = new FormData();
  const fileData: { originalFilename: string; docDescription: string }[] = [];

  this.fileDescriptions.forEach(fileDesc => {
    const filename = fileDesc.file.name; 
   // console.log("Uploading file:", filename);
    formData.append('files', fileDesc.file, fileDesc.file.name); //Append files to FormData
    fileData.push({
      originalFilename: fileDesc.file.name,
      docDescription: fileDesc.description
    });
  });

  const requestBody: UploadReceiptDocsDTO = {
    originalFilename: '', //Not needed in request body. handled in FormData
    docDescription: '',    //Not needed in request body. handled in FormData
    username: this.username,
    receiptNumber: 147,
    userCode: this.userCode,
    uploadedFiles: fileData.map(item => item.originalFilename) //Only file names needed here
  };

  this.receiptService.uploadReceiptDocs(requestBody, formData).subscribe({
    next: response => {
     // console.log('Files uploaded successfully:', response);
      //Clear fileDescriptions after successful upload
      this.fileDescriptions = [];
    },
    error: error => {
      console.error('Error uploading files:', error);
      // Handle error appropriately (e.g., display error message to user)
    }
  });
}

// onFileSelected(event: any): void {
//   const files = event.target.files;
//   if (files && files.length > 0) {
//     const fileArray = Array.from(files) as File[];
//     this.fileDescriptions.push(...fileArray.map(file => ({ file, description: '' })));
//     this.openModal(0); // Open modal for the first file
//   }
// }

// openModal(index: number): void {
//   const modalElement= document.getElementById('fileDescriptionModal');
//   const modalInstance = new bootstrap.Modal(modalElement);
//   modalInstance.show();
  
// }


// saveFileDescription(): void {

   

//     this.receiptingDetailsForm.patchValue({description:'description'});
//     const description = this.receiptingDetailsForm.get('description')?.value;
//   //  this.fileDescriptions[this.currentFileIndex].description = description;
//    console.log(description);
//   const modalElement = document.getElementById('fileDescriptionModal');
//   const modalInstance = bootstrap.Modal.getInstance(modalElement!);
   
//   if (modalInstance) {
//     modalInstance.hide();
    
//   }

// }

// closeFileModal(): void {
//   const modalElement = document.getElementById('fileDescriptionModal');
//   const modalInstance = bootstrap.Modal.getInstance(modalElement!);
//   if (modalInstance) {
//     modalInstance.hide();
    
//   }
// }
// onRemoveFile(index: number): void {
//   this.fileDescriptions.splice(index, 1);
// }

onClickClient(selectedClient) {
  this.selectedClient = selectedClient; // Store the selected client
  this.fetchTransactions(
    selectedClient.systemShortDesc,
    selectedClient.code,
    selectedClient.accountCode,
    selectedClient.receiptType,
    selectedClient.shortDesc,
    

  );
 // console.log("selected client>>", selectedClient.accountCode);
  
}

get allocatedAmountControls(): FormArray {
  return this.receiptingDetailsForm.get('allocatedAmount') as FormArray;
}
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
       //console.log(this.transactions);
  // Clear and rebuild the FormArray
  this.allocatedAmountControls.clear();
  this.transactions.forEach(() => {
    this.allocatedAmountControls.push(this.fb.group({
      allocatedAmount: [0, Validators.required], // Default value and validation
      commissionChecked:  ['N'] // Default to unchecked
    }));
  });
  // this.transactions.forEach((transaction, index) => {
  //   this.allocatedAmountControls.push(this.fb.control(0, Validators.required)); //add Validators.required to every control.
  // });
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
      
    },
  });
}
// getFormControl(index: number,controlName: string): FormControl | null {
//   return (this.allocatedAmountControls.at(index) as FormGroup).get(controlName) as FormControl;
//   // const allocatedAmountArray = this.receiptingDetailsForm.get('allocatedAmount') as FormArray;
//   // return allocatedAmountArray.at(index) as FormControl;
// }
getFormControl(index: number, controlName: string): FormControl | null {
  const allocatedAmountArray = this.receiptingDetailsForm.get('allocatedAmount') as FormArray;
  const formGroup = allocatedAmountArray.at(index) as FormGroup;
  return formGroup ? formGroup.get(controlName) as FormControl : null;
}

calculateTotalAllocatedAmount(): void {
  this.totalAllocatedAmount = this.allocatedAmountControls.value.reduce(
    (total: number, item: { allocatedAmount: number }) => total + item.allocatedAmount,
    0
  );

  //console.log('Total Allocated Amount:', this.totalAllocatedAmount);
}
// calculateTotalAllocatedAmount(): void {
//   this.totalAllocatedAmount = this.allocatedAmountControls.value.reduce(
//     (total: number, amount: number) => total + amount,
//     0
//   );

 
//   console.log('amounts',this.totalAllocatedAmount);
// }
onCommissionCheckedChange(index: number, event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;
 // console.log(`Checkbox at index ${index} is checked:`, isChecked);

  // Update the corresponding form control value
  const commissionControl = this.getFormControl(index, 'commissionChecked');
  if (commissionControl) {
    const newValue = isChecked ? 'Y' : 'N';
    commissionControl.setValue(newValue);
  //  console.log(`Updated commissionChecked value for index ${index}:`, newValue);
  }
}


allocate(): any {
  const allocatedAmounts = this.allocatedAmountControls.value;
  const amountIssued = this.receiptingDetailsForm.get('amountIssued')?.value;
  const amountIssuedControl = this.receiptingDetailsForm.get('amountIssued');

 // console.log('Allocated Amounts:', allocatedAmounts);
  //console.log('Total Allocated Amount:', this.totalAllocatedAmount);

  // Step 1: Check if 'amountIssued' is untouched or invalid
  if (!amountIssuedControl?.touched || !amountIssued) {
    alert('Please enter the amount issued.');
    return false; // Stop further execution
  }

  // Step 2: Validate the total allocated amount against the issued amount
  if (this.totalAllocatedAmount < amountIssued) {
    alert('Amount issued is not fully allocated.');
    return false; // Stop further execution
  }

  if (this.totalAllocatedAmount > amountIssued) {
   // alert('Total allocated amount exceeds the amount issued.');
   
    this.globalMessagingService.displayErrorMessage('Error','Total allocated amount exceeds the amount issued.');
    return false; // Stop further execution
  }

  // Step 3: If all validations pass, submit the data
  //alert('Submitted successfully.');
  this.allocateAndPostAllocations();
  return true;
}
allocateAndPostAllocations(): void {
  const receiptParticulars = {
    receiptNumber: 147, // Example value, replace with actual
    capturedBy: this.loggedInUser.code,
    systemCode: this.selectedClient.systemCode,
    branchCode: 1, // Example value, replace with actual
    clientCode: this.selectedClient.code,
    clientShortDescription: this.selectedClient.shortDesc,
    receiptType: this.selectedClient.receiptType,
    clientName: this.selectedClient.name,
    sslAccountCode: this.selectedClient.accountCode,
    accountTypeId: '', // Example value, replace with actual
    referenceNumber: '', // Example value, replace with actual
    receiptParticularDetails: this.transactions.map((transaction,index) => ({
      policyNumber: transaction.clientPolicyNumber,
      referenceNumber: transaction.referenceNumber,
      transactionNumber: transaction.transactionNumber,
      batchNumber: transaction.policyBatchNumber,
      premiumAmount: transaction.amount,
      loanAmount: 0,
      pensionAmount: 0,
      miscAmount: 0,
      endorsementCode: 0,
      endorsementDrCrNumber: 'DR123456', // Example value, replace with actual
      // includeCommission: this.getFormControl(transaction.index, 'commissionChecked')?.value === 'Y' ? 'Y' : 'N',
      includeCommission: this.getFormControl(index, 'commissionChecked')?.value === 'Y' ? 'Y' : 'N',
      commissionAmount: transaction.commission,
      overAllocated: 0,
      includeVat: 'Y',
      clientPolicyNumber: transaction.clientPolicyNumber
    }))
  };

  // const userCode = this.loggedInUser.code; // Hardcoded for now, replace with dynamic value if needed
  // //const receiptNumber = this.receiptingDetailsForm.get('receiptNumber')?.value;
  // const receiptNumber = 147
  // const capturedBy = 940; // Replace with actual user ID
  // const systemCode = this.selectedClient.
  // systemCode; // Replace with actual system code
  // const branchCode = 1; // Replace with actual branch code
  // const clientCode =  this.selectedClient.accountCode; // Replace with actual client code
  // const clientShortDescription = this.selectedClient.systemShortDesc;
  // const receiptType = this.selectedClient.receiptType;
  // const clientName = this.selectedClient.clientName;
  // const sslAccountCode = 123; // Replace with actual account code
  // const accountTypeId = '';
  // const referenceNumber = '';

  // // Map allocated amounts to receiptParticularDetails
  // const receiptParticularDetails: ReceiptParticularDetailsDTO[] = this.transactions.map((transaction, index) => {
  //   const allocatedAmount = this.allocatedAmountControls.at(index)?.get('allocatedAmount')?.value || 0; // Get allocated amount for the transaction
  //   const commissionChecked = this.allocatedAmountControls.at(index)?.get('commissionChecked')?.value ? 'Y' : 'N'; // Get commission checkbox value

  //   return {
  //     policyNumber: transaction.clientPolicyNumber,
  //     referenceNumber: transaction.referenceNumber || '',
  //     transactionNumber: transaction.transactionNumber || 0,
  //     //batchNumber: transaction.batchNumber || 0,
  //     premiumAmount: allocatedAmount, // Set the allocated amount
  //    // loanAmount: transaction.loanAmount || 0,
  //     //pensionAmount: transaction.pensionAmount || 0,
  //     //miscAmount: transaction.miscAmount || 0,
  //    // endorsementCode: transaction.endorsementCode || 0,
  //     //endorsementDrCrNumber: transaction.endorsementDrCrNumber || '',
  //     includeCommission: commissionChecked,
  //     commissionAmount: transaction.commission || 0,
  //     overAllocated: 0, // Update based on your logic
  //     includeVat: 'Y', // Set as needed
  //     clientPolicyNumber: transaction.clientPolicyNumber,
  //   };
  // });

  // const data: AllocationDTO = {
  //   receiptParticulars: [
  //     {
  //       receiptNumber,
  //       capturedBy,
  //       systemCode,
  //       branchCode,
  //       clientCode,
  //       clientShortDescription,
  //       receiptType,
  //       clientName,
  //       sslAccountCode,
  //       accountTypeId,
  //       referenceNumber,
  //       receiptParticularDetails,
  //     },
  //   ],
  // };
  const allocationData: AllocationDTO = {
    receiptParticulars: [receiptParticulars]
  };
  // Post the data
//   this.receiptService.postAllocation(this.loggedInUser.code, data).subscribe({
//     next: (response) => {
//       this.allocation=false;
      
//  this.getAllocations();

//     },
//     error: (err) => {
//       console.error('Error posting allocation:', err);
//       alert('Failed to submit allocation.');
//     },
//   });
this.receiptService.postAllocation(this.loggedInUser.code, allocationData).subscribe({
  next: (response) => {
  //  console.log('Allocation posted successfully:', response);
    this.allocation=false;
    this.getAllocations();
  },
  error: (err) => {
    console.error('Error posting allocation:', err);
  }
});
}

submitReceipt(): void {
  // if (this.receiptingDetailsForm.invalid) {
  //   console.error('Form is invalid');
  //   alert('invalid');
  //   return;
  // }
  alert('invalid');
  const formValues = this.receiptingDetailsForm.value;

  const receiptData: ReceiptSaveDTO = {
    receiptNo: 147,
    receiptCode: formValues.receiptNumber,
    receiptDate: formValues.receiptDate,
    amount: formValues.amountIssued,
    paidBy: formValues.receivedFrom,
    currencyCode: formValues.currency,
    branchCode: 1, // Set branch code dynamically if applicable
    paymentMode: formValues.paymentMode,
    paymentMemo: formValues.narration,
    docDate: formValues.documentDate,
    drawerBank: formValues.drawersBank,
    userCode: 123, // Replace with the actual user code
    narration: formValues.narration,
    insurerAccount: 'someInsurerAccount', // Replace dynamically
    receivedFrom: formValues.receivedFrom,
    grossOrNet: 'Gross', // Replace dynamically if needed
    sysShtDesc: 'Some Description', // Replace dynamically if needed
    receiptingPointId: formValues.receiptingPoint,
    receiptingPointAutoManual: 'Auto', // Replace dynamically
    capitalInjection: formValues.capitalInjection,
    chequeNo: 0, // Replace dynamically
    ipfFinancier: formValues.ipfFinancier,
    receiptSms: '', // Not used
    receiptChequeType: formValues.chequeType,
    vatInclusive: 'Yes', // Replace dynamically if needed
    rctbbrCode: '123', // Replace dynamically
    directType: 'Direct', // Replace dynamically
    pmBnkCode: 0, // Replace dynamically
    dmsKey: 'Key123', // Replace dynamically
    currencyRate: formValues.exchangeRate,
    internalRemarks: formValues.narration,
    manualRef: formValues.manualRef,
    bankAccountCode: formValues.bankAccount,
    grossOrNetAdminCharge: 'No', // Replace dynamically
    insurerAcc: 123, // Replace dynamically
    grossOrNetWhtax: 'None', // Replace dynamically
    grossOrNetVat: 'None', // Replace dynamically
    sysCode: 1, // Replace dynamically
    bankAccountType: formValues.accountType,
    receiptParticularDetailUpdateRequests: [
      {
        receiptParticularDetailCode: 0,
        premium: 200,
        loan: 0,
        pension: 0,
      },
    ],
  };

  this.receiptService.saveReceipt( receiptData).subscribe({
    next: (response) => { 
      alert('valid');

    },
     
      
    error: (error) =>{
      alert('invalid');
    }
      
    
  });
}

getAllocations(){
  this.receiptService.getAllocations(147,this.loggedInUser.code).subscribe({
    next:(response)=>{
//this.getAllocation=response.data;
this.getAllocation = response.data.filter(allocation => 
  allocation.receiptParticularDetails.some(detail => detail.premiumAmount > 0));
//console.log('allocated amounts',this.getAllocation);

this.isAllocationCompleted = true;
this.globalMessagingService.displaySuccessMessage('success', 'detail');

    },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Failed to fetch Allocations',err);
      alert('false');
    }
  })
}
deleteAllocation(receiptDetailCode: number): void {
  if (confirm('Are you sure you want to delete this allocation?')) {
    this.receiptService.deleteAllocation(receiptDetailCode).subscribe({
      next: (response: DeleteAllocationResponseDTO) => {
        if (response.success) {
          this.globalMessagingService.displaySuccessMessage('Success', 'Allocation deleted successfully');
          this.getAllocations(); // Refresh the list
        } else {
          this.globalMessagingService.displayErrorMessage('Error', response.msg);
        }
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete allocation');
      }
    });
  }
}

 }