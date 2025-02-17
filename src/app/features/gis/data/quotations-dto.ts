interface QuotationProduct {
  agentShortDescription: string;
  binder: string;
  code: number;
  commission: number;
  proCode: number;
  productShortDescription: string;
  quotCode: number;
  quotationNo: string;
  revisionNo: number;
  totalSumInsured: number;
  wef: string;
  wet: string;
}

interface SectionDetails {
  calculationGroup: number;
  code: number;
  description: string;
  freeLimit: any;
  limitAmount: number;
  premium: number;
  rate: number;
  rateType: string;
  rowNumber: number;
  sectionShortDescription: string;
}

interface RiskInformation {
  code: number;
  covertypeShortDescription: string;
  covertypecode: number;
  propertyId: string;
  quotationCode: number;
  quotationRiskNo: string;
  scheduleDetails: any;
  sectionDetails: SectionDetails[];
  value: number;
}

interface Source {
  applicableModule: string;
  code: number;
  description: string;
  status: string;
  sumInsured: number;
}

interface TaxInformation {
  amount: number;
  description: number;
  quotationRate: number;
  rateType: string;
}

export interface QuotationsDTO_2 {
  agentCode: number;
  branch: any;
  clientCode: number;
  commissionAmount: number;
  coverFrom: string;
  coverTo: string;
  currency: string;
  dateCreated: string;
  expiryDate: string;
  frequencyOfPayment: string;
  likelihood: string;
  marketerCommissionAmount: any;
  no: string;
  premium: number;
  quotationProduct: QuotationProduct[];
  riskInformation: RiskInformation[];
  source: Source;
  status: string;
  sumInsured: number;
  taxInformation: TaxInformation[];
}

export interface QuotationsDTO {
  /*quotationNumber: string,
  product: string,
  status: string,
  coverFrom: string,
  coverTo: string,
  premium: string*/
  expiry_date: string;
  no: string;
  premium: number;
  quotation_product: [
    {
      code: number;
      product: {
        accept_unique_risks: string;
        accepts_multiple_classes: string;
        allow_accommodation: string;
        allow_motor_class: string;
        allow_open_policy: string;
        allow_same_day_renewal: string;
        are_installment_allowed: string;
        auto_generate_cover_note: string;
        auto_post_reinsurance: string;
        check_schedule: string;
        claim_prefix: string;
        claim_screen_code: string;
        code: number;
        commission_rate: number;
        description: string;
        do_full_remittance: string;
        does_escalation_reduction_apply: string;
        enable_spare_parts: string;
        enable_web: string;
        endorsement_minimum_premium: number;
        expires: string;
        industry_code: number;
        insurance_type: string;
        insured_accumulation_limit: number;
        interface_type: string;
        is_assignment_allowed: string;
        is_default: string;
        is_loan_applicable: string;
        is_marine: string;
        is_pin_required: string;
        is_policy_number_editable: string;
        is_renewable: string;
        maximum_age: number;
        maximum_extensions: number;
        maximum_term: number;
        minimum_age: number;
        minimum_premium: number;
        minimum_sub_classes: number;
        minimum_term: number;
        open_cover: string;
        order: number;
        organization_code: number;
        policy_accumulation_limit: number;
        policy_code_pages: number;
        policy_document_pages: number;
        policy_prefix: string;
        policy_word_document: string;
        prerequisite_product_code: number;
        product_group_code: number;
        product_report_groups_code: number;
        product_type: string;
        prorata_type: string;
        schedule_order: 2;
        short_description: number;
        short_name: string;
        show_fap: string;
        show_on_web_portal: string;
        show_sum_insured: string;
        term_distribution: 2;
        total_company_accumulation_limit: number;
        underwriting_screen_code: string;
        web_details: string;
        with_effect_from: string;
        with_effect_to: string;
        years: number;
      };
    }
  ];
  status: string;
  cover_from: string;
  cover_to: string;
  client_code: number;
}
export interface PolicyData {
  wefDate: string;
  wetDate: string;
  productCode: number;
  binderPolicy: string;
  bindCode: number;
  branchCode: number;
  action: string;
  currencyCode: number;
  currencyRate: number;
  agentCode: number;
  agentShortDescription: string;
  introducerCode: number;
  internalComments: string;
  source: string;
  clientCode: number;
  polPropHoldingCoPrpCode: number;
  chequeRequisition: boolean;
  divisionCode: number;
  polSubAgnCode: number;
  clientType: string;
  quotPrsCode: number;
  polMktrAgnCode: number;
  comments: string;
  gisPolicyNumber: string;
  polPipPfCode: number;
  endorsementStatus: string;
  polEnforceSfParam: string;
  polCrDateNotified: string;
  multiUser: string;
  unitCode: number;
  locationCode: number;
}

export interface QuotationDTO {
  quotationCode: number;
  quotationNo: string;
  policyData: PolicyData[];
  user: string;
  quotStage: string;
}
