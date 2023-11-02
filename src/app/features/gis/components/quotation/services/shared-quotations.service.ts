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

  getQuotationNumber(){
    return this.quotationNum;
  }

}
