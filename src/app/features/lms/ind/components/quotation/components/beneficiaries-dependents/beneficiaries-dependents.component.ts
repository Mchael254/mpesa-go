import { Component, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartyService } from 'src/app/features/lms/service/party/party.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { finalize } from 'rxjs/operators';
import { Utils } from 'src/app/features/lms/util/util';
import { RelationTypesService } from 'src/app/features/lms/service/relation-types/relation-types.service';


@Component({
  selector: 'app-beneficiaries-dependents',
  templateUrl: './beneficiaries-dependents.component.html',
  styleUrls: ['./beneficiaries-dependents.component.css']
})
export class BeneficiariesDependentsComponent implements OnInit{
  steps = stepData;
  editEntity: boolean;
  beneficiaryForm: FormGroup;
  dependentForm: FormGroup;

  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Quotation', url: '/home/lms/quotation/list' },
    {
      label: 'Client Details(Data Entry)',
      url: '/home/lms/ind/quotation/client-details',
    },
  ];
  isBeneficiaryLoading: boolean;
  beneficiaryList: any[] = [];
  relationTypeList: any[] =[];
  beneficiaryTypeList: any[] = [];
  dependentList: any[] = [];
  util: Utils;
  editDepEntity: boolean;



  constructor(private fb: FormBuilder, 
    private spinner_service: NgxSpinnerService, 
    private party_service: PartyService, 
    private session_storage: SessionStorageService, 
    private toast: ToastService,
    private relation_type_service: RelationTypesService,
    private router: Router

    ){
      this.util = new Utils(this.session_storage)
    }

  ngOnInit(): void {
    this.beneficiaryForm = this.getBeneficiaryForm();
    this.getBeneficiariesByQuotationCode();
    this.getDependentListByQuotationCode();
    this.getAllBeneficiaryTypes();
    this.getRelationTypes();
    this.dependentForm = this.fb.group(
      {
        // "ppr_code": this.util.getClientCode(),
        "surname": [],
        "other_name": [],
        // "id_no": "string",
        "dob": [],
        "code":[],
        "gender": [],
        "dty_code": 0,
        "co_code": 0,
        "is_adopted": [],
        "pol_code": this.util.getTelQuoteCode(),
        "tquo_code": this.util.getTelQuoteCode(),
        // "pod_unique_code_number": 0,
        // "monthly_income": 0
      }
    )

  }

  getRelationTypes() {
    this.relation_type_service.getRelationTypes().subscribe((data: any[]) => {
      this.relationTypeList = data;
    });
  }
  getAllBeneficiaryTypes() {
    this.party_service.getAllBeneficiaryTypes().subscribe((data: any[]) => {
      this.beneficiaryTypeList = [...data];
    });
  }


  getBeneficiaryForm(): FormGroup<any> {
    return this.fb.group({
      code: [],
      beneficiary_info: this.generateBeneficiaryForm(),
      appointee_info: this.generateBeneficiaryForm(),
      type: [''],
      percentage_benefit: [''],
    });
  }
  generateBeneficiaryForm(): FormGroup<any> {
    return this.fb.group({
      code: [0],
      first_name: [''],
      other_name: [''],
      date_of_birth: [],
      percentage_benefit: [''],
      tel_no: [''],
      gender: [''],
      contact: [''],
      relation_code: [''],
      type: [''],
    });
  }

  saveBeneficiary() {
    this.spinner_service.show('beneficiaries_view');

    this.spinner_service.show('beneficiary_modal_screen');
    this.isBeneficiaryLoading = true;
    let beneficiary = { ...this.beneficiaryForm.value };
    beneficiary['client_code'] = this.util.getClientCode();
    beneficiary['quote_code'] = this.getQuoteCode();
    beneficiary['percentage_benefit'] = StringManipulation.returnNullIfEmpty(
      beneficiary['percentage_benefit']
    );
    beneficiary['appointee_info']['relation_code'] =
      StringManipulation.returnNullIfEmpty(
        beneficiary['appointee_info']['relation_code']
      );
    beneficiary['beneficiary_info']['relation_code'] =
      StringManipulation.returnNullIfEmpty(
        beneficiary['beneficiary_info']['relation_code']
      );
    beneficiary['code'] = StringManipulation.returnNullIfEmpty(
      beneficiary['code']
    );
    let percentage_benefit = this.beneficiaryList
      ?.map((d) => d?.percentage_benefit)
      ?.reduce((sum, current) => sum + current, 0);

    console.log(percentage_benefit);
    if (percentage_benefit > 100) {
      this.toast.danger(
        'Percentage Benefits',
        `Total Percentage Benefits is More than 100%`
      );
      return;
    }
    if (!this.checkIfGuardianIsNeeded()) {
      beneficiary['appointee_info'] = null;
    }
    if (percentage_benefit <= 100) {
      return this.party_service
        .createBeneficiary(beneficiary)
        .pipe(
          finalize(() => {
            this.isBeneficiaryLoading = false;
            this.spinner_service.hide('beneficiary_modal_screen');
          })
        )
        .subscribe(
          (data) => {
            this.getBeneficiariesByQuotationCode();
            this.closeCategoryDetstModal();
            this.beneficiaryForm.reset();
            this.spinner_service.hide('beneficiary_modal_screen');
            this.isBeneficiaryLoading = false;
            this.toast.success(
              'Beneficiary Details Added Successfully',
              'Beneficiary/Trustee/Guardian'
            );
          },
          (err) => {
            this.spinner_service.hide('beneficiary_modal_screen');

            this.toast.danger(err?.error?.errors[0], 'Percentage Benefit');
          }
        );
    } else {
      this.spinner_service.hide('beneficiary_modal_screen');
      console.log('Greater than 100%');
      this.toast.danger(
        `Percentage Benefit is greater by  ${percentage_benefit - 100}`,
        'Percentage Benefit'
      );
    }
  }
  saveDependent() {
    this.spinner_service.show('beneficiaries_view');

    this.spinner_service.show('dependent_modal_screen');
    let dep = { ...this.dependentForm.value };
    dep['dty_code']=1001;
    console.log(dep);
    

    return this.party_service.saveDependent(dep)
        .pipe(
          finalize(() => {
            // this.isBeneficiaryLoading = false;
            this.spinner_service.hide('dependent_modal_screen');
          })
        ).subscribe(
          (data) => {
            this.getDependentListByQuotationCode();
            this.closeCategoryDetstModal('categoryDetsModalTwo');
            this.dependentForm.reset();
            this.spinner_service.hide('dependent_modal_screen');
            // this.isBeneficiaryLoading = false;
            this.toast.success(
              'Dependent Details Added Successfully',
              'Dependent'
            );
          },
          (err) => {
            this.spinner_service.hide('dependent_modal_screen');

            this.toast.danger(err?.error?.errors[0], 'SAVE DEPENDENT ');
          }
        );
    
  }

  deleteBeneficiary(i: number) {
    this.editEntity = true;
    let beneficiary: {} = this.beneficiaryList.filter((data, x) => x === i)[0];
    this.party_service
      .deleteBeneficiary(beneficiary['code'])
      .subscribe((data) => {
        this.beneficiaryList = this.deleteEntity(this.beneficiaryList, i);
        this.editEntity = false;
      });
  }
  deleteDependent(i: number) {
    this.editDepEntity = true;
    let dep: {} = this.dependentList.filter((data, x) => x === i)[0];
    this.party_service
      .deleteDependent(dep['code'])
      .subscribe((data) => {
        this.beneficiaryList = this.deleteEntity(this.dependentList, i);
        this.editDepEntity = false;
      },
      err=>{
        this.editDepEntity = false;
      });
  }
  editBeneficiary(i: number) {
    this.showCategoryDetstModal();
    this.beneficiaryList = this.beneficiaryList.map((data, x) => {
      if (i === x) {
        let be_date = data?.beneficiary_info?.date_of_birth;
        let ap_date = data?.appointee_info?.date_of_birth;
        if (!StringManipulation.isEmpty(ap_date))
          data['appointee_info']['date_of_birth'] = new Date(
            data['appointee_info']['date_of_birth']
          );
        if (!StringManipulation.isEmpty(be_date))
          data['beneficiary_info']['date_of_birth'] = new Date(
            data['beneficiary_info']['date_of_birth']
          );

        this.beneficiaryForm.patchValue(data);
        console.log(data);
      }
      return data;
    });
  }

  editDependent(i: number) {
    this.showCategoryDetstModalTwo();
    this.dependentList = this.dependentList.map((data, x) => {
      if (i === x) {
        data['dob'] = new Date(data['dob']);
        console.log(data);
        this.dependentForm.patchValue(data);
      }
      return data;
    });
  }

  getQuoteCode() {
    return this.util.getTelQuoteCode();
  }

  checkIfGuardianIsNeeded() {
    let date_ = this.calculateAgeWithMonth(
      this.getValueBeneficiaryValue('beneficiary_info.date_of_birth')
    );
    let type = this.getValueBeneficiaryValue('type');
    return type === 'B' && date_ < 18;
  }

  showCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  showCategoryDetstModalTwo() {
    const modal = document.getElementById('categoryDetsModalTwo');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  cancelBeneficiary() {
    this.beneficiaryForm.reset();
    this.closeCategoryDetstModal();
  }

  private deleteEntity(d: any[], i: any) {
    this.editEntity = true;
    d = d.filter((data, x) => {
      return i !== x;
    });
    this.editEntity = false;
    return d;
  }
  private calculateAgeWithMonth(dateOfBirth: any) {
    const currentDate = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    // Check if the birthdate has occurred this year already.
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  closeCategoryDetstModal(name='categoryDetsModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  getValueBeneficiaryValue(name: string = 'question1') {
    return this.beneficiaryForm.get(name).value;
  }

  getDependentListByQuotationCode() {
    this.editEntity = true;
    let proposal_code = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.QUOTE_DETAILS)
    );
    this.party_service
      .getListOfDependentByQuotationCode(
        this.getQuoteCode(),
        this.util.getProposalCode()
      )
      .pipe(finalize(() => (this.editEntity = false)))
      .subscribe((data: any) => {
        // console.log(data)
        this.dependentList = data;
      });
  }

  getBeneficiariesByQuotationCode() {
    this.editEntity = true;
    let proposal_code = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.QUOTE_DETAILS)
    );
    this.party_service
      .getListOfBeneficariesByQuotationCode(
        this.getQuoteCode(),
        proposal_code ? proposal_code['proposal_code'] : null
      )
      .pipe(finalize(() => (this.editEntity = false)))
      .subscribe((data) => {
        this.beneficiaryList = data;
      });
  }
  
  calculateAge(dateOfBirth: string | number | Date): number {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    return today.getFullYear() - dob.getFullYear();
  }

  date(dateOfBirth: string | number | Date) {
    return new Date(dateOfBirth);
  }

  trackByCode(index, item) {
    return Utils.trackByCode(item);
  }
  trackById(index, item) {
    return Utils.trackByCode(item);
  }

  nextPage(){
    let total = this.beneficiaryList.map(data => data['percentage_benefit']).reduce((prev, cur) => prev + cur, 0);
    // let total = perc.reduce((prev, cur) => prev + cur, 0);

    if(this.beneficiaryList.length===0){
      this.toast.danger('Provide at least a beneficiary', 'BENEFICIARY DETAIL');
      return;
    }

    if(total<100){
      this.toast.danger('Percentage Benefit is less than 100%', 'PERCENTAGE BENEFIT');
      return;
    }
    this.router.navigate(['/home/lms/ind/quotation/insurance-history'])
  }

  get total(){
    return this.beneficiaryList.map(data => data['percentage_benefit']).reduce((prev, cur) => prev + cur, 0)
  }


}
