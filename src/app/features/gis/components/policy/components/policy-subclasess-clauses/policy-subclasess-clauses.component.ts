import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import { Logger } from 'src/app/shared/services';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PolicyResponseDTO, PolicyContent, SubclassesClauses, SelectedSubclassClause } from '../../data/policy-dto';
import { PolicyService } from '../../services/policy.service';
import { untilDestroyed } from 'src/app/shared/shared.module';

const log = new Logger("PolicySubclasessClausesComponent");

@Component({
  selector: 'app-policy-subclasess-clauses',
  templateUrl: './policy-subclasess-clauses.component.html',
  styleUrls: ['./policy-subclasess-clauses.component.css']
})

export class PolicySubclasessClausesComponent {
  policyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  riskDetails: any;
  selectedTransactionType: any;
  passedBinderCode: any;
  errorMessage: string;
  errorOccurred: boolean;
  productClauseList: any;
  selectedPolicyClause: any;
  selectedPolicyClauses: any = {};  // Initialize as an empty object

  modalHeight: number = 200;
  policyClausesDetailsForm: FormGroup;
  editPolicySubclassesClausesDetailsForm: FormGroup;
  selectedPolicySubclassClause: any;
  selectedSubclassClauses: SelectedSubclassClause[] = [];


  policySubclassesClausesDetailsForm: FormGroup;
  policySubclassClauses: any;
  addedPolicySubclassClauses: any;





  constructor(
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public quotationService: QuotationsService,
    public policyService: PolicyService,
    public fb: FormBuilder,



  ) { }
  ngOnInit(): void {
    this.getUtil()
   this.createPolicySubclassesClausesDetailsForm()
  }
  ngOnDestroy(): void { }

  getUtil() {
    this.policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
    this.getPolicyDetails();
    log.debug("Policy Details", this.policyDetails);


  }

  getPolicyDetails() {
    this.batchNo = this.policyDetails.batchNumber;
    log.debug("Policy Batch Number:", this.batchNo)
    this.policyService
      .getPolicy(this.batchNo)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.policyResponse = response;
          this.policyDetailsData = this.policyResponse.content[0]
          log.debug("Policy Details Data:", this.policyDetailsData)
          // if (this.policyDetailsData.product.code) {
          //   this.getProductClauses()
          // }
          if (this.policyDetailsData){
            this.fetchSubclassClauses();
            this.fetchAddedPolicySubclassClauses();

          }
          this.cdr.detectChanges();

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  policy details.Try again later');
        }
      })
  }
  onResize(event: any) {
    this.modalHeight = event.height;
  }
  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }
  openPolicySubclassesVlauseDeleteModal() {
    log.debug("Selected Policy Tax", this.selectedPolicySubclassClause)
    if (!this.selectedPolicySubclassClause) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a clause to continue');
    } else {
      document.getElementById("openModalPolicySubclassesClauseButtonDelete").click();

    }
  }
  createPolicySubclassesClausesDetailsForm() {
    this.policySubclassesClausesDetailsForm = this.fb.group({
      clause: [''],
      clauseCode: [''],
      clauseType: [''],
      code: [''],
      description: [''],
      editable: [''],
      heading: [''],
      isNew: [''],
      policyBatchNumber: [''],
      policyNumber: [''],
      subclassCode: ['']
    });
  }
  addPolicySubclassClauses() {
    this.selectedSubclassClauses.forEach((clause) => {
      this.addPolicySubclassClause(clause);
    });
    
  }
  addPolicySubclassClause(clause: SelectedSubclassClause) {
    // Populate form fields for each clause
    this.policySubclassesClausesDetailsForm.get('clause').setValue(clause.wording);
    this.policySubclassesClausesDetailsForm.get('clauseCode').setValue(clause.code);
    this.policySubclassesClausesDetailsForm.get('clauseType').setValue(clause.clauseType);
    this.policySubclassesClausesDetailsForm.get('code').setValue(clause.code);
    this.policySubclassesClausesDetailsForm.get('editable').setValue(clause.editable);
    this.policySubclassesClausesDetailsForm.get('heading').setValue(clause.heading);
    this.policySubclassesClausesDetailsForm.get('description').setValue(clause.shortDescription);
    this.policySubclassesClausesDetailsForm.get('policyBatchNumber').setValue(this.batchNo);
    this.policySubclassesClausesDetailsForm.get('policyNumber').setValue(this.policyDetailsData.policyNo);
    this.policySubclassesClausesDetailsForm.get('subclassCode').setValue(clause.subClassCode);
    this.policySubclassesClausesDetailsForm.get('isNew').setValue("y");
  
    const createPolicySubclassesClauseForm = this.policySubclassesClausesDetailsForm.value;
    log.debug("Add Policy subclass Clauses Form:", createPolicySubclassesClauseForm);
  
    // Service call for each clause
    this.policyService
      .createPolicySubclassesClause(createPolicySubclassesClauseForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          log.debug("Response after adding Policy subclass clause:", response);
          this.fetchAddedPolicySubclassClauses();
          this.globalMessagingService.displaySuccessMessage(
            'Success', 
            `Policy Subclasses clause ${clause.shortDescription} added successfully`
          );
        },
        error: (error) => {
          console.error("Failed to add policy Subclasses clause:", error);
          this.globalMessagingService.displayErrorMessage(
            'Error', 
            `Failed to add policy Subclasses clause ${clause.shortDescription}. Try again later`
          );
        }
      });
  }
  // addPolicySubclassClause() {

  //   this.policySubclassesClausesDetailsForm.get('clause').setValue(this.selectedSubclassClause.shortDescription);
  //   this.policySubclassesClausesDetailsForm.get('clauseCode').setValue(this.selectedSubclassClause.code);
  //   this.policySubclassesClausesDetailsForm.get('clauseType').setValue(this.selectedSubclassClause.clauseType);
  //   this.policySubclassesClausesDetailsForm.get('code').setValue(this.selectedSubclassClause.code);
  //   this.policySubclassesClausesDetailsForm.get('editable').setValue(this.selectedSubclassClause.editable);
  //   this.policySubclassesClausesDetailsForm.get('heading').setValue(this.selectedSubclassClause.heading);
  //   this.policySubclassesClausesDetailsForm.get('policyBatchNumber').setValue(this.batchNo);
  //   this.policySubclassesClausesDetailsForm.get('policyNumber').setValue(this.policyDetailsData.policyNo);
  //   this.policySubclassesClausesDetailsForm.get('subclassCode').setValue(this.selectedSubclassClause.subClassCode);
   
  //   const createPolicySubclassesClauseForm = this.policySubclassesClausesDetailsForm.value;

  //   log.debug("Add Policy subclass Clauses Form:", createPolicySubclassesClauseForm)


  //   this.policyService
  //     .createPolicySubclassesClause(createPolicySubclassesClauseForm)
  //     .pipe(untilDestroyed(this))
  //     .subscribe({
  //       next: (response: any) => {
  //         // this.policyTaxesResponse = response._embedded
  //         log.debug("Response after adding Policy subclass clause:", response)
  //         log.debug("POLICY Subclasses clauses", this.policySubclassClauses)
         

  //         // this.policyTaxes.push(this.selectedApplicableTax);
  //         // log.debug("POLICY TAXES after adding", this.policyTaxes)
  //         // this.closebutton.nativeElement.click();
  //         this.globalMessagingService.displaySuccessMessage('Success', 'Policy Subclasses clauses details added successfully');


  //       },
  //       error: (error) => {

  //         this.globalMessagingService.displayErrorMessage('Error', 'Failed to add policy Subclasses clauses details.Try again later');
  //       }
  //     });
  // } 
  editPolicySubclassClause() {
    log.debug("SELECTED SUBCLASS CLAUSES",this.selectedPolicySubclassClause)
    // this.policySubclassesClausesDetailsForm.get('clause').setValue(this.selectedPolicySubclassClause.clause);
    this.policySubclassesClausesDetailsForm.get('clauseCode').setValue(this.selectedPolicySubclassClause.clauseCode);
    this.policySubclassesClausesDetailsForm.get('clauseType').setValue(this.selectedPolicySubclassClause.clauseType);
    this.policySubclassesClausesDetailsForm.get('code').setValue(this.selectedPolicySubclassClause.clauseCode);
    this.policySubclassesClausesDetailsForm.get('editable').setValue(this.selectedPolicySubclassClause.editable);
    // this.policySubclassesClausesDetailsForm.get('heading').setValue(this.selectedPolicySubclassClause.heading);
    this.policySubclassesClausesDetailsForm.get('description').setValue(this.selectedPolicySubclassClause.description);
    this.policySubclassesClausesDetailsForm.get('policyBatchNumber').setValue(this.batchNo);
    this.policySubclassesClausesDetailsForm.get('policyNumber').setValue(this.policyDetailsData.policyNo);
    this.policySubclassesClausesDetailsForm.get('subclassCode').setValue(this.selectedPolicySubclassClause.subclassCode);
    this.policySubclassesClausesDetailsForm.get('isNew').setValue(this.selectedPolicySubclassClause.isNew);
   

    const createPolicySubclassesClauseForm = this.policySubclassesClausesDetailsForm.value;
    log.debug("edit Policy Clauses Form:", createPolicySubclassesClauseForm)


    this.policyService
      .updatePolicySubclassesClause(createPolicySubclassesClauseForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          // this.policyTaxesResponse = response._embedded
          log.debug("Response after Updating Policy subclass clause:", response)
          log.debug("POLICY Subclasses clauses", this.policySubclassClauses)
         

          // this.policyTaxes.push(this.selectedApplicableTax);
          // log.debug("POLICY TAXES after adding", this.policyTaxes)
          // this.closebutton.nativeElement.click();
          this.globalMessagingService.displaySuccessMessage('Success', 'Policy Subclasses clauses details updated successfully');


        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to update policy Subclasses clauses details.Try again later');
        }
      });
  }
  deletePolicySubclassClause() {
    log.debug("Selected Policy Subclass clauses", this.selectedPolicySubclassClause)
    const batchNo = parseInt(this.batchNo)
    const code = parseInt(this.selectedPolicySubclassClause.clauseCode)
    const clauseCode = parseInt(this.selectedPolicySubclassClause.clauseCode)
    const subclassCode = parseInt(this.selectedPolicySubclassClause.subclassCode)
    this.policyService
      .deletePolicySubclassesClause(code, batchNo, clauseCode,this.policyDetailsData.policyNo, subclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          
          console.log('Deleted Policy Subclass clause:', response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted policy subclass clause')

          // Remove the deleted policy subclass clause from the policy subclass clause Details array 
          const index = this.addedPolicySubclassClauses.findIndex(clause => clause.clauseCode === this.selectedPolicySubclassClause.clauseCode);
          if (index !== -1) {
            this.addedPolicySubclassClauses.splice(index, 1);
          }
          // Clear the selected subclass clause
          this.selectedPolicySubclassClause = null;

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete policy subclass clauses details.Try again later');
        }
      })
  }
  fetchSubclassClauses() {
    this.policyService
      .getPolicySubclassClauses(this.policyDetailsData.batchNo, this.policyDetailsData.policyNo, this.policyDetailsData.product.code)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          
          log.debug('Policy Subclass clause List:', response._embedded);
          this.policySubclassClauses=response._embedded
         

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch policy subclass clauses list.Try again later');
        }
      })
  }
  OnSelectSubclassClause(subclassClause: any) {
    log.debug(" Selected subclass clause", subclassClause)
    this.selectedSubclassClauses = subclassClause;
   
    // if (this.selectedSubclassClause) {
    //   this.addPolicySubclassClause()
    // }
  }
  fetchAddedPolicySubclassClauses() {
    this.policyService
      .fetchAddedPolicySubclassClauses(this.policyDetailsData.batchNo, this.policyDetailsData.policyNo)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          
          this.addedPolicySubclassClauses = response._embedded; 
          log.debug('Added Policy Subclass clause List:', this.addedPolicySubclassClauses);


        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch  added policy subclass clauses list.Try again later');
        }
      })
  }
  openSubclassClauseEditModal() {
    log.debug("Selected Policy Subclass Clause", this.selectedPolicySubclassClause)
    if (!this.selectedPolicySubclassClause) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Subclass clause to continue');
    } else {
      document.getElementById("openSubclassClauseModalButtonEdit").click();
    

    }
  }
  onEditPolicySubclassClause(subclassClause: any) {
    this.selectedPolicySubclassClause = subclassClause;
    log.debug("Selected Policy Subclass to edit",this.selectedPolicySubclassClause)
    this.policySubclassesClausesDetailsForm.patchValue({
      heading: this.selectedPolicySubclassClause.heading,
      clause: this.selectedPolicySubclassClause.clause,
      // Patch other fields if needed
    });
  }

}
