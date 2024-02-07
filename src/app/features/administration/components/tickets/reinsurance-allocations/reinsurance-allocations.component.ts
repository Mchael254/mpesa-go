import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-reinsurance-allocations',
  templateUrl: './reinsurance-allocations.component.html',
  styleUrls: ['./reinsurance-allocations.component.css']
})
export class ReinsuranceAllocationsComponent implements OnInit {

  public pageSize: 5;
  risKCedingDetails: any;
  treatyRISummaryForm: FormGroup;

  constructor(private fb: FormBuilder,){}

  ngOnInit(): void {
    this.createTreatyRiSummaryForm();
  }

  createTreatyRiSummaryForm() {

    this.treatyRISummaryForm = this.fb.group({
      companyNetPRate: [''],
      companyNetRiAmt: [''],
      companyNetCession: [''],
      companyNetPremium: [''],
      reinsurancePRate: [''],
      reinsuranceRiAmt: [''],
      reinsuranceCession: [''],
      reinsurancePremium: [''],
      treatyPRate: [''],
      treatyRiAmt: [''],
      treatyCession: [''],
      treatyPremium: [''],
      facrePRate: [''],
      facreRiAmt: [''],
      facreCession: [''],
      facrePremium: [''],
      totalRiAmt: [''],
      totalCession: [''],
      totalPremium: [''],
      excessRiAmt: [''],
      excessCession: [''],
      excessPremium: [''],
    });

  }
}
