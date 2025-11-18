import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BreadCrumbItem } from "../../../../../shared/data/common/BreadCrumbItem";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Logger, UtilService } from "../../../../../shared/services";
import { RegexErrorMessages } from "../../../data/field-error.model";
import { MaritalStatusService } from "../../../../../shared/services/setups/marital-status/marital-status.service";
import { MaritalStatus } from "../../../../../shared/data/common/marital-status.model";
import { PaymentModesService } from "../../../../../shared/services/setups/payment-modes/payment-modes.service";
import { PaymentModesDto } from "../../../../../shared/data/common/payment-modes-dto";
import { BankBranchDTO, BankDTO, CurrencyDTO } from "../../../../../shared/data/common/bank-dto";
import { BankService } from "../../../../../shared/services/setups/bank/bank.service";
import { CountryDto, PostalCodesDTO, StateDto, TownDto } from "../../../../../shared/data/common/countryDto";
import { CountryService } from "../../../../../shared/services/setups/country/country.service";
import { GlobalMessagingService } from "../../../../../shared/services/messaging/global-messaging.service";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";
import { RequiredDocumentDTO } from "../../../../crm/data/required-document";
import { RequiredDocumentsService } from "../../../../crm/services/required-documents.service";
import { ClientTypeService } from "../../../../../shared/services/setups/client-type/client-type.service";
import { ClientTitlesDto, ClientTypeDTO } from "../../../data/ClientDTO";
import { EntityService } from "../../../services/entity/entity.service";
import { PartyTypeDto } from "../../../data/partyTypeDto";
import { ClientService } from "../../../services/client/client.service";
import { IdentityModeDTO } from "../../../data/entityDto";
import { CurrencyService } from "../../../../../shared/services/setups/currency/currency.service";
import {
  Branch,
  ContactDetails,
  Cr12Detail,
  OwnerDetail, PartyType,
  Payee,
  WealthAmlDTO
} from "../../../data/accountDTO";
import { DmsService } from "../../../../../shared/services/dms/dms.service";
import { DmsDocument } from "../../../../../shared/data/common/dmsDocument";
import {
  DynamicScreensSetupService
} from "../../../../../shared/services/setups/dynamic-screen-config/dynamic-screens-setup.service";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto, FieldType,
  FormGroupsDto, PresentationType, SubModulesDto
} from "../../../../../shared/data/common/dynamic-screens-dto";
import { IntermediaryService } from "../../../services/intermediary/intermediary.service";
import { AccountsEnum } from "../../../data/enums/accounts-enum";
import { AccountService } from "../../../services/account/account.service";
import {
  AccountTypeDTO,
  AddressV2DTO, AgentDTO,
  AgentV2DTO,
  ContactDetailsV2DTO, Cr12DetailsDTO,
  IntermediaryRefereeDTO,
  PaymentDetailsDTO, WealthAmlDetailsDTO
} from "../../../data/AgentDTO";
import { AuthService } from "../../../../../shared/services/auth.service";
import { Pagination } from "../../../../../shared/data/common/pagination";
import { LazyLoadEvent } from "primeng/api";
import { TableLazyLoadEvent } from "primeng/table";
import { GenericResponse } from "../../../../fms/data/receipting-dto";
import { GLAccountDTO } from "../../../../fms/data/receipt-management-dto";
import { ReceiptManagementService } from "../../../../fms/services/receipt-management.service";
import {ChannelService} from "../../../../crm/services/channel.service";
import {ChannelsDTO} from "../../../../crm/data/channels";

const log = new Logger('NewEntityV2Component');

@Component({
  selector: 'app-new-entity-v2',
  templateUrl: './new-entity-v2.component.html',
  styleUrls: ['./new-entity-v2.component.css']
})
export class NewEntityV2Component implements OnInit, OnChanges {

  @Output() clientSaved = new EventEmitter<any>();
  @Input() system: string;


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
  language: string = 'en';
  category: string = '';
  role: PartyTypeDto;
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
  channelsData: ChannelsDTO[] = [];
  relationshipManagersData: AgentDTO[] = [];

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
  protected readonly PresentationType = PresentationType;
  premiumFrequenciesData: AccountsEnum[] = [];
  communicationChannelsData: AccountsEnum[] = [];
  accountTypeData: AccountTypeDTO[] = [];
  dynamicTableData: { [key: string]: any } = {};
  assignee: any;
  entityName: string;
  entityCode: number;
  privacyPolicyPresentationType: string = 'privacy_policy';
  defaultCountryISO = CountryISO.Kenya;
  protected readonly FieldType = FieldType;
  pageSize: number;
  selectedTableRecord: any;
  glAccounts: GenericResponse<Pagination<GLAccountDTO>> = <GenericResponse<Pagination<GLAccountDTO>>>{};
  clientBranchData: AccountsEnum[];
  tableSelectFieldId: string = '';
  filterObject: {
    accountName: string;
    accountNumber: string;
  } = {
    accountName: '',
    accountNumber: '',
  };
  filteredGlAccounts: GLAccountDTO[] = [];
  columns: any = [
    { field: 'accountNumber', header: 'ID', visible: true },
    { field: 'accountName', header: 'Name', visible: true },
  ];

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
    private intermediaryService: IntermediaryService,
    private accountService: AccountService,
    private authService: AuthService,
    private receiptManagementService: ReceiptManagementService,
    private clientsService: ClientService,
    private channelService: ChannelService,
  ) {

    this.uploadForm = this.fb.group({
      fields: this.fb.array([]),
    });

    this.createEntityForm();
  }

  /*get fields(): FormArray {
    return this.entityForm.get('fields') as FormArray;
  }*/

  ngOnInit(): void {
    this.fetchSubModules();
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });

    if (!this.previewFormFields) {
      this.fetchUploadFormFields();
    }
    this.assignee = this.authService.getCurrentUserName();
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

  createEntityForm(): void {
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

    this.dynamicScreensSetupService.fetchDynamicSetupByScreen(null, null, null, this.subModules[0]?.subModuleId, selectedRole?.partyTypeShtDesc)
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
            this.role?.partyTypeName.toLowerCase()
          );
          this.uploadForm.controls['category'].setValue(
            this.category
          );
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error);
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
          this.globalMessagingService.displayErrorMessage('Error', err.error);
        }
      });
  }

  /**
   * add fields to the entity form
   * @param formGroupSection
   */
  /*addFieldsToSections(formGroupSection: any[]): void {
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
      log.info('section fields ',section.groupId,  section.fields);
    });
    log.info('Adding fields to sections', this.entityForm);

  }*/


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
      photo: [],
      docField: []
    }

    visibleFormFields.forEach((field: ConfigFormFieldsDto) => {
      if (field.type === 'select') {
        this.uploadGroupSections.selects.push(field);
      } else if (field.type === 'multiple_document_uploads') {
        this.uploadGroupSections.docField.push(field);
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
  orderFormGroup(groups: FormGroupsDto[], fields: ConfigFormFieldsDto[]): void {
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
  /* assignFieldsToGroupByGroupId(fields: ConfigFormFieldsDto[], formGroupSections: any[]): void {
     const visibleFormFields = this.getFilteredFields2(fields);
     // const visibleFormFields = this.getFilteredFields(fields);
     // check the group from formGroupSections if it has subGroups.length < 0
     // check if subGroup has presentationType === 'fields'
     /!*if (formGroupSections) {
       formGroupSections.forEach(section => {
         if (section.subGroup.length > 0) {
           section.subGroup.forEach(subGroup => {
             if (subGroup.presentationType === 'fields') {
               log.info(`subGroup presentationType >>> `, subGroup.subGroupId, section.groupId);
               const field = fields.filter(field => field.formSubGroupingId === subGroup.subGroupId);
               log.info(`fields for fields`, field)
             } else {
               log.info(`this is a table`, subGroup.subGroupId)
               const trial = fields.filter(field => field.formSubGroupingId === subGroup.subGroupId);
               log.info(`fields for table`, trial)
             }
           })
         }
         else {
           log.info(`this is when subGroup.length === 0`, section.groupId);
         //   show fields where formGroupingId === section.groupId
           const field = fields.filter(field => field.formGroupingId === section.groupId);
           log.info(`fields for no subgroup`, field)
         }
       })
     }*!/

     for (const section of formGroupSections) {
       const { subGroup = [], groupId } = section;
       formGroupSections.forEach(section => {
         section.fields = [];
       });

       if (!subGroup.length) {
         const sectionFields = fields.filter(f => f.formGroupingId === groupId);
         log.info("subGroup is empty for groupId:", groupId);
         log.info("fields for no subgroup", sectionFields);
         section.fields.push(sectionFields);
         this.createFieldsByPresentationType(groupId, sectionFields)
         continue;
       }

       for (const sg of subGroup) {
         const { subGroupId, presentationType } = sg;
         const subGroupFields = fields.filter(f => f.formSubGroupingId === subGroupId);

         if (presentationType === "fields") {
           log.info("subGroup presentationType 'fields':", subGroupId, groupId);
           log.info("fields for fields", subGroupFields);
           section.fields.push(subGroupFields);
           this.createFieldsByPresentationType(subGroupId, subGroupFields)
         } else {
           log.info("subGroup presentationType 'table':", subGroupId);
           log.info("fields for table", subGroupFields);
           this.trialFields = fields.filter(field => field.formSubGroupingId === subGroup.subGroupId);
           this.tablePayload = sg;

           const payload = {
             ...sg,
             fields: subGroupFields
           };
           this.tablePayloads.push(payload);

             log.info("subgroup info", sg, payload)
         }
       }
     }
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
     log.info(`form group sections >>> `, this.formGroupSections);
     // this.addFieldsToSections(formGroupSections);

     /!*this.wealthAmlFormFields = fields.filter(field => field.formSubGroupingId === 'cnt_individual_aml_details');
     this.corporateContactDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_contact_person_details');
     this.corporateAddressDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_branch_details');
     this.corporateFinancialDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_payee_details');
     this.corporateWealthAmlFormFieldsDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_aml_details');
     this.corporateWealthCR12DetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_cr12_details');
     this.corporateWealthOwnershipDetailsFormField = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_ownership_details');
     this.privacyPolicyFormFields = fields.filter(field => field.formSubGroupingId === 'cnt_corporate_privacy_policy');*!/
   }*/

  assignFieldsToGroupByGroupId(fields: ConfigFormFieldsDto[], formGroupSections: any[]): void {
    // Filter fields according to preview / upload form logic
    const visibleFormFields = this.getFilteredFields2(fields || []);

    // set fields arrays to empty on groups/subGroups
    formGroupSections.forEach(section => {
      section.fields = [];
      if (section.subGroup) {
        section.subGroup.forEach((sg: any) => {
          sg.fields = [];
        });
      }
    });

    // distribute fields into the group/subGroup structures
    visibleFormFields.forEach(field => {
      const group = formGroupSections.find(s => s.groupId === field.formGroupingId);
      if (!group) return;

      group.subGroup.sort((a: any, b: any) => a.order - b.order);
      if (group.subGroup && group.subGroup.length > 0) {
        const subGroup = group.subGroup.find((sg: any) => sg.subGroupId === field.formSubGroupingId);
        if (subGroup) {
          subGroup.fields.push(field);
        } else {
          // if the field doesn't match any subGroup, attach directly to the group
          group.fields.push(field);
        }
      } else {
        // group has no subGroups -> attach directly to group
        group.fields.push(field);
      }
    });

    // assign to component state so template sees it
    this.formGroupSections = formGroupSections;

    // create a presentation type just for privacy policy cases
    this.formGroupSections = this.formGroupSections.map(group => {
      if (group.groupId?.includes('privacy_policy')) {
        return {
          ...group,
          presentationType: this.privacyPolicyPresentationType
        };
      }
      return group;
    });

    // Build / ensure FormGroups & FormControls exist
    formGroupSections.forEach(group => {
      // ensure group FormGroup exists on entityForm
      if (!this.entityForm.contains(group.groupId)) {
        this.entityForm.addControl(group.groupId, this.fb.group({}));
      }
      const groupForm = this.entityForm.get(group.groupId) as FormGroup;

      // If group has subGroups, iterate them
      if (group.subGroup && group.subGroup.length > 0) {
        group.subGroup.forEach((subGroup: any) => {
          const pType = subGroup.presentationType || group.presentationType || 'fields';

          if (pType === PresentationType.fields) {
            // add subGroup fields as controls directly under groupForm
            (subGroup.fields || []).forEach((field: any) => {
              if (!groupForm.contains(field.fieldId)) {
                const control = field.mandatory
                  ? this.fb.control({ value: '', disabled: field.disabled || false }, Validators.required)
                  : this.fb.control({ value: '', disabled: field.disabled || false });
                groupForm.addControl(field.fieldId, control);

                // Apply dynamic validators for fields with conditions
                if (field.conditions && field.conditions.length > 0) {
                  const controllingFieldId = field.conditions[0].field;
                  const controllingControl = groupForm.get(controllingFieldId);

                  if (controllingControl) {
                    controllingControl.valueChanges.subscribe(() => {
                      this.applyDynamicValidators(field, groupForm);
                    });
                  }
                }

                // Always apply validators initially (whether or not field has conditions)
                this.applyDynamicValidators(field, groupForm);
              }
            });
          } else if (pType === PresentationType.fields_and_table_columns) {
            // create placeholder FormGroup so child components binding to formGroupName won't break
            if (!groupForm.contains(subGroup.subGroupId)) {
              groupForm.addControl(subGroup.subGroupId, this.fb.group({}));
            }
          }
        });
      } else {
        // no subGroups -> respect group.presentationType
        const gType = group.presentationType || 'fields';
        if (gType === PresentationType.fields) {
          (group.fields || []).forEach((field: any) => {
            if (!groupForm.contains(field.fieldId)) {
              const control = field.mandatory
                ? this.fb.control({ value: '', disabled: field.disabled || false }, Validators.required)
                : this.fb.control({ value: '', disabled: field.disabled || false });
              groupForm.addControl(field.fieldId, control);

              // Apply dynamic validators for fields with conditions
              if (field.conditions && field.conditions.length > 0) {
                const controllingFieldId = field.conditions[0].field;
                const controllingControl = groupForm.get(controllingFieldId);

                if (controllingControl) {
                  controllingControl.valueChanges.subscribe(() => {
                    this.applyDynamicValidators(field, groupForm);
                  });
                }
              }

              // Always apply validators initially (whether or not field has conditions)
              this.applyDynamicValidators(field, groupForm);
            }
          });
        } else if (gType === PresentationType.fields_and_table_columns) {
          // Create a safe placeholder so templates/components that expect a nested group
          const placeholderName = `${group.groupId}_table`;
          if (!groupForm.contains(placeholderName)) {
            groupForm.addControl(placeholderName, this.fb.group({}));
          }
        }
      }
    });
    this.addGroupToCollapsedGroups();
    log.info('Entity form after assigning fields', this.entityForm);
  }



  /**
   * Filters form fields based on preview mode and form type
   * @param fields Array of form fields to filter
   * @returns Filtered array of form fields
   */
  /*private getFilteredFields(fields: ConfigFormFieldsDto[]): ConfigFormFieldsDto[] {
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
  }*/

  private getFilteredFields2(fields: ConfigFormFieldsDto[]): ConfigFormFieldsDto[] {
    return fields.filter(field =>
      field.visible &&
      field.formId === this.originalFormId);
  }

  /**
   * save details from form
   * filter out fields with no data
   * create payload for prime identity (primeIdentityPayload)
   */
  saveDetails(): void {
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
      switch (this.role?.partyTypeShtDesc) {
        case PartyType.client:
          this.saveClient(formValues, upperDetails);
          break;

        case PartyType.intermediary:
          this.saveAgentDetails(formValues, upperDetails);
          break;

        default:
          log.info("no role found during save");
      }
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
  saveClient(formValues, upperDetails): void { // todo: define model for formValues & upperDetails
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
      boxNumber: null,
      countryId: this.selectedAddressCountry?.id,
      houseNumber: payloadObject.houseNo,
      physicalAddress: payloadObject.physicalAddress,
      postalCode: payloadObject.postalCode ? payloadObject.postalCode : null,
      road: payloadObject.road,
      townId: this.selectedTown?.id,
      stateId: this.selectedState?.id,
      utilityAddressProof: null,
      isUtilityAddress: null
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
      preferedChannel: payloadObject.paymentMethod?.label,
      mpayno: payloadObject.cnt_individual_financial_details_mobile_number?.internationalNumber,
      iban: payloadObject.intlBankAccountNumber,
      swiftCode: payloadObject.swiftCode,
      effectiveFromDate: payloadObject.cnt_individual_financial_details_wef,
      effectiveToDate: payloadObject.cnt_individual_financial_details_wet,
    }

    const branchData = this.getDataByPattern('branch_details');
    const branches = branchData.length > 0
      ? branchData.map(item => ({
        shortDesc: item.id,
        branchName: item.cnt_corporate_branch_details_name,
        countryId: item.country?.id,
        stateId: item.county?.id,
        townId: item.town?.id,
        physicalAddress: item.cnt_corporate_branch_details_physicalAddress,
        email: item.cnt_corporate_branch_email,
        landlineNumber: item.landlineNumber,
        mobileNumber: item.mobileNumber,
      }))
      : [];

    const contactPersonData = this.getDataByPattern('contact_person_details');
    const contactPersons = contactPersonData.length > 0
      ? contactPersonData.map(item => ({
        clientTitleCode: item.titleId?.id,
        name: item.name,
        idNumber: item.docIdNumber,
        email: item.emailAddress,
        mobileNumber: item.phoneNumber,
        wef: item.cnt_corporate_contact_person_details_wef,
        wet: item.cnt_corporate_contact_person_details_wet,
      }))
      : [];

    const payeeData = this.getDataByPattern('payee_details');
    const payee = payeeData.length > 0
      ? payeeData.map(item => ({
        name: item.payee_details_name,
        idNo: item.cnt_corporate_payee_docIdNumber,
        mobileNo: item.cnt_corporate_payee_mobileNumber,
        email: item.payee_email_address,
        bankBranchCode: item.branchName?.id,
        accountNumber: item.cnt_corporate_payee_accountNumber,
      })) : [];

    const cr12Data = this.getDataByPattern('cr12_details');
    const cr12Details = cr12Data.length > 0
      ? cr12Data.map(item => ({
        directorName: item.cr12_name,
        directorIdRegNo: item.companyRegistrationNumber,
        directorDob: item.companyRegistrationDate,
        address: item.cr12_details_address,
        certificateReferenceNo: item.referenceNumber,
        certificateRegistrationYear: item.referenceNumberYear,
      }))
      : [];

    const wealthAmlData = this.getDataByPattern('aml_details');
    const wealthAmlDetails = wealthAmlData.length > 0
      ? wealthAmlData.map(item => ({
        fundsSource: item.source_of_fund?.label || item.sourceOfFundAml?.id,
        employmentStatus: item.type_of_employment?.id,
        sectorId: item.economicSector?.id || item.economicSectorAml?.id,
        occupationId: item.occupation?.id,
        insurancePurpose: item.purposeOfInsurance?.label,
        premiumFrequency: item.premiumFrequency?.id,
        distributeChannel: item.distributionChannel?.id,
        tradingName: item.tradingName,
        registeredName: item.registeredName,
        certificateRegistrationNumber: item.certificateRegistrationNumber,
        certificateYearOfRegistration: item.certificateRegistrationYear,
        parentCountryId: item.parentCountry?.id,
        operatingCountryId: item.operatingCountry?.id,
        cr12Details
      }))
      : [];

    const ownershipData = this.getDataByPattern('ownership_details');
    const ownershipDetails = ownershipData.length > 0
      ? ownershipData.map(item => ({
        name: item.cnt_corporate_ownership_details_name,
        idNumber: item.cnt_corporate_ownership_details_docIdNumber,
        contactPersonPhone: item.contactPersonPhone,
        percentOwnership: item.percentOwnership,
      }))
      : [];

    const clientOrOrganizationType = this.category === 'corporate' ? payloadObject.organizationType.toLowerCase() : payloadObject.clientType.toLowerCase();
    const client: any = { // todo: update Model (ClientDTO)
      address,
      contactDetails,
      paymentDetails,
      wealthAmlDetails,
      branches,
      contactPersons,
      payee,
      ownershipDetails,
      withEffectFromDate: payloadObject.wef,
      withEffectToDate: payloadObject.wet,
      firstName: this.category === 'corporate' ? payloadObject.entityName.substring(0, payloadObject.entityName.indexOf(' ')) : payloadObject.otherNames,
      gender: payloadObject.gender,
      lastName: this.category === 'corporate' ? payloadObject.entityName.substring(payloadObject.entityName.indexOf(' ') + 1) : payloadObject.lastName,
      pinNumber: payloadObject.pinNumber,
      category: payloadObject.category,
      countryId: payloadObject?.citizenshipCountryId?.id,
      clientTypeId: this.clientTypes.find(clientType => clientType.clientTypeName.toLowerCase() === clientOrOrganizationType)?.code,
      dateOfBirth: payloadObject.dateOfBirth || payloadObject.dateOfIncorporation,
      modeOfIdentityId: this.selectedIdType?.id,
      idNumber: payloadObject.idNumber || payloadObject.businessRegNumber,
      organizationBranchId: payloadObject?.cnt_individual_contact_details_branch?.id || payloadObject?.cnt_corporate_contact_details_branch?.id,
      maritalStatus: this.selectedMaritalStatus?.value,
    };

    log.info(`clientDto >>> `, client);

    this.clientService.saveClientDetails2(client).subscribe({
      next: (response) => {
        log.info(`client saved >>> `, response);
        const clientCode = response.clientCode;

        // Upload profile picture only if it exists
        if (this.profilePicture) {
          this.uploadImage(this.profilePicture, response.partyId);
        }

        this.entityName = response.firstName + ' ' + response.lastName;
        this.entityCode = response.clientCode;
        sessionStorage.setItem('newClientCode', JSON.stringify(this.entityCode));

        // Upload documents to DMS
        this.uploadDocumentToDms();

        // Emit event to close the modal in the parent component
        this.clientSaved.emit({
          success: true,
          clientCode: clientCode,
          clientName: this.entityName
        });

        // Show success message
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          `Client ${this.entityName} created successfully`
        );
      },
      error: (error) => {
        log.info(`could not save`, error);
        this.globalMessagingService.displayErrorMessage(
          'Error',
          error?.error?.message || 'Failed to save client'
        );
      }
    })
  }

  saveAgentDetails(formValues, upperDetails): void {
    const payloadObject = {
      ...upperDetails,
      ...formValues.int_individual_prime_identity,
      ...formValues.int_individual_contact_details,
      ...formValues.int_individual_address_details,
      ...formValues.int_individual_financial_details,
      ...formValues.int_individual_wealth_aml_details,
      ...formValues.int_individual_agency_referee_details,
      ...formValues.int_individual_privacy_policy,
      ...formValues.int_corporate_prime_identity,
      ...formValues.int_corporate_contact_details,
      ...formValues.int_corporate_address_details,
      ...formValues.int_corporate_financial_details,
      ...formValues.int_corporate_wealth_aml_details,
      ...formValues.int_corporate_privacy_policy

    }
    log.info(`agent payloadObject >>> `, payloadObject, formValues);

    const contactData = this.getDataByPattern('cont_details');

    const contactDetails: ContactDetailsV2DTO[] = contactData.length > 0
      ? contactData.map(item => ({
        titleId: item?.title?.id || item?.contactTitle?.id,
        emailAddress: item?.email || item?.contactEmail,
        smsNumber: item?.smsNo || item?.contactSmsNo,
        phoneNumber: item?.primaryContactNo || item?.contactOfficeNo,
        contactChannel: item?.prefContactChannel?.id || item?.contactPrefContactChannel?.id,
        whatsappNumber: item?.whatsAppNo || item?.contactWhatsappNo,
        principalContactName: item?.contactPrimaryName,
        websiteUrl: item?.contactWebsiteUrl,
      }))
      : [];
    log.info(`contactDetails >>> `, contactDetails);

    const cr12Data = this.getDataByPattern('cr12_details');
    const cr12Details: Cr12DetailsDTO[] = cr12Data.length > 0
      ? cr12Data.map(item => ({
        directorName: item.cr12Name,
        directorIdRegNo: item.companyRegistrationNumber,
        directorDob: item.companyRegistrationDate,
        address: item.cr12Address,
        certificateReferenceNo: item.referenceNumber,
        certificateRegistrationYear: item.referenceNumberYear,
      }))
      : [];

    const wealthAmlData = this.getDataByPattern('aml_details');

    const wealthAmlDetails: WealthAmlDetailsDTO[] = wealthAmlData.length > 0
      ? wealthAmlData.map(item => ({
        nationalityCountryId: item.nationality?.id,
        fundsSource: item.sourceOfFunds?.label || item.sourceOfFundAml?.label,
        modeOfIdentity: item.docIdType?.id,
        idNumber: item.wealthDocIdNumber,
        tradingName: item.tradingName,
        registeredName: item.registeredName,
        certificateRegistrationNumber: item.certificateRegistrationNumber,
        certificateRegistrationYear: item.certificateRegistrationYear,
        operatingCountryId: item.operatingCountry?.id,
        parentCountryId: item.parentCountry?.id,
        sectorId: item.sectorAml?.id,
        cr12Details
      }))
      : [];
    log.info(`wealthAmlDetails >>> `, wealthAmlDetails);

    const ownershipData = this.getDataByPattern('ownership_details');
    const ownershipDetails = ownershipData.length > 0
      ? ownershipData.map(item => ({
        name: item.ownershipName,
        idNumber: item.ownershipDocIdNo,
        contactPersonPhone: item.ownershipMobileNo,
        percentOwnership: item.percentOwnership,
      }))
      : [];

    const refereeData = this.getDataByPattern('ref_details');

    const refereeDetails: IntermediaryRefereeDTO[] = refereeData.length > 0
      ? refereeData.map(item => ({
        name: item?.name,
        physicalAddress: item?.refPhysicalAddress,
        postalAddress: item?.refPostalAddress,
        emailAddress: item?.refEmailAddress,
        telephone: item?.refTelNo,
        idNumber: item?.refDocIdNo,
        preferredCommunicationChannel: item?.communicationChannel?.id,
        status: item?.refStatus?.id,
      }))
      : [];

    log.info(`refereeDetails >>> `, refereeDetails);

    const address: AddressV2DTO = {
      countryId: payloadObject.country?.id || payloadObject.addressCountry?.id,
      physicalAddress: payloadObject.physicalAddress || payloadObject.addressPhysical,
      postalCode: payloadObject.postalCode?.id || payloadObject.addressPostalCode?.id,
      stateId: payloadObject.countyState?.id || payloadObject.addressCounty?.id,
      townId: payloadObject.cityTown?.id || payloadObject.addressCity?.id,
    }

    const paymentDetails: PaymentDetailsDTO = {
      accountNumber: payloadObject.accountNo || payloadObject.financialAccNo,
      bankBranchId: payloadObject.branchName?.id || payloadObject.financialBranchName?.id,
      commissionAllowed: payloadObject?.commissionAllowed?.toUpperCase() || payloadObject?.financialCommAllowed?.toUpperCase(),
      commissionEffectiveDate: payloadObject.commissionStatusEffectiveDate || payloadObject.financialCommStatusEffectiveDate,
      commissionStatusDate: payloadObject.commissionStatusDate || payloadObject.financialCommStatusDate,
      creditLimit: payloadObject.creditLimit || payloadObject.financialCreditLimit,
      glAccountNumber: this.selectedTableRecord?.accountNumber || payloadObject.financialGLAcc,
      paymentFrequency: payloadObject.freqOfPayment?.id || payloadObject.financialPaymentFrequency?.id,
      paymentTerms: payloadObject.paymentTerms || payloadObject.financialPaymentTerms,
      taxAuthorityCode: payloadObject.taxAuthorityCode || payloadObject.financialTaxAuthCode,
      vatApplicable: payloadObject?.vatApplicability?.toUpperCase() || payloadObject?.financialVatApplicability?.toUpperCase(),
      // paymentMode not there
    }
    const accountType = this.accountTypeData.find(accType => accType.accountType === payloadObject.accountTypeIndividual?.toUpperCase() ||
      accType.accountType === payloadObject.accountType?.toUpperCase())?.id

    const agent: AgentV2DTO = {
      accountTypeId: accountType,
      address: address,
      category: payloadObject?.category,
      contactDetails: contactDetails,
      countryId: payloadObject.citizenship?.id || payloadObject?.parent_country?.id,
      dateOfBirth: payloadObject?.dateOfBirth || payloadObject?.dateOfIncorporation,
      gender: payloadObject?.gender,
      idNumber: payloadObject?.docIdNumber || payloadObject?.businessRegNumber,
      licenceNumber: payloadObject?.iraLicenseNo,
      maritalStatus: payloadObject?.maritalStatus?.label,
      name: payloadObject?.fullName || payloadObject?.corporateFullName,
      paymentDetails: paymentDetails,
      pinNumber: payloadObject?.taxPinNumber,
      referees: refereeDetails,
      wealthAmlDetails: wealthAmlDetails,
      ownershipDetails: ownershipDetails,
      withEffectFromDate: payloadObject?.wef,
      withEffectToDate: payloadObject?.wet,
      businessChannelCode: payloadObject?.businessSources?.id,
      accountManagerCode: payloadObject?.relationsshipManager?.id,

    }
    log.info(`agentDto >>> `, agent);
    this.intermediaryService.saveAgentDetailsV2(agent).subscribe({
      next: (response) => {
        log.info(`agent saved >>> `, response);
        this.uploadImage(this.profilePicture, response.partyId)
        this.entityName = response.name;
        this.entityCode = response.intermediaryCode;
        this.uploadDocumentToDms();
      },
      error: (err) => {
        log.info(`could not save`, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  /**
   * Upload documents to DMS after saving client and uploading profileImage/logo
   */
  /*uploadDocumentToDms(): void {
    log.info(` client files to upload >>> `, this.filesToUpload)
    this.dmsService.saveClientDocs(this.filesToUpload).subscribe({
      next: (res: any) => {
        log.info(`document uploaded successfully!`, res);
      },
      error: (err) => {
        log.info(`upload failed!`)
      }
    });
  }*/

  uploadDocumentToDms(): void {
    log.info(` client files to upload >>> `, this.filesToUpload)

    // Add entity name and code to each document payload
    const documentsWithEntityInfo = this.filesToUpload.map(doc => {
      const updatedDoc = { ...doc };

      switch (this.role?.partyTypeShtDesc) {
        case PartyType.intermediary:
          updatedDoc.agentName = this.entityName;
          updatedDoc.agentCode = this.entityCode?.toString();
          break;
        case PartyType.client:
          updatedDoc.clientName = this.entityName;
          updatedDoc.clientCode = this.entityCode?.toString();
          break;
      }

      return updatedDoc;
    });

    log.info(`Documents with entity info >>> `, documentsWithEntityInfo);

    switch (this.role?.partyTypeShtDesc) {
      case PartyType.client:
        this.dmsService.saveClientDocs(documentsWithEntityInfo).subscribe({
          next: (res: any) => {
            log.info(`document uploaded successfully!`, res);
          },
          error: (err) => {
            log.info(`upload failed!`, err)
          }
        });
        break;
      case PartyType.intermediary:
        this.dmsService.saveAgentDocs(documentsWithEntityInfo).subscribe({
          next: (res: any) => {
            log.info(`document uploaded successfully!`, res);
          },
          error: (err) => {
            log.info(`upload failed!`, err)
          }
        });
        break;
      default:
        break;
    }
  }

  /**
   * process select option based on the item selected
   * @param event
   * @param fieldId
   */
  processSelectOption(event: any, fieldId: string): void {
    if (this.isPreviewMode === true) {
      return;
    }
    // const selectedOption = event.target.value;
    const formValues = this.uploadForm.getRawValue();
    /*const controlVal = this.entityForm.get(fieldId)?.value;
    const selected = (controlVal && typeof controlVal === 'object') ? controlVal : { id: controlVal, label: controlVal };
    log.info(`processSelectOptions >>> `, selected, fieldId, controlVal);*/

    const formValue = this.entityForm.getRawValue();
    // Helper call function to find a control by fieldId in a form group
    const found = this.findControlInGroup(formValue, fieldId);
    log.info(`Found control for ${fieldId}:`, found);

    const controlVal = found ? found.value : undefined;
    const selected = (controlVal && typeof controlVal === 'object')
      ? controlVal
      : { id: controlVal, label: controlVal };

    log.info(`processSelectOptions >>> `, selected, fieldId, controlVal);

    switch (fieldId) {
      case 'modeOfIdentityId':
        this.selectedIdType = this.idTypes.find((type) => type.id === selected.id || type.name === selected.label);
        this.idType = selected.name;
        break;
      case 'language':
        this.language = selected;
        break;
      case 'maritalStatus':
        this.selectedMaritalStatus = this.maritalStatuses.find((m: MaritalStatus) => m.name === selected.id || m.value === selected.label);
        break;
      case 'bankId':
      case 'bankName':
      case 'financialBankName':
        this.selectedBank = this.banks.find((b: BankDTO) => b.id === selected.id || b.name === selected.label);
        break;
      case 'countryId':
      case 'country':
      case 'addressCountry':
        this.selectedAddressCountry = this.countries.find((c: CountryDto) => c.id === selected.id || c.name === selected.label);
        break;
      case 'citizenshipCountryId':
        this.selectedCitizenshipCountry = this.countries.find((c: CountryDto) => c.id === selected.id || c.name === selected.label);
        break;
      case 'countyState':
      case 'addressCounty':
        this.selectedState = this.states.find((state: StateDto) => state.id === selected.id || state.name === selected.label);
        break;
      case 'cityTown':
      case 'city_town':
      case 'addressCity':
        this.selectedTown = this.towns.find((town: TownDto) => town.id === selected.id || town.name === selected.label);
        break;
      case 'postalCode':
        this.selectedPostalCode = this.postalCodes.find((postalCode: PostalCodesDTO) => postalCode.id === selected.id || postalCode.zipCode === selected.label);
        break;
      case 'titleId':
        this.selectedClientTitle = this.clientTitles.find((t: ClientTitlesDto) => t.id === selected.id || t.description === selected.label);
        log.info(`selectedClientTitle >>> `, selected, this.selectedClientTitle);
        break;
      case 'currencyId':
        this.selectedCurrency = this.currencies.find((c: CurrencyDTO) => c.id === selected.id || c.name === selected.label);
        log.info(`selectedCurrency >>> `, selected, this.selectedClientTitle);
        break;
      case 'category':
      case 'role':
        this.createEntityForm();
        this.category = formValues.category;
        // this.role = formValues.role;
        this.role = this.roles.find(partyType => partyType.partyTypeName.toLowerCase() === formValues.role.toLowerCase());
        if (formValues.category && formValues.role) this.fetchFormFields(formValues.category, formValues.role);

        this.idType = this.category === 'corporate' ? 'CERT_OF_INCOP_NUMBER' : 'NATIONAL_ID';
        this.isCategorySelected = formValues.category ? true : false;
        this.shouldUploadProfilePhoto = true;
        break;
      case 'organizationType':
      case 'clientType':
      case 'accountTypeIndividual':
      case 'accountType':
        this.fetchRequiredDocuments(formValues);
        break;
      case 'bankBranchCode':
      case 'financialBranchName':
        this.selectedBankBranch = this.bankBranches.find((b: BankBranchDTO) => b.id === selected.id || b.name === selected.label);
        log.info(`selectedbank branch >>> `, selected, this.selectedBankBranch);
        break;
      case 'commissionAllowed':
      case 'financialCommAllowed':
        this.refreshVisibility();
        break;
      default:
        log.info(`no fieldId found`)
    }
  }


  /**
   * fetched list of required documents based on entity/client type
   * @param formValues
   */
  fetchRequiredDocuments(formValues): void {
    const selectedOrgOrClientOrAccType = formValues.organizationType || formValues.clientType || formValues.accountTypeIndividual || formValues.accountType;
    if (formValues.category && formValues.role && selectedOrgOrClientOrAccType && this.isCategorySelected) {
      const accountType: PartyTypeDto = this.roles.filter(
        (r:PartyTypeDto) => r.partyTypeName.toLowerCase() === formValues.role.toLowerCase())[0];

      const category: string = formValues.category;

      const accountSubType = this.getSubTypeCode(this.role?.partyTypeShtDesc, selectedOrgOrClientOrAccType);
      /*const accountSubType: ClientTypeDTO = this.clientTypes.filter(
        (c: ClientTypeDTO) => c.clientTypeName.toLowerCase() === selectedOrgOrClientType.toLowerCase())[0];
      log.info(`accountSubType >>> `, accountSubType, this.clientTypes);*/

      switch (this.role?.partyTypeShtDesc) {
        case PartyType.intermediary:
          this.requiredDocumentsService.getAccountTypeRequiredDocument(accountType.partyTypeShtDesc, null, accountSubType, null).subscribe({
            next: (data: RequiredDocumentDTO[]) => {
              this.requiredDocuments = data;
              log.info(`requiredDocuments >>> `, data);
              this.uploadGroupSections.docs = data
            },
            error: (err) => {
              log.error(`could not fetch >>> `, err)
            }
          });
          break;
        default:
          this.requiredDocumentsService.getAccountTypeRequiredDocument(accountType.partyTypeShtDesc, category, accountSubType, null).subscribe({
            next: (data: RequiredDocumentDTO[]) => {
              this.requiredDocuments = data;
              log.info(`requiredDocuments >>> `, data);
              this.uploadGroupSections.docs = data
            },
            error: (err) => {
              log.error(`could not fetch >>> `, err)
            }
          });
          break;
      }
    }
  }

  getSubTypeCode(role: string, selectedOrgOrClientOrAccType: string) {
    switch (role) {
      case PartyType.client:
        return this.clientTypes.find((c: ClientTypeDTO) =>
          c.clientTypeName.toLowerCase() === selectedOrgOrClientOrAccType.toLowerCase())?.code;
      case PartyType.intermediary:
        return this.accountTypeData.find((d: AccountTypeDTO) =>
          d.accountType.toLowerCase() === selectedOrgOrClientOrAccType.toLowerCase())?.id;
      default:
        break;
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
  /*fetchSelectOptions(groupId: string, fieldId: string): void {
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
  }*/

  /**
   * fetch dropdown options from API
   * check fieldId to determine which API to call
   * @param groupId
   * @param fieldId
   */
  fetchSelectOptions(groupId: any, fieldId: string): void {
    if (this.isPreviewMode) {
      return;
    }

    log.info(`field to populate >>> `, fieldId, groupId);

    let sectionIndex: number = -1;
    let fieldIndex: number = -1;
    let subGroupIndex: number = -1;
    let targetField: ConfigFormFieldsDto;

    if (this.formGroupSections) {
      // Find the section
      sectionIndex = this.formGroupSections.findIndex(section => section.groupId === groupId);

      if (sectionIndex !== -1) {
        const section = this.formGroupSections[sectionIndex];

        // First check in main fields
        fieldIndex = section.fields?.findIndex(field => field.fieldId === fieldId) ?? -1;
        if (fieldIndex !== -1) {
          targetField = section.fields[fieldIndex];
        } else {
          // If not found in main fields, check in subGroups
          if (section.subGroup?.length) {
            for (let i = 0; i < section.subGroup.length; i++) {
              const subGroup = section.subGroup[i];
              fieldIndex = subGroup.fields?.findIndex(field => field.fieldId === fieldId) ?? -1;
              if (fieldIndex !== -1) {
                targetField = subGroup.fields[fieldIndex];
                subGroupIndex = i;
                break;
              }
            }
          }
        }
      }
    }

    // Skip if options already loaded (except for bankId and bankBranchCode which might need refresh)
    if (targetField?.options?.length > 0 && !['bankId', 'bankBranchCode'].includes(fieldId)) {
      return;
    }

    // Call the appropriate method based on fieldId
    switch (fieldId) {
      case 'maritalStatus':
        this.fetchMaritalStatuses(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'paymentMethod':
      case 'paymentMode':
      case 'financialPaymentMode':
        this.fetchPaymentModes(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'bankId':
      case 'bankName':
      case 'financialBankName':
        this.fetchBanks(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'bankBranchCode':
      case 'branchName':
      case 'financialBranchName':
        this.fetchBankBranches(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'countryId':
      case 'citizenshipCountryId':
      case 'citizenship':
      case 'country':
      case 'addressCountry':
      case 'parent_country':
        this.fetchCountries(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'countyState':
      case 'addressCounty':
        this.fetchStatesByCountryCode(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'cityTown':
      case 'city_town':
      case 'addressCity':
        this.fetchTownsByStateCode(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'postalCode':
      case 'addressPostalCode':
        this.fetchPostalCodeByTownCode(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'organizationType':
      case 'clientType':
        this.fetchOrganizationTypes();
        break;
      case 'role':
        this.fetchSystemRoles()
        break;
      case 'titleId':
        this.fetchClientTitles(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'modeOfIdentityId':
        this.fetchIdTypes(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'currencyId':
        this.fetchCurrencies(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'freqOfPayment':
      case 'financialPaymentFrequency':
        this.fetchPremiumFrequencies(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'businessSources':
        this.fetchChannels(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'accountTypeIndividual':
      case 'accountType':
        this.fetchAccountTypes();
        break;
      case 'cnt_individual_contact_details_branch':
        this.fetchClientBranches(sectionIndex, fieldIndex, subGroupIndex);
        break;
      case 'relationsshipManager':
        this.fetchRelationshipManagers(sectionIndex, fieldIndex, subGroupIndex);
        break;

      default:
        log.warn(`No handler for field: ${fieldId}`);
    }
  }


  /**
   * validate regex
   * @param field
   * @param groupId
   */
  /*validateRegex(field: ConfigFormFieldsDto, groupId: string): void {

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
  }*/

  /**
   * generate error messages for regex
   * @param pattern
   * @param input
   * @param errorMessage
   * @param fieldId
   */
  /*generateRegexErrorMessage(pattern: RegExp, input: string, errorMessage: string, fieldId: string): void {
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
  }*/


  /**
   * get field control to display validation errors
   * @param groupId
   * @param fieldId
   */
  /*getFieldControl(groupId: string, fieldId: string) {
    return this.entityForm.get(`${groupId}.${fieldId}`);
  }*/


  /**
   * fetches all marital statuses when required by user.
   * get the index of the selected section using groupId
   * get the index of the selected field using fieldId
   * create an array of strings from marital object and assign to options of the marital status formField
   */
  fetchMaritalStatuses(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (!(this.maritalStatuses.length > 0)) {
      this.maritalStatusService.getMaritalStatus().subscribe({
        next: (data: MaritalStatus[]) => {
          this.maritalStatuses = data
          const maritalStatusStringArr = data.map((status: MaritalStatus) => this.utilService.normalizeOption(status));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = maritalStatusStringArr
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, maritalStatusStringArr);
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
  fetchPaymentModes(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (!(this.paymentModes.length > 0)) {
      this.paymentModesService.getPaymentModes().subscribe({
        next: (data: PaymentModesDto[]) => {
          this.paymentModes = data
          const paymentModesStringArr = data.map((paymentMode: PaymentModesDto) => this.utilService.normalizeOption(paymentMode));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = paymentModesStringArr
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, paymentModesStringArr);
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
  fetchBanks(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (!(this.banks.length > 0)) {
      const countryId: number = this.selectedAddressCountry?.id;
      this.bankService.getBanks(countryId).subscribe({
        next: (data: BankDTO[]) => {
          this.banks = data
          const bankStringArr = data.map((bank: BankDTO) => this.utilService.normalizeOption(bank));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = bankStringArr
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, bankStringArr);
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
   * @param subGroupIndex
   */
  fetchBankBranches(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (!(this.bankBranches.length > 0)) {
      const bankId: number = this.selectedBank?.id;
      this.bankBranches = [];
      log.info(`selected bank >>> `, this.selectedBank)
      this.bankService.getBankBranchesByBankId(bankId).subscribe({
        next: (data: BankBranchDTO[]) => {
          this.bankBranches = data;
          const bankBranchStringArr = data.map((branch: BankBranchDTO) => this.utilService.normalizeOption(branch));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = bankBranchStringArr
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, bankBranchStringArr);
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
   * @param subGroupIndex
   */
  fetchCountries(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    log.info(`fetchCountries >>> `, sectionIndex, fieldIndex, this.formGroupSections);
    if (!(this.countries.length > 0)) {
      this.countryService.getCountries().subscribe({
        next: (data: CountryDto[]) => {
          this.countries = data;
          const countryStringArr = data.map((country: CountryDto) => this.utilService.normalizeOption(country));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = countryStringArr
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, countryStringArr);
          log.info(`countryStringArr >>> `, countryStringArr);
        },
        error: err => {
          log.error(`could not fetch: `, err);
        }
      })
    } else {
      const countryStringArr = this.countries.map((country: CountryDto) => this.utilService.normalizeOption(country));
      // this.formGroupSections[sectionIndex].fields[fieldIndex].options = countryStringArr
      this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, countryStringArr);
    }
  }

  /**
   * Fetch the list of states by country code
   * @param sectionIndex
   * @param fieldIndex
   * @param subGroupIndex
   */
  fetchStatesByCountryCode(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (this.selectedAddressCountry) {
      this.countryService.getMainCityStatesByCountry(this.selectedAddressCountry?.id).subscribe({
        next: (data: StateDto[]) => {
          this.states = data;
          const stateStringArr = data.map((state: StateDto) => this.utilService.normalizeOption(state));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = stateStringArr
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, stateStringArr);
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
   * @param subGroupIndex
   */
  fetchTownsByStateCode(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (this.selectedState) {
      this.countryService.getTownsByMainCityState(this.selectedState?.id).subscribe({
        next: (data: TownDto[]) => {
          this.towns = data;
          const townStringArr = data.map((state: TownDto) => this.utilService.normalizeOption(state));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = townStringArr
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, townStringArr);
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
   * @param subGroupIndex
   */
  fetchPostalCodeByTownCode(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (this.selectedTown) {
      this.countryService.getPostalCodes(this.selectedTown?.id).subscribe({
        next: (data: PostalCodesDTO[]) => {
          this.postalCodes = data;
          const postalCodeNumArr = data.map((postalCode: PostalCodesDTO) => this.utilService.normalizeOption(postalCode));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = postalCodeNumArr
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, postalCodeNumArr);
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
   * @param subGroupIndex
   */
  fetchIdTypes(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (!(this.idTypes.length > 0)) {
      this.entityService.getIdentityType().subscribe({
        next: (data: IdentityModeDTO[]) => {
          this.idTypes = data;
          const idTypeStringArr = data.map((id: IdentityModeDTO) => this.utilService.normalizeOption(id));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = idTypeStringArr;
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, idTypeStringArr);
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
   * @param subGroupIndex
   */
  fetchCurrencies(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (!(this.currencies.length > 0)) {
      this.currencyService.getCurrencies().subscribe({
        next: (data: CurrencyDTO[]) => {
          this.currencies = data;
          const currencyStringArr = data.map((id: CurrencyDTO) => this.utilService.normalizeOption(id));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = currencyStringArr;
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, currencyStringArr);
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
   * @param subGroupIndex
   */
  fetchClientTitles(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (!(this.clientTitles.length > 0)) {
      this.clientService.getClientTitles().subscribe({
        next: (data: ClientTitlesDto[]) => {
          this.clientTitles = data;
          const titleStringArr = data.map((title: ClientTitlesDto) => this.utilService.normalizeOption(title));
          // this.formGroupSections[sectionIndex].fields[fieldIndex].options = titleStringArr;
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, titleStringArr);
          log.info(`client titles >>> `, titleStringArr)
        },
        error: err => {
          log.error(`could not fetch: `, err);
        }
      });
    }
  }

  fetchChannels(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (!(this.channelsData.length > 0)) {
      this.channelService.getChannels().subscribe({
        next: (data: ChannelsDTO[]) => {
          this.channelsData = data;
          const channelsStringArr = data.map((id: ChannelsDTO) => this.utilService.normalizeOption(id));
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, channelsStringArr);
          log.info(`channelsStringArr >>> `, channelsStringArr)
        },
        error: err => {
          log.error(`could not fetch: `, err);
        }
      });
    }
  }

  fetchRelationshipManagers(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1): void {
    if (!(this.relationshipManagersData.length > 0)) {
      this.intermediaryService.getAgents(null, 50, null, null, 10).subscribe({
        next: (data: Pagination<AgentDTO>) => {
          this.relationshipManagersData = data.content;
          const relationshipManagerStringArr = data.content.map((agent: AgentDTO) =>
            this.utilService.normalizeOption(agent)
          );
          this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, relationshipManagerStringArr);
          log.info(`relationshipManagerStringArr >>> `, relationshipManagerStringArr);
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
  /*fetchSavedDetails(eventData:any) {
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
  }*/

  fetchSavedDetails(eventData: any) {
    log.debug('Save details modal data:', eventData);
    const { subGroupId, data } = eventData;

    if (!subGroupId || !data) {
      log.warn('Invalid event data');
      return;
    }

    this.dynamicTableData[subGroupId] = data;
    log.debug(`Stored data for ${subGroupId}:`, data);
    log.info(`dynamicTableData >>> `, this.dynamicTableData);
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

  fetchPremiumFrequencies(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1) {
    this.accountService.getPremiumFrequencies().subscribe({
      next: (data: AccountsEnum[]) => {
        this.premiumFrequenciesData = data;
        const premiumFrequenciesStringArr = data.map(frequency => this.utilService.normalizeOption(frequency));
        // this.formFields[fieldIndex].options = premiumFrequenciesStringArr
        this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, premiumFrequenciesStringArr);
        log.info(`premium frequencies: `, premiumFrequenciesStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchPreferredCommunicationChannels(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1) {
    this.accountService.getPreferredCommunicationChannels().subscribe({
      next: (data: AccountsEnum[]) => {
        this.communicationChannelsData = data;
        const communicationChannelsStringArr = data.map(commChannel => this.utilService.normalizeOption(commChannel));
        this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, communicationChannelsStringArr);
        log.info(`communication channels: `, communicationChannelsStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  fetchAccountTypes(): void {
    if (!(this.accountTypeData.length > 0)) {
      this.accountService.getAccountType().subscribe({
        next: (data: AccountTypeDTO[]) => {
          this.accountTypeData = data;
          const accTypeStringArr: string[] = data.map((accType: AccountTypeDTO) => accType.accountType.toLowerCase());
          const index: number = this.uploadGroupSections.selects.findIndex((field: ConfigFormFieldsDto) => field.fieldId === "accountTypeIndividual" || field.fieldId === "accountType");
          this.uploadGroupSections.selects[index].options = accTypeStringArr;
          log.info(`acc Types: `, accTypeStringArr);
        },
        error: (err) => {
          let errorMessage = err?.error?.message ?? err.message;
          this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        },
      });
    }
  }

  fetchClientBranches(sectionIndex: number, fieldIndex: number, subGroupIndex: number = -1) {
    this.clientsService.getCLientBranches().subscribe({
      next: (data: AccountsEnum[]) => {
        this.clientBranchData = data;
        const clientBranchStringArr = data.map(clientBranch => this.utilService.normalizeOption(clientBranch));
        this.updateFieldOptions(sectionIndex, fieldIndex, subGroupIndex, clientBranchStringArr);
        log.info(`client branches: `, clientBranchStringArr);
      },
      error: err => {
        log.error(`could not fetch: `, err);
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
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
          userName: this.assignee,
          docType: file.type,
          docData: base64String,
          originalFileName: file.name
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

        switch (this.role?.partyTypeShtDesc) {
          case PartyType.client:
            this.readScannedDocuments(urls);
            break;
          case PartyType.intermediary:
            this.readAgentScannedDocuments(urls);
            break;
          default:
            break;
        }
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
            system: this.system
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
            wet: data.withEffectToDate,
            system: this.system
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

  readAgentScannedDocuments(urls): void {
    const schema = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "AgentSchema",
      "type": "object",
      "properties": {
        "fullName": {
          "type": "string",
          "description": "Agent's full name"
        },
        "docIdNumber": {
          "type": "string",
          "description": "Agent's ID number"
        },
        "taxPinNumber": {
          "type": "string",
          "description": "Agent's pib number"
        },
        "iraLicenseNo": {
          "type": "string",
          "description": "Agent's IRA license number"
        },
        "dateOfBirth": {
          "type": "string",
          "format": "date",
          "description": "Agent's date of birth"
        },
        "citizenship": {
          "type": "string",
          "description": "Agent citizenship country"
        },
        "gender": {
          "type": "string",
          "description": "Gender of an agent"
        },
        "maritalStatus": {
          "type": "string",
          "description": "Marital status of an agent"
        },
        "wef": {
          "type": "string",
          "format": "date",
          "description": "With effect from date"
        },
        "wet": {
          "type": "string",
          "format": "date",
          "description": "With effect to date"
        },
        "address": {
          "type": "string",
          "description": "Agent's address"
        },
        "country": {
          "type": "string",
          "description": "Agent's country"
        },
        "countyState": {
          "type": "string",
          "description": "Agent's county/state"
        },
        "cityTown": {
          "type": "string",
          "description": "Agent's City/Town"
        },
        "physicalAddress": {
          "type": "string",
          "description": "Physical address"
        },
        "postalAddress": {
          "type": "string",
          "description": "Postal address"
        },
        "postalCode": {
          "type": "string",
          "description": "Postal code"
        },
        "bankName": {
          "type": "string",
          "description": "Bank name"
        },
        "branchName": {
          "type": "string",
          "description": "Bank branch name"
        },
        "accountNo": {
          "type": "string",
          "description": "Account number"
        },
        "glAccount": {
          "type": "string",
          "description": "General ledger account"
        },
        "taxAuthorityCode": {
          "type": "string",
          "description": "Tax Authority code"
        },
        "vatApplicability": {
          "type": "string",
          "description": "VAT applicability"
        },
        "creditLimit": {
          "type": "string",
          "description": "Credit limit"
        },
        "paymentTerms": {
          "type": "string",
          "description": "Payment terms"
        },
        "commissionAllowed": {
          "type": "string",
          "description": "Commission allowed"
        },
        "commissionStatusEffectiveDate": {
          "type": "string",
          "format": "date",
          "description": "Commission status effective date"
        },
        "commissionStatusDate": {
          "type": "string",
          "format": "date",
          "description": "Commission status date"
        },
        "freqOfPayment": {
          "type": "string",
          "description": "Payment frequency"
        },
        "paymentMode": {
          "type": "string",
          "description": "Payment mode"
        },
        "businessSources": {
          "type": "string",
          "description": "Business sources"
        },
        "relationsshipManager": {
          "type": "string",
          "description": "Relationship manager"
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

        const dataToPatch = {
          ...data,
          fullName: data.fullName,
          docIdNumber: data.docIdNumber,
          taxPinNumber: data.taxPinNumber,
          iraLicenseNo: data.iraLicenseNo,
          dateOfBirth: data.dateOfBirth,
          citizenship: data.citizenship,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          wef: data.wef,
          wet: data.wet,
        }

        this.entityForm.patchValue({
          int_individual_prime_identity: {
            fullName: data.fullName,
            docIdNumber: data.docIdNumber,
            taxPinNumber: data.taxPinNumber,
            iraLicenseNo: data.iraLicenseNo,
            dateOfBirth: data.dateOfBirth,
            citizenship: data.citizenship,
            gender: data.gender,
            maritalStatus: data.maritalStatus,
            wef: data.wef,
            wet: data.wet
          },
          int_individual_address_details: {
            address: data.address,
            country: data.country,
            countyState: data.countyState,
            cityTown: data.cityTown,
            physicalAddress: data.physicalAddress,
            postalAddress: data.postalAddress,
            postalCode: data.postalCode
          },
          int_individual_financial_details: {
            bankName: data.bankName,
            branchName: data.branchName,
            accountNo: data.accountNo,
            glAccount: data.glAccount,
            taxAuthorityCode: data.taxAuthorityCode,
            vatApplicability: data.vatApplicability,
            creditLimit: data.creditLimit,
            paymentTerms: data.paymentTerms,
            commissionAllowed: data.commissionAllowed,
            commissionStatusEffectiveDate: data.commissionStatusEffectiveDate,
            commissionStatusDate: data.commissionStatusDate,
            freqOfPayment: data.freqOfPayment,
            paymentMode: data.paymentMode
          },
          int_corporate_prime_identity: {
            corporateFullName: data.fullName,
            businessRegNumber: data.docIdNumber,
            taxPinNumber: data.taxPinNumber,
            dateOfIncorporation: data.dateOfBirth,
            parent_country: data.citizenship,
            businessSources: data.businessSources,
            relationsshipManager: data.relationsshipManager,
            wef: data.wef,
            wet: data.wet
          },
          int_corporate_address_details: {
            address: data.address,
            addressCountry: data.country,
            addressCounty: data.countyState,
            addressCity: data.cityTown,
            addressPhysical: data.physicalAddress,
            addressPostal: data.postalAddress,
            addressPostalCode: data.postalCode
          },
          int_corporate_financial_details: {
            financialBankName: data.bankName,
            financialBranchName: data.branchName,
            financialAccNo: data.accountNo,
            financialGLAcc: data.glAccount,
            financialTaxAuthCode: data.taxAuthorityCode,
            financialVatApplicability: data.vatApplicability,
            financialCreditLimit: data.creditLimit,
            financialPaymentTerms: data.paymentTerms,
            financialCommAllowed: data.commissionAllowed,
            financialCommStatusEffectiveDate: data.commissionStatusEffectiveDate,
            financialCommStatusDate: data.commissionStatusDate,
            financialPaymentFrequency: data.freqOfPayment,
            financialPaymentMode: data.paymentMode
          }
        });

        log.info(`scanned document data >>> `, typeof dataToPatch, dataToPatch, this.entityForm.getRawValue());
        this.isPatchingFormValues = false;
        this.entityForm.enable();

      },
      error: (err) => {
        this.isPatchingFormValues = false;
        this.entityForm.enable();
        this.globalMessagingService.displayErrorMessage('Error', err.message);
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
          this.globalMessagingService.displayErrorMessage('Error', err.error);
        }
      });
  }

  getDynamicLabel(field: any, language: string): string {
    const groupForm = this.entityForm.get(field.formGroupingId) as FormGroup;
    const activeCondition = this.getActiveCondition(field, groupForm);

    // If dynamicLabel is defined, override from mapping
    if (field.dynamicLabel && groupForm) {
      const controllingValue = groupForm?.get(field.dynamicLabel.field)?.value?.label;
      const mapped = field.dynamicLabel.mapping[controllingValue];
      if (mapped) {
        return mapped[language];
      }
    }

    // else, check if condition-specific label should override
    if (activeCondition?.config?.label) {
      return activeCondition.config.label[language];
    }

    return field.label?.[language];
  }

  /*getValidationMessage(field: any, language: string): string | null {
    const groupForm = this.entityForm.get(field.formGroupingId) as FormGroup;
    const control = groupForm?.get(field.fieldId);

    if (!control || !control.errors) return null;

    if (!(control.touched || control.dirty)) {
      return null;
    }

    const activeCondition = this.getActiveCondition(field, groupForm);
    const validations = activeCondition?.config?.validations || field.validations || [];

    if (control.errors['pattern']) {
      const patternValidation = validations.find(v => v.type === 'pattern');
      if (patternValidation?.message) {
        return patternValidation.message[language] || patternValidation.message['en'];
      }
    }

    if (control.errors['required']) {
      return `${this.getDynamicLabel(field, language)} is required.`;
    }

    return null;
  }*/

  getValidationMessage(field: any, language: string): string | null {
    // log.info("validation", field, language);
    const groupForm = this.entityForm.get(field.formGroupingId) as FormGroup;
    const control = groupForm?.get(field.fieldId);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const activeCondition = this.getActiveCondition(field, groupForm);
    const validations = activeCondition?.config?.validations || field.validations || [];

    // Find the first validation that matches the current error
    const errorType = Object.keys(control.errors)[0];
    const validation = validations.find(v => v.type === errorType)
    // log.info("validation", validation, errorType, validations);

    if (validation?.message) {
      return validation.message[language] || validation.message['en'];
    }

    // Default validation messages
    switch (errorType) {
      case 'required':
        return `${this.getDynamicLabel(field, language)} is required.`;
      case 'min':
        return `${this.getDynamicLabel(field, language)} must be at least ${control.errors['min'].min}.`;
      case 'max':
        return `${this.getDynamicLabel(field, language)} cannot be more than ${control.errors['max'].max}.`;
      case 'minlength':
        return `${this.getDynamicLabel(field, language)} must be at least ${control.errors['minlength'].requiredLength} characters.`;
      case 'maxlength':
        return `${this.getDynamicLabel(field, language)} cannot be more than ${control.errors['maxlength'].requiredLength} characters.`;
      case 'email':
        return 'Please enter a valid email address.';
      case 'pattern':
        return 'Please enter a valid value.';
      default:
        return null;
    }
  }

  private getActiveCondition(field: any, groupForm: FormGroup): any | null {
    if (!field.conditions || !groupForm) return;

    for (const cond of field.conditions) {
      const controllingValue = groupForm.get(cond.field)?.value?.label;
      if (controllingValue === cond.value) {
        return cond;
      }
    }
    return null;
  }

  private applyDynamicValidators(field: any, groupForm: FormGroup): void {
    const control = groupForm.get(field.fieldId);
    if (!control) return;

    const activeCondition = this.getActiveCondition(field, groupForm);
    const validations = (activeCondition?.config?.validations) || (field.validations) || [];

    const angularValidators = validations.map((v: any) => {
      if (v.type === 'pattern') return Validators.pattern(v.value);
      if (v.type === 'required') return Validators.required;
      if (v.type === 'min') return Validators.min(v.value);
      if (v.type === 'max') return Validators.max(v.value);
      if (v.type === 'minlength') return Validators.minLength(v.value);
      if (v.type === 'maxlength') return Validators.maxLength(v.value);
      if (v.type === 'email') return Validators.email;
      return null;
    }).filter(Boolean);

    if (field.mandatory && !validations.some(v => v.type === 'required')) {
      angularValidators.push(Validators.required);
    }

    control.setValidators(angularValidators);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private evaluateFieldVisibility(field: any, groupForm: FormGroup | null): boolean {
    if (field.visible === false) return false;

    const activeCondition = this.getActiveCondition(field, groupForm);

    log.info("active condition", activeCondition);
    if (!field.conditions || !groupForm) {
      return field.visible !== false;
    }

    for (const cond of field.conditions) {
      const control = groupForm.get(cond.field);
      if (control && control.value === cond.value) {
        return cond.visible !== false;
      }
    }

    return field.visible !== false;
  }

  private refreshVisibility(): void {
    this.formGroupSections.forEach(group => {
      const groupForm = this.entityForm.get(group.groupId) as FormGroup | null;

      if (group.fields) {
        group.fields.forEach(field => {
          field.isVisible = this.evaluateFieldVisibility(field, groupForm);
        });
      }

      if (group.subGroup) {
        group.subGroup.forEach(sub => {
          if (sub.fields) {
            sub.fields.forEach(field => {
              field.isVisible = this.evaluateFieldVisibility(field, groupForm);
            });
          }
        });
      }
    });
  }

  addGroupToCollapsedGroups(): void {
    this.formGroupSections.forEach(group => {
      if (group.groupId?.includes('prime_identity')) {
        this.collapsedGroups.add(group.groupId);
      }
    });
  }

  /**
   * Updates the options of a field in either the main section or a subgroup
   * @param sectionIndex Index of the section
   * @param fieldIndex Index of the field within the section
   * @param subGroupIndex Index of the subgroup (if applicable, -1 for main section)
   * @param options Array of options to set
   */
  private updateFieldOptions(
    sectionIndex: number,
    fieldIndex: number,
    subGroupIndex: number,
    options: any[]
  ): void {
    if (sectionIndex === -1 || fieldIndex === -1) {
      log.warn('Invalid section or field index', { sectionIndex, fieldIndex });
      return;
    }

    const section = this.formGroupSections?.[sectionIndex];
    if (!section) {
      log.warn('Section not found', { sectionIndex });
      return;
    }

    // Update options in subgroup if subGroupIndex is valid
    if (subGroupIndex >= 0) {
      const subGroup = section.subGroup?.[subGroupIndex];
      if (subGroup?.fields?.[fieldIndex]) {
        subGroup.fields[fieldIndex].options = [...options];
        return;
      }
    }

    // Fall back to main section fields
    if (section.fields?.[fieldIndex]) {
      section.fields[fieldIndex].options = [...options];
    } else {
      log.warn('Field not found in section or subgroup', {
        sectionIndex,
        fieldIndex,
        subGroupIndex,
        hasSubGroups: !!section.subGroup?.length
      });
    }
  }

  private getDataByPattern(pattern: string): any[] {
    // Get all data for subgroups matching a pattern
    return Object.keys(this.dynamicTableData)
      .filter(key => key.includes(pattern))
      .map(key => this.dynamicTableData[key])
      .flat();
  }

  get countryISO(): CountryISO | undefined {
    return this.selectedAddressCountry?.short_description as CountryISO || this.defaultCountryISO;
  }

  findControlInGroup = (group: any, id: string): any => {
    for (const key in group) {
      if (key === id) {
        return { value: group[key], group: group };
      }
      if (typeof group[key] === 'object' && group[key] !== null) {
        const found = this.findControlInGroup(group[key], id);
        if (found) return found;
      }
    }
    return null;
  }

  openTableSelectModal(fieldId?: string) {
    const modal = document.getElementById('tableSelectModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
    this.tableSelectFieldId = fieldId;
  }

  closeTableSelectModal() {
    const modal = document.getElementById('tableSelectModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Handles the selection of a row in a user table.
   * Displays an info message, logs event data, and patches a specified field in the entity form.
   * @param event The event object containing the selected row's data.
   */
  onTableDetailsSelect(event): void {
    this.globalMessagingService.displayInfoMessage(
      'GL selected',
      event.data.accountName
    );
    log.info("event", event.data, this.selectedTableRecord);
  }

  lazyLoadGlAccount(event: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.receiptManagementService.getGlAccounts(pageIndex, pageSize, sortField, sortOrder)
      .subscribe({
        next: (response: GenericResponse<Pagination<GLAccountDTO>>) => {
          this.glAccounts = response;
          this.filteredGlAccounts = [...response.data.content];
          log.info(`Fetched gl accounts>>>`, response);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      });
  }

  filter() {
    if (!this.glAccounts?.data?.content) return;

    this.filteredGlAccounts = this.glAccounts.data.content.filter(account => {
      const matchesAccountNumber = !this.filterObject.accountNumber ||
        account.accountNumber?.toLowerCase().includes(this.filterObject.accountNumber.toLowerCase());

      const matchesAccountName = !this.filterObject.accountName ||
        account.accountName?.toLowerCase().includes(this.filterObject.accountName.toLowerCase());

      return matchesAccountNumber && matchesAccountName;
    });
  }

  inputAccountNumber(event: any) {
    this.filterObject.accountNumber = event?.target?.value || '';
    this.filter();
  }

  inputAccountName(event: any) {
    this.filterObject.accountName = event?.target?.value || '';
    this.filter();
  }

  /**
   * Gets the maximum date by subtracting years from today's date based on field validations
   * @param field The field object containing validations
   * @returns The maximum allowed date string in 'YYYY-MM-DD' format or undefined if no max validation found
   */
  getMaxDateValidation(field: ConfigFormFieldsDto): string | undefined {
    if (!field?.validations?.length) {
      return undefined;
    }

    const maxValidation = field.validations.find(
      (validation: any) => validation.type?.toLowerCase() === 'max' && validation.value
    );

    if (!maxValidation) {
      return undefined;
    }

    const yearsToSubtract = Number(maxValidation.value);
    if (isNaN(yearsToSubtract)) {
      return undefined;
    }

    const today = new Date();
    const maxDate = new Date(today.getFullYear() - yearsToSubtract, today.getMonth(), today.getDate());

    const groupForm = this.entityForm.get(field.formGroupingId) as FormGroup;
    const control = groupForm?.get(field.fieldId);

    if (control) {
      control.setValidators([Validators.max(maxDate.getTime())]);
      control.updateValueAndValidity();
    }
    return maxDate.toISOString().split('T')[0];
  }
}
