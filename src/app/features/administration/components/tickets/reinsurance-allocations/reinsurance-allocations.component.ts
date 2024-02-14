import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReinsuranceService} from "../../../../gis/reinsurance/reinsurance.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {
  PolicyFacreSetupsDTO,
  PreviousCedingDTO, ReinsuranceRiskDetailsDTO,
  RiskReinsuranceRiskDetailsDTO
} from "../../../../gis/data/reinsurance-dto";
import {Logger} from "../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {SubclassesService} from "../../../../gis/components/setups/services/subclasses/subclasses.service";
import {Subclasses} from "../../../../gis/components/setups/data/gisDTO";

const log = new Logger('ReinsuranceAllocationsComponent');
@Component({
  selector: 'app-reinsurance-allocations',
  templateUrl: './reinsurance-allocations.component.html',
  styleUrls: ['./reinsurance-allocations.component.css']
})
export class ReinsuranceAllocationsComponent implements OnInit {

  @Input() policyDetails:any [] = [];
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
  prrdCode: number;
  prrdTranNo: number;
  riskCode: any[];

  currencyCode: any;
  UWYear: any;
  subClassCode: any;

  risksForm:FormGroup;

  constructor(private fb: FormBuilder,
              private reinsuranceService: ReinsuranceService,
              private globalMessagingService: GlobalMessagingService,
              private subclassService: SubclassesService, ){}

  ngOnInit(): void {
    this.createTreatyRiSummaryForm();
    this.createRiskPopulateForm();
    this.getRiskReinsuranceRiskDetails();
    // log.info('batch no', this.policyDetails[0].policyBatchNo);

    // this.getRiskReinsuranceDetails();
    // this.getReinsuranceRiskDetails();
    // this.getTreatyParticipant();
    // this.getReinsuranceFacreCeding();
    // this.getReinsurancePool();
    // this.getReinsuranceXolPremium();
    // this.getReinsuranceXolPremiumParticipants();
    // this.getPreviousCeding();
    // this.getTreatyCessions();
    // this.getPreviousFacreCeding();
    // this.getTreatySetups();
    // this.getPolicyFacreSetups();
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

  createRiskPopulateForm() {

    this.risksForm = this.fb.group({
      risk: [''],
    });
  }

  getTreatyParticipant() {
    this.reinsuranceService.getTreatyParticipant(this.reinsuranceRiskDetailsData.content[0]?.code)
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
  getRiskReinsuranceRiskDetails() {
    // this.policyDetails[0].policyBatchNo
    this.reinsuranceService.getRiskReinsuranceRiskDetails(this.policyDetails[0].policyBatchNo)
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
          log.info('content>>',details)

          let inp = {
            "companyNetPRate":0,
            "companyNetRiAmt": this.numberWithCommas(details['ipuReinsureAmt']),
            "companyNetCession": this.numberWithCommas(details['prrdCompRetention']),
            "companyNetPremium": this.numberWithCommas(details['prrdNetPrem']),
            "reinsurancePRate": details[''],
            "reinsuranceRiAmt": details[''],
            "reinsuranceCession": details[''],
            "reinsurancePremium": details[''],
            "treatyPRate": details['trtsPct'],
            "treatyRiAmt": details['trtsSi'],
            "treatyCession": details['prevTreatyRate'],
            "treatyPremium": details['trtsPrem'],
            "facrePRate": details[''],
            "facreRiAmt": this.numberWithCommas(details['prrdFacreAmount']),
            "facreCession": this.numberWithCommas(details['prrdFacreRate']),
            "facrePremium": details[''],
            "totalRiAmt": this.numberWithCommas(details['ipuReinsureAmt']),
            "totalCession": this.numberWithCommas(details['prrdCompRetention']),
            "totalPremium": this.numberWithCommas(details['prrdNetPrem']),
            "excessRiAmt": 0,
            "excessCession": details['prrdExcessPct'],
            "excessPremium": 0,

          };
          log.info('content patched>>',inp)
          // details = {...details, ...inp};

          this.treatyRISummaryForm.patchValue(inp);
        }
      )
  }

  public numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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

  getReinsuranceFacreCeding() {
    this.reinsuranceService.getReinsuranceFacreCeding(this.prrdCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.reinsuranceFacreCedingData = data;
          log.info('ReinsuranceFacreCeding>>', this.reinsuranceFacreCedingData)
        }
      )
  }

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

  getPolicyFacreSetups() {
    this.reinsuranceService.getPolicyFacreSetups(this.policyDetails[0].policyBatchNo)
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


  populateAllocations() {

    let riskSelected = this.riskReinsuranceRiskDetailsData.filter(data => data['checked'] === true);
    const riskCodes = riskSelected.map(data=> data.code);
    this.riskCode = riskCodes;
    const payload: any = {
      batchNumber: 223462763,
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

  selectTreatyRiskCeding(treatyRiskCeding: any) {
    log.info("risk selected output>>", treatyRiskCeding);
    this.getReinsuranceRiskDetails(treatyRiskCeding?.prrdCode);

  }

  selectPreviousCedingDetails(previousCeding: any) {
    log.info("previous ceding selected output>>", previousCeding);
    this.getTreatyCessions();
    this.getPreviousFacreCeding();
    this.getPolicyFacreSetups();
    this.getTreatySetups();
  }

  selectRiskRiSummary(treatyRISummary: any) {
    log.info("treaty RI selected output>>", treatyRISummary);
    this.getTreatyParticipant();
    this.getReinsuranceFacreCeding();
    this.getReinsurancePool();
    this.getReinsuranceXolPremium();
    this.getReinsuranceXolPremiumParticipants();

  }

  /*getSubclasses(code: any) {
    this.subclassService.getSubclasses(code)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.subclassData = data;
          log.info('subclass>>', this.subclassData)
        }
      )
  }*/

  ngOnDestroy(): void {
  }

}
