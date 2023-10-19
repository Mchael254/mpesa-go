import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedQuotationsService {

  constructor() { }

  formData: any;
  quotationDetails:any;
  quotationCode:any;

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

  setQuotationDetails(data){
    this.quotationCode = data;
    // console.log(this.quotationCode,'Kelvine quotation Code')
  }

  getQuotationDetails(){
    return this.quotationCode;

  }


}
