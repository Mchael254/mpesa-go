import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { NeedAnalysisService } from 'src/app/features/setups/service/need-analysis/need-analysis.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-bussiness',
  templateUrl: './new-bussiness.component.html',
  styleUrls: ['./new-bussiness.component.css'],
})
export class NewBussinessComponent implements OnInit {
  needAnalysisForm: FormGroup;
  optionForm: FormGroup
  questionForm: FormGroup;

  isResponse = false;
  isProduct = false;
  productList: any[] = [];
  savedProductList: any[] = [];
  savedResponseList: any[] = [];
  isEditable: boolean = false;

  mainNeedAnalysisQuestions: any;
  tempNeedAnalysisQuestions: any;
  nodeState: number[] = [];
  presentQuestion: {} = {};
  mainQuestion: any;

  constructor(
    private fb: FormBuilder,
    private product_service: ProductService,
    private need_analysis_service: NeedAnalysisService,
    private session_storage_service: SessionStorageService,
    private toast_service: ToastService
  ) {}
  ngOnInit(): void {
    this.isProduct = true;
    this.isResponse = true;
    this.product_service.getListOfProduct().subscribe((data) => {
      this.productList = data;
    });
    this.needAnalysisForm = this.fb.group({
      question: [],
      option: [],
      products: [],
    });
    this.optionForm = this.fb.group({
      option: ['', Validators.required],
      old_option: ['', Validators.required],
      position: []

    })
    this.questionForm = this.fb.group({
      question: [],
    });
    this.fetchNeedAnalysisData();
  }

  fetchNeedAnalysisData() {
    let TENANT_ID = StringManipulation.returnNullIfEmpty(this.session_storage_service.get(SESSION_KEY.API_TENANT_ID))?.toUpperCase(); //environment?.TENANT_ID?.toUpperCase();
    let NEED_ANALYSIS_PROCESS_TYPE = this.session_storage_service.get(
      SESSION_KEY.NEED_ANALYSIS_PROCESS_TYPE
    );
    let NEED_ANALYSIS_SYSTEM_NAME = this.session_storage_service.get(
      SESSION_KEY.NEED_ANALYSIS_SYSTEM_NAME
    );

    this.need_analysis_service
      .getNeedAnalysisBySystemNameAndProcessTypeAndTenantID(
        TENANT_ID,
        NEED_ANALYSIS_PROCESS_TYPE,
        NEED_ANALYSIS_SYSTEM_NAME
      )
      .subscribe((data) => {
        this.mainNeedAnalysisQuestions = data['data'];
        this.tempNeedAnalysisQuestions = data['data'];
        this.mainQuestion = this.tempNeedAnalysisQuestions['question'];
        this.questionForm
          .get('question')
          .patchValue(this.tempNeedAnalysisQuestions['question']['question']);
        this.savedResponseList =
          this.tempNeedAnalysisQuestions['question']['options'] || [];
        this.savedProductList =
          this.tempNeedAnalysisQuestions['products'] || [];
        this.presentQuestion = this.tempNeedAnalysisQuestions['question'];
      });
  }

  private saveRecentNeedAnalysisData(data: any) {
    this.questionForm.get('question').patchValue(data['question'] || '');
    this.savedResponseList = data['options'] || [];
    this.savedProductList = data['products'] || [];
    return data;
  }

  selectResponse(index: number) {
    this.nodeState.push(index);
    this.selectQuestion(this.nodeState);
  }

  removeResponse() {
    if (this.nodeState.length > 0) {
      this.nodeState.pop();
      if (this.nodeState.length === 0) {
        this.ngOnInit();
      }
      this.selectQuestion(this.nodeState);
    } else {
      console.error('This is the First Question!!');
    }
  }

  

  setProduct() {
    this.addModal();
    this.isResponse = false;
  }
  setResponse() {
    this.addModal();
    this.isProduct = false;
    this.isResponse = true;
  }

  addData() {
    if (this.isProduct) {
      this.addProduct();
      return;
    }
    this.addResponse();
  }

  addProduct() {
    let product = this.productList.find((data) => {
      return (
        data['code'] ===
        StringManipulation.returnNullIfEmpty(
          this.needAnalysisForm.get('products').value
        )
      );
    });
    product = product === undefined ? null : product;

    if (product) {
      let node = this.addProductTreeStructure(
        this.nodeState,
        product['code'],
        this.mainQuestion
      );
      this.tempNeedAnalysisQuestions['question'] = node;
      this.need_analysis_service
        .updateNeedAnalysisData(this.tempNeedAnalysisQuestions)
        .subscribe((data) => {
          console.log(data);
          
          this.toast_service.success(
            'Save Product Record Successfully!!',
            'Successfull'
          );
          this.selectQuestion(this.nodeState);
        });
    }

    this.needAnalysisForm.reset();

    this.closeModal('exampleModal');
  }
  deleteProduct(i) {
    this.selectQuestion(this.nodeState);

    let node = this.deleteProductTreeStructure(
      this.nodeState,
      i,
      this.mainQuestion
    );
    this.tempNeedAnalysisQuestions['question'] = node;
    this.need_analysis_service
      .updateNeedAnalysisData(this.tempNeedAnalysisQuestions)
      .subscribe((data) => {
        this.toast_service.success(
          'Delete Product Successfully!!',
          'Successfull'
        );
        this.selectQuestion(this.nodeState);

      });


    // if (this.savedProductList.length === 0) {
    //   this.isResponse = true;
    // }
  }

  addResponse() {
    this.selectQuestion(this.nodeState);
    let res = {};
    res['question'] = this.needAnalysisForm.get('question').value;
    res['option'] = this.needAnalysisForm.get('option').value;
    let node = this.addOptionTreeStructure(
      this.nodeState.length === 0 ? null : this.nodeState,
      res,
      this.mainQuestion
    );

    // this.selectQuestion(this.nodeState);

    this.tempNeedAnalysisQuestions['question'] = node;
    this.need_analysis_service
      .updateNeedAnalysisData(this.tempNeedAnalysisQuestions)
      .subscribe((data) => {
        this.toast_service.success(
          'Successfully Save Option Data!!',
          'Sucessfull'
        );
        this.selectQuestion(this.nodeState);
      });

    // this.savedResponseList.push(res);
    this.needAnalysisForm.reset();
    this.closeModal('exampleModal');
  }


  addOptionTreeStructure(
    nodeState: number[] | null,
    updateData: any,
    node: any
  ): any {
    if (nodeState === null) {
      if (!node.options) {
        node.options = [];
      }
      node.options.push(updateData);
    } 

    else if (node.options !== null && node.options !== undefined) {
      const index = nodeState[0];
      if (nodeState.length === 1) {
        if (!node.options[index].options) {
          node.options[index].options = [];
        }

        const productsArray = node.options[index].options.filter(m =>  m['option']?.toUpperCase() === updateData['option']?.toUpperCase() );

        if (productsArray.length===0) {
          node.options[index].options.push(updateData);            
        } else {
          this.toast_service.danger(
            'Option already in the List',
            'DUPLICATE PRODUCT'
          );
          throw Error('Duplicate Option')
        }

        return node;
      } else {
        this.addOptionTreeStructure(
          nodeState.slice(1),
          updateData,
          node.options[index]
        );
      }
    }
    return node;
  }

  deleteOptionTreeStructure(
    nodeState: number[] | null,
    updateData: any,
    node: any
  ): any {
    if (nodeState === null) {
      node.options.splice(node.options.indexOf(updateData),1);
      return node;

    } else if (node.options !== null && node.options !== undefined) {
      for (let index = 0; index < nodeState.length; index++) {

        if (nodeState.length === 1) {          
          node.options[nodeState[0]].options.splice(node.options[nodeState[0]].options.indexOf(updateData), 1)
          return node;
        } else {
          this.deleteOptionTreeStructure(
            nodeState.splice(1),
            updateData,
            node.options[nodeState[0]]
          );
        }
      }
    }
    return node;
  }
  editOptionTreeStructure(
    nodeState: number[] | null,
    updateData: any,
    node: any
  ): any {
    if (nodeState === null) {

      const optionsArray = node.options.filter(no =>{ return no['option'] === updateData['updated_option']; })
          if (optionsArray.length>0) {
            this.toast_service.danger(
              'Option already in the List',
              'DUPLICATE OPTION'
            );
            throw Error('Duplicate Option')
          }

      node.options = node.options.map(no =>{
        if(no['option']===updateData['old_option']){
          no['option'] =updateData['updated_option'];
        }
        return no
      })
      return node;

    } else if (node.options !== null && node.options !== undefined) {
      for (let index = 0; index < nodeState.length; index++) {
        if (nodeState.length === 1) {

          const optionsArray = node.options[nodeState[0]].options.filter(no =>{ return no['option'] === updateData['updated_option']; })
          if (optionsArray.length>0) {
            this.toast_service.danger(
              'Option already in the List',
              'DUPLICATE OPTION'
            );
            throw Error('Duplicate Option')
          }


          node.options[nodeState[0]].options = node.options[nodeState[0]].options.map(no =>{
            if(no['option']===updateData['old_option']){
              no['option'] =updateData['updated_option'];
            }
            return no
          })
          return node;
        } else {
          this.addOptionTreeStructure(
            nodeState.slice(1),
            updateData,
            node.options[nodeState[0]]
          );
        }
      }
    }
    return node;
  }

  addProductTreeStructure(
    nodeState: number[],
    updateData: any,
    node: any
  ): any {
    if (nodeState.length > 0) {
      if (node.options !== null && node.options !== undefined) {
        const index = nodeState[0];
        if (nodeState.length === 1) {
          if (!node.options[index].products) {
            node.options[index].products = [];
          }

          const productsArray = node.options[index].products;
          if (!productsArray.includes(updateData)) {
            productsArray.push(updateData);            
          } else {
            this.toast_service.danger(
              'Product already in the List',
              'DUPLICATE PRODUCT'
            );
            throw Error('Duplicate Product')
          }

          return node;
        } else {
          this.addProductTreeStructure(
            nodeState.slice(1),
            updateData,
            node.options[index]
          );
        }
      }
    } else {
      if (!node.products) {
        node.products = [];
      }

      node.products.push(updateData);
    }

    return node;
  }

  deleteProductTreeStructure(
    nodeState: number[],
    updateData: any,
    node: any
  ): any {
    if (nodeState.length > 0) {
      if (node.options !== null && node.options !== undefined) {
        const index = nodeState[0];
        if (nodeState.length === 1) {
          let update_node = node.options[index].products.filter((x: number) => {
            return x !== updateData;
          });
          node.options[index].products = update_node;
          return node;
        } else {
          this.deleteProductTreeStructure(
            nodeState.slice(1),
            updateData,
            node.options[index]
          );
        }
      }
    }
    return node;
  }

  addQuestionTreeStructure(
    nodeState: number[] | null,
    updateData: any,
    node: any
  ): void {
    if (nodeState === null) {
      node.question = updateData;
    } else if (nodeState.length > 0) {
      if (node.options !== null && node.options !== undefined) {
        for (let index = 0; index < nodeState.length; index++) {
          if (1 === nodeState.length) {
            node.options[nodeState[0]].question = updateData;
            return node;
          } else {
            this.addQuestionTreeStructure(
              nodeState.slice(1),
              updateData,
              node.options[nodeState[0]]
            );
          }
        }
      }
    }

    return node;
  }

  // QUESTION AROUD this.mainQuestion 
  deleteResponse(i: any) {
    this.selectQuestion(this.nodeState);
    let node = this.deleteOptionTreeStructure(this.nodeState.length===0? null: this.nodeState, i, this.mainQuestion);
    this.tempNeedAnalysisQuestions['question'] = node;

    this.need_analysis_service
      .updateNeedAnalysisData(this.tempNeedAnalysisQuestions)
      .subscribe((data) => {
        // this.selectQuestion(this.nodeState);
        this.toast_service.success('Delete Option Data Successfully', 'Sucessfull')

      });

  }

  editOption(item:any){
    this.optionForm.get('option').setValue(item['option']);
    this.optionForm.get('old_option').setValue(item['option']);
    this.addModal('optionModal');    
  }

  saveOption(){
    this.selectQuestion(this.nodeState);
    let option_state = {};
    let option = StringManipulation.returnNullIfEmpty(this.optionForm.get('option').value);
    let old_option = StringManipulation.returnNullIfEmpty(this.optionForm.get('old_option').value);
    option_state['updated_option'] = option;
    option_state['old_option'] = old_option;
    let node = this.editOptionTreeStructure(this.nodeState.length===0?null:this.nodeState, option_state, this.mainQuestion);
    this.tempNeedAnalysisQuestions['question'] = node;
    this.need_analysis_service
      .updateNeedAnalysisData(this.tempNeedAnalysisQuestions)
      .subscribe((data) => {
        this.selectQuestion(this.nodeState);
        this.toast_service.success('Edit Option Data Successfully', 'Sucessfull')

      });
    
    this.optionForm.reset();
    this.closeModal('optionModal')
  }

  editQuestionForm() {
    this.isEditable = true;
  }

  saveQuestionForm() {
    let node = this.addQuestionTreeStructure(
      this.nodeState.length === 0 ? null : this.nodeState,
      this.questionForm.get('question').value,
      this.mainQuestion
    );
    console.log(node);

    this.selectQuestion(this.nodeState);
    this.tempNeedAnalysisQuestions['question'] = node;
    this.need_analysis_service
      .updateNeedAnalysisData(this.tempNeedAnalysisQuestions)
      .subscribe((data) => {
        console.log(data);
      });

    this.isEditable = false;
  }

  validateNeedForm() {
    return (
      this.needAnalysisForm.get('question').value?.length > 0 ||
      this.needAnalysisForm.get('option').value?.length > 0 ||
      this.needAnalysisForm.get('products').value?.length > 0
    );
  }

  addModal(name = 'exampleModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.setAttribute('data-bs-target', `#${name}`);
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeModal(name = 'exampleModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.removeAttribute('data-bs-target');
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

    // Main Operation Method Issues
    private selectQuestion(nodeState: any[]) {
      let temp = this.tempNeedAnalysisQuestions['question'];
      if(nodeState!==null){
      for (let index = 0; index < nodeState.length; index++) {
        const element = nodeState[index];
        temp = temp['options'][element];
      }
      this.presentQuestion = this.saveRecentNeedAnalysisData(temp);
    }else {
      
    }
  }
}
