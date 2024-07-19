import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Logger} from "../../../../../../../shared/services";
import {BankDetailsUpdateDTO} from "../../../../../data/accountDTO";
import {Bank} from "../../../../../data/BankDto";
import {BankBranchDTO, BankDTO} from "../../../../../../../shared/data/common/bank-dto";
import {takeUntil} from "rxjs/operators";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";
import {AccountService} from "../../../../../services/account/account.service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {EntityService} from "../../../../../services/entity/entity.service";

const log = new Logger('EditBankFormComponent');

@Component({
  selector: 'app-edit-bank-form',
  templateUrl: './edit-bank-form.component.html',
  styleUrls: ['./edit-bank-form.component.css'],
})
export class EditBankFormComponent implements OnInit{

  @Output('closeEditModal') closeEditModal: EventEmitter<any> = new EventEmitter<any>();

  bankForm: FormGroup;
  bankDetails: any;
  banksData: BankDTO[];
  branchesData: BankBranchDTO[];
  extras: any;
  shouldShowEditForm: boolean = false;
  progressBarWidth: number = 10;

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private entityService: EntityService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.createBankForm();
   }

  /**
   * This method create the bank form for editing bank details
   */
  createBankForm(): void {
     this.bankForm = this.fb.group({
       bank: [''],
       accountNo: [''],
       accountType: [''],
       branch: [''],
       paymentMethod: ['']
     });
   }

  /**
   * Prepare form for editing by patching existing values to form
   * @param bankDetails current bank details
   * @param extras additional info needed for updating bank details e.g. partyAccountId
   */
  prepareUpdateDetails(bankDetails: Bank, extras: any): void {
    this.shouldShowEditForm = false;
    this.bankDetails = bankDetails;
    this.extras = extras;
    this.fetchBanks(1100) // todo: remove hardcoded country code
    this.bankForm.patchValue({
      bank: this.bankDetails.bankId,
      accountNo: this.bankDetails?.accountNo,
      accountType: this.bankDetails.accountType,
      branch: this.bankDetails.id,
      paymentMethod: null,
      partyAccountId: extras.partyAccountId
    });
    console.log(`bank details >>> `, bankDetails, extras);
    this.progressBarWidth = 75;
  }

  /**
   * Fetches all list of banks in a particular country
   * @param countryId
   */
  fetchBanks(countryId: number): void {
    this.bankService.getBanks(countryId).subscribe({
      next: (banksData) => {
        this.banksData = banksData;
        this.fetchBranches(this.bankDetails?.bankId);
        this.progressBarWidth = 85;
      },
      error: (err) => {
        log.info(`could not fetch banks`, err);
        const errorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
  }

  /**
   * Fetch the list of branches attached to a bank using the bankId
   * @param bankId
   */
  fetchBranches(bankId: number): void {
    this.bankService.getBankBranchById(bankId).subscribe({
      next: (branchesData) => {
        this.progressBarWidth = 100;
        this.branchesData = branchesData;
        this.shouldShowEditForm = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        log.info(`could not fetch branches`, err);
        const errorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
  }

  /**
   * Refresh the list of branches when a new bank is selected
   */
  updateBankBranches(): void {
    const bankId = this.bankForm.getRawValue().bank;
    this.fetchBranches(bankId)
  }

  /**
   * prepare dto for update and persist in database
   */
  updateDetails(): void {
    const formValues = this.bankForm.getRawValue();
    log.info(`bank form values >>> `, formValues);
    const bankDetailsToUpdate: BankDetailsUpdateDTO = {
      account_number: formValues.accountNo,
      bank_branch_id: formValues.branch,
      currency_id: 234,
      id: formValues.bank,
      partyAccountId: this.extras.partyAccountId,
      preferedChannel: formValues.paymentMethod,
    }

    this.entityService.updateBankDetails(bankDetailsToUpdate.partyAccountId, bankDetailsToUpdate).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated Bank Details');
        this.closeEditModal.emit();
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
  }

}
