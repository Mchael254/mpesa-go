import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../shared/services";
import {RegexErrorMessages} from "../../../data/field-error.model";
import {MaritalStatusService} from "../../../../../shared/services/setups/marital-status/marital-status.service";
import {MaritalStatus} from "../../../../../shared/data/common/marital-status.model";
import {PaymentModesService} from "../../../../../shared/services/setups/payment-modes/payment-modes.service";
import {PaymentModesDto} from "../../../../../shared/data/common/payment-modes-dto";
import {BankBranchDTO, BankDTO, CurrencyDTO} from "../../../../../shared/data/common/bank-dto";
import {BankService} from "../../../../../shared/services/setups/bank/bank.service";
import {CountryDto, PostalCodesDTO, StateDto, TownDto} from "../../../../../shared/data/common/countryDto";
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
import {IdentityModeDTO} from "../../../data/entityDto";
import {CurrencyService} from "../../../../../shared/services/setups/currency/currency.service";
import {
  Branch,
  ContactDetails,
  Cr12Detail,
  OwnerDetail,
  Payee,
  WealthAmlDTO
} from "../../../data/accountDTO";
import {DmsService} from "../../../../../shared/services/dms/dms.service";
import {DmsDocument} from "../../../../../shared/data/common/dmsDocument";
import {
  DynamicScreensSetupService
} from "../../../../../shared/services/setups/dynamic-screen-config/dynamic-screens-setup.service";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto, SubModulesDto
} from "../../../../../shared/data/common/dynamic-screens-dto";

const log = new Logger('NewEntityV2Component');

@Component({
  selector: 'app-new-entity-v2',
  templateUrl: './new-entity-v2.component.html',
  styleUrls: ['./new-entity-v2.component.css']
})
export class NewEntityV2Component implements OnInit, OnChanges {

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

  uploadFormFields!: ConfigFormFieldsDto[]
  formGroupSections!: any[]; // {}
  uploadGroupSections: any/*{ selects: FieldModel[], buttons: FieldModel[] }*/;
  entityForm!: FormGroup;
  uploadForm!: FormGroup;
  language: string = 'en'
  category: string = '';
  role: string = '';
  idType: string = 'NATIONAL_ID'
  validationObject = {} // todo: add type to this

  regexErrorMessages: RegexErrorMessages = {};

  maritalStatuses: MaritalStatus[] = [];
  paymentModes: PaymentModesDto[] = [];
  banks: BankDTO[] = [];
  bankBranches: BankBranchDTO[] = [];
  countries: CountryDto[] = [];
  states: StateDto[] = [];
  towns: TownDto[] = [];
  postalCodes: PostalCodesDTO[] = []
  roles: PartyTypeDto[] = [];
  clientTypes: ClientTypeDTO[] = [];
  clientTitles: ClientTitlesDto[] = [];
  idTypes: IdentityModeDTO[] = [];
  currencies: CurrencyDTO[] = [];

  selectedMaritalStatus: MaritalStatus = null;
  selectedPaymentMode: PaymentModesDto;
  selectedBank: BankDTO = null;
  selectedBankBranch: BankBranchDTO;
  selectedAddressCountry: CountryDto = null;
  selectedCitizenshipCountry: CountryDto = null;
  selectedState: StateDto = null;
  selectedTown: TownDto = null;
  selectedPostalCode: PostalCodesDTO = null;
  selectedRole: PartyTypeDto = null;
  selectedClientTitle: ClientTitlesDto = null;
  selectedIdType: IdentityModeDTO = null;
  selectedCurrency: CurrencyDTO = null;

  wealthAmlFormFields: ConfigFormFieldsDto[] = [];
  corporateContactDetailsFormField: ConfigFormFieldsDto[] = [];
  corporateAddressDetailsFormField: ConfigFormFieldsDto[] = [];
  corporateFinancialDetailsFormField: ConfigFormFieldsDto[] = [];
  corporateWealthAmlFormFieldsDetailsFormField: ConfigFormFieldsDto[] = [];
  corporateWealthCR12DetailsFormField: ConfigFormFieldsDto[] = [];
  corporateWealthOwnershipDetailsFormField: ConfigFormFieldsDto[] = [];
  requiredDocuments: RequiredDocumentDTO[];
  privacyPolicyFormFields: ConfigFormFieldsDto[] = [];

  wealthAmlDetails: WealthAmlDTO[] = [];
  contactPersonDetails: ContactDetails[] = [];
  branchDetails: Branch[] = [];
  payeeDetails: Payee[] = [];
  ownershipDetails: OwnerDetail[] = [];
  cr12Details: Cr12Detail[] = [];

  shouldUploadProfilePhoto: boolean = false;
  isCategorySelected: boolean = false;
  profilePicture: any; // todo: define types
  photoPreviewUrl: string;
  clientFiles: File[] = []
  filesToUpload: DmsDocument[] = [];
  clientDocumentData: any = null; // todo: define types
  isReadingDocuments: boolean = false;

  isPatchingFormValues: boolean = false;

  collapsedGroups: Set<string> = new Set();

  protected readonly PhoneNumberFormat = PhoneNumberFormat;
  protected readonly CountryISO = CountryISO;
  protected readonly SearchCountryField = SearchCountryField;
  @Input() previewFormFields: any;
  clientSetupData: DynamicScreenSetupDto;
  subModules: SubModulesDto[] = [];
  isPreviewMode: boolean = false;
  dynamicSetupData: DynamicScreenSetupDto;
  initialUploadFormFields!: ConfigFormFieldsDto[];
  originalFormId: string;

  constructor(
    private fb: FormBuilder,
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
    private currencyService: CurrencyService,
    private dmsService: DmsService,
    private dynamicScreensSetupService: DynamicScreensSetupService,
    private cdr: ChangeDetectorRef,
  ) {

    this.uploadForm = this.fb.group({
      fields: this.fb.array([]),
    });

    this.createEntityForm();
    this.collapsedGroups.add('cnt_individual_prime_identity');
    this.collapsedGroups.add('cnt_corporate_prime_identity');
  }

  get fields(): FormArray {
    return this.entityForm.get('fields') as FormArray;
  }

  ngOnInit(): void {
    this.fetchSubModules();
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });

    if (!this.previewFormFields) {
      this.fetchUploadFormFields();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('previewFormFields' in changes) {
      const curr = changes['previewFormFields']?.currentValue;

      if (curr) {
        this.isPreviewMode = true;
        this.originalFormId = this.previewFormFields?.forms?.formId;
        this.category = curr.forms?.originalLabel?.toLowerCase();
        this.isCategorySelected = !!curr.forms?.formId;

        this.updateFormFields();
      }
      this.cdr.detectChanges();
    }
  }

  updateFormFields() {
    this.dynamicScreensSetupService.fetchDynamicSetupByScreen(null, this.previewFormFields?.screens?.screenId)
      .subscribe({
        next: (data) => {
          this.dynamicSetupData = data;
          log.info("dynamic setup>>", data);

          this.uploadFormFields = data.fields.filter(field => field.screenCode === null);
          this.addUploadFormFields();
          this.shouldUploadProfilePhoto = true;

          this.dynamicSetupData.fields = this.dynamicSetupData.fields.map(field => {
            const matchedField = this.previewFormFields.fields.find(formField => formField.code === field.code);
            if (matchedField) {
              return matchedField;
            }
            return field;
          });

          this.dynamicSetupData.groups = this.previewFormFields.groups.filter(formGroup =>
            this.dynamicSetupData.groups.some(group => group.formId === formGroup.formId)
          );

          const groups: FormGroupsDto[] = this.dynamicSetupData?.groups;
          const fields: ConfigFormFieldsDto[] = this.dynamicSetupData?.fields;

          this.orderFormGroup(groups, fields);
          log.info('Updated form fields', this.dynamicSetupData.fields, groups, fields);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
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
  fetchFormFields(category: string, role: string): void {
    const selectedRole = this.roles.find(partyTypeShtDesc => partyTypeShtDesc.partyTypeName.toLowerCase() === role);

    this.dynamicScreensSetupService.fetchDynamicSetupByScreen(null, null, null, this.subModules[0].subModuleId, selectedRole.partyTypeShtDesc)
      .subscribe({
        next: (data) => {
          this.clientSetupData = data;
          log.info("client setup>>", data);

          const originalFormId = data?.forms.find(form => form.originalLabel.toLowerCase() === category);
          this.originalFormId = originalFormId?.formId;

          const groups: FormGroupsDto[] = data?.groups.filter(
            group => group.formId === originalFormId?.formId
          );

          const fields: ConfigFormFieldsDto[] = data?.fields;
          this.orderFormGroup(groups, fields);

          const upload = data.fields.filter(field => field.formGroupingId === null && field.formId === originalFormId?.formId);
          this.uploadFormFields = [...this.initialUploadFormFields];
          this.uploadFormFields.push(...upload);

          this.addUploadFormFields();

          this.uploadForm.controls['role'].setValue(
            this.role
          );
          this.uploadForm.controls['category'].setValue(
            this.category
          );
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }


  /**
   * fetches all form fields for the upload section
   * defines the roles and category selection dropdowns
   */
  fetchUploadFormFields(): void {
    this.dynamicScreensSetupService.fetchFormFields(1, null)
      .subscribe({
        next: (data) => {
          this.uploadFormFields = data;
          this.initialUploadFormFields = data;
          // this.uploadFormFields = data.fields.filter(field => field.screenCode === null);
          this.addUploadFormFields();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }

  /**
   * add fields to the entity form
   * @param formGroupSection
   */
  addFieldsToSections(formGroupSection: any[]): void {
    formGroupSection.forEach(section => {
      const group = this.fb.group({});

      section.fields.forEach(field => {
        const control = field.mandatory
          ? this.fb.control('', Validators.required)
          : this.fb.control('');

        if (field.type === 'text' && field?.conditions?.length > 0) {
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

    this.uploadFormFields.forEach(field => {
      const validators = this.utilService.buildValidators(field);
      group[field.fieldId] = new FormControl('', validators);
    });

    this.uploadForm = this.fb.group(group);
    this.assignUploadFieldsToGroupByType(this.uploadFormFields)
  }


  /**
   * assign form fields to the different sections on the upload form page
   * @param fields
   */
  assignUploadFieldsToGroupByType(fields: ConfigFormFieldsDto[]): void {
    let visibleFormFields = fields.filter((field: ConfigFormFieldsDto) => field.visible);

    this.uploadGroupSections = {
      selects: [],
      docs: [],
      photo: []
    }

    visibleFormFields.forEach((field: ConfigFormFieldsDto) => {
      if (field.type === 'select') {
        this.uploadGroupSections.selects.push(field);
      } else if (field.type === 'button') {
       this.uploadGroupSections.docs.push(field);
      } else if (field.type === 'file') {
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
  orderFormGroup(groups: FormGroupsDto[], fields: ConfigFormFieldsDto[]) : void {
    const formGroupSections: any[] = groups?.sort(
      (a: { order: number; }, b: { order: number; }) => a.order - b.order
    );

    const fieldOrder: any[] = fields?.sort(
      (a: { order: number; }, b: { order: number; }) => a.order - b.order
    );

    this.assignFieldsToGroupByGroupId(fieldOrder, formGroupSections);
  }


  /**
   * assign fields to group on entity screen
   * @param fields
   * @param formGroupSections
   */
  assignFieldsToGroupByGroupId(fields: ConfigFormFieldsDto[], formGroupSections: any[]): void {
    const visibleFormFields = this.getFilteredFields(fields);

    formGroupSections.forEach(section => {
      section.fields = [];
    });

    visibleFormFields.forEach(field => {
      const section = formGroupSections.find(s => s.groupId === field.formGroupingId);
      if (section) {
        section.fields.push(field);
      }
    });

    this.formGroupSections = formGroupSections;
    this.addFieldsToSections(formGroupSections);

    this.wealthAmlFormFields = fields.filter(field => field.formSubGroupingId === 'cnt_individual_aml_details');
    this.corporateContactDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_contact_person_details');
    this.corporateAddressDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_branch_details');
    this.corporateFinancialDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_payee_details');
    this.corporateWealthAmlFormFieldsDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_aml_details');
    this.corporateWealthCR12DetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_cr12_details');
    this.corporateWealthOwnershipDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_ownership_details');
    this.privacyPolicyFormFields = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_privacy_policy');
  }

  /**
   * Filters form fields based on preview mode and form type
   * @param fields Array of form fields to filter
   * @returns Filtered array of form fields
   */
  private getFilteredFields(fields: ConfigFormFieldsDto[]): ConfigFormFieldsDto[] {
    const formValues = this.uploadForm?.getRawValue();
    const isIndividual = this.isPreviewMode
      ? this.previewFormFields?.forms?.formId === this.originalFormId
      : formValues?.role === this.role && formValues?.category === 'individual';

    const isCorporate = this.isPreviewMode
      ? this.previewFormFields?.forms?.formId === this.originalFormId
      : formValues?.role === this.role && formValues?.category === 'corporate';

    if (isIndividual) {
      return fields.filter(field =>
        field.visible &&
        field.formId === this.originalFormId &&
        field.formGroupingId !== 'cnt_individual_wealth_aml_details' &&
        field.formSubGroupingId !== 'cnt_individual_privacy_policy'
      );
    }

    if (isCorporate) {
      const excludedSubGroups = [
        'cnt_corporate_contact_person_details',
        'cnt_corporate_privacy_policy',
        'cnt_corporate_payee_details',
        'cnt_corporate_branch_details'
      ];

      return fields.filter(field =>
        field.visible &&
        field.formId === this.originalFormId &&
        !excludedSubGroups.includes(field.formSubGroupingId) &&
        field.formGroupingId !== 'cnt_corporate_wealth_aml_details'
      );
    }

    return [];
  }

  /**
   * save details from form
   * filter out fields with no data
   * create payload for prime identity (primeIdentityPayload)
   */
  saveDetails() : void {
    // this.uploadDocumentToDms();

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

    log.info(`pattern validation errors >>>`, this.regexErrorMessages) // todo: traverse this and check if any regex validation failed
    log.info(`entity form >>>`, this.getInvalidControls(this.entityForm))

    if (this.entityForm.valid) {
      this.saveToDatabase(formValues, upperDetails);
    } else {
      this.entityForm.markAllAsTouched(); // show validation errors
    }
  }

  /**
   * This method is primarily for debugging purposes only. It has no side effects
   * @param formGroup
   */
  getInvalidControls(formGroup: FormGroup | FormArray): string[] {
    const invalidControls: string[] = [];

    const collectInvalid = (group: FormGroup | FormArray, path = '') => {
      Object.keys(group.controls).forEach(controlName => {
        const control = group.get(controlName);

        const currentPath = path ? `${path}.${controlName}` : controlName;

        if (control instanceof FormGroup || control instanceof FormArray) {
          collectInvalid(control, currentPath);
        } else if (control && control.invalid) {
          invalidControls.push(currentPath);
        }
      });
    };

    collectInvalid(formGroup);
    return invalidControls;
  }


  /**
   * Save the details to database
   * Create a clientObject for database posting
   * Call function to upload logo/profilePicture, uploadDocsToDms
   * @param formValues
   * @param upperDetails
   */
  saveToDatabase(formValues, upperDetails): void { // todo: define model for formValues & upperDetails
    const payloadObject = {
      ...formValues.cnt_individual_prime_identity,
      ...formValues.cnt_individual_contact_details,
      ...formValues.cnt_individual_privacy_policy,
      ...formValues.cnt_individual_residential_address_details,
      ...formValues.cnt_individual_wealth_aml_details,
      ...formValues.cnt_individual_address_details,
      ...formValues.cnt_individual_financial_details,
      ...formValues.cnt_corporate_prime_identity,
      ...formValues.cnt_corporate_contact_details,
      ...formValues.cnt_corporate_privacy_policy,
      ...formValues.cnt_corporate_residential_address_details,
      ...formValues.cnt_corporate_wealth_aml_details,
      ...formValues.cnt_corporate_address_details,
      ...formValues.cnt_corporate_financial_details,
      ...upperDetails
    }
    log.info(`payloadObject >>>`, payloadObject, formValues);
    const address = {
      boxNumber: "10300",
      countryId: this.selectedAddressCountry?.id,
      houseNumber: payloadObject.houseNo,
      physicalAddress: payloadObject.physicalAddress,
      postalCode: 22001 /*parseInt(payloadObject.postalCode)*/,
      road: payloadObject.road,
      townId: this.selectedTown?.id,
      stateId: this.selectedState?.id,
      utilityAddressProof: null,
      isUtilityAddress: "N"
    }

    const contactDetails = {
      emailAddress: payloadObject.email,
      phoneNumber: payloadObject.telNumber?.internationalNumber,
      smsNumber: payloadObject.smsNumber?.internationalNumber,
      titleId: this.selectedClientTitle?.id,
      contactChannel: payloadObject.contactChannel,
      websiteUrl: payloadObject.websiteUrl,
      socialMediaUrl: payloadObject.socialMediaUrl,
    }

    const paymentDetails = {
      accountNumber: payloadObject.accountNumber,
      bankBranchId: this.selectedBankBranch?.id,
      currencyId: this.selectedCurrency?.id,
      preferedChannel: payloadObject.paymentMethod,
      mpayno: payloadObject.cnt_individual_financial_details_mobile_number,
      iban: payloadObject.intlBankAccountNumber,
      swiftCode: payloadObject.swiftCode
    }

    /*Note:
    wealthAmlDetails, branches, contactPersons, payee, ownershipDetails should be arrays
    I have just mapped the correct field ids*/
    const branches = {
      code: payloadObject.id,
      branchName: payloadObject.cnt_corporate_branch_details_name,
      countryId: payloadObject.country,
      stateId: payloadObject.county,
      townId: payloadObject.town,
      physicalAddress: payloadObject.cnt_corporate_branch_details_physicalAddress,
      email: payloadObject.cnt_corporate_branch_email,
    }

    const contactPersons = {
      clientTitleCode: payloadObject.titleId,
      name: payloadObject.name,
      idNumber: payloadObject.docIdNumber,
      email: payloadObject.emailAddress,
      mobileNumber: payloadObject.phoneNumber,
      wef: payloadObject.cnt_corporate_contact_person_details_wef,
      wet: payloadObject.cnt_corporate_contact_person_details_wet,
    }

    const payee = {
      name: payloadObject.payee_details_name,
      idNo: payloadObject.cnt_corporate_payee_docIdNumber,
      mobileNo: payloadObject.cnt_corporate_payee_mobileNumber,
      email: payloadObject.payee_email_address,
      // payloadObject.bankName,
      // payloadObject.branchName,
      accountNumber: payloadObject.cnt_corporate_payee_accountNumber,
    }

    const wealthAmlDetails = [{
      fundsSource: payloadObject.source_of_fund || payloadObject.sourceOfFundAml,
      employmentStatus: payloadObject.type_of_employment,
      sectorId: payloadObject.economicSector || payloadObject.economicSectorAml,
      occupationId: payloadObject.occupation,
      insurancePurpose: payloadObject.purposeOfInsurance,
      premiumFrequency: payloadObject.premiumFrequency,
      distributeChannel: payloadObject.distributionChannel,
      tradingName: payloadObject.tradingName,
      registeredName: payloadObject.registeredName,
      certificateRegistrationNumber: payloadObject.certificateRegistrationNumber,
      certificateYearOfRegistration: payloadObject.certificateRegistrationYear,
      parentCountryId: payloadObject.parentCountry,
      operatingCountryId: payloadObject.operatingCountry,

      /*Note: cr12 details[] should be part of wealthAmlDetails[]*/
    }]

    const cr12Details = {
      directorName: payloadObject.cr12_name,
      directorIdRegNo: payloadObject.companyRegistrationNumber,
      directorDob: payloadObject.companyRegistrationDate,
      address: payloadObject.cr12_details_address,
      certificateReferenceNo: payloadObject.referenceNumber,
      certificateRegistrationYear: payloadObject.referenceNumberYear,
    }

    const ownershipDetails = [{
      name: payloadObject.cnt_corporate_ownership_details_name,
      idNumber: payloadObject.cnt_corporate_ownership_details_docIdNumber,
      contactPersonPhone: payloadObject.contactPersonPhone,
      percentOwnership: payloadObject.percentOwnership,
    }]

    // const wealthAmlDetails = this.wealthAmlDetails;
    // const branches = this.branchDetails;
    // const contactPersons = this.contactPersonDetails;
    // const payee = this.payeeDetails;
    // const ownershipDetails = this.ownershipDetails;
    // const cr12Details = this.cr12Details;


    const client: any = { // todo: update Model (ClientDTO)
      address,
      contactDetails,
      paymentDetails,
      wealthAmlDetails,
      branches,
      contactPersons,
      payee,
      ownershipDetails,
      cr12Details,
      withEffectFromDate: payloadObject.wef,
      withEffectToDate: payloadObject.wet,
      firstName: this.category === 'corporate' ? payloadObject.entityName.substring(0, payloadObject.entityName.indexOf(' ')) : payloadObject.otherNames,
      gender: payloadObject.gender,
      lastName: this.category === 'corporate' ? payloadObject.entityName.substring(payloadObject.entityName.indexOf(' ') + 1) : payloadObject.lastName,
      pinNumber: payloadObject.pinNumber /*A487438114W*/,
      category: payloadObject.category,
      countryId: this.selectedAddressCountry?.id,
      clientTypeId: "13" || "14",
      dateOfBirth: payloadObject.dateOfBirth || payloadObject.dateOfIncorporation,
      modeOfIdentityId: this.selectedIdType?.id,
      idNumber: payloadObject.idNumber || payloadObject.businessRegNumber /*"37678960"*/ /*99245/6789Z*/,
      branchId: 338,
      maritalStatus: this.selectedMaritalStatus?.value/*"S"*/,
      partyId: 3661
    };

    log.info(`clientDto >>> `, client);

    this.clientService.saveClientDetails2(client).subscribe({
      next: (response) => {
        log.info(`client saved >>> `, response);
        this.uploadImage(this.profilePicture, response.partyId)
        this.uploadDocumentToDms();
      },
      error: (error) => {
        log.info(`could not save`, error);
      }
    })
  }


  /**
   * Upload documents to DMS after saving client and uploading profileImage/logo
   */
  uploadDocumentToDms(): void {
    log.info(` client files to upload >>> `, this.filesToUpload)
    this.dmsService.saveClientDocs(this.filesToUpload).subscribe({
      next: (res: any) => {
        log.info(`document uploaded successfully!`, res);
      },
      error: (err) => {
        log.info(`upload failed!`)
      }
    });
  }

  /**
   * process select option based on the item selected
   * @param event
   * @param fieldId
   */
  processSelectOption(event: any, fieldId: string) : void {
    if (this.isPreviewMode === true) {
      return;
    }
    const selectedOption = event.target.value;
    const formValues = this.uploadForm.getRawValue();
    log.info(`processSelectOptions >>> `, selectedOption, fieldId);

    switch (fieldId) {
      case 'modeOfIdentityId':
        this.selectedIdType = this.idTypes.find((type) => type.name === selectedOption);
        this.idType = selectedOption;
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
      case 'countyState':
        this.selectedState = this.states.find((state: StateDto) => state.name === selectedOption);
        break;
      case 'cityTown':
      case 'city_town':
        this.selectedTown = this.towns.find((town: TownDto) => town.name === selectedOption);
        break;
      case 'postalCode':
        this.selectedPostalCode = this.postalCodes.find((postalCode: PostalCodesDTO) => postalCode.zipCode === selectedOption);
        break;
      case 'titleId':
        this.selectedClientTitle = this.clientTitles.find((t: ClientTitlesDto) => t.description === selectedOption);
        log.info(`selectedClientTitle >>> `, selectedOption, this.selectedClientTitle);
        break;
      case 'currencyId':
        this.selectedCurrency = this.currencies.find((c: CurrencyDTO) => c.name === selectedOption);
        log.info(`selectedCurrency >>> `, selectedOption, this.selectedClientTitle);
        break;
      case 'category':
      case 'role':
        this.createEntityForm();
        this.category = formValues.category;
        this.role = formValues.role;
        if (formValues.category && formValues.role) this.fetchFormFields(formValues.category, formValues.role);

        this.idType = this.category ==='corporate' ? 'CERT_OF_INCOP_NUMBER' : 'NATIONAL_ID';
        this.isCategorySelected = formValues.category ? true : false;
        this.shouldUploadProfilePhoto = true;
        break;
      case 'organizationType':
      case 'clientType':
        this.fetchRequiredDocuments(formValues);
        break;
      case 'bankBranchCode':
        this.selectedBankBranch = this.bankBranches.find((b: BankBranchDTO) => b.name === selectedOption);
        log.info(`selectedbank branch >>> `, selectedOption, this.selectedBankBranch);
        break;
      default:
          log.info(`no fieldId found`)
    }
  }


  /**
   * fetched list of required documents based on entity/client type
   * @param formValues
   */
  fetchRequiredDocuments(formValues) : void {
    const selectedOrgOrClientType = formValues.organizationType || formValues.clientType;
    if (formValues.category && formValues.role && selectedOrgOrClientType && this.isCategorySelected) {
      const accountType: PartyTypeDto = this.roles.filter(
        (r:PartyTypeDto) => r.partyTypeName.toLowerCase() === formValues.role.toLowerCase())[0];

      const category: string = formValues.category;
      const accountSubType: ClientTypeDTO = this.clientTypes.filter(
        (c: ClientTypeDTO) => c.clientTypeName.toLowerCase() === selectedOrgOrClientType.toLowerCase())[0];
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
  /*updateOrganizationLabel(category: string) : void {
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
  }*/


  /**
   * fetch dropdown options from API
   * check fieldId to determine which API to call
   * @param groupId
   * @param fieldId
   */
  fetchSelectOptions(groupId: string, fieldId: string): void {
    if (this.isPreviewMode === true) {
      return;
    }
    log.info(`field to populate >>> `, fieldId);
    let sectionIndex: number, fieldIndex: number;
    if (this.formGroupSections) {
      sectionIndex = this.formGroupSections?.findIndex(section => section.groupId === groupId);
      fieldIndex = this.formGroupSections[sectionIndex]?.fields.findIndex((field: ConfigFormFieldsDto) => field.fieldId === fieldId);
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
        break;
      case 'bankBranchCode':
        this.fetchBankBranches(sectionIndex, fieldIndex);
        break;
      case 'countryId':
      case 'citizenshipCountryId':
        this.fetchCountries(sectionIndex, fieldIndex);
        break;
      case 'countyState':
        this.fetchStatesByCountryCode(sectionIndex, fieldIndex);
        break;
      case 'cityTown':
      case 'city_town':
        this.fetchTownsByStateCode(sectionIndex, fieldIndex);
        break;
      case 'postalCode':
        this.fetchPostalCodeByTownCode(sectionIndex, fieldIndex);
        break;
      case 'organizationType':
      case 'clientType':
        this.fetchOrganizationTypes();
        break;
      case 'role':
        this.fetchSystemRoles()
        break;
      case 'titleId':
        this.fetchClientTitles(sectionIndex, fieldIndex)
        break;
      case 'modeOfIdentityId':
        this.fetchIdTypes(sectionIndex, fieldIndex)
        break;
      case 'currencyId':
        this.fetchCurrencies(sectionIndex, fieldIndex)
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
  validateRegex(field: ConfigFormFieldsDto, groupId: string): void {

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
    if (!(this.maritalStatuses.length > 0)) {
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
  }


  /**
   * fetches all paymentModes when required by user.
   * get the index of the selected section using groupId
   * get the index of the selected field using fieldId
   * create an array of strings from paymentModes object and assign to options of the paymentModes formField
   */
  fetchPaymentModes(sectionIndex:number, fieldIndex: number): void {
    if (!(this.paymentModes.length > 0)) {
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
  }

  /**
   * fetches all banks when required by user.
   * get the index of the selected section using groupId
   * get the index of the selected field using fieldId
   * create an array of strings from banks object and assign to options of the banks formField
   */
  fetchBanks(sectionIndex:number, fieldIndex: number): void {
    if(!(this.banks.length > 0)) {
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
  }


  /**
   * fetch bank branches by bankId
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchBankBranches(sectionIndex:number, fieldIndex: number): void {
    if(!(this.bankBranches.length > 0)) {
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
  }


  /**
   * fetch countries
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchCountries(sectionIndex:number, fieldIndex: number): void {
    if(!(this.countries.length > 0)) {
      this.countryService.getCountries().subscribe({
        next: (data: CountryDto[]) => {
          this.countries = data;
          const countryStringArr: string[] = data.map((country: CountryDto) => country.name);
          this.formGroupSections[sectionIndex].fields[fieldIndex].options = countryStringArr
          log.info(`countryStringArr >>> `, countryStringArr);
        },
        error: err => {
          log.error(`could not fetch: `, err);
        }
      })
    } else {
      const countryStringArr: string[] = this.countries.map((country: CountryDto) => country.name);
      this.formGroupSections[sectionIndex].fields[fieldIndex].options = countryStringArr
    }
  }

  /**
   * Fetch the list of states by country code
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchStatesByCountryCode(sectionIndex:number, fieldIndex: number): void {
    if (this.selectedAddressCountry) {
      this.countryService.getMainCityStatesByCountry(this.selectedAddressCountry?.id).subscribe({
        next: (data: StateDto[]) => {
          this.states = data;
          const stateStringArr: string[] = data.map((state: StateDto) => state.name);
          this.formGroupSections[sectionIndex].fields[fieldIndex].options = stateStringArr
          log.info(`countryStringArr >>> `, stateStringArr);
        },
        error: err => {
          log.info(`could not fetch`)
        }
      })
    } else {
      log.info(`You must select country first`)
    }
  }


  /**
   * Fetch towns based on selected state
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchTownsByStateCode(sectionIndex:number, fieldIndex: number): void {
    if (this.selectedState) {
      this.countryService.getTownsByMainCityState(this.selectedState?.id).subscribe({
        next: (data: TownDto[]) => {
          this.towns = data;
          const townStringArr: string[] = data.map((state: TownDto) => state.name);
          this.formGroupSections[sectionIndex].fields[fieldIndex].options = townStringArr
          log.info(`townStringArr >>> `, townStringArr);
        },
        error: err => {
          log.info(`could not fetch`)
        }
      })
    } else {
      log.info(`You must select state first`)
    }
  }


  /**
   * Fetch postal code by town code (town must be selected first)
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchPostalCodeByTownCode(sectionIndex:number, fieldIndex: number): void {
    if (this.selectedTown) {
      this.countryService.getPostalCodes(this.selectedTown?.id).subscribe({
        next: (data: PostalCodesDTO[]) => {
          this.postalCodes = data;
          const postalCodeNumArr: number[] = data.map((postalCode: PostalCodesDTO) => postalCode.zipCode);
          this.formGroupSections[sectionIndex].fields[fieldIndex].options = postalCodeNumArr
          log.info(`postalCodeNumArr >>> `, postalCodeNumArr);
        },
        error: err => {
          log.info(`could not fetch`)
        }
      })
    } else {
      log.info(`You must select state first`)
    }
  }


  /**
   * Fetch id types
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchIdTypes(sectionIndex:number, fieldIndex: number): void {
    if (!(this.idTypes.length > 0)) {
      this.entityService.getIdentityType().subscribe({
        next: (data: IdentityModeDTO[]) => {
          this.idTypes = data;
          const idTypeStringArr: string[] = data.map((id: IdentityModeDTO) => id.name);
          this.formGroupSections[sectionIndex].fields[fieldIndex].options = idTypeStringArr;
          log.info(`identity types >>> `, idTypeStringArr)
        },
        error: err => {
          log.error(`could not fetch: `, err);
        }
      });
    }
  }


  /**
   * Fetch list of currencies
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchCurrencies(sectionIndex:number, fieldIndex: number): void {
    if (!(this.currencies.length > 0)) {
      this.currencyService.getCurrencies().subscribe({
        next: (data: CurrencyDTO[]) => {
          this.currencies = data;
          const currencyStringArr: string[] = data.map((id: CurrencyDTO) => id.name);
          this.formGroupSections[sectionIndex].fields[fieldIndex].options = currencyStringArr;
          log.info(`currencyStringArr >>> `, currencyStringArr)
        },
        error: err => {
          log.error(`could not fetch: `, err);
        }
      });
    }
  }

  /**
   * Fetch client titles
   * @param sectionIndex
   * @param fieldIndex
   */
  fetchClientTitles(sectionIndex:number, fieldIndex: number): void {
    if(!(this.clientTitles.length > 0)) {
      this.clientService.getClientTitles().subscribe({
        next: (data: ClientTitlesDto[]) => {
          this.clientTitles = data;
          const titleStringArr: string[] = data.map((title: ClientTitlesDto) => title.description);
          this.formGroupSections[sectionIndex].fields[fieldIndex].options = titleStringArr;
          log.info(`client titles >>> `, titleStringArr)
        },
        error: err => {
          log.error(`could not fetch: `, err);
        }
      });
    }
  }


  /**
   * Fetch system roles
   */
  fetchSystemRoles(): void {
    if (!(this.roles.length > 0)) {
      this.entityService.getPartiesType().subscribe({
        next: (data: PartyTypeDto[]) => {
          this.roles = data;
          const roleStringArr: string[] = data.map((role: PartyTypeDto) => role.partyTypeName.toLowerCase());
          const index: number = this.uploadGroupSections.selects.findIndex((field: ConfigFormFieldsDto) => field.fieldId === "role");
          this.uploadGroupSections.selects[index].options = roleStringArr;
          log.info(`roles: `, roleStringArr);
        },
        error: err => {
          log.error(`could not fetch: `, err);
        }
      });
    }
  }

  /**
   * Fetch saved details from dynamic table component
   * @param eventData
   */
  fetchSavedDetails(eventData:any) {
    log.debug('Save details modal data:', eventData);
    const subgroup = eventData.subGroupId;
    const dataToSave = eventData.data;

    switch (subgroup) {
      case 'cnt_individual_aml_details':
      case 'cnt_corporate_aml_details':
        this.wealthAmlDetails = dataToSave;
        break;
      case 'cnt_corporate_contact_person_details':
        this.contactPersonDetails = dataToSave;
        break;
      case 'cnt_corporate_branch_details':
        this.branchDetails = dataToSave;
        break;
      case 'cnt_corporate_payee_details':
        this.payeeDetails = dataToSave;
        break;
      case 'cnt_corporate_ownership_details':
        this.ownershipDetails = dataToSave;
        break;
      case 'cnt_corporate_cr12_details':
        this.cr12Details = dataToSave;
        break;
      default:
        //do nothing; Ownership Structure Cr12 Details
    }
  }


  /**
   * Fetch org types
   */
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


  /**
   * Fetch client types
   */
  fetchClientTypes(): void {
    // if(!(this.clientTypes.length > 0)) {
      this.clientTypeService.getClientTypes().subscribe({
        next: (data: ClientTypeDTO[]) => {
          this.clientTypes = data;
          const clientTypesArr: string[] = data.map((clientType: ClientTypeDTO) => clientType.clientTypeName);
          log.info(`clientTypesArr>>> `, clientTypesArr);
          const index: number = this.uploadGroupSections.selects.findIndex(field => field.fieldId === "organizationType" || field.fieldId === "clientType");
          this.uploadGroupSections.selects[index].options = clientTypesArr;
        },
        error: err => {
          log.error(`could not fetch `, err);
        }
      });
    // }
  }


  /**
   * process file selection
   * @param event
   * @param docToUpload
   */
  onFileSelected(event: Event, docToUpload: RequiredDocumentDTO, uploadType: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];

      if (uploadType === 'doc') {
        const index = this.uploadGroupSections.docs.findIndex((doc: RequiredDocumentDTO) => doc.id === docToUpload.id);
        this.uploadGroupSections.docs[index].file = file;
      } else if (uploadType === 'profile') {
        this.uploadGroupSections.photo[0].file = file;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          this.photoPreviewUrl = event.target.result;
        }
      }

      switch (uploadType) {
        case 'profile':
          this.profilePicture = file;
          break;
        case 'doc':
          this.clientFiles.push(file);
          this.readFileAsBase64(event);
          break;
        default:
        //do nothing
      }
    }
  }

  readFileAsBase64(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];

        let payload: DmsDocument = {
          actualName: file.name,
          userName: 'test',
          docType: file.type,
          docData: base64String,
          originalFileName: file.name,
          clientName: 'test'
        }
        this.filesToUpload.push(payload)
      };

      reader.onerror = err => {
        log.info(`could not read file >>> `, err);
      };
      reader.readAsDataURL(file);
    }
  }


  /**
   * Deleted selected document
   * @param doc
   */
  deleteDocument(doc: any): void { // todo: fix bug on delete document
    const index: number = this.uploadGroupSections.docs.findIndex(item => item.id === doc.id);
    this.uploadGroupSections.docs[index].file = null;
  }


  /**
   * Upload selected documents for AI scanning
   */
  uploadDocForScanning(): void {
    log.info(`client files >>> `, this.clientFiles);
    this.clientService.uploadDocForScanning(this.clientFiles).subscribe({
      next: (result: any) => {
        const urls = result.map(item => item.content_block.url);
        log.info(`scanned documents >>> `, urls);
        this.readScannedDocuments(urls);
      },
      error: (err) => {}
    })
  }


  /**
   * Read data from scanned documents based on urls
   * @param urls
   */
  readScannedDocuments(urls): void {
    /*const schema = {
      withEffectFromDate: "",
      withEffectToDate: "",
      firstName: "",
      gender: "",
      lastName: "",
      pinNumber: "",
      category: "",
      // countryId: "",
      clientTypeId: "",
      dateOfBirth: "",
      modeOfIdentityId: "",
      idNumber: "",
      branchId: "",
      maritalStatus: "",
      partyId: "",

      //address
      boxNumber: "",
      countryId: "",
      houseNumber: "",
      physicalAddress: "",
      postalCode: "",
      road: "",
      townId: "",
      stateId: "",
      utilityAddressProof: "",
      isUtilityAddress: "",

      // contact details
      emailAddress: "",
      phoneNumber: "",
      smsNumber: "",
      titleId: "",
      contactChannel: "",
      websiteUrl: "",
      socialMediaUrl: "",

      // payment details
      accountNumber: "",
      bankBranchId: "",
      preferedChannel: "",
      mpayno: "",
      iban: "",
      swiftCode: ""

      // todo: add contactPersons[], branches[], ownershipDetails[]
    };*/
    const schema = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "ClientSchema",
      "type": "object",
      "properties": {
        "withEffectFromDate": {
          "type": "string",
          "format": "date",
          "description": "The start date from which the data is effective"
        },
        "withEffectToDate": {
          "type": "string",
          "format": "date",
          "description": "The end date until which the data is effective"
        },
        "firstName": {
          "type": "string",
          "description": "Client's first name"
        },
        "gender": {
          "type": "string",
          "description": "Client's gender (e.g., Male, Female, Other)"
        },
        "lastName": {
          "type": "string",
          "description": "Client's last name"
        },
        "pinNumber": {
          "type": "string",
          "description": "Personal Identification Number (PIN)"
        },
        "category": {
          "type": "string",
          "description": "Client category or classification"
        },
        "clientTypeId": {
          "type": "string",
          "description": "Identifier for the type of client (e.g., individual, organization)"
        },
        "dateOfBirth": {
          "type": "string",
          "format": "date",
          "description": "Client's date of birth"
        },
        "modeOfIdentityId": {
          "type": "string",
          "description": "ID representing the mode of identification (e.g., passport, driver's license)"
        },
        "idNumber": {
          "type": "string",
          "description": "Identification document number"
        },
        "branchId": {
          "type": "string",
          "description": "Identifier for the branch associated with the client"
        },
        "maritalStatus": {
          "type": "string",
          "description": "Client's marital status (e.g., Single, Married)"
        },
        "partyId": {
          "type": "string",
          "description": "Unique identifier for the party (internal reference)"
        },
        "boxNumber": {
          "type": "string",
          "description": "Client's P.O. Box number"
        },
        "countryId": {
          "type": "string",
          "description": "Identifier for the client’s country"
        },
        "houseNumber": {
          "type": "string",
          "description": "House or apartment number of the client"
        },
        "physicalAddress": {
          "type": "string",
          "description": "Full physical address of the client"
        },
        "postalCode": {
          "type": "string",
          "description": "Postal or ZIP code"
        },
        "road": {
          "type": "string",
          "description": "Name of the road or street"
        },
        "townId": {
          "type": "string",
          "description": "Identifier for the town/city"
        },
        "stateId": {
          "type": "string",
          "description": "Identifier for the state or region"
        },
        "utilityAddressProof": {
          "type": "string",
          "description": "Proof of address document (e.g., utility bill)"
        },
        "isUtilityAddress": {
          "type": "string",
          "description": "Indicates if the utility address is the same as the physical address"
        },
        "emailAddress": {
          "type": "string",
          "format": "email",
          "description": "Client’s email address"
        },
        "phoneNumber": {
          "type": "string",
          "description": "Client’s main phone number"
        },
        "smsNumber": {
          "type": "string",
          "description": "Phone number used for SMS communication"
        },
        "titleId": {
          "type": "string",
          "description": "Title identifier (e.g., Mr., Mrs., Dr.)"
        },
        "contactChannel": {
          "type": "string",
          "description": "Preferred communication channel"
        },
        "websiteUrl": {
          "type": "string",
          "format": "uri",
          "description": "URL of client’s website"
        },
        "socialMediaUrl": {
          "type": "string",
          "format": "uri",
          "description": "Link to client’s social media profile"
        },
        "accountNumber": {
          "type": "string",
          "description": "Bank account number"
        },
        "bankBranchId": {
          "type": "string",
          "description": "Identifier for the bank branch"
        },
        "preferedChannel": {
          "type": "string",
          "description": "Client's preferred channel of communication"
        },
        "mpayno": {
          "type": "string",
          "description": "Mobile payment number (e.g., M-Pesa, mobile wallet)"
        },
        "iban": {
          "type": "string",
          "description": "International Bank Account Number (IBAN)"
        },
        "swiftCode": {
          "type": "string",
          "description": "SWIFT code for international banking"
        }
      },
      "required": []
    }

    this.isPatchingFormValues = true;
    this.entityForm.disable();

    const requestPayload = {
      assistant_id: "DocumentHubAgent",
      config: {
        configurable: {
          score_extraction: true,
          strict: false
        }
      },
      input: {
        // schema: "app.document_hub.schemas.document.kenya.KenyanKRAPIN",
        schema,
        files: [
          ...urls
        ]
      }
    };

    this.clientService.readScannedDocuments(requestPayload).subscribe({
      next: (result: any) => {
        const data = result.data;
        this.clientDocumentData = data;

        // todo: extract into method patchFormFields()
        const dataToPatch = {
          ...data,
          pinNumber: data.pinNumber,
          lastName: data.lastName,
          otherNames: data.firstName,
          email: data.emailAddress,
          houseNo: data.building,
          physicalAddress: data.physicalAddress,
          cityTown: data.townId,
          postalCode: data.postalCode,
        }

        this.entityForm.patchValue({
          cnt_individual_address_details: {
            address: data.physicalAddress,
            cityTown: data.townId,
            countryId: null,
            postalCode: data.postalCode,
            physicalAddress: data.physicalAddress,
            postalAddress: data.postalAddress,
          },
          cnt_individual_prime_identity: {
            lastName: data.lastName,
            otherNames: data.firstName,
            email: data.emailAddress,
            pinNumber: data.pinNumber,
            citizenshipCountryId: data.countryId,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            idNumber: data.idNumber,
            maritalStatus: data.maritalStatus,
            modeOfIdentityId: null,
            wef: data.withEffectFromDate,
            wet: data.withEffectToDate,
          },
          cnt_individual_contact_details: {
            telNumber: data.phoneNumber,
            smsNumber: data.smsNumber,
            contactChannel: data.contactChannel,
            email: data.emailAddress,
            titleId: null // todo: get title
          },
          cnt_corporate_address_details: {
            address: data.physicalAddress,
            city_town: data.townId,
            countryId: null,
            countyState: null,
            physicalAddress: data.physicalAddress,
            postalAddress: data.postalAddress,
            postalCode: data.postalCode
          },
          cnt_corporate_prime_identity: {
            businessRegNumber: data.idNumber,
            dateOfIncorporation: data.dateOfBirth,
            entityName: data.firstName + " " + data.lastName,
            pinNumber: data.pinNumber,
            wef: data.withEffectFromDate,
            wet: data.withEffectToDate
          },
          cnt_corporate_contact_details: {
            email: data.emailAddress,
            telNumber: data.phoneNumber,
            contactChannel: data.contactChannel,
            socialMediaLink: data.socialMediaUrl,
            websiteUrl: data.websiteUrl,
          }
        });
        log.info(`scanned document data >>> `, typeof dataToPatch, dataToPatch, this.entityForm.getRawValue());
        this.isPatchingFormValues = false;
        this.entityForm.enable();

      },
      error: (err) => {
        this.isPatchingFormValues = false;
        this.entityForm.enable();
      }
    });
  }


  /**
   * The function `uploadImage` uploads an image file to the server and updates the profile picture and
   * image of an entity, then displays a success message and navigates to the next page.
   * @param {number} entityId - The entityId parameter is a number that represents the unique
   * identifier of an entity.
   */
  uploadImage(file, entityId: number) {
    this.entityService
      .uploadProfileImage(entityId, file)
      .subscribe((res) => {
        log.info(res);
        this.globalMessagingService.clearMessages();
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Successfully Created an Entity'
        );
      });
  }


  /**
   * Handle section collapse
   * @param id
   */
  toggleCollapse(id: string): void {
    if (this.collapsedGroups.has(id)) {
      this.collapsedGroups.delete(id);
    } else {
      this.collapsedGroups.add(id);
    }
  }

  isCollapsed(id: string): boolean {
    return this.collapsedGroups.has(id);
  }

  /**
   * Fetches the sub modules based on the given parameters.
   *
   * This function fetches the sub modules based on the given parameters and
   * assigns the result to the subModules property.
   */
  fetchSubModules() {
    this.dynamicScreensSetupService.fetchSubModules(null, "account_management")
      .subscribe({
        next: (data) => {
          this.subModules = data;
          log.info("sub modules>>", data);
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      });
  }
}
