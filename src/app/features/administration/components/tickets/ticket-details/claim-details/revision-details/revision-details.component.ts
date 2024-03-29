import {Component, Input, OnInit} from '@angular/core';
import {Logger} from "../../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {ViewClaimService} from "../../../../../../gis/services/claims/view-claim.service";
import {ReinsuranceService} from "../../../../../../gis/reinsurance/reinsurance.service";
import {ClaimsDTO} from "../../../../../../gis/data/claims-dto";

const log = new Logger('RevisionDetailsComponent');
@Component({
  selector: 'app-revision-details',
  templateUrl: './revision-details.component.html',
  styleUrls: ['./revision-details.component.css']
})
export class RevisionDetailsComponent implements OnInit {
  @Input() claim: ClaimsDTO;
  claimTransaction: any;
  pageSize: 5;
  perilsData: any[];
  treatyCedingData: any[];
  facultativeCedingData: any[];
  nonPropTreatyData: any[];
  penaltiesData: any[];
  reinsurancePoolData: any[];

  constructor(
    private globalMessagingService: GlobalMessagingService,
    private viewClaimService: ViewClaimService,
    private reinsuranceService: ReinsuranceService,) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      log.info('claimsdata revision>>', this.claim)

      log.info("transaction obj",this.viewClaimService.claimTransactionObject());
      this.claimTransaction = this.viewClaimService.claimTransactionObject();

      this.getPerils();
      this.getTreatyCeding();
      this.getFacultativeCeding();
      this.getNonProportionalTreaty();
      this.getPenalties();
      this.getReinsurancePool();

    },1500);
  }

  getPerils() {
    this.viewClaimService.getListOfPerilsLRV(this.claim?.claim_no)
      .subscribe({
        next: (data) => {
          this.perilsData = data.embedded[0];
          log.info('perils>>', this.perilsData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getTreatyCeding() {
    this.viewClaimService.getTreatyCedingLRV(this.claim?.claim_no, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.treatyCedingData = data.embedded[0];
          log.info('treaty ceding>>', this.treatyCedingData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getFacultativeCeding() {
    this.viewClaimService.getFacultativeCedingLRV(this.claim?.claim_no, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.facultativeCedingData = data.embedded[0];
          log.info('facultative>>', this.facultativeCedingData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getNonProportionalTreaty() {
    this.viewClaimService.getNonPropTreatyLRV(this.claim?.claim_no, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.nonPropTreatyData = data.embedded[0];
          log.info('nonprop data>>', this.nonPropTreatyData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getPenalties() {
    this.viewClaimService.getPenaltiesLRV(this.claim?.claim_no)
      .subscribe({
        next: (data) => {
          this.penaltiesData = data.embedded[0];
          log.info('penalties data>>', this.penaltiesData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getReinsurancePool() {
    this.reinsuranceService.getReinsurancePool(this.claim?.risk_code, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.reinsurancePoolData = data;
          log.info('reinsurance pool data>>', this.reinsurancePoolData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

}
