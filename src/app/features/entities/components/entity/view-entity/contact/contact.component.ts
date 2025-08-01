import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Logger, UtilService} from "../../../../../../shared/services";
import {ClientService} from "../../../../services/client/client.service";
import {ClientTitleDTO} from "../../../../../../shared/data/common/client-title-dto";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import _default from "chart.js/dist/core/core.interaction";
import index = _default.modes.index;
import {group} from "@angular/animations";
import {forkJoin} from "rxjs";
import {BranchService} from "../../../../../../shared/services/setups/branch/branch.service";
import {OrganizationBranchDto} from "../../../../../../shared/data/common/organization-branch-dto";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {AccountService} from "../../../../services/account/account.service";
import {AccountsEnum} from "../../../../data/enums/accounts-enum";

const log = new Logger('ContactComponent');

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() contactDetailsConfig: any
  @Input() formFieldsConfig: any;
  @Input() contactDetails: any;
  @Input() accountCode: number;

  // contactDetailsConfig: any;
  language: string = 'en';
  editForm: FormGroup;
  clientTitle: ClientTitleDTO;
  clientTitles: ClientTitleDTO[];
  branches: OrganizationBranchDto[];
  contactChannels: AccountsEnum[];

  protected readonly CountryISO = CountryISO;
  protected readonly SearchCountryField = SearchCountryField;
  protected readonly PhoneNumberFormat = PhoneNumberFormat;

  constructor(
    private utilService: UtilService,
    private clientService: ClientService,
    private branchService: BranchService,
    private accountService: AccountService,
    private globalMessagingService: GlobalMessagingService,
    private fb: FormBuilder,
    ) {
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

  ngOnInit(): void {
    this.fetchSelectOptions();
    setTimeout(() => {
      // this.createEditForm(this.formFieldsConfig.fields);
      if (this.contactDetails.titleId) this.initData();
    }, 1000);
  }


  initData(): void {
    this.clientService.getClientTitles().subscribe({
      next: (res: ClientTitleDTO[]) => {
        this.clientTitles = res;
        const index =  res.findIndex(title =>  title.id === this.contactDetails?.titleId)
        this.clientTitle = res[index];
        this.createEditForm(this.formFieldsConfig.fields);
      },
      error: err => {

      }
    });
  }

  fetchSelectOptions(): void {
    forkJoin({
      branches: this.branchService.getAllBranches(),
      contactChannels: this.accountService.getPreferredCommunicationChannels(),
    }).subscribe({
      next: data => {
        this.branches = data.branches
        this.contactChannels = data.contactChannels
        if (this.contactDetailsConfig) this.setSelectOptions(
          data.branches,
          data.contactChannels,
        );
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        log.error(`could not fetch: `, err);
      }
    });
  }

  setSelectOptions(
    branches: OrganizationBranchDto[],
    contactChannels: AccountsEnum[],
  ): void {
    this.formFieldsConfig.fields.forEach(field => {
      switch (field.fieldId) {
        case 'title':
          field.options = this.clientTitles;
          break;
        case 'branch':
          field.options = branches;
          break;
        case 'contactChannel':
          field.options = contactChannels;
          break;
        default:
        // do something
      }
    })
  }

  openEditContactDialog(): void {
    // log.info(`openEditContactDialog >>> `,);
    this.editButton.nativeElement.click();
    this.patchFormValues();
  }

  createEditForm(fields: any[]): void {
    const group: { [key: string]: any } = {};
    fields.forEach(field => {
      group[field.fieldId] = [
        field.defaultValue,
        field.isMandatory ? Validators.required : []
      ];
    });
    this.editForm = this.fb.group(group);
    // this.patchFormValues();
  }

  patchFormValues(): void {
    const patchData = {
      branch: this.contactDetails.branch ,
      title: this.clientTitle.id,
      smsNumber: this.contactDetails?.smsNumber,
      telNumber: this.contactDetails?.phoneNumber,
      email: this.contactDetails?.emailAddress,
      contactChannel: this.contactDetails?.contactChannel
    }
    this.editForm.patchValue(patchData);
    log.info(`patched form >>> `, this.editForm, patchData);
  }

  editContactDetails(): void {
    const formValues = this.editForm.getRawValue();
    const contactDetails = {
      ...this.contactDetails,
      titleId: formValues.title,
      smsNumber: formValues.smsNumber?.internationalNumber,
      phoneNumber: formValues.telNumber?.internationalNumber,
      emailAddress: formValues.email,
      contactChannel: formValues.contactChannel,

    }
    log.info(`form values >>> `, formValues, contactDetails);
    this.clientService.updateClient(this.accountCode, contactDetails).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
    this.closeButton.nativeElement.click();
  }

}
