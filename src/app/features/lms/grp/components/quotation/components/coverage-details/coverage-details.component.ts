import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coverage-details',
  templateUrl: './coverage-details.component.html',
  styleUrls: ['./coverage-details.component.css']
})
export class CoverageDetailsComponent implements OnInit, OnDestroy {

  public searchFormMemberDets: FormGroup;
  constructor (
    private fb: FormBuilder,
    private router: Router
    ) {}

    public clients = [
      { label: 'Client 1', value: 'client1' },
      { label: 'Client 2', value: 'client2' },
      { label: 'Client 3', value: 'client3' },
      { label: 'Client 10', value: 'client10' },
      { label: 'Client 15', value: 'client15' },
    ];

    public products = [
      {label: ' Britam Individual', value: 'britam'},
      {label: ' Defined Contribution', value: 'defined'},
      {label: ' Gratuity Fund', value: 'gratuity'},
      {label: ' Minor Trust', value: 'minor'},
      {label: ' Group Mortgage Foundation', value: 'mortgage'},
    ];

    public durationType = [
      {label: ' Annual', value: 'annual'},
      {label: ' Semi annual', value: 'semiAnnual'},
      {label: ' Quarterly', value: 'quarterly'},
      {label: ' Monthly', value: 'monthly'},
      {label: ' Termly', value: 'termly'},
      {label: ' Open', value: 'open'},
    ];

    public facultativeType = [
      {label: ' inward', value: 'inward'},
      {label: ' Outward', value: 'outward'},
      {label: ' Normal', value: 'normal'},
    ];

    public quotationCovers = [
      {label: ' Self', value: 'self'},
      {label: ' Self and dependants', value: 'selfDependant'},
      {label: ' Self and joint member', value: 'selfJoint'},
      {label: ' Self and member', value: 'selfMember'},
    ];

    public frequencyOfPayment = [
      {label: ' Annual', value: 'annual'},
      {label: ' Semi annual', value: 'semiAnnual'},
      {label: ' Quarterly', value: 'quarterly'},
      {label: ' Monthly', value: 'monthly'},
      {label: ' Termly', value: 'termly'},
    ];

    public unitRateOption = [
      {label: ' Weighed age', value: 'weighedAge'},
      {label: ' Single age', value: 'singleAge'},
      {label: ' Average age', value: 'averageAge'},
      {label: ' Others', value: 'others'},
    ];

    public currency = [
      {label: ' Ksh', value: 'ksh'},
      {label: ' Naira', value: 'naira'},
      {label: ' USD', value: 'usd'},
      {label: ' EURO', value: 'euro'},
      {label: ' Ugsh', value: 'ugsh'},
      {label: ' Tzsh', value: 'tzsh'},
      {label: ' Peso', value: 'peso'},
      {label: ' Real', value: 'real'},
    ];

    public quotationCalcType = [
      {label: ' Detailed', value: 'detailed'},
      {label: ' Aggregate', value: 'aggregate'},
    ];

ngOnInit(): void {
  this.searchFormMember();
  
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
  detailedCovDetsForm = this.fb.group({
    detailedCoverType: [""],
    overridePremiums: [""],
    detailedPercentageMainYr: [""],
    rate: [""],
    selectRate: [""],
    premiumMask: [""],
    rateDivFactor: [""],
  });

  aggregateForm = this.fb.group({
    aggregateCoverType: [""],
    aggrgatePremiumMask: [""],
    aggregatePercentageMainYr: [""],
    noOfMembers: [""],
    category: [""],
    aggregateSelectRate: [""],
    rate: [""],
    dependantType: [""],
    averageEarningPerMember: [""],
    overridePremiums: [""],
    rateDivFactor: [""],
    averageAnb: [""],
    sumAssured: [""],

  });

  categoryDetailsForm = this.fb.group({
    description: ["", [Validators.required]],
    premiumMask: ["", [Validators.required]],
    shortDescription: ["", [Validators.required]],
    multiplesOfEarnings: ["", [Validators.required]],
  });

  memberDetailsForm = this.fb.group({
    surname: [""],
    dateOfBirth: [""],
    mainMemberNumber: [""],
    category: [""],
    monthlyEarning: [""],
    otherNames: [""],
    gender: [""],
    payrollNumber: [""],
    dependantType: [""],
    joiningDate: [""],
  });

  showDetailedCoverDetailsModal() {
    const modal = document.getElementById('detailedModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  showAggregateCoverDetailsModal() {
    const modal = document.getElementById('aggregateModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  showCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  addMemberDetailsModal() {
    const modal = document.getElementById('addMemberModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  openFileInput() {

  }

  closeDetailedModal() {
    const modal = document.getElementById('detailedModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  closeAggregateCoverDetailsModal() {
    const modal = document.getElementById('aggregateModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

  closeCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }
  closeAddMemberDetailsModal() {
    const modal = document.getElementById('addMemberModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

  onProceed () {
    this.router.navigate(['/quick']);
  }

}
