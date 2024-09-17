import { Component, Input, OnInit } from '@angular/core';
import { Pagination } from '../../../../../../shared/data/common/pagination';
import { ClaimsDTO } from '../../../../../gis/data/claims-dto';
import { EntityService } from '../../../../services/entity/entity.service';
import { Logger } from '../../../../../../shared/services';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { PartyTypeDto } from 'src/app/features/entities/data/partyTypeDto';

const log = new Logger('EntityTransactionComponent');

@Component({
  selector: 'app-entity-transactions',
  templateUrl: './entity-transactions.component.html',
  styleUrls: ['./entity-transactions.component.css'],
})
export class EntityTransactionsComponent implements OnInit {
  @Input() clientName: string;
  gis_quotations: any;
  gis_claims: any;
  gis_policies: any;
  currency: string;
  partyTypeShtDesc: string;

  isQuotationDataReady: boolean = true;
  isPolicyDataReady: boolean = true;
  isClaimDataReady: boolean = true;

  constructor(
    private entityService: EntityService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {}

  /**
   * This method determines which party type transactions to be fetached (Client, Agent, Staff or Service Provider)
   * @param partyTypeShtDesc
   * @param id
   */
  fetchTransactionsByPartyAndAccountCode(
    partyTypeShtDesc: string,
    id: number,
    username: string,
    partyTypes: PartyTypeDto[]
  ): void {
    this.partyTypeShtDesc = partyTypeShtDesc;

    const partyShtDesc = partyTypes.filter(
      (partyType) => partyType.partyTypeShtDesc === partyTypeShtDesc
    )[0].partyTypeShtDesc;

    switch (partyShtDesc) {
      case 'A':
      case 'AGENT':
        this.fetchTransactionsByAgentCode(id);
        break;
      case 'S':
      case 'SPR':
        this.fetchTransactionsByUser(username);
        break;
      case 'C':
      case 'CLIENT':
        this.fetchTransactionsByClientId(id);
        break;
      default:
        log.info(`No party type to fetch transactions for`);
    }
  }

  /**
   * This method fetches CLIENT transactions using the clientId
   * @param id
   */
  fetchTransactionsByClientId(id: number): void {
    this.isQuotationDataReady = false;
    this.isPolicyDataReady = false;
    this.isClaimDataReady = false;

    this.fetchGisQuotationsByClientId(id);
    this.fetchGisClaimsByClientId(id);
    this.fetchGisPoliciesByClientId(id);
  }

  /**
   * This method fetches AGENT transactions using the agentCode
   * @param id
   */
  fetchTransactionsByAgentCode(agentCode: number): void {
    this.isQuotationDataReady = false;
    this.isPolicyDataReady = false;
    this.isClaimDataReady = false;

    this.fetchGisClaimsByAgentCode(agentCode);
    this.fetchGisPoliciesByAgentCode(agentCode);
    this.fetchGisQuotationsByAgentCode(agentCode);
  }

  /**
   * This method fetches AGENT transactions using the agentCode
   * @param id
   */
  fetchTransactionsByUser(user: string): void {
    this.isQuotationDataReady = false;
    this.isPolicyDataReady = false;
    this.isClaimDataReady = false;

    this.fetchGisQuotationsByUser(user);
    this.fetchGisPoliciesByUser(user);
    this.fetchGisClaimsByUser(user);
  }

  /**
   * This methody fetches the GIS Quotations for client using Id
   * @param id
   */
  fetchGisQuotationsByClientId(id: number): void {
    this.entityService.fetchGisQuotationsByClientId(id).subscribe({
      next: (data) => {
        this.gis_quotations = data;
        this.currency = data[0]?.currency;
        this.isQuotationDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isQuotationDataReady = true;
      },
    });
  }

  /**
   * This methody fetches the GIS Claims for client using Id
   * @param id
   */
  fetchGisClaimsByClientId(id: number): void {
    this.entityService.fetchGisClaimsByClientId(id).subscribe({
      next: (data: Pagination<ClaimsDTO>) => {
        this.gis_claims = data;
        this.isClaimDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isClaimDataReady = true;
      },
    });
  }

  /**
   * This methody fetches the GIS Policies for client using Id
   * @param id
   */
  fetchGisPoliciesByClientId(id: number): void {
    this.entityService.fetchGisPoliciesByClientId(id).subscribe({
      next: (data) => {
        this.gis_policies = data;
        this.isPolicyDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isPolicyDataReady = true;
      },
    });
  }

  /**
   * This method computes the Total Sum Insured by summing sum insured per risk
   * @param risks
   * @param fieldName
   * @returns Total Sum Insured
   */
  getClaimsPremiumAndSumInsured(risks: any[], fieldName: string): number {
    let sumInsured: number = 0;
    if (risks.length > 0) {
      risks.forEach((risk) => {
        sumInsured += risk[fieldName];
      });
    }
    return sumInsured;
  }

  /**
   * This methody fetches the GIS Quotations for Agent using agentCode
   * @param agentCode
   */
  fetchGisQuotationsByAgentCode(agentCode: number): void {
    this.entityService.fetchGisQuotationsByAgentCode(agentCode).subscribe({
      next: (data) => {
        this.gis_quotations = data._embedded;
        this.isQuotationDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isQuotationDataReady = true;
      },
    });
  }

  /**
   * This methody fetches the GIS Claims for Agent using agentCode
   * @param agentCode
   */
  fetchGisClaimsByAgentCode(agentCode: number): void {
    this.entityService.fetchGisClaimsByAgentCode(agentCode).subscribe({
      next: (data) => {
        this.gis_claims = data.embedded;
        this.isClaimDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isClaimDataReady = true;
      },
    });
  }

  /**
   * This methody fetches the GIS Policies for Agent using agentCode
   * @param agentCode
   */
  fetchGisPoliciesByAgentCode(agentCode: number): void {
    this.entityService.fetchGisPoliciesByAgentCode(agentCode).subscribe({
      next: (data) => {
        this.gis_policies = data._embedded;
        this.isPolicyDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isPolicyDataReady = true;
      },
    });
  }

  /**
   * This methody fetches the GIS Quotations for User using user
   * @param user
   */
  fetchGisQuotationsByUser(user: string): void {
    this.entityService.fetchGisQuotationsByUser(user).subscribe({
      next: (data) => {
        this.gis_quotations = data?._embedded;
        this.isQuotationDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isQuotationDataReady = true;
      },
    });
  }

  /**
   * This methody fetches the GIS Claims for User using user
   * @param user
   */
  fetchGisClaimsByUser(user: string): void {
    this.entityService.fetchGisClaimsByUser(user).subscribe({
      next: (data) => {
        this.gis_claims = data?.embedded[0];
        this.isClaimDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isClaimDataReady = true;
      },
    });
  }

  /**
   * This methody fetches the GIS Policies for User using user
   * @param user
   */
  fetchGisPoliciesByUser(user: string): void {
    this.entityService.fetchGisPoliciesByUser(user).subscribe({
      next: (data) => {
        this.gis_policies = data?._embedded;
        this.isPolicyDataReady = true;
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.isPolicyDataReady = true;
      },
    });
  }
}
