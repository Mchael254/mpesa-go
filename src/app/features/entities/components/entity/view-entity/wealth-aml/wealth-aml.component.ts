import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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

  @Input() wealthAmlDetailsConfig: any
  @Input() formFieldsConfig: any;
  @Input() wealthAmlDetails: any;
  @Input() accountCode: number;

  language: string = 'en';
  editForm: FormGroup;

  columnLabel: {};
  columnDialogVisible: boolean = false;
  columns: TableFieldConfig[] = [];
  tableDetails: TableDetail;
  pageSize: number = 5;
  totalRecords: number;

  globalFilterFields: string[] = [
    'name', 'modeOfIdentity.name', 'identityNumber', 'pinNumber', 'categoryName'
  ];


  wealthAmlDetailsLabel  = {
    id: { label: "id", visible: false },
    nationalityCountryId: { label: "nationality country id", visible: false },
    citizenshipCountryId: { label: "citizenship country id", visible: false },
    fundsSource: { label: "source of funds", visible: true },
    employmentStatus: { label: "type of employment", visible: true },
    maritalStatus: { label: "marital status", visible: false },
    occupationId: { label: "occupation id", visible: false },
    occupation: { label: "occupation", visible: true },
    sectorId: { label: "employment sector", visible: false },
    sector: { label: "sector", visible: true },
    tradingName: { label: "trading name", visible: false },
    registeredName: { label: "registered name", visible: false },
    certificateRegistrationNumber: { label: "certificate registration number", visible: false },
    certificateYearOfRegistration: { label: "certificate year of registration", visible: false },
    sourceOfWealthId: { label: "source of wealth id", visible: false },
    parentCountryId: { label: "parent country id", visible: false },
    operatingCountryId: { label: "operating country id", visible: false },
    crFormRequired: { label: "cr form required", visible: false },
    crFormYear: { label: "cr form year", visible: false },
    partyAccountId: { label: "party account id", visible: false },
    insurancePurpose: { label: "purpose of insurance", visible: true },
    premiumFrequency: { label: "premium frequency", visible: true },
    distributeChannel: { label: "distribution channel", visible: true },
    parentCompany: { label: "parent company", visible: false },
    category: { label: "category", visible: false },
    modeOfIdentity: { label: "mode of identity", visible: false },
    idNumber: { label: "id number", visible: false },
    cr12Details: { label: "cr 12 details", visible: false },
    createdBy: { label: "created by", visible: false },
    createdDate: { label: "created date", visible: false },
    modifiedBy: { label: "modified by", visible: false },
    modifiedDate: { label: "modified date", visible: false }
  };

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
  ) {

  }


  ngOnInit(): void {
    this.utilService.currentLanguage.subscribe(lang => this.language = lang);
    this.sourcesOfFunds$ = this.bankService.getFundSource();
    this.sectors$ = this.sectorService.getSectors();
    this.occupations$ = this.occupationService.getOccupations();
    this.communicationChannels$ = this.accountService.getCommunicationChannels();
    this.premiumFrequencies$ = this.accountService.getPremiumFrequencies();
    this.employmentTypes$ = this.accountService.getEmploymentTypes();
    this.insurancePurposes$ = this.accountService.getInsurancePurpose();
    this.initData();

    this.createEditForm(this.formFieldsConfig.fields);
    this.prepareTableDetails();
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


  prepareTableDetails(): void {
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
  }

  openEditWealthAmlDialog(showEditForm?: boolean, wealthAmlRecord?): void {
    this.editButton.nativeElement.click();
    this.shouldShowEditForm = showEditForm;
    this.selectedWealthAmlRecord = wealthAmlRecord;
    setTimeout(() => {this.patchFormValues(wealthAmlRecord)}, 500)
  }

  setSelectOptions(): void {
    this.formFieldsConfig.fields.forEach(field => {
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
    });
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
        this.prepareTableDetails();
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
        this.prepareTableDetails();
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('error', 'Wealth/AML details failed to delete! ' + err.error.message)
      }
    });
  }


}
