import { Component, Input } from '@angular/core';
import { TableDetail } from 'src/app/shared/data/table-detail';
// import { QuotationForms } from '../../config/quotations.forms';
import { Logger } from 'src/app/shared/services';
import { StepperService } from 'src/app/shared/services/stepper/stepper.service';

const logger = new Logger("QuotationComponent")
@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.css']
})
export class QuotationListComponent {
  fieldsets: any[];
  buttonConfig: any;
  stepsData: any[];

  cols = [
    { field: 'policyNumber', header: 'Policy Number' },
    { field: 'type', header: 'Type' },
    { field: 'insured', header: 'Insured' },
    { field: 'status', header: 'Status' },
    { field: 'premium', header: 'Premium' },
  ];

  rows = [
    { policyNumber: 'TA823151', type: 'Motor', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
    { policyNumber: 'TA823152', type: 'Travel', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
    { policyNumber: 'TA823159', type: 'Marine', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
    { policyNumber: 'TA823158', type: 'Motor', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
    { policyNumber: 'TA823150', type: 'Motor', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
  ];

  globalFilterFields = ['policyNumber', 'type', 'insured', 'status', 'premium'];


  policyDataTable: TableDetail = {
    cols: this.cols,
    rows: this.rows,
    globalFilterFields: this.globalFilterFields,
    showFilter: false,
    showSorting: false,
    title: 'A list of policies transacted',
    paginator: true,
    url: 'entities',
    urlIdentifier: 'policyNumber'
  }


  // constructor(private quotationsForm:QuotationForms, stepService:StepperService){
  //   this.fieldsets = quotationsForm.quotationForm()
  //   this.buttonConfig = quotationsForm.actionButtonConfig()
  //   this.stepsData = stepService.getQuotationSteps();
  // }

  submitForm(data:any){
    logger.info(data)
  }
  goBack(data?:any){
    if(data!=null){

    }
    logger.info("GO BACK")
  }




}
