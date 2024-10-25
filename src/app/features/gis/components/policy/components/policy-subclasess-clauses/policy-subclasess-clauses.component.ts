import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import { Logger } from 'src/app/shared/services';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PolicyResponseDTO, PolicyContent } from '../../data/policy-dto';
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
  // selectedPolicyClause: any;
  selectedPolicyClause: any = {};  // Initialize as an empty object

  modalHeight: number = 200;
  policyClausesDetailsForm: FormGroup;
  editPolicySubclassesClausesDetailsForm: FormGroup;
  selectedPolicySubclassClauses: any;
  policySubclassesClausesDetailsForm: FormGroup;
  policySubclassClauses: any;





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
          log.debug("Policy Details:", this.policyDetailsData)
          // if (this.policyDetailsData.product.code) {
          //   this.getProductClauses()
          // }
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
    log.debug("Selected Policy Tax", this.selectedPolicySubclassClauses)
    if (!this.selectedPolicySubclassClauses) {
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
  addPolicySubclassClause() {
    
    this.policySubclassesClausesDetailsForm.get('clause').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('clauseCode').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('clauseType').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('code').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('editable').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('heading').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('policyBatchNumber').setValue(this.batchNo);
    this.policySubclassesClausesDetailsForm.get('policyNumber').setValue(this.policyDetailsData.policyNo);
    this.policySubclassesClausesDetailsForm.get('subclassCode').setValue(this.selectedPolicyClause);
   

    const createPolicySubclassesClauseForm = this.policySubclassesClausesDetailsForm.value;
    log.debug("Add Policy Clauses Form:", createPolicySubclassesClauseForm)


    this.policyService
      .createPolicySubclassesClause(createPolicySubclassesClauseForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          // this.policyTaxesResponse = response._embedded
          log.debug("Response after adding Policy subclass clause:", response)
          log.debug("POLICY Subclasses clauses", this.policySubclassClauses)
         

          // this.policyTaxes.push(this.selectedApplicableTax);
          // log.debug("POLICY TAXES after adding", this.policyTaxes)
          // this.closebutton.nativeElement.click();
          this.globalMessagingService.displaySuccessMessage('Success', 'Policy Subclasses clauses details added successfully');


        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to add policy Subclasses clauses details.Try again later');
        }
      });
  } 
  editPolicySubclassClause() {
    
    this.policySubclassesClausesDetailsForm.get('clause').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('clauseCode').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('clauseType').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('code').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('editable').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('heading').setValue(this.selectedPolicyClause);
    this.policySubclassesClausesDetailsForm.get('policyBatchNumber').setValue(this.batchNo);
    this.policySubclassesClausesDetailsForm.get('policyNumber').setValue(this.policyDetailsData.policyNo);
    this.policySubclassesClausesDetailsForm.get('subclassCode').setValue(this.selectedPolicyClause);
   

    const createPolicySubclassesClauseForm = this.policySubclassesClausesDetailsForm.value;
    log.debug("Add Policy Clauses Form:", createPolicySubclassesClauseForm)


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
  deletePolicyTaxes() {
    log.debug("Selected Policy Subclass clauses", this.selectedPolicySubclassClauses)
    this.policyService
      .deletePolicySubclassesClause(this.selectedPolicySubclassClauses.code, this.batchNo,this.selectedPolicySubclassClauses.clauseCode, this.policyDetailsData.policyNo, this.selectedPolicySubclassClauses.subclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          
          console.log('Deleted Policy Subclass clause:', response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted policy subclass clause')

          // Remove the deleted policy subclass clause from the policy subclass clause Details array 
          // const index = this.filteredPolicyTaxes.findIndex(tax => tax.transactionTypeCode === this.selectedPolicyTax.transactionTypeCode);
          // if (index !== -1) {
          //   this.filteredPolicyTaxes.splice(index, 1);
          // }
          // Clear the selected subclass clause
          this.selectedPolicySubclassClauses = null;

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete policy subclass clauses details.Try again later');
        }
      })
  }
}
