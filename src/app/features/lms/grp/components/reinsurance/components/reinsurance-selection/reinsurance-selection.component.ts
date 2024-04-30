import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import stepData from '../../data/steps.json';
import { ReinsuranceService } from '../../service/reinsurance.service';
import { PolicySummaryDTO, ReinsuranceParametersDTO, TreatyDTO } from '../../models/policySummaryDTO';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AutoUnsubscribe} from "../../../../../../../shared/services/AutoUnsubscribe";

@AutoUnsubscribe
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
  // endorsementCode = 20231683127
  endorsementCode = 20231683286
  productCode = 2021675
  policyCode = 20231454213
  // endorsementCode: number;
  // productCode: number;
  // policyCode: number;
  currencySymbol = 'MWK'
  underwriting_year = 2023;
  policySummary: PolicySummaryDTO[] = [];
  treaty: TreatyDTO[];
  reinsuranceParams: ReinsuranceParametersDTO[]
  treatyForm: FormGroup;
  taCode: number;
  transactionNumber: number;
  policyNumber: string;

  constructor (
    private router: Router,
    private reinsurancService: ReinsuranceService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.tryatyForm();
    this.getPolicySummary();
    this.getTreaty();
    this.getReinsuranceParameters();
    this.getParams();
    this.reinsuranceParamsColumns();
    this.getSelectedTraety();
  }

  ngOnDestroy(): void {

  }

  proceed() {
    const populateTreatiesData = {
      taCode: this.taCode,
      transactionNumber: this.transactionNumber,
      endorsementCode: this.endorsementCode,
      facultative: "N",
      fac_rate_type: "PR",
      pmas_code: 2021492,
      policy_code: this.policyCode
    };

    this.reinsurancService.postTreaties(populateTreatiesData).subscribe((treaties) => {
      console.log("populatedTreaties", treaties )
    })
    this.router.navigate(['/home/lms/grp/reinsurance/summary'])
  }

  tryatyForm() {
    this.treatyForm = this.fb.group({
      treaty: [''],
    })
  }

  getParams() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.policyCode = queryParams['policyCode'];
      this.endorsementCode = queryParams['endorsementCode'];
      this.productCode = queryParams['productCode'];
      console.log('ReinsurancepolicyFromRoute', this.policyCode, this.endorsementCode, this.productCode )
    });
  }

  reinsuranceParamsColumns() {
    this.columnOptions = [
      { label: 'Cover type name', value: 'cvt_desc' },
      { label: 'Retention limit', value: 'use_cvr_rate' },
      { label: 'Ceding limit', value: 'atct_limit' },
      { label: 'Cede rate', value: 'atct_cede_rate' },
      { label: 'Rate type', value: 'rate_type' },
      { label: 'Commission rate', value: 'tacr_comm_rate' },
      { label: 'Division factor', value: 'tacr_comm_div_factr' },
  ];

  this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  getPolicySummary() {
    this.reinsurancService.getPolicySummary(this.policyCode, this.productCode, this.endorsementCode)
    .subscribe((resinurancePolSummary: PolicySummaryDTO[]) => {
      console.log('reinsurance policy summary', resinurancePolSummary);
      this.policySummary = resinurancePolSummary;
      this. transactionNumber = this.policySummary[0].transaction_number;
      console.log('transactionNumber', this.transactionNumber)
    })
  }

  getTreaty() {
    this.reinsurancService.getTreatySelection().subscribe((treaty: TreatyDTO[]) => {
      console.log('Treaty', treaty);
      this.treaty = treaty;
    })
  }

  getSelectedTraety() {
    this.treatyForm.get('treaty').valueChanges.subscribe((selectedTreaty) => {
      this.taCode = selectedTreaty;
      console.log('selected Treaty TA_CODE', this.taCode);
    })
  }

  getReinsuranceParameters() {
    this.reinsurancService.getReinsuranceParameters(this.productCode, this.underwriting_year).subscribe((reinsuranceParams: ReinsuranceParametersDTO[]) => {
      console.log("ReinsnuranceParameters", reinsuranceParams)
      this.reinsuranceParams = reinsuranceParams;
    })
  }

}
