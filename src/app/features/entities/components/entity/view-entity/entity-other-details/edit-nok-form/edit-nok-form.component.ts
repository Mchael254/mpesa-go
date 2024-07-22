import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Logger} from "../../../../../../../shared/services";
import {IdentityModeDTO} from "../../../../../data/entityDto";
import {AccountService} from "../../../../../services/account/account.service";
import {NextKinDetailsUpdateDTO} from "../../../../../data/accountDTO";
import {EntityService} from "../../../../../services/entity/entity.service";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('EditBankFormComponent');

@Component({
  selector: 'app-edit-nok-form',
  templateUrl: './edit-nok-form.component.html',
  styleUrls: ['./edit-nok-form.component.css']
})

export class EditNokFormComponent implements OnInit {

  @Output('closeEditModal') closeEditModal: EventEmitter<any> = new EventEmitter<any>();

  nokForm: FormGroup;
  modeIdentityType: IdentityModeDTO[];
  extras: any;
  shouldShowEditForm: boolean = false;
  progressBarWidth: number = 50;
  nokDetails: any;

  relationships: { id: number, name: string }[] = [
    {id: 0, name: 'BROTHER' },
    {id: 1, name: 'SIBLING' },
    {id: 2, name: 'MOTHER' },
    {id: 3, name: 'SISTER' },
    {id: 4, name: 'SPOUSE' },
    {id: 5, name: 'FATHER' },
  ];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private entityService: EntityService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.createNokForm();
    this.fetchModeOfIdentity(2);
  }

  /**
   * This method creates Next-of-Kin edit form
   */
  createNokForm(): void {
    this.nokForm = this.fb.group({
      identityType: [''],
      idNo: [''],
      fullNames: [''],
      email: [''],
      relation: [''],
      mobile: [''],
      dob: [''],
    });
  }

  /**
   * This method fetches the Modes of Identity and populates the dropdown on form
   * @param organizationId
   */
  fetchModeOfIdentity(organizationId: number): void {
    this.accountService.getIdentityMode(organizationId).subscribe({
      next: (identityMode) => {
        this.modeIdentityType = identityMode;
        this.progressBarWidth = 100;
        this.shouldShowEditForm = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errorMessage = err?.error?.message ?? err.message
        this.globalMessagingService.displayErrorMessage("Error", errorMessage);
      }
    })
  }

  /**
   * Prepare form for editing by patching existing values to form
   * @param nokDetails current Next-of-Kin details
   * @param extras additional info needed for updating bank details e.g. partyAccountId
   */
  prepareUpdateDetails(nokDetails: any, extras: any): void {
    log.info(`nok details to update >>>`, nokDetails);
    this.shouldShowEditForm = false;
    this.nokDetails = nokDetails;
    this.extras = extras;
    this.nokForm.patchValue({
      identityType: nokDetails.modeOfIdentity.id,
      idNo: nokDetails.identityNumber,
      fullNames: nokDetails.fullName,
      email: nokDetails.emailAddress,
      relation: nokDetails.relationship,
      mobile: nokDetails.phoneNumber,
      dob: nokDetails.dob,
    });
    // this.progressBarWidth = 50;
    this.cdr.detectChanges();
  }

  /**
   * This method prepares the nokDto, and calls the update endpoint
   */
  updateDetails(): void {
    const formValues = this.nokForm.getRawValue();
    const nokDetailsToUpdate: NextKinDetailsUpdateDTO = {
      id: this.nokDetails.id,
      fullName: formValues.fullNames,
      modeOfIdentityId: formValues.identityType,
      identityNumber: formValues.idNo,
      emailAddress: formValues.email,
      phoneNumber: formValues.mobile,
      smsNumber: formValues.mobile,
      relationship: formValues.relation,
      accountId: this.extras.partyAccountId,
    };

    this.entityService.updateNokDetails(417, nokDetailsToUpdate)
      .subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated Next-of-Kin Details');
          this.closeEditModal.emit();
        },
        error: (err) => {
          const errorMessage = err?.error?.message ?? err.message
          this.globalMessagingService.displayErrorMessage("Error", errorMessage);
        }
      });
  }

}
