import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Logger, UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {TableDetail, TableFieldConfig} from "../../../../../../shared/data/table-detail";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";

const log = new Logger('WealthAmlComponent');

@Component({
  selector: 'app-wealth-aml',
  templateUrl: './wealth-aml.component.html',
  styleUrls: ['./wealth-aml.component.css']
})
export class WealthAmlComponent implements OnInit {

  @ViewChild('editButton') editButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

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
    sectorId: { label: "employment sector", visible: true },
    sector: { label: "sector", visible: false },
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
    distributeChannel: { label: "distribute channel", visible: false },
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


  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private globalMessagingService: GlobalMessagingService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => this.language = lang);
  }

  ngOnInit(): void {
    this.createEditForm(this.formFieldsConfig.fields);
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

  openEditWealthAmlDialog(): void {
    this.editButton.nativeElement.click();
    this.setSelectOptions();
    setTimeout(() => {this.patchFormValues()}, 500)
  }

  editFinancialDetails(): void {
    const formValues = this.editForm.getRawValue();
    log.info(formValues);
  }

  setSelectOptions(): void {
    this.formFieldsConfig.fields.forEach(field => {
      switch (field.fieldId) {
      }
    });
  }

  processSelectOption(event: any, fieldId: string): void {
    const selectedOption = event.target.value;

    // switch (fieldId) {
    //   case 'bankName':
    //     this.bankService.getBankBranchesByBankId(selectedOption).subscribe({
    //       next: res => {
    //         this.formFieldsConfig.fields.forEach(field => {
    //           if (field.fieldId === 'branchName') field.options = res;
    //         });
    //       },
    //       error: err => {}
    //     })
    // }
  }

  patchFormValues(): void {

  }


  lazyLoadEntity(event: LazyLoadEvent | TableLazyLoadEvent): void {
    this.wealthAmlDetails = [this.wealthAmlDetails] //todo: backend should return array of objects
    this.totalRecords = this.wealthAmlDetails.length;
    const columns: string[] = Object.keys(this.wealthAmlDetails[0]);

    columns.forEach((column: string): void => {
      const tableColumn: TableFieldConfig = {
        field: column,
        header: this.wealthAmlDetailsLabel[column].label,
        label: undefined,
        visible: this.wealthAmlDetailsLabel[column].visible,
      }
      this.columns.push(tableColumn);
    });
  }

}
