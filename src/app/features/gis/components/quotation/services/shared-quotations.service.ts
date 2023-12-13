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
  coverquotationNo:any;

  quotationDetailsRisk:any;
  clientDetails:any;

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
  }

  getQuickQuotationDetails(){
    return this.quickQuotationCode;
  }
  setQuickSectionDetails(data){
    this.quickSectionList = data;
  }

  getQuickSectionDetails(){
    return this.quickSectionList;
  }
  setSumInsured(data){
    this.sumInsuredValue = data;
  }

  getSumInsured(){
    return this.sumInsuredValue;
  }

  getQuotationNumber(){
    return this.quotationNum;
  }
  setSelectedCover(data){
    this.coverquotationNo = data;
  }

  getSelectedCover(){
    return this.coverquotationNo;
  }
  setAddAnotherRisk(riskQuoationDetails,clientDetails){
    this.quotationDetailsRisk=riskQuoationDetails;
    this.clientDetails=clientDetails
  }
  getAddAnotherRisk() {
    if (this.quotationDetailsRisk == null && this.clientDetails == null) {
        return { quotationDetailsRisk: null, clientDetails: null };
    }

    return { quotationDetailsRisk: this.quotationDetailsRisk, clientDetails: this.clientDetails };
}


}
