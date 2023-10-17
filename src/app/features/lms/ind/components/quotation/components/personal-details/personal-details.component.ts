import { Component, ElementRef, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CountryService } from 'src/app/shared/services/setups/country/country.service';
import {
  CountryDto,
  StateDto,
  TownDto,
} from 'src/app/shared/data/common/countryDto';
import {
  Observable,
  filter,
  finalize,
  lastValueFrom,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';
import { ClientTypeService } from 'src/app/shared/services/setups/client-type/client-type.service';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { BeneficiaryService } from '../../../../service/benefiary/beneficiary.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { BankBranchDTO, BankDTO } from 'src/app/shared/data/common/bank-dto';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { OccupationService } from 'src/app/shared/services/setups/occupation/occupation.service';
import { OccupationDTO } from 'src/app/shared/data/common/occupation-dto';
import { SectorService } from 'src/app/shared/services/setups/sector/sector.service';
import { SectorDTO } from 'src/app/shared/data/common/sector-dto';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { PartyService } from '../../../../service/party/party.service';

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
  escalationForm: FormGroup;
  postalAddressForm: FormGroup;
  residentialAddressForm: FormGroup;
  uploadForm: FormGroup;
  uploadList: any[] = [];
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
  products!: any[];
  statuses!: any[];
  clonedProducts: { [s: string]: any } = {};
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
  trusteeForm: FormGroup;
  clientTitleList$: Observable<any[]>;
  isCLientListPresent: boolean = false;
  _openModal: boolean = true;
  benefricairyList$: any[] = [];
  guardianList$: any[] = [];
  trusteeList$: Observable<any[]>;
  editEntity: boolean;
  editEntityTwo: boolean;
  currencyList: any[];
  occupationList: OccupationDTO[] = [];
  sectorList: SectorDTO[] = [];
  beneficiaryTypeList: any[] = [];

  constructor(
    private session_storage: SessionStorageService,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    private country_service: CountryService,
    private branch_Service: BranchService,
    private clienType_service: ClientTypeService,
    private client_service: ClientService,
    private beneficiary_service: BeneficiaryService,
    private bank_service: BankService,
    private currency_service: CurrencyService,
    private occupation_service: OccupationService,
    private sector_service: SectorService,
    private toast: ToastService,
    private party_service: PartyService
  ) {
    this.uploadList = [
      {
        label: 'Means of Identification',
        value: 'IND',
        items: [
          { label: 'Mumbai', value: 'Mumbai' },
          { label: 'Varanasi', value: 'Varanasi' },
          { label: 'Nashik', value: 'Nashik' },
          { label: 'Delhi', value: 'Delhi' },
        ],
      },
      {
        label: 'Bill Uploads',
        value: 'us',
        items: [
          { label: 'Chicago', value: 'Chicago' },
          { label: 'Los Angeles', value: 'Los Angeles' },
          { label: 'New York', value: 'New York' },
          { label: 'San Francisco', value: 'San Francisco' },
        ],
      },
    ];
  }

  ngOnInit() {
    this.clientTitleList$ = this.client_service.getClientTitles(2);
    this.clientDetailsForm = this.getClientDetailsForm();
    this.escalationForm = this.getEscalationForm();
    this.uploadForm = this.getUploadForm();
    this.postalAddressForm = this.getPostalAddressForm();
    this.residentialAddressForm = this.getResidentialForm();
    this.beneficiaryForm = this.getBeneficiaryForm();
    this.trusteeForm = this.getBeneficiaryForm();

    this.products = [
      {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5,
      },
    ];

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];

    this.getCountryList();
    this.getBranchList();
    this.getClientypeList();
    this.getIdentifierTypeList();
    this.getClientList();
    this.getBeneficiariesByQuotationCode(20235318);
    this.getBankList();
    this.getBankBranchList();
    this.getCurrencyList();
    this.getOccupationList();
    this.getSectorList();
    this.getAllBeneficiaryTypes();
  }

  getAllBeneficiaryTypes() {
    this.party_service.getAllBeneficiaryTypes().subscribe((data: any[]) => {
      console.log(data);

      this.beneficiaryTypeList = [...data];
    });
  }

  getBeneficiaryForm(): FormGroup<any> {
    return this.fb.group({
      first_name: [''],
      other_name: [''],
      date_of_birth: [''],
      percentage_benefit: [''],
    });
  }
  getResidentialForm(): FormGroup<any> {
    return this.fb.group({
      town: [''],
      road: [''],
      house_no: [''],
      u_bill: [''],
      u_u_bill: [''],
    });
  }
  getPostalAddressForm(): FormGroup<any> {
    return this.fb.group({
      po_box: [''],
      country: [''],
      county: [''],
      town: [''],
      p_address: [''],
    });
  }
  getUploadForm(): FormGroup<any> {
    return this.fb.group({
      selectedUploadItem: [''],
    });
  }
  getEscalationForm(): FormGroup<any> {
    return this.fb.group({
      question: [''],
    });
  }
  getClientDetailsForm(): FormGroup<any> {
    return this.fb.group({
      // Beneficary/Trusstees
      party_first_name: [''],
      party_last_name: [''],
      party_dob: [new Date()],
      party_percentage: [''],
      party_telephone: [''],
      party_type: [''],
      // end

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
  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const dob = new Date(this.clientDetailsForm.get(dateOfBirth).value);
    const age = today.getFullYear() - dob.getFullYear();

    // Check if the birthday has occurred this year
    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      return age;
    }

    return age;
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
  selectDate() {}
  saveButton(value) {
    value['webClntType'] = 'I';
    value['webClntIdRegDoc'] = 'I';
    // console.log(value);
    this.router.navigate(['/home/lms/ind/quotation/quotation-details']);
  }
  goBack() {
    this.location.back();
  }
  onRowEditInit(product: any) {
    // console.log(product);

    this.clonedProducts[product.id as string] = { ...product };
    // console.log(this.clonedProducts);
  }
  onRowEditSave(product: any) {
    if (product.price > 0) {
      delete this.clonedProducts[product.id as string];
      // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    } else {
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    }
  }
  onRowEditCancel(product: any, index: number) {
    this.products[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];
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
    this.clienType_service
      .getClientTypes()
      .subscribe((data) => (this.clientTypeList = data));
  }
  getIdentifierTypeList() {
    this.clienType_service.getIdentifierTypes().subscribe((data) => {
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
        // console.log(this.clientList);
      });
  }
  getBeneficiariesByQuotationCode(quote_code_: number) {
    let quote_code = +this.session_storage.get('quote_code');
    this.beneficiary_service
      .getListOfBeneficariesByQuotationCode(quote_code)
      .subscribe((data) => {
        // console.log(data);
        let beneficiary = [];

        this.benefricairyList$ = data.map(data_ => {
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

          console.log(this.benefricairyList$);

           //   // GUARDIAN
          // let guardian = {};
          // this.guardianList$ = data.map(data => {

          // guardian = data['appointee_info']
          // guardian['proposal_code'] = data['proposal_code']
          // guardian['code'] = data['code']
          // guardian['quote_code'] = data['percentage_benefit']
          // // guardian['percentage_benefit'] = data['percentage_benefit']
          // // guardian['percentage_benefit'] = data['percentage_benefit'];
          // guardian['isEdit'] = false

          // return guardian;
          // });



        // this.benefricairyList$ = data['beneficiary_info'];
      });
    // this.trusteeList$ = ben_service_list.pipe(
    //   map((data_) => {
    //     let temp_list = data_.map((data: {}) => {
    //       let temp_data = {};
    //       temp_data['code'] = data['code'];
    //       temp_data['full_name'] = data['trustee_info']['first_name'];
    //       temp_data['address'] = data['trustee_info']['address'];
    //       temp_data['date_of_birth'] = new Date(
    //         data['trustee_info']['date_of_birth']
    //       );
    //       temp_data['percentage_benefit'] = data['percentage_benefit'];
    //       temp_data['age'] =
    //         new Date().getFullYear() -
    //         new Date(temp_data['date_of_birth']).getFullYear();
    //       return temp_data;
    //     });

    //     return temp_list;
    //   })
    // );
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

  createBeneficiary(data: any) {
    let quote_code = this.session_storage.get('quote_code');
    // let quote_code = this.session_storage.get('quote_code');
    let party = {
      code: data['party_code'] ? data['party_code']: 0,
      beneficiary_info: {
        first_name: data['party_first_name'],
        other_name: data['party_last_name'],
        date_of_birth: data['party_dob'],
        tel_no: data['party_last_name'],
        mobile_no: data['party_last_name'],
        email: null,
        relation_code: 2021251,
        postal_code: null,
        address: null,
        id_no: null,
        passport_no: null,
        age:
          new Date().getFullYear() - new Date(data['party_dob']).getFullYear(),
        town: null,
      },
      percentage_benefit: data['party_percentage'],
      proposal_code: null,
      // "proposal_no": "string",
      quote_code: quote_code,
      is_adopted: true,
      type: data['party_type'],
    };
    return this.beneficiary_service.createBeneficary(party)
    // return of();
  }

  updateBeneficiary(i) {
    this.editEntity = true;
    let _ben = { ...this.clientDetailsForm.value };
    let da = []
    da = this.benefricairyList$.filter((data, x)=>{return i === x});
    console.log(da);
    if(da.length >0){
      _ben['party_code'] = da[0]['code'];
    }


    this.createBeneficiary(_ben)
    .pipe(finalize(()=>this.editEntity = false)).subscribe(data =>{

        this.benefricairyList$ = this.benefricairyList$.map((data, x) => {
          if (i === x) {
            let ben_tem = {};

            ben_tem['first_name'] = _ben['party_first_name'];
            ben_tem['other_name'] = _ben['party_last_name'];
            ben_tem['code'] = data['code'];
            ben_tem['date_of_birth'] = _ben['party_dob'];
            ben_tem['type'] = _ben['party_type'];
            ben_tem['percentage_benefit'] = _ben['party_percentage'];
            ben_tem['age'] = new Date().getFullYear() - new Date(_ben['party_dob']).getFullYear();
            ben_tem['isEdit'] = false;
            return ben_tem;
          }

          return data;
        });

        console.log(this.benefricairyList$);


        let data_ = {};
        data_['party_first_name'] = '';
        data_['party_last_name'] = '';
        data_['party_dob'] = '';
        data_['party_percentage'] = '';
        data_['party_type'] = '';
        this.clientDetailsForm.patchValue(data_);
        this.editEntity = false;



    }, (err)=>{
      this.toast.danger('Fill all Available Field', 'INCORRECT INFO')
      console.log(err['error']);

    })


  }
  addEmptyBeneficiary() {
    this.addEntity(this.benefricairyList$);
  }
  deleteBeneficiary(i: number) {
    this.benefricairyList$ = this.deleteEntity(this.benefricairyList$, i);
  }

  editBeneficiary(i: number) {
    this.benefricairyList$ = this.benefricairyList$.map((data, x) => {
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
}
