import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {TableDetail, TableFieldConfig} from "../../../../../../shared/data/table-detail";
import {BankService} from "../../../../../../shared/services/setups/bank/bank.service";
import {forkJoin, Observable} from "rxjs";
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
  DynamicScreenSetupDto,
  FormGroupsDto,
  FormSubGroupsDto
} from "../../../../../../shared/data/common/dynamic-screens-dto";

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
  @Input() wealthAmlDetails: any;
  @Input() accountCode: number;
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

  shouldShowEditForm: boolean = true;

  selectedWealthAmlRecord: any;

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
  ) {
    this.utilService.currentLanguage.subscribe(lang => this.language = lang);
  }


  ngOnInit(): void {

    this.prepareSubgroupTables();

    this.sourcesOfFunds$ = this.bankService.getFundSource();
    this.sectors$ = this.sectorService.getSectors();
    this.occupations$ = this.occupationService.getOccupations();
    this.communicationChannels$ = this.accountService.getCommunicationChannels();
    this.premiumFrequencies$ = this.accountService.getPremiumFrequencies();
    this.employmentTypes$ = this.accountService.getEmploymentTypes();
    this.insurancePurposes$ = this.accountService.getInsurancePurpose();
    // this.initData();

    // this.createEditForm(this.formFieldsConfig.fields);
  }


  prepareSubgroupTables(): void {
    setTimeout(() => {
      this.ownershipDetails = this.clientDetails.ownershipDetails;
      const fields = this.formGroupsAndFieldConfig.fields;

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
              overview_parent_country: record.parentCountryId,
              overview_aml_operating_country: record.operatingCountryId,
              overview_fund_source: record.fundsSource,
              overview_economic_sector: record.sector
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
            overview_economic_sector: record.sector.sectorName,
            overview_occupation: record.occupation.occupationName,
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

    const amlDetails = this.clientDetails.wealthAmlDetails.find(item => item.registeredName === row.overview_registered_name);
    const cr12Details = amlDetails?.cr12Details;
    const subGroup = this.group.subGroup.find(subGroup => subGroup.subGroupId.includes(this.cr12SearchSubString));

    let tableData = [];

    if (cr12Details && cr12Details.length > 0) {
      cr12Details.forEach(record => {
        const cr12Details = {
          cr12CorporateId: record.cr12Code,
          overview_name: record.directorName,
          overview_company_reg_no: record.directorIdRegNo,
          overview_address: null,
          overview_company_reg_date: record.certificateRegistrationYear,
          overview_ref_no: record.certificateReferenceNo,
          overview_ref_no_year: record.certificateRegistrationYear,
        }
        tableData.push(cr12Details);
      });
      subGroup.table.data = tableData;
      this.shouldShowCr12Details = true;
      log.info('wealth aml details selected >>> ', cr12Details, subGroup);
    }
  }

  /**
   * handle delete wealth AML record
   * @param row
   */
  handleWealthAmlDelete(row: any, subGroup: FormSubGroupsDto) {
    log.info('handling wealth aml delete...', row, subGroup);
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

  initData(): void {
    forkJoin({
      sourcesOfFunds: this.sourcesOfFunds$,
      sectors: this.sectors$,
      occupations: this.occupations$,
      communicationChannels: this.communicationChannels$,
      premiumFrequencies: this.premiumFrequencies$,
      employmentTypes: this.employmentTypes$,
      insurancePurposes: this.insurancePurposes$
    }).subscribe({
      next: data => {
        this.sourcesOfFunds = data.sourcesOfFunds;
        this.sectors = data.sectors;
        this.occupations = data.occupations;
        this.communicationChannels = data.communicationChannels;
        this.premiumFrequencies = data.premiumFrequencies;
        this.employmentTypes = data.employmentTypes;
        this.insurancePurposes = data.insurancePurposes;
        this.setSelectOptions();
      },
      error: error => {
        this.globalMessagingService.displayErrorMessage('error', 'Could not fetch select options' + error);
      },
    })
  }


  /*prepareTableDetails(): void {
    this.columns = [];
    this.totalRecords = this.wealthAmlDetails.length;
    const columns: string[] = Object.keys(this.wealthAmlDetails[0]);

    columns.forEach((column: string): void => {
      const tableColumn: TableFieldConfig = {
        field: column,
        header: this.wealthAmlDetailsLabel[column]?.label,
        label: undefined,
        visible: this.wealthAmlDetailsLabel[column]?.visible,
      }
      this.columns.push(tableColumn);
    });
  }*/

  createEditForm(fields: any[]): void {
    const group: { [key: string]: any } = {};
    fields.forEach(field => {
      group[field.fieldId] = [
        field.defaultValue,
        field.isMandatory ? Validators.required : []
      ];
    });
    this.editForm = this.fb.group(group);
  }

  openEditWealthAmlDialog(showEditForm?: boolean, wealthAmlRecord?): void {
    this.editButton.nativeElement.click();
    this.shouldShowEditForm = showEditForm;
    this.selectedWealthAmlRecord = wealthAmlRecord;
    setTimeout(() => {this.patchFormValues(wealthAmlRecord)}, 500)
  }

  setSelectOptions(): void {
    /*this.formFieldsConfig.fields.forEach(field => {
      switch (field.fieldId) {
        case 'fundsSource':
          field.options = this.sourcesOfFunds;
          break;
        case 'sector':
          field.options = this.sectors;
          break;
        case 'occupation':
          field.options = this.occupations;
          break;
        case 'distributeChannel':
          field.options = this.communicationChannels
          break;
        case 'employmentStatus':
          field.options = this.employmentTypes
          break;
        case 'insurancePurpose':
          field.options = this.insurancePurposes
          break;
        case 'premiumFrequency':
          field.options = this.premiumFrequencies
          break;
        default:
          // do nothing;
      }
    });*/
  }

  /*processSelectOption(event: any, fieldId: string): void {
    const selectedOption = event.target.value;
  }*/

  patchFormValues(wealthAmlRecord): void {
    const fundsIndex = this.sourcesOfFunds?.findIndex(
      item => item.name.toUpperCase() === wealthAmlRecord?.fundsSource.toUpperCase());

    const communicationIndex = this.communicationChannels.findIndex(
      item => item.name.toUpperCase() === wealthAmlRecord?.distributeChannel.toUpperCase());

    const premiumFreqIndex = this.premiumFrequencies.findIndex(
      item => item.name.toUpperCase() === wealthAmlRecord?.premiumFrequency.toUpperCase());

    const insurancePurposeIndex = this.insurancePurposes.findIndex(
      item => item.code == wealthAmlRecord?.insurancePurpose);

    if (this.shouldShowEditForm) {
      const patchData = {
        distributeChannel: this.communicationChannels[communicationIndex]?.value,
        employmentStatus: wealthAmlRecord?.employmentStatus,
        fundsSource: this.sourcesOfFunds[fundsIndex]?.code,
        insurancePurpose: this.insurancePurposes[insurancePurposeIndex]?.code,
        occupation: wealthAmlRecord?.occupationId,
        premiumFrequency: this.premiumFrequencies[premiumFreqIndex]?.value,
        sector: wealthAmlRecord?.sectorId,
      }
      this.editForm.patchValue(patchData);
    }
  }

  editWealthAmlDetails(): void {
    const formValues = this.editForm.getRawValue();

    if (this.selectedWealthAmlRecord !== null) {
      this.prepareUpdatePayload(formValues);
    } else {
      this.prepareAddPayload(formValues);
    }

    this.clientService.updateClientSection(this.accountCode, { wealthAmlDetails: this.wealthAmlDetails }).subscribe({
      next: res => {
        this.wealthAmlDetails = res.wealthAmlDetails;
        this.globalMessagingService.displaySuccessMessage('success', 'Wealth/AML details created/updated successfully!')
        // this.prepareTableDetails();
        this.closeButton.nativeElement.click();
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('error', 'Wealth/AML details failed to update! ' + err.error.message)
      }
    });
  }


  prepareUpdatePayload(formValues): void {
    const wealthAmlRecordIndex = this.wealthAmlDetails.findIndex(item => item.id === this.selectedWealthAmlRecord.id);
    const occupationIndex = this.occupations.findIndex(item => item.id === this.selectedWealthAmlRecord?.occupationId);
    const sectorIndex = this.sectors.findIndex(item => item.id === this.selectedWealthAmlRecord?.sectorId);

    this.wealthAmlDetails[wealthAmlRecordIndex] = {
      ...this.wealthAmlDetails[wealthAmlRecordIndex],
      sourceOfWealthId: formValues.fundsSource,
      isEmployed: formValues.employmentStatus,
      employmentStatus: formValues.employmentStatus,
      occupationId: formValues.occupation,
      occupation: this.occupations[occupationIndex]?.name,
      sectorId: formValues.sector,
      sector: this.sectors[sectorIndex]?.name,
      insurancePurpose: formValues.insurancePurpose,
      premiumFrequency: formValues.premiumFrequency,
      distributeChannel: formValues.distributeChannel,
    }
  }

  prepareAddPayload(formValues) {
    const wealthAmlToAdd = {
      sourceOfWealthId: formValues.fundsSource,
      isEmployed: formValues.employmentStatus,
      employmentStatus: formValues.employmentStatus,
      occupationId: formValues.occupation,
      // occupation: this.occupations[occupationIndex]?.name,
      sectorId: formValues.sector,
      // sector: this.sectors[sectorIndex]?.name,
      insurancePurpose: formValues.insurancePurpose,
      premiumFrequency: formValues.premiumFrequency,
      distributeChannel: formValues.distributeChannel,
    }
    this.wealthAmlDetails.push(wealthAmlToAdd);
  }

  selectItemToDelete(wealthAmlDetails): void {
    this.selectedWealthAmlRecord = wealthAmlDetails;
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

}
