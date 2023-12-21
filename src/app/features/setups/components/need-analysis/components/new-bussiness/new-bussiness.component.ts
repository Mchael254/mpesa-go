import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';

@Component({
  selector: 'app-new-bussiness',
  templateUrl: './new-bussiness.component.html',
  styleUrls: ['./new-bussiness.component.css']
})
export class NewBussinessComponent implements OnInit{

  needAnalysisForm: FormGroup;
  questionForm: FormGroup;

  isResponse = false;
  isProduct = false;
  productList: any[] = [];
  savedProductList: any[] = [];
  savedResponseList: any[] = [];
  isEditable: boolean = false;
  constructor(private fb: FormBuilder, private product_service:ProductService){}
  ngOnInit(): void {
    this.isProduct = true;
    this.isResponse = true;

    this.product_service.getListOfProduct().subscribe(data =>{
      console.log(data);
      
      this.productList = data
    })
    this.needAnalysisForm = this.fb.group({
      question:[],
      option:[],
      products:[]      
    })
    this.questionForm = this.fb.group({
      question:['What are your primary reasons for considering life insurance at this time?']     
    })
  }



  setProduct(){
    this.addModal();
    this.isResponse = false;
  }
  setResponse(){
    this.addModal();
    this.isProduct = false
  }

  addData(){
    if(this.isProduct){
      this.addProduct();
      return
    }
    this.addResponse()
  }

  addProduct(){
    let product = this.productList.find(data => { return data['code'] === StringManipulation.returnNullIfEmpty(this.needAnalysisForm.get('products').value)});
    product = product === undefined ? null : product;
    this.savedProductList.push(product);
    this.needAnalysisForm.reset();
    this.closeModal('exampleModal');
    
  }
  deleteProduct(i){    
    this.savedProductList = this.savedProductList.filter(data => {      
      return data['code'] !== i['code']}
      );
      if(this.savedProductList.length === 0){this.isResponse = true}
  }

  addResponse(){
    let res = {}
    res['question'] = this.needAnalysisForm.get('question').value;
    res['option'] = this.needAnalysisForm.get('option').value;
    res['code'] = crypto.randomUUID();
    console.log(res);
    this.savedResponseList.push(res);
    this.needAnalysisForm.reset();
    this.closeModal('exampleModal');    

  }
  deletResponse(i){
    this.savedResponseList = this.savedResponseList.filter(data => {      
      return data['code'] !== i['code']}
      )
      if(this.savedResponseList.length === 0){this.isProduct = true}
  }

  editQuestionForm(){
    
    this.isEditable = true
  }

  saveQuestionForm(){
    
    this.isEditable = false

  }

  validateNeedForm(){
    return (this.needAnalysisForm.get('question').value?.length >0 && this.needAnalysisForm.get('option').value?.length >0) || this.needAnalysisForm.get('products').value?.length >0
  }

  addModal(name='exampleModal'){
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeModal(name='exampleModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

}
