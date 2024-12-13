import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import stepData from '../../data/steps.json';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import {ToastService} from "../../../../../../../shared/services/toast/toast.service";
import { Util } from 'leaflet';
import {AutoUnsubscribe} from "../../../../../../../shared/services/AutoUnsubscribe";
import {BreadCrumbItem} from "../../../../../../../shared/data/common/BreadCrumbItem";
import {Utils} from "../../../../../util/util";
import {ClientHistoryService} from "../../../../../service/client-history/client-history.service";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";

/**
 * Component for displaying and editing insurance history details in the quotation module.
 */
@Component({
  selector: 'app-insurance-history',
  templateUrl: './insurance-history.component.html',
  styleUrls: ['./insurance-history.component.css'],
})

@AutoUnsubscribe

export class InsuranceHistoryComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard', },
    { label: 'Quotation', url: '/home/lms/quotation/list', },
    {
      label: 'Insurance History(Data Entry)',
      url: '/home/lms/ind/quotation/insurance-history',
    },
  ];
  steps = stepData;
  products = [];
  insuranceHistoryForm: FormGroup;
  insuranceHistoryFormOne: FormGroup;
  insuranceHistoryFormTwo: FormGroup;
  policyListOne: any[] = [];
  policyListTwo: any[] = [];
  editEntity: boolean;
  coverStatusTypeList: any[] = [];
  coverStatusTypeListOne: any[] = [];
  coverStatusTypeListTwo: any[] = [];
  util: Utils;
  editFirstForm: boolean;
  // insuranceHistoryForm: FormGroup;
  showPolicyTwoModal: boolean = false; // Tracks if the modal is visible
  editingPolicyTwo: boolean = false; // Tracks if editing mode is active
  editingIndexTwo: number | null = null; // Tracks the index being edited in policyListTwo

  constructor(
    private fb: FormBuilder,
    private client_history_service: ClientHistoryService,
    private session_storage: SessionStorageService,
    private spinner_service: NgxSpinnerService,
    private toast: ToastService
  ) {
    this.util = new Utils(this.session_storage)
    this.insuranceHistoryForm = this.fb.group({
      question1: ['N', Validators.required],
      responseOne: [],
      question2: ['N', Validators.required],
      responseTwo: [],
    });
    this.insuranceHistoryFormOne = this.createInsuranceHistoryFormFormGroup();
    this.insuranceHistoryFormTwo = this.createInsuranceHistoryFormFormGroup();
  }
  ngOnInit(): void {
    this.getAllCoverStatusTypes();
    this.getLmsInsHistList();
  }

  createInsuranceHistoryFormFormGroup() {
    return this.fb.group({
      code: [],
      policy_no: ['', Validators.required], 
      provider: ['', Validators.required],
      premium: ['', [Validators.required, Validators.min(0)]],
      sum_assured: ['', [Validators.required, Validators.min(0)]],
      cover_status: ['', Validators.required],
    });
  }

  get responseOneControls() {
    return this.insuranceHistoryForm.get('responseOne') as FormArray;
  }

  addResponseOne(x: any) {
    this.spinner_service.show('ins_view');
    let pol_data = this.policyListOne.filter((data, i) => {
      return i === x;
    })[0];
    let data  = this.insuranceHistoryFormOne.value;
    console.log(data);

    if(!data?.cover_status || data['cover_status']===''){
      this.toast.danger('Select cover status', 'Insurance history'.toUpperCase());
      this.spinner_service.hide('ins_view');
      return;
    }

    if(data['premium'] > data['sum_assured']){
      this.toast.danger('The Premium amount exceeds the sum assured', 'Insurance history'.toUpperCase())
      this.spinner_service.hide('ins_view');
      return;
    }

    this.saveInsuranceHistory({
      ...pol_data,
      ...this.insuranceHistoryFormOne.value,
    })
    .pipe(finalize(()=>    this.spinner_service.hide('ins_view')
    ))
    .subscribe((pol_sub_data) => {
      this.editFirstForm = false;
      this.policyListOne = this.policyListOne.map((data, i) => {
        if (i === x) {
          // let temp = this.insuranceHistoryFormOne.value;
          let temp = pol_sub_data['data'];
          temp['isEdit'] = false;
          return temp;
        }
        return data;
      });
      this.spinner_service.hide('ins_view');

      this.insuranceHistoryFormOne.reset();
      this.toast.success('Save Data Successfully', 'Insurance history'.toUpperCase());

    },
    err =>{
      this.toast.danger('Failed to save Data Successfully', 'Insurance history'.toUpperCase());

    });
  }
  addResponseTwo(x: any) {
    this.spinner_service.show('ins_view');
    let pol_data = this.policyListTwo.filter((data, i) => {
      return i === x;
    })[0];
    let data = {...this.insuranceHistoryFormTwo.value};
    console.log(data);

    if(!data?.cover_status || data['cover_status']===''){
      this.toast.danger('Select cover status', 'Insurance history'.toUpperCase());
      this.spinner_service.hide('ins_view');
      return;
    }


    if(data['premium'] > data['sum_assured']){
      this.toast.danger('The Premium amount exceeds the sum assured', 'Insurance history'.toUpperCase())
      this.spinner_service.hide('ins_view');
      return;
    }

    this.saveInsuranceHistory({
      ...pol_data,
      ...this.insuranceHistoryFormTwo.value,
    })
    .pipe(finalize(()=>    this.spinner_service.hide('ins_view')
    ))
    .subscribe((pol_sub_data) => {
      this.editFirstForm = false;
      this.policyListTwo = this.policyListTwo.map((data, i) => {
        console.log(pol_sub_data);

        if (i === x) {
          let temp = pol_sub_data['data'];
          temp['isEdit'] = false;
          return temp;
        }
        return data;
      });
      this.spinner_service.hide('ins_view');
      this.insuranceHistoryFormTwo.reset();
      this.toast.success('Save Data Successfully', 'Insurance history'.toUpperCase());

    },
    err =>{
      this.toast.danger('Failed to save Data Successfully', 'Insurance history'.toUpperCase());

    });
  }
  editPolicyOne(x) {
    this.editFirstForm = true;
    let pol = this.policyListOne
      .filter((data, i) => {
        return i === x;
      })
      .map((data) => {
        let temp = data;
        temp['isEdit'] = true;
        return temp;
      });
    this.policyListOne.indexOf(pol, x);
    this.insuranceHistoryFormOne.patchValue(pol.length > 0 ? pol[0] : {});
  }

  createPolicyFormGroup(item): FormGroup {
    return this.fb.group({
      policyNo: [item.policyNo, Validators.required],
      insuranceCompany: [item.insuranceCompany, Validators.required],
      annualPremium: [item.annualPremium],
      sumAssured: [item.sumAssured],
      status: [item.status],
      isEdit: [false], // This property tracks whether the row is in edit mode
    });
  }

  addEmptyPolicyList(policyListOne: any[]) {
    this.editFirstForm = true;
    policyListOne.push({ isEdit: true });
  }

  openAddPolicyTwoModal() {
    this.editingPolicyTwo = false;
    this.editingIndexTwo = null;
    this.insuranceHistoryFormTwo.reset();
    this.showPolicyTwoModal = true; 
  }

  closePolicyModalTwo(): void {
    this.showPolicyTwoModal = false;
  }

  savePolicyTwo(): void {
    if (this.insuranceHistoryFormTwo.invalid) {
      this.toast.danger('Please fill all required fields.', 'Policy Details');
      return;
    }

    const policyData = this.insuranceHistoryFormTwo.value;

    if (this.editingPolicyTwo && this.editingIndexTwo !== null) {
      // Update the existing policy
      const updatedList = [...this.policyListTwo];
      updatedList[this.editingIndexTwo] = { ...policyData, isEdit: false };
      this.policyListTwo = updatedList;
    } else {
      // Add a new policy
      this.policyListTwo = [...this.policyListTwo, { ...policyData, isEdit: false }];
    }

    this.closePolicyModalTwo();
  }

  /**
   * Retrieves the value of a specified control from the `insuranceHistoryForm`.
   * 
   * @param name - The name of the form control. Defaults to 'question1'.
   * @returns The value of the specified form control.
   */
  getValue(name: string = 'question1') {
    return this.insuranceHistoryForm.get(name).value;
  }

  deletePolicyListOne(i: number) {
    this.spinner_service.show('ins_view');
    const deleted_pol = this.policyListOne.find((data, x) => i === x);

    this.client_history_service.deleteInsuranceHistory(deleted_pol['code'])
      .pipe(finalize(() => this.spinner_service.hide('ins_view')))
      .subscribe(
        () => {
          this.policyListOne = this.policyListOne.filter((_, x) => i !== x);
          this.toast.success('Delete Data Successfully', 'INSURANCE HISTORY');
        },
        err => {
          this.toast.danger('Failed to Delete Data', 'INSURANCE HISTORY');
        }
      );
  }

  cancelPolicyListOne(i: number) {
    this.policyListOne = this.policyListOne.map((data, x) => {
      data['isEdit'] = false
      return data;
    }).filter(data => { return data?.code});
    this.editFirstForm = true;
  }


  deletepolicyListTwo(i: number) {
    this.spinner_service.show('ins_view');
    
    let deleted_pol = this.policyListTwo.find((data, x) => {return i === x});
    this.client_history_service.deleteInsuranceHistory(deleted_pol['code'])
    .pipe(finalize(()=>    this.spinner_service.hide('ins_view')
    ))
    .subscribe(data =>{
      this.policyListTwo = this.policyListTwo.filter((data, x) => {
        return i !== x;
      });
      this.toast.success('Delete Data Successfully', 'Insurance history'.toUpperCase())
      this.spinner_service.hide('ins_view')

    },
    err=>{
      this.toast.danger('Failed to Delete Data', 'Insurance history'.toUpperCase())

    })
  }

  cancelPolicyListTwo(i: number) {
    this.policyListTwo = this.policyListTwo.map((data, x) => {
      data['isEdit'] = false;
      return data;
    }).filter(data => { return data?.code});
    this.editFirstForm = true;

  }
  editPolicyTwo(x) {
    let pol = this.policyListTwo
      .filter((data, i) => {
        return i === x;
      })
      .map((data) => {
        let temp = data;
        temp['isEdit'] = true;
        return temp;
      });

    this.policyListTwo.indexOf(pol, x);
    this.insuranceHistoryFormTwo.patchValue(pol.length > 0 ? pol[0] : {});
  }

  openEditPolicyModalTwo (index: number): void {
    this.editingPolicyTwo = true;
    this.editingIndexTwo = index;

    // Populate the form with the selected policy's data
    const policy = this.policyListTwo[index];
    this.insuranceHistoryFormTwo.patchValue(policy);
    this.showPolicyTwoModal = true;
  }

  getLmsInsHistList() {
    this.spinner_service.show('ins_view');
    // let clientCode = this.session_storage.get(SESSION_KEY.CLIENT_CODE);
    this.client_history_service
      .getLmsInsHistList(this.util.getClientCode())
      .pipe(finalize(() => this.spinner_service.hide('ins_view')))
      .subscribe((data: any) => {
        if(data['data']!==null){
          this.policyListOne = data['data']
            .map((data_one: any) => {
              data_one['isEdit'] = false;
              return data_one;
            })
            .filter((data_filter: any) => {
              return ['A', 'S', 'PU', 'L'].includes(data_filter['cover_status']);
            });
          if (this.policyListOne.length > 0)
            this.insuranceHistoryForm.get('question1').setValue('Y');

          this.policyListTwo = data['data']
            .map((data_two) => {
              data_two['isEdit'] = false;
              return data_two;
            })
            .filter((data_two_filter) => {
              return ['w', 'D', 'W', 'V', 'J'].includes(data_two_filter['cover_status']);
            });
          if (this.policyListTwo.length > 0)
            this.insuranceHistoryForm.get('question2').setValue('Y');
          this.toast.success(data['message'], 'Insurance History')
        }
        this.spinner_service.hide('ins_view');
      });
  }



  getAllCoverStatusTypes() {
    this.client_history_service
      .getAllCoverStatusTypes()
      .subscribe((data: any[]) => {
        this.coverStatusTypeList = [...data];
        this.coverStatusTypeListOne = this.coverStatusTypeList.filter(data => {
          if(data['name']==='A' ||data['name']==='S'||data['name']==='L'||data['name']==='PU'){
            return data
          }
        })

        this.coverStatusTypeListTwo = this.coverStatusTypeList.filter(data => {
          if(data['name']==='J' ||data['name']==='V'||data['name']==='W'){
            return data
          }
        })
      });
  }

  filterCoverStatusType(s: string) {
    return this.coverStatusTypeList
      .filter((data) => data['name'] === s)
      .map((data) => data['value']);
  }

  saveInsuranceHistory(data: any) {
    const ins = { ...data };
    ins['clnt_code'] = this.util.getClientCode();
    ins['prp_code'] = null;

    // Filter out unnecessary fields (like `code`)
    const { code, ...filteredData } = ins;

    console.log('Final Payload:', filteredData); // Log the filtered data
    return this.client_history_service.saveInsuranceHistory(filteredData);
  }

  deleteInsuranceHistory() {
    let insCode = 0;
    this.client_history_service
      .deleteInsuranceHistory(insCode)
      .subscribe((data) => {
        console.log(insCode);
      });
  }

  selectFirstQuestion(){
    if(this.policyListOne.length>0){
      this.policyListOne.forEach((m, i)=>{
        this.deletePolicyListOne(i)

      });
    }

  }

  selectSecondQuestion(){
    if(this.policyListTwo.length>0) {
      this.policyListTwo.forEach((m, i) => {
        this.deletepolicyListTwo(i)
      });
    }
  }

  // private addEntity(d: FormGroup) {
  //   this.editEntity = true;
  //   this.responseOneControls.push({ isEdit: true });
  //   this.editEntity = false;
  //   return this.responseOneControls;
  // };
  // private deleteEntity(d: any[], i) {
  //   this.editEntity = true;
  //      d = d.filter((data, x) => {
  //       return i !== x;
  //     });
  //     this.editEntity = false
  //     return d;
  // };
  // private returnLowerCase(data: any) {
  //   let mapData = data.map((da) => {
  //     da['name'] = da['name'].toLowerCase();
  //     return da;
  //   });
  //   return mapData;
  // }
  ngOnDestroy(): void {
    console.log('InsuranceHistoryComponent UNSUBSCRIBE');
  }
}