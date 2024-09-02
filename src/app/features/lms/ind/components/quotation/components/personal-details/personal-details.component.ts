import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { BreadCrumbItem } from '../../../../../../../shared/data/common/BreadCrumbItem';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../../../../../../shared/services/setups/country/country.service';
import {
  CountryDto,
  StateDto,
  TownDto,
} from '../../../../../../../shared/data/common/countryDto';
import {
  Observable,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { BranchService } from '../../../../../../../shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from '../../../../../../../shared/data/common/organization-branch-dto';
import { ClientTypeService } from '../../../../../../../shared/services/setups/client-type/client-type.service';
import { ClientService as CRMClientService, ClientService } from '../../../../../../entities/services/client/client.service';
import { ClientService as LMSClientService } from '../../../../../service/client/client.service';
import { ClientDTO, ClientTitlesDto } from '../../../../../../entities/data/ClientDTO';
import { SessionStorageService } from '../../../../../../../shared/services/session-storage/session-storage.service';
import { AutoUnsubscribe } from '../../../../../../../shared/services/AutoUnsubscribe';
import {
  BankBranchDTO,
  BankDTO,
  FundSourceDTO,
} from '../../../../../../../shared/data/common/bank-dto';
import { BankService } from '../../../../../../../shared/services/setups/bank/bank.service';
import { CurrencyService } from '../../../../../../../shared/services/setups/currency/currency.service';
import { OccupationService } from '../../../../../../../shared/services/setups/occupation/occupation.service';
import { SectorService } from '../../../../../../../shared/services/setups/sector/sector.service';
import { ToastService } from '../../../../../../../shared/services/toast/toast.service';
import { PartyService } from '../../../../../service/party/party.service';
import { RelationTypesService } from '../../../../../service/relation-types/relation-types.service';
import { StringManipulation } from '../../../../../util/string_manipulation';
import { SESSION_KEY } from '../../../../../../lms/util/session_storage_enum';
import { DmsService } from '../../../../../../lms/service/dms/dms.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {DataManipulation} from "../../../../../../../shared/utils/data-manipulation";
import {Utils} from "../../../../../util/util";
import {FormsService} from "../../../../../../setups/components/forms/service/forms/forms.service";
import {QuotationService} from "../../../../../service/quotation/quotation.service";
import {IdentityTypeService} from "../../../../../service/identityType/identity-type.service";
import {Pagination} from "../../../../../../../shared/data/common/pagination";
import { SectorDTO } from 'src/app/shared/data/common/sector-dto';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe

export class PersonalDetailsComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Quotation', url: '/home/lms/quotation/list' },
    {
      label: 'Client Details',
      url: '/home/lms/ind/quotation/client-details',
    },
  ];
  steps = stepData;
  clientType: any;
  identifierType: any;
  countryList: CountryDto[];
  county: StateDto[];
  currency: any[];
  selected: any;
  client: any;
  clientList: any;
  clientDetails: ClientDTO;
  clientTitles: ClientTitlesDto[] = [];
  clientForm: FormGroup;
  clientSearch: FormGroup;
  textColor: string = 'black';
  clientTypeName: string;
  draftList: any[] = [];
  identifierTypeList: any[] = [];
  branchList: OrganizationBranchDto[] = [];
  validationData = [];
  stateList: StateDto[] = [];
  townList: TownDto[] = [];
  bankList: BankDTO[] = [];
  bankBranchList: BankBranchDTO[] = [];
  currencyList: any[];
  getFormControlsNameWithErrors: string[] = [];
  identityFormatDesc: { id: number; exampleFormat: string };
  minDate = DataManipulation.getMinDate();
  occupationsData: any[] = [];
  fundSource: FundSourceDTO [] = [];
  sectorData: SectorDTO[] = [];
  util: Utils;
  clientTypeCode: number;
  organizationId: number;
  
  openCardId: string | null = null;
  toggleCollapse(cardId: string) {
    this.openCardId = this.openCardId === cardId ? null : cardId;
  }
  
  preferredChannels: { value: string, label: string }[] = [
    { value: 'EMAIL', label: 'Email' },
    { value: 'SMS', label: 'SMS' },
    { value: 'CALL', label: 'Call' }
  ];

  constructor(
    private session_storage: SessionStorageService,
    private router: Router,
    private fb: FormBuilder,
    private country_service: CountryService,
    private branch_Service: BranchService,
    private clientType_service: ClientTypeService,
    private crm_client_service: CRMClientService,
    private bank_service: BankService,
    private currency_service: CurrencyService,
    private occupation_service: OccupationService,
    private sector_service: SectorService,
    private toast: ToastService,
    private party_service: PartyService,
    private relation_type_service: RelationTypesService,
    private dms_service: DmsService,
    private spinner_Service: NgxSpinnerService,
    private lms_client_service: LMSClientService,
    private form_service: FormsService,
    private quotation_service: QuotationService,
    private identity_service: IdentityTypeService,
    // private occu_service: SectorOccupationComponent
    private clientService: ClientService
  ) {}

  ngOnInit() {
    let quote = this.session_storage.get(SESSION_KEY.QUOTE_DETAILS);


    this.clientForm = this.getClientDetailsForm();
    this.clientSearch = this.fb.group({
      client: [],
    });
    this.getIdentifierTypeList();
    this.getClientList();
    this.getCountryList();
    this.getBranchList();
    this.getBankList();
    this.getClientType();
    this.getClientTitles();
    this.getSectors();
    this.getFundSource();

    this.util = new Utils(this.session_storage);


    this.fetchOccupations()

    this.formValidation()
    .pipe(concatMap((data) => {
      return this.getClientById(quote?.client_code)
    }))
    .subscribe(data =>{
      this.patchClientDetailsToForm(data)
      this.toast.success('Fetch Client Details Successfull', 'CLIENT DETAILS');
      this.spinner_Service.hide('client_details_view');

    },
    err => {
      console.log(err);
      this.toast.danger('Unable to Fetch Client Details', 'CLIENT DETAILS');
      this.toast.danger(err?.error?.errors[0], 'CLIENT DETAILS');
      this.spinner_Service.hide('client_details_view');


    })
  }


  fetchOccupations(organizationId?: number) {
    this.occupation_service
      .getOccupations(organizationId)
      .subscribe( (data) => {
          // if (data) {
            this.occupationsData = data;
            // log.info(`Fetched Occuption Data`, this.occupationsData);

          }


      );
  }

  formValidation() {
    return this.form_service
      .getBySystemAndModuleAndScreeName(
        'LMS_INDIVIDUAL',
        'QUOTATION',
        'CLIENT_DETAILS'
      ).pipe(tap((data : any) => {
        this.validationData = data['data'].map((val: any) => {
          let temp = {};
          temp['name'] = val?.form_name;
          // use english as defaults
          temp['data'] = val?.inputs.en;
          return temp;
        });
        this.clientForm = this.getClientDetailsForm();
        // return data
      }))
  }

  isTelQuoteOrWebQuote(){
    let type = this.session_storage.get(SESSION_KEY.QUOTE_DETAILS);
    if(type){
      return this.util.isTelQuoteOrWebQuote(type['page'])
    }else{
      this.toast.danger('Invalid route', 'ROUTE GUARD')
      this.router.navigate(['home/lms/quotation/list']);
    }
  }

  getIdentityType() {
    return this.identity_service.getIdentityType();
  }

  selectDraft(draft: any) {
    this.session_storage.set(SESSION_KEY.WEB_QUOTE_DETAILS, draft);
    let quote= this.session_storage.get(SESSION_KEY.QUOTE_DETAILS);
    quote['client_code'] = draft['client_code'];
    quote['account_code'] =draft['account_code'];
    quote['web_quote_code'] = draft['code'];
    quote['proposal_no'] = draft['proposal_no'];
    quote['tel_quote_code'] = draft['quote_no'];
    this.session_storage.set(SESSION_KEY.QUOTE_DETAILS, quote);
    this.toast.success('Quote successfully selected', "WEB QUOTATION SELECTED");
    this.router.navigate(['/home/lms/ind/quotation/documents-upload']);

  }

  getFormData(name: string) {
    const foundData = this.validationData.find((data) => data['name'] === name);
    // console.log(foundData?.data?.required);

    return foundData !== undefined ? foundData : null;
  }

  checkIdentityType(identityType: any) {
    let type = identityType.target.value;
    let pattern = this.identifierTypeList.find((data) => {
      return data?.id === StringManipulation.returnNullIfEmpty(type);
    });
    this.identityFormatDesc = this.identity_service.IdentityFormat.find(
      (data) => {
        return data?.id === StringManipulation.returnNullIfEmpty(type);
      }
    );
    const identityNoControl = this.clientForm.get(
      'modeOfIdentityNumber'
    ) as FormControl;
    identityNoControl.setValidators([
      Validators.required,
      (control: any) =>
        this.identity_service.validateIdentity(
          control,
          pattern?.identityFormat
        ),
    ]);
    identityNoControl.updateValueAndValidity();
    this.checkError();
  }

  checkErrorThatsTouchedAndDirty(formName = 'modeOfIdentityNumber', errorName = 'incorrectFormat') {
    return (
      this.clientForm.get(formName).touched &&
      this.clientForm.get(formName).dirty &&
      this.clientForm.get(formName).errors?.[errorName]
    );
  }

  resetForm(){
    this.clientForm.reset();
    this.clientForm.patchValue({ 
      "id": null, "modeOfIdentity": null, "modeOfIdentityId": null, "countryId": null, "firstName": null, "lastName": null, "gender": null, 
      "dateOfBirth": null, "modeOfIdentityNumber": null, "pinNumber": null, "branchId": null, 
      "contactDetails": { 
        "id": null, "emailAddress": null, "phoneNumber": null, "preferredChannel": null, "smsNumber": null, 
        "titleShortDescription": null, "branchId": null 
      }, 
      "address": { 
        "id": null, "box_number": null, "country_id": null, "state_id": null, "town_id": null, "physical_address": null, "is_utility_address": "N" 
      }, 
      "paymentDetails": { 
          "id": null, "account_number": null, "bank_branch_id": null, "currency_id": null, "effective_from_date": null, "effective_to_date": null, 
          "iban": null, "mpayno": null, "preferedChannel": null 
      }, 
      "wealthDetails": { 
          "id": null, "citizenship_country_id": null, "marital_status": null, "funds_source": null, "occupation_id": null, "employed": null, 
          "is_employed": "N", "is_self_employed": "N", "sector_id": null, "insurancePurpose": null, "premiumFrequency": null, "distributeChannel": null 
      }, 
      "occupationId": null, "organizationId": null, "partyId": null, "passportNumber": null, "proposerCode": null, "shortDescription": null, 
      "stateId": null, "townId": null, "client": null, "status": "A", "system": "LMS", "category": "I", "clientTypeId": "NEW_CLIENT", "dateCreated": null, 
      "effectiveDateFrom": null, "effectiveDateTo": null 
    })
  }

  checkError(formName = 'modeOfIdentityNumber', errorName = 'incorrectFormat') {
    return (
      this.clientForm.get(formName).errors?.[errorName]
    );
  }

  getClientDetailsForm(pattern: any = ''): FormGroup<any> {
    return this.fb.group({
      id: [],
      modeOfIdentity: this.getControlConfig('MODE_OF_IDENTITY'),
      modeOfIdentityId: [],
      countryId: this.getControlConfig('COUNTRY_ID'),
      firstName: this.getControlConfig('FIRST_NAME'),
      lastName: this.getControlConfig('LAST_NAME'),
      gender: this.getControlConfig('GENDER'),
      dateOfBirth: this.getControlConfig('DATE_OF_BIRTH'),
      modeOfIdentityNumber: this.getControlConfig('MODE_OF_IDENTITY_NO'),
      pinNumber: this.getControlConfig('PIN_NO'),
      branchId: this.getControlConfig('BRANCH_ID'),
      contactDetails: this.fb.group({
        id: [],
        emailAddress: this.getControlConfig('CONTACT_DETAILS_EMAIL_ADDRESS'),
        phoneNumber: this.getControlConfig('CONTACT_DETAILS_PHONE_NO'),
        preferredChannel: this.getControlConfig('CONTACT_DETAILS_PREFERRED_CHANNEL'),
        smsNumber: this.getControlConfig('CONTACT_DETAILS_SMS_NO'),
        titleShortDescription: this.getControlConfig('CONTACT_DETAILS_TITLE_SHORT_DESCRIPTION'),
        branchId: this.getControlConfig('CONTACT_DETAILS_BRANCH_ID'),
      }),
      address: this.fb.group({
        id: [],
        box_number: this.getControlConfig('ADDRESS_BOX_NUMBER'),
        country_id: this.getControlConfig('ADDRESS_COUNTRY_ID'),
        state_id: this.getControlConfig('ADDRESS_STATE_ID'),
        town_id: this.getControlConfig('ADDRESS_TOWN_ID'),
        physical_address: this.getControlConfig('ADDRESS_PHYSICAL_ADDRESS'),
        is_utility_address: 'N'
      }),
      paymentDetails: this.fb.group({

        id: [],
        account_number: this.getControlConfig('PAYMENT_DETAILS_ACCOUNT_NUMBER'),
        bank_branch_id: this.getControlConfig('PAYMENT_DETAILS_BANK_BRANCH_ID'),
        currency_id: this.getControlConfig('PAYMENT_DETAILS_CURRENCY_ID'),
        effective_from_date: this.getControlConfig('PAYMENT_DETAILS_EFFECTIVE_FROM_DATE'),
        effective_to_date: this.getControlConfig('PAYMENT_DETAILS_EFFECTIVE_TO_DATE'),
        iban: this.getControlConfig('PAYMENT_DETAILS_IBAN'),
        mpayno: this.getControlConfig('PAYMENT_DETAILS_MPAYNO'),
        preferedChannel: this.getControlConfig('PAYMENT_DETAILS_PREFERRED_CHANNEL'),
      }),
      wealthDetails: this.fb.group({
        id: [],
        citizenship_country_id: this.getControlConfig('CITIZENSHIP_COUNTRY_ID'),
        marital_status: this.getControlConfig('MARITAL_STATUS'),
        funds_source: this.getControlConfig('FUNDS_SOURCE'),
        occupation_id: this.getControlConfig('OCCUPATION_ID'),
        employed: this.getControlConfig('EMPLOYED'), //?
        is_employed: ['N'],
        is_self_employed: ['N'],
        sector_id: this.getControlConfig('SECTOR_ID'),
        insurancePurpose: this.getControlConfig('INSURANCE_PURPOSE'),
        premiumFrequency: this.getControlConfig('PREMIUM_FREQUENCY'),
        distributeChannel: this.getControlConfig('DISTRIBUTE_CHANNEL'),
      }),
      occupationId: this.getControlConfig('OCCUPATION_ID'),
      organizationId: this.getControlConfig('ORGANIZATION_ID'),
      partyId: this.getControlConfig('PARTY_ID'),
      passportNumber: this.getControlConfig('PASSPORT_NUMBER'),
      proposerCode: this.getControlConfig('PROPOSER_CODE'),
      shortDescription: this.getControlConfig('SHORT_DESCRIPTION'),
      stateId: this.getControlConfig('STATE_ID'),
      townId: this.getControlConfig('TOWN_ID'),
      client: this.getControlConfig('CLIENT'),
      status: ['A'],
      system: ['LMS'],
      category: ['I'],
      clientTypeId: ['NEW_CLIENT'],
      dateCreated: [],
      effectiveDateFrom: [],
      effectiveDateTo: [],

    });
  }
  private patchClientDetailsToForm(data){
    console.log(data);

    this.clientForm.patchValue(data);
    this.clientForm.get('id').patchValue(data?.id);
      this.clientForm.get('dateOfBirth').patchValue(new Date(data['dateOfBirth']));
      this.clientForm.get('modeOfIdentityNumber').patchValue(data['idNumber']);
      this.clientForm.get('countryId').patchValue(data['country']);
      this.clientForm.get('pinNumber').patchValue(data['pinNumber']);
      // this.clientForm.get('modeOfIdentityId').patchValue(data['modeOfIdentity']);
      this.clientForm.get('contactDetails').get('branchId').patchValue(data['branchCode']);
      this.clientForm.get('contactDetails').get('emailAddress').patchValue(data['emailAddress']?.toLocaleLowerCase());
      this.clientForm.get('contactDetails').get('phoneNumber').patchValue(data['phoneNumber']);
      this.clientForm.get('contactDetails').get('titleShortDescription').patchValue(data['clientTitle']);
      this.clientForm.get('address').get('country_id').patchValue(data['country']);
      this.clientForm.get('address').get('physical_address').patchValue(data['physicalAddress']);
      this.clientForm.get('paymentDetails').get('effective_from_date').patchValue(new Date(data['withEffectFromDate']));
      this.clientForm.get('wealthDetails').get('citizenship_country_id').patchValue(data['country']);


  }
  private getControlConfig(form_name: string, value = null) {
    return [
      {
        value: value,
        disabled: !!this.getFormData(form_name)?.data?.is_disabled,
      },
      !!this.getFormData(form_name)?.data?.required
        ? Validators.required
        : null,
    ];
  }
  getClientById(code: any){
    if(code){
      this.spinner_Service.show('client_details_view');
      return this.crm_client_service.getClientById(code)
    }
  }
  getClientList() {
    this.crm_client_service.getClients().subscribe((data) => {
      this.clientList = data['content']?.map((d) => {
        d['full_name'] = `${d.firstName} ${d.lastName ? d.lastName : ''}`;
        d['details'] = `${d.firstName} ${d.lastName ? d.lastName : ''} - ${
          d?.emailAddress ? d?.emailAddress : ''
        }`;
        return d;
      });
    });
  }

  selectClient(event: any) {
    // console.log('select client');
    console.log(event?.value);
    // let val = this.clientForm.get('client');
    // this.clientForm.patchValue(event?.value);
    this.patchClientDetailsToForm(event?.value)

  }

  selectCountry(_event: any) {
    // this.showStateSpinner = true;
    let e = +_event.target.value;
    of(e)
      .pipe(
        switchMap((data: number) => {
          return this.country_service.getMainCityStatesByCountry(data);
        })
        // finalize(() => {
        //   this.showStateSpinner = false;
        // })
      )
      .subscribe((data) => {
        this.stateList = data;
        this.townList = [];
      });
  }

  selectState(_event: any) {
    // this.showTownSpinner = true;
    let e = +_event.target.value;
    of(e)
      .pipe(
        switchMap((data: number) => {
          return this.country_service.getTownsByMainCityState(data);
        })
        // finalize(() => {
        //   this.showTownSpinner = false;
        // })
      )
      .subscribe((data) => {
        this.townList = data;
      });
  }
  getCountryList() {
    this.country_service
      .getCountries()
      .pipe(
        map((data) => {
          return this.returnLowerCase(data);
        })
      )
      .subscribe((data: any[]) => {
        this.countryList = data;
        this.currencyList = this.countryList.filter(
          (data) => data?.currency?.name !== null
        );
      });
  }
  getBranchList(organizationId?:number, regionId?:number) {
    this.branch_Service
      .getAllBranches(organizationId, regionId)
      .pipe(
        map((data) => {
          //Remove duplicates based on branch name or id
          return data.filter(
            (branch, index, self) =>
              index === self.findIndex((b) => b.name === branch.name)
          );
        }),
        map((data) => this.returnLowerCase(data))
      )
      .subscribe((data) => {
        this.branchList = data;
      });
  }

  getIdentifierTypeList(organizationId?:number) {
    this.clientType_service.getIdentifierTypes(organizationId).subscribe((data) => {
      this.identifierTypeList = data;
    });
  }

  getClientType(organizationId?:number) {
    this.clientService.getClientType(organizationId).subscribe((data) => {
      // Filter the data to find the 'INDIVIDUAL' client type
      const filteredClientType = data.filter((item: { clientTypeName: string }) => item.clientTypeName === 'Individual');

      // Check if we found any matching client type
      if (filteredClientType.length > 0) {
        this.clientType = filteredClientType[0];
        this.clientTypeCode = this.clientType.code;
        console.log('Client Type', this.clientType, this.clientTypeCode);
      } else {
        console.log('No INDIVIDUAL client type found');
      }
    });
  }
  /** 
   * Fetches client titles based on the specified organization ID and updates the component's
   *  clientTitles property.
   * @param organizationId The organization ID for which client titles are fetched.
  */
  getClientTitles(organizationId?:number) {
    this.crm_client_service.getClientTitles(organizationId)
    .subscribe((data) => {
      this.clientTitles = data; 
    });
  }

  getSectors(organizationId?:number) {
    this.sector_service.getSectors(organizationId).subscribe((data) => {
      this.sectorData = data;
      }); 
  }

  getFundSource() {
    this.bank_service.getFundSource().subscribe((data) => {
      this.fundSource = data;
    })
  }

  getBankList() {
    this.bank_service.getBanks(165).subscribe((data) => {
      this.bankList = data;
    });
  }
  selectBank(d: any) {
    this.getBankBranchList2(d?.target?.value);
  }

  getBankBranchList2(id: any) {
    this.bank_service.getBankBranchById(id).subscribe((data) => {
      this.bankBranchList = data;
    });
  }

  openModal(name = 'draftModal'): void {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.add('show'); // Show the modal
      modal.style.display = 'block'; // Ensure it's visible
    }
  }
  closeModal(name = 'newClientModal') {
    // this._openModal = true;
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
    // this.router.navigate(['/home/lms/ind/quotation/documents-upload']);
  }

  getFormControlsWithErrors(formGroup: FormGroup): string[] {
    const controlsWithErrors: string[] = [];

    Object.keys(formGroup.controls).forEach((controlName) => {
      const control = formGroup.get(controlName);

      if (control && control.invalid) {
        controlsWithErrors.push(controlName);
      }

      if (control instanceof FormGroup) {
        // If the control is a nested FormGroup, recursively check its controls
        controlsWithErrors.push(...this.getFormControlsWithErrors(control));
      }
    });

    const convertedArray = controlsWithErrors.map((str) => {
      return str.replace(/([A-Z])/g, ' $1').trim();
    });

    return convertedArray;
  }

  async saveClientDetails() {
    // Mark all controls as touched and dirty to trigger validation
    Object.keys(this.clientForm.controls).forEach((field) => {
      const control = this.clientForm.get(field);
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty({ onlySelf: true });
    });

    this.spinner_Service.show('client_details_view');
    let quote = this.session_storage.get(SESSION_KEY.QUOTE_DETAILS);

    if (!this.clientForm.valid) {
      // Only display the list of controls with errors if needed
      if (this.shouldDisplayErrorList()) {
        StringManipulation.enableControlsWithErrors(this.clientForm);
        this.getFormControlsNameWithErrors = this.getFormControlsWithErrors(this.clientForm);
        this.toast.danger('Fill the required forms', 'Required forms');
      }

      this.spinner_Service.hide('client_details_view');
      return;
    } else {
      // Proceed with saving client details
      let client_sub = this.generateOutObjectFromClientForm(this.clientForm);
      console.log(client_sub);

      this.crm_client_service
          .save(client_sub)
          .pipe(
                concatMap((client_res) => {
                  console.log(client_res);
                  this.session_storage.set(SESSION_KEY.CLIENT_DETAILS, client_res);
                  quote['client_code'] = client_res['id'];
                  this.session_storage.set(SESSION_KEY.QUOTE_DETAILS, quote);
                  this.toast.success('Create Client Details Successfully!', 'Client Details');
                  return this.quotation_service.getLmsIndividualQuotationWebQuoteListByDraft(0, 10, client_res['id']);
                }),
                finalize(() => {
                    this.spinner_Service.hide('client_details_view');
                })
            )
            .subscribe(
                (data: any) => {
                    console.log(data);
                    this.toast.success('fetch Existing Drafts Successfully!', 'Client Details');
                    this.spinner_Service.hide('client_details_view');
                    this.draftList = data['content']?.filter((data: any) => data?.proposal_no === null);

                    if (this.draftList.length > 0 && this.util.returnTelQuoteOrWebQuote() === 'NEW') {
                        this.openModal('draft');
                        return;
                    }
                    this.router.navigate(['/home/lms/ind/quotation/documents-upload']);
                },
                (err: any) => {
                    this.spinner_Service.hide('client_details_view');
                    this.toast.danger(err?.error?.errors[0], 'QUOTATION CREATION/UPDATE');
                }
              );
    }
  }

  shouldDisplayErrorList(): boolean {
    // Return true if you want to display the list, false if you don't
    // This could be based on certain form states or other business logic
    return false; // Set to true if you want to display the error list
  }

  // Method to highlight invalid fields
  highlightInvalid(field: string): boolean {
    const control = this.clientForm.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }   

  generateOutObjectFromClientForm(clientForm: FormGroup): any {
    let mode = this.identifierTypeList.find((data: any) => StringManipulation.returnNullIfEmpty(data['id'])===StringManipulation.returnNullIfEmpty(clientForm.get('modeOfIdentity').value));
    console.log(clientForm.get('contactDetails').get('branchId').value);

    let branch = this.branchList.find((data: any) => StringManipulation.returnNullIfEmpty(data['id'])===StringManipulation.returnNullIfEmpty(
      clientForm.get('contactDetails').get('branchId').value
      ));

    mode = mode?mode:{'id':null, 'name': null};
    branch = mode?mode:{'id':null, 'name': null};

    return {
      id: clientForm.get('id').value,
      system: clientForm.get('system').value,
      firstName: clientForm.get('firstName').value,
      lastName: clientForm.get('lastName').value,
      modeOfIdentityId: StringManipulation.returnNullIfEmpty(mode?.id),
      modeOfIdentity: mode?.name,
      modeOfIdentityNumber: clientForm.get('modeOfIdentityNumber').value,
      gender: clientForm.get('gender').value,
      pinNumber: clientForm.get('pinNumber').value,
      // clientTypeId: clientForm.get('clientTypeId').value,
      shortDescription: clientForm.get('shortDescription').value,
      address: {
        id: clientForm.get('address').get('id').value,
        box_number: clientForm.get('address').get('box_number').value,
        country_id: clientForm.get('address').get('country_id').value,
        state_id: clientForm.get('address').get('state_id').value,
        town_id: clientForm.get('address').get('town_id').value,
        physical_address: clientForm.get('address').get('physical_address')
          .value,
        postal_code: null,
        residential_address: null,
        road: null,
        estate: null,
        house_number: null,
        is_utility_address: 'N',
        utility_address_proof: null,
        fax: null,
        zip: null,
        phoneNumber: null,
        account: null,
      },
      passportNumber: null,
      dateOfBirth: clientForm.get('dateOfBirth').value,
      effectiveDateFrom: clientForm.get('paymentDetails').get('effective_from_date').value,
      effectiveDateTo: clientForm.get('paymentDetails').get('effective_to_date').value,
      category: "I",
      status: clientForm.get('status').value,
      branchId: StringManipulation.returnNullIfEmpty(clientForm.get('contactDetails').get('branchId').value),
      countryId: StringManipulation.returnNullIfEmpty(clientForm.get('countryId').value),
      townId: StringManipulation.returnNullIfEmpty(clientForm.get('townId').value),
      stateId: StringManipulation.returnNullIfEmpty(clientForm.get('stateId').value),
      partyId: StringManipulation.returnNullIfEmpty(clientForm.get('partyId').value),
      // organizationId: StringManipulation.returnNullIfEmpty(clientForm.get('organizationId').value),
      partyAccountId: null,
      proposerCode: StringManipulation.returnNullIfEmpty(clientForm.get('proposerCode').value),
      dateCreated: new Date(),
      contactDetails: {
        id: clientForm.get('contactDetails').get('id').value | 0,
        emailAddress: clientForm.get('contactDetails').get('emailAddress')
          .value,
        phoneNumber: clientForm.get('contactDetails').get('phoneNumber').value,
        preferredChannel: clientForm.get('contactDetails').get('preferredChannel').value,
        smsNumber: clientForm.get('contactDetails').get('smsNumber').value,
        title: null,
        receivedDocuments: 'N',
        account: null,
        accountId: null,
      },
      paymentDetails: {
        id: clientForm.get('paymentDetails').get('id').value | 0,
        account_number: clientForm.get('paymentDetails').get('account_number')
          .value,
        bank_branch_id: StringManipulation.returnNullIfEmpty(clientForm.get('paymentDetails').get('bank_branch_id')
          .value),
        currency_id: StringManipulation.returnNullIfEmpty(clientForm.get('paymentDetails').get('currency_id').value),
        effective_from_date: clientForm
          .get('paymentDetails')
          .get('effective_from_date').value,
        effective_to_date: clientForm
          .get('paymentDetails')
          .get('effective_to_date').value,
        iban: clientForm.get('paymentDetails').get('iban').value,
        is_default_channel: 'N',
        mpayno: clientForm.get('paymentDetails').get('mpayno').value,
        partyAccountId: null,
        preferedChannel: clientForm.get('paymentDetails').get('preferedChannel')
          .value,
      },
      wealthDetails: {
        id: clientForm.get('wealthDetails').get('id').value | 0,
        citizenship_country_id: clientForm
          .get('wealthDetails')
          .get('citizenship_country_id').value,
        marital_status: clientForm.get('wealthDetails').get('marital_status')
          .value,
        funds_source: clientForm.get('wealthDetails').get('funds_source').value,
        occupation_id: clientForm.get('wealthDetails').get('occupation_id')
          .value,
        is_employed: clientForm.get('wealthDetails').get('is_employed').value,
        is_self_employed: clientForm
          .get('wealthDetails')
          .get('is_self_employed').value,
        sector_id: clientForm.get('wealthDetails').get('sector_id').value,
        insurancePurpose: null,
        premiumFrequency: null,
        distributeChannel: null,
        cr_form_required: 'N',
        cr_form_year: 0,
        partyAccountId: null,
      },
      nextOfKinDetailsList: null,
      branchName: branch?.name,
      clientTypeId: this.clientTypeCode,
      organizationId: 2
    };
  }

  private returnLowerCase(data: any) {
    let mapData = data.map((da: any) => {
      da['name'] = da['name'].toLowerCase();
      return da;
    });
    return mapData;
  }

  searchClient() {
    this.spinner_Service.show('client_details_view');
    let clientTyped = this.clientForm.get('client').value || '';
    console.log(clientTyped);

    let details = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS));
    if(details){
      details['client_code'] = clientTyped['id'];
      this.session_storage.set(SESSION_KEY.QUOTE_DETAILS, details);
    }

    this.patchClientDetailsToForm(clientTyped)

    if (clientTyped?.length > 0) {
      this.crm_client_service
        .searchClients(0, 5, clientTyped)
        .pipe(
          finalize(() => {
            this.spinner_Service.hide('client_details_view');
          })
        )
        .subscribe((data: Pagination<ClientDTO>) => {
          this.clientList = data.content.map((client: any) => {
            client['full_name'] = `${client.firstName} ${
              client.lastName ? client.lastName : ''
            }`;
            client['details'] = `${client.firstName} ${
              client.lastName ? client.lastName : ''
            } - ${client?.emailAddress ? client?.emailAddress : ''}`;
            return client;
          });
          this.spinner_Service.hide('search_view');
        });
    } else {
      this.getClientList();
      this.spinner_Service.hide('client_details_view');
    }
  }

  selectClientState() {
    let c_state = this.clientForm.get('clientTypeId').value;
  }
}
