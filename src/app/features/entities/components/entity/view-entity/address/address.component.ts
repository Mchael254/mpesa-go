import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {CountryDto, PostalCodesDTO, StateDto, TownDto} from "../../../../../../shared/data/common/countryDto";
import {CountryService} from "../../../../../../shared/services/setups/country/country.service";
import {ClientService} from "../../../../services/client/client.service";
import {Observable} from "rxjs";
import {
  ConfigFormFieldsDto,
  DynamicScreenSetupDto,
  FormGroupsDto, FormSubGroupsDto, PresentationType
} from "../../../../../../shared/data/common/dynamic-screens-dto";
import {AddressModel, Branch, ClientDTO} from "../../../../data/ClientDTO";

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
  @Input() addressDetailsConfig: any
  @Input() formFieldsConfig: any;
  @Input() formGroupsAndFieldConfig: DynamicScreenSetupDto;
  @Input() group: FormGroupsDto;
  addressDetails: AddressModel;
  branchDetails: Branch[];


  countries: CountryDto[];
  clientCountry: CountryDto;
  countries$: Observable<CountryDto[]>;

  states: StateDto[];
  clientState: StateDto;
  states$: Observable<StateDto[]>;

  towns: TownDto[] = [];
  clientTown: TownDto;
  towns$: Observable<TownDto[]>;

  postalCodes: PostalCodesDTO[] = [];
  clientPostalCode: PostalCodesDTO
  postalCodes$: Observable<PostalCodesDTO[]>

  language: string = 'en';
  editForm: FormGroup;

  fields: ConfigFormFieldsDto[];
  tableHeaders: ConfigFormFieldsDto[];
  table: { cols: any[], data: any[] } = { cols: [], data: [] };

  PRESENTATION_TYPE = PresentationType;


  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private countryService: CountryService,
    private globalMessagingService: GlobalMessagingService,
    private clientService: ClientService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => this.language = lang);
  }

  ngOnInit(): void {
    // this.countries$ = this.countryService.getCountries();
    // this.fetchCountries();
    // this.createEditForm(this.fields);

    setTimeout(() => {
      this.addressDetails = this.clientDetails.address;

      const displayAddressDetails  = {
        overview_branch_Id: null,
        overview_head_office_address: null,
        overview_branch_details_name: null,
        overview_head_office_country: this.addressDetails.countryName,
        overview_head_office_county: null,
        overview_country: this.addressDetails.countryName,
        overview_head_office_city: null,
        overview_county: this.addressDetails.stateName,
        overview_head_office_physical_address: this.addressDetails.physicalAddress,
        overview_city: this.addressDetails.townName,
        overview_head_office_postal_address: null,
        overview_physical_address: this.addressDetails.physicalAddress,
        overview_head_office_postal_code: null,
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

    if (fields.length > 0) this.createEditForm(fields);

    for (const field of fields) {
       field.dataValue = displayFields[field.fieldId] ?? null;
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
        overview_city: br.stateName,
        overview_physical_address: br.physicalAddress,
        overview_postal_address: br.postalAddress,
        overview_postal_code: br.code,
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

  fetchCountries(): void {
    this.countries$.subscribe({
      next: (countries: CountryDto[]) => {
        this.countries = countries;
        this.clientCountry = countries.find(country => country.id === this.addressDetails.countryId);
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
        this.states = states;
        this.clientState = states.find(state => state.id === this.addressDetails?.stateId);
        this.fetchTowns(this.addressDetails?.stateId);
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
        this.towns = towns;
        this.clientTown = towns.find(town => town.id === this.addressDetails?.townId);
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
      },
      error: (err) => {
        this.postalCodes = [];
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      },
    });
  }

  openEditAddressDialog(): void {
    this.editButton.nativeElement.click();
    this.setSelectOptions();
    setTimeout(() => {this.patchFormValues()}, 500)
  }

  patchFormValues(): void {
    const patchData = {
      address: '',
      country: this.clientCountry?.id,
      county: this.clientState?.id,
      city: this.clientTown?.id,
      physicalAddress: this.addressDetails?.physicalAddress,
      postalAddress: this.addressDetails?.residentialAddress,
      postalCode: this.addressDetails?.postalCode,
      town: this.clientTown?.id,
      road: this.addressDetails?.road,
      houseNumber: this.addressDetails?.houseNumber,
    }
    this.editForm.patchValue(patchData);
  }

  editAddressDetails(): void {
    const formValues = this.editForm.getRawValue();
    const addressDetails = {
      ...this.addressDetails,
      countryId: formValues.country,
      stateId: formValues.county,
      townId: formValues.city,
      physicalAddress: formValues.physicalAddress,
      residentialAddress: formValues.postalAddress,
      // postalAddress: formValues.residentialAddress || formValues.postalAddress,
      postalCode: formValues.postalCode,
      // townId: formValues.town,
      road: formValues.road,
      houseNumber: formValues.houseNumber,
    }

    this.clientService.updateClientSection(this.clientDetails.clientCode, {address: addressDetails}).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client details update successfully');
        this.addressDetails = data.address;
        this.fetchCountries();
      },
      error: err => {
        const errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
    this.closeButton.nativeElement.click();
  }

  setSelectOptions(): void {
  // &&
  //   this.states?.length > 0 &&
  //   this.towns?.length > 0
    if (this.countries?.length > 0) {
      this.formFieldsConfig.fields.forEach(field => {
        switch (field.fieldId) {
          case 'country':
            field.options = this.countries;
            break;
          case 'county':
            field.options = this.states;
            break;
          case 'city':
          case 'town':
            field.options = this.towns;
            break;
          case 'postalCode':
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
    log.info(`processSelectOption >>> `, fieldId, selectedOption);

    switch (fieldId) {
      case 'country':
        this.countryService.getMainCityStatesByCountry(selectedOption).subscribe({
          next: states => {
            this.formFieldsConfig.fields.forEach(field => {
              if (field.fieldId === 'county') field.options = states;
            });
          },
          error: err => {},
        })
        break;

      case 'county': // update list of towns/cities by selected state/county
        this.countryService.getTownsByMainCityState(selectedOption).subscribe({
          next: towns => {
            this.formFieldsConfig.fields.forEach(field => {
              if (field.fieldId === 'city' || field.fieldId === 'town') field.options = towns;
            })
          }
        })
        break;

      case 'city':
        this.countryService.getPostalCodes(selectedOption).subscribe({
          next: postalCodes => {
            this.formFieldsConfig.fields.forEach(field => {
              if (field.fieldId === 'postalCode') field.options = postalCodes;
              log.info(`postalCode >>> `, field);
            })
          },
          error: err => {},
        })
        break;
    }
  }

}
