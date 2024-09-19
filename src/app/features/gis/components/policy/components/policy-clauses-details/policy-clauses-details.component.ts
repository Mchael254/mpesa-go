import { ChangeDetectorRef, Component } from '@angular/core';
import { QuotationsService } from '../../../../components/quotation/services/quotations/quotations.service'
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Logger, untilDestroyed } from 'src/app/shared/shared.module';
import { PolicyService } from '../../services/policy.service';
import { PolicyResponseDTO, PolicyContent } from '../../data/policy-dto';
import { FormBuilder, FormGroup } from '@angular/forms';

const log = new Logger("PolicyClausesDetailsComponent");

@Component({
  selector: 'app-policy-clauses-details',
  templateUrl: './policy-clauses-details.component.html',
  styleUrls: ['./policy-clauses-details.component.css']
})
export class PolicyClausesDetailsComponent {
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
  editPolicyClausesDetailsForm: FormGroup;




  constructor(
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public quotationService: QuotationsService,
    public policyService: PolicyService,
    public fb: FormBuilder,



  ) { }

  ngOnInit(): void {
    this.getUtil();
    this.createPolicyClauseDetailsForm();
    this.createEditPolicyClauseDetailsForm()
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
          if (this.policyDetailsData.product.code) {
            this.getProductClauses()
          }
          this.cdr.detectChanges();

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  policy details.Try again later');
        }
      })
  }
  getProductClauses() {
    this.quotationService
      .getProductClauses(this.policyDetailsData.product.code)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.productClauseList = response;
          log.debug("Policy clause list :", this.productClauseList)

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  product clauses details.Try again later');
        }
      })
  }
  createPolicyClauseDetailsForm() {
    this.policyClausesDetailsForm = this.fb.group({
      batchNo: [''],
      clauseCode: [''],
      endorsementNo: [''],
      policyNo: [''],
      productCode: [''],

    });
  }
  getSelectedClauses() {
  log.debug('Selected Clauses:', this.selectedPolicyClause);
  this.addPolicyClauses(this.selectedPolicyClause)
  }
  // addPolicyClauses(clause: any) {

  //   this.policyClausesDetailsForm.get('batchNo').setValue(this.batchNo)
  //   this.policyClausesDetailsForm.get('clauseCode').setValue(clause.code)
  //   this.policyClausesDetailsForm.get('endorsementNo').setValue(this.policyDetailsData.endorsementNo)
  //   this.policyClausesDetailsForm.get('policyNo').setValue(this.policyDetailsData.policyNo)
  //   this.policyClausesDetailsForm.get('productCode').setValue(this.policyDetailsData.product.code)

  //   const policyClausesDetailsForm = this.policyClausesDetailsForm.value;
  //   log.debug("Policy clauses  Form:", policyClausesDetailsForm)
  //   this.policyService
  //     .addPolicyClause(policyClausesDetailsForm)
  //     .pipe(untilDestroyed(this))
  //     .subscribe({
  //       next: (response: any) => {
  //         log.debug("Added Clause :", response)

  //       },
  //       error: (error) => {

  //         this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  product clauses details.Try again later');
  //       }
  //     })
  // }
  addPolicyClauses(clauses: any[]) {
    // Loop through each selected clause
    clauses.forEach((clause) => {
      // Set the form values for the current clause
      this.policyClausesDetailsForm.get('batchNo').setValue(this.batchNo);
      this.policyClausesDetailsForm.get('clauseCode').setValue(clause.code);
      this.policyClausesDetailsForm.get('endorsementNo').setValue(this.policyDetailsData.endorsementNo);
      this.policyClausesDetailsForm.get('policyNo').setValue(this.policyDetailsData.policyNo);
      this.policyClausesDetailsForm.get('productCode').setValue(this.policyDetailsData.product.code);
  
      // Get the form value after setting the fields
      const policyClausesDetailsForm = this.policyClausesDetailsForm.value;
      log.debug('Policy clauses Form:', policyClausesDetailsForm);
  
      // Call the service to add the clause
      this.policyService
        .addPolicyClause(policyClausesDetailsForm)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (response: any) => {
            log.debug('Added Clause:', response);
            this.globalMessagingService.displaySuccessMessage('Success', 'Policy clause added successfully');

          },
          error: (error) => {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Failed to add product clauses details. Try again later'
            );
          },
        });
    });
  }
  
  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }
  onResize(event: any) {
    this.modalHeight = event.height;
  }

  onSelectPolicyClauses(event: any) {
    log.debug('Selected policy clause ',event)

    // console.log(this.selectedClause,'selected clause ')

  }
  createEditPolicyClauseDetailsForm() {
    this.editPolicyClausesDetailsForm = this.fb.group({
      clause: [''],
      clauseHeading: [''],
      clauseItemNo: [''],
      policyClauseCode: [''],
      policyCode: [''],

    });
  }
  editpolicyClause(clause){
    console.log('Selected Policy Clause',clause)
    this.editPolicyClausesDetailsForm.get('clause').setValue(clause.wording);
      this.editPolicyClausesDetailsForm.get('clauseHeading').setValue(clause.heading);
      this.editPolicyClausesDetailsForm.get('clauseItemNo').setValue(0);
      this.editPolicyClausesDetailsForm.get('policyClauseCode').setValue(clause.code);
      this.editPolicyClausesDetailsForm.get('policyCode').setValue(this.batchNo);
  
      // Get the form value after setting the fields
      const editPolicyClausesDetailsForm = this.editPolicyClausesDetailsForm.value;
      log.debug('Policy clauses Form to be edited:', editPolicyClausesDetailsForm);

      this.policyService
      .editPolicyClause(editPolicyClausesDetailsForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          log.debug('Added Clause:', response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Policy clause updated successfully');

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to update  product clauses details.Try again later');
        }
      })
  }
}
