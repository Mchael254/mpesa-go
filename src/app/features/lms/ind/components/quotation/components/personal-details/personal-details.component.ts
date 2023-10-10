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
import { Observable, filter, finalize, map, of, switchMap, tap } from 'rxjs';
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
  benefricairyList$: Observable<any[]>;
  trusteeList$: Observable<any[]>;
  editEntity: boolean;
  currencyList: any[];
  occupationList: OccupationDTO[] = [];
  sectorList: SectorDTO[] = [];

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
      question: [''],

      selectedUploadItem: [''],
      po_box: [''],
      country: [''],
      county: [''],
      p_address: [''],

      town: [''],
      road: [''],
      house_no: [''],
      u_bill: [''],
      u_u_bill: [''],

      branch: [''],
      number: [''],
      title: [''],
      p_contact_channel: [''],
      edocs: [''],

      client: [''],
      IdetifierType: [''],
      citizenship: [''],
      idNumber: [''],

      dateOfBirth: [],
      with_effect_from: [],
      with_effect_to: [],
      emailAddress: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/),
        ],
      ],
      gender: ['M'],
      lastName: [''],
      firstName: [''],
      pinNumber: [],
      clientType: [''],
      phoneNumber: [''],
      beneficiaries: this.fb.array([]),
    });
  }
  get beneficiaries() {
    return this.clientDetailsForm.get('beneficiaries') as FormArray;
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
  get clientControl() {
    return this.clientDetailsForm.get('client') as FormControl;
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
    console.log(product);

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
        
        console.log(data);
        
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
        console.log(this.clientList);
      });
  }
  getBeneficiariesByQuotationCode(quote_code_: number) {
    // let quote_code = +this.session_storage.get('quote_code')
    let ben_service_list =
      this.beneficiary_service.getListOfBeneficariesByQuotationCode(
        quote_code_
      );
    this.benefricairyList$ = ben_service_list.pipe(
      map((data_) => {
        let temp_list = data_.map((data) => {
          // console.log(data);
          let temp_data = {};
          temp_data['code'] = data['code'];
          temp_data['first_name'] = data['beneficiary_info']['first_name'];
          temp_data['other_name'] = data['beneficiary_info']['other_name'];
          temp_data['date_of_birth'] = new Date(
            data['beneficiary_info']['date_of_birth']
          );
          temp_data['percentage_benefit'] = data['percentage_benefit'];
          temp_data['type'] = data['type'];
          temp_data['age'] =
            new Date().getFullYear() -
            new Date(temp_data['date_of_birth']).getFullYear();
          temp_data['isEdit'] = false;

          return temp_data;
        });

        return temp_list;
      })
    );
    this.trusteeList$ = ben_service_list.pipe(
      map((data_) => {
        let temp_list = data_.map((data: {}) => {
          let temp_data = {};
          temp_data['code'] = data['code'];
          temp_data['full_name'] = data['trustee_info']['first_name'];
          temp_data['address'] = data['trustee_info']['address'];
          temp_data['date_of_birth'] = new Date(
            data['trustee_info']['date_of_birth']
          );
          temp_data['percentage_benefit'] = data['percentage_benefit'];
          temp_data['age'] =
            new Date().getFullYear() -
            new Date(temp_data['date_of_birth']).getFullYear();
          return temp_data;
        });

        return temp_list;
      })
    );
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
      console.log(data);
      
      this.currencyList = data;
    });
  }
  getOccupationList() {
    this.occupation_service
      .getOccupations(2)
      .subscribe((data) => (this.occupationList = data));
  }

  getSectorList(){
    this.sector_service.getSectors(2).subscribe(data =>{
      this.sectorList = data
    })
  }


  nextPage() {
    this.router.navigate(['/home/lms/ind/quotation/insurance-history']);
    let client_code = +this.session_storage.get('client_code');
    let formValue = this.clientDetailsForm.value;
    let client = {
      // "accountId": 0,
      branchCode: formValue['branch'],
      category: formValue['clientType'],
      clientTitle: formValue['title'],
      clientTitleId: +formValue['title'],
      clientTypeId: formValue['clientType'],
      country: Number(formValue['country']),
      // "createdBy": formValue["string"],
      dateOfBirth: new Date(formValue['dateOfBirth']),
      emailAddress: formValue['emailAddress'],
      firstName: formValue['firstName'],
      gender: formValue['gender'],
      idNumber: formValue['idNumber'],
      lastName: formValue['lastName'],
      //   "modeOfIdentity": formValue["ALIEN_NUMBER"],
      //   "occupationId": formValue[0],
      //   "passportNumber": formValue["string"],
      phoneNumber: formValue['phoneNumber'],
      physicalAddress: formValue['p_address'],
      pinNumber: formValue['pinNumber'],
      //   "shortDescription": formValue["string"],
      status: 'A',
      withEffectFromDate: new Date(),
    };

    if (client_code > 0) {
      client['id'] = client_code;
      this.client_service.updateClient(client_code, client);
    } else {
      client['id'] = 0;
      this.client_service.createClient(client);
    }

    // .subscribe()
  }
  addBeneficary() {
    this.benefricairyList$ = this.addEntity(this.benefricairyList$);
  }
  addTrustee() {
    this.trusteeList$ = this.addEntity(this.trusteeList$);
  }
  deleteBeneficiary(i: number) {
    this.benefricairyList$ = this.deleteEntity(this.benefricairyList$, i);
  }
  deleteTrustee(i: number) {
    this.trusteeList$ = this.deleteEntity(this.trusteeList$, i);
  }
  private addEntity(d: Observable<any[]>) {
    this.editEntity = true;
    return d.pipe(
      map((data: any[]) => {
        let addNew = { isEdit: true };
        data.push(addNew);
        return data;
      }),
      finalize(() => {
        this.editEntity = false;
      })
    );
  }
  private deleteEntity(d: Observable<any[]>, i) {
    this.editEntity = true;
    return d.pipe(
      map((d) => {
        return d.filter((data, x) => {
          return i !== x;
        });
      }),
      finalize(() => {
        this.editEntity = false;
      })
    );
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
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}
