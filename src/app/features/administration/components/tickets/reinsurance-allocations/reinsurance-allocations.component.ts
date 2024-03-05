import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReinsuranceService} from "../../../../gis/reinsurance/reinsurance.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {
  PolicyFacreSetupsDTO,
  PreviousCedingDTO, ReinsuranceRiskDetailsDTO,
  RiskReinsuranceRiskDetailsDTO, RiskReinsurePOSTDTO
} from "../../../../gis/data/reinsurance-dto";
import {Logger} from "../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {SubclassesService} from "../../../../gis/components/setups/services/subclasses/subclasses.service";
import {Subclasses} from "../../../../gis/components/setups/data/gisDTO";
import {AgentDTO} from "../../../../entities/data/AgentDTO";
import {IntermediaryService} from "../../../../entities/services/intermediary/intermediary.service";

const log = new Logger('ReinsuranceAllocationsComponent');
@Component({
  selector: 'app-reinsurance-allocations',
  templateUrl: './reinsurance-allocations.component.html',
  styleUrls: ['./reinsurance-allocations.component.css']
})
export class ReinsuranceAllocationsComponent implements OnInit {

  @Input() riskDetails:any [] = [];
  public pageSize: 5;
  risKCedingDetails: any;
  treatyRISummaryForm: FormGroup;

  previousCedingData: PreviousCedingDTO[] = [];
  treatyParticipantData: any[];
  treatySetupsData: Pagination<any> =  <Pagination<any>>{};
  riskReinsuranceRiskDetailsData: RiskReinsuranceRiskDetailsDTO[] = [];
  riskReinsuranceDetails: any[];
  reinsuranceRiskDetailsData: Pagination<ReinsuranceRiskDetailsDTO> = <Pagination<ReinsuranceRiskDetailsDTO>>{};
  reinsuranceFacreCedingData: any[];
  reinsurancePoolData: any[];
  reinsuranceXolPremiumData: any[];
  reXolPremiumParticipantData: any[];
  treatyCessionsData: Pagination<ReinsuranceRiskDetailsDTO> = <Pagination<ReinsuranceRiskDetailsDTO>>{};
  previousFacreCedingData: any[];
  policyFacreSetupsData: Pagination<PolicyFacreSetupsDTO> = <Pagination<PolicyFacreSetupsDTO>>{};

  subclassData: Subclasses;
  intermediaryData: AgentDTO;
  prrdCode: number;
  prrdTranNo: number;
  riskCode: any[];

  currencyCode: any;
  UWYear: any;
  subClassCode: any;

  risksForm:FormGroup;
  reinsureRiskPOSTData: any;

  constructor(private fb: FormBuilder,
              private reinsuranceService: ReinsuranceService,
              private globalMessagingService: GlobalMessagingService,
              private subclassService: SubclassesService,
              private intermediaryService: IntermediaryService, ){}

  ngOnInit(): void {
    this.createTreatyRiSummaryForm();
    this.createRiskPopulateForm();
    this.getRiskReinsuranceRiskDetails();
    log.info('riskinfo', this.riskDetails);

  }

  /**
   * The function creates a form group for a treaty reinsurance summary.
   */
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

  /**
   * The function creates a form group for managing risks.
   */
  createRiskPopulateForm() {

    this.risksForm = this.fb.group({
      risk: [''],
    });
  }

  /**
   * The function `getTreatyParticipant` retrieves treaty participant data using a code from reinsurance risk details.
   */
  getTreatyParticipant() {
    this.reinsuranceService.getTreatyParticipant(this.reinsuranceRiskDetailsData?.content[0]?.code)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.treatyParticipantData = data;
          log.info('treatyParticipant>>', this.treatyParticipantData);
        }
      )
  }


  //populates risk on left card
  /**
   * This function retrieves risk details for reinsurance based on the policy batch number from the first element in the
   * risk details array.
   */
  getRiskReinsuranceRiskDetails() {
    // this.policyDetails[0].policyBatchNo
    this.reinsuranceService.getRiskReinsuranceRiskDetails(this.riskDetails[0]?.policyBatchNo)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.riskReinsuranceRiskDetailsData = data;
          log.info('RiskReinsuranceRiskDetails>>', this.riskReinsuranceRiskDetailsData)
        }
      )
  }

  /**
   * The function `getRiskReinsuranceDetails` retrieves reinsurance details for a specific risk code and updates the form
   * with the retrieved data.
   */
  getRiskReinsuranceDetails() {
    this.reinsuranceService.getRiskReinsurance('Y', this?.riskCode[0])
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.riskReinsuranceDetails = data;
          log.info('riskReinsuranceDetails>>', this.riskReinsuranceDetails)
          let details = data[0];

          this.prrdCode = details?.prrdCode;
          this.prrdTranNo = details?.prrdTranNo;
          const subclassCode = details?.sclCode;

          this.getSubclasses(subclassCode);

          log.info('content>>',details)

          let inp = {
            "companyNetPRate":details['prrdPrevRetRate'],
            "companyNetRiAmt": this.numberWithCommas(details['prrdGrossCompRetention']),
            "companyNetCession": details['prrdCompNetRate'],
            "companyNetPremium": this.numberWithCommas(details['prrdNetPrem']),
            "reinsurancePRate": details['riPoolPrevRate'],
            "reinsuranceRiAmt": details['riPool'],
            "reinsuranceCession": details['riPoolRate'],
            "reinsurancePremium": details['riPoolPrem'],
            "treatyPRate": details['prevTreatyRate'],
            "treatyRiAmt": details['trtsSi'],
            "treatyCession": details['trtsPct'],
            "treatyPremium": details['trtsPrem'],
            "facrePRate": details['prrdPrevFacreRate'],
            "facreRiAmt": this.numberWithCommas(details['prrdFacreAmount']),
            "facreCession": this.numberWithCommas(details['prrdFacreRate']),
            "facrePremium": details['prrdFacrePremium'],
            "totalRiAmt": details['totCededSi'],
            "totalCession": details['totPct'],
            "totalPremium": details['totCededPrem'],
            "excessRiAmt": details['prrdAvailFulcBal'],
            "excessCession": details['prrdExcessPct'],
            "excessPremium": details['excessPrem'],

          };
          log.info('content patched>>',inp)
          // details = {...details, ...inp};

          this.treatyRISummaryForm.patchValue(inp);
        }
      )
  }

  /**
   * The function numberWithCommas adds commas to a number for better readability.
   * @param x - The parameter `x` in the `numberWithCommas` function is the number that you want to format by adding commas
   * as thousand separators.
   * @returns The function `numberWithCommas(x)` takes a number `x`, converts it to a string, and then adds commas as
   * thousand separators. The regular expression `/\B(?=(\d{3})+(?!\d))/g` is used to match every group of three digits
   * that are not followed by another digit. The function returns the number `x` with commas added as thousand separators
   */
  public numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * This function retrieves reinsurance risk details for a given code and stores the data in the component.
   */
  getReinsuranceRiskDetails(code:any) {
    this.reinsuranceService.getReinsuranceRiskDetails(code)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data:any) => {

          data.content.forEach( riskReinsurance => {
            this.currencyCode = riskReinsurance.treatyCurrencyCode;
            this.UWYear = riskReinsurance.underwritingYear;
            this.subClassCode = riskReinsurance.subclassCode;
          });
          this.reinsuranceRiskDetailsData = data;

          log.info('ReinsuranceRiskDetail>>', this.reinsuranceRiskDetailsData, this.currencyCode)

        }
      )
  }

  /**
   * The function `getReinsuranceFacreCeding` retrieves reinsurance facre ceding data and logs it.
   */
  getReinsuranceFacreCeding() {
    this.reinsuranceService.getReinsuranceFacreCeding(this.prrdCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.reinsuranceFacreCedingData = data;
          if (this.reinsuranceFacreCedingData !== null && this.reinsuranceFacreCedingData.length > 0) {
            let intermediaryDetails = data[0];
            this.getIntermediaryId(intermediaryDetails?.intermediaryCode);
          }

          log.info('ReinsuranceFacreCeding>>', this.reinsuranceFacreCedingData)
        }
      )
  }

  /**
   * The `getReinsurancePool` function retrieves reinsurance pool data using the `reinsuranceService` and logs the data.
   */
  getReinsurancePool() {
    this.reinsuranceService.getReinsurancePool(this.riskCode[0], this.prrdTranNo)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.reinsurancePoolData = data;
          log.info('ReinsurancePool>>', this.reinsurancePoolData)
        }
      )
  }

  /**
   * The function `getReinsuranceXolPremium` retrieves reinsurance excess of loss (XOL) premium data for a specific PRRD
   * code and risk code.
   */
  getReinsuranceXolPremium() {
    this.reinsuranceService.getReinsuranceXolPremium(this.prrdCode, this.riskCode[0])
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.reinsuranceXolPremiumData = data;
          log.info('ReinsuranceXOLPremium>>', this.reinsuranceXolPremiumData)
        }
      )
  }

  /**
   * The function `getReinsuranceXolPremiumParticipants` retrieves reinsurance XOL premium participants data and logs it.
   */
  getReinsuranceXolPremiumParticipants() {
    this.reinsuranceService.getReinsuranceXolPremiumParticipants(this.prrdCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.reXolPremiumParticipantData = data;
          log.info('ReinsuranceXOLPremium>>', this.reXolPremiumParticipantData)
        }
      )
  }

  /**
   * The function `getPreviousCeding` retrieves previous ceding data for a specific risk code using a service call
   */
  getPreviousCeding() {
    this.reinsuranceService.getPreviousCeding(this.riskCode[0])
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.previousCedingData = data;
          log.info('previousCeding>>', this.previousCedingData);
        }
      )
  }

  /**
   * The `getTreatyCessions` function retrieves reinsurance risk details for a specific code and assigns the data to
   * `treatyCessionsData`.
   */
  getTreatyCessions() {
    this.reinsuranceService.getReinsuranceRiskDetails(this.prrdCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.treatyCessionsData = data;
          log.info('treatyCessionsData>>', this.treatyCessionsData)
        }
      )
  }

  /**
   * The function `getPreviousFacreCeding` retrieves reinsurance facre ceding data for a specific code and logs the result.
   */
  getPreviousFacreCeding() {
    this.reinsuranceService.getReinsuranceFacreCeding(this.prrdCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.previousFacreCedingData = data;
          log.info('previousFacreCedingData>>', this.previousFacreCedingData)
        }
      )
  }

  /**
   * The function retrieves treaty setups data using the reinsurance service.
   */
  getTreatySetups() {
    this.reinsuranceService.getTreatySetups(this.currencyCode,
      this.UWYear, this.subClassCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.treatySetupsData = data;
          log.info('treatySetups>>', this.treatySetupsData)
        }
      )
  }

  /**
   * The function `getPolicyFacreSetups` retrieves policy facre setups data using a service call and assigns the data to a
   * class property.
   */
  getPolicyFacreSetups() {
    this.reinsuranceService.getPolicyFacreSetups(this.riskDetails[0].policyBatchNo)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.policyFacreSetupsData = data;
          log.info('policyFacreSetups>>', this.policyFacreSetupsData)
        }
      )
  }

  /**
   * The function `populateAllocations` filters selected risk data, displays an error message if no risk is selected, sends
   * a payload to a service, and displays success messages upon completion.
   * @returns If the `riskSelected` array is empty (i.e., if no risk is selected), an error message is displayed using
   * `globalMessagingService.displayErrorMessage()` and the function returns without further processing. If risks are
   * selected, the function proceeds to populate allocations by calling `reinsuranceService.populateTreaties(payload)` with
   * the selected risk codes and then displays a success message using `globalMessagingService.display
   */
  populateAllocations() {

    let riskSelected = this.riskReinsuranceRiskDetailsData.filter(data => data['checked'] === true);
    const riskCodes = riskSelected.map(data=> data.code);
    if (riskSelected.length === 0) {
      this.globalMessagingService.displayErrorMessage('Error', 'Please select a risk');
      return;
    }
    //pass the risk code selected to this.riskCode
    this.riskCode = riskCodes;
    const payload: any = {
      batchNumber: this.riskDetails[0]?.policyBatchNo,
      riskIpuCodes:
        riskCodes
    }
    log.info("risk selected>>", payload);

    this.reinsuranceService.populateTreaties(payload)
      .subscribe((data) => {
        log.info("risk selected output>>", data);

        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully populated');
        this.getRiskReinsuranceDetails();
        this.getPreviousCeding();
      })
  }

  /**
   * The function `selectRiskDetails` updates the `checked` property of a specific risk object in an array based on a
   * matching code and then calls `populateAllocations`.
   * @param {any} risk - The `selectRiskDetails` function takes a `risk` parameter as input. This function logs the `risk`
   * information, then updates the `riskReinsuranceRiskDetailsData` array by toggling the `checked` property of the element
   * with a matching `code` value from the `risk`
   */
  selectRiskDetails(risk:any)
  {
    log.info("risk>>", risk);
    this.riskReinsuranceRiskDetailsData = this.riskReinsuranceRiskDetailsData.map(data =>{
      if(data?.code ===risk?.code){
        data['checked'] = !!!risk['checked'];
        return data;
      }
      return data;
    })
    this.populateAllocations()
  }

  /**
   * The function `selectTreatyRiskCeding` logs information about a selected risk and then retrieves reinsurance risk
   * details based on a specific code.
   */
  selectTreatyRiskCeding(treatyRiskCeding: any) {
    log.info("risk selected output>>", treatyRiskCeding);
    this.getReinsuranceRiskDetails(treatyRiskCeding?.prrdCode);
  }

  /**
   * The function selectPreviousCedingDetails logs the selected previous ceding details and then calls several other
   * functions to retrieve additional data.
   * @param {any} previousCeding - The `selectPreviousCedingDetails` function takes a parameter `previousCeding` of type
   * `any`. When this function is called, it logs the message "previous ceding selected output>>" along with the value of
   * `previousCeding`. It then calls four other functions:
   */
  selectPreviousCedingDetails(previousCeding: any) {
    log.info("previous ceding selected output>>", previousCeding);
    this.getTreatyCessions();
    this.getPreviousFacreCeding();
    this.getPolicyFacreSetups();
    this.getTreatySetups();
  }

  /**
   * The function `selectRiskRiSummary` logs information and calls several other functions related to treaty reinsurance.
   */
  selectRiskRiSummary(treatyRISummary: any) {
    log.info("treaty RI selected output>>", treatyRISummary);
    this.getTreatyParticipant();
    this.getReinsuranceFacreCeding();
    this.getReinsurancePool();
    this.getReinsuranceXolPremium();
    this.getReinsuranceXolPremiumParticipants();

  }

  /**
   * The function `getSubclasses` retrieves subclass data using a service and logs the description of the data.
   */
  getSubclasses(code: any) {
    this.subclassService.getSubclasses(code)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.subclassData = data;
          log.info('subclass>>', this.subclassData.description)
        }
      )
  }

  /**
   * The function `getIntermediaryId` retrieves intermediary data by calling a service method and subscribing to the
   * response.
   */
  getIntermediaryId(code: any) {
    this.intermediaryService.getAgentById(code)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.intermediaryData = data;
          log.info('intermediary>>', this.intermediaryData.name)
        }
      )
  }

  /**
   * The function `reinsureRisk` retrieves the policy batch number, prepares an empty array for risk reinsurance data, and
   * then calls a service to reinsure the risk with the provided data.
   */
  reinsureRisk() {
    const batchNo = this.riskDetails[0].policyBatchNo;
    const reinsureRiskData: RiskReinsurePOSTDTO[] = []
      /*{
      allowed_commission_rate: null,
      basic_premium: null,
      binder_code: null,
      commission_amount: null,
      commission_rate: null,
      cover_type_code: null,
      cover_type_short_description: "",
      currency_code: null,
      date_cover_from: "",
      date_cover_to: "",
      del_sect: "",
      gross_premium: null,
      insureds: {client: {first_name: "", id: null, last_name: ""}, prp_code: null},
      ipu_ncd_cert_no: "",
      loaded: "",
      lta_commission: null,
      net_premium: null,
      paid_premium: null,
      policy_batch_no: null,
      policy_number: "",
      policy_status: "",
      product_code: null,
      property_description: "",
      property_id: "",
      quantity: null,
      reinsurance_endorsement_number: "",
      renewal_area: "",
      risk_ipu_code: null,
      sections_details: [],
      stamp_duty: null,
      sub_class_code: null,
      sub_class_description: "",
      transaction_type: "",
      underwriting_year: null,
      value: null

    };*/

    this.reinsuranceService.reinsureRisk(batchNo, reinsureRiskData)
      .subscribe((data) => {
        this.reinsureRiskPOSTData = data;
        log.info('reinsure clicked>>', data);
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully reinsured');

      })
  }

  ngOnDestroy(): void {
  }
}
