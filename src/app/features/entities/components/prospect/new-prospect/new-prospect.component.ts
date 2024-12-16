import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { BreadCrumbItem } from '../../../../../shared/data/common/BreadCrumbItem';
import { Logger } from '../../../../../shared/services/logger/logger.service';
import { EntityDto, IdentityModeDTO } from '../../../data/entityDto';
import { EntityService } from '../../../services/entity/entity.service';
import { CountryService } from '../../../../../shared/services/setups/country/country.service';
import { AccountService } from '../../../services/account/account.service';
import {
  CountryDto,
  StateDto,
  TownDto,
} from '../../../../../shared/data/common/countryDto';
import { ClientTypeDTO } from '../../../data/ClientDTO';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { ClientService } from '../../../services/client/client.service';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { UtilService } from '../../../../../shared/services/util/util.service';
import { ProspectService } from '../../../services/prospect/prospect.service';
import { ProspectDto } from '../../../data/prospectDto';
import { SetupsParametersService } from '../../../../../shared/services/setups-parameters.service';

const log = new Logger('NewProspectComponent');

@Component({
  selector: 'app-new-prospect',
  templateUrl: './new-prospect.component.html',
  styleUrls: ['./new-prospect.component.css'],
})
export class NewProspectComponent implements OnInit {
  public createProspectForm: FormGroup;

  public countryData: CountryDto[] = [];
  public statesData: StateDto[] = [];
  public townData: TownDto[] = [];
  public modeIdentityType: IdentityModeDTO[] = [];
  public clientsTypeData: ClientTypeDTO[] = [];

  private partyId: number;
  public selectedCountry: number;
  public selectedState: number;

  public prospectType: string = 'I';
  public phoneNumberRegex: string;
  public errorOccurred = false;
  public errorMessage: string = '';
  public groupId: string = 'leadTab';
  public submitted = false;
  public response: any;
  public isCardOpen: boolean[] = [];

  prospectBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Account',
      url: '/home/entity',
    },
    {
      label: 'New Prospect',
      url: '/home/entity/prospect/new',
    },
  ];

  visibleStatus: any = {
    agentType: 'Y',
    clientType: 'Y',
    identityType: 'Y',
    surname: 'Y',
    otherName: 'Y',
    dateOfBirth: 'Y',
    idNumber: 'Y',
    pinNumber: 'Y',
    gender: 'Y',
    country: 'Y',
    state: 'Y',
    town: 'Y',
    postalAddress: 'Y',
    postalCode: 'Y',
    physicalAddress: 'Y',
    mobileNumber: 'Y',
    emailAddress: 'Y',
    telNumber: 'Y',
  };

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private entityService: EntityService,
    private countryService: CountryService,
    private accountService: AccountService,
    private clientService: ClientService,
    private utilService: UtilService,
    private prospectService: ProspectService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService,
    private setupsParameterService: SetupsParametersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createProspectRegistrationForm();
    this.fetchClientType();
    this.fetchCountries();
    this.fetchModeOfIdentity();
  }

  ngOnDestroy(): void {}

  toggleCard(index: number) {
    this.isCardOpen[index] = !this.isCardOpen[index];
  }

  createProspectRegistrationForm(): void {
    this.createProspectForm = this.fb.group({
      agentType: [''],
      clientType: [''],
      identityType: new FormControl({ value: '', disabled: true }),
      surname: new FormControl({ value: '', disabled: true }),
      otherName: new FormControl({ value: '', disabled: true }),
      dateOfBirth: new FormControl({ value: '', disabled: true }),
      idNumber: new FormControl({ value: '', disabled: true }),
      pinNumber: new FormControl({ value: '', disabled: true }),
      gender: [''],

      addressDetails: this.fb.group({
        country: [''],
        state: [''],
        town: [''],
        postalAddress: [''],
        postalCode: [''],
        physicalAddress: [''],
        countryCodeTel: [''],
        telNumber: [''],
        mobileNumber: [''],
        emailAddress: [''],
      }),
    });

    this.getEntityDetails();

    let name = 'SMS_NO_FORMAT';
    this.setupsParameterService.getParameters(name).subscribe((data) => {
      data.forEach((field) => {
        if (field.name === 'SMS_NO_FORMAT') {
          this.phoneNumberRegex = field.value;
          this.createProspectForm.controls['addressDetails']
            .get('mobileNumber')
            ?.addValidators([Validators.pattern(this.phoneNumberRegex)]);
          this.createProspectForm.controls['addressDetails']
            .get('mobileNumber')
            ?.updateValueAndValidity();

          this.createProspectForm.controls['addressDetails']
            .get('telNumber')
            ?.addValidators([Validators.pattern(this.phoneNumberRegex)]);
          this.createProspectForm.controls['addressDetails']
            .get('telNumber')
            ?.updateValueAndValidity();
        }
        log.info('parameters>>>', this.phoneNumberRegex);
      });
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          for (const key of Object.keys(this.createProspectForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createProspectForm.controls[key].addValidators(
                  Validators.required
                );
                this.createProspectForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }

          const addressDetailsControls = this.createProspectForm.get(
            'addressDetails'
          ) as FormGroup;
          for (const key of Object.keys(addressDetailsControls.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createProspectForm
                  .get(`addressDetails.${key}`)
                  .setValidators(Validators.required);
                this.createProspectForm
                  .get(`addressDetails.${key}`)
                  .updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        });
        this.cdr.detectChanges();
      });
  }

  get f() {
    return this.createProspectForm.controls;
  }

  getEntityDetails(): void {
    this.partyId = +this.activatedRoute.snapshot.queryParamMap.get('id');
    this.entityService
      .getEntityById(this.partyId)
      .pipe()
      .subscribe({
        next: (entityDetails: EntityDto) => {
          log.info(`fetched lead details`, entityDetails);
          this.patchLeadFormValues(entityDetails);
        },
        error: (err) => {},
      });
  }

  patchLeadFormValues(entityDetails: EntityDto) {
    const nameParts = entityDetails?.name.split(' ');
    const otherName = nameParts?.slice(0, nameParts.length - 1).join(' ') || '';
    const surname = nameParts?.[nameParts.length - 1] || '';
    this.createProspectForm.patchValue({
      otherName: otherName,
      surname: surname,
      pinNumber: entityDetails?.pinNumber,
      dateOfBirth: this.datePipe.transform(
        entityDetails?.dateOfBirth,
        'dd-MM-yyy'
      ),
      idNumber: entityDetails?.identityNumber,
      identityType: entityDetails?.modeOfIdentity?.id,
    });
  }

  selectUserType(e) {
    this.prospectType = e.target.value;
    log.info(`userType >>>`, this.prospectType, e.target.value);
  }

  onCountryChange() {
    this.createProspectForm.patchValue({
      state: null,
      town: null,
    });

    this.countryService
      .getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.statesData = data;
      });
    this.cdr.detectChanges();
  }

  onCityChange() {
    this.countryService
      .getTownsByMainCityState(this.selectedState)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.townData = data;
      });
  }

  fetchClientType(organizationId?: number) {
    this.clientService
      .getClientType(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.clientsTypeData = data;
            log.info('Fetched Client Type', this.clientsTypeData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchModeOfIdentity(organizationId?: number) {
    this.accountService
      .getIdentityMode(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.modeIdentityType = data;
            log.info('Fetched Mode Of Identity', this.modeIdentityType);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  fetchCountries() {
    this.countryService
      .getCountries()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.countryData = data;
            log.info('Fetched Countries', this.countryData);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  saveProspect() {
    this.submitted = true;
    this.createProspectForm.markAllAsTouched();

    if (this.createProspectForm.invalid) {
      const invalidControls = Array.from(
        document.querySelectorAll('.is-invalid')
      ) as Array<HTMLInputElement | HTMLSelectElement>;

      let firstInvalidUnfilledControl =
        invalidControls.find((control) => !control.value) || invalidControls[0];

      if (firstInvalidUnfilledControl) {
        firstInvalidUnfilledControl.focus();
        const scrollContainer = this.utilService.findScrollContainer(
          firstInvalidUnfilledControl
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop;
        }
      }
      return;
    }

    const prospectFormValues = this.createProspectForm.getRawValue();

    const saveProspect: ProspectDto = {
      accountId: this.partyId,
      clientType: prospectFormValues.clientType,
      contact: prospectFormValues.addressDetails.contact,
      contactTelephone: prospectFormValues.addressDetails.telNumber,
      countryId: prospectFormValues.country,
      dateOfBirth: prospectFormValues.dateOfBirth,
      emailAddress: prospectFormValues.addressDetails.emailAddress,
      id: null,
      idRegistrationNumber: prospectFormValues.idNumber,
      ldsCode: null,
      mobileNumber: prospectFormValues.addressDetails.mobileNumber,
      organizationId: 2,
      otherNames: prospectFormValues.otherName,
      physicalAddress: prospectFormValues.addressDetails.physicalAddress,
      pin: prospectFormValues.pinNumber,
      postalAddress: prospectFormValues.addressDetails.postalAddress,
      postalCode: prospectFormValues.addressDetails.postalCode,
      surname: prospectFormValues.surname,
      telephoneNumber: prospectFormValues.addressDetails.telNumber,
      townId: prospectFormValues.addressDetails.town,
      type: prospectFormValues.clientType,
    };

    log.info('Prospect Form Values to be saved', saveProspect);

    this.prospectService.createProspect(saveProspect).subscribe((data) => {
      this.globalMessagingService.clearMessages();
      this.globalMessagingService.displaySuccessMessage(
        'Success',
        'Successfully Created a Prospect'
      );
      this.router.navigate(['/home/entity/prospect/list']);
    });
  }
}
