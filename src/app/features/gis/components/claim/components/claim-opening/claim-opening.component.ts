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

interface Claimant {
  value: string;
  label: string;
}

interface NextReviewUser {
  value: string;
  label: string;
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
  selectedPeril:any;
  chosenPeril:any;
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
  catastropheEvents: CatastropheEvent[] = [
    { value: 'event1', label: 'Event 1' },
    { value: 'event2', label: 'Event 2' },
    { value: 'event3', label: 'Event 3' }
  ];
  partyToBlame: PartyToBlame[] = [
    { value: 'party1', label: 'Party 1' },
    { value: 'party2', label: 'Party 2' },
    { value: 'party3', label: 'Party 3' }
  ];
  perils:any[];
  perilsList:any;
  perilArray:any[]=[]

  nextReviewUsers: NextReviewUser[] = [
    { value: 'user1', label: 'User 1' },
    { value: 'user2', label: 'User 2' },
    { value: 'user3', label: 'User 3' }
  ];
  priorityLevels: PriorityLevel[] = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];
   // Sample data (replace with actual data from your application)
   claimants: { label: string; value: string }[] = [
    { label: 'John Doe', value: 'johnDoe' },
    { label: 'Jane Doe', value: 'janeDoe' },
    { label: 'Peter Pan', value: 'peterPan' }
  ];

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

  // Popup flags
  showPerilPopup: boolean = false;
  showClaimNotificationPopup: boolean = false;
  showClaimCapturingPopup: boolean = false;
  showAssigneePopup: boolean = false;

  constructor(
     private fb: FormBuilder,
     private primengConfig: PrimeNGConfig,
     private messageService: MessageService,
     private productService: ProductsService,
     private policyService: PolicyService,
     private globalMessagingService:GlobalMessagingService,
     private claimService: ClaimsService,
     private router: Router
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
    });

      // Initialize the form for the peril modal
      this.perilForm = this.fb.group({
        peril: ['', Validators.required],
        claimEstimate: ['', Validators.required]
      });

    
  }

  ngOnInit(): void {
    this.getProduct()
    this.getCausations()
    this.primengConfig.ripple = true;
    this.perilsList = [
      { label: 'Fire Damage', value: 'Fire Damage' },
      { label: 'Water Damage', value: 'Water Damage' },
      { label: 'Theft Loss', value: 'Theft Loss' }
    ]; 

    this.addPerilForms();

  
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
      claimant: ['', Validators.required],
      telNo: [''],
      email: ['', [Validators.required, Validators.email]],
      sms: [''],
      peril: ['', Validators.required],
      liabilityAdmission: [false],
      claimEstimate: ['', Validators.required],
      mPayDetails: [''],
      emtDetails: [''],
      chequeDetails: [''],
      pinDetails: ['']
    });

    // Disable claimant when selfAsClaimant is checked
    this.addPerilForm.get('selfAsClaimant')?.valueChanges.subscribe(isChecked => {
      const claimantControl = this.addPerilForm.get('claimant');
      if (claimantControl) {
        claimantControl.disable(isChecked);
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

  onProductSelected(selectedValue: any) {
    this.selectedProduct = selectedValue
    this.getPolicies(this.selectedProduct.code)
    console.log(this.selectedProduct.code)
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
    console.log(this.selectedPolicy.riskInformation)
    this.risks = this.selectedPolicy.riskInformation
  }
  getCausations(){
    this.claimService.getCausations().subscribe({
      next:(res=>{
        this.causations = res
        console.log(res)
      })
    })
  }
    /**
   * Continues the claim opening process.
   */
  continueClaimOpening() {
      // 3. Simulate claim capture (replace with real API call)
      // console.log('Claim data:', this.claimForm.value);
      console.log('Peril data:', this.perils);
      this.router.navigate(['/home/gis/claim/claim-transaction']);
      // 4. Close the Bootstrap modal
      // this.closeModal('confirmationModal');
  
      // 5. Clear the form (Optional)
      // this.claimForm.reset();
    }

  /**
   * Method to find and display available products based on user input.
   */
  findProducts() {
    // Simulate search logic - update products based on user input
  
  }

  /**
   * Method to find and display available policies based on user input.
   */
  findPolicies() {
    // Simulate search logic - update policies based on user input
    
  }

  /**
   * Method to find and display available risks based on user input.
   */
  findRisks() {
    // Simulate search logic - update risks based on user input
    this.risks = [
      { value: 'risk1', label: 'Risk 1' },
      { value: 'risk2', label: 'Risk 2' },
      { value: 'risk3', label: 'Risk 3' }
    ];
  }



  /**
   * Method to find and display available catastrophes or events based on user input.
   */
  findCatastropheEvent() {
    // Simulate search logic - update catastropheEvents based on user input
    this.catastropheEvents = [
      { value: 'event1', label: 'Event 1' },
      { value: 'event2', label: 'Event 2' },
      { value: 'event3', label: 'Event 3' }
    ];
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
  }

  savePeril(): void {
    // Check if the peril already exists in the array
    // const existingPerilIndex = this.perils.findIndex(peril => peril.label === this.chosenPeril.label);
  
    console.log(this.chosenPeril.label)
    console.log(this.perilForm.value.claimEstimate)
    this.perilArray.push({ label: this.chosenPeril.label, claimEstimate:this.perilForm.value.claimEstimate })

    console.log(this.perilArray)
    // if (existingPerilIndex !== -1) {
    //   // If the peril exists, update the claimEstimate
    //   console.log(this.perils)
    //   this.perils[existingPerilIndex].claimEstimate = this.perilEstimate;
    // } else {
    //   // If the peril is new, add it to the array
    //   this.perils.push({ label: this.selectedPeril.label, value: this.selectedPeril.value, claimEstimate: this.perilEstimate });
    // }
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Peril added successfully', life: 3000 });
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
  onSubmit() {
    // Handle form submission logic here
    console.log(this.addPerilForm.value);
  }


}
