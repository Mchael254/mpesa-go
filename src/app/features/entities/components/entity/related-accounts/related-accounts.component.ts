import { ChangeDetectorRef, Component } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { AccountReqPartyId, EntityRelatedAccount } from '../../../data/entityDto';
import { EntityService } from '../../../services/entity/entity.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountStatusService } from '../../../services/account-status/account-status.service';
import { MessageService } from 'primeng/api';
import { Status } from '../../../data/enums/Status';
import { AccountStatus } from '../../../data/AccountStatus';
import { UpdateAccountStatusDto } from '../../../data/UpdateAccountStatusDto';
import {TableDetail} from "../../../../../shared/data/table-detail";

@Component({
  selector: 'app-related-accounts',
  templateUrl: './related-accounts.component.html',
  styleUrls: ['./related-accounts.component.css']
})
export class RelatedAccountsComponent {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  dateForm: FormGroup

  page = 1;
  pageSize = 5;
  checked: boolean;

  entityId: number;
  entityAccountIdDetails: EntityRelatedAccount[] = [];

  accounts: any[] = [];

  tableDetails: TableDetail;

  cols = [
    { field: 'policyNumber', header: 'Role' },
    { field: 'product', header: 'WEF' },
    { field: 'status', header: 'WET' },
    { field: '', header: 'Status' },
  ];

  globalFilterFields = ['policyNumber','product', 'status'];

  constructor(
    private entityService: EntityService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountStatusService: AccountStatusService,

    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.entityId = this.activatedRoute.snapshot.params['id'];
    this.getEntityAccountById();
    this.dateForm = this.fb.group({
      requestdate: ['']
    })
    this.dateForm.get('requestdate').patchValue(this.formatDate(new Date()));
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

   /***
   *   Fetch all accounts (AccountReqPartyId[]) for a specific entity
    */
  getEntityAccountById() {
    this.entityService.getAccountById(this.entityId)
    .pipe(
      takeUntil(this.destroyed$),
    )
    .subscribe(
      (data: AccountReqPartyId[]) => {
        this.entityAccountIdDetails = data;

        this.entityAccountIdDetails.forEach(
            entityAccount => {
              entityAccount.statusList = this.getOptions(entityAccount);
            }
        );
        this.setAllEntityAccountsStatuses();

        this.cdr.detectChanges();
        console.log('>>>>>>>>>', this.entityAccountIdDetails)
      })
  }

  // set Status of the accounts when fetching...
  setAllEntityAccountsStatuses(){
      this.entityService.currentPartyAccounts$
          .pipe(takeUntil(this.destroyed$))
          .subscribe(
              partyAccounts => {

                  this.entityAccountIdDetails = this.entityAccountIdDetails.map(entityAccount => {
                      const applyStatus = partyAccounts.find(partyAccount => partyAccount.id === entityAccount.id);
                      return {
                          ...entityAccount,
                          currentStatus: applyStatus ? applyStatus.status : Status.INACTIVE
                      };
                  });
              }
          );
          console.log(this.entityAccountIdDetails);
  }

  getOptions(entity: AccountReqPartyId): AccountStatus[] {
      return this.accountStatusService
          .fetchStatusList(entity.partyType.partyTypeName);
  }

  changeStatus(event: {id: number, selectedStatus: string}) {
    console.log(event);

    const updateStatusDto: UpdateAccountStatusDto = {
      organizationId: 2, // TODO: Find proper way to select org ID
      status: event.selectedStatus
    };

    this.accountStatusService
        .updateAccountStatus(event.id, updateStatusDto )
        .pipe(
          takeUntil(this.destroyed$),
          )
        .subscribe( (value: boolean) => {
          this.messageService.clear();

          if(value){
              this.messageService.add({severity: 'success', summary:'Success', detail:'Successfully updated status'});
          }
          else {
            this.messageService.add({severity: 'error', summary: 'Error', detail:'Error updating status. Please try again'});
          }

        });
  }

}
