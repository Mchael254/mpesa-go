import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Product, Products } from '../../../setups/data/gisDTO';
import { ProductsService } from '../../../setups/services/products/products.service';
import { PolicyService } from '../../../policy/services/policy.service';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { ClaimsService } from '../../services/claims.service';
import { Router } from '@angular/router';
import claimSteps from '../../data/claims_steps.json'
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { PerilsService } from '../../../setups/services/perils-territories/perils/perils.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { ClassesSubclassesService } from '../../../setups/services/classes-subclasses/classes-subclasses.service';
import { AuthService } from 'src/app/shared/services/auth.service';

const log = new Logger("claimOpeningComponent");


interface CatastropheEvent {
  value: string;
  label: string;
}

interface PartyToBlame {
  value: string;
  label: string;
}

interface Peril {
  value: string;
  label: string;
  claimEstimate: number; // Add claim estimate property
}

interface reasonsToReview {
  value: string;
  label: string;
}

interface perilPayload {
  action:string,
  code: number,
  perilCode:number,
  perilLevel:string,
  peril:string,
  perilAmount:number,
  perilEstimate:number,
  thirdParty:string,
  vCpvCldCode:string 
  groupCode:number,
  CommunicationMode:string,
  PaymentMode:string,
  vPrpCode: number,
  LiabilityAdmission:string,
  LiabilityAdmDate: Date,
  MainPerilCode: number,
  PerilRate:number,
  ExcessCodes: number,
  PerilRemarks: string
}

interface PriorityLevel {
  value: string;
  label: string;
}
@Component({
  selector: 'app-claim-opening',
  templateUrl: './claim-opening.component.html',
  styleUrls: ['./claim-opening.component.css']
})
export class ClaimOpeningComponent {
  public steps = claimSteps
  selectedPeril:any;
  chosenPeril:any;
  selectedClaimant:any;
  perilEstimate: number;
  perilForm: FormGroup; // Form for adding perils in the modal
  addPerilForm:FormGroup;
  claimsOpeningForm: FormGroup;
  productList:Products[]
  policies: any;
  selectedProduct:Product
  allPolicies:any;
  availablePolicies:any[]=[]
  selectedPolicy:any
  perilDescription:any
  risks: any[]
  causations:any;
  Users:any;
  addPerilpayload:perilPayload;
  catastropheEvents: CatastropheEvent[] = [
    { value: 'event1', label: 'Event 1' },
    { value: 'event2', label: 'Event 2' },
    { value: 'event3', label: 'Event 3' }
  ];
  partyToBlame: PartyToBlame[] = [
    { value: 'insured', label: 'The Insured' },
    { value: 'party2', label: 'Third Party' },
    { value: 'party3', label: 'Pending' },
    { value: 'party3', label: 'Third party not identified ' },
    { value: 'party3', label: 'Third party not involved' }
   
  ];

  perils:any;
  perilsList:any;
  perilArray:any[]=[]
  nextReviewFields:boolean=false
  clientDetails:any;
  claimants:ClientDTO[] = [];
  user:any;
  userDetails:any;
  reasonsToReview:reasonsToReview[]=[
    { label: 'First Claim Review', value: 'fire' },
    { label: 'Second Claim Review', value: 'theft' },
    { label: 'Outstanding Document Follow Up', value: 'accident' },
    { label: 'Assesors Report Follow Up', value: 'accident' },
    { label: 'Adjustment Report Follow Up', value: 'accident' },
    { label: 'Investigators Report Follow Up', value: 'accident' },
    { label: 'Doctors Report Follow Up', value: 'accident' },
    { label: 'Repairs Follow Up', value: 'accident' },
    { label: 'Invoice/Fee Notes Follow Up', value: 'accident' },
    { label: 'Advocates Update Follow Up', value: 'accident' },
    { label: 'Recovery Action', value: 'accident' },
    { label: 'Approval Follow Up', value: 'accident' },
    { label: 'Executed DV Follow Up', value: 'accident' },
    { label: 'Post Declinature Follow Up', value: 'accident' },
    { label: 'General Follow Up', value: 'accident' }
  ]
  claimReporter:any[]=[
    {label:'Client'},
    {label:'Third Party'}
  ]

  showperils: { label: string; value: string }[] = [
    { label: 'Fire', value: 'fire' },
    { label: 'Theft', value: 'theft' },
    { label: 'Accident', value: 'accident' }
  ];

  paymentModes: { label: string; value: string }[] = [
    { label: 'M Pay', value: 'mPay' },
    { label: 'EMT', value: 'emt' },
    { label: 'Cheque', value: 'cheque' },
    { label: 'Pin', value: 'pin' }
  ];
  yesNo:any[]=[
    {label:'Yes',value:'Y'},
    {label:'No',value:'N'}
  ]

  // Popup flags
  showPerilPopup: boolean = false;
  showClaimNotificationPopup: boolean = false;
  showClaimCapturingPopup: boolean = false;
  showAssigneePopup: boolean = false;
  employeeBenefits:boolean = false;
  motorFields:boolean = false;
  
  constructor(
     private fb: FormBuilder,
     private primengConfig: PrimeNGConfig,
     private messageService: MessageService,
     private productService: ProductsService,
     private policyService: PolicyService,
     private globalMessagingService:GlobalMessagingService,
     private claimService: ClaimsService,
     private router: Router,
     private clientService:ClientService,
     private perilService:PerilsService,
     private classService:ClassesSubclassesService,
     private authService:AuthService
    ) {
    this.claimsOpeningForm = this.fb.group({
      product: ['', Validators.required],
      policy: ['', Validators.required],
      lossDate: ['', Validators.required],
      lossTime: ['', Validators.required],
      risk: ['', Validators.required],
      notificationDate: ['', Validators.required],
      causation: ['', Validators.required],
      catastropheEvent: [''],
      claimDescription: ['', Validators.required],
      partyToBlame: ['', Validators.required],
      averageBasicSalary: [''],
      averageEarnings: [''],
      offDutyDateFrom: [''],
      offDutyDateTo: [''],
      liabilityAdmission: [''],
      nextReviewDate: ['', Validators.required],
      nextReviewUser: ['', Validators.required],
      priorityLevel: ['', Validators.required],
      referenceNumber: [''],
      accidentLocation: [''],
      reasonForReview:[''],
      reviewRemarks:[''],
      claimReporter:[''],
      currency:[''],
      clientType:[''],
      insuredAsRegularDriver:[''],
      vehicleInMotion:['']
    });

      // Initialize the form for the peril modal
      this.perilForm = this.fb.group({
        peril: ['', Validators.required],
        claimEstimate: ['', Validators.required]
      });

    
  }

  ngOnInit(): void {
    this.getProduct();
    this.getCausations();
    this.getUsers();
    this.primengConfig.ripple = true;
    this.getClient();   
    this.addPerilForms();
    this.getCurrentUser();
  }
  onSelectReviewUser(){
    this.nextReviewFields = true
  }
  getProduct(){
    this.productService.getAllProducts().subscribe({
      next:(res=>{
        this.productList = res
      
      }),
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Unable to get products.Contact your administrator'
        );
        log.info(`error >>>`, err);
      },
  })
  }
  getPolicies(code){
    this.policyService.getAllPolicy().subscribe({
      next:(res=>{
        this.policies = res
        this.allPolicies = this.policies.content
        console.log(this.allPolicies)
        this.availablePolicies.length = 0;
        this.allPolicies.forEach(element => {
          if(element.product.code === code){
           
            this.availablePolicies.push(element)
            console.log(this.availablePolicies)
          }
         
          
        });
        // const policies = this.allPolicies.findIndex(policy => this.allPolicies.product.code === code);
    
      })
    })
  }
  addPerilForms(){
    this.addPerilForm = this.fb.group({
      selfAsClaimant: [false],
      claimant: [null, Validators.required],
      peril: [null, Validators.required],
      claimEstimate: [null, Validators.required],
      liabilityAdmission: [false],
      telNo: [null],
      email: [null, [Validators.required, Validators.email]],
      sms: [null],
      mPay: [false],
      mPayDetails: [null],
      emt: [false],
      emtDetails: [null],
      cheque: [false],
      chequeDetails: [null]
  
    });

    // // Disable claimant when selfAsClaimant is checked
    // this.addPerilForm.get('selfAsClaimant')?.valueChanges.subscribe(isChecked => {
    //   const claimantControl = this.addPerilForm.get('claimant');
    //   if (claimantControl) {
    //     claimantControl.disable(isChecked);
    //   }
    // });
// Watch for changes in the selfAsClaimant field
this.addPerilForm.get('selfAsClaimant')?.valueChanges.subscribe((isSelfAsClaimantSelected: boolean) => {
  if (isSelfAsClaimantSelected) {
    // If self as claimant is selected, populate claimant, telNo, and email from selectedPolicy
    this.populateClaimantDetailsFromPolicy();
  } else {
    // If self as claimant is deselected, you can clear the fields or let the user fill them manually
    this.clearClaimantDetails();
  }
});


    // Initialize payment details fields as disabled
    this.addPerilForm.get('mPayDetails')?.disable();
    this.addPerilForm.get('emtDetails')?.disable();
    this.addPerilForm.get('chequeDetails')?.disable();
    this.addPerilForm.get('pinDetails')?.disable();

    // Enable/disable payment details fields based on checkbox state
    this.addPerilForm.get('mPay')?.valueChanges.subscribe(isChecked => {
      const mPayDetailsControl = this.addPerilForm.get('mPayDetails');
      if (mPayDetailsControl) {
        isChecked ? mPayDetailsControl.enable() : mPayDetailsControl.disable();
      }
    });

    this.addPerilForm.get('emt')?.valueChanges.subscribe(isChecked => {
      const emtDetailsControl = this.addPerilForm.get('emtDetails');
      if (emtDetailsControl) {
        isChecked ? emtDetailsControl.enable() : emtDetailsControl.disable();
      }
    });

    this.addPerilForm.get('cheque')?.valueChanges.subscribe(isChecked => {
      const chequeDetailsControl = this.addPerilForm.get('chequeDetails');
      if (chequeDetailsControl) {
        isChecked ? chequeDetailsControl.enable() : chequeDetailsControl.disable();
      }
    });

    this.addPerilForm.get('pin')?.valueChanges.subscribe(isChecked => {
      const pinDetailsControl = this.addPerilForm.get('pinDetails');
      if (pinDetailsControl) {
        isChecked ? pinDetailsControl.enable() : pinDetailsControl.disable();
      }
    });
  }

  // Function to populate claimant details from selectedPolicy
populateClaimantDetailsFromPolicy() {
  if (this.clientDetails) {
    const clientName = this.clientDetails.firstName + " " + this.clientDetails.lastName
    console.log(clientName)
    this.addPerilForm.patchValue({
      claimant:clientName, // Assuming selectedPolicy has a claimant property
      telNo: this.clientDetails.mobileNumber, // Assuming selectedPolicy has a telNo property
      email: this.clientDetails.emailAddress // Assuming selectedPolicy has an email property
    });
  }
}

// Function to clear claimant details
clearClaimantDetails() {
  this.addPerilForm.patchValue({
    claimant: null,
    telNo: null,
    email: null
  });
}

  onProductSelected(selectedValue: any) {
    this.selectedProduct = selectedValue
    this.getPolicies(this.selectedProduct.code)
    console.log(selectedValue.productGroupCode)
    if(selectedValue.productGroupCode === 2){
      this.employeeBenefits = true
    }else{
      this.employeeBenefits = false
    }
    if(selectedValue.productGroupCode === 4){
      this.motorFields = true
    }else{
      this.motorFields = false
    }
  }

  checkAvailablePolicies(){
    if(!this.selectedProduct){
      this.globalMessagingService.displayInfoMessage(
        'info',
        'Select a product to continue'
      )
    }else{
      if(this.availablePolicies.length < 1){
        this.globalMessagingService.displayInfoMessage(
          'info',
          'No policies available for selected product.Please select a different product '
        )
      }
    }
  }
  onPolicySelected(selectedvalue){
    this.selectedPolicy = selectedvalue
    console.log(this.selectedPolicy)
    this.risks = this.selectedPolicy.riskInformation
    this.claimsOpeningForm.get('currency').setValue(this.selectedPolicy.currency)
    this.clientService.getClientById(this.selectedPolicy.clientCode).subscribe({
      next:(res=>{
        this.clientDetails = res
        console.log(this.clientDetails,'client details')
        this.claimsOpeningForm.get('clientType').setValue(res.clientType.category)
        
      })
    })

  }
  getClient(){
    this.clientService.getClients().subscribe({
      next:(res=>{
        // Loop through each claimant and add fullName property dynamically
      this.claimants = res.content.map(claimant => {
        return {
          ...claimant, // Spread the existing claimant properties
          fullName: `${claimant.firstName} ${claimant.lastName}` // Add fullName property
        };
      });

      console.log(this.claimants,'Claimants'); // Verify fullName is added
      }),
    error: (err => {
      console.error("Error fetching clients:", err);
    })
    })
  }
  onClaimantSelect(event: any) {
    this.selectedClaimant = event.value; // Get the selected claimant object
    
    console.log(this.selectedClaimant)
    this.addPerilForm.patchValue({
      telNo: this.selectedClaimant.mobileNumber, 
      email: this.selectedClaimant.emailAddress
    });
  }
  getCausations(){
    this.claimService.getCausations().subscribe({
      next:(res=>{
        this.causations = res
        this.causations = this.causations._embedded
        this.causations = this.causations.causation_dto_list
        console.log(this.causations)
      })
    })
  }
    /**
   * Continues the claim opening process.
   */
  continueClaimOpening() {
    
      console.log('Claim data:', this.claimsOpeningForm.value);
      console.log('Peril data:', this.perils);
      this.router.navigate(['/home/gis/claim/claim-transaction']);
      
    }



  savePerilDetails() {
    // Get peril details from form
    const perilValue = this.claimsOpeningForm.get('peril').value;
    const claimEstimateValue = this.claimsOpeningForm.get('claimEstimate').value;
    // Add peril to perils array
    this.perils.push({ value: perilValue, label: perilValue, claimEstimate: claimEstimateValue });
    // Close the popup
    this.showPerilPopup = false;
  }

  /**
   * Method to capture the claim.
   */
  captureClaim() {
    // Simulate claim validation - implement logic to check for premium balance and outstanding loan
    const hasPremiumBalance = false; // Replace with actual logic
    const hasOutstandingLoan = false; // Replace with actual logic

    // Check for conditional popups
    if (!hasPremiumBalance && !hasOutstandingLoan) {
      // No popups - directly navigate to Claim Transaction Screen
      console.log('Navigating to Claim Transaction Screen'); // Replace with navigation logic
    } else {
      if (hasPremiumBalance) {
        this.showClaimNotificationPopup = true;
      }
      if (hasOutstandingLoan) {
        this.showClaimCapturingPopup = true;
      }
    }
  }

  /**
   * Method to handle the "Yes" button click in the claim notification popup (conditional).
   */
  // continueClaimOpening() {
  //   // Close the popup
  //   this.showClaimNotificationPopup = false;
  //   // Simulate claim opening process - implement logic to continue
  //   console.log('Continuing claim opening process'); // Replace with actual logic
  // }

  /**
   * Method to handle the "No" button click in the claim notification popup (conditional).
   */
  cancelClaimOpening() {
    // Close the popup
    this.showClaimNotificationPopup = false;
    // Simulate cancellation - implement logic to return to previous screen
    console.log('Returning to previous screen'); // Replace with navigation logic
  }

  /**
   * Method to handle the "Yes" button click in the claim capturing popup (conditional).
   */
  continueClaimCapturing() {
    // Close the popup
    this.showClaimCapturingPopup = false;
    // Simulate claim capturing - implement logic to initiate workflow process
    console.log('Initiating claim capturing workflow process'); // Replace with actual logic
  }

  /**
   * Method to handle the "No" button click in the claim capturing popup (conditional).
   */
  cancelClaimCapturing() {
    // Close the popup
    this.showClaimCapturingPopup = false;
    // Simulate cancellation - implement logic to return to previous screen
    console.log('Returning to previous screen'); // Replace with navigation logic
  }

  /**
   * Method to handle the "OK" button click in the assignee selection popup (conditional).
   */
  selectAssignee() {
    // Close the popup
    this.showAssigneePopup = false;
    // Simulate task assignment - implement logic to assign task to selected user
    console.log('Assigning task to selected user'); // Replace with actual logic
  }

  /**
   * Method to add a new peril.
   */
 

  /**
   * Method to create a new claimant.
   */
  createClaimant() {
    // Simulate navigation to Claimant Details screen
    console.log('Navigating to Claimant Details screen'); // Replace with navigation logic
  }
  addPeril(): void {
    // Reset the perilEstimate when the modal opens
    this.perilEstimate = 0; 
  }

  onSelectPeril(selectedValue){
    this.chosenPeril = selectedValue
    console.log(this.chosenPeril)
  }

  deleteSelectedPeril(): void {
    if (this.selectedPeril) {
      const index = this.perilArray.findIndex(peril => peril.label === this.selectedPeril.label);
      if (index !== -1) {
        this.perilArray.splice(index, 1);
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Peril deleted', life: 3000 });
        this.selectedPeril = null; // Reset the selectedPeril
      }
    }
  }
  editPeril(): void {
    // Implement logic to open the edit peril modal and set the modal data
    // ...

  }
  openEditPeril(){
    this.perilForm.patchValue(this.selectedPeril)
    this.perilForm.get('peril').setValue(this.selectedPeril.value)
    this.selectedPeril = this.perilDescription
    console.log(this.selectedPeril)
  }

  validateNotificationDate() {
    const lossDate = new Date(this.claimsOpeningForm.get('lossDate')?.value);
    const notificationDate = new Date(this.claimsOpeningForm.get('notificationDate')?.value);
    // this.globalMessagingService
    if(notificationDate < lossDate){
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'The notification data can only be after or on the loss date'
      )
      this.claimsOpeningForm.get('notificationDate')?.reset();
    }
   
  }

  getUsers(){
    this.claimService.getUsers().subscribe({
      next:(res=>{
        this.Users = res
        this.Users = this.Users.content
        console.log( this.Users)
      })
    })
  }
  getCurrentUser(){
    this.user = this.authService.getCurrentUserName()
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    const passedUserDetailsString = JSON.stringify(this.userDetails);
    sessionStorage.setItem('passedUserDetails', passedUserDetailsString);
  }

  getRiskPerils(subclassCode){
    this.classService.getAllClassPerils().subscribe(
      {
        next:(res=>{
          console.log(res)
        })
      }
    )

    this.claimService.getSubPerilsbyCode(subclassCode).subscribe({
      next:(res=>{
       this.perils = res
       console.log(this.perils.content, 'subperils')
       this.perils.content.forEach(element => {
        this.perilService.getPeril(element.perilCode).subscribe({
          next:(perilRes=>{
            const combinedPeril = {
              ...perilRes,
              subclassSectionPerilsCode: element.subclassSectionPerilsCode // Add the subclassSectionPerilsCode to the peril object
            };
            // Push the combined peril object to perilArray
          this.perilArray.push(combinedPeril);
          console.log(this.perilArray);
            // this.perilsList = res
            // this.perilArray.push(this.perilsList)

            // console.log(this.perilArray,'perils array')
          })
        })
        
       });

      })
    })
  }
  onRiskSelected(selectedValue){
    console.log(selectedValue.subClassCode)
    this.getRiskPerils(selectedValue.subClassCode)

  }

  saveClaimPeril(){
    console.log(this.chosenPeril.subclassSectionPerilsCode)
    const selectedPeril = this.addPerilForm.value.peril; // The selected peril object
    console.log(this.addPerilForm.value.liabilityAdmission)
     this.addPerilpayload = {
      action: 'A',
      code: null,
      perilCode: this.chosenPeril.subclassSectionPerilsCode ,
      perilLevel: null,
      peril: this.addPerilForm.value.peril ? this.addPerilForm.value.peril.description : null,
      perilAmount: this.addPerilForm.value.claimEstimate,
      perilEstimate: this.addPerilForm.value.claimEstimate,
      thirdParty:null, // third party if not self
      vCpvCldCode: this.selectedClaimant.id,
      groupCode: null,
      CommunicationMode: this.getPreferredCommunication(), // Get communication mode
      PaymentMode: this.getPaymentMode(), // Get payment mode
      vPrpCode: null, // Assign the client code if available
      LiabilityAdmission: this.addPerilForm.value.liabilityAdmission ? 'Y' : 'N',
      LiabilityAdmDate: null,
      MainPerilCode: null,
      PerilRate:null,
      ExcessCodes: null,
      PerilRemarks: null
    };
  
    console.log(JSON.stringify(this.addPerilpayload));

    this.claimService.addClaimPeril(this.addPerilpayload).subscribe({
      next:(res=>{
        this.globalMessagingService.displaySuccessMessage('success','Peril Added successfully')
        console.log(res)
      }),
      error:(err => {
        this.globalMessagingService.displayErrorMessage('error','Failed to add peril, try again later')
      })
    })
  }


  getPreferredCommunication() {
    // Returns the preferred communication mode based on the form values
    if (this.addPerilForm.value.telNo) {
      return 'Tel No';
    } else if (this.addPerilForm.value.email) {
      return 'Email';
    } else if (this.addPerilForm.value.sms) {
      return 'SMS';
    }
    return null;
  }
  
  getPaymentMode() {
    // Returns the preferred payment mode based on the checkbox selections
    if (this.addPerilForm.value.mPay) {
      return this.addPerilForm.value.mPayDetails;
    } else if (this.addPerilForm.value.emt) {
      return this.addPerilForm.value.emtDetails;
    } else if (this.addPerilForm.value.cheque) {
      return this.addPerilForm.value.chequeDetails;
    }
    return null;
  }



}
