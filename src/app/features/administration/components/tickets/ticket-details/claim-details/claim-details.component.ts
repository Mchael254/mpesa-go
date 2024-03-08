import {Component, Input, OnInit} from '@angular/core';
import {TicketsDTO} from "../../../../data/ticketsDTO";
import {Logger} from "../../../../../../shared/services";
import {untilDestroyed} from "../../../../../../shared/services/until-destroyed";
import {ViewClaimService} from "../../../../../gis/services/claims/view-claim.service";
import {Pagination} from "../../../../../../shared/data/common/pagination";
import {ClaimsDTO} from "../../../../../gis/data/claims-dto";

const log = new Logger('ClaimDetailsComponent');
@Component({
  selector: 'app-claim-details',
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.css']
})
export class ClaimDetailsComponent implements OnInit {
  @Input() selectedSpringTickets: TicketsDTO;

  claimsData: Pagination<ClaimsDTO> = <Pagination<ClaimsDTO>>{};
  claim: ClaimsDTO;

  constructor(private claimsService: ViewClaimService) {
  }
  ngOnInit(): void {
    log.info('claim>>', this.selectedSpringTickets);
    this.fetchClaimDetails(this.selectedSpringTickets?.ticket?.claimNo);
  }

  fetchClaimDetails(code:any) {
    this.claimsService.getClaimByClaimNo(code)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data: Pagination<ClaimsDTO>) => {
          data.content.forEach( claim => {
            this.claim = claim
          });
          this.claimsData = data;

          log.info('claimsdata>>', this.claimsData, this.claim)
        })
  }

  ngOnDestroy(): void {
  }
}
