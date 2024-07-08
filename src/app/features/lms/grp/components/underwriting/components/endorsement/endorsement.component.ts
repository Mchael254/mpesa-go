import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import stepData from '../../data/steps.json';
import { UnderwritingService } from '../../service/underwriting.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Logger } from 'src/app/shared/services';
import { CategoryDTO, CoinsuranceDetailsDTO, CoverTypesDTO, EndorsementDetailsDTO, PolicyDocumentsDTO } from '../../models/underwriting';
import { ConfirmationService, MessageService } from 'primeng/api';

const log = new Logger("UnderwritingComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-endorsement',
  templateUrl: './endorsement.component.html',
  styleUrls: ['./endorsement.component.css']
})
export class EndorsementComponent implements OnInit, OnDestroy {
  quoteSummary = 'endorsement';
  searchFormMemberDets: FormGroup;
  memberDetailsForm: FormGroup;
  coverDetsForm: FormGroup;
  categoryDetailForm: FormGroup;
  endorsementDetailForm: FormGroup;
  coInsuranceForm: FormGroup;
  quotationCalcType = 'D';
  steps = stepData;
  endorsementCode: number = 20241036;
  categoryCode: number;
  endorsementDetails: EndorsementDetailsDTO;
  policyDocuments: PolicyDocumentsDTO[] = [];
  coverTypes: CoverTypesDTO[] = [];
  coinsuranceDetails: CoinsuranceDetailsDTO[] = [];
  categories: CategoryDTO[] = [];
  isEditMode: boolean =  false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private underwritingService: UnderwritingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.memberDetsForm();
    this.searchFormMember();
    this.coverDetailsForm();
    this.categoryDetailsForm();
    this.endorsementDetailsForm();
    this.CoInsuranceDetailsForm();
    this.getEndorsementDetails();
    this.getPolicyDocuments();
    this.getCoverTypes();
    this.getCoinsurersDetails();
    this.getCategories();

  }

  ngOnDestroy(): void {

  }

  searchFormMember() {
    this.searchFormMemberDets = this.fb.group({
      filterby: [""],
      greaterOrEqual: [""],
      valueEntered: [""],
      searchMember: [""],

    })
  }

  coverDetailsForm() {
    this.coverDetsForm = this.fb.group({
      coverType: [""],
      noOfMembers: [""],
      dependantType: [""],
      overridePremiums: [""],
      averageEarning: [""],
      averageAnb: [""],
      sumAssured: [""],
      loading: [""],
      rate: [""],
      rateDivFactor: [""],
    });
  }

  categoryDetailsForm() {
    this.categoryDetailForm = this.fb.group({
      description: ["", [Validators.required]],
      premiumMask: ["", [Validators.required]],
      shortDescription: ["", [Validators.required]],
      multiplesOfEarnings: ["", [Validators.required]],
    });
  }

  endorsementDetailsForm() {
    this.endorsementDetailForm = this.fb.group({
      intermediary: ["", [Validators.required]],
      effctiveDate: ["", [Validators.required]],
      paymentFrequency: ["", [Validators.required]],
      mask: ["", [Validators.required]],
      durationType: ["", [Validators.required]],
      facultativeType: ["", [Validators.required]],
    });
  }

  memberDetsForm() {
    this.memberDetailsForm = this.fb.group({
      surname: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      mainMemberNumber: ["", Validators.required],
      category: ["", Validators.required],
      monthlyEarning: ["", Validators.required],
      otherNames: ["", Validators.required],
      gender: ["", Validators.required],
      payrollNumber: ["", Validators.required],
      occupation: ["", Validators.required],
      dependantType: ["", Validators.required],
      joiningDate: ["", Validators.required],
      coverType: ["", Validators.required],
      rate: ["", Validators.required],
      rateDivFactor: ["", Validators.required],
      loadingReason: ["", Validators.required],
    });
  }

  CoInsuranceDetailsForm() {
    this.coInsuranceForm = this.fb.group({
      conInsurer: [''],
      coInsuranceShare: [''],
      serviceCharge: [''],
      leaderFollower: ['']
    })
  }

  addMemberDetailsModal() {
    const modal = document.getElementById('addMemberModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeAddMemberDetailsModal() {
    const modal = document.getElementById('addMemberModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

  showDetailedCoverDetailsModal() {
    const modal = document.getElementById('detailedModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeDetailedModal() {
    const modal = document.getElementById('detailedModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  showCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  showEditCatDetailsModal(categories) {
    this.isEditMode = true;
    this.categoryCode = categories["policy-category-code"];
    log.info("categoriesToEdit", categories, this.categoryCode)
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    if (categories) {
      this.categoryDetailForm.patchValue({
        description: categories.category_category,
        shortDescription: categories.short_description,
        premiumMask: categories.pmas_sht_desc,
        multiplesOfEarnings: categories.period,
      });
    }
  }

  closeCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

  showCoInsurerModal() {
    const modal = document.getElementById('coInsurerModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeCoInsurerModal() {
    const modal = document.getElementById('coInsurerModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  showEndorsementDetsModal() {
    const modal = document.getElementById('endorsementDetsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeEndorsementDetsModalModal() {
    const modal = document.getElementById('endorsementDetsModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  openFileInput() {

  }

  downloadMemberUploadTemplate() {
    // this.spinner_Service.show('download_view');
    // this.coverageService.downloadMemberUploadTemplate(this.productType, this.productCode).subscribe((data: any) =>{
    //   const blob = new Blob([data], { type: 'application/octet-stream' });
    //   const blobUrl = window.URL.createObjectURL(blob);

    //   const anchor = document.createElement('a');
    //   anchor.style.display = 'none';
    //   anchor.href = blobUrl;
    //   anchor.download = 'downloaded-file.csv';

    //   document.body.appendChild(anchor);
    //   anchor.click();
    //   document.body.removeChild(anchor);

    //   window.URL.revokeObjectURL(blobUrl);
    //   this.spinner_Service.hide('download_view');
    //   this.messageService.add({severity: 'success', summary: 'summary', detail: 'Downloaded'});
    // },
    // (error) => {
    //   console.log(error)
    //   this.spinner_Service.hide('download_view');
    //   this.messageService.add({severity: 'error', summary: 'summary', detail: 'Not downloaded'});
    // }
    // );
  }

  onProceed() {
    this.router.navigate(['/home/lms/grp/underwriting/summary']);
  }

  onBack() {
    this.router.navigate(['/home/lms/grp/underwriting/underwriting']);
  }

  getEndorsementDetails() {
    this.underwritingService.getEndorsementDetails(this.endorsementCode).subscribe((res: EndorsementDetailsDTO) =>{
      this.endorsementDetails =  res;
      log.info("getEndorsementDetails", this.endorsementDetails)
    });
  }

  updateEndorsementDetails() {}

  getPolicyDocuments() {
    this.underwritingService.getPolicyDocuments(this.endorsementCode).subscribe((res: PolicyDocumentsDTO[]) => {
      this.policyDocuments = res;
      log.info("getPolicyDocuments", this.policyDocuments)
    })
  }

  getCoverTypes() {
    this.underwritingService.getCoverTypes(this.endorsementCode).subscribe((res: CoverTypesDTO[]) => {
      this.coverTypes = res;
      log.info("getCoverTypes", this.coverTypes)
    });
  }

  saveCoverType() {

  }

  updateCoverType() {

  }

  getCoinsurersDetails() {
    this.underwritingService.getCoinsurersDetails(this.endorsementCode).subscribe((res: CoinsuranceDetailsDTO[]) => {
      this.coinsuranceDetails =  res;
      log.info("getCoinsuranceDetails", this.coinsuranceDetails)
    });
  }

  getCoinsurersList() {
    this.underwritingService.getCoinsurersList(this.endorsementCode).subscribe((res) => {
      log.info("getCoinsurersList", res)
    });
  }

  saveCoinsure() {

  }

  deleteCoinsurer() {

  }

  getCategories() {
    this.underwritingService.getCategories(this.endorsementCode).subscribe((res: CategoryDTO[]) => {
      this.categories = res;
      log.info("getCategories", this.categories)
    });
  }

  onSaveCatDets() {
    const catDets = this.categoryDetailForm.value;
    const catDetCaptured = {
      category_category : catDets.description,
      short_description : catDets.shortDescription,
      pmas_sht_desc : catDets.premiumMask,
      period : catDets.multiplesOfEarnings,
    }

    this.underwritingService.saveCategory(catDetCaptured).subscribe((res) => {
      log.info("catDetCaptured", catDetCaptured)
    });
  }

  updateCategory() {
    const catDets = this.categoryDetailForm.value;
    const newCatDetCaptured = {
      category_category : catDets.description,
      short_description : catDets.shortDescription,
      pmas_sht_desc : catDets.premiumMask,
      period : catDets.multiplesOfEarnings,
    }
    log.info("about to update category", newCatDetCaptured)
    this.underwritingService.updateCategory(this.categoryCode, newCatDetCaptured).subscribe((res) => {
      log.info("about to update category", res)
      this.getCategories();
    })
  }

  deleteCategory(categories, event: Event) {
    this.categoryCode = categories["policy-category-code"];

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to Delete this Category?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.underwritingService.deletCategory(this.categoryCode).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category deleted'
          });
          this.getCategories();
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Cancelled', life: 3000 });
      }
    });
  }

 }
