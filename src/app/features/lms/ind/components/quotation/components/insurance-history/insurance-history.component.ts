import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import stepData from '../../data/steps.json';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { ClientHistoryService } from 'src/app/features/lms/service/client-history/client-history.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import {ToastService} from "../../../../../../../shared/services/toast/toast.service";

@Component({
  selector: 'app-insurance-history',
  templateUrl: './insurance-history.component.html',
  styleUrls: ['./insurance-history.component.css'],
})
@AutoUnsubscribe
export class InsuranceHistoryComponent implements OnInit, OnDestroy {
  steps = stepData;
  products = [];
  insuranceHistoryForm: FormGroup;
  insuranceHistoryFormOne: FormGroup;
  insuranceHistoryFormTwo: FormGroup;
  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list',
    },
    {
      label: 'Insurance History(Data Entry)',
      url: '/home/lms/ind/quotation/insurance-history',
    },
  ];

  policyListTwo: any[] = [];
  policyListOne: any[] = [];
  editEntity: boolean;
  coverStatusTypeList: any[] = [];
  // insuranceHistoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private client_history_service: ClientHistoryService,
    private session_storage: SessionStorageService,
    private spinner_service: NgxSpinnerService,
    private toast: ToastService
  ) {
    this.insuranceHistoryForm = this.fb.group({
      question1: ['N'],
      responseOne: [],
      question2: ['N'],
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
      policy_no: [''], // You can set initial values or validations as needed
      provider: [''],
      premium: [''],
      sum_assured: [''],
      cover_status: [''],
    });
  }

  get responseOneControls() {
    return this.insuranceHistoryForm.get('responseOne') as FormArray;
  }

  addResponseOne(x) {
    let pol_data = this.policyListOne.filter((data, i) => {
      return i === x;
    })[0];
    this.saveInsuranceHistory({
      ...pol_data,
      ...this.insuranceHistoryFormOne.value,
    }).subscribe((pol_sub_data) => {
      this.policyListOne = this.policyListOne.map((data, i) => {
        if (i === x) {
          let temp = this.insuranceHistoryFormOne.value;
          temp['isEdit'] = false;
          return temp;
        }
        return data;
      });

      this.insuranceHistoryFormOne.reset();
    });
  }
  addResponseTwo(x) {
    let pol_data = this.policyListTwo.filter((data, i) => {
      return i === x;
    })[0];
    this.saveInsuranceHistory({
      ...pol_data,
      ...this.insuranceHistoryFormTwo.value,
    }).subscribe((pol_sub_data) => {
      this.policyListTwo = this.policyListTwo.map((data, i) => {
        if (i === x) {
          let temp = this.insuranceHistoryFormTwo.value;
          temp['isEdit'] = false;
          return temp;
        }
        return data;
      });

      this.insuranceHistoryFormTwo.reset();
    });
  }
  editPolicyOne(x) {
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
    policyListOne.push({ isEdit: true });
  }

  getValue(name: string = 'question1') {
    return this.insuranceHistoryForm.get(name).value;
  }

  deletePolicyListOne(i: number) {
    let deleted_pol = this.policyListOne.find((data, x) => {
      return i === x;
    });
    this.client_history_service.deleteInsuranceHistory(deleted_pol['code']).subscribe(data =>{
      this.policyListOne = this.policyListOne.filter((data, x) => {
        return i !== x;
      });
    })
  }

  cancelPolicyListOne(i: number) {
    this.policyListOne = this.policyListOne.map((data, x) => {
      data['isEdit'] = false

      return data;
    }).filter((data, x) => x!==i);
  }


  deletepolicyListTwo(i: number) {
    let deleted_pol = this.policyListTwo.find((data, x) => {
      return i === x;
    });
    this.client_history_service.deleteInsuranceHistory(deleted_pol['code']).subscribe(data =>{
      this.policyListTwo = this.policyListTwo.filter((data, x) => {
        return i !== x;
      });
    })
  }
  cancelPolicyListTwo(i: number) {
    this.policyListTwo = this.policyListTwo.map((data, x) => {
      data['isEdit'] = false

      return data;
    }).filter((data, x) => x!==i);
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

  getLmsInsHistList() {
    this.spinner_service.show('ins_view');
    let clientCode = this.session_storage.get(SESSION_KEY.CLIENT_CODE);
    this.client_history_service
      .getLmsInsHistList(clientCode)
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
      });
  }

  filterCoverStatusType(s: string) {
    return this.coverStatusTypeList
      .filter((data) => data['name'] === s)
      .map((data) => data['value']);
  }

  saveInsuranceHistory(data: any) {
    let client_code = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.CLIENT_CODE)
    );

    let ins = { ...data };
    ins['clnt_code'] = client_code;
    ins['prp_code'] = client_code;
    ins['prp_code'] = null;
    console.log(ins);
    return this.client_history_service.saveInsuranceHistory(ins);
  }

  deleteInsuranceHistory() {
    let insCode = 0;
    this.client_history_service
      .deleteInsuranceHistory(insCode)
      .subscribe((data) => {
        console.log(insCode);
      });
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
