import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { SubclassesDTO } from '../../../setups/data/gisDTO';
import { Router } from '@angular/router';
import { Logger } from '../../../../../../shared/services';
import * as XLSX from 'xlsx';

const log = new Logger('ImportRiskComponent');
@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {
  steps = quoteStepsData;
  subclassList:any
  quotationNum:any
  quotationDetails:any
  columns: any ;
  data: any;
  constructor(
    public subclassService:SubclassesService,
    public router:Router
  ){}

  ngOnInit(): void {
    this.getSubclass()
    this.quotationNum = sessionStorage.getItem('quotationNum');
    this.quotationDetails = sessionStorage.getItem('quotationFormDetails')
    log.debug(this.quotationDetails.productCode)
  }

  getSubclass(){
    this.subclassService.getAllSubclasses().subscribe(data=>{
      this.subclassList = data
    })
  }

  finish(){
    this.router.navigate(['/home/gis/quotation/risk-section-details'])
  }
  exportTemplate(): void {
    const data = [{
       BinderCode: '', 
       PremiumBind: '', 
       CoverTypeCode:'',
       CoverTypeShortDesc:'',
       WEF:'',
       WET:'',
       ClientCode:'',
       ClientName:'',
       IsNCDapplicable:'',
       ItemDesc:'',
       Location:'',
       NCDlevel:'',
       ProductCode:'',
       PropertyId:'',
       RiskPremAmount:'',
       SubclassCode:'',
       Town:'',

      
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
        console.log(this.data)
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
  
}
