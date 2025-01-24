import { Component, OnInit,NgZone,ViewChild, ElementRef,Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import {NarrationDTO,ReceiptNumberDTO,GenericResponse,ReceiptingPointsDTO,Transaction,Receipt,Client, AccountTypeDTO, BanksDTO, ClientsDTO, ChargesDTO, TransactionDTO, ExchangeRateDTO, ChargeManagementDTO, AllocationDTO, ExistingChargesResponseDTO, UploadReceiptDocsDTO, ReceiptSaveDTO, ReceiptParticularDetailsDTO, GetAllocationDTO, DeleteAllocationResponseDTO, BranchDTO, UsersDTO, Allocation, ReceiptRequest, ReceiptUploadRequest, FileDescription} from '../../data/receipting-dto'
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
import { FmsService } from '../../services/fms.service';
import { FmsSetupService } from '../../services/fms-setup.service';
import { PaymentModesDTO } from '../../data/auth-requisition-dto';
import { ReportsService } from 'src/app/shared/services/reports/reports.service';
import { ReportsDto } from 'src/app/shared/data/common/reports-dto';


@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],

})


export class ReceiptComponent implements OnInit {
    // 1.1 Form Controls
  receiptingDetailsForm: FormGroup;

  // 1.2 User & Organization and Branch Details
  loggedInUser: any;
  GlobalUser: any;
  organization: OrganizationDTO[];
  defaultOrgId: number;
  users:StaffDto;
  branches:BranchDTO[]=[];  
  organizationId: number;
  selectedCountryId: number | null = null;
  defaultCountryId: number;
  selectedOrganization: string | null = null; // Currently selected organization
  selectedBranchId:any;
defaultBranchId:any;
defaultBranchName:string;
  
  // 1.3 Receipt capture Details
  globalReceiptNumber: number;
  globalReceiptNo: string;
  currentReceiptingPoint: any;
drawersBanks:BankDTO[]=[];
originalNarration: string | null = null; 

   // 1.4 Client & Transaction Details
   selectedClient: any;
   transactions: TransactionDTO[] = [];
   accountTypes:AccountTypeDTO[]=[];
clients:ClientsDTO[]=[];
getAllocation:GetAllocationDTO[]=[];
   allocatedClients: any[] = [];
   remainingAmount: number = 0;
   globalGetAllocation:any;
   totalAllocatedAmount = 0;
   fetchedAllocations: Allocation[] = [];
   searchClients: any[] = [];
searchQuery: string = '';
allocationsReturned:any;
cumulativeAllocatedAmount: number = 0;
globalAccountTypeSelected:any;
accountTypeArray:AccountTypeDTO[]=[];

capitalInjection:string;
NoCapitalInjection:string;
// totalAllocatedAmount: number = 0;

   // 1.5 UI Control Flags
  isSubmitButtonVisible: boolean = false;
  canAddAllocation: boolean = false;
  isAllocationCompleted: boolean = false;
  isClientSelected: boolean = false;
  chargesEnabled: boolean = false;
  isAccountTypeSelected = false;
  loading = false; 
  isNarrationFromLov = false; 
  backdatingEnabled = true; // Adjust this based on your logic
  isSaveBtnActive=true;
  isReceiptSaved=false;
  onclicked:boolean=false;
  allocation: boolean = false;
  getAllocationStatus:boolean=false;
onBankSelected:boolean=false;
showSelectedClientTable=false;

  // 1.6 File Upload Properties
  selectedFile: File | null = null;
  fileDescriptions: { file: File; description: string }[] = []; // Initialize the array
  base64Output: string = '';
currentFileIndex: number = 0;
decodedFileUrl: string | null = null;
uploadedFile: any = null;
globalFiles:any[]=[];
globalDocId:string;
description: string = '';
isUploadDisabled: boolean = true; // Initialize as true (button is inactive by default)
isFileUploadButtonDisabled: boolean = false; // Controls the "File Upload" button state
//1.7 charges details
chargeAmount: number = 0;
chargeTypes: string[]=[];
chargeAmountInput: number = 0;
receiptChargeId!: number; // Component-level variable to store the selected charge ID
chargeList:ExistingChargesResponseDTO[];
charges:ChargesDTO[]=[];
editReceiptExpenseId: number | null = null; // To hold the receiptExpenseId of the edited charge

//1.8 payment mode details
  paymentMode: string = '';
  paymentModes:PaymentModesDTO[]=[];
  chequeTypes = ['normal Cheque', 'pd Cheque'];
  filePath: string | null = null;
  // fileName: string | null = null;
 
 

//Bank Details
bankAccounts:BanksDTO[]=[];
globalBankAccountVariable:any;
selectedBankCode:number;
filteredBankAccounts: BanksDTO[] = [];
bankSearchTerm: string = '';
  
 
 

   
 
   
//currency details
currencies:CurrencyDTO[]=[];
defaultCurrencyId: number | null = null;
exchangeRate: number =0; // Default exchange rate


currencySymbolGlobal:string | undefined;
selectedCurrencySymbol: string | undefined; // To store the currency symbol for checks
selectedCurrencyCode: number=0;
currencyGlobal: number | null = null;
exchangeRates: string | undefined; // Fetched exchange rate
manualExchangeRate:any;
defaultCurrencyName:any;

//receipting point details
receiptingPoints: ReceiptingPointsDTO[]=[];
receiptingPointId:number;
receiptingPointAutoManual:string;
receiptingPointName:string;

//narration details
narrations:NarrationDTO[]=[];
filteredNarrations: NarrationDTO[] = [];

 //document and receipt date details
 minDate: string; // To enable backdating if necessary
 maxDate: string; // To disable future dates

//save and print receipt details
 globalReceiptDetails:any;

isReceiptDownloading = false; // Tracks if the report is being downloaded
 parameterStatus:string;
 receiptResponse:any;
 isReceiptPrinted:boolean=false;
 isGeneratingReport: boolean = false; // Tracks report generation state

  @ViewChild('fileDescriptionModal', { static: false }) fileDescriptionModal!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('printTemplate', { static: false }) printTemplate!: ReceiptComponent;
  

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
 private dmsService:DmsService,
 private fmsService:FmsService,
 private fmsSetupService:FmsSetupService,
 private reportService:ReportsService

) {


}
ngOnInit(): void {
  this.captureReceiptForm();
    this.loggedInUser = this.authService.getCurrentUser();
    const storedTotal = localStorage.getItem('totalAllocatedAmount');
    this.totalAllocatedAmount = storedTotal ? JSON.parse(storedTotal) : 0;
    this.fetchUserDetails();
    this.fetchOrganization(); // fetches branches and other details
    // this.fetchCurrencies();
    this.fetchNarrations();


 




// Set the minDate and maxDate for date validation
 const currentDate = new Date();
 this.minDate = ''; // Set this based on your business logic (e.g., earliest backdate allowed)
 this.maxDate = this.formatDate(currentDate);

// this.getAllocations();
//console.log('logged user>',this.loggedInUser);
//console.log(this.currencies);
//console.log('>>>',this.sessionStorage.getItem("SESSION_ORG_CODE"));
// this.orgCode = this.sessionStorage.getItem("SESSION_ORG_CODE");





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
    documentDate: [today,Validators.required],
    manualRef: [''],
    currency: ['', Validators.required], // Default currency is KES
    paymentMode: ['', Validators.required],
    chequeType: [{ value: '', disabled: true }],
    bankAccount: ['',Validators.required],
    receiptingPoint:['',Validators.required],
 charges: ['no', Validators.required],
      chargeAmount: [ ''],
      selectedChargeType:['', Validators.required],
      description: ['', Validators.required],
    deductions: [''], 
    exchangeRate:['',[Validators.required, Validators.min(0)]],
    exchangeRates:[''],
   manualExchangeRate: ['', [Validators.required, Validators.min(0.01)]],
    capitalInjection: [''], 
    allocationType: [''],
    accountType: ['', Validators.required],
      searchCriteria: [{ value: '', disabled: true }, Validators.required],
      searchQuery: [{ value: '', disabled: true }, Validators.required],
      allocatedAmount: this.fb.array([]) // FormArray for allocated amounts
   
  });
}

fetchUserDetails(){
  this.staffService.getStaffById(this.loggedInUser.code).subscribe({
    next:(data)=>{
this.users=data;
this.GlobalUser=this.users;
this.organizationId = this.GlobalUser.organizationId;

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
     // Set the default organization if it exists
     
     const defaultOrg = this.organization.find(org => org.id === 2);
     if (defaultOrg) {
    
       this.selectedOrganization = defaultOrg.name; // Set default organization
       this.defaultOrgId =  defaultOrg.id;
       this.defaultCountryId=defaultOrg.country.id;
      this.fetchBranches(this.defaultOrgId);
      this.fetchPayments(this.defaultOrgId);
       //this.fetchPaymentModes(this.defaultOrgId);
       this.fetchDrawersBanks(this.defaultCountryId);
       //this.orgId=this.selectedOrganization.name;
       // Patch the form control with the default organization ID
       this.receiptingDetailsForm.patchValue({ organization: this.defaultOrgId });
       //this.receiptingDetailsForm.patchValue({organization:this.selectedOrganization});
      
     } else {
       this.selectedOrganization = null; // Allow user to select from the list
     }

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
      //this.fetchPaymentModes(selectedOrgId);
      this.fetchPayments(this.defaultOrgId);
      // Now you can fetch drawer banks using the country ID
      if (this.selectedCountryId) {
        this.fetchDrawersBanks(this.selectedCountryId);
      }
    }
     // Patch the form control with the default organization ID
     //this.receiptingDetailsForm.patchValue({ organization: this.defaultOrgId });
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
// fetchBranches(organizationId: number) {
//   this.receiptService.getBranches(organizationId).pipe(
//       switchMap((branches) => {
//           this.branches = branches;
//           const defaultBranch = branches.find(branch => branch.id === 1);
//           if (defaultBranch) {
//               this.defaultBranchId = defaultBranch.id;
//               this.receiptingDetailsForm.patchValue({ selectedBranch: this.defaultBranchId });
//           }
//           return this.receiptService.getReceiptingPoints(this.defaultBranchId, this.GlobalUser.id);
//       })
//   ).subscribe({
//       next: (receiptingPoints) => {
//           this.receiptingPoints = receiptingPoints.data;
//       },
//       error: (err) => {
//           this.globalMessagingService.displayErrorMessage('Error', err.error.error);
//       }'
//   });
// }


fetchBranches(organizationId: number){
  this.receiptService.getBranches(organizationId
  ).subscribe({
    next:(data)=>{
      this.branches = data;
      const defaultBranch= this.branches.find(branch=>branch.id===1);
      if(defaultBranch){
        this.defaultBranchName=defaultBranch.name;
        this.defaultBranchId=defaultBranch.id;
        
        this.receiptingDetailsForm.patchValue({ selectedBranch:  this.defaultBranchId });
        this.fetchAccountTypes(this.GlobalUser.organizationId, this.defaultBranchId,this.GlobalUser.id);
       
      }else{
        this.defaultBranchName= null;
      }
      this.fetchCurrencies();
    },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Error',err.error.error);
    }
  })
}

onBranchChange(event:any){
const selectedBranch=event.target.value;
if(selectedBranch){
  this.selectedBranchId=selectedBranch;

}else{
  this.selectedBranchId=null;
}
this.fetchAccountTypes(this.GlobalUser.organizationId, this.selectedBranchId,this.GlobalUser.id);
this.fetchBanks(this.selectedBranchId,this.defaultCurrencyId);
//console.log('selected branch:',this.selectedBranchId);
}
// Update your fetchDrawersBanks method
fetchDrawersBanks(countryId: number) {
  // Use the countryId parameter in your API call
  this.bankService.getBanks(countryId).subscribe({
    next: (data) => {
      this.drawersBanks = data;
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

onBank(event: Event): void {
  //const selectedBankName = (event.target as HTMLSelectElement).value;
  const selectedBankCode = +(event.target as HTMLSelectElement).value; // Use '+' to convert string to number
  this.selectedBankCode = selectedBankCode; // Store the selected bank code
   // Find the selected bank object based on the code
   const selectedBank = this.bankAccounts.find(bank => bank.code === selectedBankCode);

   if (selectedBank) {
     this.globalBankAccountVariable = selectedBank; // Assign the selected bank to the global variable
     //console.log('Selected Bank Object:', this.globalBankAccountVariable);
   } else {
     //console.error('Selected bank not found in the bankAccounts list.');
   }
   //set the boolean to true if the bank is selected
   this.onBankSelected=true;
  this.receiptService.getReceiptingPoints(this.defaultBranchId || this.selectedBranchId,this.GlobalUser.id).subscribe({
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
 this.fetchReceiptNumber(this.defaultBranchId || this.selectedBranchId, this.GlobalUser.id);
 

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




fetchReceiptingPoints(){
  this.receiptService.getReceiptingPoints(this.defaultBranchId || this.selectedBranchId,this.GlobalUser.id).subscribe({
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
        this.defaultCurrencyName= defaultCurrency.symbol;
        //console.log('Default Currency symbol', this.defaultCurrencyName);

        // Set the default currency in the form
        this.receiptingDetailsForm.patchValue({
          currency: defaultCurrency.id
        });
      }
      this.fetchBanks(this.defaultBranchId,this.defaultCurrencyId);
      console.log('selected branch>',this.selectedBranchId);
      console.log('default branch>',this.defaultBranchId);
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

 // console.log('selected currency',this.selectedCurrencyCode);
  this.fetchCurrencyRate();


}
fetchCurrencyRate(){
  if (!this.defaultBranchId && !this.selectedBranchId) {
    console.error('Branch ID is not set');
    return;
}

   // Get current date for comparison
   const currentDate = new Date();
   currentDate.setHours(0, 0, 0, 0); // Reset time part for date comparison
  this.currencyService.getCurrenciesRate(this.defaultCurrencyId)
  .subscribe({
    next: (rates) => {
    
        // Filter rates matching the selected currency
      const matchingRates = rates.filter(rate => {
        // console.log('Comparing:', {
        //   rateTargetCurrencyId: rate.targetCurrencyId,
        //   selectedId: this.selectedCurrencyCode,
        //   isMatch: rate.targetCurrencyId === this.selectedCurrencyCode
        // });
        return rate.targetCurrencyId === this.selectedCurrencyCode;
      });

      //console.log('Matching Rates:', matchingRates);
        if (matchingRates.length === 0) {
          // No rates found - show manual entry modal
          
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
              // console.log('Checking date:', {
              //   effectiveDate,
              //   currentDate,
              //   isValid: effectiveDate >= currentDate
              // });
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
              this.fetchBanks(this.selectedBranchId,this.selectedCurrencyCode);
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


fetchBanks(branchCode:number,currCode:number){
  this.receiptService.getBanks(branchCode,currCode)
      .subscribe({
        next: (response) => {
        this.bankAccounts = response.data;
      // console.log('this.bankAccounts',this.bankAccounts);
       this.filteredBankAccounts = this.bankAccounts; // Initialize filtered list
        
       },
        error: (err) => {
        
           this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
}
 // Add this method to filter banks
 filterBanks(event: any) {
  const searchTerm = event.target.value.toLowerCase();
  this.bankSearchTerm = searchTerm;
  
  if (!searchTerm) {
    this.filteredBankAccounts = this.bankAccounts;
  } else {
    this.filteredBankAccounts = this.bankAccounts.filter(bank => 
      bank.name.toLowerCase().includes(searchTerm) || 
      bank.code.toString().includes(searchTerm)
    );
  }
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
    
   
    this.globalMessagingService.displayErrorMessage('Error','all fields are required!');
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

fetchAccountTypes(orgCode:number,branchCode:number,userCode:number) {
  this.receiptService.getAccountTypes(orgCode, branchCode,userCode).subscribe({
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

  const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;
  if(!paymentMode){
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
            paymentMethod: paymentMode,
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
        this.selectedFile = null;
        this.base64Output = '';
        this.fileDescriptions = [];
        this.currentFileIndex = 0;
        this.isFileUploadButtonDisabled = false; // Re-enable the "File Upload" button
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
     
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Failed to process the file. The file might be corrupted or in an invalid format.'
      );
    }
  } else {
    this.globalMessagingService.displayErrorMessage('Error', 'No file data available');
  }
}


 deleteFile() {
    if (this.uploadedFile && this.globalDocId) {
     
      
      this.dmsService.deleteDocumentById(this.globalDocId).subscribe({
        next: (response) => {
          
          this.globalMessagingService.displaySuccessMessage('Success', 'File deleted successfully');
          this.uploadedFile = null;
          this.decodedFileUrl = null;
         // console.log('success',response);
        },
        error: (error) => {
        console.error('error',error);
         // this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete file');
        }
      });
    } else {
      //alert('cannot find docId');

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

  if (this.currentFileIndex >= 0 && this.currentFileIndex < this.fileDescriptions.length) {
  if (description) { // Check if description is not empty
    this.fileDescriptions[this.currentFileIndex].description = description; // Update the description for the current file
 
    
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
  
  this.isFileUploadButtonDisabled = false; // Re-enable "File Upload" button
  //console.log('File removed. Updated file descriptions:', this.fileDescriptions);
  
}




// The onClickClient method sets this.selectedClient and fetches transactions based on the selected client's details. This allows the UI to reflect the transactions specific to the selected client.
onClickClient(selectedClient) {
 
  if (this.selectedClient?.code === selectedClient.code) {
    return; // Avoid unnecessary API call
  }
//  this.onReclicked=true;
  this.selectedClient = selectedClient; // Store the selected client
  this.isClientSelected = true; // Set flag when client is selected
 //console.log('new SELECTED CLIENT',this.selectedClient);
  this.fetchTransactions(
    selectedClient.systemShortDesc,
    selectedClient.code,
    selectedClient.accountCode,
    selectedClient.receiptType,
    selectedClient.shortDesc,
    

  );
   // Ensure the allocation table is displayed
   this.allocation = true;
  
  // Recalculate total allocated amount for the new client
  this.calculateTotalAllocatedAmount();
  
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
    
 // Recalculate total allocated amount
 //this.calculateTotalAllocatedAmount();
      
      // Retain cumulative amount
      this.calculateTotalAllocatedAmount();
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
  // const newAllocatedAmount = this.allocatedAmountControls.value.reduce(
  //   (total: number, item: { allocatedAmount: number }) => total + item.allocatedAmount,
  //   0
  // );
  const newTotal = this.allocatedAmountControls.value.reduce(
    (total: number, item: { allocatedAmount: number }) => total + item.allocatedAmount,
    0
  );
  // this.totalAllocatedAmount = this.cumulativeAllocatedAmount + newAllocatedAmount;
  this.totalAllocatedAmount += newTotal;
  localStorage.setItem('totalAllocatedAmount', JSON.stringify(this.totalAllocatedAmount));
}
 // Add method to get remaining amount
 getRemainingAmount(): number {
  const amountIssued = Number(this.receiptingDetailsForm.get('amountIssued')?.value || 0);
  return amountIssued - this.totalAllocatedAmount;
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
  //first check if the bank is selected!if not return false
  if(!this.onBankSelected){
    this.globalMessagingService.displayErrorMessage('Warning','Please Select bank first!');
    return;
  }
  //otherwise continue with other validation
  const allocatedAmounts = this.allocatedAmountControls.value;
  const amountIssued = this.receiptingDetailsForm.get('amountIssued')?.value;
  const amountIssuedControl = this.receiptingDetailsForm.get('amountIssued');

 // console.log('Allocated Amounts:', allocatedAmounts);
  //console.log('Total Allocated Amount:', this.totalAllocatedAmount);

  //Step 1: Check if 'amountIssued' is untouched or invalid
  if (!amountIssuedControl?.touched || !amountIssued) {

    this.globalMessagingService.displayErrorMessage('Error', 'Please enter the amount issued.');
    return false; // Stop further execution
  }


   // Update cumulative allocated amount
   this.cumulativeAllocatedAmount += this.totalAllocatedAmount;
  this.allocateAndPostAllocations();
  return true;
}

allocateAndPostAllocations(): void {
  // Get the deductions value from the form
  const deductionsValue = this.receiptingDetailsForm.get('deductions')?.value;
  const narration=this.receiptingDetailsForm.get('narration')?.value;
  // Create an array to store allocated transactions with their form control values
  const allocatedTransactionsData = this.transactions.map((transaction, index) => {
    const allocatedAmountControl = this.getFormControl(index, 'allocatedAmount');
    const allocatedAmount = allocatedAmountControl?.value || 0;
    
   

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
    branchCode:  this.defaultBranchId || this.selectedBranchId,
    clientCode: this.selectedClient.code,
    clientShortDescription: this.selectedClient.shortDesc,
    receiptType: this.selectedClient.receiptType,
    clientName: this.selectedClient.name,
    sslAccountCode: this.selectedClient.accountCode,
    accountTypeId: this.globalAccountTypeSelected.actTypeShtDesc,
    // referenceNumber: '',
    referenceNumber: null,
    receiptParticularDetails: allocatedTransactionsData.map(({ transaction, allocatedAmount, index }) => ({
      // policyNumber: transaction.clientPolicyNumber,
      policyNumber:String(transaction.transactionNumber),
      referenceNumber: transaction.referenceNumber,
      transactionNumber: transaction.transactionNumber,
      batchNumber: transaction.policyBatchNumber,
      premiumAmount: allocatedAmount,
      loanAmount: 0,
      pensionAmount: 0,
      miscAmount: 0,
      endorsementCode: 0,
      // endorsementDrCrNumber: 'DR123456',
      endorsementDrCrNumber: null,
      includeCommission: this.getFormControl(index, 'commissionChecked')?.value === 'Y' ? 'Y' : 'N',
      commissionAmount: transaction.commission,
      narration:narration || '',
      // overAllocated: null,
      overAllocated: 0,
      includeVat: deductionsValue ? 'Y' : 'N',
      //includeVat: 'N',
      clientPolicyNumber: transaction.clientPolicyNumber,
      //ADDED FIELDS
      policyType:null,
      accountNumber:null,
      side:null,
      directType:null

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
      //console.log('allocation payload:',allocationData);
       // Reset client selection and transactions
      // this.selectedClient = null;
       this.transactions = [];
       while (this.allocatedAmountControls.length > 0) {
         this.allocatedAmountControls.removeAt(0);
       }
       // Clear state after successful allocation
      //this.selectedClient = null;
      this.transactions = [];
      while (this.allocatedAmountControls.length !== 0) {
        this.allocatedAmountControls.removeAt(0);
      }
     // this.totalAllocatedAmount = 0; // Reset total allocated amount
      this.getAllocations();
      this.selectedClient;
     
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
      this.selectedClient;
      
this.getAllocation = response.data.filter(allocation => 
  allocation.receiptParticularDetails.some(detail => detail.premiumAmount > 0));

      // Calculate total allocated amount for previously posted allocations
      this.totalAllocatedAmount = this.getAllocation.reduce((total, allocation) => {
        return total + allocation.receiptParticularDetails.reduce((sum, detail) => sum + detail.premiumAmount, 0);
      }, 0);


this.isAllocationCompleted = true;
this.getAllocationStatus=true;
this.allocationsReturned=this.getAllocation;
this.globalGetAllocation=this.getAllocation;
//console.log('getallocations>>',this.globalGetAllocation);
// this.globalMessagingService.displaySuccessMessage('success', 'detail');

    },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Failed to fetch Allocations',err);
      //alert('false');
    }
  })
}
deleteAllocation(receiptDetailCode: number): void {
  this.receiptService.deleteAllocation(receiptDetailCode).subscribe({
    next: (response) => {
      if (response.success) {
        // Find the allocation detail to delete
        let amountToSubtract = 0;
        this.getAllocation.forEach((allocation) => {
          const detail = allocation.receiptParticularDetails.find(
            (detail) => detail.code === receiptDetailCode
          );
          if (detail) {
            amountToSubtract += detail.premiumAmount; // Get the amount to subtract
          }
        });

        // Remove the deleted allocation from the local array
        this.getAllocation = this.getAllocation.map((allocation) => ({
          ...allocation,
          receiptParticularDetails: allocation.receiptParticularDetails.filter(
            (detail) => detail.code !== receiptDetailCode
          ),
        }));

        // If all allocations for a receipt are deleted, remove that receipt
        this.getAllocation = this.getAllocation.filter(
          (allocation) => allocation.receiptParticularDetails.length > 0
        );

        // Update totalAllocatedAmount
        this.totalAllocatedAmount -= amountToSubtract;
        if (this.totalAllocatedAmount < 0) this.totalAllocatedAmount = 0; // Ensure no negative values
        localStorage.setItem('totalAllocatedAmount', JSON.stringify(this.totalAllocatedAmount));

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
      this.globalMessagingService.displayErrorMessage(
        'Error',
        err.error?.message || 'Failed to delete allocation'
      );
    },
  });
}

// deleteAllocation(receiptDetailCode: number): void {
//   // First, show a confirmation dialog
//   // if (confirm('Are you sure you want to delete this allocation?')) {
//     this.receiptService.deleteAllocation(receiptDetailCode).subscribe({
//       next: (response) => {
//         if (response.success) {
//           // Remove the deleted allocation from the local array
//           this.getAllocation = this.getAllocation.map(allocation => ({
//             ...allocation,
//             receiptParticularDetails: allocation.receiptParticularDetails.filter(
//               detail => detail.code !== receiptDetailCode
//             )
//           }));

//           // If all allocations for a receipt are deleted, remove that receipt
//           this.getAllocation = this.getAllocation.filter(
//             allocation => allocation.receiptParticularDetails.length > 0
//           );

//           // Show success message
//           this.globalMessagingService.displaySuccessMessage(
//             'Success', 
//             'Allocation deleted successfully'
//           );

//           // Refresh the allocations list
//           this.getAllocations();
//         } else {
//           this.globalMessagingService.displayErrorMessage(
//             'Error', 
//             'Failed to delete allocation'
//           );
//         }
//       },
//       error: (err) => {
//       //  console.error('Error deleting allocation:', err);
//         this.globalMessagingService.displayErrorMessage(
//           'Error',
//           err.error?.message || 'Failed to delete allocation'
//         );
//       }
//     });
  
// }



validateRequiredFields():any{
  const requiredFields = [
    
    'amountIssued',
    'bankAccount',
    'paymentMode',
    'narration',
    
    'receivedFrom'
  ];
   let isValid =true;
   const formData = this.receiptingDetailsForm;
     // Check all required fields first
  for (const field of requiredFields) {
    const control = formData.get(field);
    if (!control || !control.value) {
      isValid = false;
      break;
    }
  }


 // Special validation for payment reference when payment mode is not cash
 const paymentMode = formData.get('paymentMode')?.value;
 const paymentRef = formData.get('paymentRef')?.value;
 const drawersBank = formData.get('drawersBank')?.value;

 if (paymentMode && paymentMode.toLowerCase() !== 'cash' && !paymentRef ) {
   isValid = false;
   this.globalMessagingService.displayErrorMessage(
     'Error',
     'Payment Reference is required for non-cash payment modes'
   );
   return false;
 }
 if (paymentMode && paymentMode.toLowerCase() !== 'cash' && !drawersBank ) {
  isValid = false;
  this.globalMessagingService.displayErrorMessage(
    'Error',
    'Drawers Bank is required for non-cash payment modes'

  );
  return false;
}
if (!isValid) {
  this.globalMessagingService.displayErrorMessage(
    'Error',
    'Please fill in all required fields marked with *'
  );
}
return isValid;
}

// fetchReceiptValidationStatus(){
//   this.receiptService.validateReceipt(this.globalReceiptNumber,this.GlobalUser.id).subscribe({
//     next:(response)=>{
// //console.log(response.msg);
//     },
//     error:(error)=>{
//       this.globalMessagingService.displayErrorMessage('Failed:',error.err);
//     }
//   })
// }
fetchParamStatus(){
  this.fmsSetupService.getParamStatus('TRANSACTION_SUPPORT_DOCUMENTS').subscribe({
    next:(response)=>{
      
      this.parameterStatus=response.data;
      
      
    },
    error:(err)=>{
      this.globalMessagingService.displayErrorMessage('Error:Failed to fetch Param Status',err.err.error);
    }
  })
}
submitReceipt(): any {
 // console.log('my SELECTED CLIENT',this.selectedClient);
  if (!this.validateRequiredFields()) {
    return;
  }
  const amountIssued=this.receiptingDetailsForm.get('amountIssued')?.value;
  const amountIssuedControl=this.receiptingDetailsForm.get('amountIssued');
 // console.log('amount issued',amountIssued);
 // console.log('total allocated amount',this.totalAllocatedAmount);
  //Step 1: Check if 'amountIssued' is untouched or invalid
  if (!amountIssuedControl?.touched || !amountIssued) {

    this.globalMessagingService.displayErrorMessage('Error', 'Please enter the amount issued.');
    return false; // Stop further execution
  }


 // Step 2: Validate the total allocated amount against the issued amount
  if (this.totalAllocatedAmount < amountIssued) {
    this.globalMessagingService.displayErrorMessage('Error', 'Amount issued is not fully allocated.');
    // this.globalMessagingService.displayInfoMessage('Total Allocated Amount is:',String(this.totalAllocatedAmount));
   
    return false; // Stop further execution
  }
  if(this.totalAllocatedAmount > amountIssued){
    this.globalMessagingService.displayErrorMessage('Error','Total Allocated Amount Exceeds Amount Issued');
  //  this.globalMessagingService.displayInfoMessage('Total Allocated Amount is:',String(this.totalAllocatedAmount));
   return false;
   
  }
 this.fetchParamStatus();
 console.log('receiptDoc>>',this.parameterStatus);
  if(this.parameterStatus=='N')
    {
     // alert('jey');
     if(confirm('do you want to save receipt without uploading file?')==true){
      
return true;
     }else{
      return false;
     }

   
     }
  // Get form values
  const formValues = this.receiptingDetailsForm.value;
const getCapitalInjectionStatus=formValues.capitalInjection;
if(getCapitalInjectionStatus){
this.capitalInjection='Y'
}else{
  this.NoCapitalInjection='N'
}
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
    currencyCode: String(this.defaultCurrencyId), // Add quotes to ensure it's treated as string before conversion
   
   branchCode: String( this.defaultBranchId) || String(this.selectedBranchId),  // Add quotes to ensure it's treated as string before conversion
    paymentMode: formValues.paymentMode,
    paymentMemo: formValues.paymentRef || null,
    docDate: formValues.documentDate ? new Date(formValues.documentDate).toISOString().split('T')[0]:'' ,
    //drawerBank: formValues.drawersBank || 'N/A',
    drawerBank: formValues.drawersBank || "N/A",
    userCode: this.GlobalUser.id,
    narration: formValues.narration,
    insurerAccount: null,
    receivedFrom: formValues.receivedFrom || null,
    //grossOrNet: "G",
    grossOrNet: null,
    sysShtDesc: this.selectedClient?.systemShortDesc,
    receiptingPointId: this.receiptingPointId,
    receiptingPointAutoManual: this.receiptingPointAutoManual,
  
    // capitalInjection:  "N",
    capitalInjection: this.capitalInjection || this.NoCapitalInjection ,
    chequeNo: null,
    ipfFinancier: null,
    receiptSms: "Y",
    receiptChequeType: formValues.chequeType || null,
    vatInclusive: null,
    rctbbrCode: String( this.defaultBranchId) || String(this.selectedBranchId) ,
    directType: null,
    pmBnkCode: null,
    dmsKey: null,
    currencyRate: formValues.exchangeRate || formValues.manualExchangeRate || null,
    internalRemarks: null,
   // manualRef:formValues.manualRef || null,
   manualRef: formValues.manualRef || null,
   bankAccountCode: String(this.globalBankAccountVariable.code), // Add quotes to ensure it's treated as string before conversion
    grossOrNetAdminCharge: "G",
    insurerAcc: null,
    grossOrNetWhtax: null,
    grossOrNetVat: null,
    
    sysCode: String(this.selectedClient.systemCode),
    bankAccountType: this.globalBankAccountVariable.type
  
}
//console.log('receipt Data>',receiptData);
  

  // Call the service to save the receipt
  this.receiptService.saveReceipt(receiptData).subscribe({
    next: (response) => {
      this.receiptResponse=response.data;
      this.globalMessagingService.displaySuccessMessage('Success', 'Receipt saved successfully');
        // Enable the print button after successful receipt submission
        
      //this.uploadReport();
   this.isReceiptSaved=true;
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
    this.clients = []; // Clear the searched clients array
    this.searchClients = []; // Clear search results
     this.searchQuery = ''; // Clear search query
    this.selectedClient = null;
    this.isClientSelected = false;
    //this.allocation = false;
    //this.getAllocationStatus = false;
    //activatedAllocationComplete flag
    this.isAllocationCompleted = false;

// Clear client-related states
this.selectedClient = null;
this.isClientSelected = false;
this.clients = []; // Clear the searched clients array
this.searchClients = []; // Clear search results
this.searchQuery = ''; // Clear search query

     
   // Reset account type related states
   this.isAccountTypeSelected = false;
   this.globalAccountTypeSelected = null;

   // Explicitly disable search fields
   this.receiptingDetailsForm.get('searchCriteria')?.disable();
   this.receiptingDetailsForm.get('searchQuery')?.disable();
 

  // Reset other form-related states
  this.fileDescriptions = [];
  this.selectedFile = null;
  this.uploadedFile = null;
  this.base64Output = '';
  this.isNarrationFromLov = false;
  this.chargesEnabled = false;

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



fetchPayments(orgCode:number){
  this.fmsService.getPaymentMethods(orgCode).subscribe({
    next:(response)=>{
      this.paymentModes = response.data;
      
    
    },
    error:(error)=>{
      this.globalMessagingService.displayErrorMessage('error','error fetching payments modes');
      
    }
  })
}

confirmFormValidity():any{
 
  this.fetchParamStatus();
  
  if(this.parameterStatus=='N')
    {
     // alert('jey');
     if(confirm('do you want to save receipt without uploading file?')==true){
      
      //this.fetchReceiptDetails();
return true;
     }else{
      return false;
     }

   
     }

}
formatReturnedDate(date: string | Date): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}

formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}




download(fileUrl: string, fileName: string): void {

  if (fileUrl) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  }
}
GetReceipt(){
 
  
  const reportPayload: ReportsDto = {
    encode_format: "RAW",
    params: [
      {
        name: "UP_RCT_NO",
        value:String(this.receiptResponse.receiptNumber)
        // value:'77820'
      },
      {
        name: "UP_ORG_CODE",
         value: String(this.organizationId) // or use specific org code
        // value:'2'
      }
    ],
    report_format: "PDF",
    rpt_code: 300,
    system: "CRM"
  };
  this.reportService.generateCRMReport(reportPayload)
  .subscribe({
    next: (response) => {
      
      const downloadOption='PDF';
      let blobType;
      switch (downloadOption) {
        // case 'RTF':
        //   blobType = 'application/rtf';
        //   break;
        case 'PDF':
          blobType = 'application/pdf';
          break;
        // case 'XLS':
        //   blobType = 'application/vnd.ms-excel';
        //   break;
        // case 'HTML':
        // //default:
        //   blobType = 'text/html';
        //   break;
      }

      const blob = new Blob([response], {type: blobType});
      this.filePath = window.URL.createObjectURL(blob);


      // this.fileName = report?.description;
      this.download(this.filePath,'test.pdf');
      //console.log('Report Response>>',response);
      // Disable the print button after successful download

      
         // Reset states
         this.isReceiptSaved = false; // Disable the Print Receipt button
         this.isReceiptDownloading = false;
    },
    error: (err) => {
      this.globalMessagingService.displayErrorMessage('Error', err.error.status);
      
      this.isReceiptDownloading = false; // Re-enable the button in case of error
    }
  })
}

 }