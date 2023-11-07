import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedQuotationsService {

  constructor() { }

  formData: any;
  quotationDetails:any;
  quotationCode:any;
  quotationNum:any;
  quickQuotationCode:any;
  quickSectionList:any;
  sumInsuredValue:any;

  setFormData(data: any) {
    this.formData = data;
  }

  getFormData() {
    return this.formData;
  }

  setQuotationFormDetails(data){
    this.quotationDetails = data;
  }

  getQuotationFormDetails(){
    return this.quotationDetails;
  }

  setQuotationDetails(quotationNo,quotationCode){
    this.quotationCode = quotationCode;
    this.quotationNum = quotationNo
    
  }

  getQuotationCode(){
    return this.quotationCode;
  }
  setQuickQuotationDetails(data){
    this.quickQuotationCode = data;
    // console.log(this.quotationCode,'Kelvine quotation Code')
  }

  getQuickQuotationDetails(){
    return this.quickQuotationCode;
  }
  setQuickSectionDetails(data){
    this.quickSectionList = data;
    // console.log(this.quotationCode,'Kelvine quotation Code')
  }

  getQuickSectionDetails(){
    return this.quickSectionList;
  }
  setSumInsured(data){
    this.sumInsuredValue = data;
    // console.log(this.quotationCode,'Kelvine quotation Code')
  }

  getSumInsured(){
    return this.sumInsuredValue;
  }

  getQuotationNumber(){
    return this.quotationNum;
  }

}
