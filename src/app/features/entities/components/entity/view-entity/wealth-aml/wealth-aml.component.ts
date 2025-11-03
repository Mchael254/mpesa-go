import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Logger, UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {TableDetail, TableFieldConfig} from "../../../../../../shared/data/table-detail";
import {BankService} from "../../../../../../shared/services/setups/bank/bank.service";
import {Observable} from "rxjs";
import {FundSourceDTO} from "../../../../../../shared/data/common/bank-dto";
import {SectorService} from "../../../../../../shared/services/setups/sector/sector.service";
import {SectorDTO} from "../../../../../../shared/data/common/sector-dto";
import {OccupationDTO} from "../../../../../../shared/data/common/occupation-dto";
import {OccupationService} from "../../../../../../shared/services/setups/occupation/occupation.service";
import {AccountService} from "../../../../services/account/account.service";
import {AccountsEnum} from "../../../../data/enums/accounts-enum";
import {ClientService} from "../../../../services/client/client.service";
import {ClientDTO, Cr12Detail, OwnershipDetails, WealthAmlDetails} from "../../../../data/ClientDTO";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto,
  FormSubGroupsDto,
  SaveAction, UserCategory,
} from "../../../../../../shared/data/common/dynamic-screens-dto";
import {CountryDto} from "../../../../../../shared/data/common/countryDto";
import {CountryService} from "../../../../../../shared/services/setups/country/country.service";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {EntityUtilService} from "../../../../services/entity-util.service";

const log = new Logger('WealthAmlComponent');

@Component({
  selector: 'app-wealth-aml',
  templateUrl: './wealth-aml.component.html',
  styleUrls: ['./wealth-aml.component.css']
})
export class WealthAmlComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeDeleteDialogButton') closeDeleteDialogButton!: ElementRef<HTMLButtonElement>;

  @Input() clientDetails: ClientDTO;
  @Input() wealthAmlDetailsConfig: any
  @Input() wealthAmlDetails: WealthAmlDetails[];
  @Input() group: FormGroupsDto;
  @Input() formGroupsAndFieldConfig: DynamicScreenSetupDto;

  subGroups: FormSubGroupsDto[];

  ownershipDetails: OwnershipDetails[];
  shouldShowCr12Details: boolean = false;
  cr12SearchSubString: string = 'cr12';


  language: string = 'en';
  editForm: FormGroup;

  columnLabel: {};
  columns: TableFieldConfig[] = [];
  tableDetails: TableDetail;
  pageSize: number = 5;
  totalRecords: number;

  sourcesOfFunds$: Observable<FundSourceDTO[]>;
  sourcesOfFunds: FundSourceDTO[];

  sectors$: Observable<SectorDTO[]>;
  sectors: SectorDTO[];

  occupations$: Observable<OccupationDTO[]>;
  occupations: OccupationDTO[];

  communicationChannels$: Observable<AccountsEnum[]>;
  communicationChannels: AccountsEnum[];

  premiumFrequencies$: Observable<AccountsEnum[]>;
  premiumFrequencies: AccountsEnum[];

  employmentTypes$: Observable<AccountsEnum[]>;
  employmentTypes: AccountsEnum[];

  insurancePurposes$: Observable<AccountsEnum[]>;
  insurancePurposes: AccountsEnum[];

  countries$: Observable<CountryDto[]>;
  countries: CountryDto[];

  shouldShowEditForm: boolean = true;
  selectedWealthAmlRecord: WealthAmlDetails;
  selectedCr12Record: Cr12Detail;
  cr12Details: Cr12Detail[];
  selectedOwnershipDetail: OwnershipDetails;

  formFields: ConfigFormFieldsDto[] = [];
  saveAction: SaveAction;
  selectedSubgroup: FormSubGroupsDto;

  excludedKeys = [
    "businessPersonIdCorporate",
    "cr12CorporateId",
    "amlIdCorporate",
    "ownershipIdCorporate",
    "amlIdIndividual"
  ];

  protected readonly PhoneNumberFormat = PhoneNumberFormat;
  protected readonly CountryISO = CountryISO;
  protected readonly SearchCountryField = SearchCountryField;


  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private globalMessagingService: GlobalMessagingService,
    private bankService: BankService,
    private sectorService: SectorService,
    private occupationService: OccupationService,
    private accountService: AccountService,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
    private countryService: CountryService,
    private entityUtilService: EntityUtilService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => this.language = lang);
  }


  ngOnInit(): void {
    this.prepareSubgroupTables();
    this.sourcesOfFunds$ = this.bankService.getFundSource();
    this.sectors$ = this.sectorService.getSectors();
    this.initData();
    this.occupations$ = this.occupationService.getOccupations();
    this.communicationChannels$ = this.accountService.getCommunicationChannels();
    this.premiumFrequencies$ = this.accountService.getPremiumFrequencies();
    this.employmentTypes$ = this.accountService.getEmploymentTypes();
    this.insurancePurposes$ = this.accountService.getInsurancePurpose();
    this.countries$ = this.countryService.getCountries();
  }

  initData(): void {
    this.sourcesOfFunds$.subscribe({
      next: res => {
        this.sourcesOfFunds = res;
      },
      error: err => {}
    });

    this.sectors$.subscribe({
      next: res => {
        this.sectors = res;
        log.info('Sectors loaded', this.sectors);
      },
      error: err => {}
    })
  }

  prepareSubgroupTables(): void {
    setTimeout(() => {
      this.ownershipDetails = this.clientDetails.ownershipDetails;
      this.wealthAmlDetails = this.clientDetails.wealthAmlDetails;

      const fields = this.formGroupsAndFieldConfig?.fields;
      this.setSelectOptions(fields)

      this.group.subGroup.forEach(sub => {
        sub.fields = fields.filter(field => field.formSubGroupingId === sub.subGroupId);
        const tableData = this.createTableDisplay(sub);
        sub.table = {
          cols: sub.fields,
          data: tableData
        };
      });

      this.subGroups = this.group.subGroup;
      this.cdr.detectChanges();

    }, 1000);
  }

  /**
   * create table display
   * check subgroupId and create table data based on identified id
   * @param subgroup
   * @return tableData
   */
  createTableDisplay(subgroup: FormSubGroupsDto): any[] {

    const subgroupId = subgroup.subGroupId;
    const tableData = [];
    let dataRecord = [];

    switch (subgroupId) {
      case '360_overview_corporate_ownership_details':
        dataRecord = this.clientDetails.ownershipDetails;
        dataRecord.forEach(record => {
          const ownershipDetails = {
            ownershipIdCorporate: record.code,
            overview_stakeholder_name: record.name,
            overview_stakeholder_doc_id_no: record.idNumber,
            overview_stakeholder_mobile_no: record.contactPersonPhone,
            overview_stakeholder_percent_ownership: record.percentOwnership
          };
          tableData.push(ownershipDetails);
        });
        break;

        case '360_overview_corporate_aml_details':
          dataRecord = this.clientDetails.wealthAmlDetails;
          dataRecord.forEach(record => {

            const amlDetails = {
              amlIdCorporate: record.id,
              overview_trading_name: record.tradingName,
              overview_registered_name: record.registeredName,
              overview_cert_reg_no: record.certificateRegistrationNumber,
              overview_cert_reg_year: record.certificateYearOfRegistration,
              overview_parent_country: record.parentCountry,
              overview_aml_operating_country: record.operatingCountry,
              overview_fund_source: record?.fundsSource,
              overview_economic_sector: record.sector?.name,

              overview_source_of_funds: record.fundsSource,
            }

            tableData.push(amlDetails);
          });
          break;

      case '360_overview_individual_aml_details':
        dataRecord = this.clientDetails.wealthAmlDetails;
        dataRecord.forEach(record => {
          const amlDetails = {
            amlIdIndividual: record.id,
            overview_source_of_funds: record.fundsSource,
            overview_employment_type: record.employmentStatus,
            overview_economic_sector: record.sector?.sectorName,
            overview_occupation: record.occupation?.occupationName,
            overview_insurance_purpose: record.insurancePurpose,
            overview_premium_frequency: record.premiumFrequency,
            overview_distribution_channel: record.distributeChannel
          }
          tableData.push(amlDetails);
        });
        break;
      default:
        //
    }
    return tableData;
  }

  /**
   * prepare and display cr12 details based on selected AML record
   * @param row
   */
  handleCr12Display(row: any) {
    this.shouldShowCr12Details = false;

    this.selectedWealthAmlRecord = this.clientDetails.wealthAmlDetails.find(item => item.registeredName === row.overview_registered_name);
    const cr12Details = this.selectedWealthAmlRecord?.cr12Details;
    const subGroup = this.group.subGroup.find(subGroup => subGroup.subGroupId.includes(this.cr12SearchSubString));

    let tableData = [];

    if (cr12Details && cr12Details.length > 0) {
      cr12Details.forEach(record => {
        const cr12Details = {
          cr12CorporateId: record.cr12Code,
          overview_name: record.directorName,
          overview_company_reg_no: record.directorIdRegNo,
          overview_address: record.address,
          overview_company_reg_date: record.certificateRegistrationYear,
          overview_ref_no: record.certificateReferenceNo,
          overview_ref_no_year: record.certificateRegistrationYear,
        }
        tableData.push(cr12Details);
      });
      subGroup.table.data = tableData;
      this.shouldShowCr12Details = true;
      this.cr12Details = cr12Details;
    }
  }

  /**
   * handle delete wealth AML record
   * @param row
   * @param subGroup
   */
  handleWealthAmlDelete(row: any, subGroup: FormSubGroupsDto) {
    if (subGroup.subGroupId.includes('ownership')) {
      this.deleteOwnershipRecord(row, subGroup);
    } else {
      this.deleteWealthAmlRecord(row, subGroup);
    }
  }

  deleteOwnershipRecord(row: any, subGroup: FormSubGroupsDto): void {
    const ownershipId = row.ownershipIdCorporate
    this.clientService.deleteOwnershipRecord(ownershipId).subscribe({
      next: () => {
        const foundSubgroup = this.subGroups.find(sub => sub.subGroupId === subGroup.subGroupId);
        foundSubgroup.table.data = subGroup.table.data.filter(owner => (owner.ownershipIdCorporate || owner.ownershipIdCorporate) != ownershipId);
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully ownership record');
        this.getClientDetails(this.clientDetails.clientCode);
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err.error?.errors[0]);
      }
    });
  }

  deleteWealthAmlRecord(row: any, subGroup: FormSubGroupsDto): void {
    const amlId = row.amlIdIndividual ? row.amlIdIndividual : row.amlIdCorporate;
    this.clientService.deleteAmlRecord(amlId).subscribe({
      next: () => {
        const foundSubgroup = this.subGroups.find(sub => sub.subGroupId === subGroup.subGroupId);
        foundSubgroup.table.data = subGroup.table.data.filter(aml => (aml.amlIdIndividual || aml.amlIdIndividual) != amlId);
        this.shouldShowCr12Details = false;
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted AML record');
        this.getClientDetails(this.clientDetails.clientCode);
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err.error?.errors[0]);
      }
    });
  }

  /**
   * handle delete wealth cr12 record
   * @param row
   * @param subGroup
   */
  handleCr12Delete(row: any, subGroup: FormSubGroupsDto) {
    this.clientService.deleteCr12Record(row.cr12CorporateId).subscribe({
      next: () => {
        subGroup.table.data = subGroup.table.data.filter(cr12 => cr12.cr12CorporateId !== row.cr12CorporateId);
        this.shouldShowCr12Details = false;
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted AML record');
        this.getClientDetails(this.clientDetails.clientCode);
        this.cdr.detectChanges();
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err.error?.errors[0]);
      }
    });
  }

  getClientDetails(clientCode: number) {
    this.clientService.getClientDetailsByClientCode(clientCode).subscribe({
      next: (res) => {
        this.clientDetails = res;
        this.prepareSubgroupTables();
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', 'Could not fetch client details');
      },
    })
  }


  prepareEditAmlForm(data: any, subGroup: FormSubGroupsDto): void {
    this.formFields =  subGroup.fields.map(field => ({...field}));
    let row = data.row;
    this.selectedSubgroup = subGroup;

    switch (subGroup.subGroupId) {
      case '360_overview_corporate_aml_details':
        this.saveAction = Object.keys(data).length > 0 ? SaveAction.EDIT_AML_DETAILS : SaveAction.SAVE_AML_DETAILS;
        this.selectedWealthAmlRecord = this.wealthAmlDetails.find(aml => aml.id === row.amlIdCorporate)
        break;
      case '360_overview_individual_aml_details':
        this.saveAction = Object.keys(data).length > 0 ? SaveAction.EDIT_AML_DETAILS : SaveAction.SAVE_AML_DETAILS;
        this.selectedWealthAmlRecord = this.wealthAmlDetails.find(aml => aml.id === row.amlIdIndividual)
        break;
      case '360_overview_corporate_cr12_details':
        this.saveAction = Object.keys(row).length > 0 ? SaveAction.EDIT_CR12_DETAILS : SaveAction.SAVE_CR12_DETAILS;
        this.selectedCr12Record = this.cr12Details.find(cr12 => cr12.cr12Code === row.cr12CorporateId);
        row = this.selectedCr12Record;
        break;
      case '360_overview_corporate_ownership_details':
        this.saveAction = Object.keys(data).length > 0 ? SaveAction.EDIT_OWNERSHIP_DETAILS : SaveAction.SAVE_OWNERSHIP_DETAILS;
        this.selectedOwnershipDetail = this.ownershipDetails.find(owner => owner.code === row.ownershipIdCorporate);
        this.editForm.reset();
        break;
    }

    this.editForm = this.entityUtilService.createEditForm(this.formFields);
    this.patchFormValues(row);
    this.editButton.nativeElement.click();
  }

  openEditWealthAmlDialog(showEditForm?: boolean, wealthAmlRecord?): void {
    this.editButton.nativeElement.click();
    this.shouldShowEditForm = showEditForm;
    this.selectedWealthAmlRecord = wealthAmlRecord;
    setTimeout(() => {this.patchFormValues(wealthAmlRecord)}, 500)
  }

  setSelectOptions(fields: ConfigFormFieldsDto[]): void {
    fields.forEach(field => {
      switch (field.fieldId) {
        case 'overview_source_of_funds':
        case 'overview_fund_source':
          this.sourcesOfFunds$.subscribe({
            next: (res) => {
              field.options = res;
              this.sourcesOfFunds = res;
            }
          })
          break;

        case 'sector':
        case 'overview_economic_sector':
          this.sectors$.subscribe({
            next: (res) => {
              field.options = res;
              this.sectors = res
            }
          })
          break;

        case 'overview_parent_country':
        case 'overview_aml_operating_country':
          this.countries$.subscribe({
            next: (res) => {
              field.options = res;
              this.countries = res;
            }
          });
          break;

        case 'overview_occupation':
          this.occupations$.subscribe({
            next: (res) => {
              field.options = res;
              this.occupations = res;
            }
          });
          break;

        case 'overview_distribution_channel':
          this.communicationChannels$.subscribe({
            next: (res) => {
              field.options = res;
              this.communicationChannels = res;
            }
          });
          break;

        case 'overview_employment_type':
          this.employmentTypes$.subscribe({
            next: (res) => {
              field.options = res;
              this.employmentTypes = res;
            }
          });
          break;

        case 'overview_insurance_purpose':
          this.insurancePurposes$.subscribe({
            next: (res) => {
              field.options = res;
              this.insurancePurposes = res;
            }
          });
          break;

        case 'overview_premium_frequency':
          this.premiumFrequencies$.subscribe({
            next: (res) => {
              field.options = res;
              this.premiumFrequencies = res;
            }
          });
          break;
        default:
          // do nothing;
      }
    });
  }

  patchFormValues(record): void {
    const category = this.clientDetails.category.toUpperCase();

    let patchData = {};
    switch (this.saveAction) {
      case SaveAction.EDIT_AML_DETAILS:
        if (this.shouldShowEditForm) {

          const parentCountry = this.countries?.find(country => country.name === record.overview_parent_country);
          const operatingCountry = this.countries?.find(country => country.name === record.overview_aml_operating_country);
          const sector = this.sectors?.find(s => s.name === record.overview_economic_sector);
          // const fundsSource = this.sourcesOfFunds.find(f => f.name === record.overview_source_of_funds);
          log.info('path data', record, category);


          if (category === UserCategory.CORPORATE) {
            patchData = {
              overview_trading_name: record.overview_trading_name,
              overview_registered_name: record.overview_registered_name,
              overview_cert_reg_no: record.overview_cert_reg_no,
              overview_cert_reg_year: record.overview_cert_reg_year,
              overview_aml_operating_country: operatingCountry?.id,
              overview_parent_country: parentCountry?.id,
              overview_fund_source: record.overview_fund_source,
              overview_economic_sector: sector?.id,
            }
          }  else if (category === UserCategory.INDIVIDUAL) {
            patchData = {
              overview_source_of_funds: record.overview_source_of_funds,
              overview_employment_type: record.overview_employment_type,
              overview_economic_sector: record.overview_economic_sector,
              overview_occupation: record.overview_occupation,
              overview_insurance_purpose: record.overview_insurance_purpose,
              overview_premium_frequency: record.overview_premium_frequency,
              overview_distribution_channel: record.overview_distribution_channel,
            }
          }

        }
        break;

      case SaveAction.EDIT_CR12_DETAILS:
        patchData = {
          overview_name: record.directorName,
          overview_company_reg_no: record.directorIdRegNo,
          overview_address: record.address,
          overview_company_reg_date: record.certificateReferenceNo,
          overview_ref_no: record.certificateReferenceNo,
          overview_ref_no_year: record.certificateRegistrationYear,
        }
        break;

      case SaveAction.EDIT_OWNERSHIP_DETAILS:
        patchData = {
          overview_stakeholder_name: record.overview_stakeholder_name,
          overview_stakeholder_doc_id_no: record.overview_stakeholder_doc_id_no,
          overview_stakeholder_mobile_no: record.overview_stakeholder_mobile_no,
          overview_stakeholder_percent_ownership: record.overview_stakeholder_percent_ownership,
        }
        break;

        default:
          //
    }
    this.editForm.patchValue(patchData);
  }

  saveDetails() {
    switch (this.saveAction) {
      case SaveAction.SAVE_AML_DETAILS:
      case SaveAction.EDIT_AML_DETAILS:
        this.addEditWealthAml();
        break;
      case SaveAction.EDIT_CR12_DETAILS:
      case SaveAction.SAVE_CR12_DETAILS:
        this.addEditCr12Detail();
        break;
      case SaveAction.SAVE_OWNERSHIP_DETAILS:
      case SaveAction.EDIT_OWNERSHIP_DETAILS:
        this.addEditOwnershipDetail();
        break;
      default:
      // do something
    }
  }

  addEditOwnershipDetail(): void {
    const formValues = this.editForm.getRawValue();

    const ownershipDetail = {
      ...this.selectedOwnershipDetail,
      name: formValues.overview_stakeholder_name,
      idNumber: formValues.overview_stakeholder_doc_id_no,
      contactPersonPhone: (formValues.overview_stakeholder_mobile_no?.internationalNumber)?.replace(/\s+/g, ''),
      percentOwnership: formValues.overview_stakeholder_percent_ownership,
    }

    const client = {
      clientCode: this.clientDetails.clientCode,
      partyAccountCode: this.clientDetails.partyAccountCode,
      partyId: this.clientDetails.partyId,
      ownershipDetails: [ownershipDetail]
    }

    this.updateClientSection(client);
  }


  addEditCr12Detail(): void {
    const formValues = this.editForm.getRawValue();

    const cr12Detail = {
      ...this.selectedCr12Record,
      clientCode: this.clientDetails.clientCode,
      wealthDetailsCode: this.selectedWealthAmlRecord.id,
      directorName: formValues.overview_name,
      certificateReferenceNo: formValues.overview_ref_no,
      certificateRegistrationYear: formValues.overview_ref_no_year,
      address: formValues.overview_address,
      directorIdRegNo: formValues.overview_company_reg_no,
    }

    this.clientService.updateCr12Record(cr12Detail).subscribe({
      next: res => {

        // if new record, append to cr12Details, else replace.
        if (this.saveAction === SaveAction.SAVE_CR12_DETAILS) {
          this.cr12Details.push(res);
        } else if (this.saveAction === SaveAction.EDIT_CR12_DETAILS) {
          const index = this.cr12Details.findIndex(item => item.cr12Code === res.cr12Code);
          if (index !== -1) this.cr12Details[index] = res;
        }

        this.prepareSubgroupTables();
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully created/updated cr12 record');
        this.closeButton.nativeElement.click();
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err?.error?.message);
        this.closeButton.nativeElement.click();
      }
    });
  }


  addEditWealthAml(): void {
    const formValues = this.editForm.getRawValue();
    const operatingCountry = this.countries?.find(country => country.name === formValues.overview_aml_operating_country);
    const parentCountry = this.countries?.find(country => country.name === formValues.overview_parent_country);
    const sectorId = (this.sectors.find(s => s.name === formValues.overview_economic_sector))?.id;
    const sourceOfWealthId = (this.sourcesOfFunds?.find(s => s.name ===  formValues.overview_fund_source))?.code;


    let wealthAml: {};
    const category = this.clientDetails.category.toUpperCase();
    log.info('form values ', formValues, category);


    if (category === UserCategory.CORPORATE) {
      wealthAml = {
        ...this.selectedWealthAmlRecord,
        fundsSource: formValues.overview_fund_source,
        sourceOfWealthId,
        sectorId,
        sector: formValues.overview_economic_sector,
        tradingName: formValues.overview_trading_name,
        registeredName: formValues.overview_registered_name,
        certificateRegistrationNumber: formValues.overview_cert_reg_no,
        certificateYearOfRegistration: formValues.overview_cert_reg_year,
        parentCountryId: formValues.overview_parent_country,
        operatingCountryId: formValues.overview_aml_operating_country,
        operatingCountry: operatingCountry?.id,
        parentCountry: parentCountry?.id,
      };
    } else if (category === UserCategory.INDIVIDUAL) {
      wealthAml = {
        ...this.selectedWealthAmlRecord,
        fundsSource: formValues.overview_fund_source,
        sourceOfWealthId,
        sectorId,
        employmentStatus: formValues.overview_employment_type,
        occupationId: formValues.overview_occupation ,
        insurancePurpose: formValues.overview_insurance_purpose,
        premiumFrequency: formValues.overview_premium_frequency ,
        distributeChannel: formValues.overview_distribution_channel,
      };
    }

    const client = {
      clientCode: this.clientDetails.clientCode,
      partyAccountCode: this.clientDetails.partyAccountCode,
      partyId: this.clientDetails.partyId,
      wealthAmlDetails: [wealthAml]
    }

    this.updateClientSection(client);
  }

  updateClientSection(client): void {
    this.clientService.updateClientSection(this.clientDetails.clientCode, client).subscribe({
      next: data => {
        this.clientDetails = data;
        this.prepareSubgroupTables();
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully created/updated client record');
        this.closeButton.nativeElement.click();
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err?.error?.message);
        this.closeButton.nativeElement.click();
      }
    });
  }

  deleteAmlRecord(): void {
    const deleteIndex = this.wealthAmlDetails.findIndex(item => item.id === this.selectedWealthAmlRecord.id);
    const amlIdToDelete = this.wealthAmlDetails[deleteIndex]?.id;

    this.clientService.deleteAmlRecord(amlIdToDelete).subscribe({
      next: res => {
        this.globalMessagingService.displaySuccessMessage('success', 'Wealth/AML details deleted successfully!')
        if (deleteIndex > -1)  this.wealthAmlDetails.splice(deleteIndex, 1);
        this.closeDeleteDialogButton.nativeElement.click();
        // this.prepareTableDetails();
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('error', 'Wealth/AML details failed to delete! ' + err.error.message)
      }
    });
  }

  checkTelNumber(mainStr: string): boolean {
    return this.entityUtilService.checkTelNumber(mainStr);
  }

}
