import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'

const log = new Logger("RiskDetailsComponent");

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.css']
})
export class RiskDetailsComponent {
  policyRiskForm: FormGroup;
  show: boolean = true;
  isNcdApplicable: boolean = false;
  isCashApplicable: boolean = false;


  constructor(
    public fb: FormBuilder,

  ) {

  }

  ngOnInit(): void {
    this.createPolicyRiskForm();
  }
  ngOnDestroy(): void { }

  createPolicyRiskForm() {
    this.policyRiskForm = this.fb.group({

      allowed_commission_rate: [''],
      basic_premium:[''],
      binder_code: [''],
      commission_amount: [''],
      commission_rate: [''],
      cover_type_code: [''],
      cover_type_short_description: [''],
      currency_code: [''],
      date_cover_from: [''],
      date_cover_to: [''],
      del_sect: [''],
      gross_premium: [''],
      insureds: this.fb.group({
        client: this.fb.group({
          first_name: [''],
          id: [''],
          last_name: ['']
        }),
        prp_code:[''],
      }),
      ipu_ncd_cert_no: [''],
      loaded: [''],
      lta_commission: [''],
      net_premium: [''],
      paid_premium: [''],
      policy_batch_no: [''],
      policy_number: [''],
      policy_status: [''],
      product_code: [''],
      property_description: [''],
      property_id: [''],
      quantity: [''],
      reinsurance_endorsement_number: [''],
      renewal_area: [''],
      risk_fp_override:[''],
      risk_ipu_code: [''],
      sections: this.fb.array([
        this.fb.group({
          div_factor: [0],
          free_limit: [0],
          limit_amount: [0],
          multiplier_rate: [0],
          pil_prem_rate: [0],
          premium: [0],
          rate_type: [''],
          sect_code: [0],
          sect_ipu_code: [0],
          section_code: [0],
          section_desc: [''],
          section_short_desc: ['']
        })
      ]),
      stamp_duty: [''],
      sub_class_code:[''],
      sub_class_description: [''],
      transaction_type: [''],
      underwriting_year: [''],
      value: [''],
    });
  }
  toggleNcdApplicableFields(checked: boolean) {
    this.isNcdApplicable = checked;
  }
  toggleCashApplicableField(checked: boolean) {
    this.isCashApplicable = checked;
  }
}
