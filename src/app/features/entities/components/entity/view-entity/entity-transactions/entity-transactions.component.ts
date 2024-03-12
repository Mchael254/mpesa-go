import { Component, Input, OnInit } from '@angular/core';
import { EntityService } from 'src/app/features/entities/services/entity/entity.service';
import { Logger } from 'src/app/shared/services';

const log = new Logger('EntityTransactionComponent')

@Component({
  selector: 'app-entity-transactions',
  templateUrl: './entity-transactions.component.html',
  styleUrls: ['./entity-transactions.component.css']
})
export class EntityTransactionsComponent implements OnInit {

  @Input() userId
  gis_quotations: any;
  gis_claims: any;
  gis_policies: any;

  constructor(
    private entityService: EntityService
  ) {}


  ngOnInit(): void {
  }

  fetchGisQuotationsByClientId(id: number): void {
    this.entityService.fetchGisQuotationsByClientId(id)
    .subscribe({
      next: (data) => {
        this.gis_quotations = data;
        log.info(`gis_quotations`, data);
      },
      error: (err) => {}
    })
  }

  fetchGisClaimsByClientId(id: number): void {
    this.entityService.fetchGisClaimsByClientId(id)
    .subscribe({
      next: (data) => {
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

}
