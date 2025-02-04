import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {OrganizationDTO} from '../../../crm/data/organization-dto';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { CurrencyDTO } from 'src/app/shared/data/common/currency-dto';
import { BanksDTO, BranchDTO, ChargeManagementDTO, ChargesDTO, ExistingChargesResponseDTO, NarrationDTO, ReceiptingPointsDTO, ReceiptNumberDTO } from '../../data/receipting-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { OrganizationService } from 'src/app/features/crm/services/organization.service';
import { ReceiptService } from '../../services/receipt.service';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PaymentModesDTO } from '../../data/auth-requisition-dto';
import { FmsService } from '../../services/fms.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap'; 
@Component({
  selector: 'app-receipt-details',
  templateUrl: './receipt-capture.component.html',
  styleUrls: ['./receipt-capture.component.css']
})
export class ReceiptCaptureComponent implements OnInit {
    @Output() formValuesChange = new EventEmitter<any>();
    receiptingDetailsForm: FormGroup;
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
    selectedBranchId:any;
  defaultBranchId:any;
  defaultBranchName:string;
  selectedOrgId:number;
  receiptigPointId:number;
  //control flags
  backdatingEnabled = true; // Adjust this based on your logic
  isNarrationFromLov = false; 
  isSaveBtnActive=true;
  isSubmitButtonVisible: boolean = false;
  exchangeRateText:boolean=false;
  exchangeFound:boolean=false;
    // 1.3 Receipt capture Details
  
  drawersBanks:BankDTO[]=[];
  
  //currency details
  currencies:CurrencyDTO[]=[];
  defaultCurrencyId: number | null = null;
  exchangeRate: number =0; // Default exchange rate
 
  //payment mode details
  paymentModes:PaymentModesDTO[]=[];
  showChequeOptions: boolean = false;
  selectedPaymentMode: string = '';

isChequeOptionSelected: boolean = false;

  currencySymbolGlobal:string | undefined;
  selectedCurrencySymbol: string | undefined; // To store the currency symbol for checks
  selectedCurrencyCode: number=0;
  currencyGlobal: number | null = null;
  exchangeRates: string | undefined; // Fetched exchange rate
  manualExchangeRate:any;
  defaultCurrencyName:any;
      //document and receipt date details
    minDate: string; // To enable backdating if necessary
    maxDate: string; // To disable future dates

//receipting point details
receiptingPoints: ReceiptingPointsDTO[]=[];
receiptingPointId:number;
receiptingPointAutoManual:string;
receiptingPointName:string;
currentReceiptingPoint: any;
//fetchReceiptNumber
globalReceiptNumber: number;
  globalReceiptNo: string;
  setReceiptNumber:any;

originalNarration: string | null = null; 
  //Bank Details
  onBankSelected:boolean=false;
bankAccounts:BanksDTO[]=[];
globalBankAccountVariable:any;
selectedBankCode:number;
filteredBankAccounts: BanksDTO[] = [];
bankSearchTerm: string = '';
globalBankCode:number;
globalBankType:string;
//narration details
narrations:NarrationDTO[]=[];
filteredNarrations: NarrationDTO[] = [];
//receipt charges
charges:ChargesDTO[]=[];
chargeList:ExistingChargesResponseDTO[];
chargesEnabled: boolean = false;
chargeAmount: number = 0;
receiptChargeId!: number; // Component-level variable to store the selected charge ID

editReceiptExpenseId: number | null = null; // To hold the receiptExpenseId of the edited charge
  constructor(
    private fb: FormBuilder,
    private staffService:StaffService,
    private globalMessagingService:GlobalMessagingService,
    private receiptService:ReceiptService,
    private organizationService:OrganizationService,
    private bankService:BankService,
    private  currencyService:CurrencyService,
   private authService:AuthService,
   private fmsService:FmsService,
   private receiptDataService: ReceiptDataService,
   private router: Router
  
  
  ) {
  
  
  }
  
    ngOnInit(): void {
        this.captureReceiptForm();
          this.loggedInUser = this.authService.getCurrentUser();
          // localStorage.setItem('user',this.loggedInUser);
          // localStorage.setItem('exchangeRate',String(this.exchangeRate));
        
       
          this.fetchUserDetails();
          this.fetchOrganization();
          this.fetchNarrations();
           // Set the minDate and maxDate for date validation
 const currentDate = new Date();
 this.minDate = ''; // Set this based on your business logic (e.g., earliest backdate allowed)
 this.maxDate = this.formatDate(currentDate);
 //localStorage.setItem('receiptingPoint',this.currentReceiptingPoint);
  
    }
    captureReceiptForm(){
        const today = this.formatDate(new Date()); // Get current date in 'yyyy-MM-dd' format
        this.receiptingDetailsForm = this.fb.group({
          selectedBranch:['',Validators.required],
          organization: ['', Validators.required], // Set default value here as well
          amountIssued: ['', Validators.required],
          receiptingPoint:['',Validators.required],
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
       exchangeRate:['',[Validators.required, Validators.min(0)]],
            exchangeRates:[''],
           manualExchangeRate: ['', [Validators.required, Validators.min(0.01)]],
           
           charges: ['no', Validators.required],
           chargeAmount: [ ''],
           selectedChargeType:['', Validators.required],
         
        });
      }
      fetchUserDetails(){
        this.staffService.getStaffById(this.loggedInUser.code).subscribe({
          next:(data)=>{
      this.users=data;
      this.GlobalUser=this.users;
      this.organizationId = this.GlobalUser.organizationId;
      localStorage.setItem('OrgId',this.organizationId.toString());
      localStorage.setItem('UserId',this.GlobalUser.id.toString());
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
          this.selectedOrgId=selectedOrgId;
          localStorage.setItem('selectedOrgId',this.selectedOrgId.toString());
          console.log('selected org id>>',this.selectedOrgId);
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
            this.fetchPayments(this.defaultOrgId);
            //this.fetchPaymentModes(selectedOrgId);
          
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
            localStorage.setItem('defaultBranchId',this.defaultBranchId.toString());
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
        localStorage.setItem('selectedBranch',this.selectedBranchId.toString());
      
      }else{
        this.selectedBranchId=null;
      }
      // this.fetchAccountTypes(this.GlobalUser.organizationId, this.selectedBranchId,this.GlobalUser.id);
this.fetchBanks(this.selectedBranchId,this.defaultCurrencyId);
    
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
      
      fetchCurrencies() {
        this.currencyService.getCurrencies().subscribe({
          next: (currencies: CurrencyDTO[]) => {
            this.currencies = currencies;
            //console.log('Currencies:', currencies);
      
            // Find the default currency - using string literal 'Y' directly
            const defaultCurrency = currencies.find(curr => curr.currencyDefault === 'Y');
            
            if (defaultCurrency) {
              this.defaultCurrencyId = defaultCurrency.id;
              localStorage.setItem('defaultCurrencyId',String(this.defaultCurrencyId));
              this.defaultCurrencyName= defaultCurrency.symbol;
              //console.log('Default Currency symbol', this.defaultCurrencyName);
      
              // Set the default currency in the form
              this.receiptingDetailsForm.patchValue({
                currency: defaultCurrency.id

              });
            }
          
            this.fetchBanks(this.defaultBranchId,this.defaultCurrencyId);
      
          },
          error: (err) => {
            //console.error('Error fetching currencies:', err);
            this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch currencies');
          }
        });
      }
    
      onCurrencyChanged(event: Event): void {
        this.exchangeRateText=true;
        const selectedCurrencyCodes = (event.target as HTMLSelectElement).value;
        this.selectedCurrencyCode=Number(selectedCurrencyCodes);
       
    // Find the currency from the list
    const selectedCurrency = this.currencies.find(
      (currency) => currency.id === this.selectedCurrencyCode
    );
    
    // Get the symbol of the selected currency
    this.selectedCurrencySymbol = selectedCurrency ? selectedCurrency.symbol : '';
    
       // console.log('selected currency',this.selectedCurrencyCode);
        this.fetchCurrencyRate();
    
    
      }

      // fetchCurrencyRate(){
      //   if (!this.defaultBranchId && !this.selectedBranchId) {
      //     console.error('Branch ID is not set');
      //     return;
      // }
      
      //    // Get current date for comparison
      //    const currentDate = new Date();
      //    currentDate.setHours(0, 0, 0, 0); // Reset time part for date comparison
      //   this.currencyService.getCurrenciesRate(this.defaultCurrencyId)
      //   .subscribe({
      //     next: (rates) => {
      //     //console.log('rates>>',rates);
      //         // Filter rates matching the selected currency
      //       const matchingRates = rates.filter(rate => {
            
      //         return rate.targetCurrencyId === this.selectedCurrencyCode;
      //       });
      
       
      //         if (matchingRates.length === 0) {
      //           // No rates found - show manual entry modal
                
      //           this.receiptingDetailsForm.patchValue({
      //             exchangeRate: 0
      //           });
      //           //this.showExchangeRateModal2();
      //         } else if (matchingRates.length === 1) {
      //           // Single rate found - use it directly
      //           const rate = matchingRates[0];
              
      //           this.receiptingDetailsForm.patchValue({
      //             exchangeRate: rate.rate
      //           });
      //           //this.showExchangeRateModal(); // Show modal with exchange rate
      //         } else {
      //           // Multiple rates found - need to check dates
             
                
      //           // Sort rates by effectiveDate in descending order (newest first)
      //           const validRates = matchingRates
      //             .filter(rate => {
      //               const effectiveDate = new Date(rate.withEffectToDate);
                   
      //               return effectiveDate >= currentDate;
      //             })
      //             .sort((a, b) => 
      //               new Date(b.withEffectToDate).getTime() - new Date(a.withEffectToDate).getTime()
      //             );
              
      //             if (validRates.length > 0) {
      //               // Use the most recent valid rate
      //               const currentRate = validRates[0];
                    
      //               this.receiptingDetailsForm.patchValue({
      //                 exchangeRate: currentRate.rate
      //               });
      //               //this.showExchangeRateModal2(); // Show modal with exchange rate
      //             } else {
      //               // No valid rates found - show manual entry modal
      //               this.receiptingDetailsForm.patchValue({
      //                 exchangeRate: 0
      //               });
      //               //this.showExchangeRateModal2();
                  
      //             }
      //           }
      //     },
      //     error: (err) => {
       
      //       this.globalMessagingService.displayErrorMessage('Error', err.error.error);
      //       this.showExchangeRateModal2();
      //     }
      //   });
      // }
      fetchCurrencyRate() {
        if (!this.defaultBranchId && !this.selectedBranchId) {
            console.error('Branch ID is not set');
            return;
        }
    
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
    
        this.currencyService.getCurrenciesRate(this.defaultCurrencyId)
            .subscribe({
                next: (rates) => {
                    const matchingRates = rates.filter(rate => rate.targetCurrencyId === this.selectedCurrencyCode);
    
                    if (matchingRates.length === 0) {
                        this.exchangeRate = 0;  // Set exchange rate to zero
                        this.exchangeFound = false;  // Hide span text
                        this.receiptingDetailsForm.patchValue({ exchangeRate: 0 });
                    } else if (matchingRates.length === 1) {
                        this.exchangeRate = matchingRates[0].rate;  // Assign exchange rate
                        this.exchangeFound = true;  // Show span text
                        localStorage.setItem('exchangeRate',String(this.exchangeRate));
                        this.receiptingDetailsForm.patchValue({ exchangeRate: this.exchangeRate });
                    } else {
                        const validRates = matchingRates
                            .filter(rate => new Date(rate.withEffectToDate) >= currentDate)
                            .sort((a, b) => new Date(b.withEffectToDate).getTime() - new Date(a.withEffectToDate).getTime());
    
                        if (validRates.length > 0) {
                            this.exchangeRate = validRates[0].rate;  // Assign most recent exchange rate
                            localStorage.setItem('exchangeRate',String(this.exchangeRate));
                            this.exchangeFound = true;  // Show span text
                            this.receiptingDetailsForm.patchValue({ exchangeRate: this.exchangeRate });
                        } else {
                            this.exchangeRate = 0;
                            this.exchangeFound = false;
                            this.receiptingDetailsForm.patchValue({ exchangeRate: 0 });
                        }
                    }
                },
                error: (err) => {
                    this.globalMessagingService.displayErrorMessage('Error', err.error.error);
                    this.showExchangeRateModal2();
                }
            });
    }
    
      confirmExchangeRateValue(): void {
       
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
        this.closeModal2();
    }
    
    closeModal2(): void {
      
      const modal = document.getElementById('exchangeRateModal2');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    }
    closeModal(): void {
    
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
      // modal.show()
      //exchangeRateModal2
      const modal = document.getElementById('exchangeRateModal2');
        if (modal) {
          modal.classList.add('show');
          modal.style.display = 'block';
        }
    }
     private formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
     // Update your fetchDrawersBanks method
     fetchDrawersBanks(countryId: number) {
      // Use the countryId parameter in your API call
      this.bankService.getBanks(countryId).subscribe({
        next: (data) => {
          this.drawersBanks = data;
        },
        error: (error) => {
         
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch drawer banks');
        }
      });
    }
    


    onHoverPaymentMode(event: any): void {
      if (event.target.value === 'CHEQUE') {
        this.showChequeOptions = true;
      }
    }
    
    onLeavePaymentMode(): void {
      if (!this.isChequeOptionSelected) {
        this.showChequeOptions = false;
      }
    }

    onLeaveChequeOptions(): void {
      if (!this.isChequeOptionSelected) {
        this.showChequeOptions = false;
      }
    }
    
    setChequeType(type: string): void {
      this.receiptingDetailsForm.patchValue({ paymentMode: type });
      this.isChequeOptionSelected = true;
      this.showChequeOptions = false; // Hide after selection
    }



    onPaymentModeSelected(event:any): void {
      const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;
     this.selectedPaymentMode = paymentMode;
      this.updatePaymentModeFields(paymentMode);
      // console.log('selected>>',this.selectedPaymentMode);
    }
    
updatePaymentModeFields(paymentMode: string): void {
  


  if (paymentMode === 'CASH') {
   // this.disablePaymentRef=true;
 
     this.receiptingDetailsForm.patchValue({ drawersBank: 'N/A' });
    
     this.receiptingDetailsForm.get('drawersBank')?.disable();
     this.receiptingDetailsForm.get('paymentRef')?.disable();
    
  } else if (paymentMode === 'CHEQUE') {
    
    // const chequeTypeModalElement = document.getElementById('chequeTypeModal');
    // if (chequeTypeModalElement) {
    //   chequeTypeModalElement.classList.add('show');
    //   chequeTypeModalElement.style.display='block';
    // }
    // // chequeTypeModal?.show(); // Always show the modal when "CHEQUE" is selected
    this.receiptingDetailsForm.get('drawersBank')?.enable();
    this.receiptingDetailsForm.get('paymentRef')?.enable();
  } else {
  //  this.resetChequeFields(chequeTypeModal);
   this.receiptingDetailsForm.get('drawersBank')?.enable();
   this.receiptingDetailsForm.get('paymentRef')?.enable();
  }

 
}
    fetchBanks(branchCode:number,currCode:number){
      this.receiptService.getBanks(branchCode,currCode)
          .subscribe({
            next: (response) => {
            this.bankAccounts = response.data;
         
           this.filteredBankAccounts = this.bankAccounts; // Initialize filtered list
            
           },
            error: (err) => {
            
               this.globalMessagingService.displayErrorMessage('Error', err.error.error);
            }
          });
    }
    onBank(event: Event): void {
    
      const selectedBankCode = +(event.target as HTMLSelectElement).value; // Use '+' to convert string to number
      this.selectedBankCode = selectedBankCode; // Store the selected bank code
       // Find the selected bank object based on the code
       const selectedBank = this.bankAccounts.find(bank => bank.code === selectedBankCode);
    
       if (selectedBank) {
         this.globalBankAccountVariable = selectedBank; // Assign the selected bank to the global variable
         this.globalBankCode = this.globalBankAccountVariable.code;
         this.globalBankType = this.globalBankAccountVariable.type;
         localStorage.setItem('globalBankAccount',String(this.globalBankCode));
         localStorage.setItem('globalBankType',this.globalBankType)
         //console.log('Selected Bank Object:', this.globalBankAccountVariable);
       } else {
      
       }
       //set the boolean to true if the bank is selected
       this.onBankSelected=true;
      this.receiptService.getReceiptingPoints(this.defaultBranchId || this.selectedBranchId,this.GlobalUser.id).subscribe({
        next: (response: { data: ReceiptingPointsDTO[] }) => {
          if (response.data.length > 0) {
            const receiptingPoint = response.data[0]; // Use the first receipting point
            this.receiptingDetailsForm.get('receiptingPoint')?.setValue(receiptingPoint.name);
            this.receiptingPointId=receiptingPoint.id;
         
          
            //this.receiptingPointName=this.receiptingPointId[0].name;
     
            this.receiptingPointAutoManual=receiptingPoint.autoManual;
           localStorage.setItem('receiptinPointManual',this.receiptingPointAutoManual);
           localStorage.setItem('receiptigPointId',String(this.receiptingPointId));
            // Optionally store the receiptingPoint for further use
           // this.currentReceiptingPoint = receiptingPoint;
         
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
           

           localStorage.setItem('receiptNumber', this.globalReceiptNumber.toString());

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
    // Handle changes in charge radio button
  // onChargesChange(option: string): void {
  //   if (option === 'yes') {
  //     this.chargesEnabled = true;
  //     this.fetchCharges();
  //     this.fetchExistingCharges(this.globalReceiptNumber);
  //     const chargeType = this.receiptingDetailsForm.get('selectedChargeType')?.value;
  //     const chargeAmount = this.receiptingDetailsForm.get('chargeAmount')?.value;
  //     this.chargeAmount=chargeAmount;
  //    // console.log(chargeAmount);
  //     //this.receiptingDetailsForm.get('chargeAmount')?.setValue(null); // Clear charge amount
  //     // const modal = document.getElementById('chargesModal');
  //     // if (modal) {
  //     //   const bootstrapModal = new bootstrap.Modal(modal);
  //     //   bootstrapModal.show();
  //     // }
  //     const modal = document.getElementById('chargesModal');
  //     if (modal) {
  //       modal.classList.add('show');
  //       modal.style.display = 'block';
  //     }
  //   }
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
// Refresh charges list after add or edit 
refreshCharges(): void {
  // Call your service to fetch the updated charges
  this.fetchCharges();
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
  
    // onNext(){
    //   this.formValuesChange.emit(this.receiptingDetailsForm.value);
    // }
    onNext() {
      this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
      this.router.navigate(['/home/fms/client']);  // Navigate to the next screen
    }
}