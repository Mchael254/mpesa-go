import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Logger, UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {CountryDto, PostalCodesDTO, StateDto, TownDto} from "../../../../../../shared/data/common/countryDto";
import {CountryService} from "../../../../../../shared/services/setups/country/country.service";
import {ClientService} from "../../../../services/client/client.service";
import {Observable} from "rxjs";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto,
  FormSubGroupsDto,
  PresentationType,
  SaveAction
} from "../../../../../../shared/data/common/dynamic-screens-dto";
import {AddressModel, Branch, ClientDTO} from "../../../../data/ClientDTO";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {EntityUtilService} from "../../../../services/entity-util.service";

const log = new Logger('AddressComponent');

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  @Input() clientDetails: ClientDTO;
  @Input() formGroupsAndFieldConfig: DynamicScreenSetupDto;
  @Input() group: FormGroupsDto;
  addressDetails: AddressModel;
  branchDetails: Branch[];
  selectedBranch: Branch;


  countries: CountryDto[] = [];
  clientCountry: CountryDto;
  countries$: Observable<CountryDto[]>;

  states: StateDto[];
  clientState: StateDto;
  // states$: Observable<StateDto[]>;

  towns: TownDto[] = [];
  clientTown: TownDto;
  // towns$: Observable<TownDto[]>;

  postalCodes: PostalCodesDTO[] = [];
  // clientPostalCode: PostalCodesDTO
  // postalCodes$: Observable<PostalCodesDTO[]>

  language: string = 'en';
  editForm: FormGroup;

  fields: ConfigFormFieldsDto[];
  tableHeaders: ConfigFormFieldsDto[];
  table: { cols: any[], data: any[] } = { cols: [], data: [] };

  PRESENTATION_TYPE = PresentationType;
  selectedSubgroup: FormSubGroupsDto = null;
  formHeadingLabel: FormSubGroupsDto | FormGroupsDto;
  formFields: ConfigFormFieldsDto[] = [];
  saveAction: SaveAction;
  protected readonly Save_Action = SaveAction;
  protected readonly SearchCountryField = SearchCountryField;
  // protected readonly CountryISO = CountryISO;
  countryISO: CountryISO;
  protected readonly PhoneNumberFormat = PhoneNumberFormat;


  constructor(
    // private fb: FormBuilder,
    private utilService: UtilService,
    private countryService: CountryService,
    private globalMessagingService: GlobalMessagingService,
    private clientService: ClientService,
    private entityUtilService: EntityUtilService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => this.language = lang);
  }

  ngOnInit(): void {
    this.countries$ = this.countryService.getCountries();
    this.prepareDataDisplay();
  }

  prepareDataDisplay(): void {
    setTimeout(() => {
      this.addressDetails = this.clientDetails.address;

      const displayAddressDetails  = {
        overview_branch_Id: null,
        overview_head_office_address: this.addressDetails.residentialAddress,
        // overview_branch_details_name: null,
        overview_head_office_country: this.addressDetails.countryName,
        overview_head_office_county: this.addressDetails.stateName,
        overview_country: this.addressDetails.countryName,
        overview_head_office_city: this.addressDetails.townName,
        overview_county: this.addressDetails.stateName,
        overview_head_office_physical_address: this.addressDetails.physicalAddress,
        overview_city: this.addressDetails.townName,
        overview_head_office_postal_address: this.addressDetails.residentialAddress,
        overview_physical_address: this.addressDetails.physicalAddress,
        overview_head_office_postal_code: this.addressDetails.postalCode,
        overview_postal_address: this.addressDetails.residentialAddress,
        overview_postal_code: this.addressDetails.postalCode,
        overview_branch_email: null,
        overview_landline_number: this.addressDetails.phoneNumber,
        overview_branch_mobile_no: this.addressDetails.phoneNumber,
        overview_address: null,
        overview_road: this.addressDetails.road,
        overview_house_name_no: this.addressDetails.houseNumber,
      }

      if (this.group.subGroup.length === 0) {
        this.prepareGroupDetails(displayAddressDetails);
      } else {
        this.prepareSubGroupDetails(displayAddressDetails);
      }

      this.fields = this.formGroupsAndFieldConfig?.fields.filter((field: ConfigFormFieldsDto) => field.formGroupingId === this.group.groupId);

      for (const field of this.fields) {
        field.dataValue = displayAddressDetails[field.fieldId] ?? null;
      }

      // sort fields in ascending order
      this.fields.sort((a, b) => a.order - b.order)

    }, 1000);
  }

  /**
   * prepares fields and table details for display when address details has no subgroup
   * @param displayContactDetails
   */
  prepareGroupDetails(displayContactDetails): void {
    if (this.group.presentationType === 'fields') {
      this.fields = this.createFieldDisplay(displayContactDetails);
    } else {
      this.createTableDisplay();
    }
  }


  /**
   * create field display using the labelled fields
   * @param displayFields
   */
  createFieldDisplay(displayFields): ConfigFormFieldsDto[] {
    const fields = this.formGroupsAndFieldConfig.fields.filter((field: ConfigFormFieldsDto) => field.formGroupingId === this.group.groupId);

    for (const field of fields) {
      const value = displayFields[field.fieldId];
      field.dataValue = value ?? null;
    }

    fields.sort((a, b) => a.order - b.order);

    return fields;
  }


  /**
   * create the structured info (column headings and row data) for displaying table
   * @param subGroup
   */
  createTableDisplay(subGroup?: FormSubGroupsDto) {
    const headerFields = this.formGroupsAndFieldConfig.fields.filter((field: ConfigFormFieldsDto) => field.formSubGroupingId === subGroup.subGroupId);
    headerFields.sort((a, b) => a.order - b.order);
    this.tableHeaders = headerFields;

    this.branchDetails = this.clientDetails.branches;

    const tableData = [];
    this.branchDetails.forEach((br: Branch) => {
      const branch = {
        branchAddressId: br.code,
        overview_branch_Id: br.code,
        overview_branch_details_name: br.branchName,
        overview_country: br.countryName,
        overview_county: br.stateName,
        overview_city: br.townName,
        overview_physical_address: br.physicalAddress,
        overview_postal_address: br.postalAddress,
        overview_postal_code: br.postalCode,
        overview_branch_email: br.email,
        overview_landline_number: br.landlineNumber,
        overview_branch_mobile_no: br.mobileNumber
      };
      tableData.push(branch);
    });

    this.table = {
      cols: this.tableHeaders,
      data: tableData
    };
  }

  /**
   * Where exists, prepare the details of the subgroup
   * Call method to create either field display or table display
   * @param displayContactDetails
   */
  prepareSubGroupDetails(displayContactDetails): void {
    this.group?.subGroup?.forEach((subGroup) => {
      if (subGroup.presentationType === 'fields') {
        subGroup.fields = this.createFieldDisplay(displayContactDetails);
      } else {
        this.createTableDisplay(subGroup);
      }
    });
  }

  /**
   * Delete branch and refresh data for display
   * @param row
   */
  handleBranchDelete(row: any): void {
    log.info('handleBranchDelete ... ', row);
    this.clientService.deleteClientBranch(row.branchAddressId).subscribe({
      next: () => {
        this.table.data = this.table.data.filter(person => person.branchAddressId != row.branchAddressId);
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted contact person');
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', err?.error?.message);
      }
    });
  }

  openEditAddressDialog(subgroup?: FormSubGroupsDto, saveAction?: SaveAction): void {
    this.saveAction = saveAction;
    let fields: ConfigFormFieldsDto[];

    if (subgroup?.fields) {
      this.selectedSubgroup = subgroup;
      this.formHeadingLabel = subgroup;
      fields = subgroup.fields;
    } else {
      fields = this.fields;
      this.formHeadingLabel = this.group;
    }

    this.prepareDataDisplay();

    this.formFields = fields;
    this.createEditForm(fields, saveAction);
    this.editButton.nativeElement.click();
  }


  createEditForm(fields: ConfigFormFieldsDto[], saveAction?: SaveAction): void {

    if (this.countries.length === 0) {
      this.fetchCountries();
    } else {
      let stateId: number;

      if (this.saveAction === SaveAction.SAVE_BRANCH || SaveAction.EDIT_BRANCH) {
        stateId = this.selectedBranch.stateId;
      } else if (this.saveAction === SaveAction.EDIT_ADDRESS_DETAILS) {
        stateId = this.clientDetails.address.stateId;
      }
      log.info('stateId ', stateId);
      this.fetchTowns(stateId);
    }

    this.editForm = this.entityUtilService.createEditForm(fields);

    if (
      saveAction === SaveAction.EDIT_ADDRESS_DETAILS ||
      saveAction === SaveAction.EDIT_BRANCH
    ) this.patchFormValues(fields);
  }

  fetchCountries(): void {
    this.countries$.subscribe({
      next: (countries: CountryDto[]) => {
        this.countries = countries;
        this.clientCountry = countries.find(country => country.id === this.addressDetails.countryId);
        this.countryISO = this.clientCountry?.short_description as CountryISO;
        this.fetchStates(this.clientCountry?.id);
      },
      error: (err) => {
        this.countries = [];
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      }
    })
  }

  fetchStates(countryId: number): void {
    this.countryService.getMainCityStatesByCountry(countryId).subscribe({
      next:(states) => {
        let stateId: number;
        if (this.saveAction === SaveAction.EDIT_BRANCH || this.saveAction === SaveAction.SAVE_BRANCH) {
          stateId = this.selectedBranch?.stateId;
        } else {
          stateId = this.addressDetails?.stateId;
        }
        this.states = states;
        this.clientState = states.find(state => state.id === stateId);
        this.fetchTowns(stateId);
      },
      error: (err) => {
        this.states = [];
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      },
    })
  }

  fetchTowns(stateId: number): void {
    this.countryService.getTownsByMainCityState(stateId).subscribe({
      next:(towns) => {
        let townId: number;
        if (this.saveAction === SaveAction.EDIT_BRANCH || this.saveAction === SaveAction.SAVE_BRANCH) {
          townId = this.selectedBranch?.townId
        } else {
          townId = this.addressDetails?.townId;
        }
        this.towns = towns;
        this.clientTown = towns.find(town => town.id === townId);
        this.fetchPostalCodes(this.clientTown?.id);
      },
      error: (err) => {
        this.towns = [];
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      },
    })
  }

  fetchPostalCodes(townId: number): void {
    this.countryService.getPostalCodes(townId).subscribe({
      next: (postalCodes: PostalCodesDTO[]) => {
        this.postalCodes = postalCodes;
        this.setSelectOptions();
        this.patchFormValues(this.formFields);
      },
      error: (err) => {
        this.postalCodes = [];
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      },
    });
  }


  patchFormValues(fields): void {

    let patchData = {};

    if (this.group.subGroup.length > 0) {
      this.formFields.forEach(field => { // corporate
        patchData[field.fieldId] = field.dataValue;
      });
    } else if (this.group.subGroup.length === 0) { // individual
      fields.forEach(field => {
        patchData[field.fieldId] = field.dataValue;
      });
    }

    let patchDropdowns = {};
    if (this.saveAction === SaveAction.EDIT_ADDRESS_DETAILS) {
      const address: AddressModel = this.clientDetails.address;
      log.info('address details >>> ', address)
      patchDropdowns = {
        overview_country: this.clientDetails.address.countryId,
        overview_head_office_country: address.countryId,
        overview_head_office_county: address.stateId,
        overview_county: this.clientDetails.address.stateId,
        overview_city: this.clientDetails.address.townId,
        overview_head_office_city: address.townId,
        overview_postal_code: this.clientDetails.address.postalCode,
        overview_head_office_postal_code: address.postalCode,
      };
    } else if (this.saveAction === SaveAction.EDIT_BRANCH) {
      patchDropdowns = {
        overview_country: this.selectedBranch?.countryId,
        overview_county: this.selectedBranch?.stateId,
        overview_city: this.selectedBranch?.townId,
        overview_postal_code: this.selectedBranch?.postalCode,
      };
    } else if (this.saveAction === SaveAction.SAVE_BRANCH) {
      patchDropdowns = {};
    }

    patchData = { // patch dropdown values
      ...patchData,
      ...patchDropdowns,
    }

    this.editForm?.patchValue(patchData);
  }

  saveDetails() {
    switch (this.saveAction) {
      case SaveAction.EDIT_ADDRESS_DETAILS:
        this.editAddressDetails();
        break;
      case SaveAction.EDIT_BRANCH:
        this.addEditBranch();
        break;
      case SaveAction.SAVE_BRANCH:
        this.editForm.reset();
        this.addEditBranch();
        break;
      default:
      // do something
    }
  }

  editAddressDetails(): void {
    const formValues = this.editForm.getRawValue();

    const address = {
      ...this.addressDetails,
      countryId: /*formValues.overview_country || */formValues.overview_head_office_country,
      stateId: /*formValues.overview_county*/ formValues.overview_head_office_county,
      townId: formValues.overview_head_office_city,
      physicalAddress: formValues.overview_head_office_physical_address,
      residentialAddress: formValues.overview_postal_address,
      // postalAddress: formValues.residentialAddress || formValues.postalAddress,
      postalCode: formValues.overview_head_office_postal_code,
      // townId: formValues.town,
      road: formValues.road,
      houseNumber: formValues.houseNumber,
    }

    const client = {
      clientCode: this.clientDetails.clientCode,
      partyAccountCode: this.clientDetails.partyAccountCode,
      partyId: this.clientDetails.partyId,
      address
    };

    this.updateClientSection(this.clientDetails.clientCode, client);

    this.closeButton.nativeElement.click();
  }

  updateClientSection(clientCode, client): void {
    this.clientService.updateClientSection(clientCode, client).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
        this.clientDetails = data;
        this.branchDetails = data.branches;
        this.prepareDataDisplay();
        this.closeButton.nativeElement.click();
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.closeButton.nativeElement.click();
      }
    });
  }

  prepareEditBranchForm(data: any) {
    this.saveAction = Object.keys(data.row).length > 0 ? SaveAction.EDIT_BRANCH : SaveAction.SAVE_BRANCH;
    const fields =  this.tableHeaders.map(field => ({...field})) ;
    const row = data.row;
    this.selectedBranch = this.branchDetails.find(branch => branch.code === row.branchAddressId);
    this.selectedSubgroup = data.subGroup;
    log.info('selectedBranch', this.selectedBranch, row.branchAddressId);

    this.formFields = this.entityUtilService.addDataToFormFields(fields, row);

    this.createEditForm(this.formFields, this.saveAction);
    this.editButton.nativeElement.click();
  }

  addEditBranch(): void {
    const formValues = this.editForm.getRawValue();

    const branch = {
      ...this.selectedBranch,
      countryId: formValues.overview_country,
      stateId: formValues.overview_county,
      townId: formValues.overview_city,
      physicalAddress: formValues.overview_physical_address,
      postalAddress: formValues.overview_postal_address,
      postalCode: formValues.overview_postal_code,
      email: formValues.overview_branch_email,
      landlineNumber: (formValues?.overview_landline_number?.internationalNumber)?.replace(/\s+/g, ''),
      mobileNumber: (formValues?.overview_branch_mobile_no?.internationalNumber)?.replace(/\s+/g, ''),
      branchName: formValues.overview_branch_details_name,
    };

    const client = {
      clientCode: this.clientDetails.clientCode,
      partyAccountCode: this.clientDetails.partyAccountCode,
      partyId: this.clientDetails.partyId,
      branches: [branch]
    }

    this.updateClientSection(this.clientDetails.clientCode, client);
  }

  setSelectOptions(): void {
    if (this.countries?.length > 0) {
      this.formFields.forEach(field => {
        switch (field.fieldId) {
          case 'overview_country':
          case 'overview_head_office_country':
            field.options = this.countries;
            break;
          case 'overview_head_office_county':
          case 'overview_county':
            field.options = this.states;
            break;
          case 'overview_city':
          case 'overview_head_office_city':
          // case 'town':
            field.options = this.towns;
            break;
          case 'overview_postal_code':
          case 'overview_head_office_postal_code':
            field.options = this.postalCodes;
            break;
          default:
            //do nothing
        }
        // this.cdr.detectChanges();
      });
    }
  }

  processSelectOption(event: any, fieldId: string): void {
    const selectedOption = event.target.value;

    switch (fieldId) {
      case 'overview_country':
      case 'overview_head_office_country':
        this.countryService.getMainCityStatesByCountry(selectedOption).subscribe({
          next: states => {
            this.formFields.forEach(field => {
              if (field.fieldId === 'overview_head_office_county' || field.fieldId === 'overview_county') field.options = states;
            });
          },
          error: err => {},
        })
        break;

      case 'overview_county': // update list of towns/cities by selected state/county
      case 'overview_head_office_county':
        this.countryService.getTownsByMainCityState(selectedOption).subscribe({
          next: towns => {
            this.formFields.forEach(field => {
              if (field.fieldId === 'overview_city' || field.fieldId === 'overview_head_office_city') field.options = towns;
            })
          }
        })
        break;

      case 'overview_city':
      case 'overview_head_office_city':
        this.countryService.getPostalCodes(selectedOption).subscribe({
          next: postalCodes => {
            this.formFields.forEach(field => {
              if (field.fieldId === 'overview_postal_code' || field.fieldId === 'overview_head_office_postal_code') field.options = postalCodes;
            })
          },
          error: err => {},
        })
        break;
    }
  }

  checkTelNumber(mainStr: string): boolean {
    return this.entityUtilService.checkTelNumber(mainStr);
  }

}
