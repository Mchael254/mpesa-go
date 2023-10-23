import { Component, ElementRef, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { BreadCrumbItem } from '../../../../../../../shared/data/common/BreadCrumbItem';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CountryService } from '../../../../../../../shared/services/setups/country/country.service';
import {
  CountryDto,
  StateDto,
  TownDto
} from '../../../../../../../shared/data/common/countryDto';
import {
  Observable,
  finalize,
  map,
  of,
  switchMap
} from 'rxjs';
import { BranchService } from '../../../../../../../shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from '../../../../../../../shared/data/common/organization-branch-dto';
import { ClientTypeService } from '../../../../../../../shared/services/setups/client-type/client-type.service';
import { ClientService } from '../../../../../../../features/entities/services/client/client.service';
import { ClientDTO } from '../../../../../../../features/entities/data/ClientDTO';
import { SessionStorageService } from '../../../../../../../shared/services/session-storage/session-storage.service';
import { AutoUnsubscribe } from '../../../../../../../shared/services/AutoUnsubscribe';
import { BankBranchDTO, BankDTO } from '../../../../../../../shared/data/common/bank-dto';
import { BankService } from '../../../../../../../shared/services/setups/bank/bank.service';
import { CurrencyService } from '../../../../../../../shared/services/setups/currency/currency.service';
import { OccupationService } from '../../../../../../../shared/services/setups/occupation/occupation.service';
import { OccupationDTO } from '../../../../../../../shared/data/common/occupation-dto';
import { SectorService } from '../../../../../../../shared/services/setups/sector/sector.service';
import { SectorDTO } from '../../../../../../../shared/data/common/sector-dto';
import { ToastService } from '../../../../../../../shared/services/toast/toast.service';
import { PartyService } from '../../../../../service/party/party.service';
import { RelationTypesService } from '../../../../../../lms/service/relation-types/relation-types.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css'],
})
@AutoUnsubscribe
export class PersonalDetailsComponent {
  @ViewChild('NewQuoteModal') modalElement: ElementRef;
  steps = stepData;
  personalDetailFormfields: any[];
  buttonConfig: any;
  clientDetailsForm: FormGroup;
  uploadForm: FormGroup;
  selectedUploadItem: string;
  clientTypeList: any[] = [];
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
      label: 'Client Details(Data Entry)',
      url: '/home/lms/ind/quotation/client-details',
    },
  ];

  isTableOpen: boolean = false;
  countryList: CountryDto[] = [];
  branchList: OrganizationBranchDto[] = [];
  identifierTypeList: any[] = [];
  stateList: StateDto[] = [];
  townList: TownDto[] = [];
  bankList: BankDTO[] = [];
  bankBranchList: BankBranchDTO[] = [];
  showStateSpinner: boolean;
  showTownSpinner: boolean;
  clientList: ClientDTO[] = [];
  beneficiaryForm: FormGroup;
  clientTitleList$: Observable<any[]>;
  isCLientListPresent: boolean = false;
  _openModal: boolean = true;
  beneficiaryList: any[] = [];
  guardianList: any[] = [];
  trusteeList$: Observable<any[]>;
  editEntity: boolean;
  editEntityTwo: boolean;
  currencyList: any[];
  occupationList: OccupationDTO[] = [];
  sectorList: SectorDTO[] = [];
  beneficiaryTypeList: any[] = [];
  relationTypeList: any[] = [];
  showBeneficiaryAddButton: boolean = true;

  constructor(
    private session_storage: SessionStorageService,
    private router: Router,
    private fb: FormBuilder,
    private country_service: CountryService,
    private branch_Service: BranchService,
    private clientType_service: ClientTypeService,
    private client_service: ClientService,
    private bank_service: BankService,
    private currency_service: CurrencyService,
    private occupation_service: OccupationService,
    private sector_service: SectorService,
    private toast: ToastService,
    private party_service: PartyService,
    private relation_type_service: RelationTypesService
  ) {
  }

  ngOnInit() {
    this.clientTitleList$ = this.client_service.getClientTitles(2);
    this.clientDetailsForm = this.getClientDetailsForm();
    this.uploadForm = this.getUploadForm();
    this.beneficiaryForm = this.getBeneficiaryForm();
    this.getCountryList();
    this.getBranchList();
    this.getClientypeList();
    this.getIdentifierTypeList();
    this.getClientList();
    this.getBeneficiariesByQuotationCode();
    this.getBankList();
    this.getBankBranchList();
    this.getCurrencyList();
    this.getOccupationList();
    this.getSectorList();
    this.getAllBeneficiaryTypes();
    this.getRelationTypes();
  }
  getRelationTypes() {
    this.relation_type_service.getRelationTypes().subscribe((data:any[]) =>{
      this.relationTypeList = data
    })
  }

  getAllBeneficiaryTypes() {
    this.party_service.getAllBeneficiaryTypes().subscribe((data: any[]) => {
      this.beneficiaryTypeList = [...data];
    });
  }

  getBeneficiaryForm(): FormGroup<any> {
    return this.fb.group({
      beneficiary: this.generateBeneficiaryForm(),
      guardian:this.generateGuardianForm(),
      first_name: [''],
      other_name: [''],
      date_of_birth: [''],
      percentage_benefit: [''],
    });
  }

  getUploadForm(): FormGroup<any> {
    return this.fb.group({
      selectedUploadItem: [''],
    });
  }

  getClientDetailsForm(): FormGroup<any> {
    return this.fb.group({
      beneficiary: this.generateBeneficiaryForm(),
      guardian:this.generateGuardianForm(),

      question: [''],

      selectedUploadItem: [''],
      po_box: [''],

      county: [''],

      road: [''],
      house_no: [''],

      town: [''],
      bank: [''],
      countryCode: [''],
      disChannel: [''],
      purposeInsurance: [''],
      p_contact_channel: [''],
      maritalStatus: [''],
      employmentType: [],
      prefCahnnel: [],
      economicSector: [''],
      client: [''],
      IdetifierType: [''],
      citizenship: [''],
      dateOfBirth: [],

      with_effect_to: [],
      emailAddress: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/),
        ],
      ],
      gender: ['M', [Validators.required]],
      title: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      p_address: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      pinNumber: ['', [Validators.required]],
      clientType: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      withEffectFromDate: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      country: ['', [Validators.required]],
      branch: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      with_effect_from: ['', [Validators.required]],
      beneficiaries: this.fb.array([]),
    });
  }
  calculateAge(dateOfBirth): number {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    return today.getFullYear() - dob.getFullYear();;
  }
  getClientList() {
    this.isCLientListPresent = false;
    this.client_service
      .getClients()
      .pipe(finalize(() => (this.isCLientListPresent = true)))
      .subscribe((data) => {
        this.clientList = data['content'];
      });
  }
  openTable() {
    this.isTableOpen = true;
  }
  closeTable() {
    this.isTableOpen = false;
  }
  saveButton(value) {
    value['webClntType'] = 'I';
    value['webClntIdRegDoc'] = 'I';
    // console.log(value);
    this.router.navigate(['/home/lms/ind/quotation/quotation-details']);
  }
  getValue(name: string){
    return this.clientDetailsForm.get(name).value;
  }
  generateBeneficiaryForm(): FormGroup<any> {
    return this.fb.group({
       code: [0],
       first_name: [''],
       other_name: [''],
       date_of_birth: [],
       percentage_benefit: [''],
       relation_code: [''],
       type: [''],

    });
  }
  generateGuardianForm(): FormGroup<any> {
    return this.fb.group({
      code: [0],
      first_name: [''],
      date_of_birth: [],
      relation_code: [''],

    });
  }

  selectCountry(_event) {
    this.showStateSpinner = true;
    let e = +_event.target.value;
    of(e)
      .pipe(
        switchMap((data: number) => {
          return this.country_service.getMainCityStatesByCountry(data);
        }),
        finalize(() => {
          this.showStateSpinner = false;
        })
      )
      .subscribe((data) => {
        this.stateList = data;
        this.townList = [];
      });
  }
  selectState(_event) {
    this.showTownSpinner = true;
    let e = +_event.target.value;
    of(e)
      .pipe(
        switchMap((data: number) => {
          return this.country_service.getTownsByMainCityState(data);
        }),
        finalize(() => {


          this.showTownSpinner = false;
        })
      )
      .subscribe((data) => {
        this.townList = data;
      });
  }

  getCountryList() {
    this.country_service
      .getCountries()
      .pipe(
        map((data) => {
          return this.returnLowerCase(data);
        })
      )
      .subscribe((data) => {
        this.countryList = data;
      });
  }
  getBranchList() {
    this.branch_Service
      .getBranches(2)
      .pipe(
        map((data) => {
          return this.returnLowerCase(data);
        })
      )
      .subscribe((data) => {
        this.branchList = data;
      });
  }
  getClientypeList() {
    this.clientType_service
      .getClientTypes()
      .subscribe((data) => (this.clientTypeList = data));
  }
  getIdentifierTypeList() {
    this.clientType_service.getIdentifierTypes().subscribe((data) => {
      this.identifierTypeList = data;
    });
  }

  selectClient(client: any) {
    let patchClient = {
      lastName: client['lastName'],
      firstName: client['firstName'],
      dateOfBirth: new Date(client['dateOfBirth']),
      gender: client['gender'],
      emailAddress: client['emailAddress'],
      pinNumber: client['pinNumber'],
      idNumber: client['idNumber'],
      clientType: client['clientType']['code'],
      phoneNumber: client['phoneNumber'],
    };
    this.session_storage.set('client_code', client['idNumber']);
    this.clientDetailsForm.patchValue(patchClient);
    this.closeModal();
    this._openModal = false;
  }
  // NO UNIT TESTED
  searchClient(event_) {
    this.isCLientListPresent = false;
    this.clientList = [];
    let data = event_.target.value;
    of(data)
      .pipe(
        switchMap((inputText: string) => {
          return this.client_service.searchClients(0, 5, inputText.trim());
        }),
        finalize(() => (this.isCLientListPresent = true))
      )
      .subscribe((d) => {
        this.clientList = d['content'];
      });
  }
  // NO UNIT TESTED
  getBeneficiariesByQuotationCode() {
    let quote_code = +this.session_storage.get('quote_code');
    let proposal_code = +this.session_storage.get('proposal_code');
    this.party_service
      // .getListOfBeneficariesByQuotationCode(20235318, proposal_code)
      .getListOfBeneficariesByQuotationCode(quote_code, proposal_code)
      .subscribe((data) => {
        this.beneficiaryList = data.map(data_ => {
          let benefiary = {};
          benefiary = data_['beneficiary_info']
          benefiary['percentage_benefit'] = data_['percentage_benefit']
          benefiary['proposal_code'] = data_['proposal_code']
          benefiary['type'] = data_['type']
          benefiary['code'] = data_['code']
          benefiary['quote_code'] = data_['percentage_benefit']
          benefiary['percentage_benefit'] = data_['percentage_benefit']
          benefiary['isEdit'] = false
          return benefiary;
          });

           //   // GUARDIAN
           if(data[0]['appointee_info']!==null){
            this.guardianList = data.map(data => {

              let guardian = {};
              guardian = data['appointee_info']
              guardian['proposal_code'] = data['proposal_code']
              guardian['code'] = data['code']
              guardian['quote_code'] = data['percentage_benefit']
              guardian['isEdit'] = false

              return guardian;
              });

           }

      });
  }

  getBankList() {
    this.bank_service.getBanks(1100).subscribe((data) => {
      this.bankList = data;
    });
  }
  getBankBranchList() {
    this.bank_service.getBankBranch().subscribe((data) => {
      this.bankBranchList = data;
    });
  }
  getCurrencyList() {
    this.currency_service.getAllCurrencies().subscribe((data) => {
      this.currencyList = data;
    });
  }
  getOccupationList() {
    this.occupation_service
      .getOccupations(2)
      .subscribe((data) => (this.occupationList = data));
  }
  getSectorList() {
    this.sector_service.getSectors(2).subscribe((data) => {
      this.sectorList = data;
    });
  }


  async nextPage() {
    let client_code = +this.session_storage.get('client_code');
    let formValue = this.clientDetailsForm.value;

    // if(this.clientDetailsForm.valid){
    // if(true){
    //   let clientTitle: {} = {};
    //   if (formValue['title'] !== '') {
    //     clientTitle = await lastValueFrom(
    //       this.clientTitleList$.pipe(
    //         map((ou: any) =>
    //           ou.filter((val) => val['id'] === +formValue['title'])
    //         ),
    //         filter((filteredValues) => filteredValues.length > 0)
    //       )
    //     )[0];
    //   }
    //   const categoryDetails = this.clientTypeList.filter(
    //     (data) => data['code'] === +formValue['clientType']
    //   )[0];

    //   let client = {
    //     // "accountId": 0,
    //     branchCode: formValue['branch'],
    //     category: categoryDetails['clientTypeName'].charAt(0),
    //     clientTitle: clientTitle['description'],
    //     clientTitleId: +formValue['title'],
    //     clientTypeId: formValue['clientType'],
    //     country: Number(formValue['country']),
    //     // "createdBy": formValue["string"],
    //     dateOfBirth: new Date(formValue['dateOfBirth']),
    //     emailAddress: formValue['emailAddress'],
    //     firstName: formValue['firstName'],
    //     gender: formValue['gender'],
    //     idNumber: formValue['idNumber'],
    //     lastName: formValue['lastName'],
    //     //   "modeOfIdentity": formValue["ALIEN_NUMBER"],
    //     occupationId: formValue['occupation'],
    //     //   "passportNumber": formValue["string"],
    //     phoneNumber: formValue['phoneNumber'],
    //     physicalAddress: formValue['p_address'],
    //     pinNumber: formValue['pinNumber'],
    //     //   "shortDescription": formValue["string"],
    //     status: 'A',
    //     withEffectFromDate: formValue['withEffectFromDate'],
    //   };
    //   // return;

    //   if (client_code > 0) {
    //     client['id'] = client_code;
    //     this.client_service
    //       .updateClient(client_code, client)
    //       .subscribe((data) => {
    //         console.log(data);
    //         this.toast.success('NEXT TO INSURANCE HISTORY', 'Successfull');
    //         this.router.navigate(['/home/lms/ind/quotation/insurance-history']);
    //       });
    //   } else {
    //     client['id'] = 0;
    //     this.client_service.createClient(client).subscribe((data) => {
    //       console.log(data);
    // this.toast.success('NEXT TO INSURANCE HISTORY', 'Successfull');
    this.router.navigate(['/home/lms/ind/quotation/insurance-history']);
    //     });
    //   }
    // }else{
    //   this.toast.danger('Fill all required Form', 'INCOMPLETE DATA')
    // }
  }

  createBeneficiary(beneficiary: any, guardian: any) {
    let quote_code = this.session_storage.get('quote_code');
    let party = {...beneficiary}
    party['beneficiary_info'] = {...beneficiary};
    party['appointee_info'] = guardian;
    party['proposal_code'] = null,
    party['proposal_no'] = null,
    party['quote_code'] =  quote_code,
    party['is_adopted'] =  true
    return this.party_service.createBeneficary(party)
  }
  updateBeneficiary(i) {
    this.editEntity = true;
    let beneficiary = {}
    let guardian = {}
    beneficiary = this.beneficiaryList.filter((data, x)=>{return i === x})[0];
    guardian = this.guardianList.filter((data, x)=>{return data['code'] === beneficiary[0]['code']})[0];
    let _benForm = { ...this.getValue('beneficiary') };
    beneficiary = {..._benForm};
    this.createBeneficiary(beneficiary, guardian===undefined? null: guardian)
    .pipe(finalize(()=>this.editEntity = false)).subscribe(data =>{
        this.beneficiaryList = this.beneficiaryList.map((data, x) => {
          if (i === x) {
            let ben_tem = {};
            ben_tem = beneficiary
            ben_tem['relation_code'] = +beneficiary['relation_code']
            ben_tem['age'] = new Date().getFullYear() - new Date(beneficiary['date_of_birth']).getFullYear();
            ben_tem['isEdit'] = false;
            return ben_tem;
          }
          return data;
        });
        this.clientDetailsForm.get('beneficiary').reset();
        this.editEntity = false;
        this.showBeneficiaryAddButton = true

    }, (err)=>{
      this.toast.danger('Fill all Available Field', 'INCORRECT INFO')
      console.log(err['error']);

    })


  }
  addEmptyBeneficiary() {
    this.showBeneficiaryAddButton = false
    this.addEntity(this.beneficiaryList);
  }
  addEmptyGuardian() {
    this.addEntity(this.guardianList);
  }
  deleteBeneficiary(i: number) {
    this.editEntity = true;
    let beneficiary: {} = this.beneficiaryList.filter((data, x) => x===i)[0];
    this.party_service.deleteBeneficiary(beneficiary['code']).subscribe((data)=>{
      this.beneficiaryList = this.deleteEntity(this.beneficiaryList, i);
      this.editEntity = false;

    })
  }
  deleteGuardian(i: number) {
    let data: any[] = []
    data = this.guardianList.filter((data, x) => i ===x);
    if(data.length>0){
      let beneficiary = this.beneficiaryList.filter((data_) => {return data_['code'] === data[0]['code']})
      // this.party_service.createBeneficary({}).subscribe(data =>{
        this.guardianList = this.deleteEntity(this.guardianList, i);

      // });
    }


  }

  editBeneficiary(i: number) {
    this.showBeneficiaryAddButton = false
    this.showCategoryDetstModal();
    this.beneficiaryList = this.beneficiaryList.map((data, x) => {
      if (i === x) {
        data['date_of_birth'] = new Date(data['date_of_birth']);
        this.clientDetailsForm.get('beneficiary').patchValue(data);
      }
      return data;
    });
  }

  editGuardian(i: number) {

    this.guardianList = this.guardianList.map((data, x) => {
      if (i === x) {
        let data_ = {};

        data_['isEdit'] = true;
        data['isEdit'] = true;
        data_['party_first_name'] = data['first_name'];
        data_['party_last_name'] = data['other_name'];
        data_['party_dob'] = new Date(data['date_of_birth']);
        data_['party_percentage'] = data['percentage_benefit'];
        data_['party_type'] = data['type'];
        this.clientDetailsForm.patchValue(data_);
      }
      return data;
    });
  }
  private addEntity(d: any[]) {
    this.editEntity = true;
    d.push({ isEdit: true });
    this.editEntity = false;
    return d;
  }
  private deleteEntity(d: any[], i) {
    this.editEntity = true;
    d = d.filter((data, x) => {
      return i !== x;
    });
    this.editEntity = false;
    return d;
  }

  cancelEntity(d: any[], i, isButton) {
    isButton = true

    this.editEntity = true;
    d = d.map((data, x) => {
      if(x===i){
        data = data['isEdit'] = false
      }
      return data
    });
    this.editEntity = false;
    return d;
  }

  cancelBeneficiary(i) {
    this.editEntity = true;
    this.beneficiaryList = [...this.beneficiaryList.map((data, x) => {
      if(x===i){
        data['isEdit'] = false
        return data;
      }
      return data
    })]

    if(this.beneficiaryList[i]['code'] ===undefined){
      this.beneficiaryList = this.beneficiaryList.filter((data, x) => x!==i);
    }
    this.editEntity = false;
    this.showBeneficiaryAddButton = true
    this.clientDetailsForm.get('beneficiary').reset();

    return this.beneficiaryList;
  }

  private returnLowerCase(data: any) {
    let mapData = data.map((da) => {
      da['name'] = da['name'].toLowerCase();
      return da;
    });
    return mapData;
  }
  closeModal() {
    this._openModal = true;
    const modal = document.getElementById('newClientModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  showCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }
}
