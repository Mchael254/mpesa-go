import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Router } from '@angular/router';
import { Logger } from '../../../../../../shared/services';
import * as XLSX from 'xlsx';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";
import { PolicyElectronicDataDTO } from 'src/app/features/gis/data/quotations-dto';
import { firstValueFrom, forkJoin, switchMap, tap } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { NgxCurrencyConfig } from 'ngx-currency';
import { ProductsService } from '../../../setups/services/products/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { quotationRisk } from '../../data/quotationsDTO';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassCoverTypes, territories, vehicleMake, vehicleModel } from '../../../setups/data/gisDTO';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { TerritoriesService } from '../../../setups/services/perils-territories/territories/territories.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { PolicyService } from '../../../policy/services/policy.service';
import { RiskCentreComponent } from '../risk-centre/risk-centre.component';

const log = new Logger('ImportRiskComponent');
interface ColumnMapping {
  [systemField: string]: string;
}

interface SystemField {
  key: string;
  label: string;
  required: boolean;
}
@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {
  @Input() selectedProduct!: any;
  @ViewChild('addRiskModal') addRiskModalRef!: ElementRef;
  @Output() onSaveCompleted = new EventEmitter<void>();



  steps = quoteStepsData;
  subclassList: any;
  quotationNum: any;
  quotationDetails: any;
  columns: any;
  data: any = [];
  selectedRisks: any[] = [];
  importForm: FormGroup;
  quoteAction: string = "A";
  quotationCode: number;
  quotationRiskData: any;
  riskCode: number;
  quoteProductCode: number;
  selectedClientCode: number;
  selectedCoverFromDate: any;
  selectedCoverToDate: any;
  allMatchingSubclasses = [];
  selectedProductCode: number;
  selectedSubclassCode: number;
  dynamicRegexPattern: any;
  regexPattern: any;


  // New properties for mapping functionality
  showMappingModal: boolean = false;
  userFileHeaders: string[] = []; // This should be string[], not {}
  userFileData: any[] = [];
  mapping: ColumnMapping = {};
  mappedData: any[] = [];
  // Define your system's expected fields
  systemFields = [
    { key: 'BinderCode', label: 'Binder Code', required: false },
    { key: 'PremiumBind', label: 'Premium Bind', required: false },
    { key: 'CoverTypeCode', label: 'Cover Type Code', required: false },
    { key: 'CoverTypeShortDesc', label: 'Cover Type Description', required: false },
    { key: 'WEF', label: 'WEF', required: false },
    { key: 'WET', label: 'WET', required: false },
    { key: 'ClientCode', label: 'Client Code', required: true },
    { key: 'ClientName', label: 'Client Name', required: false },
    { key: 'IsNCDapplicable', label: 'NCD Applicable', required: false },
    { key: 'ItemDesc', label: 'Item Description', required: false },
    { key: 'Location', label: 'Location', required: false },
    { key: 'NCDlevel', label: 'NCD Level', required: false },
    { key: 'ProductCode', label: 'Product Code', required: false },
    { key: 'PropertyId', label: 'Property ID', required: false },
    { key: 'RiskPremAmount', label: 'Risk Premium Amount', required: false },
    { key: 'SubclassCode', label: 'Subclass Code', required: true },
    { key: 'Town', label: 'Town', required: false }
  ];

  dragging = false;
  dragOffset = { x: 0, y: 0 };
  selectedFile: File | null = null;
  isDragging = false;
  uploading = false;
  errorMessage = '';
  successMessage = '';
  subclassSelected: boolean = false;
  policyData: any;

  allRisks: any[] = [];
  validRisks: any[] = [];
  needsReviewRisks: any[] = [];

  selectedAll: any[] = [];
  selectedValid: any[] = [];
  selectedReview: any[] = [];
  activeTab: 'ALL' | 'VALID' | 'REVIEW' = 'ALL';
  showImportedRiskTable: boolean = false
  riskDetailsForm: FormGroup;
  dynamicSubclassFormFields: {
    type: string;
    name: string;
    max: number
    min: number
    isMandatory: string;
    disabled: boolean;
    readonly: boolean;
    regexPattern: string;
    placeholder: string;
    label: string;
    scheduleLevel: number
    selectOptions?: { label: string; value: any }[]
    applicableLevel: string
  }[];
  subclassFormContent: any
  subclassFormData: {
    options: any[];
    type: string;
    name: string;
    max: number
    min: number
    isMandatory: string;
    disabled: boolean;
    readonly: boolean;
    regexPattern: string;
    placeholder: string;
    label: string;
    scheduleLevel: number
    selectOptions?: { label: string; value: any }[];
    applicableLevel: string
  }[];
  allSubclassFormData: {
    options: any[];
    type: string;
    name: string;
    max: number
    min: number
    isMandatory: string;
    disabled: boolean;
    readonly: boolean;
    regexPattern: string;
    placeholder: string;
    label: string;
    scheduleLevel: number
    selectOptions?: { label: string; value: any }[];
    applicableLevel: string
  }[];
  selectedRisk: any;
  isDeleting: boolean;
  isBulkDeleting = false;
  isSingleDeleting = false;

  isEditMode: boolean = false;
  modalInstance: any;

  formContent: any;
  formData: {
    type: string;
    name: string;
    max: number
    min: number
    isMandatory: string;
    disabled: boolean;
    readonly: boolean;
    regexPattern: string;
    placeholder: string;
    label: string;
    selectOptions?: { label: string; value: any }[];
  }[];
  public currencyObj: NgxCurrencyConfig;
  dateFormat: string;
  midnightexpiry: any;
  coverToDate: string;
  clientsData: ClientDTO[] = [];
  insuredCode: any;
  storedRiskFormDetails: any = null
  subclassCoverType: SubclassCoverTypes[] = [];
  passedCoverTypeCode: number;
  binderList: any;
  binderListDetails: any;
  defaultBinder: any;
  defaultBinderName: any;
  selectedBinderList: any;
  selectedBinderCode: any;
  territories: territories[] = [];
  motorClassAllowed: string;
  vehicleMakeList: vehicleMake[];
  vehicleModelList: any;
  vehicleModelDetails: vehicleModel[];
  filteredVehicleModel: any;
  selectedVehicleMakeCode: any;
  vehiclemakeModel: any = '';
  selectedVehicleMakeName: any;
  selectedVehicleModelName: any;

  bodytypesList: any;
  motorColorsList: any;
  securityDevicesList: any;
  motorAccessoriesList: any;
  modelYear: any;
  yearList: any;
  periodRates = [
    { label: 'Prorata', value: 'P' },
    { label: 'Short period rates', value: 'S' },
    { label: 'Full', value: 'F' },
  ]
  conveyannceTypes = [
    { label: 'By sea', value: 'SEA' },
    { label: 'By air', value: 'AIR' },
    { label: 'By sea-rail-road', value: 'SEA-RAIL-ROAD' },
    { label: 'By sea-road', value: 'SEA-ROAD' },
    { label: 'By air-road', value: 'AIR-ROAD' },

  ]
  ncdLevels = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ]
  ncdStatusSelected: boolean;
  passedRiskId: any;
  isRiskValidated: boolean = false;
  loggedInUser: string;
  primeNgDateFormat: string;
  insuredName: any;

  constructor(
    public subclassService: SubclassesService,
    public router: Router,
    private fb: FormBuilder,
    public quotationService: QuotationsService,
    private globalMessagingService: GlobalMessagingService,
    public producSetupService: ProductsService,
    public clientService: ClientService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public cdr: ChangeDetectorRef,
    public binderService: BinderService,
    public territoryService: TerritoriesService,
    public productService: ProductsService,
    public vehicleMakeService: VehicleMakeService,
    public vehicleModelService: VehicleModelService,
    private policyService: PolicyService,

  ) {
    this.importForm = this.fb.group({
      subclass: [''],
      uploadFile: ['']
    });
    this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    log.debug("Logged in user", this.loggedInUser)
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProduct'] && this.selectedProduct) {
      console.log("Selected Product-risk details:", this.selectedProduct);
      const selectedProductCode = this.selectedProduct?.productCode
      this.selectedProductCode = selectedProductCode
      this.getProductSubclass(this.selectedProductCode);
      this.quotationCode = this.selectedProduct?.quotationCode
      this.quoteProductCode = this.selectedProduct?.code
      this.loadSelectedProductRiskFields(selectedProductCode)
      this.checkMotorClass(selectedProductCode)
      this.selectedProductCode = selectedProductCode




    }
  }

  ngOnInit(): void {
    // this.getSubclass();

    this.quotationNum = sessionStorage.getItem('quotationNum');
    this.quotationCode = JSON.parse(sessionStorage.getItem("quotationCode"));
    this.quotationDetails = JSON.parse(sessionStorage.getItem('quotationFormDetails') || '{}');
    log.debug("Product code:", this.quotationDetails?.productCode);

    this.selectedClientCode = JSON.parse(sessionStorage.getItem("clientCode"));
    log.debug("selected clientcode", this.selectedClientCode);
    this.selectedCoverFromDate = sessionStorage.getItem("selectedCoverFromDate");
    this.selectedCoverToDate = sessionStorage.getItem("selectedCoverToDate");
    log.debug("selectedCoverFromDate", this.selectedCoverFromDate);
    log.debug("selectedCoverToDate", this.selectedCoverToDate);
    // this.selectedProductCode = JSON.parse(sessionStorage.getItem("selectedProduct"));
    // log.debug("selectedProductCode-import risk", this.selectedProductCode);

    // Initialize mapping with empty selections
    this.systemFields.forEach(field => {
      this.mapping[field.key] = '';
    });
    this.riskDetailsForm = new FormGroup({
      subclass: new FormControl(null)
    });
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol')
    log.debug("currency Object:", currencySymbol)
    log.debug("currency Delimeter:", currencyDelimiter)
    this.currencyObj = {
      prefix: currencySymbol + ' ',
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter,
      suffix: ' ',
      nullable: true,
      align: 'left',
    };
    this.dateFormat = sessionStorage.getItem('dateFormat');

    // Convert dateFormat to PrimeNG format
    this.primeNgDateFormat = this.dateFormat
      .replace('yyyy', 'yy')
      .replace('MM', 'mm');


  }
  ngOnDestroy(): void { }

  ngAfterViewInit(): void {
    // Initialize addRiskModal
    if (this.addRiskModalRef?.nativeElement) {
      this.modalInstance = new bootstrap.Modal(this.addRiskModalRef.nativeElement, {
        backdrop: 'static',
        keyboard: false
      });
    }
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    console.log("Found tooltip elements:", tooltips.length);

    tooltips.forEach((el: any) => {
      console.log("Initializing tooltip for:", el);
      new bootstrap.Tooltip(el, {
        container: 'body',
        trigger: 'hover'
      });
    });



  }
  // getSubclass() {
  //   this.subclassService.getAllSubclasses().subscribe(data => {
  //     this.subclassList = data;
  //   });
  // }

  finish() {
    // if (this.selectedRisks.length === 0) {
    //   this.router.navigate(['/home/gis/quotation/risk-section-details']);
    //   return;
    // }


    sessionStorage.setItem('selectedRisks', JSON.stringify(this.selectedRisks));
    log.debug('Selected risks stored:', this.selectedRisks);

    this.addRisk();
  }


  // exportTemplate(): void {
  //   const link = document.createElement('a');
  //   link.href = '../../../../../../../assets/data/Motor_upload_template.csv';
  //   link.download = 'Motor_upload_template.csv';
  //   link.click();
  // }
  exportTemplate(): void {
    const link = document.createElement('a');
    link.href = `assets/data/Motor_upload_template.csv`;
    link.download = 'Motor_upload_template.csv';
    link.click();
  }


  // onFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const fileData = e.target.result;
  //       const workbook = XLSX.read(fileData, { type: 'binary' });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];

  //       // Get all data including headers
  //       const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //       if (parsedData && parsedData.length > 0) {
  //         // Ensure we have an array of strings for headers
  //         this.userFileHeaders = (parsedData[0] as any[]).map(header =>
  //           header !== null && header !== undefined ? header.toString() : ''
  //         ).filter(header => header !== '');

  //         this.userFileData = this.parseData(parsedData);


  //         // DEBUG: Check values
  //         console.log('Headers:', this.userFileHeaders);
  //         console.log('Data rows:', this.userFileData.length);
  //         console.log('About to show modal...');
  //         log.debug("userFileData", this.userFileData)


  //         // Show mapping modal instead of automatically parsing
  //         this.showMappingModal = true;

  //         console.log('showMappingModal is now:', this.showMappingModal);

  //         log.debug('File headers:', this.userFileHeaders);
  //         log.debug('File data sample:', this.userFileData.slice(0, 3));
  //       }
  //     };
  //     reader.readAsBinaryString(file);
  //   }
  // }

  private parseData(parsedData: any[]): any[] {
    if (!parsedData || parsedData.length === 0) {
      return [];
    }

    const columns = parsedData[0] as any[];
    const rows = parsedData.slice(1);

    return rows
      .filter((row: any) => row && Array.isArray(row))
      .map((row: any[]) => {
        const rowData: any = {};
        columns.forEach((column: any, index: number) => {
          if (column !== null && column !== undefined) {
            const columnName = column.toString();
            rowData[columnName] = row[index] !== undefined ? row[index] : '';
          }
        });
        return rowData;
      })
      .filter(row => Object.values(row).some(value =>
        value !== null && value !== undefined && value !== ''
      ));
  }

  // Handle mapping confirmation
  onMappingConfirmed(): void {
    // Validate required fields
    const missingRequiredFields = this.systemFields
      .filter(field => field.required && !this.mapping[field.key]);

    if (missingRequiredFields.length > 0) {
      alert(`Please map the following required fields: ${missingRequiredFields.map(f => f.label).join(', ')}`);
      return;
    }

    // Transform the data based on mapping
    this.mappedData = this.userFileData.map(userRow => {
      const mappedRow: any = {};
      for (const [systemKey, userKey] of Object.entries(this.mapping)) {
        if (userKey && userRow[userKey] !== undefined) {
          mappedRow[systemKey] = userRow[userKey];
        } else {
          mappedRow[systemKey] = ''; // Set empty for unmapped fields
        }
      }
      return mappedRow;
    });

    this.data = this.mappedData;

    this.showMappingModal = false;

    // Reset selections when new data is loaded
    this.selectedRisks = [];

    log.debug('Mapped data:', this.mappedData);



  }

  onMappingCancelled(): void {
    this.showMappingModal = false;
    this.userFileHeaders = [];
    this.userFileData = [];
  }

  updateMapping(systemField: string, userColumn: string): void {
    this.mapping[systemField] = userColumn;
  }
  // Handle selection changes
  onSelectionChange(event: any): void {
    this.selectedRisks = event;
    log.debug('Selection changed:', this.selectedRisks);
  }

  // Get current selected risks count
  get selectedCount(): number {
    return this.selectedRisks.length;
  }


  getQuotationRiskPayload(): any[] {
    // Validate that the selectedRisks array is not empty
    if (!this.selectedRisks || this.selectedRisks.length === 0) {
      this.globalMessagingService.displayErrorMessage("Error", "No risks selected. Please select at least one risk.");
      return [];
    }

    // Track if all risks are valid
    let allRisksValid = true;

    const validRisks = this.selectedRisks.filter(risk => {
      // Validate client code
      if (risk.ClientCode !== this.selectedClientCode) {
        this.globalMessagingService.displayErrorMessage('Error', `Client code mismatch .`);
        allRisksValid = false;
        return false;
      }

      // Validate subclass code
      const isValidSubclass = this.allMatchingSubclasses.some(
        (subclass) => subclass.code === risk.SubclassCode
      );
      if (!isValidSubclass) {
        this.globalMessagingService.displayErrorMessage('Error', `Invalid subclass code .`);
        allRisksValid = false;
        return false;
      }

      // Validate propertyId against the regex pattern
      const isValidPropertyId = new RegExp(this.regexPattern).test(risk.PropertyId);
      if (!isValidPropertyId) {
        this.globalMessagingService.displayErrorMessage('Error', `Invalid Property ID format: ${risk.PropertyId}.`);
        allRisksValid = false;
        return false;
      }

      // Format and validate dates
      const wefDate = this.formatDate(risk.WEF);
      const wetDate = this.formatDate(risk.WET);

      // Convert dates to Date objects for comparison
      const wef = new Date(wefDate);
      const wet = new Date(wetDate);
      const coverFromDate = new Date(this.selectedCoverFromDate);
      const coverToDate = new Date(this.selectedCoverToDate);

      // Validate that WEF is within the selected date range
      if (wef < coverFromDate || wef > coverToDate) {
        this.globalMessagingService.displayErrorMessage('Error', `With Effect From Date  is outside the selected date range.`);
        allRisksValid = false;
        return false;
      }

      // Validate that WET is within the selected date range
      if (wet < coverFromDate || wet > coverToDate) {
        this.globalMessagingService.displayErrorMessage('Error', `With Effect To Date  is outside the selected date range.`);
        allRisksValid = false;
        return false;
      }

      return true; // Risk is valid
    });

    // If any risk is invalid, return an empty array and do not create the payload
    if (!allRisksValid) {
      // this.globalMessagingService.displayErrorMessage('Error', 'One or more risks failed validation. Payload not created.');
      return [];
    }

    // Log the valid risks for debugging
    log.debug("Valid Risks:", validRisks);

    // Create the payload only if all risks are valid
    return validRisks.map(risk => {
      const wefDate = this.formatDate(risk.WEF);
      const wetDate = this.formatDate(risk.WET);

      return {
        coverTypeCode: risk.CoverTypeCode,
        action: this.quoteAction ? this.quoteAction : "A",
        productCode: 8293,
        propertyId: risk.PropertyId,
        value: risk.PremiumBind,
        coverTypeShortDescription: risk.CoverTypeShortDesc,
        premium: risk.RiskPremAmount,
        subclassCode: risk.SubclassCode,
        itemDesc: risk.ItemDesc,
        wef: wefDate, // Use formatted WEF
        wet: wetDate, // Use formatted WET
        prpCode: risk.ClientCode,
      };
    });
  }


  onSubclassChange(event: any): void {
    // Retrieve the selected subclass code from the event
    this.selectedSubclassCode = event.value;
    log.debug('Selected Subclass Code:', this.selectedSubclassCode);
    // this.onSubclassSelected(this.selectedSubclassCode)

    if (this.selectedSubclassCode) {
      this.subclassSelected = true;
      this.fetchUploadedRisks()
    }

    // Optionally, you can call another method here to perform actions with the selected subclass code
    // this.fetchRegexPatternForSelectedSubclass();
  }

  formatDate(dateString: string): string {
    // Split the date string into day, month, and year
    const [day, month, year] = dateString.split('/');

    // Return the date in the desired format (YYYY-MM-DD)
    return `${year}-${month}-${day}`;
  }

  addRisk() {
    let riskPayload = this.getQuotationRiskPayload();
    log.debug("Risk payload", riskPayload);

    // Check if the risk payload is empty (indicating validation failure)
    if (!riskPayload || riskPayload.length === 0) {
      // this.globalMessagingService.displayErrorMessage('Error', 'Cannot add risks. One or more fields are invalid.');
      return; // Exit the method early
    }

    riskPayload = riskPayload.map((risk) => {
      return {
        ...risk,
        quotationCode: this.quotationCode
      }
    })

    // this.quotationService.createQuotationRisk(this.quotationCode, riskPayload).subscribe({
    //   next: (response) => {
    //     log.debug('Risk added successfully:', response);
    //     this.quotationRiskData = response;
    //     const quotationRiskDetails = this.quotationRiskData._embedded[0];
    //     if (quotationRiskDetails) {
    //       this.riskCode = quotationRiskDetails.riskCode
    //       this.quoteProductCode = quotationRiskDetails.quotProductCode
    //     }
    //     this.router.navigate(['/home/gis/quotation/quotation-summary']);
    //   },
    //   error: (error) => {
    //     log.error('Error adding risk:', error);
    //     this.globalMessagingService.displayErrorMessage('Error', 'Failed to add risks. Please try again.');
    //   }
    // })



  }

  /**
   * Retrieves and matches product subclasses for a given product code.
   * - Makes an HTTP GET request to GISService for product subclasses.
   * - Matches and combines subclasses with the existing 'allSubclassList'.
   * - Logs the final list of matching subclasses.
   * - Forces change detection to reflect updates.
   * @method getProductSubclass
   * @param {number} code - The product code to fetch subclasses.
   * @return {void}
   */
  getProductSubclass(code: number) {
    this.subclassService.getProductSubclasses(code)
      .subscribe((subclasses) => {
        this.allMatchingSubclasses = subclasses.map((value) => {
          return {
            ...value,
            description: value.description,
          }
        })
      })
  }
  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   this.validateAndSetFile(file);
  // }
  async onFileSelected(event: any): Promise<void> {
    log.debug('File input event:', event);
    const file = event.target.files[0];
    log.debug('Selected file:', file);

    this.validateAndSetFile(file);

    if (!this.selectedFile) return;

    // Determine file extension
    const extension = this.selectedFile.name.split('.').pop()?.toLowerCase();
    log.debug('EXTENSION:', extension)
    if (extension === 'csv') {
      const jsonData = await this.convertCsvToJson(this.selectedFile);
      console.log("JSON output after uploading:", jsonData);

      const importedriskPaylod = this.mapCsvToFullPayload(jsonData)
      log.debug("📋 First Item Sample:", importedriskPaylod[0]);

      this.uploadImportedRisk(importedriskPaylod)

    }

  }



  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      this.validateAndSetFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  validateAndSetFile(file: File): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage = 'File size exceeds the maximum limit of 10MB';
      return;
    }

    // Check type via MIME
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const allowedExtensions = ['csv', 'xls', 'xlsx'];

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      this.errorMessage = 'Please upload a valid Excel file (CSV, XLS, XLSX)';
      return;
    }

    this.selectedFile = file;
    this.successMessage = 'File selected successfully';
    log.debug("Selected File", this.selectedFile)
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'pi pi-image';
      case 'txt':
      case 'log':
        return 'pi pi-file';
      default:
        return 'pi pi-file'; // fallback
    }
  }
  removeFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';

    ;
  }
  uploadImportedRisk(data: PolicyElectronicDataDTO[]): void {


    log.debug('Policy Payload being sent:', data);

    this.quotationService.uploadImportRiskData(data).subscribe({
      next: (data) => {
        this.policyData = data;
        log.debug('Policy data uploaded successfully:', data);
        data && this.fetchUploadedRisks()
        this.successMessage = 'Policies uploaded successfully!';
        this.globalMessagingService.displaySuccessMessage('Success', 'Policies uploaded successfully!');
      },
      error: (err) => {
        console.error('Failed to load policy data', err);
        this.errorMessage = 'Failed to upload policies. Please try again.';
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to upload policies');
      }
    });
  }
  convertCsvToJson(file: File): Promise<any[]> {
    log.debug("Convert to csv called:")
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const text = reader.result as string;

        // Split rows
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        // Extract header columns
        const headers = lines[0].split(',').map(h => h.trim());

        const jsonData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};

          headers.forEach((header, index) => {
            obj[header] = values[index] || null;
          });

          return obj;
        });

        resolve(jsonData);
      };

      reader.onerror = (err) => reject(err);

      reader.readAsText(file);
    });
  }

  /**
   * Parses CSV date string from DD-MM-YYYY format to ISO date string YYYY-MM-DD
   * @param dateString - Date in format DD-MM-YYYY (e.g., "19-06-2025")
   * @returns ISO formatted date string or empty string if invalid
   */
  parseCsvDate(dateString: string): string {
    if (!dateString) return "";

    try {
      const parts = dateString.trim().split('-');

      if (parts.length !== 3) {
        log.warn(`Invalid date format: ${dateString}`);
        return "";
      }

      const [day, month, year] = parts;

      // Convert to ISO format: YYYY-MM-DD
      const isoDate = `${year}-${month}-${day}`;

      // Validate the date is actually valid
      const dateObj = new Date(isoDate);
      if (isNaN(dateObj.getTime())) {
        log.warn(`Invalid date value: ${dateString}`);
        return "";
      }

      log.debug(`Parsed date: ${dateString} -> ${isoDate}`);
      return isoDate;
    } catch (error) {
      log.error(`Error parsing date ${dateString}:`, error);
      return "";
    }
  }
  formatToIso(dateStr: string): string {
    if (!dateStr) return '';

    // Case 1: DD/MM/YYYY
    if (dateStr.includes('/')) {
      const [d, m, y] = dateStr.split('/');
      return new Date(`${y}-${m}-${d}`).toISOString().split('T')[0];
    }

    // Case 2: normal date formats
    return new Date(dateStr).toISOString().split('T')[0];
  }

  mapCsvToFullPayload(csvData: any[]): any[] {
    return csvData.map(row => ({

      policyBatchNo: 0,
      transactionType: row["RISK TYPE"] || "",
      agentClientId: row["INSURED ID"] || "",
      agentClientName: row["INSURED NAME"] || "",
      agentClientSurname: "",
      withEffectFrom: this.formatToIso(row["EFF DATE"]),
      agentPolicyId: "",
      insuranceClass: "",
      coverType: row["Cover Type"] || "",
      withEffectTo: this.formatToIso(row["EXP DATE"]),
      transactionDateString: "",
      transactionNo: "",
      premium: Number(row["PREMIUM"]) || 0,
      taxes: Number(row["LEVIES"]) || 0,
      propertyId: row["REG NO"] || "",
      make: row["Make/Model"] || "",
      model: row["Model /Type"] || "",
      yearOfManufacture: row["YOM"] ? Number(row["YOM"]) : 0,
      cubicCapacity: row["Body Type/CC rate"] || "",
      engineNumber: row["Engine No"] || "",
      chassisNumber: row["Chasis No."] || "",
      sumInsured: (row["SUM INSURED"]) || 0,
      sectionColumn1: 0, sectionColumn2: 0, sectionColumn3: 0, sectionColumn4: 0, sectionColumn5: 0,
      sectionColumn6: 0, sectionColumn7: 0, sectionColumn8: 0, sectionColumn9: 0, sectionColumn10: 0,
      sectionColumn11: 0, sectionColumn12: 0, sectionColumn13: 0, sectionColumn14: 0, sectionColumn15: 0,
      sectionColumn16: 0, sectionColumn17: 0, sectionColumn18: 0, sectionColumn19: 0, sectionColumn20: 0,
      sectionColumn1Rate: 0, sectionColumn2Rate: 0, sectionColumn3Rate: 0, sectionColumn4Rate: 0,
      sectionColumn5Rate: 0, sectionColumn6Rate: 0, sectionColumn7Rate: 0, sectionColumn8Rate: 0,
      sectionColumn9Rate: 0, sectionColumn10Rate: 0, sectionColumn11Rate: 0, sectionColumn12Rate: 0,
      sectionColumn13Rate: 0, sectionColumn14Rate: 0, sectionColumn15Rate: 0, sectionColumn16Rate: 0,
      sectionColumn17Rate: 0, sectionColumn18Rate: 0, sectionColumn19Rate: 0, sectionColumn20Rate: 0,
      propertyCode: 0,
      subclassCode: this.selectedSubclassCode,
      coverTypeCode: 0,
      coverTypeShortDesc: "",
      gisIpuPropertyId: "",
      transactOnlyCheck: "",
      transferred: "",
      gisClientCode: this.selectedClientCode,
      gisIpuCode: 0,
      policyNumber: row["POL NO"] || "",
      notTransferredReason: "",
      authorized: "",
      authorizationDate: new Date().toISOString().split('T')[0],
      pdcTransferred: "",
      certificateNumber: row["Certificate No"] || "",
      clientTypeCode: 0,
      agentCode: 0,
      lotId: "",
      clientTypeShortDesc: "",
      quotationCode: this.quotationCode,
      quotationProductCode: this.quoteProductCode,
      binderCode: 0,
      productCode: this.selectedProductCode,
      newClientFlag: "",
      proRataFlag: "",
      duplicatedFlag: "",
      formMNumber: "",
      cfValue: "",
      marineValue: 0,
      color: row["Color"] || "",
      engine: row["Engine No"] || "",
      suspendCancelledFlag: "",
      dateSuspendCancelled: "",
      policyCoverFrom: "",
      policyCoverTo: "",
      currency: "",
      policyCoinsuranceFlag: "",
      policyCoinsuranceLeaderFlag: "",
      policyCoinsurancePercentage: 0,
      clientName: row["INSURED NAME"] || "",
      clientShortDesc: "",
      nationalId: row["NATIONAL ID"] || "",
      clientPin: row["PIN"] || "",
      postalAddress: row["POSTAL_ADDRS"] || "",
      postalTown: row["POSTAL_TOWN"] || "",
      postalCode: row["POSTAL_CODE"] || "",
      clientTelephoneNumber: row["TELEPHONE NO"] || "",
      clientMobileNumber: row["MOBILE NUMBER"] || "",
      clientCountry: row["COUNTRY"] || "",
      policyRenewableFlag: "",
      policySumInsured: 0,
      facultativePolicyFlag: "",
      branch: "",
      insuredName: row["INSURED NAME"] || "",
      insuredNationalId: row["NATIONAL ID"] || "",
      insuredPin: row["PIN"] || "",
      insuredPostalAddress: row["POSTAL_ADDRS"] || "",
      insuredPostalTown: row["POSTAL_TOWN"] || "",
      insuredPostalCode: row["POSTAL_CODE"] || "",
      insuredTelephoneNumber: row["TELEPHONE NO"] || "",
      insuredMobileNumber: row["MOBILE NUMBER"] || "",
      policyRiskCoverFrom: "",
      policyRiskCoverTo: "",
      policyLoadedFlag: "",
      commissionRate: 0,
      preparedBy: "",
      authorisedBy: "",
      stampDuty: 0,
      trainingLevy: 0,
      phf: 0,
      commission: 0,
      endorsementNumber: "",
      debitCreditNoteNumber: "",
      underwritingYear: row["UNDERWRITING YEAR"] ? Number(row["UNDERWRITING YEAR"]) : 0,
      riskDescription: row["RISK DESCRIPTION"] || "",
      temp: "",
      policyClientType: "",
      policyClientTitle: "",
      gisSubclassCode: 0,
      postedDate: "",
      loadedFlag: "",
      subclassShortDesc2: "",
      subclassShortDesc3: "",
      subclassShortDesc4: "",
      subclassShortDesc5: "",
      subclassShortDesc6: "",
      subclassPremium: 0,
      subclassPremium2: 0,
      subclassPremium3: 0,
      subclassPremium4: 0,
      subclassPremium5: 0,
      subclassPremium6: 0,
      totalPremium: Number(row["PREMIUM"]) || 0,
      totalSubclass: 0,
      policyUnderwritingYear: 0,
      transactionDate: "",
      transactionNumber: Number(row["TRANSACTION NO"]) || 0,
      policyUnderwritingOnlyFlag: "",
      ipuRiskNote: "",
      insuredEmailAddress: row["EMAIL"] || "",
      clientDateOfBirth: row["DOB"] || "",
      insuredDateOfBirth: row["DOB"] || "",
      awrCode: 0,
      awpCode: 0,
      emailAddress: row["EMAIL"] || "",
      origin: "",
      pecCarryCapacity: "",
      bodyType: row["Body Type"] || "",
      registrationNumber: row["REG NO"] || "",
      branchShortDesc: "",
      livestockOwnerMark: "",
      livestockInsurerTag: "",
      livestockPurpose: "",
      livestockStockType: "",
      livestockBreed: "",
      livestockSex: "",
      livestockAge: 0,
      livestockNumber: 0,
      livestockValue: 0,
      riskNote: "",
      carryingCapacity: 0,
      driverEmail: row["Driver Email"] || "",
      driverName: row["Driver Name"] || "",
      driverTelephoneNumber: row["Driver Tel No"] || "",
      insuredIsDriverFlag: row["Driver?"] || "",
      yearOfBuilt: row["Year of Built"] ? Number(row["Year of Built"]) : 0,
      vesselType: "",
      clause: "",
      category: "",
      conveyance: "",
      country: row["COUNTRY"] || "",
      proformaInvoiceValue: 0,
      proformaInvoiceNumber: "",
      proformaInvoiceDate: "",
      portOfDestination: "",
      paymentDate: "",
      certNo: "",
      tin: "",
      excess: "",
      subCategory: "",
      riskLocation: "",
      riskTown: "",
      territory: "",
      isNewRisk: "",
      partShipment: "",
      riskAddress: "",
      calcMaxExposure: "",
      maxExposureAmount: 0,
      surveyRisk: "",
      certificateDate: "",
      dischargePort: "",
      shipmentPercentage: 0,
      landingStatus: "",
      scheduleBasicRate: 0,
      scheduleCargoDescription: "",
      scheduleContainerizedFlag: "",
      scheduleCurrency: "",
      scheduleInvoicedValue: 0,
      scheduleMarinePolicyType: "",
      scheduleNatureOfCargo: "",
      scheduleSailingFrom: "",
      scheduleSailingTo: "",
      scheduleVesselName: "",
      sectionColumn1BaseAmount: 0,
      sectionColumn1BaseExchangeRate: 0,
      sectionColumn1LoadingRate: 0
    }));
  }
  // fetchUploadedRisks() {
  //   log.debug("Quotation code:", this.quotationCode)
  //   this.quotationService.fetchUploadedRisk(this.quotationCode,).subscribe({
  //     next: (data) => {
  //       this.allImportedRisks = data._embedded;
  //       log.debug('Imported risk data:', data);

  //     },
  //     error: (err) => {
  //       log.error('Failed to load imported risk data', err);
  //       this.errorMessage = 'Failed to upload policies. Please try again.';
  //       this.globalMessagingService.displayErrorMessage('Error', 'Failed to load imported risk data');
  //     }
  //   });
  // }
  fetchUploadedRisks() {
    log.debug("Quotation code:", this.quotationCode);

    // 1) Fetch ALL risks (without validated filter)
    this.quotationService.fetchUploadedRisk(this.quotationCode)
      .subscribe({
        next: (data) => {
          this.allRisks = data._embedded;
          log.debug('All Imported Risks:', data);
          this.showImportedRiskTable = true
        },
        error: (err) => {
          this.handleRiskError(err);
        }
      });

    // 2) Fetch VALIDATED risks
    this.quotationService.fetchUploadedRisk(this.quotationCode, '', 'Y')
      .subscribe({
        next: (data) => {
          this.validRisks = data._embedded;
          log.debug('Validated Risks:', data);
        },
        error: (err) => {
          this.handleRiskError(err);
        }
      });

    // 3) Fetch NEEDS REVIEW risks (validated = false)
    this.quotationService.fetchUploadedRisk(this.quotationCode, '', 'N')
      .subscribe({
        next: (data) => {
          this.needsReviewRisks = data._embedded;
          log.debug('Needs Review Risks:', data);
        },
        error: (err) => {
          this.handleRiskError(err);
        }
      });
    log.debug("active tab is ", this.isRiskValidated)

    if (this.isRiskValidated && this.validRisks.length > 0) {
      this.activeTab = 'VALID'
      log.debug("active tab is valid")
    } else if (this.isRiskValidated) {
      this.activeTab = 'REVIEW'
      log.debug("active tab is review")

    }
  }

  private handleRiskError(err: any) {
    log.error('Failed to load imported risk data', err);
    this.errorMessage = 'Failed to upload policies. Please try again.';
    this.globalMessagingService.displayErrorMessage(
      'Error',
      'Failed to load imported risk data'
    );
  }

  validateImportedRisk() {
    this.quotationService.validateUploadedRisk(this.quotationCode).subscribe({
      next: (data: string) => {
        this.isRiskValidated = true
        log.debug('Validated Imported risk data:', data);
        log.debug('Quotation Code:', this.quotationCode)
        data && this.fetchUploadedRisks()

      },
      error: (err) => {
        log.error('Failed to load imported risk data', err);
        this.errorMessage = 'Failed to upload policies. Please try again.';
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to load imported risk data');
      }
    });
  }

  openEditRiskModal(risk: any) {
    this.isEditMode = true
    this.modalInstance?.show();
    if (this.formData) {
      this.formData.forEach((field) => {
        if (field.name === 'subclass') {
          field.selectOptions = this.allMatchingSubclasses.map(subclass => ({
            label: subclass.description,
            value: subclass.code
          }));
        }
      });
    }

    this.loadClientsThenInsured()
    log.debug("Selected risk:", risk)
    this.selectedRisk = risk
    this.selectedRisk && this.getVehicleMake()
    this.insuredName = this.selectedRisk?.insuredName
    log.debug("Insured name", this.insuredName)
    log.debug("Risk form Values:", this.riskDetailsForm.value)
    this.riskDetailsForm.patchValue(risk);
    this.riskDetailsForm.patchValue({ subclass: risk.subclassCode });
    // this.riskDetailsForm.patchValue({ insureds: risk.insuredName });
    this.onSubclassSelected(this.selectedSubclassCode)
    // this.patchEditValues();
  }
  onRiskSelectionChange(event: any) {
    log.debug('Risk selected to be validated', event)
  }


  // deleteRisks() {
  //   // deletion logic
  // }

  loadSelectedProductRiskFields(productCode: number): void {
    const formFieldDescription = `detailed-quotation-risk-${productCode}`;

    this.quotationService.getFormFields(formFieldDescription).subscribe({
      next: (response) => {
        const fields = response?.[0]?.fields || [];

        this.formContent = response;
        this.formData = fields;

        log.debug(this.formContent, 'Form-content');
        log.debug(this.formData, 'formData is defined here');

        // Remove existing dynamic controls
        Object.keys(this.riskDetailsForm.controls).forEach((controlName) => {
          const control = this.riskDetailsForm.get(controlName) as any;
          if (control?.metadata?.dynamic) {
            this.riskDetailsForm.removeControl(controlName);
            log.debug(`Removed dynamic control: ${controlName}`);
          }
        });

        // Add new dynamic controls
        this.formData.forEach((field) => {
          const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
          const formControl = new FormControl(this.getDefaultValue(field), validators);
          (formControl as any).metadata = { dynamic: true };
          this.riskDetailsForm.addControl(field.name, formControl);
        });


        this.loadClientsThenInsured();

        log.debug(this.riskDetailsForm.value, 'Final Form Value');
      },
      error: (err) => {
        log.error(err, 'Failed to load risk fields');
      }
    });
  }
  async loadSelectedSubclassRiskFields(subclassCode: number): Promise<void> {
    const riskFieldDescription = `detailed-risk-subclass-form-${subclassCode}`;

    try {
      const response = await firstValueFrom(this.quotationService.getFormFields(riskFieldDescription));
      const fields = response?.[0]?.fields || [];
      this.dynamicSubclassFormFields = fields
      this.subclassFormContent = response;
      sessionStorage.setItem('dynamicSubclassFormField', JSON.stringify(fields));
      this.subclassFormData = fields.filter(field => Number(field.scheduleLevel) === 1);
      this.allSubclassFormData = fields.filter(field => field.applicableLevel === 'S');

      // Remove old dynamic controls
      // Object.keys(this.riskDetailsForm.controls).forEach(controlName => {
      //   const control = this.riskDetailsForm.get(controlName) as any;
      //   if (control?.metadata?.dynamicSubclass) {
      //     this.riskDetailsForm.removeControl(controlName);
      //   }
      // });
      Object.keys(this.riskDetailsForm.controls).forEach(controlName => {
        const control = this.riskDetailsForm.get(controlName) as any;

        // Remove if it has dynamicSubclass metadata
        if (control?.metadata?.dynamicSubclass) {
          this.riskDetailsForm.removeControl(controlName);
        }

        // Additionally, remove 'butcharge' if not in edit mode
        if (!this.isEditMode && controlName === 'butCharge') {
          this.riskDetailsForm.removeControl('butCharge');
        }
      });


      // Add new dynamic controls
      // this.subclassFormData.forEach(field => {
      //   if (!this.riskDetailsForm.get(field.name)) {
      //     const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
      //     const control = new FormControl(this.getDefaultValue(field), validators);
      //     (control as any).metadata = { dynamicSubclass: true };
      //     this.riskDetailsForm.addControl(field.name, control);
      //     log.debug(`Added new dynamicSubclass control: ${field.name}`);
      //   }
      //   let defaultValue = '';
      //   if (field.name === 'ncdStatus') {
      //     defaultValue = 'N';
      //   }
      // });
      this.subclassFormData.forEach(field => {
        if (!this.riskDetailsForm.get(field.name)) {
          const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
          const control = new FormControl(this.getDefaultValue(field), validators);
          (control as any).metadata = { dynamicSubclass: true };

          // ✅ Add control to the form
          this.riskDetailsForm.addControl(field.name, control);
          log.debug(`Added new dynamicSubclass control: ${field.name}`);
        }

        // ✅ Handle default value logic (like ncdStatus)
        if (field.name === 'ncdStatus') {
          this.riskDetailsForm.get(field.name)?.setValue('N');
        }
        if (!this.isEditMode && field.name === 'butCharge') {
          this.riskDetailsForm.removeControl('butCharge');
          this.subclassFormData = this.subclassFormData.filter(f => f.name !== 'butCharge');
        }

        if (field.options && field.options.length > 0) {
          let optionsList = field.options;

          // ✅ Parse JSON safely if options come as a string
          if (typeof field.options === 'string') {
            try {
              optionsList = JSON.parse(field.options);
            } catch {
              optionsList = [];
            }
          }

          // ✅ Use your helper to populate selectOptions
          this.safePopulateSelectOptions(
            this.subclassFormData,
            field.name,
            optionsList,
            'description', // labelKey
            'code'         // valueKey
          );
        }

      });

      log.debug(" risk details Value:", this.riskDetailsForm.value)

      const coverFromStr = this.quotationDetails.coverFrom;
      const coverToStr = this.quotationDetails.coverTo;

      const coverFrom = new Date(coverFromStr + 'T00:00:00');
      const coverTo = new Date(coverToStr + 'T00:00:00');

      this.riskDetailsForm.patchValue({
        coverFrom: coverFrom,
        coverTo: coverTo
      });

      log.debug('Risk Details Value after patching:', this.riskDetailsForm.value);

      if (this.riskDetailsForm.contains('coverDays')) {
        const coverDays = this.getCoverDays(coverFrom, coverTo);
        log.debug('Cover days:', coverDays);

        this.riskDetailsForm.patchValue({ coverDays });
      }



      this.fetchRegexPattern();

      if (this.isEditMode) {
        this.patchEditValues();
      }

    } catch (err) {
      this.globalMessagingService.displayErrorMessage('Error', err.error?.message || 'Failed to load fields');
      throw err; // important, so onSubclassSelected catch block runs
    }
  }
  fetchRegexPattern() {
    this.quotationService
      .getRegexPatterns(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.regexPattern = response?._embedded;
          log.debug('New Regex Pattern', this.regexPattern);

          this.dynamicRegexPattern = this.regexPattern;
          log.debug("fetch regex risk details:", this.riskDetailsForm.value)
          const control = this.riskDetailsForm.get('registrationNumber') as FormControl;

          if (control) {
            // Add your required validators here
            control.setValidators([
              Validators.required,
              Validators.pattern(this.dynamicRegexPattern)
            ]);

            control.updateValueAndValidity();
          }
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },
      });
  }
  getDefaultValue(field: any): any {
    if (field.type === 'date') {
      return new Date();
    }
    return '';
  }
  safePopulateSelectOptions(formDataArray: any[], fieldName: string, options: any[], labelKey: string, valueKey: string) {
    if (formDataArray && Array.isArray(formDataArray)) {
      formDataArray.forEach(field => {
        if (field.name === fieldName) {
          field.selectOptions = options.map(opt => ({
            label: opt[labelKey],
            value: opt[valueKey]
          }));
        }
      });
      log.debug(`Populated selectOptions for '${fieldName}'`, formDataArray);
    } else {
      log.warn(`Cannot populate '${fieldName}', form data array is not ready`);
    }
  }
  getCoverDays(coverFrom: string | Date, coverTo: string | Date): number {
    const fromDate = new Date(coverFrom);
    const toDate = new Date(coverTo);
    log.debug("Cover from:", fromDate)
    log.debug("Cover to:", toDate)

    const diffInMs = toDate.getTime() - fromDate.getTime();

    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
  }

  onDateChange(): void {
    log.debug('on date change called')
    const coverFrom = this.riskDetailsForm.get('coverFrom')?.value;
    this.updateCoverToDate(coverFrom)
    const coverTo = this.riskDetailsForm.get('coverTo')?.value;

    if (coverFrom && coverTo) {
      const coverDays = this.getCoverDays(coverFrom, coverTo);

      if (this.riskDetailsForm.contains('coverDays')) {
        this.riskDetailsForm.patchValue({ coverDays });
      }
    }
  }
  updateCoverToDate(date) {
    log.debug("Cover from date:", date)
    const coverFromDate = date;
    const formattedCoverFromDate = this.formatDate(coverFromDate);
    log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);

    this.producSetupService.getCoverToDate(formattedCoverFromDate, this.selectedProductCode)
      .subscribe({
        next: (res) => {
          this.midnightexpiry = res;
          log.debug("midnightexpirydate", this.midnightexpiry);
          log.debug(this.midnightexpiry)
          const coverTo = this.midnightexpiry._embedded[0].coverToDate
          const coverToDate = new Date(coverTo)
          // Extract the day, month, and year
          const day = coverToDate.getDate();
          const month = coverToDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
          const year = coverToDate.getFullYear();

          // Format the date in 'dd-Month-yyyy' format
          const formattedDate = `${day}-${month}-${year}`;

          this.coverToDate = formattedDate;
          log.debug('Cover to  Date', this.coverToDate);
          // this.riskDetailsForm.controls['wet'].setValue(this.coverToDate)
          this.riskDetailsForm.patchValue({ coverTo: this.coverToDate });
          const coverDays = this.getCoverDays(formattedCoverFromDate, coverTo);
          this.riskDetailsForm.patchValue({ coverDays: coverDays });

        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })

  }
  loadClientsThenInsured() {
    const pageSize = 20;
    const pageIndex = 0;


    this.clientService.getClients(pageIndex, pageSize).pipe(
      tap((data: any) => {
        data.content.forEach(client => {
          client.clientTypeName = client.clientType?.clientTypeName;
          client.clientFullName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
        });
        this.clientsData = data.content;
        const selectedInsuredObject = this.clientsData.find(
          insured => insured.firstName === this.insuredName || insured.lastName === this.insuredName
        );
        log.debug('selected insured name:', this.insuredName)
        log.debug('selected insured object:', selectedInsuredObject)
        this.insuredCode = selectedInsuredObject.id
      }),
      switchMap(() => this.clientService.getClientById(this.insuredCode))
    ).subscribe({
      next: (insured: any) => {
        insured.clientFullName = `${insured.firstName || ''} ${insured.lastName || ''}`.trim();
        log.debug('insured object', insured)
        const exists = this.clientsData.some(c => c.id === insured.id);
        if (!exists) {
          this.clientsData = [insured, ...this.clientsData];
        }

        if (!this.riskDetailsForm.contains('insureds')) {
          this.riskDetailsForm.addControl('insureds', new FormControl(''));
        }
        const selectedInsuredObject = this.clientsData.find(
          insured => insured.id === this.insuredCode
        );
        this.riskDetailsForm.patchValue({ insureds: selectedInsuredObject });

        // this.riskDetailsForm.patchValue({ insureds: insured });
        log.debug("risk details form:", this.riskDetailsForm.value)
      },
      error: err => log.error('Error fetching clients or insured', err)
    });
  }
  async onSubclassSelected(event: any) {
    log.debug("on subclass seelcted has been calleed")
    this.selectedSubclassCode = event.value || event.code || event;
    log.debug("Selected subclass code:", this.selectedSubclassCode);

    // this.selectedSubclassObject = this.allMatchingSubclasses.find(subclass => subclass.code == this.selectedSubclassCode)
    // log.debug("Selected Subclass Object:", this.selectedSubclassObject)
    if (this.selectedSubclassCode) {
      try {
        await this.loadSelectedSubclassRiskFields(this.selectedSubclassCode);
        const selectedVehicleMake = Number(this.selectedRisk?.make)
        this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
        this.loadAllBinders();
        this.fetchTerritories()
        // this.loadSubclassClauses(this.selectedSubclassCode);
        log.debug('Motor class allowed:', this.motorClassAllowed)
        if (this.motorClassAllowed == 'Y') {
          this.getVehicleMake();
          this.fetchScheduleRelatedData();
        }
        selectedVehicleMake && this.getVehicleModel(selectedVehicleMake);

        this.fetchYearOfManufacture();
      } catch (err) {
        log.error("Failed to load subclass risk fields asynccc:", err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to load subclass data asyncc');
      }
    }
  }
  loadCovertypeBySubclassCode(code: number) {
    this.subclassCoverTypesService.getSubclassCovertypeBySCode(code).subscribe(data => {
      this.subclassCoverType = data.map(value => ({
        ...value,
        description: value.description.charAt(0).toUpperCase() + value.description.slice(1).toLowerCase()
      }));
      log.debug('Processed covertypes:', this.subclassCoverType);
      log.debug('Risk details form:', this.riskDetailsForm.value);
      log.debug('Selected Risk:', this.selectedRisk);

      const searchValue = (this.selectedRisk.coverType || '').toLowerCase().trim();

      const matched = this.subclassCoverType.find(item => {
        const desc = (item.description || '').toLowerCase();
        const short = (item.coverTypeShortDescription || '').toLowerCase();

        return (
          desc === searchValue ||
          short === searchValue ||
          desc.startsWith(searchValue) ||
          short.startsWith(searchValue) ||
          searchValue.startsWith(desc)
        );
      });


      log.debug('Matched Covertype', matched)
      const matchedCoverTypeCode = matched.coverTypeCode
      this.safePopulateSelectOptions(this.subclassFormData, 'coverType', this.subclassCoverType, 'description', 'coverTypeCode');

      const coverTypeCodeToUse = this.storedRiskFormDetails?.coverTypeCode || this.passedCoverTypeCode;
      if (matchedCoverTypeCode) {
        this.riskDetailsForm.patchValue({
          coverType: matchedCoverTypeCode
        });
      }


      this.cdr.detectChanges();
    });
  }
  loadAllBinders() {
    this.binderService.getAllBindersQuick(this.selectedSubclassCode).subscribe(
      (data) => {
        this.binderList = data;

        this.binderListDetails = this.binderList._embedded.binder_dto_list;

        // Map and capitalize binder names
        this.binderListDetails = this.binderListDetails.map((value) => {
          let capitalizedDescription = value.binder_name.charAt(0).toUpperCase() + value.binder_name.slice(1).toLowerCase();
          return {
            ...value,
            binder_name: capitalizedDescription,
          };
        });

        log.debug("binder list", this.binderListDetails)

        // Inject into the subclass formData
        this.subclassFormData = this.subclassFormData.map(field => {
          if (field.name === 'premiumBand') {
            return {
              ...field,
              selectOptions: this.binderListDetails.map(binder => ({
                label: binder.binder_short_description,
                value: binder.code
              }))
            };
          }
          return field;
        });

        log.debug("All Binders Details:", this.binderListDetails);
        sessionStorage.setItem('binderList', JSON.stringify(this.binderListDetails));

        // Find default binder
        this.defaultBinder = this.binderListDetails.filter(binder => binder.is_default === "Y");
        log.debug("Default Binder", this.defaultBinder);

        // Set default binder object (not just the name)
        if (this.defaultBinder && this.defaultBinder.length > 0) {
          this.defaultBinderName = this.defaultBinder[0].binder_name;
          this.selectedBinderList = this.defaultBinder[0]; // Store the complete object
          this.selectedBinderCode = this.defaultBinder[0].code; // Set the code as well
          log.debug("Default Binder name", this.defaultBinderName);
          log.debug("Selected binder code", this.selectedBinderCode);
        }
        if (this.storedRiskFormDetails) {
          const selectedBinder = this.binderListDetails.find(binder => binder.code === this.storedRiskFormDetails?.binderCode);
          if (selectedBinder) {
            this.riskDetailsForm.patchValue({ premiumBand: selectedBinder.binder_name });

          }
        }
        this.cdr.detectChanges();

        // Update form control value with default binder
        if (this.riskDetailsForm && this.defaultBinder && this.defaultBinder.length > 0) {
          this.riskDetailsForm.get('premiumBand').setValue(this.defaultBinder[0].code);
        }
      },
      (error) => {
        log.error("Error loading binders:", error);
        // Handle error appropriately
      }
    );
  }
  fetchTerritories() {
    this.territoryService.getAllTerritories().subscribe({
      next: (res) => {
        this.territories = res


      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error:', 'Fetching territories failed')
      }
    });
  }
  checkMotorClass(productCode: number) {
    this.productService.getProductDetailsByCode(productCode).subscribe(res => {
      log.debug("Product Response", res);
      this.motorClassAllowed = res.allowMotorClass
      log.debug("Motor class Allowed:", this.motorClassAllowed)



    });
  }
  getVehicleMake() {
    this.vehicleMakeService.getAllVehicleMake().subscribe(data => {
      this.vehicleMakeList = data;

      this.vehicleMakeList = data.map((value) => {
        let capitalizedDescription =
          value.name.charAt(0).toUpperCase() +
          value.name.slice(1).toLowerCase();
        return {
          ...value,
          name: capitalizedDescription,
        };
      });

      log.debug('this is the vehicle make list >>>', this.vehicleMakeList)

      // Inject into the subclass formData
      this.safePopulateSelectOptions(this.subclassFormData, 'vehicleMake', this.vehicleMakeList, 'name', 'code');


      log.debug("VehicleMake list", this.vehicleMakeList)
      const selectedVehicleMake = this.vehicleMakeList.find(make =>
        make.name?.toLowerCase().includes(this.selectedRisk?.make?.toLowerCase())
      );
      if (selectedVehicleMake) {
        log.debug("selected vehicle make:", selectedVehicleMake)
        this.riskDetailsForm.patchValue({ vehicleMake: selectedVehicleMake });
        this.getVehicleModel(selectedVehicleMake.code)

      }



    })
  }
  getVehicleModel(code: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.vehicleModelService.getAllVehicleModel(code).subscribe({
        next: (data) => {
          this.vehicleModelList = data;
          this.vehicleModelDetails = this.vehicleModelList._embedded.vehicle_model_dto_list.map((value) => ({
            ...value,
            name: value.name.charAt(0).toUpperCase() + value.name.slice(1).toLowerCase()
          }));

          log.debug("Vehicle Model Details", this.vehicleModelDetails);
          sessionStorage.setItem('vehicleModelList', JSON.stringify(this.vehicleModelDetails));

          this.safePopulateSelectOptions(this.subclassFormData, 'vehicleModel', this.vehicleModelDetails, 'name', 'code');

          if (this.storedRiskFormDetails) {
            const selectedVehicleModel = this.vehicleModelDetails.find(
              model => model.code === this.storedRiskFormDetails?.vehicleModel
            );
            if (selectedVehicleModel) {
              this.riskDetailsForm.patchValue({ vehicleModel: selectedVehicleModel.code });
            }
          }

          resolve(); // ✅ promise resolved here
        },
        error: (err) => reject(err) // ✅ handle errors too
      });
    });
  }
  fetchScheduleRelatedData() {
    forkJoin(([
      this.policyService.getBodyTypes(),
      this.policyService.getMotorColors(),
      this.policyService.getSecurityDevices(),
      this.policyService.getMotorAccessories(),
      this.productService.getYearOfManufacture()
    ])).pipe(
      untilDestroyed(this)
    )
      .subscribe(([bodyTypes, motorColours, securityDevices, motorAccessories, modelYear]: any) => {
        this.bodytypesList = bodyTypes._embedded ?? []
        this.motorColorsList = motorColours._embedded ?? []
        this.securityDevicesList = securityDevices._embedded ?? []
        this.motorAccessoriesList = motorAccessories._embedded ?? []
        const model = modelYear._embedded
        this.modelYear = model[0]["List of cover years"]

        log.debug("Body Types:", this.bodytypesList)
        log.debug("Motor Colours:", this.motorColorsList)
        log.debug("Security Devices:", this.securityDevicesList)
        log.debug("Motor Accessories:", this.motorAccessoriesList)
        log.debug("model year", this.modelYear)

        this.safePopulateSelectOptions(this.subclassFormData, 'bodyType', this.bodytypesList, 'description', 'description');
        this.safePopulateSelectOptions(this.subclassFormData, 'color', this.motorColorsList, 'description', 'code');



      })
  }
  fetchYearOfManufacture() {
    this.productService.getYearOfManufacture().subscribe({
      next: (modelYear) => {
        const model = modelYear._embedded;
        const rawYears = model[0]["List of cover years"];

        // ✅ Map raw numbers to label/value objects for p-dropdown filtering
        this.yearList = rawYears.map((year: number) => ({
          label: year.toString(),
          value: year
        }));

        log.debug("YEAR LIST", this.yearList);
      },
      error: (error: HttpErrorResponse) => {
        log.debug("Error log", error.error.message);
        this.globalMessagingService.displayErrorMessage(
          'Error',
          error.error.message
        );
      },
    });
  }

  handleSelectChange(fieldName: string, event: any): void {
    switch (fieldName) {
      case 'vehicleMake':
        this.onVehicleMakeSelected(event);
        break;
      case 'vehicleModel':
        this.onVehicleModelSelected(event);
        break;
      // Add more cases if needed
    }
  }
  onVehicleModelSelected(event: any) {
    const selectedValue = event.value.code;
    const vehicleModel = this.riskDetailsForm.value.vehicleModel || selectedValue
    // Convert selectedValue to the appropriate type (e.g., number)
    const typedSelectedValue = this.convertToCorrectType(vehicleModel);

    // Find the selected object using the converted value
    const selectedObject = this.vehicleModelDetails.find(vehicleModel => vehicleModel.code === typedSelectedValue);

    // Check if the object is found
    if (selectedObject) {
      log.debug('Selected Vehicle Model:', selectedObject);
      sessionStorage.setItem('selectedVehicleModel', JSON.stringify(selectedObject));

      // Perform further actions with the selected object as needed
    } else {
      console.error('Selected Vehicle Model not found');
    }
    this.selectedVehicleModelName = selectedObject.name;
    this.vehiclemakeModel = this.selectedVehicleMakeName + ' ' + this.selectedVehicleModelName;
    log.debug('Selected Vehicle make model', this.vehiclemakeModel);
    if (this.vehiclemakeModel) {
      this.riskDetailsForm.patchValue({ riskDescription: this.vehiclemakeModel });
    }

  }
  onVehicleMakeSelected(event: any) {
    const selectedMakeCode = event.value;
    log.debug("Selected Vehicle Make Code:", selectedMakeCode);
    const selectedObject = this.vehicleMakeList.find(vehicleMake => vehicleMake.code === selectedMakeCode);
    this.selectedVehicleMakeName = selectedObject.name
    if (selectedMakeCode) {
      this.getVehicleModel(selectedMakeCode);
    }
  }
  convertToCorrectType(value: any): any {
    // Implement the conversion logic based on the actual type of your identifier
    // For example, if your identifier is a number, you can use parseInt or parseFloat
    // If it's another type, implement the conversion accordingly
    return parseInt(value, 10); // Adjust based on your actual data type
  }
  onNcdStatusChange(event: any): void {
    const value = event.target.value;
    this.ncdStatusSelected = value === 'Y';
    log.debug('NCD Status selected:', value, ' -> ncdStatusSelected:', this.ncdStatusSelected);
  }
  riskIdPassed(event: any): void {


    if (event instanceof Event) {
      this.passedRiskId = (event.target as HTMLInputElement).value;
    } else {
      this.passedRiskId = event;
    }

    if (this.passedRiskId !== undefined) {
      log.debug('Passed Risk Id', this.passedRiskId);
    } else {
      console.error('Unable to retrieve value from the event object.');
    }
  }
  transformToUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperCaseValue = input.value.toUpperCase();
    log.debug("RISK FORM VALUE", this.riskDetailsForm)
    const control = this.riskDetailsForm.get('registrationNumber') as FormControl;

    if (!control) {
      console.warn('Could not find control for carRegNo at given indexes');
      return;
    }

    log.debug("Keyed In value>>>", control.value);

    control.setValue(upperCaseValue, { emitEvent: false });
  }
  // private patchEditValues(): void {
  //   log.debug('Patched form with selectedRisk:', this.selectedRisk);
  //   log.debug('Cover types list', this.subclassCoverType);

  //   if (!this.selectedRisk) return;

  //   // Helper function to parse DD/MM/YYYY to Date
  //   const parseDate = (value: string | null): Date | null => {
  //     if (!value) return null;
  //     const [day, month, year] = value.split("/");
  //     const date = new Date(Number(year), Number(month) - 1, Number(day));
  //     return isNaN(date.getTime()) ? null : date;
  //   };

  //   // Explicit field mapping between backend keys and form controls
  //   const explicitFields: Record<string, string> = {
  //     coverType: 'coverTypeCode',
  //     premiumBand: 'binderCode',
  //     registrationNumber: 'propertyId',
  //     riskDescription: 'itemDesc',
  //     riskId: 'propertyId'
  //   };

  //   // Patch explicitly mapped fields
  //   Object.keys(explicitFields).forEach(formControl => {
  //     const riskKey = explicitFields[formControl];
  //     if (this.selectedRisk[riskKey] !== undefined && this.riskDetailsForm.contains(formControl)) {
  //       this.riskDetailsForm.get(formControl)?.setValue(this.selectedRisk[riskKey]);
  //     }
  //   });

  //   // Patch value-related controls
  //   const valueControls = ['value', 'sumInsured'];
  //   valueControls.forEach(controlName => {
  //     if (this.riskDetailsForm.contains(controlName)) {
  //       this.riskDetailsForm.get(controlName)?.setValue(this.selectedRisk?.sumInsured);
  //     }
  //   });

  //   // Critical fields mapping (formControlName : risk property)
  //   const criticalFields: Record<string, string> = {
  //     coverFrom: 'withEffectFrom',
  //     coverTo: 'withEffectTo',
  //     chasisNumber: 'chassisNumber',
  //     vehicleMake: 'make',
  //     vehicleModel: 'model',
  //     seatingCapacity: 'carryingCapacity',
  //     subclass: 'subclassCode',
  //     insureds: 'insuredName'
  //   };

  //   // Patch critical fields
  //   Object.keys(criticalFields).forEach(formControl => {
  //     const riskKey = criticalFields[formControl];
  //     if (this.selectedRisk[riskKey] !== undefined && this.riskDetailsForm.contains(formControl)) {
  //       if (formControl === 'coverFrom' || formControl === 'coverTo') {
  //         this.riskDetailsForm.get(formControl)?.setValue(parseDate(this.selectedRisk[riskKey]));
  //       } else {
  //         this.riskDetailsForm.get(formControl)?.setValue(this.selectedRisk[riskKey]);
  //       }
  //     }
  //   });

  //   // Recursive flattening for remaining fields
  //   const flatten = (obj: any) => {
  //     Object.keys(obj).forEach(key => {
  //       const value = obj[key];

  //       // Skip keys already explicitly mapped or critical
  //       const excludedKeys = [
  //         'coverType', 'binderCode', 'propertyId', 'itemDesc', 'value',
  //         'withEffectFrom', 'withEffectTo', 'chassisNumber',
  //         'make', 'model', 'carryingCapacity', 'subclassCode', 'insuredName'
  //       ];
  //       if (excludedKeys.includes(key)) return;

  //       if (value && typeof value === 'object') {
  //         if (Array.isArray(value) && value.length > 0) {
  //           flatten(value[0]);
  //         } else {
  //           flatten(value);
  //         }
  //       } else {
  //         if (this.riskDetailsForm.contains(key)) {
  //           this.riskDetailsForm.get(key)?.setValue(value);
  //         }
  //       }
  //     });
  //   };

  //   // Perform recursive patching
  //   flatten(this.selectedRisk);

  //   log.debug('Patched form with selectedRisk:', this.riskDetailsForm.value);
  // }
  // private patchEditValues(): void {
  //   log.debug('SelectedRisk:', this.selectedRisk);

  //   if (!this.selectedRisk) return;

  //   const parseDate = (value: any): Date | null => {
  //     if (!value) return null;

  //     // Already a Date
  //     if (value instanceof Date) return value;

  //     // ISO, or YYYY-MM-DD
  //     if (typeof value === 'string' && value.includes('-')) {
  //       return new Date(value);
  //     }

  //     // DD/MM/YYYY handling
  //     if (typeof value === 'string' && value.includes('/')) {
  //       const parts = value.split('/');
  //       if (parts.length !== 3) return null;
  //       const [day, month, year] = parts;
  //       return new Date(+year, +month - 1, +day);
  //     }

  //     return null;
  //   };

  //   // Convert dropdown values to number
  //   const toNumberSafe = (val: any) => {
  //     if (val === null || val === undefined || val === '') return null;
  //     return Number(val);
  //   };

  //   // Helper: convert to number + patch
  //   const patchSelectValue = (formControlName: string, selectedValue: any) => {
  //     if (!this.riskDetailsForm.contains(formControlName)) return;
  //     const ctrl = this.riskDetailsForm.get(formControlName);
  //     ctrl?.setValue(toNumberSafe(selectedValue));
  //   };

  //   // ----- Explicit mappings -----
  //   const explicitFields: Record<string, string> = {
  //     coverType: 'coverTypeCode',
  //     premiumBand: 'binderCode',
  //     registrationNumber: 'propertyId',
  //     riskDescription: 'itemDesc',
  //     riskId: 'propertyId'
  //   };

  //   Object.keys(explicitFields).forEach(formControl => {
  //     const riskKey = explicitFields[formControl];
  //     if (this.selectedRisk[riskKey] !== undefined && this.riskDetailsForm.contains(formControl)) {
  //       this.riskDetailsForm.get(formControl)?.setValue(this.selectedRisk[riskKey]);
  //     }
  //   });

  //   // ----- Value fields -----
  //   ['value', 'sumInsured'].forEach(ctrl => {
  //     if (this.riskDetailsForm.contains(ctrl)) {
  //       this.riskDetailsForm.get(ctrl)?.setValue(this.selectedRisk.sumInsured);
  //     }
  //   });

  //   // ----- Critical fields -----
  //   const criticalFields: Record<string, string> = {
  //     coverFrom: 'withEffectFrom',
  //     coverTo: 'withEffectTo',
  //     chasisNumber: 'chassisNumber',
  //     vehicleMake: 'make',
  //     vehicleModel: 'model',
  //     seatingCapacity: 'carryingCapacity',
  //     color: 'color',
  //     subclass: 'subclassCode',
  //     insureds: 'insuredName'
  //   };

  //   Object.keys(criticalFields).forEach(formControl => {
  //     const riskKey = criticalFields[formControl];

  //     if (this.selectedRisk[riskKey] !== undefined && this.riskDetailsForm.contains(formControl)) {
  //       const value = this.selectedRisk[riskKey];

  //       if (formControl === 'coverFrom' || formControl === 'coverTo') {
  //         this.riskDetailsForm.get(formControl)?.setValue(parseDate(value));
  //       }

  //       else if (['vehicleMake', 'vehicleModel', 'color', 'subclass'].includes(formControl)) {
  //         patchSelectValue(formControl, value);
  //       }

  //       // Simple values
  //       else {
  //         this.riskDetailsForm.get(formControl)?.setValue(value);
  //       }
  //     }
  //   });

  //   // ----- Recursive patcher -----
  //   const flatten = (obj: any) => {
  //     Object.keys(obj).forEach(key => {
  //       const value = obj[key];

  //       const excluded = [
  //         'coverType', 'binderCode', 'propertyId', 'itemDesc', 'sumInsured',
  //         'withEffectFrom', 'withEffectTo', 'chassisNumber', 'make', 'model',
  //         'carryingCapacity', 'color', 'subclassCode', 'insuredName'
  //       ];
  //       if (excluded.includes(key)) return;

  //       if (value && typeof value === 'object') {
  //         if (Array.isArray(value) && value.length > 0) flatten(value[0]);
  //         else flatten(value);
  //       } else {
  //         if (this.riskDetailsForm.contains(key)) {
  //           this.riskDetailsForm.get(key)?.setValue(value);
  //         }
  //       }
  //     });
  //   };

  //   flatten(this.selectedRisk);

  //   log.debug('Patched form:', this.riskDetailsForm.value);
  // }

  private patchEditValues(): void {
    log.debug('SelectedRisk:', this.selectedRisk);
    if (!this.selectedRisk) return;

    // ----- Helper functions -----

    // Parse dates from string or Date object
    const parseDate = (value: any): Date | null => {
      if (!value) return null;
      if (value instanceof Date) return value;
      if (typeof value === 'string' && value.includes('-')) return new Date(value); // ISO or YYYY-MM-DD
      if (typeof value === 'string' && value.includes('/')) { // DD/MM/YYYY
        const parts = value.split('/');
        if (parts.length !== 3) return null;
        const [day, month, year] = parts;
        return new Date(+year, +month - 1, +day);
      }
      return null;
    };

    // Safe number conversion
    const toNumberSafe = (val: any) => {
      if (val === null || val === undefined || val === '') return null;
      return Number(val);
    };

    // Patch numeric dropdown
    const patchSelectValue = (formControlName: string, selectedValue: any) => {
      if (!this.riskDetailsForm.contains(formControlName)) return;
      this.riskDetailsForm.get(formControlName)?.setValue(toNumberSafe(selectedValue));
    };

    // ----- Explicit field mappings -----
    const explicitFields: Record<string, string> = {
      coverType: 'coverTypeCode',
      premiumBand: 'binderCode',
      registrationNumber: 'propertyId',
      riskDescription: 'itemDesc',
      riskId: 'propertyId'
    };

    Object.keys(explicitFields).forEach(formControl => {
      const riskKey = explicitFields[formControl];
      if (this.selectedRisk[riskKey] !== undefined && this.riskDetailsForm.contains(formControl)) {
        this.riskDetailsForm.get(formControl)?.setValue(this.selectedRisk[riskKey]);
      }
    });

    // ----- Value fields -----
    ['value', 'sumInsured'].forEach(ctrl => {
      if (this.riskDetailsForm.contains(ctrl)) {
        this.riskDetailsForm.get(ctrl)?.setValue(this.selectedRisk.sumInsured);
      }
    });

    // ----- Critical fields -----
    const criticalFields: Record<string, string> = {
      coverFrom: 'withEffectFrom',
      coverTo: 'withEffectTo',
      chasisNumber: 'chassisNumber',
      vehicleMake: 'make',
      vehicleModel: 'model',
      seatingCapacity: 'carryingCapacity',
      color: 'color',
      subclass: 'subclassCode',
      insureds: 'insuredName'
    };

    const numericDropdowns = ['subclass'];  // values that must be numeric
    const stringDropdowns = ['color'];      // values that are string only

    Object.keys(criticalFields).forEach(formControl => {
      const riskKey = criticalFields[formControl];
      if (!this.riskDetailsForm.contains(formControl)) return;
      let value = this.selectedRisk[riskKey];
      if (value === undefined || value === null) return;

      // Date fields
      if (['coverFrom', 'coverTo'].includes(formControl)) {
        this.riskDetailsForm.get(formControl)?.setValue(parseDate(value));
      }
      // Numeric dropdowns
      else if (numericDropdowns.includes(formControl)) {
        patchSelectValue(formControl, value);
      }
      // Vehicle fields that can be string (name) or numeric (code)
      else if (['vehicleMake', 'vehicleModel'].includes(formControl)) {
        let patchValue: string | number = value;
        log.debug('Patch value for vehicle make and model', patchValue)
        // Determine options list
        let options = formControl === 'vehicleMake' ? this.vehicleMakeList : this.vehicleModelDetails;
        log.debug("VEHICLE MAKE", this.vehicleMakeList)
        log.debug("VEHICLE model", this.vehicleModelDetails)
        // Cast options to a definite array of objects with name/code
        const optionsArray = options as { name: string; code: number }[];
        log.debug('Options array', optionsArray)

        if (Array.isArray(optionsArray)) {
          if (typeof value === 'string') {
            log.debug('patch value was string')

            const match = optionsArray.find(opt => opt.name.toLowerCase() === value.toLowerCase());
            if (match) {
              patchValue = match.code;
              log.debug('patch value was string', match)
            } else {
              patchValue = Number(value);
              log.debug('patch value has been  turned to number', patchValue)

            }

          } else if (!isNaN(Number(value))) {
            log.debug('patch value was number')
            patchValue = Number(value);
          }
        } else {
          patchValue = Number(value);
        }

        this.riskDetailsForm.get(formControl)?.setValue(patchValue);
      }

      // String dropdowns
      else if ((['color'].includes(formControl))) {
        let patchColorValue = value;
        patchColorValue = Number(patchColorValue);
        this.riskDetailsForm.get(formControl)?.setValue(patchColorValue);
      }
      // Other simple fields
      else {
        this.riskDetailsForm.get(formControl)?.setValue(value);
      }
    });

    // ----- Recursive patcher for nested objects -----
    const flatten = (obj: any) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const excluded = [
          'coverType', 'binderCode', 'propertyId', 'itemDesc', 'sumInsured',
          'withEffectFrom', 'withEffectTo', 'chassisNumber', 'make', 'model',
          'carryingCapacity', 'color', 'subclassCode', 'insuredName'
        ];
        if (excluded.includes(key)) return;

        if (value && typeof value === 'object') {
          if (Array.isArray(value) && value.length > 0) flatten(value[0]);
          else flatten(value);
        } else {
          if (this.riskDetailsForm.contains(key)) {
            this.riskDetailsForm.get(key)?.setValue(value);
          }
        }
      });
    };

    flatten(this.selectedRisk);

    log.debug('Patched form:', this.riskDetailsForm.value);
  }

  saveRiskDetail(selectedValidRisks: any) {
    log.debug("Selcted valid risk", selectedValidRisks)
    // Validate quotation code exists
    if (!this.quotationCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Quotation code is required.');
      log.error('Cannot save risk details: quotationCode is missing');
      return;
    }
    log.debug('selected risks', this.selectedValid)
    log.debug('Saving risk details for quotation code:', this.quotationCode);
    const validatedRiskIds = selectedValidRisks.map(risk => risk.id);
    log.debug('validated risk ids risks', validatedRiskIds)

    this.quotationService.saveRiskDetails(this.quotationCode, this.loggedInUser, validatedRiskIds).subscribe({
      next: (response) => {
        log.debug('Risk details saved successfully:', response);
        this.globalMessagingService.displaySuccessMessage('Success', 'Risk details saved successfully!');
        if (response) {
          this.onSaveCompleted.emit();
        }
        this.fetchUploadedRisks();
      },
      error: (err) => {
        log.error('Failed to save risk details:', err);
        const errorMessage = err.error?.message || 'Failed to save risk details. Please try again.';
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    })
  }

  deleteRisks(selectedRows: any[], type: 'single' | 'bulk') {
    if (!selectedRows || !selectedRows.length) {
      this.globalMessagingService.displayErrorMessage('Error', 'No risks selected to delete.');
      if (type === 'single') this.isSingleDeleting = false;
      else this.isBulkDeleting = false;
      return;
    }

    const ids = selectedRows.map(r => r.id);
    let completedCount = 0;

    ids.forEach(id => {
      this.quotationService.deleteRiskRecord(id).subscribe({
        next: res => {
          completedCount++;
          if (completedCount === ids.length) {
            this.selectedAll = [];
            this.selectedValid = [];
            this.selectedReview = [];
            this.fetchUploadedRisks();

            if (type === 'single') this.isSingleDeleting = false;
            else this.isBulkDeleting = false;

            this.globalMessagingService.displaySuccessMessage(
              'Success',
              `Record with Id ${id} deleted successfully.`
            );
          }
        },
        error: err => {
          completedCount++;
          this.globalMessagingService.displayErrorMessage(
            'Error',
            `Failed to delete record ${id}. ${err.error?.message || 'Please try again.'}`
          );

          if (completedCount === ids.length) {
            this.fetchUploadedRisks();

            if (type === 'single') this.isSingleDeleting = false;
            else this.isBulkDeleting = false;
          }
        }
      });
    });
  }

  deleteSingleRisk(row: any) {
    if (this.isSingleDeleting) return;
    this.isSingleDeleting = true;

    this.deleteRisks([row], 'single');
  }

  deleteSelectedRisks() {
    const selected = this.activeTab === 'ALL' ? this.selectedAll :
      this.activeTab === 'VALID' ? this.selectedValid : this.selectedReview;

    if (!selected || selected.length === 0) return;
    if (this.isBulkDeleting) return;

    this.isBulkDeleting = true;

    this.deleteRisks(selected, 'bulk');
  }


  saveEditedRisk() {
    if (this.riskDetailsForm.invalid) {
      Object.keys(this.riskDetailsForm.controls).forEach(field => {
        const control = this.riskDetailsForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      for (let controlsKey in this.riskDetailsForm.controls) {
        if (this.riskDetailsForm.get(controlsKey).invalid) {
          log.debug(
            `${controlsKey} is invalid`,
            this.riskDetailsForm.get(controlsKey).errors
          );
        }
      }
      return;
    }
    // if valid
    const modal = bootstrap.Modal.getInstance(this.addRiskModalRef.nativeElement);
    modal.hide();
    log.debug("Risk details data-update", this.riskDetailsForm.value)
    const updateFormData = this.riskDetailsForm.value
    const selectedRiskData = this.selectedRisk
    const insuredName = `${updateFormData?.insureds?.firstName || ''} ${updateFormData?.insureds?.lastName || ''}`.trim();
    const payload = {
      ...selectedRiskData,
      insuredName: insuredName,
      registrationNumber: updateFormData.registrationNumber,
      propertyId: updateFormData.registrationNumber,
      make: updateFormData.vehicleMake || updateFormData.make,
      model: updateFormData.vehicleModel || updateFormData.model,
      riskDescription: updateFormData.riskDescription,
      withEffectFrom: this.formatDateToYMD(updateFormData.coverFrom),
      withEffectTo: this.formatDateToYMD(updateFormData.coverTo),
      sumInsured: updateFormData.value,
      yearOfManufacture: updateFormData.yearOfManufacture,
      cubicCapacity: updateFormData.cubicCapacity,
      carryingCapacity: updateFormData.seatingCapacity,
      bodyType: updateFormData.bodyType,
      color: updateFormData.color,
      chassisNumber: updateFormData.chasisNumber,
      engineNumber: updateFormData.engineNumber,
      binderCode: updateFormData.premiumBand,
      coverTypeCode: updateFormData.coverType,
      subclassCode: updateFormData.subclass
    };

    log.debug('Payload to send to update risk endpoint:', payload)
    payload && this, this.updateSelectedRisk(payload)
  }
  private formatDateToYMD(date: any): string | null {
    if (!date) return null;

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  updateSelectedRisk(data: any) {
    log.debug('Policy Payload being sent:', data);
    const id = data.id
    this.quotationService.updatedImportedRisk(id, data).subscribe({
      next: (data) => {
        this.policyData = data;
        log.debug('Risk data updated successfully:', data);
        data && this.validateImportedRisk()
        this.successMessage = 'Risk data updated successfully!';
        this.globalMessagingService.displaySuccessMessage('Success', 'Risk data updated successfully!');
      },
      error: (err) => {
        console.error('Failed to load policy data', err);
        this.errorMessage = 'Failed to update risk Data . Please try again.';
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to update risk Data');
      }
    });
  }

}

