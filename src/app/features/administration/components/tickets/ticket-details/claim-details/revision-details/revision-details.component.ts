import {Component, Input, OnInit} from '@angular/core';
import {Logger} from "../../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {ViewClaimService} from "../../../../../../gis/services/claims/view-claim.service";
import {ReinsuranceService} from "../../../../../../gis/reinsurance/reinsurance.service";
import {ClaimsDTO} from "../../../../../../gis/data/claims-dto";
import {TicketsDTO} from "../../../../../data/ticketsDTO";
import {LocalStorageService} from "../../../../../../../shared/services/local-storage/local-storage.service";

const log = new Logger('RevisionDetailsComponent');
@Component({
  selector: 'app-revision-details',
  templateUrl: './revision-details.component.html',
  styleUrls: ['./revision-details.component.css']
})
export class RevisionDetailsComponent implements OnInit {
  claim: ClaimsDTO;
  @Input() selectedSpringTickets: TicketsDTO;
  claimTransaction: any;
  pageSize: 5;
  perilsData: any[];
  treatyCedingData: any[];
  facultativeCedingData: any[];
  nonPropTreatyData: any[];
  penaltiesData: any[];
  reinsurancePoolData: any[];
  treatyCessionData: any[];
  facultativeCessionData: any[];
  nonPropReinsurerData: any[];
  claimBankData: any[];
  perilsPaymentData: any[];
  remarksData: any[];

  constructor(
    private globalMessagingService: GlobalMessagingService,
    private viewClaimService: ViewClaimService,
    private reinsuranceService: ReinsuranceService,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      log.info('claimsData ticket detail>>', this.selectedSpringTickets);

      this.claimTransaction = this.localStorageService.getItem('claimTransactionDetails');
      this.claim = this.localStorageService.getItem('claimDetails');
      log.info('claimTransaction session', this.claimTransaction)
      log.info('claimsDetail session>>', this.claim);

      this.getPerils();
      this.getTreatyCeding();
      this.getFacultativeCeding();
      this.getNonProportionalTreaty();
      this.getPenalties();
      this.getReinsurancePool();
      this.getTreatyCession();
      this.getFacultativeCession();
      this.getNonPropReinsurers();
      this.getClaimBankDetails();
      this.getPerilsClaimPayment();
      this.getRemarks();


    },1500);
  }

  getPerils() {
    this.viewClaimService.getListOfPerilsLRV(this.selectedSpringTickets?.ticket?.claimNo)
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
    this.viewClaimService.getTreatyCedingLRV(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
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
    this.viewClaimService.getFacultativeCedingLRV(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
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
    this.viewClaimService.getNonPropTreatyLRV(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
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
    this.viewClaimService.getPenaltiesLRV(this.selectedSpringTickets?.ticket?.claimNo)
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

  getTreatyCession() {
    this.viewClaimService.getTreatyCessions(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.treatyCessionData = data.embedded[0];
          log.info('treatyCession data>>', this.treatyCessionData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getFacultativeCession() {
    this.viewClaimService.getFacultativeCessions(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.facultativeCessionData = data.embedded[0];
          log.info('facCession data>>', this.facultativeCessionData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getNonPropReinsurers() {
    this.viewClaimService.getNonPropReinsurers(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.nonPropReinsurerData = data.embedded[0];
          log.info('facCession data>>', this.nonPropReinsurerData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getClaimBankDetails() {
    this.viewClaimService.getClaimsBankDetails(this.claimTransaction?.claimVoucherCode)
      .subscribe({
        next: (data) => {
          this.claimBankData = data.embedded[0];
          log.info('claim bank data>>', this.claimBankData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getPerilsClaimPayment() {
    this.viewClaimService.getListOfPerilsPayment(this.claimTransaction?.claimVoucherCode)
      .subscribe({
        next: (data) => {
          this.perilsPaymentData = data.embedded[0];
          log.info('perilsPayment>>', this.perilsPaymentData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  getRemarks() {
    this.viewClaimService.getRemarks(this.selectedSpringTickets?.ticket?.policyCode.toString(),this.selectedSpringTickets?.ticket?.claimNo, 'C')
      .subscribe({
        next: (data) => {
          this.remarksData = data.embedded[0];
          log.info('remarks>>', this.remarksData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }
}
