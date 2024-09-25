import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import { Logger } from 'src/app/shared/services';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { PolicyService } from '../../services/policy.service';
import { PolicyResponseDTO, PolicyContent } from '../../data/policy-dto';
const log = new Logger("PolicyTaxesComponent");

@Component({
  selector: 'app-policy-taxes',
  templateUrl: './policy-taxes.component.html',
  styleUrls: ['./policy-taxes.component.css']
})
export class PolicyTaxesComponent {
  policyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  applicableTaxesList: any;
  passedPolicyRiskDetails: any;
  selectedSubclassCode: any;
  policyTaxes: any;
  filteredPolicyTaxes: any;
  selectedPolicyTax: any;
  policyTaxesDetailsForm: FormGroup;
  populatePolicyTaxesDetailsForm: FormGroup;
  passedBinderCode: any;
  selectedApplicableTax: any;
  policyTaxesList: any;

  @ViewChild('dt3') dt3: Table | undefined;
  @ViewChild('closebutton') closebutton;
  @ViewChild('policyTaxesModal') policyTaxesModal: any;



  constructor(
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public quotationService: QuotationsService,
    public policyService: PolicyService,
    public fb: FormBuilder,



  ) { }
  ngOnInit(): void {
    this.getUtil()
    const passedPolicyRiskString = sessionStorage.getItem('passedRiskPolicyDetails');
    this.passedPolicyRiskDetails = JSON.parse(passedPolicyRiskString);
    log.debug("Passed Policy Risk Details:", this.passedPolicyRiskDetails);
    this.selectedSubclassCode = this.passedPolicyRiskDetails.subClassCode
    log.debug("Subclass Code", this.selectedSubclassCode)
    if (this.selectedSubclassCode) {
      this.fetchApplicableTaxes()
      this.getPolicyTaxes()
    }
    this.passedBinderCode = this.passedPolicyRiskDetails.binderCode

    this.createPopulatePolicyTaxesDetailsForm();
    this.createPolicyTaxesDetailsForm();

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

  fetchApplicableTaxes() {
    const transactionCategory = "CL"
    this.policyService
      .getApplicableTaxes(this.selectedSubclassCode, transactionCategory)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.applicableTaxesList = response._embedded
          log.debug("Applicable Taxes:", this.applicableTaxesList)

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to retrieve  applicable taxes details.Try again later');
        }
      })
  }
  applyFilterGlobalTaxes($event, stringVal) {
    this.dt3.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  getPolicyTaxes() {
    this.policyService
      .getPolicyTaxes(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.policyTaxesList = response._embedded
          console.log('Policy  Taxes:', this.policyTaxesList);
          this.filteredPolicyTaxes = this.policyTaxesList.filter(policyTaxesList => policyTaxesList.batchNo == this.batchNo);
          log.debug("FILTERED Policy Taxes LIST", this.filteredPolicyTaxes)
          this.policyTaxes = this.filteredPolicyTaxes;

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get policy taxes details.Try again later');
        }
      });
  }
  OnSelectApplicableTax(tax: any) {
    log.debug(" Selected Applicable Tax", tax)
    this.selectedApplicableTax = tax;
    if (this.selectedApplicableTax) {
      this.addPolicyTaxes()
    }
  }
  createPolicyTaxesDetailsForm() {
    this.policyTaxesDetailsForm = this.fb.group({
      addOrEdit: [''],
      amount: [''],
      batchNo: [''],
      companyLevel: [''],
      endorsementNumber: [''],
      overrideRate: [''],
      polBinder: [''],
      policyNumber: [''],
      proCode: [''],
      rate: [''],
      taxRateCode: [''],
      taxType: [''],
      transactionLevel: ['']
    });
  }
  addPolicyTaxes() {
    this.policyTaxesDetailsForm.get('addOrEdit').setValue("A");
    this.policyTaxesDetailsForm.get('amount').setValue(this.selectedApplicableTax.taxAmount);
    this.policyTaxesDetailsForm.get('batchNo').setValue(this.batchNo);
    this.policyTaxesDetailsForm.get('companyLevel').setValue("A");
    this.policyTaxesDetailsForm.get('endorsementNumber').setValue(this.policyDetailsData.endorsementNo);
    this.policyTaxesDetailsForm.get('overrideRate').setValue("A");
    this.policyTaxesDetailsForm.get('polBinder').setValue(this.passedBinderCode);
    this.policyTaxesDetailsForm.get('policyNumber').setValue(this.policyDetailsData.policyNo);
    this.policyTaxesDetailsForm.get('proCode').setValue(this.policyDetailsData.product.code);
    this.policyTaxesDetailsForm.get('rate').setValue(this.selectedApplicableTax.taxRate);
    this.policyTaxesDetailsForm.get('taxRateCode').setValue(this.selectedApplicableTax.code);
    this.policyTaxesDetailsForm.get('taxType').setValue(this.selectedApplicableTax.taxType);
    this.policyTaxesDetailsForm.get('transactionLevel').setValue(this.selectedApplicableTax.taxRateCode);

    const createPolicyTaxesForm = this.policyTaxesDetailsForm.value;
    log.debug("Add Taxes Form:", createPolicyTaxesForm)


    this.policyService
      .addPolicyTaxes(createPolicyTaxesForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          // this.policyTaxesResponse = response._embedded
          log.debug("Response after adding tax:", response)
          log.debug("POLICY TAXES", this.policyTaxes)
          log.debug("APPLICABLE TAXES", this.selectedApplicableTax)

          this.policyTaxes.push(this.selectedApplicableTax);
          log.debug("POLICY TAXES after adding", this.policyTaxes)
          this.closebutton.nativeElement.click();
          this.globalMessagingService.displaySuccessMessage('Success', 'Policy Tax details added successfully');


        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to add policy taxes details.Try again later');
        }
      });
  }
  createPopulatePolicyTaxesDetailsForm() {
    this.populatePolicyTaxesDetailsForm = this.fb.group({
      batchNo: [''],
      endorsementNumber: [''],
      polBinder: [''],
      policyNumber: [''],
      proCode: [''],
      transactionType: [''],
    });
  }
  populatePolicyTaxes() {
    this.populatePolicyTaxesDetailsForm.get('batchNo').setValue(this.batchNo)
    this.populatePolicyTaxesDetailsForm.get('endorsementNumber').setValue(this.policyDetailsData.endorsementNo)
    this.populatePolicyTaxesDetailsForm.get('polBinder').setValue(this.passedBinderCode)
    this.populatePolicyTaxesDetailsForm.get('policyNumber').setValue(this.policyDetailsData.policyNo)
    this.populatePolicyTaxesDetailsForm.get('proCode').setValue(this.policyDetailsData.product.code)
    this.populatePolicyTaxesDetailsForm.get('transactionType').setValue("NB")

    const populatePolicyTaxesForm = this.populatePolicyTaxesDetailsForm.value;
    log.debug("Populate Taxex Form:", populatePolicyTaxesForm)

    this.policyService
      .populatePolicyTaxes(populatePolicyTaxesForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.policyTaxes = response
          console.log('Policy  Taxes:', this.policyTaxes);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully populated policy taxes')

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to add policy taxes details.Try again later');
        }
      })

  }
  openPolicyTaxDeleteModal() {
    log.debug("Selected Policy Tax", this.selectedPolicyTax)
    if (!this.selectedPolicyTax) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select policy tax to continue');
    } else {
      document.getElementById("openModalTaxButtonDelete").click();

    }
  }
  deletePolicyTaxes() {
    log.debug("Selected Policy Tax", this.selectedPolicyTax)
    this.policyService
      .deletePolicyTaxes(this.batchNo, this.selectedPolicyTax.transactionTypeCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.policyTaxes = response
          console.log('Policy  Taxes:', this.policyTaxes);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully populated policy taxes')

          // Remove the deleted tax from the policy tax Details array 
          const index = this.filteredPolicyTaxes.findIndex(tax => tax.transactionTypeCode === this.selectedPolicyTax.transactionTypeCode);
          if (index !== -1) {
            this.filteredPolicyTaxes.splice(index, 1);
          }
          // Clear the selected risk
          this.selectedPolicyTax = null;

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to add policy taxes details.Try again later');
        }
      })
  }
  openPolicyTaxEditModal() {
    log.debug("Selected Policy tax", this.selectedPolicyTax)
    if (!this.selectedPolicyTax) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Tax to continue');
    } else {
      document.getElementById("openPolicyTaxModalButtonEdit").click();

    }
  }
  onEditPolicyTax(tax: any) {
    log.debug('SELECTED Tax: ', tax)

    this.selectedPolicyTax = tax;
    this.policyTaxesDetailsForm.patchValue({

      amount: tax.amount,
      // companyLevel:tax.companyLevel,
      rate:tax.taxRate,
      taxRateCode:tax.code,
      taxType: tax.taxType,
      transactionLevel: tax.taxTransactionType



    });

  }
  editPolicyTaxes() {
    this.policyTaxesDetailsForm.get('addOrEdit').setValue("E");
    // this.policyTaxesDetailsForm.get('amount').setValue(this.selectedApplicableTax.taxAmount);
    this.policyTaxesDetailsForm.get('batchNo').setValue(this.batchNo);
    this.policyTaxesDetailsForm.get('companyLevel').setValue("A");
    this.policyTaxesDetailsForm.get('endorsementNumber').setValue(this.policyDetailsData.endorsementNo);
    this.policyTaxesDetailsForm.get('overrideRate').setValue("A");
    this.policyTaxesDetailsForm.get('polBinder').setValue(this.passedBinderCode);
    this.policyTaxesDetailsForm.get('policyNumber').setValue(this.policyDetailsData.policyNo);
    this.policyTaxesDetailsForm.get('proCode').setValue(this.policyDetailsData.product.code);
    // this.policyTaxesDetailsForm.get('rate').setValue(this.selectedApplicableTax.taxRate);
    // this.policyTaxesDetailsForm.get('taxRateCode').setValue(this.selectedApplicableTax.code);
    // this.policyTaxesDetailsForm.get('taxType').setValue(this.selectedApplicableTax.taxType);
    // this.policyTaxesDetailsForm.get('transactionLevel').setValue(this.selectedApplicableTax.taxRateCode);

    const createPolicyTaxesForm = this.policyTaxesDetailsForm.value;
    log.debug("Edit Taxes Form:", createPolicyTaxesForm)


    this.policyService
      .editPolicyTaxes(createPolicyTaxesForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          // this.policyTaxesResponse = response._embedded
          log.debug("Response after Editing  tax:", response)
          log.debug("POLICY TAXES", this.policyTaxes)
          log.debug("APPLICABLE TAXES", this.selectedApplicableTax)

          // this.policyTaxes.push(this.selectedApplicableTax);
          // log.debug("POLICY TAXES after adding", this.policyTaxes)
          // this.closebutton.nativeElement.click();
          this.globalMessagingService.displaySuccessMessage('Success', 'Policy Tax details updated successfully');

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to edit policy taxes details.Try again later');
        }
      });
  }
}
