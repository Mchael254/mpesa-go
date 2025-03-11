import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { SubclassesDTO } from '../../../setups/data/gisDTO';
import { Router } from '@angular/router';
import { Logger } from '../../../../../../shared/services';
import * as XLSX from 'xlsx';
import { FormGroup, FormBuilder } from '@angular/forms';

const log = new Logger('ImportRiskComponent');

@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {
  steps = quoteStepsData;
  subclassList: any;
  quotationNum: any;
  quotationDetails: any;
  columns: any;
  data: any = [];
  selectedRisks: any[] = [];
  importForm: FormGroup;

  constructor(
    public subclassService: SubclassesService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.importForm = this.fb.group({
      subclass: [''],
      uploadFile: ['']
    });
  }

  ngOnInit(): void {
    this.getSubclass();
    this.quotationNum = sessionStorage.getItem('quotationNum');
    this.quotationDetails = JSON.parse(sessionStorage.getItem('quotationFormDetails') || '{}');
    log.debug("Product code:", this.quotationDetails?.productCode);
  }

  getSubclass() {
    this.subclassService.getAllSubclasses().subscribe(data => {
      this.subclassList = data;
    });
  }

  finish() {
    if (this.selectedRisks.length === 0) {
      this.router.navigate(['/home/gis/quotation/risk-section-details']);
      return;
    }

    // Store selected risks in session storage to use in other components
    sessionStorage.setItem('selectedRisks', JSON.stringify(this.selectedRisks));
    log.debug('Selected risks stored:', this.selectedRisks);

    this.router.navigate(['/home/gis/quotation/risk-section-details']);
  }

  exportTemplate(): void {
    const data = [{
      BinderCode: '',
      PremiumBind: '',
      CoverTypeCode: '',
      CoverTypeShortDesc: '',
      WEF: '',
      WET: '',
      ClientCode: '',
      ClientName: '',
      IsNCDapplicable: '',
      ItemDesc: '',
      Location: '',
      NCDlevel: '',
      ProductCode: '',
      PropertyId: '',
      RiskPremAmount: '',
      SubclassCode: '',
      Town: '',
    }];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'template.xls');
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileData = e.target.result;
        const workbook = XLSX.read(fileData, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.data = this.parseData(parsedData);

        // Reset selections when new data is loaded
        this.selectedRisks = [];

        console.log('Imported data:', this.data);
      };
      reader.readAsBinaryString(file);
    }
  }

  private parseData(parsedData: any): any[] {
    const columns = parsedData[0];
    const rows = parsedData.slice(1);
    return rows.map(row => {
      const rowData: any = {};
      columns.forEach((column, index) => {
        rowData[column] = row[index];
      });
      return rowData;
    });
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

  // getQuotationRiskPayload(): any[] {
  //   let defaultCode

  //   const selectedRisk = this.selectedRisks;
  //   // log.debug("Sum Insured>>>>", this.sumInsuredValue)
  //   log.debug("Selected Risk", selectedRisk)
  //   const coverTypeSections = this.riskLevelPremiums
  //     .filter(value => value.coverTypeDetails.coverTypeCode === this.selectedCoverType)
  //     .map(section => section.limitPremiumDtos).flat()
  //   let risk = {
  //     coverTypeCode: this.selectedCoverType,
  //     action: this.quoteAction ? this.quoteAction : "A",
  //     //quotationCode: defaultCode,
  //     code: existingRisk && this.quoteAction === "E" ? existingRisk.code : null,
  //     productCode: this.premiumPayload?.product.code,
  //     propertyId: selectedRisk?.propertyId || selectedRisk?.itemDescription,
  //     value: this.sumInsuredValue,
  //     coverTypeShortDescription: selectedRisk?.subclassCoverTypeDto?.coverTypeShortDescription,
  //     premium: coverTypeSections.reduce((sum, section) => sum + section.premium, 0),
  //     subclassCode: selectedRisk?.subclassSection.code,
  //     itemDesc: selectedRisk?.itemDescription,
  //     binderCode: selectedRisk?.binderDto?.code,
  //     wef: selectedRisk?.withEffectFrom,
  //     wet: selectedRisk?.withEffectTo,
  //     prpCode: this.passedClientCode,
  //     quotationProductCode: existingRisk && this.quoteAction === "E" ? existingRisk?.quotationProductCode : null,
  //     coverTypeDescription: selectedRisk?.subclassCoverTypeDto?.coverTypeDescription,
  //     taxComputation: selectedRiskPremiumResponse.taxComputation.map(tax => ({
  //       code: tax.code,
  //       premium: tax.premium
  //     }))
  //   }
  //   return [risk]
  // }
}
