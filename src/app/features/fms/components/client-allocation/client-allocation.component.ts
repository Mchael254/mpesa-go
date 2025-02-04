import { ChangeDetectorRef, Component } from '@angular/core';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { AllocationDTO, GetAllocationDTO, ReceiptNumberDTO, ReceiptSaveDTO, ReceiptUploadRequest, TransactionDTO } from '../../data/receipting-dto';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { filter } from 'rxjs';
import * as bootstrap from 'bootstrap'; 
import { Router } from '@angular/router';
import { DmsService } from 'src/app/shared/services/dms/dms.service';
@Component({
  selector: 'app-client-allocation',
  templateUrl: './client-allocation.component.html',
  styleUrls: ['./client-allocation.component.css']
})
export class ClientAllocationComponent {
//retrieved form controls from other screen

receivedFrom:string;
grossReceiptAmount:number;
receiptDate:Date;
drawersBank:string;
narration:string;
paymentRef:string;
documentDate:Date;
currency:string;
chequeType:string;
bankAccount:number;
receiptingPoint:string;
charges:string;
chargeAmount:number;
selectedChargeType:string;
paymentMode:string;
manualExchangeRate:number;
exchangeRate:number;
otherRef:string;
manualRef:string;






  //control flags
  receiptingDetailsForm:FormGroup;
  receiptingPointId:number;
  receiptingPointAutoManual:string;
  globalBankAccountVariable:number;
  globalBankType:string;
  defaultCurrencyId:number;
  userId:number;
  receiptNumber:string;
  globalReceiptBranchNumber:number;
  globalReceiptNumber: number;
  transactions: TransactionDTO[] = [];
  loggedInUser: any;
  allocation:boolean=false;
  allocatedAmounts: { allocatedAmount: number, commissionChecked: string }[] = [];
  totalAllocatedAmount: number = 0;
  amountIssued: number = 0; // Store amountIssued from storedData
  selectedClient: any = null; // ✅ Add this property
  globalAccountTypeSelected:any=null;
  allocationsReturned:any;
  globalGetAllocation:any;
  getAllocationStatus:boolean=false;
  isAllocationCompleted: boolean = false;
  isFileSaved:boolean=false;
  getAllocation:GetAllocationDTO[]=[];
  filteredTransactions:any[]=[];
  isAllocationPosted:boolean=false;
  fileUploaded:boolean=false;
  
  selectedBranch:number;
  defaultBranchId:number;
   // Existing properties...
   clientNameFilter: string = '';
   policyNumberFilter: string = '';
   amountFilter: number | null = null;
   balanceFilter: number | null = null;
   commissionFilter: number | null = null;
   isAmount:boolean=false;
   first: number = 0; // First row index
    rows: number = 5; // Rows per page
    totalRecords: number = 0; // Total number of records
    isAllocationComplete:boolean=false;
//file properties
currentFileIndex: number = 0;
fileDescriptions: { file: File; description: string }[] = []; // Initialize the array
isUploadDisabled: boolean = true; // Initialize as true (button is inactive by default)
isFileUploadButtonDisabled: boolean = false; // Controls the "File Upload" button state
selectedFile: File | null = null;
description: string = '';
base64Output: string = '';
fileIsUploaded=false;
globalDocId:string;
uploadedFile: any = null;
decodedFileUrl: string | null = null;
uploadedFiles: any[] = [];  // Store multiple files

  constructor(
    private receiptDataService:ReceiptDataService,
    private fb:FormBuilder,
    private globalMessagingService:GlobalMessagingService,
    private receiptService:ReceiptService,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
    private router:Router,
    private dmsService:DmsService
  ){
    
  }
  ngOnInit():void{
    this.captureReceiptForm();
    const storedData = this.receiptDataService.getReceiptData();
    let globalUserId=localStorage.getItem('UserId');
this.userId = globalUserId ? Number(globalUserId ) : null;
    this.transactions = this.receiptDataService.getTransactions();
    this.filteredTransactions = this.transactions;
   if(this.transactions ){
this.allocation=true;
   }
    this.loggedInUser = this.authService.getCurrentUser();
    let globalDefaultBranch=localStorage.getItem('defaultBranchId');
this.defaultBranchId = globalDefaultBranch ? Number(globalDefaultBranch) : null;
let globalSelectedBranch=localStorage.getItem('selectedBranch');
this.selectedBranch = globalSelectedBranch ? Number(globalSelectedBranch) : null;
let storedReceiptNo = localStorage.getItem('receiptNumber');

let receiptingPointId=localStorage.getItem('receiptigPointId');
this.receiptingPointId = Number(receiptingPointId);
let receiptingPointAutoManual=localStorage.getItem('receiptinPointManual');
this.receiptingPointAutoManual= receiptingPointAutoManual;
let defaultCurrencyId=localStorage.getItem('defaultCurrencyId');
this.defaultCurrencyId=Number(defaultCurrencyId);
//this.globalReceiptNumber = Number(storedReceiptNo);

    // console.log('logged in user',this.loggedInUser);
  // Get amountIssued from storedData (check if it exists first)
  if (storedData) {
    this.amountIssued = storedData.amountIssued || 0;
    this.paymentMode = storedData.paymentMode || '';
    this.paymentRef = storedData.paymentRef || '';
    this.manualRef = storedData.manualRef || '';
    this.currency = storedData.currency || '';
    this.documentDate = storedData.documentDate? new Date(storedData.documentDate) : null;  // Convert string to Date
    this.receiptDate =storedData.receiptDate ? new Date(storedData.receiptDate) : null;  // Convert string to Date
    this.charges = storedData.charges || '';
    this.chargeAmount = storedData.chargeAmount || 0;
    this.selectedChargeType =storedData.selectedChargeType || "";
    this.chequeType = storedData.chequeType || '';
    this.bankAccount = storedData.bankAccount || 0;
    this.exchangeRate = storedData.exchangeRate || 0;
    this.manualExchangeRate = storedData.manualExchangeRate || 0;
    this.otherRef = storedData.otherRef || '';
    this.drawersBank = storedData.drawersBank || '';
    this.narration =storedData.narration || '';
    this.receivedFrom = storedData.receivedFrom || '';
    this.grossReceiptAmount =storedData.grossReceiptAmount || 0;
    this.receiptingPoint = storedData.receiptingPoint || '';




  }
  console.log('payment mode>',this.paymentMode,this.amountIssued,this.narration);
let globalBankAccountVariable=localStorage.getItem('globalBankAccount');
this.globalBankAccountVariable=this.globalBankAccountVariable;
 let globalBankType=localStorage.getItem('globalBankType');
 this.globalBankType=globalBankType; 
    this.allocatedAmounts = this.receiptDataService.getAllocatedAmounts();
     // Initialize form controls for each transaction
    this.initializeAllocatedAmountControls();
    this.calculateTotalAllocatedAmount();
    let storedReceiptNumber = localStorage.getItem('receiptNumber');
    if (storedReceiptNumber) {
      this.globalReceiptNumber = Number(storedReceiptNumber);
      }

      this.selectedClient = this.receiptDataService.getSelectedClient(); // Retrieve stored client
this.globalAccountTypeSelected =  this.receiptDataService.getGlobalAccountTypeSelected();
if(this.globalAccountTypeSelected && this.globalAccountTypeSelected.actTypeShtDesc){
  //console.log('retrieved actTypeShtDesc>>',this.globalAccountTypeSelected);
}
  if (this.selectedClient && this.selectedClient.code) {
    //console.log('Retrieved SELECTED CLIENT:', this.selectedClient);
  }
  this.totalRecords = this.transactions.length; // Set total records count

  let exchangeRate = localStorage.getItem('exchangeRate');
  this.exchangeRate= Number(exchangeRate);
        }
        captureReceiptForm(){
          //const today = this.formatDate(new Date()); // Get current date in 'yyyy-MM-dd' format
          this.receiptingDetailsForm = this.fb.group({
           
              allocatedAmount: this.fb.array([]), // FormArray for allocated amounts
              description:['',Validators.required]
              
          });
        }
        
        onAllocatedAmountChange(index: number, amount: number): void {
          this.receiptDataService.updateAllocatedAmount(index, amount);
          this.calculateTotalAllocatedAmount();
        }
        applyFilter(event: Event, field: string): void {
          const inputElement = event.target as HTMLInputElement;
          const filterValue = inputElement.value;
        
          switch (field) {
            case 'clientName':
              this.clientNameFilter = filterValue;
              break;
            case 'policyNumber':
              this.policyNumberFilter = filterValue;
              break;
            case 'amount':
              this.amountFilter = filterValue ? Number(filterValue) : null;
              break;
            case 'balance':
              this.balanceFilter = filterValue ? Number(filterValue) : null;
              break;
            case 'commission':
              this.commissionFilter = filterValue ? Number(filterValue) : null;
          }
        
          this.filterTransactions(); // Ensure this is called
        }
        filterTransactions(): void {
          if (!this.clientNameFilter?.trim() && !this.policyNumberFilter?.trim() && this.amountFilter === null && this.balanceFilter === null && this.amountFilter === null) {
            this.filteredTransactions = [...this.transactions]; // ✅ Reset to original transactions if no filters are applied
            return;
          }
        
          this.filteredTransactions = this.transactions
            .map(transaction => {
              let score = 0;
        
              // Client Name Match
              if (this.clientNameFilter?.trim()) {
                const clientNameMatch = transaction.clientName.toLowerCase().includes(this.clientNameFilter.toLowerCase());
                if (clientNameMatch) score += 1;
              }
        
              // Policy Number Match
              if (this.policyNumberFilter?.trim()) {
                const policyNumberMatch = transaction.clientPolicyNumber.toLowerCase().includes(this.policyNumberFilter.toLowerCase());
                if (policyNumberMatch) score += 1;
              }
        
              // Amount Match
              if (this.amountFilter !== null) {
                const amountMatch = Number(transaction.amount) === this.amountFilter;
                if (amountMatch) score += 1;
              }
        
              // Balance Match
              if (this.balanceFilter !== null) {
                const balanceMatch = Number(transaction.balance) === this.balanceFilter;
                if (balanceMatch) score += 1;
              }
        // Commission Match
        if (this.commissionFilter !== null) {
          const commissionMatch = Number(transaction.amount) === this.commissionFilter;
          if (commissionMatch) score += 1;
        }
  
              return { ...transaction, score }; // Add score to transaction
            })
            .filter(transaction => transaction.score > 0) // Only keep transactions that match at least one filter
            .sort((a, b) => b.score - a.score); // Sort by relevance
        
          console.log('Filtered and Sorted Transactions:', this.filteredTransactions);
        }
        
  // ✅ Initialize form controls for each transaction
  private initializeAllocatedAmountControls(): void {
    const allocatedAmountArray = this.allocatedAmountControls;
    allocatedAmountArray.clear(); // Clear existing controls
    
    this.transactions.forEach(() => {
      allocatedAmountArray.push(
        this.fb.group({
          allocatedAmount: [0, Validators.required],
          commissionChecked: ['N']
        })
      );
    });
  }
   // ✅ Get allocatedAmountControls as FormArray
   get allocatedAmountControls(): FormArray {
    return this.receiptingDetailsForm.get('allocatedAmount') as FormArray;
  }
  // ✅ Get specific form control from FormArray
  getFormControl(index: number, controlName: string): FormControl | null {
    const formGroup = this.allocatedAmountControls.at(index) as FormGroup;
    return formGroup ? (formGroup.get(controlName) as FormControl) : null;
  }
   // ✅ Calculate total allocated amount
   calculateTotalAllocatedAmount(): void {
    this.totalAllocatedAmount = this.allocatedAmountControls.value.reduce(
      (total: number, item: { allocatedAmount: number }) => total + Number(item.allocatedAmount || 0),
      0
    );
    localStorage.setItem('totalAllocatedAmount', JSON.stringify(this.totalAllocatedAmount));
  }
    // ✅ Handle checkbox change
    onCommissionCheckedChange(index: number, event: Event): void {
      const isChecked = (event.target as HTMLInputElement).checked;
      const commissionControl = this.getFormControl(index, 'commissionChecked');
      if (commissionControl) {
        commissionControl.setValue(isChecked ? 'Y' : 'N');
      }
    }
  
    // ✅ Get Remaining Amount
    // getRemainingAmount(): number {
    //   const amountIssued = Number(this.receiptingDetailsForm.get('amountIssued')?.value || 0);
      
    //   return amountIssued - this.totalAllocatedAmount;
    // }
    // ✅ Get Remaining Amount correctly
getRemainingAmount(): number {
  return this.amountIssued - this.totalAllocatedAmount;
}
allocate(): any {
  //first check if the bank is selected!if not return false
  // if(!this.onBankSelected){
  //   this.globalMessagingService.displayErrorMessage('Warning','Please Select bank first!');
  //   return;
  // }
  //otherwise continue with other validation
  // const allocatedAmounts = this.allocatedAmountControls.value;
  // const amountIssued = this.receiptingDetailsForm.get('amountIssued')?.value;
  // const amountIssuedControl = this.receiptingDetailsForm.get('amountIssued');

 // console.log('Allocated Amounts:', allocatedAmounts);
  //console.log('Total Allocated Amount:', this.totalAllocatedAmount);

  //Step 1: Check if 'amountIssued' is untouched or invalid
  // if (!amountIssuedControl?.touched || !amountIssued) {

  //   this.globalMessagingService.displayErrorMessage('Error', 'Please enter the amount issued.');
  //   return false; // Stop further execution
  // }


   // Update cumulative allocated amount
   //this.totalAllocatedAmount
   //this.cumulativeAllocatedAmount += this.totalAllocatedAmount;
  this.allocateAndPostAllocations();
  return true;
}

// allocateAndPostAllocations(): void {
//   // Get the deductions value from the form
//   const deductionsValue = this.receiptingDetailsForm.get('deductions')?.value;
//   const narration=this.receiptingDetailsForm.get('narration')?.value;
//   // Create an array to store allocated transactions with their form control values
//   const allocatedTransactionsData = this.transactions.map((transaction, index) => {
//     const allocatedAmountControl = this.getFormControl(index, 'allocatedAmount');
//     const allocatedAmount = allocatedAmountControl?.value || 0;
    
   

//     return {
//       transaction,
//       allocatedAmount,
//       index
//     };
//   }).filter(item => item.allocatedAmount > 0);

//   // For debugging
//  // console.log('Allocated Transactions:', allocatedTransactionsData);

//   // Check if there are any allocated transactions
//   if (allocatedTransactionsData.length === 0) {
//     this.globalMessagingService.displayErrorMessage('Error', 'No transactions have been allocated');
//     return;
//   }

//   const receiptParticulars = {
//     receiptNumber: this.globalReceiptNumber,
//     capturedBy: this.loggedInUser.code,
//     systemCode: this.selectedClient.systemCode,
//     branchCode:  this.defaultBranchId || this.selectedBranch,
//     clientCode: this.selectedClient.code,
//     clientShortDescription: this.selectedClient.shortDesc,
//     receiptType: this.selectedClient.receiptType,
//     clientName: this.selectedClient.name,
//     sslAccountCode: this.selectedClient.accountCode,
//     accountTypeId: this.globalAccountTypeSelected.actTypeShtDesc,
//     // referenceNumber: '',
//     referenceNumber: null,
//     receiptParticularDetails: allocatedTransactionsData.map(({ transaction, allocatedAmount, index }) => ({
//       // policyNumber: transaction.clientPolicyNumber,
//       policyNumber:String(transaction.transactionNumber),
//       referenceNumber: transaction.referenceNumber,
//       transactionNumber: transaction.transactionNumber,
//       batchNumber: transaction.policyBatchNumber,
//       premiumAmount: allocatedAmount,
//       loanAmount: 0,
//       pensionAmount: 0,
//       miscAmount: 0,
//       endorsementCode: 0,
//       // endorsementDrCrNumber: 'DR123456',
//       endorsementDrCrNumber: null,
//       includeCommission: this.getFormControl(index, 'commissionChecked')?.value === 'Y' ? 'Y' : 'N',
//       commissionAmount: transaction.commission,
//       narration:narration || '',
//       // overAllocated: null,
//       overAllocated: 0,
//       includeVat: deductionsValue ? 'Y' : 'N',
//       //includeVat: 'N',
//       clientPolicyNumber: transaction.clientPolicyNumber,
//       //ADDED FIELDS
//       policyType:null,
//       accountNumber:null,
//       side:null,
//       directType:null

//     }))
//   };

//   // For debugging - log the final payload
//   //console.log('Final Payload:', receiptParticulars);

//   const allocationData: AllocationDTO = {
//     receiptParticulars: [receiptParticulars]
//   };

//   // Post the allocation data
//   this.receiptService.postAllocation(this.userId, allocationData).subscribe({
//     next: (response) => {
//       // this.allocation = false;
//       this.globalMessagingService.displaySuccessMessage('Success', 'Allocations posted successfully');
//       // ✅ Keep totalAllocatedAmount after posting allocations
// const newlyAllocatedTotal = allocatedTransactionsData.reduce((total, item) => total + item.allocatedAmount, 0);
// this.totalAllocatedAmount += newlyAllocatedTotal;
//       //console.log('allocation payload:',allocationData);
//       this.transactions = this.receiptDataService.getTransactions();
//        // Reset client selection and transactions
//       // this.selectedClient = null;
//       // this.transactions = [];
//       //  while (this.allocatedAmountControls.length > 0) {
//       //    this.allocatedAmountControls.removeAt(0);
//       //  }
//        // Clear state after successful allocation
//       //this.selectedClient = null;
//       //this.transactions = [];
//       // while (this.allocatedAmountControls.length !== 0) {
//       //   this.allocatedAmountControls.removeAt(0);
//       // }
//      // this.totalAllocatedAmount = 0; // Reset total allocated amount
//       this.getAllocations();
//       this.selectedClient;
     
//     },
//     error: (err) => {
//       //console.error('Error posting allocation:', err);
//       this.globalMessagingService.displayErrorMessage('Error', 'Failed to post allocations');
//     }
//   });
// }
// updateTotalAllocatedAmount(): void {
//   // Recalculate the total allocated amount in real-time
//   this.totalAllocatedAmount = this.transactions.reduce((total, transaction, index) => {
//     const allocatedAmountControl = this.getFormControl(index, 'allocatedAmount');
//     const allocatedAmount = allocatedAmountControl?.value || 0;
//     return total + allocatedAmount;
//   }, 0);
// }
updateTotalAllocatedAmount(): void {
  // Keep the total posted amount so it persists
  let totalPostedAmount = this.totalAllocatedAmount; 

  // Get new allocations made after the first post
  const newAllocatedTotal = this.transactions.reduce((total, transaction, index) => {
    const allocatedAmountControl = this.getFormControl(index, 'allocatedAmount');
    const allocatedAmount = allocatedAmountControl?.value || 0;
    return total + allocatedAmount;
  }, 0);

  // Update totalAllocatedAmount live (posted + new inputs)
  this.totalAllocatedAmount = totalPostedAmount + newAllocatedTotal;
}

allocateAndPostAllocations(): void {
    // Store already posted amount before resetting transactions
    const previousTotalAllocated = this.totalAllocatedAmount;
  const deductionsValue = this.receiptingDetailsForm.get('deductions')?.value;
  const narration = this.receiptingDetailsForm.get('narration')?.value;

  const allocatedTransactionsData = this.transactions.map((transaction, index) => {
    const allocatedAmountControl = this.getFormControl(index, 'allocatedAmount');
    const allocatedAmount = allocatedAmountControl?.value || 0;

    return {
      transaction,
      allocatedAmount,
      index
    };
  }).filter(item => item.allocatedAmount > 0);

  if (allocatedTransactionsData.length === 0) {
    this.globalMessagingService.displayErrorMessage('Error', 'No transactions have been allocated');
    return;
  }

  const receiptParticulars = {
    receiptNumber: this.globalReceiptNumber,
    capturedBy: this.loggedInUser.code,
    systemCode: this.selectedClient.systemCode,
    branchCode: this.defaultBranchId || this.selectedBranch,
    clientCode: this.selectedClient.code,
    clientShortDescription: this.selectedClient.shortDesc,
    receiptType: this.selectedClient.receiptType,
    clientName: this.selectedClient.name,
    sslAccountCode: this.selectedClient.accountCode,
    accountTypeId: this.globalAccountTypeSelected.actTypeShtDesc,
    referenceNumber: null,
    receiptParticularDetails: allocatedTransactionsData.map(({ transaction, allocatedAmount, index }) => ({
      policyNumber: String(transaction.transactionNumber),
      referenceNumber: transaction.referenceNumber,
      transactionNumber: transaction.transactionNumber,
      batchNumber: transaction.policyBatchNumber,
      premiumAmount: allocatedAmount,
      loanAmount: 0,
      pensionAmount: 0,
      miscAmount: 0,
      endorsementCode: 0,
      endorsementDrCrNumber: null,
      includeCommission: this.getFormControl(index, 'commissionChecked')?.value === 'Y' ? 'Y' : 'N',
      commissionAmount: transaction.commission,
      narration: narration || '',
      overAllocated: 0,
      includeVat: deductionsValue ? 'Y' : 'N',
      clientPolicyNumber: transaction.clientPolicyNumber,
      policyType: null,
      accountNumber: null,
      side: null,
      directType: null
    }))
  };

  const allocationData: AllocationDTO = {
    receiptParticulars: [receiptParticulars]
  };

  this.receiptService.postAllocation(this.userId, allocationData).subscribe({
    next: (response) => {
      this.globalMessagingService.displaySuccessMessage('Success', 'Allocations posted successfully');
this.isAllocationComplete=true;
      // ✅ Update totalAllocatedAmount
      const newlyAllocatedTotal = allocatedTransactionsData.reduce((total, item) => total + item.allocatedAmount, 0);
      this.totalAllocatedAmount += newlyAllocatedTotal;

      // ✅ Reset allocated amounts after posting
      this.transactions.forEach((transaction, index) => {
        const allocatedAmountControl = this.getFormControl(index, 'allocatedAmount');
        if (allocatedAmountControl) {
          allocatedAmountControl.setValue(0); // Reset allocated amount
          
          //allocatedAmountControl.setValue(0); // Reset allocated amount
        }
      });

      // ✅ Refresh allocations
      this.getAllocations();
      this.isAllocationPosted=true;
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', 'Failed to post allocations');
    }
  });
}

getAllocations() {
  this.receiptService.getAllocations(this.globalReceiptNumber, this.userId).subscribe({
    next: (response) => {
      this.selectedClient;

      // Filter allocations where there are amounts allocated
      this.getAllocation = response.data.filter(allocation => 
        allocation.receiptParticularDetails.some(detail => detail.premiumAmount > 0)
      );

      // ✅ Reset totalAllocatedAmount before recalculating
      this.totalAllocatedAmount = this.getAllocation.reduce((total, allocation) => {
        return total + allocation.receiptParticularDetails.reduce((sum, detail) => sum + detail.premiumAmount, 0);
      }, 0);

      // ✅ Store the latest total in localStorage
      localStorage.setItem('totalAllocatedAmount', JSON.stringify(this.totalAllocatedAmount));
// ✅ Set transactions for new allocations
this.transactions = this.receiptDataService.getTransactions();

// ✅ Listen for changes in allocated amount inputs
this.transactions.forEach((transaction, index) => {
  const allocatedAmountControl = this.getFormControl(index, 'allocatedAmount');
  if (allocatedAmountControl) {
    allocatedAmountControl.valueChanges.subscribe(() => {
      this.updateTotalAllocatedAmount(); // ✅ Keeps running total live
    });
  }
});
      this.isAllocationCompleted = true;
      this.getAllocationStatus = true;
      this.allocationsReturned = this.getAllocation;
      this.globalGetAllocation = this.getAllocation;

      // console.log('getAllocations >>', this.globalGetAllocation);
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Failed to fetch Allocations', err);
    }
  });
}

// getAllocations(){

//   this.receiptService.getAllocations(this.globalReceiptNumber,this.userId).subscribe({
//     next:(response)=>{
//       this.selectedClient;
      
// this.getAllocation = response.data.filter(allocation => 
//   allocation.receiptParticularDetails.some(detail => detail.premiumAmount > 0));

//       // Calculate total allocated amount for previously posted allocations
//       // this.totalAllocatedAmount = this.getAllocation.reduce((total, allocation) => {
//       //   return total + allocation.receiptParticularDetails.reduce((sum, detail) => sum + detail.premiumAmount, 0);
//       // }, 0);
//       //add newly fetched allocations to the existing totatAllocatedAmount,ensuring that we
//       //continue from where we left off
//       this.totalAllocatedAmount += this.getAllocation.reduce((total, allocation) => {
//         return total + allocation.receiptParticularDetails.reduce((sum, detail) => sum + detail.premiumAmount, 0);
//       }, 0);
      

// this.isAllocationCompleted = true;
// this.getAllocationStatus=true;
// this.allocationsReturned=this.getAllocation;
// this.globalGetAllocation=this.getAllocation;
// //console.log('getallocations>>',this.globalGetAllocation);
// // this.globalMessagingService.displaySuccessMessage('success', 'detail');

//     },
//     error:(err)=>{
//       this.globalMessagingService.displayErrorMessage('Failed to fetch Allocations',err);
//       //alert('false');
//     }
//   })
// }
deleteAllocation(receiptDetailCode: number): void {
  this.receiptService.deleteAllocation(receiptDetailCode).subscribe({
    next: (response) => {
      if (response.success) {
        let amountToSubtract = 0;

        // Find and remove the deleted allocation from local state
        this.getAllocation.forEach((allocation) => {
          const detailIndex = allocation.receiptParticularDetails.findIndex(
            (detail) => detail.code === receiptDetailCode
          );

          if (detailIndex !== -1) {
            amountToSubtract += allocation.receiptParticularDetails[detailIndex].premiumAmount;
            allocation.receiptParticularDetails.splice(detailIndex, 1); // Remove allocation detail
          }
        });

        // Remove empty allocation records
        this.getAllocation = this.getAllocation.filter(
          (allocation) => allocation.receiptParticularDetails.length > 0
        );

        // Update total allocated amount
        this.totalAllocatedAmount = Math.max(0, this.totalAllocatedAmount - amountToSubtract);

        // Store the updated total in localStorage
        localStorage.setItem('totalAllocatedAmount', JSON.stringify(this.totalAllocatedAmount));

        // Display success message
        this.globalMessagingService.displaySuccessMessage('Success', 'Allocation deleted successfully');

        // No need to call `getAllocations()` since we updated the state locally!
      } else {
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete allocation');
      }
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        err.error?.message || 'Failed to delete allocation'
      );
    },
  });
}

// deleteAllocation(receiptDetailCode: number): void {
//   this.receiptService.deleteAllocation(receiptDetailCode).subscribe({
//     next: (response) => {
//       if (response.success) {
//         // Find the allocation detail to delete
//         let amountToSubtract = 0;
//         this.getAllocation.forEach((allocation) => {
//           const detail = allocation.receiptParticularDetails.find(
//             (detail) => detail.code === receiptDetailCode
//           );
//           if (detail) {
//             amountToSubtract += detail.premiumAmount; // Get the amount to subtract
//           }
//         });

//         // Remove the deleted allocation from the local array
//         this.getAllocation = this.getAllocation.map((allocation) => ({
//           ...allocation,
//           receiptParticularDetails: allocation.receiptParticularDetails.filter(
//             (detail) => detail.code !== receiptDetailCode
//           ),
//         }));

//         // If all allocations for a receipt are deleted, remove that receipt
//         this.getAllocation = this.getAllocation.filter(
//           (allocation) => allocation.receiptParticularDetails.length > 0
//         );

//         // Update totalAllocatedAmount
//         this.totalAllocatedAmount -= amountToSubtract;
//         if (this.totalAllocatedAmount < 0) this.totalAllocatedAmount = 0; // Ensure no negative values
//         localStorage.setItem('totalAllocatedAmount', JSON.stringify(this.totalAllocatedAmount));

//         // Show success message
//         this.globalMessagingService.displaySuccessMessage(
//           'Success',
//           'Allocation deleted successfully'
//         );

//         // Refresh the allocations list
//         this.getAllocations();
//       } else {
//         this.globalMessagingService.displayErrorMessage(
//           'Error',
//           'Failed to delete allocation'
//         );
//       }
//     },
//     error: (err) => {
//       this.globalMessagingService.displayErrorMessage(
//         'Error',
//         err.error?.message || 'Failed to delete allocation'
//       );
//     },
//   });
// }

saveFileDescription(): void {
  const description = this.receiptingDetailsForm.get('description')?.value; // Get the description from the form

  if (this.currentFileIndex >= 0 && this.currentFileIndex < this.fileDescriptions.length) {
  if (description) { // Check if description is not empty
    this.fileDescriptions[this.currentFileIndex].description = description; // Update the description for the current file
 
   // console.log('file description>>',description);
    // Close the modal after saving the description
    this.closeFileModal();
   
  } else {
    this.globalMessagingService.displayErrorMessage('Failed', 'Please enter file description');
  }
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
  this.globalMessagingService.displaySuccessMessage('Success', 'File removed successfully');
}

onFileSelected(event: any): void {
  if (event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
   // console.log('Selected file:', this.selectedFile.name, 'Type:', this.selectedFile.type); // Debug log

    // Add file to descriptions array
    this.currentFileIndex = this.fileDescriptions.length;
    this.fileDescriptions.push({ file: this.selectedFile, description: this.description });
    //console.log('File descriptions:', this.fileDescriptions);
//console.log(this.fileDescriptions[0].description)
    // Convert file to Base64 without the "data:" prefix
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;

      // Remove the "data:" prefix if present
      if (base64String.includes(',')) {
        this.base64Output = base64String.split(',')[1];
      } else {
        this.base64Output = base64String;
      }

      //console.log('Base64 Encoded String (No Prefix):', this.base64Output.slice(0, 50)); // Debug log
    };
    reader.readAsDataURL(this.selectedFile);
    this.openModal(this.fileDescriptions.length - 1); // Open modal for the last added file

    this.isFileUploadButtonDisabled = true;
  } else {

    this.selectedFile = null; // Reset selectedFile if no file is selected
    this.isFileUploadButtonDisabled = false; // Keep "File Upload" button active
    
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
uploadFile(): void {
  if(!this.getAllocationStatus){
    this.globalMessagingService.displayErrorMessage('Warning','please make allocation first!');
    return;
  }
  if (!this.selectedFile || !this.base64Output) {
    //alert('No selected file');
    this.globalMessagingService.displayErrorMessage('Error','No selected file found!');
    return;
  }

  if (!this.globalGetAllocation.length) {
    this.globalMessagingService.displayErrorMessage('Error','No fetched allocations');
   /// alert('No fetched allocations');
    return;
  }

  //const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;
  if(!this.paymentMode){
    this.globalMessagingService.displayErrorMessage('Warning','Please select payment mode first!');
    return;
  }

//console.log('file description>.',this.description);
  try {
    const requests: ReceiptUploadRequest[] = [];

    this.globalGetAllocation.forEach((allocation) => {
      if (allocation.receiptParticularDetails && Array.isArray(allocation.receiptParticularDetails)) {
        allocation.receiptParticularDetails.forEach((detail) => {
          requests.push({
            docType: 'RECEIPT',
            docData: this.base64Output, // No "data:" prefix here
            module: 'CB-RECEIPTS',
            originalFileName: this.selectedFile.name,
            filename: this.selectedFile.name,
            referenceNo: detail.referenceNumber,
            docDescription:this.fileDescriptions[this.currentFileIndex].description,
            amount: detail.premiumAmount,
            paymentMethod: this.paymentMode,
            policyNumber: detail.policyNumber,
          });
        });
      }
    });

    //console.log('Request payload:', requests);

    this.receiptService.uploadFiles(requests).subscribe({
      next: (response) => {
       // console.log('Upload successful:', response);

        this.globalDocId = response.docId;
        this.globalMessagingService.displaySuccessMessage('Success', 'Receipt uploaded successfully');
this.fileUploaded=true;
        if (response.docId) {
          this.globalDocId = response.docId;
          //console.log('Stored globalDocId:', this.globalDocId);

          // Store file in uploadedFiles immediately
          const uploadedFile = {
            docId: response.docId, // Ensure we store docId properly
            docName: this.selectedFile.name,
            contentType: this.selectedFile.type,
            byteData: this.base64Output, // Store base64 for immediate use
           
          };

          this.uploadedFiles.push(uploadedFile);
          //console.log('Updated uploadedFiles:', this.uploadedFiles); // Debugging log
        }
        this.selectedFile = null;
        this.base64Output = '';
        this.fileDescriptions = [];
        this.currentFileIndex = 0;
        this.isFileUploadButtonDisabled = false; // Re-enable the "File Upload" button
        this.fileIsUploaded=true;
       this.fetchDocByDocId(this.globalDocId);
      },
      error: (error) => {
       
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to upload receipt');
      },
    });
  } catch (error) {
    
    this.globalMessagingService.displayErrorMessage('Error', 'Error preparing file upload');
  }
}
fetchDocByDocId(docId: string){
  this.dmsService.getDocumentById(docId).subscribe({
    next:(response)=>{
      this.uploadedFile = response;
   
      this.globalMessagingService.displaySuccessMessage('Success','Doc retrieved successfullly');
//console.log('doc data>>',response);
    },
    error:(error)=>{
      this.globalMessagingService.displayErrorMessage('Error',error.error.error);
    }


  })
}

// fetchDocByDocId(docId: string) {

//   this.dmsService.getDocumentById(docId).subscribe({
//     next: (response) => {
//       this.globalMessagingService.displaySuccessMessage('Success', 'File retrieved successfully');
//       if (response) {
//         //console.log('Retrieved file:', response);
//         this.uploadedFiles.push(response); // Append file instead of overwriting
        
//       }
//     },
//     error: (error) => {
//       this.globalMessagingService.displayErrorMessage('Error', error.error.error);
//     }
//   });
// }
openFile(file: any): void {
  if (file && file.byteData) {
    try {
      // Convert Base64 to binary data
      const byteCharacters = atob(file.byteData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Determine file type
      const isPdf = file.docName?.toLowerCase().endsWith('.pdf');
      const blobType = isPdf ? 'application/pdf' : (file.contentType || 'application/octet-stream');

      // Create Blob with correct type
      const blob = new Blob([byteArray], { type: blobType });

      // Handle PDF files
      if (isPdf) {
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl, '_blank');
      } else {
        // Handle non-PDF files: Provide a download option
        const downloadUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.download = file.docName || 'downloaded_file';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(downloadUrl); // Clean up the download URL
      }
    } catch (error) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Failed to process the file. The file might be corrupted or in an invalid format.'
      );
    }
  } else {
    this.globalMessagingService.displayErrorMessage('Error', 'No file data available');
  }
}

deleteFile(file: any, index: number): void {
  //console.log('Attempting to delete file:', file); // Debug log

  if (!file || !file.docId) {
    //console.error('File missing docId:', file); // Debugging log
    this.globalMessagingService.displayErrorMessage('Error', 'No valid file selected for deletion');
    return;
  }

  this.dmsService.deleteDocumentById(file.docId).subscribe({
    next: () => {
    

      // Remove file from the list
      this.uploadedFiles.splice(index, 1);
      this.globalMessagingService.displaySuccessMessage('Success', 'File deleted successfully');
     // console.log('Remaining files:', this.uploadedFiles); // Debugging log

      // Reset globalDocId if needed
      if (this.globalDocId === file.docId) {
        this.globalDocId = null;
      }
    },
    error: (error) => {
      console.error('Error deleting file:', error);
      this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete file');
    }
  });
}
fetch(){
  this.fetchReceiptNumber();
}
fetchReceiptNumber(): void {
  this.receiptService.getReceiptNumber(this.defaultBranchId || this.selectedBranch, this.userId).subscribe({
    next: (response: ReceiptNumberDTO) => {
      //console.log('Response from getReceiptNumber:', response);

      // Check if response contains receiptNumber
      if (response?.receiptNumber) {
       // this.receiptNumber = response.receiptNumber;
        this.receiptNumber=response.receiptNumber;
        this.globalReceiptBranchNumber=response.branchReceiptNumber;
       console.log('Fetched Receipt Number:', this.globalReceiptBranchNumber);
       console.log('fetched receiptCode>>',this.receiptNumber);
this.submitReceipt();
        // Update the form control
        //this.receiptingDetailsForm.get('receiptNumber')?.setValue(this.globalReceiptNo);
        //this.fetchReceiptValidationStatus();
      } else {
       // console.error('Receipt number not found in the response');
      }
    },
    error: (error) => {
     // console.error('Error fetching receipt number:', error);
      this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch receipt number');
    },
  });
}
submitReceipt(): any {
 
 
   const amountIssued=this.receiptingDetailsForm.get('amountIssued')?.value;
   const amountIssuedControl=this.receiptingDetailsForm.get('amountIssued');
 
  //  if (!this.amountIssued) {
 
  //    this.globalMessagingService.displayErrorMessage('Error', 'Please enter the amount issued.');
  //    return false; // Stop further execution
  //  }
 
 
  // Step 2: Validate the total allocated amount against the issued amount
  //  if (this.totalAllocatedAmount < this.amountIssued) {
  //    this.globalMessagingService.displayErrorMessage('Error', 'Amount issued is not fully allocated.');
    
    
  //    return false; // Stop further execution
  //  }
  //  if(this.totalAllocatedAmount > this.amountIssued){
  //    this.globalMessagingService.displayErrorMessage('Error','Total Allocated Amount Exceeds Amount Issued');
  
  //   return false;
    
  //  }
 //this.confirmFormValidity();
   // Get form values
   const formValues = this.receiptingDetailsForm.value;
 const getCapitalInjectionStatus=formValues.capitalInjection;
//  if(getCapitalInjectionStatus){
//  this.capitalInjection='Y'
//  }else{
//    this.NoCapitalInjection='N'
//  }
   // Get allocated transactions from getAllocation array
   const allocatedDetails = this.getAllocation?.[0]?.receiptParticularDetails || [];
 
   // Map allocated transactions to receiptParticularDetailUpdateRequests format
   const receiptParticularDetailUpdateRequests = allocatedDetails.map(detail => ({
     receiptParticularDetailCode: Number(detail.code), // Ensure it's a number
     premium: Number(detail.premiumAmount), // Ensure it's a number
     loan: Number(detail.loanAmount || 0),
     pension: Number(detail.pensionAmount || 0),
     misc: Number(detail.miscAmount || 0)
   }));
 const receiptData: ReceiptSaveDTO={
   
     receiptNo: String(this.globalReceiptBranchNumber),
     receiptCode: this.receiptNumber,
     receiptDate: this.receiptDate ? this.receiptDate.toISOString().split('T')[0] : null, // Ensure it's a valid Date before calling toISOString()
     amount: String(this.amountIssued),  // Add decimal points for BigDecimal fields
     paidBy: this.receivedFrom ,
     currencyCode: String(this.defaultCurrencyId), // Add quotes to ensure it's treated as string before conversion
    
    branchCode: String( this.defaultBranchId) || String(this.selectedBranch),  // Add quotes to ensure it's treated as string before conversion
     paymentMode: this.paymentMode,
     paymentMemo: this.paymentRef || null,
     docDate: this.documentDate ? this.documentDate.toISOString().split('T')[0] : null, // Ensure it's a valid Date before calling toISOString()
     //drawerBank: formValues.drawersBank || 'N/A',
     drawerBank: this.drawersBank || "N/A",
     userCode: this.userId,
     narration: this.narration,
     insurerAccount: null,
     receivedFrom: this.receivedFrom || null,
     //grossOrNet: "G",
     grossOrNet: null,
     sysShtDesc: this.selectedClient?.systemShortDesc,
     receiptingPointId: this.receiptingPointId,
     receiptingPointAutoManual: this.receiptingPoint,
   
     // capitalInjection:  "N",
     //capitalInjection: this.capitalInjection || this.NoCapitalInjection ,
     capitalInjection:'',
     chequeNo: null,
     ipfFinancier: null,
     receiptSms: "Y",
     receiptChequeType: this.chequeType || null,
     vatInclusive: null,
     rctbbrCode: String( this.defaultBranchId) || String(this.selectedBranch) ,
     directType: null,
     pmBnkCode: null,
     dmsKey: null,
     currencyRate: this.exchangeRate || this.manualExchangeRate || null,
     internalRemarks: null,
    // manualRef:formValues.manualRef || null,
    manualRef: this.manualRef || null,
    bankAccountCode: this.globalBankAccountVariable, // Add quotes to ensure it's treated as string before conversion
     grossOrNetAdminCharge: "G",
     insurerAcc: null,
     grossOrNetWhtax: null,
     grossOrNetVat: null,
     
     sysCode: String(this.selectedClient.systemCode),
     bankAccountType: this.globalBankType
   
 }
 console.log('receipt Data>',receiptData);
   
 
   // Call the service to save the receipt
   this.receiptService.saveReceipt(receiptData).subscribe({
     next: (response) => {
       //this.receiptResponse=response.data;
       this.globalMessagingService.displaySuccessMessage('Success', 'Receipt saved successfully');
         // Enable the print button after successful receipt submission
         
       //this.uploadReport();
    //this.isReceiptSaved=true;
  // Store current values of fields to preserve
  const preservedValues = {
   currency: this.receiptingDetailsForm.get('currency')?.value,
   organization: this.receiptingDetailsForm.get('organization')?.value,
   selectedBranch:this.receiptingDetailsForm.get('selectedBranch')?.value,
   documentDate: this.receiptingDetailsForm.get('documentDate')?.value,
   receiptDate: this.receiptingDetailsForm.get('receiptDate')?.value
 };
 // Reset form and clear allocations
 this.receiptingDetailsForm.reset();
     this.transactions = [];
     this.allocatedAmountControls.clear();
     this.totalAllocatedAmount = 0;
     localStorage.removeItem('totalAllocatedAmount');
    //  this.clients = []; // Clear the searched clients array
    //  this.searchClients = []; // Clear search results
    //   this.searchQuery = ''; // Clear search query
    //  this.selectedClient = null;
    //  this.isClientSelected = false;
     //this.allocation = false;
     //this.getAllocationStatus = false;
     //activatedAllocationComplete flag
     this.isAllocationCompleted = false;
 
 // Clear client-related states
 this.selectedClient = null;
//  this.isClientSelected = false;
//  this.clients = []; // Clear the searched clients array
//  this.searchClients = []; // Clear search results
//  this.searchQuery = ''; // Clear search query
 
      
    // Reset account type related states
    // this.isAccountTypeSelected = false;
    this.globalAccountTypeSelected = null;
 
    // Explicitly disable search fields
    this.receiptingDetailsForm.get('searchCriteria')?.disable();
    this.receiptingDetailsForm.get('searchQuery')?.disable();
  
 
   // Reset other form-related states
   this.fileDescriptions = [];
   this.selectedFile = null;
   this.uploadedFile = null;
   this.base64Output = '';
  //  this.isNarrationFromLov = false;
  //  this.chargesEnabled = false;
 
      // Restore preserved values
      this.receiptingDetailsForm.patchValue({
       currency: preservedValues.currency,
       organization: preservedValues.organization,
       selectedBranch:preservedValues.selectedBranch,
       documentDate: preservedValues.documentDate,
       receiptDate: preservedValues.receiptDate
     });
     // Reset UI states
     //this.allocation = false;
     // this.getAllocationStatus = false;
     // this.isAllocationCompleted = false;
     // this.showSelectedClientTable = false;
     // Clear any error states
     Object.keys(this.receiptingDetailsForm.controls).forEach(key => {
       const control = this.receiptingDetailsForm.get(key);
       if (control && key !== 'currency' && key !== 'organization' && 
           key !== 'branch' && key !== 'documentDate' && key !== 'receiptDate') {
         control.markAsUntouched();
         control.markAsPristine();
       }
     });
     //prepare receipt upload payload
     
 
     
     },
     error: (error) => {
       console.error('Error saving receipt:', error);
       this.globalMessagingService.displayErrorMessage(
         'Failed to save receipt',
         error.error || 'your error'
       );
     }
   });
 }
 
onBack() {
  //this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
  this.router.navigate(['/home/fms/client']);  // Navigate to the next screen
}
  }
 
