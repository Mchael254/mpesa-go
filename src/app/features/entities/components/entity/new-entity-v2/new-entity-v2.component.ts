import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {HttpClient} from "@angular/common/http";
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../shared/services";
import { FieldModel, FormConfig, Group} from "../../../data/form-config.model";
import {RegexErrorMessages} from "../../../data/field-error.model";
import {MaritalStatusService} from "../../../../../shared/services/setups/marital-status/marital-status.service";
import {MaritalStatus} from "../../../../../shared/data/common/marital-status.model";
import {PaymentModesService} from "../../../../../shared/services/setups/payment-modes/payment-modes.service";
import {PaymentModesDto} from "../../../../../shared/data/common/payment-modes-dto";
import {BankBranchDTO, BankDTO} from "../../../../../shared/data/common/bank-dto";
import {BankService} from "../../../../../shared/services/setups/bank/bank.service";
import {CountryDto} from "../../../../../shared/data/common/countryDto";
import {CountryService} from "../../../../../shared/services/setups/country/country.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {RequiredDocumentDTO} from "../../../../crm/data/required-document";
import {RequiredDocumentsService} from "../../../../crm/services/required-documents.service";
import {ClientTypeService} from "../../../../../shared/services/setups/client-type/client-type.service";
import { ClientTitlesDto, ClientTypeDTO} from "../../../data/ClientDTO";
import {EntityService} from "../../../services/entity/entity.service";
import {PartyTypeDto} from "../../../data/partyTypeDto";
import {ClientService} from "../../../services/client/client.service";

const log = new Logger('NewEntityV2Component');

@Component({
  selector: 'app-new-entity-v2',
  templateUrl: './new-entity-v2.component.html',
  styleUrls: ['./new-entity-v2.component.css']
})
export class NewEntityV2Component implements OnInit {

  entityBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'New Entity',
      url: '/home/entity/new',
    },
  ];

  formFieldPayload!: FormConfig;
  uploadFormFields!: FieldModel[]
  formGroupSections!: any[];
  uploadGroupSections: any/*{ selects: FieldModel[], buttons: FieldModel[] }*/;
  entityForm!: FormGroup;
  uploadForm!: FormGroup;
  language: string = 'en'
  category: string = '';
  idType: string = 'NATIONAL_ID'
  validationObject = {} // todo: add type to this

  regexErrorMessages: RegexErrorMessages = {};

  maritalStatuses: MaritalStatus[] = [];
  paymentModes: PaymentModesDto[] = [];
  banks: BankDTO[] = [];
  bankBranches: BankBranchDTO[] = [];
  countries: CountryDto[] = [];
  roles: PartyTypeDto[] = [];
  clientTypes: ClientTypeDTO[] = [];
  clientTitles: ClientTitlesDto[] = [];

  selectedMaritalStatus: MaritalStatus = null;
  selectedPaymentMode: PaymentModesDto;
  selectedBank: BankDTO = null;
  selectedBankBranch: BankBranchDTO;
  selectedAddressCountry: CountryDto = null;
  selectedCitizenshipCountry: CountryDto = null;
  selectedRole: PartyTypeDto = null;
  selectedClientTitle: ClientTitlesDto = null;
  // selectedIdType: ClientTitlesDto = null;

  wealthAmlFormFields: FieldModel[] = [];
  corporateContactDetailsFormField: FieldModel[] = [];
  corporateAddressDetailsFormField: FieldModel[] = [];
  corporateFinancialDetailsFormField: FieldModel[] = [];
  corporateWealthAmlFormFieldsDetailsFormField: FieldModel[] = [];
  corporateWealthCR12DetailsFormField: FieldModel[] = [];
  corporateWealthOwnershipDetailsFormField: FieldModel[] = [];
  requiredDocuments: RequiredDocumentDTO[];
  privacyPolicyFormFields: FieldModel[] = [];
  payeeDetailsFormFields: FieldModel[] = [];
  branchDetailsFormFields: FieldModel[] = [];

  shouldUploadProfilePhoto: boolean = false;

  protected readonly PhoneNumberFormat = PhoneNumberFormat;
  protected readonly CountryISO = CountryISO;
  protected readonly SearchCountryField = SearchCountryField;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private utilService: UtilService,
    private maritalStatusService: MaritalStatusService,
    private paymentModesService: PaymentModesService,
    private bankService: BankService,
    private countryService: CountryService,
    private globalMessagingService: GlobalMessagingService,
    private requiredDocumentsService: RequiredDocumentsService,
    private clientTypeService: ClientTypeService,
    private entityService: EntityService,
    private clientService: ClientService,
  ) {

    this.uploadForm = this.fb.group({
      fields: this.fb.array([]),
    });

    this.createEntityForm();
  }

  get fields(): FormArray {
    return this.entityForm.get('fields') as FormArray;
  }

  ngOnInit(): void {
    this.fetchUploadFormFields();
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });
  }

  createEntityForm():void {
    this.entityForm = this.fb.group({
      fields: this.fb.array([])
    });
  }

  /**
   * fetches all form categories based on category (individual | corporate)
   * @param category
   */
  fetchFormFields(category: string): void {
    this.http.get<any>( 'assets/data/formFields.json').subscribe({
      next: (data: any) => {
        data.category.forEach((item) => { // todo: define type for item
          if (item.label === category) {
            this.formFieldPayload = item.category;
            const groups: Group[] = item?.groups;
            const fields: FieldModel[] = item?.fields;
            this.orderFormGroup(groups, fields);
            // this.addField(fields);
            log.info('FormFields loaded', item);
            // this.cdr.detectChanges();
          }
        })
      },
      error: err => {
        log.error(err);
      }
    })
  }


  /**
   * fetches all form fields for the upload section
   * defines the roles and category selection dropdowns
   */
  fetchUploadFormFields(): void {
    this.http.get<any>( 'assets/data/uploadFormFields.json').subscribe({
      next: (data: any) => {
        this.uploadFormFields = data.fields;
        log.info('Upload FormFields loaded', data);
        this.addUploadFormFields();
      },
      error: err => {
        log.error(err);
      }
    })
  }

  /**
   * add fields to the entity form
   * @param formGroupSection
   */
  addFieldsToSections(formGroupSection: any[]): void {
    formGroupSection.forEach(section => {
      const group = this.fb.group({});

      section.fields.forEach(field => {
        const control = field.isMandatory
          ? this.fb.control('', Validators.required)
          : this.fb.control('');

        if (field.type === 'text' && field.conditions.length > 0) {
          this.collateValidations(field.conditions)
        }
        group.addControl(field.fieldId, control);
      });

      this.entityForm.addControl(section.groupId, group);
    });

    log.info('Adding fields to sections', this.entityForm);
  }

  /**
   * add fields to the upload form section
   */
  addUploadFormFields(): void {
    const group: { [key: string]: FormControl } = {};

    this.uploadFormFields.forEach((field: FieldModel) => {

      const validators: ValidatorFn[] = [];

      if (field.isMandatory) {
        validators.push(Validators.required);
      }
      group[field.fieldId] = new FormControl('', validators);
    });

    this.uploadForm = this.fb.group(group);
    this.assignUploadFieldsToGroupByType(this.uploadFormFields)
  }


  /**
   * assign form fields to the different sections on the upload form page
   * @param fields
   */
  assignUploadFieldsToGroupByType(fields: FieldModel[]): void {
    let visibleFormFields = fields.filter((field: FieldModel) => field.visible);

    this.uploadGroupSections = {
      selects: [],
      docs: [],
      photo: []
    }

    visibleFormFields.forEach((field: FieldModel) => {
      if (field.type === 'select') {
        this.uploadGroupSections.selects.push(field);
      } else if (field.type === 'button') {
       this.uploadGroupSections.docs.push(field);
      } else if (field.type === 'photo') {
        this.uploadGroupSections.photo.push(field);
      }
    });
    log.info(`upload group sections >>> `, this.uploadGroupSections)
  }


  /**
   * collate all validations that will be used to test different fields
   * @param conditions
   */
  collateValidations(conditions: any[]): void { // todo: define type condition
    conditions.forEach((condition) => {
      const type = condition.value;
      const validators = condition?.config?.validations;
      if (validators && validators.length > 0) {
        this.validationObject[type] = validators;
      }
    })
  }


  /**
   * sort form by groupOrder
   * @param groups
   * @param fields
   */
  orderFormGroup(groups: Group[], fields: FieldModel[]) : void {
    const formGroupSections: any[] = groups?.sort(
      (a: { groupOrder: number; }, b: { groupOrder: number; }) => a.groupOrder - b.groupOrder
    );
    this.assignFieldsToGroupByGroupId(fields, formGroupSections);
  }


  /**
   * assign fields to group on entity screen
   * @param fields
   * @param formGroupSections
   */
  assignFieldsToGroupByGroupId(fields: FieldModel[], formGroupSections: any[]): void { // todo: create Model for formGroupSections
    let visibleFormFields: FieldModel[];
    const formValues = this.uploadForm.getRawValue();

    if (formValues.role === 'client' && formValues.category === 'individual') {
      visibleFormFields = fields.filter((field: FieldModel) => field.visible
        && field.groupId !== 'wealth_aml_details' && field.subGroupId !== 'contact_details' && field.subGroupId !== 'privacy_policy'); // todo: add contact person details

    } else if(formValues.role === 'client' && formValues.category === 'corporate') {
      visibleFormFields = fields.filter((field: FieldModel) => field.visible &&
        field.subGroupId !== 'contact_person_details' && field.subGroupId !== 'privacy_policy' &&
        field.subGroupId !== 'payee_details' && field.subGroupId !== 'branch_details');
    }


    formGroupSections.forEach(section => { // initialize fields to empty array
      section.fields = [];
    })

    visibleFormFields.forEach(field => {
      formGroupSections.forEach(section => {
        if (field.groupId === section.groupId) {
          section.fields.push(field);
        }
      })
    });

    this.formGroupSections = formGroupSections;
    this.addFieldsToSections(formGroupSections);
    this.wealthAmlFormFields = fields.filter(field => field.subGroupId === 'wealth_aml_details');
    this.corporateContactDetailsFormField = fields.filter(field => field.subGroupId === 'contactPersonDetails');
    this.corporateAddressDetailsFormField = fields.filter(field => field.subGroupId === 'branchDetails');
    this.corporateFinancialDetailsFormField = fields.filter(field => field.subGroupId === 'payeeDetails');
    this.corporateWealthAmlFormFieldsDetailsFormField = fields.filter(field => field.subGroupId === 'amlDetails');
    this.corporateWealthCR12DetailsFormField = fields.filter(field => field.subGroupId === 'cr12Details');
    this.corporateWealthOwnershipDetailsFormField = fields.filter(field => field.subGroupId === 'ownershipDetails');
    this.privacyPolicyFormFields = fields.filter(field => field.subGroupId === 'privacy_policy');
    this.payeeDetailsFormFields = fields.filter(field => field.subGroupId === 'payee_details');
    this.branchDetailsFormFields = fields.filter(field => field.subGroupId === 'branch_details');

    log.info(`wealthAmlFormFields >>> `, this.wealthAmlFormFields);
    log.info(`formGroupSections >>> `, this.formGroupSections);
    log.info(`otpFormFields >>> `, this.privacyPolicyFormFields);
    log.info(`payeeDetailsFormFields >>> `, this.payeeDetailsFormFields);
    log.info(`branchDetailsFormFields >>> `, this.branchDetailsFormFields);
  }


  /**
   * save details from form
   * filter out fields with no data
   * create payload for prime identity (primeIdentityPayload)
   */
  saveDetails() : void {
    const formValues = this.entityForm.getRawValue();
    const uploadFormValues = this.uploadForm.getRawValue();

    const requiredDocs = this.uploadGroupSections.docs.map((doc) => {
      return {
        name: doc.requiredDocumentName,
        code: doc.requiredDocumentCode,
        file: doc.file
      }
    });

    const upperDetails = {
      ...uploadFormValues,
      profileImage: this.uploadGroupSections.photo[0].file,
      requiredDocs
    }


    // log.info(`pattern validation errors >>>`, this.regexErrorMessages) // todo: traverse this and check if any validation failed
    if (this.entityForm.valid || true) {
      /*const filtered = Object.fromEntries(
        Object.entries(formValues).filter(([_, value]) => value != null && value !== '')
      );*/

      if (uploadFormValues.category === 'individual') {
        this.saveIndividualClient(formValues, upperDetails);
      } else if (uploadFormValues.category === 'corporate') {}

    } else {
      this.entityForm.markAllAsTouched(); // show validation errors
    }

  }

  saveIndividualClient(formValues, upperDetails): void {

    const payloadObject = {
      ...formValues.prime_identity,
      ...formValues.contact_details,
      ...formValues.privacy_policy,
      ...formValues.residential_address_details,
      ...formValues.wealth_aml_details,
      ...formValues.address_details,
      ...formValues.financial_details,
      ...upperDetails
    }

    const address = {
      boxNumber: "10300",
      countryId: this.selectedAddressCountry?.id,
      houseNumber: payloadObject.houseNo,
      physicalAddress: payloadObject.physicalAddress,
      postalCode: payloadObject.postalCode,
      road: payloadObject.road,
      townId: payloadObject.cityTown,
      stateId: payloadObject.countyState,
      utilityAddressProof: null,
      isUtilityAddress: "N"
    }

    const contactDetails = {
      emailAddress: payloadObject.email,
      phoneNumber: payloadObject.telNumber?.internationalNumber,
      smsNumber: payloadObject.smsNumber?.internationalNumber,
      titleId: this.selectedClientTitle.id,
      contactChannel: payloadObject.preferedChannel,
      websiteUrl: payloadObject.websiteUrl,
      socialMediaUrl: payloadObject.socialMediaUrl,
    }

    const paymentDetails = {
      accountNumber: payloadObject.accountNumber,
      bankBranchId: payloadObject.branchId,
      currencyId: payloadObject.currencyId,
      preferedChannel: this.selectedPaymentMode?.description,
      mpayno: null,
      iban: null,
      swiftCode: null
    }

    const wealthAmlDetails = [ // todo: add wealthAml details
      {
        fundsSource: "1",
        employmentStatus: "SELF_EMPLOYED",
        sectorId: 458,
        occupationId: 187,
        insurancePurpose: "future",
        premiumFrequency: "ad-hoc",
        distributeChannel: "email"
      }
    ]


    const client: any = { // todo: update Model (ClientDTO)
      address,
      contactDetails,
      paymentDetails,
      wealthAmlDetails,
      branches: [],
      contactPersons: [],
      payee: [],
      ownershipDetails: [],
      withEffectFromDate: payloadObject.wef,
      withEffectToDate: payloadObject.wet,
      firstName: payloadObject.otherNames,
      gender: payloadObject.gender,
      lastName: payloadObject.lastName,
      pinNumber: payloadObject.pinNumber,
      category: payloadObject.category,
      countryId: this.selectedAddressCountry?.id,
      clientTypeId: "13",
      dateOfBirth: payloadObject.dateOfBirth,
      modeOfIdentityId: "1",
      idNumber: payloadObject.idNumber /*"37678960"*/,
      branchId: 338,
      maritalStatus: this.selectedMaritalStatus?.value/*"S"*/
    };


    this.clientService.saveClientDetails2(client).subscribe({
      next: (response) => {
        log.info(`client saved >>> `, response);
      },
      error: (error) => {}
    })

    log.info(`clientDto >>> `, client);
  }


  /**
   * process select option based on the item selected
   * @param event
   * @param fieldId
   */
  processSelectOption(event: any, fieldId: string) : void {
    const selectedOption = event.target.value;
    const formValues = this.uploadForm.getRawValue();
    log.info(`processSelectOptions >>> `, selectedOption, fieldId, this.uploadForm.getRawValue());

    switch (fieldId) {
      case 'modeOfIdentityId':
        this.idType = selectedOption;
        break;
      case 'idType':
        // this.
        break;
      case 'language':
        this.language = selectedOption;
        break;
      case 'maritalStatus':
        this.selectedMaritalStatus = this.maritalStatuses.find((m: MaritalStatus) => m.name === selectedOption);
        break;
      case 'bankId':
        this.selectedBank = this.banks.find((b: BankDTO) => b.name === selectedOption);
        break;
      case 'countryId':
        this.selectedAddressCountry = this.countries.find((c: CountryDto) => c.name === selectedOption);
        break;
      case 'citizenshipCountryId':
        this.selectedCitizenshipCountry = this.countries.find((c: CountryDto) => c.name === selectedOption);
        break;
      case 'titleId':
        this.selectedClientTitle = this.clientTitles.find((t: ClientTitlesDto) => t.description === selectedOption);
        break;
      case 'category':
      case 'role':
        this.createEntityForm();
        this.category = formValues.category;
        if (formValues.category && formValues.role) this.fetchFormFields(formValues.category);
        this.updateOrganizationLabel(formValues.category);
        break;
      case 'organizationType':
        this.fetchRequiredDocuments(formValues);
        break;
      default:
          log.info(`no fieldId found`)
    }
  }



  fetchRequiredDocuments(formValues) : void {
    if (formValues.category && formValues.role && formValues.organizationType) {
      const accountType: PartyTypeDto = this.roles.filter(
        (r:PartyTypeDto) => r.partyTypeName.toLowerCase() === formValues.role.toLowerCase())[0];

      const category: string = formValues.category;
      const accountSubType: ClientTypeDTO = this.clientTypes.filter(
        (c: ClientTypeDTO) => c.clientTypeName.toLowerCase() === formValues.organizationType.toLowerCase())[0];
      log.info(`accountSubType >>> `, accountSubType, this.clientTypes);

      this.requiredDocumentsService.getAccountTypeRequiredDocument(accountType.partyTypeShtDesc, category, accountSubType.code, null).subscribe({
        next: (data: RequiredDocumentDTO[]) => {
          this.requiredDocuments = data;
          log.info(`requiredDocuments >>> `, data);
          this.uploadGroupSections.docs = data
        },
        error: (err) => {
          log.error(`could not fetch >>> `, err)
        }
      });

    }
  }

  /**
   * update organization label based on category.
   * if category == individual, label = "client type" ELSE label = "organization type"
   * @param category
   */
  updateOrganizationLabel(category: string) : void {
    this.shouldUploadProfilePhoto = true;
    const index: number = this.uploadFormFields.findIndex(field => field.fieldId === "organizationType");
    if (category === 'corporate') {
      this.uploadFormFields[index].label = {
        en: 'organization type',
        fr: '',
        ke: ''
      }

      this.uploadGroupSections.photo[0].label = {
        en: 'logo',
        fr: '',
        ke: ''
      }
    } else {
      this.uploadFormFields[index].label = {
        en: 'client type',
        fr: '',
        ke: ''
      }
    }
  }


  /**
   * fetch dropdown options from API
   * check fieldId to determine which API to call
   * @param groupId
   * @param fieldId
   */
  fetchSelectOptions(groupId: string, fieldId: string): void {
    log.info(`field to populate >>> `, fieldId);
    let sectionIndex: number, fieldIndex: number;
    if (this.formGroupSections) {
      sectionIndex = this.formGroupSections?.findIndex(section => section.groupId === groupId);
      fieldIndex = this.formGroupSections[sectionIndex]?.fields.findIndex((field: FieldModel) => field.fieldId === fieldId);
    }

    if ( this.formGroupSections &&
      this.formGroupSections[sectionIndex]?.fields[fieldIndex]?.options?.length > 0 &&
      (!['bankId', 'bankBranchCode'].includes(fieldId))
    ) return // if options already have value, don't call endpoint

    switch (fieldId) {
      case 'maritalStatus':
        this.fetchMaritalStatuses(sectionIndex, fieldIndex)
        break;
      case 'paymentMethod':
        this.fetchPaymentModes(sectionIndex, fieldIndex);
        break;
      case 'bankId':
        this.fetchBanks(sectionIndex, fieldIndex);
        break
      case 'bankBranchCode':
        this.fetchBankBranches(sectionIndex, fieldIndex);
        break
      case 'countryId':
      case 'citizenshipCountryId':
        this.fetchCountries(sectionIndex, fieldIndex);
        break
      case 'organizationType':
        this.fetchOrganizationTypes();
        break;
      case 'role':
        this.fetchSystemRoles()
        break;
      case 'titleId':
        this.fetchClientTitles(sectionIndex, fieldIndex)
        break;
      default:
        log.info(`no fieldId found`)
    }
  }


  /**
   * validate regex
   * @param field
   * @param groupId
   */
  validateRegex(field: FieldModel, groupId: string): void {

    const fieldId = field.fieldId;
    let pattern: RegExp;
    let input: string;
    let errorMessage: string;

    switch (fieldId) {
      case 'idNumber':
        // compare idType and search validation types
        const regexToUse = {};
        for (const key of Object.keys(this.validationObject)) {
          if (key === this.idType) {
            regexToUse[key] = this.validationObject[key];
          }
        }

        pattern = regexToUse[this.idType][0].type === 'pattern'
          ? new RegExp(regexToUse[this.idType][0].value)
          : null;

        input =  this.entityForm.get(`${groupId}.${fieldId}`)?.value;
        errorMessage = regexToUse[this.idType][0].message[this.language];
        this.generateRegexErrorMessage(pattern, input, errorMessage, fieldId);

        break;

      default:
        pattern = new RegExp(field.validations[0]?.value);
        input =  this.entityForm.getRawValue()[groupId][fieldId];
        errorMessage = field.validations[0]?.message[this.language];
        this.generateRegexErrorMessage(pattern, input, errorMessage, fieldId);
    }

    log.info(`regex to use`, this.regexErrorMessages, groupId);

  }

  /**
   * generate error messages for regex
   * @param pattern
   * @param input
   * @param errorMessage
   * @param fieldId
   */
  generateRegexErrorMessage(pattern: RegExp, input: string, errorMessage: string, fieldId: string): void {
    if (pattern.test(input)) {
      this.regexErrorMessages[fieldId] = {
        showErrorMessage: false,
        errorMessage: ''
      }
    } else {
      this.regexErrorMessages[fieldId] = {
        showErrorMessage: true,
        errorMessage: errorMessage
      }
    }
  }


  /**
   * get field control to display validation errors
   * @param groupId
   * @param fieldId
   */
  getFieldControl(groupId: string, fieldId: string) {
    return this.entityForm.get(`${groupId}.${fieldId}`);
  }


  /**
   * fetches all marital statuses when required by user.
   * get the index of the selected section using groupId
   * get the index of the selected field using fieldId
   * create an array of strings from marital object and assign to options of the marital status formField
   */
  fetchMaritalStatuses(sectionIndex:number, fieldIndex: number): void {
        this.maritalStatusService.getMaritalStatus().subscribe({
      next: (data: MaritalStatus[]) => {
        this.maritalStatuses = data
        const maritalStatusStringArr: string[] = data.map((status: MaritalStatus) => status.name);
        this.formGroupSections[sectionIndex].fields[fieldIndex].options = maritalStatusStringArr
        log.info(`maritalStatus: `, maritalStatusStringArr);
      },
      error: err => {
        log.error(`could not fetch maritalStatus: `, err);
      }
    })
  }


  /**
   * fetches all paymentModes when required by user.
   * get the index of the selected section using groupId
   * get the index of the selected field using fieldId
   * create an array of strings from paymentModes object and assign to options of the paymentModes formField
   */
  fetchPaymentModes(sectionIndex:number, fieldIndex: number): void {
    this.paymentModesService.getPaymentModes().subscribe({
      next: (data: PaymentModesDto[]) => {
        this.paymentModes = data
        const paymentModesStringArr: string[] = data.map((paymentMode: PaymentModesDto) => paymentMode.description);
        this.formGroupSections[sectionIndex].fields[fieldIndex].options = paymentModesStringArr
        log.info(`payment Modes: `, paymentModesStringArr);
      },
      error: err => {
        log.error(`could not fetch payment modes: `, err);
      }
    })
  }

  /**
   * fetches all banks when required by user.
   * get the index of the selected section using groupId
   * get the index of the selected field using fieldId
   * create an array of strings from banks object and assign to options of the banks formField
   */
  fetchBanks(sectionIndex:number, fieldIndex: number): void {
    const countryId: number = this.selectedAddressCountry?.id;
    this.bankService.getBanks(countryId).subscribe({
      next: (data: BankDTO[]) => {
        this.banks = data
        const bankStringArr: string[] = data.map((bank: BankDTO) => bank.name);
        this.formGroupSections[sectionIndex].fields[fieldIndex].options = bankStringArr
        log.info(`banks: `, bankStringArr);
      },
      error: err => {
        log.error(`could not fetch : `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', 'You have not selected a country!');
      }
    })
  }


  /**
   * fetch bank branches by bankId
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchBankBranches(sectionIndex:number, fieldIndex: number): void {
    const bankId: number = this.selectedBank?.id;
    this.bankBranches = [];
    log.info(`selected bank >>> `, this.selectedBank)
    this.bankService.getBankBranchesByBankId(bankId).subscribe({
      next: (data: BankBranchDTO[]) => {
        this.bankBranches = data;
        const bankBranchStringArr: string[] = data.map((branch: BankBranchDTO) => branch.name);
        this.formGroupSections[sectionIndex].fields[fieldIndex].options = bankBranchStringArr
        log.info(`bank branches: `, bankBranchStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', 'You have not selected a bank!');
      }
    })
  }


  /**
   * fetch countries
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchCountries(sectionIndex:number, fieldIndex: number): void {
    log.info(`selected bank >>> `, this.selectedAddressCountry)
    this.countryService.getCountries().subscribe({
      next: (data: CountryDto[]) => {
        this.countries = data;
        const countryStringArr: string[] = data.map((country: CountryDto) => country.name);
        this.formGroupSections[sectionIndex].fields[fieldIndex].options = countryStringArr
        log.info(`bank bank: `, countryStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
      }
    })
  }


  fetchClientTitles(sectionIndex:number, fieldIndex: number): void {
    this.clientService.getClientTitles().subscribe({
      next: (data: ClientTitlesDto[]) => {
        this.clientTitles = data;
        const titleStringArr: string[] = data.map((title: ClientTitlesDto) => title.description.toLowerCase());
        this.formGroupSections[sectionIndex].fields[fieldIndex].options = titleStringArr;
        log.info(`client titles >>> `, titleStringArr)
      },
      error: err => {
        log.error(`could not fetch: `, err);
      }
    })
  }


  fetchSystemRoles(): void {
    this.entityService.getPartiesType().subscribe({
      next: (data: PartyTypeDto[]) => {
        this.roles = data;
        const roleStringArr: string[] = data.map((role: PartyTypeDto) => role.partyTypeName.toLowerCase());
        const index: number = this.uploadGroupSections.selects.findIndex((field: FieldModel) => field.fieldId === "role");
        this.uploadGroupSections.selects[index].options = roleStringArr;
        log.info(`roles: `, roleStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
      }
    })
  }

  fetchSavedDetails(eventData:any) {
    log.debug('Save details modal data:', eventData);
  }


  fetchOrganizationTypes(): void {
    const role = this.uploadForm.getRawValue().role.toLowerCase();
    log.info(`role to fetch with >>> `, role);
    switch (role) {
      case 'client':
        this.fetchClientTypes()
        break;
      case 'agent':
          //
        break;
    }
  }

  fetchClientTypes(): void {
    this.clientTypeService.getClientTypes().subscribe({
      next: (data: ClientTypeDTO[]) => {
        this.clientTypes = data;
        const clientTypesArr: string[] = data.map((clientType: ClientTypeDTO) => clientType.clientTypeName);
        log.info(`clientTypesArr>>> `, clientTypesArr);
        const index: number = this.uploadGroupSections.selects.findIndex(field => field.fieldId === "organizationType");
        this.uploadGroupSections.selects[index].options = clientTypesArr;
      },
      error: err => {
        log.error(`could not fetch `, err);
      }
    });
  }


  /**
   * process file selection
   * @param event
   * @param docToUpload
   */
  onFileSelected(event: Event, docToUpload: RequiredDocumentDTO, uploadType: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (uploadType === 'doc') {
        const index = this.uploadGroupSections.docs.findIndex((doc: RequiredDocumentDTO) => doc.id === docToUpload.id);
        this.uploadGroupSections.docs[index].file = file;
      } else if (uploadType === 'profile') {
        this.uploadGroupSections.photo[0].file = file;
      }
    }
  }


}
