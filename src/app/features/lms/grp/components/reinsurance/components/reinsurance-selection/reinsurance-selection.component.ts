import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import stepData from '../../data/steps.json';
import { ReinsuranceService } from '../../service/reinsurance.service';
import { PolicySummaryDTO, TreatyDTO } from '../../models/policySummaryDTO';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reinsurance-selection',
  templateUrl: './reinsurance-selection.component.html',
  styleUrls: ['./reinsurance-selection.component.css']
})
export class ReinsuranceSelectionComponent implements OnInit, OnDestroy{
  label= "label";
  columnOptions: SelectItem[];
  selectedColumns: string[];
  steps = stepData;
  endorsementCode = 20231683127
  productCode = 2021675
  policyCode = 20231454213
  currencySymbol = 'MWK'
  policySummary: PolicySummaryDTO[] = [];
  treaty: TreatyDTO[];
  treatyForm: FormGroup

  constructor (
    private router: Router,
    private reinsurancService: ReinsuranceService,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.tryatyForm()
    this.getPolicySummary()
    this.getTreaty()
  }

  ngOnDestroy(): void {
    
  }

  proceed() {
    this.router.navigate(['/home/lms/grp/reinsurance/summary'])
  }

  tryatyForm() {
    this.treatyForm = this.fb.group({
      treaty: [''],
    })
  }

  getPolicySummary() {
    this.reinsurancService.getPolicySummary(this.policyCode, this.productCode, this.endorsementCode)
    .subscribe((resinurancePolSummary: PolicySummaryDTO[]) => {
      console.log('reinsurance policy summary', resinurancePolSummary);
      this.policySummary = resinurancePolSummary;
    })
  }

  getTreaty() {
    this.reinsurancService.getTreatySelection().subscribe((treaty: TreatyDTO[]) => {
      console.log('Treaty', treaty);
      this.treaty = treaty;
    })
  }

}
