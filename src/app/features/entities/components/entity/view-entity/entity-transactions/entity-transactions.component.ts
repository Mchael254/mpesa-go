import { Component, Input, OnInit } from '@angular/core';
import { EntityService } from 'src/app/features/entities/services/entity/entity.service';
import { Logger } from 'src/app/shared/services';
import {Pagination} from "../../../../../../shared/data/common/pagination";
import {ClaimsDTO} from "../../../../../gis/data/claims-dto";

const log = new Logger('EntityTransactionComponent')

@Component({
  selector: 'app-entity-transactions',
  templateUrl: './entity-transactions.component.html',
  styleUrls: ['./entity-transactions.component.css']
})
export class EntityTransactionsComponent implements OnInit {

  @Input() clientName: string;
  gis_quotations: any;
  gis_claims: any;
  gis_policies: any;
  currency: string;

  constructor(
    private entityService: EntityService
  ) {
    log.info(`client name from transactions `, this.clientName);
  }

  ngOnInit(): void {

  }

  fetchGisQuotationsByClientId(id: number): void {
    this.entityService.fetchGisQuotationsByClientId(id)
    .subscribe({
      next: (data) => {
        this.gis_quotations = data;
        log.info(`gis_quotations`, data);
        this.currency = data[0]?.currency;
      },
      error: (err) => {}
    })
  }

  fetchGisClaimsByClientId(id: number): void {
    this.entityService.fetchGisClaimsByClientId(id)
    .subscribe({
      next: (data: Pagination<ClaimsDTO>) => {
        this.gis_claims = data;
        log.info(`gis_claims`, data);
      },
      error: (err) => {}
    })
  }

  fetchGisPoliciesByClientId(id: number): void {
    this.entityService.fetchGisPoliciesByClientId(id)
    .subscribe({
      next: (data) => {
        this.gis_policies = data;
        log.info(`gis_policies`, data);
      },
      error: (err) => {}
    })
  }

  getClaimsPremiumAndSumInsured(risks: any[], fieldName: string): number {
    let sumInsured: number = 0;
    if (risks.length > 0) {
      risks.forEach(risk => {
        sumInsured += risk[fieldName];
      });
    }
  return sumInsured;
  }

}
