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

  public pageSize: 5;
  claimExceptionData: any[];
  selectedClaimException: any[] = [];

  completionRemarksData: any[];
  selectedRemark: string = '';

  constructor(private claimsService: ViewClaimService) {
  }
  ngOnInit(): void {
    log.info('claim>>', this.selectedSpringTickets);
    this.fetchClaimDetails(this.selectedSpringTickets?.ticket?.claimNo);
    // this.fetchClaimExceptions();
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

  /*fetchClaimExceptions() {
    this.claimsService.getListOfExceptionsByClaimNo('C/2018/NBI/MON/021176', 19263658, 'CP')
      .subscribe({
        next: (data) => {
          this.claimExceptionData = data.embedded && data.embedded.length > 0 ? data.embedded[0] : [];
          log.info('Receipts>>', this.claimExceptionData);
        }
      })
  }*/

  onDropdownChange(event, exception) {
    log.info('>>>>', event.value, exception.code)

    /*if (event.value) {
      const payload: any = {
        exceptionCode: exception?.code,
        exceptionUnderwritingDecision: event.value
      }
      this.claimsService.saveExceptionRemark(payload)
        .subscribe({
          next: (data) => {
            this.authoriseExceptionsData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully saved remark');
            this.getAuthorizationExceptionDetails();
            this.cdr.detectChanges();
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Exception remark not selected.'
      );
    }*/
  }
  ngOnDestroy(): void {
  }
}
