import { Component, OnInit,NgZone,ViewChild, ElementRef,Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import {NarrationDTO,ReceiptNumberDTO,GenericResponse,ReceiptingPointsDTO,Transaction,Receipt,Client, PaymentModesDTO, AccountTypeDTO, BanksDTO, ClientsDTO, ChargesDTO, TransactionDTO, ExchangeRateDTO, ChargeManagementDTO, AllocationDTO, ExistingChargesResponseDTO, UploadReceiptDocsDTO, ReceiptSaveDTO, ReceiptParticularDetailsDTO, GetAllocationDTO, DeleteAllocationResponseDTO, BranchDTO, UsersDTO, Allocation, ReceiptRequest, ReceiptUploadRequest, FileDescription} from '../../data/receipting-dto'
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap'; 
import {SessionStorageService} from "../../../../shared/services/session-storage/session-storage.service";
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { BrowserStorage } from 'src/app/shared/services/storage';
import { ReceiptService } from '../../services/receipt.service';
import { descriptors } from 'chart.js/dist/core/core.defaults';
import {OrganizationDTO} from '../../../crm/data/organization-dto';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { CurrencyDTO, CurrencyRateDTO } from 'src/app/shared/data/common/currency-dto';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import {OrganizationService} from '../../../crm/services/organization.service'
import {AuthService} from '../../../../shared/services/auth.service';
import {StaffService} from '../../../../features/entities/services/staff/staff.service';
import {CurrencyService} from '../../../../shared/services/setups/currency/currency.service';
import {BankService} from '../../../../shared/services/setups/bank/bank.service';
import { DmsService } from 'src/app/shared/services/dms/dms.service';


@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],

})


export class ReceiptComponent implements OnInit {
  fetchedAllocations: Allocation[] = [];
  //selectedFile: File | null = null;
  base64Output: string = '';
  selectedFile: File | null = null;
  //fileDescriptions: FileDescription[] = [];
  currentFileIndex: number = 0;
  uploadedFile: any = null;
  globalDocId:string;
  decodedFileUrl: string | null = null;
  //description: string = '';
  paymentMode: string = '';
  receiptingDetailsForm: FormGroup;
  users:StaffDto;
  organization:OrganizationDTO[];
  selectedOrganization: string | null = null; // Currently selected organization
  GlobalUser:any;
  organizationId: number;
  branches:BranchDTO[]=[];
  drawersBanks:BankDTO[]=[];
  selectedCountryId: number | null = null;

      

    loggedInUser:any;
  chargesEnabled: boolean = false;
   // selectedChargeType: string = 'charges';
    chargeAmount: number = 0;
    //private chargesModal: Modal | undefined;
    chargeTypes: string[]=[];
  globalBankAccountCode:number;
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
bankAccounts:BanksDTO[]=[];
selectedBankCode:number;
    
   narrations:NarrationDTO[]=[];
filteredNarrations: NarrationDTO[] = [];
loading = false; 

selectedCurrencySymbol: string | undefined; // To store the currency symbol for checks
selectedCurrencyCode: number=0;
currencyGlobal: number | null = null;
// currencies:CurrencyDTO[]=[];
currencies:CurrencyDTO[]=[];
currencyRates:CurrencyRateDTO[]=[];
defaultCurrencyId: number | null = null;
receiptingPoints: ReceiptingPointsDTO[]=[];
receiptingPointId:number;
receiptingPointAutoManual:string;
receiptingPointName:string;
globalReceiptNumber:number;
    charges:ChargesDTO[]=[];
  accountTypes:AccountTypeDTO[]=[];
  clients:ClientsDTO[]=[];
  globalReceiptNo: string ;
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
exchangeRate: number =0; // Default exchange rate
rate:any;
uploadedFiles: File[] = [];
currentReceiptingPoint:any;
  manualExchangeRate:any;
  allocation:boolean=true;
  allocationsReturned:any;
  // allocatedAmounts: number[] = []; // Array to store allocated amounts
  totalAllocatedAmounts: number = 0;
  isSubmitButtonVisible = false;
  //selectedFile: File | null = null;
  description: string = '';
  fileDescriptions: { file: File; description: string }[] = []; // Initialize the array
  //currentFileIndex: number = -1; // Initialize to -1 or a valid index when a file is selected

  

  referenceNo: string = ''; // Assume this is set from the selected client
  amount: number = 0; // Assume this is set from the form
  paymentMethod: string = ''; // Assume this is set from the form
  policyNumber: string = ''; // Assume this is set from the selected client
  //status: string = 'Pending'; // Default status or set as needed
isSaveBtnActive=true;
  @ViewChild('fileDescriptionModal', { static: false }) fileDescriptionModal!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  // receiptingDetailsForm!: FormGroup;
 

 // username = 'frank'; // Replace with actual user retrieval
  //receiptNumberFile = 147; // Replace with actual receipt number
 // userCode = 940;     // Replace with actual user code
  isAllocationCompleted = false;
  globalGetAllocation:any;
  totalAllocatedAmount = 0;
  amountIssued: number = 0; // Initialize amountIssued
  parameterStatus:string;
  currentReceiptNo: any;
  isReceiptSaved=false;
  orgId: string;
  defaultOrgId: number;
  defaultCountryId: number;
  minDate: string; // To enable backdating if necessary
  maxDate: string; // To disable future dates
  backdatingEnabled = true; // Adjust this based on your logic
constructor(
  private fb: FormBuilder,
  private staffService:StaffService,
  private sessionStorage: SessionStorageService,
  private globalMessagingService:GlobalMessagingService,
  private receiptService:ReceiptService,
  private organizationService:OrganizationService,
  private bankService:BankService,
  private  currencyService:CurrencyService,
 private authService:AuthService,
 private dmsService:DmsService

) {


}
ngOnInit(): void {
 
   this.captureReceiptForm();
   //this.fetchBranches();
   this.fetchCurrencies();
 // this.fetchPaymentModes();
 this.fetchOrganization();
  //this.fetchExistingCharges();
 // this.fetchAccountTypes();
//this.fetchBanks();
//this.fetchDrawersBanks();
//this.fetchDrawersBank();
this.fetchNarrations();
//this.fetchParamStatus();
 // this.fetchDefaultExchangeRate();
// this.fetchManualExchangeRateParameter();
// this.fetchExchangeRate();
 //this.fetchCharges();
//this.submitChargeManagement();

this.loggedInUser = this.authService.getCurrentUser();
this.fetchUserDetails();
 // Set the minDate and maxDate for date validation
 const currentDate = new Date();
 this.minDate = ''; // Set this based on your business logic (e.g., earliest backdate allowed)
 this.maxDate = this.formatDate(currentDate);
//console.log('my alogged in user',this.loggedInUser);

//console.log('logged user>',this.loggedInUser);
//console.log(this.currencies);
//console.log('>>>',this.sessionStorage.getItem("SESSION_ORG_CODE"));
// this.orgCode = this.sessionStorage.getItem("SESSION_ORG_CODE");

// const user=this.sessionStorage.getItem(JSON.parse("code"));
// console.log("users>>",user);
//  this.userCode=this.sessionStorage.getItem('SESSION__USER_CODE');
//console.log('user org code',this.userCode);
//alert(this.loggedInUser.code);


}



captureReceiptForm(){
  const today = this.formatDate(new Date()); // Get current date in 'yyyy-MM-dd' format
  this.receiptingDetailsForm = this.fb.group({
    selectedBranch:['',Validators.required],
    organization: ['', Validators.required], // Set default value here as well
    amountIssued: ['', Validators.required],
    openCheque: [''],
    receiptNumber:['',Validators.required],
    // receiptNumber: [{ value: '', disabled: true }],
    ipfFinancier: [''],
    grossReceiptAmount: [''],
    receivedFrom: ['', Validators.required],
    drawersBank: [ '',[Validators.required, Validators.minLength(1)]], // Drawers bank required if not cash
    receiptDate: [today, Validators.required],
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
    exchangeRate:['',[Validators.required, Validators.min(0)]],
    exchangeRates:[''],
    // Exchange rate modal form

      manualExchangeRate: ['', [Validators.required, Validators.min(0.01)]],
    
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

fetchUserDetails(){
  this.staffService.getStaffById(this.loggedInUser.code).subscribe({
    next:(data)=>{
this.users=data;
this.GlobalUser=this.users;
//console.log('users>>',this.users);
this.organizationId = this.GlobalUser.organizationId;
//this.fetchBranches(this.GlobalUser.organizationId);
this.fetchAccountTypes();
//console.log('user>>',this.GlobalUser);
    },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Error',err.err.err);
    }
  })
}
fetchOrganization(){
  this.organizationService.getOrganization().subscribe({
    next:(data)=>{
      this.organization=data;
      //console.log('organization>>',data);
     // Set the default organization if it exists
   
     const defaultOrg = this.organization.find(org => org.id === 2);
     if (defaultOrg) {
     
       this.selectedOrganization = defaultOrg.name; // Set default organization
       this.defaultOrgId =  defaultOrg.id;
       this.defaultCountryId=defaultOrg.country.id;
      this.fetchBranches(this.defaultOrgId);
       this.fetchPaymentModes(this.defaultOrgId);
       this.fetchDrawersBanks(this.defaultCountryId);
       //this.orgId=this.selectedOrganization.name;
      this.receiptingDetailsForm.patchValue({organization:this.selectedOrganization});
      
       //console.log('id',defaultOrg.name);
     } else {
       this.selectedOrganization = null; // Allow user to select from the list
     }

    },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Error',err.error.error);
    }
  })
}

fetchBranches(organizationId: number){
  this.receiptService.getBranches(organizationId
  ).subscribe({
    next:(data)=>{
      this.branches = data;
    //  console.log('branches>>', this.branches);
    },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Error',err.error.error);
    }
  })
}


onOrganizationChange(event: any) {

  // Get the selected organization ID
  const selectedOrgId = Number(event.target.value);
  //console.log('Selected Organization ID:', selectedOrgId);

  if (selectedOrgId) {
    // Find the selected organization object
    const selectedOrg = this.organization.find(org => org.id === selectedOrgId);
    
    if (selectedOrg && selectedOrg.country) {
      // Store the country ID
      this.selectedCountryId = selectedOrg.country.id;
     // console.log('Selected Country ID:', this.selectedCountryId);

      // Update the form control value
      this.receiptingDetailsForm.patchValue({
        organization: selectedOrgId
      });

      // Fetch branches for the selected organization
      this.fetchBranches(selectedOrgId);
      this.fetchPaymentModes(selectedOrgId);
      // Now you can fetch drawer banks using the country ID
      if (this.selectedCountryId) {
        this.fetchDrawersBanks(this.selectedCountryId);
      }
    }
  } else {
    // Clear dependent fields if no organization is selected
    this.selectedCountryId = null;
    this.receiptingDetailsForm.patchValue({
      selectedBranch: '',
      drawersBank: ''
      // ... any other dependent fields
    });
    this.branches = []; // Clear branches array
    this.drawersBanks = []; // Clear banks array
  }
}

// Update your fetchDrawersBanks method
fetchDrawersBanks(countryId: number) {
  // Use the countryId parameter in your API call
  this.bankService.getBanks(countryId).subscribe({
    next: (data) => {
      this.drawersBanks = data;
     // console.log('Drawers Banks:', this.drawersBanks);
    },
    error: (error) => {
      console.error('Error fetching drawer banks:', error);
      this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch drawer banks');
    }
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
private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
fetchPaymentModes(orgCode:number){
this.receiptService.getPaymentModes(orgCode).subscribe({
    next: (response) => {
      this.paymentModes = response.data;
      
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    }
  });
}
onBank(event: Event): void {
  //const selectedBankName = (event.target as HTMLSelectElement).value;
  const selectedBankCode = +(event.target as HTMLSelectElement).value; // Use '+' to convert string to number
  this.selectedBankCode = selectedBankCode; // Store the selected bank code
  this.receiptService.getReceiptingPoints(1,this.GlobalUser.id).subscribe({
    next: (response: { data: ReceiptingPointsDTO[] }) => {
      if (response.data.length > 0) {
        const receiptingPoint = response.data[0]; // Use the first receipting point
        this.receiptingDetailsForm.get('receiptingPoint')?.setValue(receiptingPoint.name);
        this.receiptingPointId=receiptingPoint.id;
        //console.log('receiptingPointId>',this.receiptingPointId);
      
        //this.receiptingPointName=this.receiptingPointId[0].name;
 
        this.receiptingPointAutoManual=receiptingPoint.autoManual;
       // console.log('receiptingPointManual>',this.receiptingPointAutoManual);
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
 this.fetchReceiptNumber(1, this.GlobalUser.id);
 

}

fetchReceiptNumber(branchCode: number, userCode: number): void {
  this.receiptService.getReceiptNumber(branchCode, userCode).subscribe({
    next: (response: ReceiptNumberDTO) => {
      //console.log('Response from getReceiptNumber:', response);

      // Check if response contains receiptNumber
      if (response?.receiptNumber) {
       // this.receiptNumber = response.receiptNumber;
        this.globalReceiptNo=response.receiptNumber;
        this.globalReceiptNumber=response.branchReceiptNumber;
       // console.log('Fetched Receipt Number:', this.globalReceiptNumber);

        // Update the form control
        this.receiptingDetailsForm.get('receiptNumber')?.setValue(this.globalReceiptNo);
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




fetchReceiptingPoints(){
  this.receiptService.getReceiptingPoints(1,this.GlobalUser.id).subscribe({
        next: (response) => {
          this.receiptingPoints = response.data;
       this.receiptingPointId=this.receiptingPoints[0].id;
      // console.log('receiptingPointId>',this.receiptingPointId);
     
       this.receiptingPointName=this.receiptingPointId[0].name;

       this.receiptingPointAutoManual=this.receiptingPoints[0].autoManual;
      // console.log('receiptingPointManual>',this.receiptingPointAutoManual);
        },
        error: (err) => {
            
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
}




get allocations(): FormArray {
  return this.receiptingDetailsForm.get('allocations') as FormArray;
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
fetchCurrencies() {
  this.currencyService.getCurrencies().subscribe({
    next: (currencies: CurrencyDTO[]) => {
      this.currencies = currencies;
      //console.log('Currencies:', currencies);

      // Find the default currency - using string literal 'Y' directly
      const defaultCurrency = currencies.find(curr => curr.currencyDefault === 'Y');
      
      if (defaultCurrency) {
        this.defaultCurrencyId = defaultCurrency.id;
        console.log('Default Currency:', defaultCurrency);

        // Set the default currency in the form
        this.receiptingDetailsForm.patchValue({
          currency: defaultCurrency.id
        });
      }
      this.fetchBanks();
    },
    error: (err) => {
      //console.error('Error fetching currencies:', err);
      this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch currencies');
    }
  });
}



onCurrencyChanged(event: Event): void {
   
  const selectedCurrencyCodes = (event.target as HTMLSelectElement).value;
  this.selectedCurrencyCode=Number(selectedCurrencyCodes);
  //this.selectedCurrencyCode=Number(event.target as HTMLSelectElement).valueOf;
 //   const selectedCurrencyId = Number(event.target.value);
// Find the currency from the list
const selectedCurrency = this.currencies.find(
  (currency) => currency.id === this.selectedCurrencyCode
);

// Get the symbol of the selected currency
this.selectedCurrencySymbol = selectedCurrency ? selectedCurrency.symbol : '';

  //console.log('selected currency',this.selectedCurrencyCode);
  this.fetchCurrencyRate();


}
fetchCurrencyRate(){
   // Get current date for comparison
   const currentDate = new Date();
   currentDate.setHours(0, 0, 0, 0); // Reset time part for date comparison
  this.currencyService.getCurrenciesRate(this.defaultCurrencyId)
  .subscribe({
    next: (rates) => {
     // console.log('Selected Currency ID:',this.selectedCurrencyCode);
     // console.log('All Currency Rates:', rates);

      // this.currencyRates = rates; // `data` is now a string
      // console.log('currency rates',this.currencyRates);
      //   // Filter rates matching the selected currency
      //   const matchingRates = rates.filter(rate => 
      //     rate.targetCurrencyId ===this.selectedCurrencyCode
      //   );
        // Filter rates matching the selected currency
      const matchingRates = rates.filter(rate => {
        console.log('Comparing:', {
          rateTargetCurrencyId: rate.targetCurrencyId,
          selectedId: this.selectedCurrencyCode,
          isMatch: rate.targetCurrencyId === this.selectedCurrencyCode
        });
        return rate.targetCurrencyId === this.selectedCurrencyCode;
      });

      //console.log('Matching Rates:', matchingRates);
        if (matchingRates.length === 0) {
          // No rates found - show manual entry modal
          //console.log('No currency rate found - showing manual entry modal');
          this.showExchangeRateModal2();
        } else if (matchingRates.length === 1) {
          // Single rate found - use it directly
          const rate = matchingRates[0];
         // console.log('Single rate found:', rate);
          this.receiptingDetailsForm.patchValue({
            exchangeRate: rate.rate
          });
          this.showExchangeRateModal(); // Show modal with exchange rate
        } else {
          // Multiple rates found - need to check dates
         // console.log('Multiple rates found - checking dates');
          
          // Sort rates by effectiveDate in descending order (newest first)
          const validRates = matchingRates
            .filter(rate => {
              const effectiveDate = new Date(rate.withEffectToDate);
              console.log('Checking date:', {
                effectiveDate,
                currentDate,
                isValid: effectiveDate >= currentDate
              });
              return effectiveDate >= currentDate;
            })
            .sort((a, b) => 
              new Date(b.withEffectToDate).getTime() - new Date(a.withEffectToDate).getTime()
            );
            //console.log('Valid rates after date filtering:', validRates);
            if (validRates.length > 0) {
              // Use the most recent valid rate
              const currentRate = validRates[0];
              //console.log('Using rate:', currentRate);
              this.receiptingDetailsForm.patchValue({
                exchangeRate: currentRate.rate
              });
              this.showExchangeRateModal(); // Show modal with exchange rate
            } else {
              // No valid rates found - show manual entry modal
              //console.log('No valid currency rate found - showing manual entry modal');
              this.showExchangeRateModal2();
            }
          }
    },
    error: (err) => {
     // console.error('Error fetching currency rates:', err);
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
      this.showExchangeRateModal2();
    }
  });
}

fetchDefaultExchangeRate(): void {
  
  this.receiptService.getExchangeRate(this.selectedCurrencyCode, this.GlobalUser.organizationId)
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


confirmExchangeRateValue(): void {
 // console.log('Current exchange rate value:', this.exchangeRate);
  //console.log('Form value:', this.receiptingDetailsForm.get('manualExchangeRate')?.value);
this.manualExchangeRate=this.receiptingDetailsForm.get('manualExchangeRate')?.value;
  // Update form first

  if (this.manualExchangeRate > 0) {
   
    this.receiptingDetailsForm.patchValue({
      exchangeRate: this.exchangeRate
    });
  
  

    
   
    //console.log('Form value after update:', this.receiptingDetailsForm.get('exchangeRate')?.value);
    // Post the exchange rate
    this.receiptService.postManualExchangeRate(
      this.selectedCurrencyCode,
      1,  // organizationId
      'FMSADMIN',
     this.exchangeRate
    ).subscribe({
      next: (response) => {
        //console.log('Exchange rate saved successfully:', response);
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Exchange rate saved successfully'
        );
        this.closeModal2();
      },
      error: (err) => {
       // console.error('Detailed error:', err);
        this.globalMessagingService.displayErrorMessage(
          'Error',
          `Failed to save exchange rate: ${err.error?.message || err.message || 'Unknown error'}`
        );
      },
    });
  } else {
    this.globalMessagingService.displayErrorMessage(
      'Validation Error',
      'Please enter a valid exchange rate value greater than 0'
    );
    //console.log('Exchange rate to save:', this.exchangeRate);
  }
}
confirmExchangeRate(): void {
    this.closeModal();
}

closeModal2(): void {
  // const modalElement = document.getElementById('exchangeRateModal2');
  // if (modalElement) {
  //   const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
  //   bootstrapModal?.hide();
  // }
  const modal = document.getElementById('exchangeRateModal2');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}
closeModal(): void {
  // const modalElement = document.getElementById('exchangeRateModal');
  // if (modalElement) {
  //   const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
  //   bootstrapModal?.hide();
  // }
  const modal = document.getElementById('exchangeRateModal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}

showExchangeRateModal(): void {
  // const modal = new bootstrap.Modal(document.getElementById('exchangeRateModal')!);
  // modal.show();
  const modal = document.getElementById('exchangeRateModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
}
showExchangeRateModal2():void{
  // const modal = new bootstrap.Modal(document.getElementById('exchangeRateModal2')!);
  // modal.show();
  const modal = document.getElementById('exchangeRateModal2');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
}


fetchBanks(){
  this.receiptService.getBanks(1,this.defaultCurrencyId)
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
//  if (chargesModal) {
//   chargesModal.classList.add('show');
//   chargesModal.style.display = 'block';
//  }
}

  // Handle changes in charge radio button
  onChargesChange(option: string): void {
    if (option === 'yes') {
      this.chargesEnabled = true;
      this.fetchCharges();
      this.fetchExistingCharges(this.globalReceiptNumber);
      const chargeType = this.receiptingDetailsForm.get('selectedChargeType')?.value;
      const chargeAmount = this.receiptingDetailsForm.get('chargeAmount')?.value;
      this.chargeAmount=chargeAmount;
     // console.log(chargeAmount);
      //this.receiptingDetailsForm.get('chargeAmount')?.setValue(null); // Clear charge amount
      // const modal = document.getElementById('chargesModal');
      // if (modal) {
      //   const bootstrapModal = new bootstrap.Modal(modal);
      //   bootstrapModal.show();
      // }
      const modal = document.getElementById('chargesModal');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
      }
    }
  }

  // Fetch charge types
  fetchCharges(): void {
    this.receiptService.getCharges(this.GlobalUser.organizationId, 1).subscribe({
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
  fetchExistingCharges(receiptNo:number): void {
    
    this.receiptService.getExistingCharges(receiptNo).subscribe({
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
        //alert('All fields are required!');
        this.globalMessagingService.displayWarningMessage('Warning:','All Fields are required');
        return;
      }
  
      const payload = {
        addEdit: 'E',
        receiptExpenseId: this.editReceiptExpenseId, // Use the stored receiptExpenseId
        receiptNo: this.globalReceiptNumber, // Assuming a static receipt number for now
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
      receiptNo: this.globalReceiptNumber,
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
  this.fetchExistingCharges(this.globalReceiptNumber);
  }



submitChargeManagement(): void {
  const payload: ChargeManagementDTO = {
    addEdit: 'A',
    //receiptExpenseId: 12345678,
    // receiptNo: this.branchNo,
    receiptNo:this.globalReceiptNumber,
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
  this.receiptService.getAccountTypes(this.GlobalUser.organizationId, 1,this.GlobalUser.id).subscribe({
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
        //console.log('Clients:', this.clients);
          //alert('clients found');

          if (!this.clients.length) {
            alert('No clients found for the given criteria.');
            
          }
        },
        error: (err) => {
          alert('error fetching clients');
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
   // this.disablePaymentRef=true;
 
     this.receiptingDetailsForm.patchValue({ drawersBank: 'N/A' });
     chequeTypeModal?.hide();

     this.receiptingDetailsForm.patchValue({ chequeType: '' });
     this.receiptingDetailsForm.get('drawersBank')?.disable();
     this.receiptingDetailsForm.get('paymentRef')?.disable();
     this.handleCashMode(chequeTypeModal);
  } else if (paymentMode === 'CHEQUE') {
     this.openChequeTypeModal();
    this.handleChequeMode(chequeTypeModal);
    const chequeTypeModalElement = document.getElementById('chequeTypeModal');
    if (chequeTypeModalElement) {
      chequeTypeModalElement.classList.add('show');
      chequeTypeModalElement.style.display='block';
    }
    // chequeTypeModal?.show(); // Always show the modal when "CHEQUE" is selected
    this.receiptingDetailsForm.get('drawersBank')?.enable();
    this.receiptingDetailsForm.get('paymentRef')?.enable();
  } else {
   this.resetChequeFields(chequeTypeModal);
   this.receiptingDetailsForm.get('drawersBank')?.enable();
   this.receiptingDetailsForm.get('paymentRef')?.enable();
  }

 
}
openChequeTypeModal(): void {
  const chequeTypeModal= document.getElementById('chequeTypeModal');
   if (chequeTypeModal) {
     chequeTypeModal.classList.add('show'); // Show the modal
     chequeTypeModal.style.display='block';
   }}
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
  // const chequeTypeModalElement = document.getElementById('chequeTypeModal');
  // if (chequeTypeModalElement) {
  //   chequeTypeModalElement.classList.add('show');
  //   chequeTypeModalElement.style.display='block';
  // }
  chequeTypeModal?.hide();
  
  this.receiptingDetailsForm.get('chequeType')?.disable();
  this.receiptingDetailsForm.patchValue({ chequeType: '' });
}

onCancelChequModal(chequeTypes:any){
  if(this.chequeTypes == null){
//alert('please select cheque type');
this.globalMessagingService.displayErrorMessage('Error', 'Please select a cheque type.');
  }else{
    const chequeTypeModalElement = document.getElementById('chequeTypeModal');
  if (chequeTypeModalElement) {
    chequeTypeModalElement.classList.remove('show');
    chequeTypeModalElement.style.display='block';
  }
    // const ChequeTypeModal= new bootstrap.Modal(document.getElementById('chequeTypeModal')!);
    // ChequeTypeModal.hide();
   
  }

}

onChequeTypeSelected():any{
  const chequeType = this.receiptingDetailsForm.get('chequeType')?.value;

if (chequeType) {
  // Close the modal if a cheque type is selected
  const chequeTypeModalElement = document.getElementById('chequeTypeModal');
  if (chequeTypeModalElement) {
    chequeTypeModalElement.classList.remove('show');
    chequeTypeModalElement.style.display='block';
    // const chequeTypeModal = bootstrap.Modal.getInstance(chequeTypeModalElement);
    // chequeTypeModal?.hide();
  }
} else {

  this.globalMessagingService.displayErrorMessage('Error', 'Please select a cheque type.');
  //this.globalMessagingService.displayWarningMessage('Warning', 'Please select a cheque type.');
 
}
}







// onFileSelected(event: any): void {

//   if (event.target.files.length > 0) {
//     this.selectedFile = event.target.files[0];
//     console.log('Selected file:', this.selectedFile.name); // Debug log
//     this.currentFileIndex = this.fileDescriptions.length; // Set to the next index
//     this.fileDescriptions.push({ file: this.selectedFile, description: '' }); // Add the file to the array
//     //console.log('Selected file:', this.selectedFile);
//     console.log('File descriptions:', this.fileDescriptions); // Debug log
//      // Convert file to base64
//      const reader = new FileReader();
//      reader.onload = () => {
//        this.base64Output = reader.result as string;
//      };
//      reader.readAsDataURL(this.selectedFile);
//     this.openModal(this.fileDescriptions.length -1); // Open modal for the last added file
//   } else {
//    // console.error('No file selected'); // Log if no file is selected
//     this.selectedFile = null; // Reset selectedFile
   
//   }
// }


// uploadFile(): void {
//   if (!this.selectedFile || !this.base64Output) {
//     alert('no selected file');
//     return;
//   }

//   if (!this.globalGetAllocation.length) {
//     alert('no fetched allocations');
//     return;
//   }

//   const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;

//   try {
//     // Create array of requests by flattening receiptParticularDetails
//     const requests: ReceiptUploadRequest[] = [];
    
//     // Loop through each allocation
//     this.globalGetAllocation.forEach(allocation => {
//       // Check if receiptParticularDetails exists and is an array
//       if (allocation.receiptParticularDetails && Array.isArray(allocation.receiptParticularDetails)) {
//         // Create a request for each detail in receiptParticularDetails
//         allocation.receiptParticularDetails.forEach(detail => {
//           requests.push({
//             docType: 'RECEIPT',
//             docData: this.base64Output,
//             module: 'CB-RECEIPTS',
//             originalFileName: this.selectedFile.name,
//             filename: this.selectedFile.name,
//             referenceNo: detail.referenceNumber,
//             docDescription: this.description,
//             amount: detail.premiumAmount, // Assuming this is the correct field
//             paymentMethod: paymentMode,
//             policyNumber: detail.policyNumber
//           });
//         });
//       }
//     });

//     console.log('Request payload:', requests.reduce((acc, req, index) => {
//       acc[index] = req;
//       return acc;
//     }, {}));

//     this.receiptService.uploadFiles(requests).subscribe({
//       next: (response) => {
//         console.log('Upload successful:', response);
//         this.globalDocId=response.docId;
//         this.globalMessagingService.displaySuccessMessage('Success', 'Receipt uploaded successfully');
//         // Reset form fieldsb
//         this.selectedFile = null;
//         this.base64Output = '';
//         this.fileDescriptions = [];
//         this.currentFileIndex = 0;
//         this.fetchDocByDocId(this.globalDocId);
//       },
//       error: (error) => {
//         console.error('Upload error:', error);
//         this.globalMessagingService.displayErrorMessage('Error', 'Failed to upload receipt');
//       }
//     });

//   } catch (error) {
//     console.error('Error preparing upload:', error);
//     this.globalMessagingService.displayErrorMessage('Error', 'Error preparing file upload');
//   }
// }
fetchDocByDocId(docId: string){
  this.dmsService.getDocumentById(docId).subscribe({
    next:(response)=>{
      this.uploadedFile = response;
      this.globalMessagingService.displaySuccessMessage('Success','Doc retrieved successfullly');
console.log('doc data>>',response);
    },
    error:(error)=>{
      this.globalMessagingService.displayErrorMessage('Error',error.error.error);
    }


  })
}
// openFile() {
//   if (this.uploadedFile && this.uploadedFile.byteData) {
//     try {
//       // Handle both formats: with or without data URI prefix
//       let base64String = this.uploadedFile.byteData;
//       if (base64String.includes(',')) {
//         base64String = base64String.split(',')[1];
//       }

//       // Decode the base64 string
//       const byteCharacters = atob(base64String);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
      
//       // Create blob with proper content type
//       const blob = new Blob([byteArray], { 
//         type: this.uploadedFile.contentType || 'application/pdf' 
//       });
      
//       // Create and open URL
//       if (this.decodedFileUrl) {
//         URL.revokeObjectURL(this.decodedFileUrl); // Clean up old URL
//       }
//       this.decodedFileUrl = URL.createObjectURL(blob);
//       window.open(this.decodedFileUrl, '_blank');
//     } catch (error) {
//       console.error('Error processing file:', error);
//       this.globalMessagingService.displayErrorMessage(
//         'Error', 
//         'Failed to process the file. The file might be corrupted or in an invalid format.'
//       );
//     }
//   } else {
//     this.globalMessagingService.displayErrorMessage('Error', 'No file data available');
//   }
// }
// onFileSelected(event: any): void {
//   if (event.target.files.length > 0) {
//     this.selectedFile = event.target.files[0];
//     console.log('Selected file:', this.selectedFile.name, 'Type:', this.selectedFile.type); // Debug log

//     // Add file to descriptions array
//     this.currentFileIndex = this.fileDescriptions.length;
//     this.fileDescriptions.push({ file: this.selectedFile, description: '' });
//     console.log('File descriptions:', this.fileDescriptions);

//     // Convert file to Base64
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.base64Output = reader.result as string; // Includes the "data:" prefix
//       console.log('Base64 Encoded String (Preview):', this.base64Output.slice(0, 50)); // Debug log
//     };
//     reader.readAsDataURL(this.selectedFile); // Encodes with "data:" prefix
//     this.openModal(this.fileDescriptions.length - 1); // Open modal for the last added file
//   } else {
//     this.selectedFile = null; // Reset selectedFile if no file is selected
//   }
// }
// onFileSelected(event: any): void {
//   if (event.target.files.length > 0) {
//     this.selectedFile = event.target.files[0];
//     console.log('Selected file:', this.selectedFile.name, 'Type:', this.selectedFile.type); // Debug log

//     // Add file to descriptions array
//     this.currentFileIndex = this.fileDescriptions.length;
//     this.fileDescriptions.push({ file: this.selectedFile, description: '' });
//     console.log('File descriptions:', this.fileDescriptions);

//     // Convert file to Base64 without the "data:" prefix
//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64String = reader.result as string;

//       // Remove the "data:" prefix if present
//       if (base64String.includes(',')) {
//         this.base64Output = base64String.split(',')[1];
//       } else {
//         this.base64Output = base64String;
//       }

//       console.log('Base64 Encoded String (No Prefix):', this.base64Output.slice(0, 50)); // Debug log
//     };
//     reader.readAsDataURL(this.selectedFile);
//     this.openModal(this.fileDescriptions.length - 1); // Open modal for the last added file
//   } else {
//     this.selectedFile = null; // Reset selectedFile if no file is selected
//   }
// }
onFileSelected(event: any): void {
  if (event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile.name, 'Type:', this.selectedFile.type); // Debug log

    // Add file to descriptions array
    this.currentFileIndex = this.fileDescriptions.length;
    this.fileDescriptions.push({ file: this.selectedFile, description: '' });
    console.log('File descriptions:', this.fileDescriptions);

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

      console.log('Base64 Encoded String (No Prefix):', this.base64Output.slice(0, 50)); // Debug log
    };
    reader.readAsDataURL(this.selectedFile);
    this.openModal(this.fileDescriptions.length - 1); // Open modal for the last added file
  } else {
    this.selectedFile = null; // Reset selectedFile if no file is selected
  }
}
// openFile(): void {
//   if (this.uploadedFile && this.uploadedFile.byteData) {
//     try {
//       // Directly use the Base64 string without checking for "data:" prefix
//       const base64String = this.uploadedFile.byteData;

//       // Decode Base64 string
//       const byteCharacters = atob(base64String);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);

//       // Create Blob with correct content type
//       const blob = new Blob([byteArray], {
//         type: this.uploadedFile.contentType || 'application/pdf', // Use correct MIME type
//       });

//       // Generate Blob URL and open it
//       if (this.decodedFileUrl) {
//         URL.revokeObjectURL(this.decodedFileUrl); // Clean up old URL
//       }
//       this.decodedFileUrl = URL.createObjectURL(blob);
//       window.open(this.decodedFileUrl, '_blank');
//     } catch (error) {
//       console.error('Error processing file:', error);
//       this.globalMessagingService.displayErrorMessage(
//         'Error',
//         'Failed to process the file. The file might be corrupted or in an invalid format.'
//       );
//     }
//   } else {
//     this.globalMessagingService.displayErrorMessage('Error', 'No file data available');
//   }
// }
uploadFile(): void {
  if (!this.selectedFile || !this.base64Output) {
    alert('No selected file');
    return;
  }

  if (!this.globalGetAllocation.length) {
    alert('No fetched allocations');
    return;
  }

  const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;

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
            docDescription: this.description,
            amount: detail.premiumAmount,
            paymentMethod: paymentMode,
            policyNumber: detail.policyNumber,
          });
        });
      }
    });

    console.log('Request payload:', requests);

    this.receiptService.uploadFiles(requests).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        this.globalDocId = response.docId;
        this.globalMessagingService.displaySuccessMessage('Success', 'Receipt uploaded successfully');
        this.selectedFile = null;
        this.base64Output = '';
        this.fileDescriptions = [];
        this.currentFileIndex = 0;
        this.fetchDocByDocId(this.globalDocId);
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to upload receipt');
      },
    });
  } catch (error) {
    console.error('Error preparing upload:', error);
    this.globalMessagingService.displayErrorMessage('Error', 'Error preparing file upload');
  }
}
openFile(): void {
  if (this.uploadedFile && this.uploadedFile.byteData) {
    try {
      // Get Base64 string from the file data
      const base64String = this.uploadedFile.byteData;

      // Decode Base64 string to binary data
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Determine file type
      const isPdf = this.uploadedFile.docName?.toLowerCase().endsWith('.pdf');
      const blobType = isPdf ? 'application/pdf' : (this.uploadedFile.contentType || 'application/octet-stream');

      // Create Blob with correct type
      const blob = new Blob([byteArray], { type: blobType });

      // Handle PDF files
      if (isPdf) {
        // Generate Blob URL and open in a new tab
        if (this.decodedFileUrl) {
          URL.revokeObjectURL(this.decodedFileUrl); // Clean up old URL
        }
        this.decodedFileUrl = URL.createObjectURL(blob);
        window.open(this.decodedFileUrl, '_blank');
      } else {
        // Handle non-PDF files: Provide a download option
        const downloadUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.download = this.uploadedFile.docName || 'downloaded_file';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(downloadUrl); // Clean up the download URL
      }
    } catch (error) {
      console.error('Error processing file:', error);
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Failed to process the file. The file might be corrupted or in an invalid format.'
      );
    }
  } else {
    this.globalMessagingService.displayErrorMessage('Error', 'No file data available');
  }
}

// openFile(): void {
//   if (this.uploadedFile && this.uploadedFile.byteData) {
//     try {
//       // Get Base64 string
//       const base64String = this.uploadedFile.byteData;

//       // Decode Base64 string
//       const byteCharacters = atob(base64String);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);

//       // Create Blob with correct content type
//       const blob = new Blob([byteArray], {
//         type: this.uploadedFile.contentType || 'application/octet-stream',
//       });

//       // Check if the file is a PDF
//       if (this.uploadedFile.docName?.toLowerCase().endsWith('.pdf')) {
//         // Generate Blob URL and open it in a new tab for PDFs
//         if (this.decodedFileUrl) {
//           URL.revokeObjectURL(this.decodedFileUrl); // Clean up old URL
//         }
//         this.decodedFileUrl = URL.createObjectURL(blob);
//         window.open(this.decodedFileUrl, '_blank');
//       } else {
//         // Non-PDF files: provide a download option
//         const downloadUrl = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = downloadUrl;
//         a.download = this.uploadedFile.docName || 'downloaded_file';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(downloadUrl); // Clean up the download URL
//       }
//     } catch (error) {
//       console.error('Error processing file:', error);
//       this.globalMessagingService.displayErrorMessage(
//         'Error',
//         'Failed to process the file. The file might be corrupted or in an invalid format.'
//       );
//     }
//   } else {
//     this.globalMessagingService.displayErrorMessage('Error', 'No file data available');
//   }
// }

// openFile(): void {
//   if (this.uploadedFile && this.uploadedFile.byteData) {
//     try {
//       let base64String = this.uploadedFile.byteData;

//       // Handle Base64 strings with or without the "data:" prefix
//       if (base64String.includes(',')) {
//         base64String = base64String.split(',')[1];
//       }

//       // Decode Base64 string
//       const byteCharacters = atob(base64String);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);

//       // Create Blob with correct content type
//       const blob = new Blob([byteArray], {
//         type: this.uploadedFile.contentType || 'application/pdf', // Use correct MIME type
//       });

//       // Generate Blob URL and open it
//       if (this.decodedFileUrl) {
//         URL.revokeObjectURL(this.decodedFileUrl); // Clean up old URL
//       }
//       this.decodedFileUrl = URL.createObjectURL(blob);
//       window.open(this.decodedFileUrl, '_blank');
//     } catch (error) {
//       console.error('Error processing file:', error);
//       this.globalMessagingService.displayErrorMessage(
//         'Error',
//         'Failed to process the file. The file might be corrupted or in an invalid format.'
//       );
//     }
//   } else {
//     this.globalMessagingService.displayErrorMessage('Error', 'No file data available');
//   }
// }
// openFile(): void {
//   if (this.uploadedFile && this.uploadedFile.byteData) {
//     try {
//       // Get Base64 string
//       const base64String = this.uploadedFile.byteData;

//       // Decode Base64 string
//       const byteCharacters = atob(base64String);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);

//       // Create Blob with correct content type
//       const blob = new Blob([byteArray], {
//         type: this.uploadedFile.contentType || 'application/octet-stream',
//       });

//       // Check if the file is a PDF
//       if (this.uploadedFile.docName?.toLowerCase().endsWith('.pdf')) {
//         // Generate Blob URL and open it in a new tab for PDFs
//         if (this.decodedFileUrl) {
//           URL.revokeObjectURL(this.decodedFileUrl); // Clean up old URL
//         }
//         this.decodedFileUrl = URL.createObjectURL(blob);
//         window.open(this.decodedFileUrl, '_blank');
//       } else {
//         // Non-PDF files: provide a download option
//         const downloadUrl = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = downloadUrl;
//         a.download = this.uploadedFile.docName || 'downloaded_file';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(downloadUrl); // Clean up the download URL
//       }
//     } catch (error) {
//       console.error('Error processing file:', error);
//       this.globalMessagingService.displayErrorMessage(
//         'Error',
//         'Failed to process the file. The file might be corrupted or in an invalid format.'
//       );
//     }
//   } else {
//     this.globalMessagingService.displayErrorMessage('Error', 'No file data available');
//   }
// }

// uploadFile(): void {
//   if (!this.selectedFile || !this.base64Output) {
//     alert('No selected file');
//     return;
//   }

//   if (!this.globalGetAllocation.length) {
//     alert('No fetched allocations');
//     return;
//   }

//   const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;

//   try {
//     const requests: ReceiptUploadRequest[] = [];

//     this.globalGetAllocation.forEach((allocation) => {
//       if (allocation.receiptParticularDetails && Array.isArray(allocation.receiptParticularDetails)) {
//         allocation.receiptParticularDetails.forEach((detail) => {
//           requests.push({
//             docType: 'RECEIPT',
//             docData: this.base64Output, // Includes "data:" prefix
//             module: 'CB-RECEIPTS',
//             originalFileName: this.selectedFile.name,
//             filename: this.selectedFile.name,
//             referenceNo: detail.referenceNumber,
//             docDescription: this.description,
//             amount: detail.premiumAmount,
//             paymentMethod: paymentMode,
//             policyNumber: detail.policyNumber,
//           });
//         });
//       }
//     });

//     console.log('Request payload:', requests);

//     this.receiptService.uploadFiles(requests).subscribe({
//       next: (response) => {
//         console.log('Upload successful:', response);
//         this.globalDocId = response.docId;
//         this.globalMessagingService.displaySuccessMessage('Success', 'Receipt uploaded successfully');
//         this.selectedFile = null;
//         this.base64Output = '';
//         this.fileDescriptions = [];
//         this.currentFileIndex = 0;
//         this.fetchDocByDocId(this.globalDocId);
//       },
//       error: (error) => {
//         console.error('Upload error:', error);
//         this.globalMessagingService.displayErrorMessage('Error', 'Failed to upload receipt');
//       },
//     });
//   } catch (error) {
//     console.error('Error preparing upload:', error);
//     this.globalMessagingService.displayErrorMessage('Error', 'Error preparing file upload');
//   }
// }



 deleteFile() {
    if (this.uploadedFile && this.globalDocId) {
      this.globalMessagingService.displaySuccessMessage('success','Doc deleted successfully');
      
      this.dmsService.deleteDocumentById(this.globalDocId).subscribe({
        next: (response) => {
          
          this.globalMessagingService.displaySuccessMessage('Success', 'File deleted successfully');
          this.uploadedFile = null;
          this.decodedFileUrl = null;
          console.log('success',response);
        },
        error: (error) => {
        console.error('error',error);
         // this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete file');
        }
      });
    } else {
      alert('cannot find docId');

      this.globalMessagingService.displayErrorMessage('Error', 'No file selected for deletion');
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
  const description = this.receiptingDetailsForm.get('description')?.value; // Get the description from the form
 // console.log('Description:', description);
  //console.log('Current file index:', this.currentFileIndex); // Debug log
  //console.log('File descriptions before update:', this.fileDescriptions); // Debug log
  if (this.currentFileIndex >= 0 && this.currentFileIndex < this.fileDescriptions.length) {
  if (description) { // Check if description is not empty
    this.fileDescriptions[this.currentFileIndex].description = description; // Update the description for the current file
   // console.log('Updated file description:', this.fileDescriptions[this.currentFileIndex]);
    
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
  this.fileDescriptions.splice(index, 1); // Remove the file from the array
  //console.log('File removed. Updated file descriptions:', this.fileDescriptions);
}





onClickClient(selectedClient) {
  this.selectedClient = selectedClient; // Store the selected client
 // console.log('SELECTED CLIENT',this.selectedClient);
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

fetchTransactions(systemShortDesc: string,
  clientCode: number,
  accountCode: number,
  receiptType: string,
  clientShtDesc: string): void {
  this.receiptService.getTransactions(systemShortDesc, clientCode, accountCode, receiptType, clientShtDesc).subscribe({
    next: (response) => {
      this.transactions = response.data;
      //console.log('returned>>',this.transactions);
      // Clear existing controls
      while (this.allocatedAmountControls.length !== 0) {
        this.allocatedAmountControls.removeAt(0);
      }

      // Add new controls for each transaction
      this.transactions.forEach(() => {
        this.allocatedAmountControls.push(
          this.fb.group({
            allocatedAmount: [0, Validators.required],
            commissionChecked: ['N']
          })
        );
      });

      // For debugging
      //console.log('Transactions:', this.transactions);
      //console.log('Form Controls:', this.allocatedAmountControls.value);
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', err.error.error);
    }
  });
}

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

    this.globalMessagingService.displayErrorMessage('Error', 'Please enter the amount issued.');
    return false; // Stop further execution
  }

  // Step 2: Validate the total allocated amount against the issued amount
  if (this.totalAllocatedAmount < amountIssued) {
    this.globalMessagingService.displayErrorMessage('Error', 'Amount issued is not fully allocated.');
    
    return false; // Stop further execution
  }

  if (this.totalAllocatedAmount > amountIssued) {
 
   
    this.globalMessagingService.displayErrorMessage('Error','Total allocated amount exceeds the amount issued.');
    return false; // Stop further execution
  }

  // Step 3: If all validations pass, submit the data
  //alert('Submitted successfully.');
  this.allocateAndPostAllocations();
  return true;
}

allocateAndPostAllocations(): void {
  // Get the deductions value from the form
  const deductionsValue = this.receiptingDetailsForm.get('deductions')?.value;
  
  // Create an array to store allocated transactions with their form control values
  const allocatedTransactionsData = this.transactions.map((transaction, index) => {
    const allocatedAmountControl = this.getFormControl(index, 'allocatedAmount');
    const allocatedAmount = allocatedAmountControl?.value || 0;
    
    // For debugging
    console.log(`Transaction ${index}:`, {
      policyNumber: transaction.clientPolicyNumber,
      allocatedAmount: allocatedAmount
    });

    return {
      transaction,
      allocatedAmount,
      index
    };
  }).filter(item => item.allocatedAmount > 0);

  // For debugging
 // console.log('Allocated Transactions:', allocatedTransactionsData);

  // Check if there are any allocated transactions
  if (allocatedTransactionsData.length === 0) {
    this.globalMessagingService.displayErrorMessage('Error', 'No transactions have been allocated');
    return;
  }

  const receiptParticulars = {
    receiptNumber: this.globalReceiptNumber,
    capturedBy: this.loggedInUser.code,
    systemCode: this.selectedClient.systemCode,
    branchCode: 1,
    clientCode: this.selectedClient.code,
    clientShortDescription: this.selectedClient.shortDesc,
    receiptType: this.selectedClient.receiptType,
    clientName: this.selectedClient.name,
    sslAccountCode: this.selectedClient.accountCode,
    accountTypeId: '',
    referenceNumber: '',
    receiptParticularDetails: allocatedTransactionsData.map(({ transaction, allocatedAmount, index }) => ({
      policyNumber: transaction.clientPolicyNumber,
      referenceNumber: transaction.referenceNumber,
      transactionNumber: transaction.transactionNumber,
      batchNumber: transaction.policyBatchNumber,
      premiumAmount: allocatedAmount,
      loanAmount: 0,
      pensionAmount: 0,
      miscAmount: 0,
      endorsementCode: 0,
      endorsementDrCrNumber: 'DR123456',
      includeCommission: this.getFormControl(index, 'commissionChecked')?.value === 'Y' ? 'Y' : 'N',
      commissionAmount: transaction.commission,
      overAllocated: null,
      includeVat: deductionsValue ? 'Y' : 'N',
      clientPolicyNumber: transaction.clientPolicyNumber
    }))
  };

  // For debugging - log the final payload
  //console.log('Final Payload:', receiptParticulars);

  const allocationData: AllocationDTO = {
    receiptParticulars: [receiptParticulars]
  };

  // Post the allocation data
  this.receiptService.postAllocation(this.GlobalUser.id, allocationData).subscribe({
    next: (response) => {
      this.allocation = false;
      this.globalMessagingService.displaySuccessMessage('Success', 'Allocations posted successfully');
      this.getAllocations();
      
    },
    error: (err) => {
      //console.error('Error posting allocation:', err);
      this.globalMessagingService.displayErrorMessage('Error', 'Failed to post allocations');
    }
  });
}
getAllocations(){
  this.receiptService.getAllocations(this.globalReceiptNumber,this.GlobalUser.id).subscribe({
    next:(response)=>{
//this.getAllocation=response.data;
this.getAllocation = response.data.filter(allocation => 
  allocation.receiptParticularDetails.some(detail => detail.premiumAmount > 0));
//console.log('allocated amounts',this.getAllocation);

this.isAllocationCompleted = true;
this.allocationsReturned=this.getAllocation;
this.globalGetAllocation=this.getAllocation;
console.log('getallocations>>',this.globalGetAllocation);
this.globalMessagingService.displaySuccessMessage('success', 'detail');

    },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Failed to fetch Allocations',err);
      //alert('false');
    }
  })
}

deleteAllocation(receiptDetailCode: number): void {
  // First, show a confirmation dialog
  // if (confirm('Are you sure you want to delete this allocation?')) {
    this.receiptService.deleteAllocation(receiptDetailCode).subscribe({
      next: (response) => {
        if (response.success) {
          // Remove the deleted allocation from the local array
          this.getAllocation = this.getAllocation.map(allocation => ({
            ...allocation,
            receiptParticularDetails: allocation.receiptParticularDetails.filter(
              detail => detail.code !== receiptDetailCode
            )
          }));

          // If all allocations for a receipt are deleted, remove that receipt
          this.getAllocation = this.getAllocation.filter(
            allocation => allocation.receiptParticularDetails.length > 0
          );

          // Show success message
          this.globalMessagingService.displaySuccessMessage(
            'Success', 
            'Allocation deleted successfully'
          );

          // Refresh the allocations list
          this.getAllocations();
        } else {
          this.globalMessagingService.displayErrorMessage(
            'Error', 
            'Failed to delete allocation'
          );
        }
      },
      error: (err) => {
      //  console.error('Error deleting allocation:', err);
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error?.message || 'Failed to delete allocation'
        );
      }
    });
  
}

// submitReceipt(): void {
//   // if (this.receiptingDetailsForm.invalid) {
//   //   this.globalMessagingService.displayErrorMessage('Error', 'Please fill in all required fields');
//   //   return;
//   // }

//   // Get form values
//   const formValues = this.receiptingDetailsForm.value;

//   // Get allocated transactions from getAllocation array
//   const allocatedDetails = this.getAllocation?.[0]?.receiptParticularDetails || [];

//   // Map allocated transactions to receiptParticularDetailUpdateRequests format
//   const receiptParticularDetailUpdateRequests = allocatedDetails.map(detail => ({
//     receiptParticularDetailCode: detail.code,
//     premium: detail.premiumAmount,
//     loan: detail.loanAmount || 0,
//     pension: detail.pensionAmount || 0,
//     misc: detail.miscAmount || 0
//   }));

//   const receiptData: ReceiptSaveDTO = {
//     receiptNo: 147,
//     receiptCode: "HDO/DEF/24/0147",
//     receiptDate: formValues.receiptDate,
//     amount: formValues.amountIssued,
//     paidBy: formValues.receivedFrom,
//     currencyCode: formValues.currency,
//     branchCode: 1,
//     paymentMode: formValues.paymentMode,
//     paymentMemo: formValues.narration,
//     docDate: formValues.documentDate,
//     drawerBank: formValues.drawersBank,
//     userCode: this.GlobalUser.id,
//     narration: formValues.narration,
//     insurerAccount: formValues.insurerAccount || 'someInsurerAccount',
//     receivedFrom: formValues.receivedFrom,
//     grossOrNet: formValues.deductions || 'Gross',
//     sysShtDesc: this.selectedClient?.shortDesc || '',
//     receiptingPointId: this.receiptingPointId,
//     receiptingPointAutoManual: formValues.receiptingPoint,
//     capitalInjection: formValues.capitalInjection,
//     chequeNo: formValues.chequeNumber || 0,
//     ipfFinancier: formValues.ipfFinancier,
//     receiptSms: '',
//     receiptChequeType: formValues.chequeType,
//     vatInclusive: formValues.deductions ? 'Yes' : 'No',
//     rctbbrCode: formValues.branchCode || '123',
//     directType: 'Direct',
//     pmBnkCode: 0,
//     dmsKey: 'Key123',
//     currencyRate: formValues.exchangeRate,
//     internalRemarks: formValues.narration,
//     manualRef: formValues.manualRef,
//     bankAccountCode: this.selectedBankCode,
//     grossOrNetAdminCharge: formValues.deductions ? 'Yes' : 'No',
//     insurerAcc: this.selectedClient?.accountCode || 123,
//     grossOrNetWhtax: formValues.deductions || 'None',
//     grossOrNetVat: formValues.deductions || 'None',
//     sysCode: this.selectedClient?.systemCode || 1,
//     bankAccountType: formValues.accountType,
//     // Add the mapped allocated transactions
//     receiptParticularDetailUpdateRequests: receiptParticularDetailUpdateRequests
//   };

//   // Log the payload for debugging
//   //console.log('Receipt Save Payload:', receiptData);

//   // Call the service to save the receipt
//   this.receiptService.saveReceipt(receiptData).subscribe({
//     next: (response) => {
//       this.globalMessagingService.displaySuccessMessage('Success', 'Receipt saved successfully');
//       // Additional success handling (e.g., navigation, form reset, etc.)
//     },
//     error: (error) => {
//       //console.error('Error saving receipt:', error);
//       this.globalMessagingService.displayErrorMessage(
//         'Error',
//         error.error?.message || 'Failed to save receipt'
//       );
//     }
//   });
// }
fetchParamStatus(){
  this.receiptService.getParamStatus('TRANSACTION_SUPPORT_DOCUMENTS').subscribe({
    next:(response)=>{
      //console.log('status',response.data);
      this.parameterStatus=response.data;
    },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Error:Failed to fetch Param Status',err.err.error);
    }
  })
}
submitReceipt(): any {
  // if (this.receiptingDetailsForm.invalid) {
  //   this.globalMessagingService.displayErrorMessage('Error', 'Please fill in all required fields');
  //   return;
  // }
  this.fetchParamStatus();
  if(this.parameterStatus=='N')
    {
     // alert('jey');
confirm('do you want to save receipt without uploading file?');
    }else{
     // alert('no');
      //confirm('are you sure to save receipt?');
      return true;
    }
  // Get form values
  const formValues = this.receiptingDetailsForm.value;

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
  
    receiptNo: String(this.globalReceiptNumber),
    receiptCode: formValues.receiptNumber,
    receiptDate: formValues.receiptDate ? new Date(formValues.receiptDate).toISOString().split('T')[0] : '',
    amount: String(formValues.amountIssued),  // Add decimal points for BigDecimal fields
    paidBy: formValues.receivedFrom ,
    currencyCode: String(formValues.currency), // Add quotes to ensure it's treated as string before conversion
   
   branchCode: "1",  // Add quotes to ensure it's treated as string before conversion
    paymentMode: formValues.paymentMode,
    paymentMemo: formValues.paymentRef || null,
    docDate: formValues.documentDate ? new Date(formValues.documentDate).toISOString().split('T')[0]:'' ,
    //drawerBank: formValues.drawersBank || 'N/A',
    drawerBank: formValues.drawersBank,
    userCode: this.GlobalUser.id,
    narration: formValues.narration,
    insurerAccount: null,
    receivedFrom: formValues.receivedFrom,
    grossOrNet: "G",
   // grossOrNet: formValues.deductions || '',
    sysShtDesc: null,
    receiptingPointId: this.receiptingPointId,
    receiptingPointAutoManual: this.receiptingPointAutoManual,
    //capitalInjection: "N",
    //capitalInjection: formValues.capitalInjection || "N",
    capitalInjection:  "N",
    chequeNo: null,
    ipfFinancier: null,
    receiptSms: "Y",
    receiptChequeType: null,
    vatInclusive: null,
    rctbbrCode: null,
    directType: null,
    pmBnkCode: null,
    dmsKey: null,
    currencyRate: null,
    internalRemarks: null,
   // manualRef:formValues.manualRef || null,
   manualRef: null,
   bankAccountCode: "526", // Add quotes to ensure it's treated as string before conversion
    grossOrNetAdminCharge: "G",
    insurerAcc: null,
    grossOrNetWhtax: null,
    grossOrNetVat: null,
    sysCode: this.selectedClient.systemCode,
    bankAccountType: "B"
  
}
  // const receiptData: ReceiptSaveDTO = {
  //   receiptNo: String( this.globalReceiptNumber), // Ensure it's a number
  //   receiptCode: String(formValues.receiptNumber), // Ensure it's a string
  //   receiptDate: formValues.receiptDate ? new Date(formValues.receiptDate).toISOString().split('T')[0] : '', // Format date
  //   amount: String(formValues.amountIssued || ''), // Ensure it's a number
  //   paidBy: String(formValues.receivedFrom || ''),
  //   currencyCode: String(formValues.currency || ''),
  //   branchCode: String(1),
  //   paymentMode: String(formValues.paymentMode || ''),
  //   // paymentMemo: String(formValues.narration || ''),
  //   paymentMemo: null,
  //   docDate: formValues.documentDate ? new Date(formValues.documentDate).toISOString().split('T')[0] : '',
  //   drawerBank: String(formValues.drawersBank || 'N/A'),
  //   userCode: Number(this.GlobalUser.id),
  //   narration: String(formValues.narration || ''),
  //   // insurerAccount: String(formValues.insurerAccount || ''),
  //   insurerAccount: null,
  //   receivedFrom: String(formValues.receivedFrom || ''),
  //   grossOrNet: String(formValues.deductions || 'Gross'),
    
  //   sysShtDesc: String(this.selectedClient?.shortDesc || null),
  //   receiptingPointId: Number(this.receiptingPointId || 0),
  //   receiptingPointAutoManual: String(this.receiptingPointAutoManual || ''),
  //   capitalInjection: String(formValues.capitalInjection || ''),
  //   // chequeNo: Number(formValues.chequeNumber || 0),
  //   chequeNo:null,
  //   ipfFinancier: String(formValues.ipfFinancier || null),
  //   receiptSms: '',
  //   receiptChequeType: String(formValues.chequeType || null),
  //   vatInclusive: formValues.deductions ? 'Yes' : 'No' || null,
  //   // rctbbrCode: String(formValues.branchCode || ''),
  //   rctbbrCode: null,
  //   // directType: 'Direct',
  //   directType: null,
  //   // pmBnkCode: Number(0),
  //   pmBnkCode: null,
  //   //dmsKey: String('' || null),
  //   dmsKey:  null,
  //   currencyRate: Number(formValues.exchangeRate || null),
  //   // internalRemarks: String(formValues.narration || ''),
  //   internalRemarks: formValues.narration || null,
  //   // manualRef: String(formValues.manualRef || ''),
  //  manualRef:formValues.manualRef || null,
  //   bankAccountCode: String(this.selectedBankCode || ''),
  //   grossOrNetAdminCharge: formValues.deductions ? 'Yes' : 'No' || '',
  //   insurerAcc: Number(this.selectedClient.accountCode || null),
  //   //grossOrNetWhtax: String(formValues.deductions || null),
  //   grossOrNetWhtax: formValues.deductions || null,
  //  // grossOrNetVat: String(formValues.deductions || null),
  //  grossOrNetVat: formValues.deductions || null,
  //   sysCode: Number(this.selectedClient.systemCode || 0),
  //   bankAccountType: String(formValues.accountType || ''),
  //   //receiptParticularDetailUpdateRequests
  // };

  // Log the payload for debugging
 // console.log('Receipt Save Payload:', JSON.stringify(receiptData, null, 2));

  // Call the service to save the receipt
  this.receiptService.saveReceipt(receiptData).subscribe({
    next: (response) => {
      this.globalMessagingService.displaySuccessMessage('Success', 'Receipt saved successfully');
   
// Retain only the specified fields after reset
this.isReceiptSaved=true;
// this.receiptingDetailsForm.reset({
//   currency: formValues.currency,
//   organization: formValues.organization,
//   selectedBranch: formValues.selectedBranch
// });
    },
    error: (error) => {
      console.error('Error saving receipt:', error);
      this.globalMessagingService.displayErrorMessage(
        'Error',
        error.error?.message || 'Failed to save receipt'
      );
    }
  });
}
fetchReceiptDetails(){
  this.receiptService.getReceiptDetails(this.globalReceiptNumber).subscribe({
    next:(response)=>{
      
      //console.log('receiptDetails>>',response.data);
      this.globalMessagingService.displaySuccessMessage('success','successfully retrieved receipt details');
    },
    error:(error)=>{
this.globalMessagingService.displayErrorMessage('Error',error.error?.message || 'Failed to fetch Receipt Details');
    }
  })
}
 }