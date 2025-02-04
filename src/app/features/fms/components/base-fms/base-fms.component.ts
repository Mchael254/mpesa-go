import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchDTO } from '../../data/receipting-dto';
import { OrganizationService } from 'src/app/features/crm/services/organization.service';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-base-fms',
  templateUrl: './base-fms.component.html',
  styleUrls: ['./base-fms.component.css']
})
export class BaseFmsComponent {
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
  //control flags
  backdatingEnabled = true; // Adjust this based on your logic
  isNarrationFromLov = false; 
  isSaveBtnActive=true;
  isSubmitButtonVisible: boolean = false;
  ngOnInit(): void {
    this.captureReceiptForm();
      this.loggedInUser = this.authService.getCurrentUser();
      localStorage.setItem('user',this.loggedInUser);
      
    
   
       this.fetchUserDetails();
      this.fetchOrganization();
      
    

}
constructor(
  private authService:AuthService,
  private fb:FormBuilder,
  private organizationService:OrganizationService,
  private staffService:StaffService,
  private globalMessagingService:GlobalMessagingService,
  private receiptService:ReceiptService



){
  
}
captureReceiptForm(){
  
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
    receiptDate: ['', Validators.required],
    narration: ['', [Validators.required, Validators.maxLength(255)]],
    paymentRef: ['', Validators.required],
    otherRef: [''],
    documentDate: ['',Validators.required],
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
      //this.fetchPayments(this.defaultOrgId);
      
       //this.fetchDrawersBanks(this.defaultCountryId);
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
      //this.fetchPayments(this.defaultOrgId);
      //this.fetchPaymentModes(selectedOrgId);
    
      // Now you can fetch drawer banks using the country ID
      if (this.selectedCountryId) {
       // this.fetchDrawersBanks(this.selectedCountryId);
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
    //this.drawersBanks = []; // Clear banks array
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
      //this.fetchCurrencies();
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
//this.fetchBanks(this.selectedBranchId,this.defaultCurrencyId);

}
/* The `items` property is an array of objects. Each object represents a menu item in a CRM (Customer
Relationship Management) application. Each object has the following properties: */
GLledger: Array<{
  label: string;
  link?: string;
  showSubItems: boolean;
  subItems?: Array<{ label: string; link?: string }>;
}> = [
  {
    label: 'GL-Parameters',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },

    ],
  },
  {
    label: 'GL-Transactions',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
    ],
  },
  {
    label: 'GL-Inquiries',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
      
    ],
  },
  {
    label: 'GL-Final Reports',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
      
    ],
  },
 
];

creditors: Array<{
  label: string;
  link?: string;
  showSubItems: boolean;
  subItems?: Array<{ label: string; link?: string }>;
}> = [
  {
    label: 'Parameters',
    showSubItems: false,
    subItems: [
      
      { label: '', link: '' },
    ],
  },
  {
    label: 'Transactions',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
   
    ],
  },
  {
    label: 'Invoices/Dr Notes',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
    ],
  },
  {
    label: 'Inquires',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
      
    ],
  },
];

cashbook: Array<{
  label: string;
  link?: string;
  showSubItems: boolean;
  subItems?: Array<{ label: string; link?: string }>;
}> = [
  {
    label: 'Parameters',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Transactions' ,
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Requistions',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Cheques' ,
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Petty cash' ,
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Receipts',
    showSubItems: false,
    subItems: [
      { label: 'Receipting Points', link: '/home/fms/' },
      
      { label: 'Narrations', link: '/home/fms/' },
      { label: 'Manage Receipts', link: '/home/fms/' },
      { label: 'Receipting', link: '/home/fms/receipt' },
      { label: 'Receipting Exceptions', link: '/home/fms/' },
      { label: 'Receipt Authorization', link: '/home/fms/authorize' },
      { label: 'Receipt Upload', link: '/home/fms/' },
      { label: 'Premium Suspense', link: '/home/fms/' },
     
      { label: 'Direct Debits', link: '/home/fms/' },
     
    

    ],
  },
  {
    label: 'Reconciliation',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  },
  {
    label: 'Inquires',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
     
     

    ],
  }
];
debtors: Array<{
  label: string;
  link?: string;
  showSubItems: boolean;
  subItems?: Array<{ label: string; link?: string }>;
}> = [
  {
    label: 'Parameters',
    showSubItems: false,
    subItems: [
      
      { label: '', link: '' },
    ],
  },
  {
    label: 'Transactions',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
   
    ],
  },
  {
    label: 'Invoices/cr Notes',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
     
    ],
  },
  {
    label: 'Inquires',
    showSubItems: false,
    subItems: [
      { label: '', link: '' },
      
    ],
  },
];


/**
 * The function toggles the visibility of sub-items for a given item.
 * @param {any} item - The parameter "item" is of type "any", which means it can be any data type.
 */
toggleItem(item: any) {
  item.showSubItems = !item.showSubItems;
}
}
