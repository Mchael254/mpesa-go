import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-endorsement',
  templateUrl: './endorsement.component.html',
  styleUrls: ['./endorsement.component.css']
})
export class EndorsementComponent implements OnInit, OnDestroy {
  quoteSummary = 'endorsement';
  searchFormMemberDets: FormGroup;
  memberDetailsForm: FormGroup;
  detailedCovDetsForm: FormGroup;
  categoryDetailForm: FormGroup;
  quotationCalcType = 'D';

  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.memberDetsForm();
    this.searchFormMember();
    this.detailedCoverDetails();
    this.categoryDetailsForm();

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

  detailedCoverDetails() {
    this.detailedCovDetsForm = this.fb.group({
      detailedCoverType: [""],
      detailedPercentageMainYr: [""],
      rate: [""],
      selectRate: [""],
      premiumMask: [""],
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
    this.router.navigate(['/home/lms/grp/policy/summary']);
  }

  onBack() {
    this.router.navigate(['/home/lms/grp/policy/underwriting']);
  }
}
