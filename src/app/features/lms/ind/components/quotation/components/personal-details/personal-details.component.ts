import { Component, ElementRef, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { BreadCrumbItem } from '../../../../../../../shared/data/common/BreadCrumbItem';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../../../../../../shared/services/setups/country/country.service';
import {
  CountryDto,
  StateDto,
  TownDto,
} from '../../../../../../../shared/data/common/countryDto';
import { Observable, finalize, map, of, switchMap } from 'rxjs';
import { BranchService } from '../../../../../../../shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from '../../../../../../../shared/data/common/organization-branch-dto';
import { ClientTypeService } from '../../../../../../../shared/services/setups/client-type/client-type.service';
import { ClientService as CRMClientService  } from '../../../../../../entities/services/client/client.service';
import { ClientService as LMSClientService  } from '../../../../../service/client/client.service';
import { ClientDTO } from '../../../../../../entities/data/ClientDTO';
import { SessionStorageService } from '../../../../../../../shared/services/session-storage/session-storage.service';
import { AutoUnsubscribe } from '../../../../../../../shared/services/AutoUnsubscribe';
import {
  BankBranchDTO,
  BankDTO,
} from '../../../../../../../shared/data/common/bank-dto';
import { BankService } from '../../../../../../../shared/services/setups/bank/bank.service';
import { CurrencyService } from '../../../../../../../shared/services/setups/currency/currency.service';
import { OccupationService } from '../../../../../../../shared/services/setups/occupation/occupation.service';
import { OccupationDTO } from '../../../../../../../shared/data/common/occupation-dto';
import { SectorService } from '../../../../../../../shared/services/setups/sector/sector.service';
import { SectorDTO } from '../../../../../../../shared/data/common/sector-dto';
import { ToastService } from '../../../../../../../shared/services/toast/toast.service';
import { PartyService } from '../../../../../service/party/party.service';
import { RelationTypesService } from '../../../../../service/relation-types/relation-types.service';
import { StringManipulation } from '../../../../../util/string_manipulation';
import { SESSION_KEY } from '../../../../../../lms/util/session_storage_enum';
import { DmsService } from '../../../../../../lms/service/dms/dms.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css'],
})
@AutoUnsubscribe
export class PersonalDetailsComponent {
  @ViewChild('NewQuoteModal') modalElement: ElementRef;
  steps = stepData;
  clientDetailsForm: FormGroup;
  uploadForm: FormGroup;
  clientTypeList: any[] = [];
  breadCrumbItems: BreadCrumbItem[] = [ { label: 'Home', url: '/home/dashboard'}, { label: 'Quotation', url: '/home/lms/quotation/list'}, { label: 'Client Details(Data Entry)', url: '/home/lms/ind/quotation/client-details'} ];
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
  editEntity: boolean;
  currencyList: any[];
  occupationList: OccupationDTO[] = [];
  sectorList: SectorDTO[] = [];
  beneficiaryTypeList: any[] = [];
  relationTypeList: any[] = [];
  documentList: any;
  isBeneficiaryLoading: boolean = false;

  constructor(
    private session_storage: SessionStorageService,
    private router: Router,
    private fb: FormBuilder,
    private country_service: CountryService,
    private branch_Service: BranchService,
    private clientType_service: ClientTypeService,
    private crm_client_service: CRMClientService,
    private bank_service: BankService,
    private currency_service: CurrencyService,
    private occupation_service: OccupationService,
    private sector_service: SectorService,
    private toast: ToastService,
    private party_service: PartyService,
    private relation_type_service: RelationTypesService,
    private dms_service: DmsService,
    private spinner_Service: NgxSpinnerService,
    private lms_client_service: LMSClientService
  ) {}
  ngOnInit() {
    this.clientTitleList$ = this.crm_client_service.getClientTitles(2);
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
    this.getDocumentsByClientId();

    // if (Number(this.session_storage.get(SESSION_KEY.CLIENT_CODE)) > 0) {
      // let clientId = Number(this.session_storage.get(SESSION_KEY.CLIENT_CODE));
      let accountCode = 178565 //Number(this.session_storage.get(SESSION_KEY.ACCOUNT_CODE));
      this.crm_client_service.getAccountByCode(accountCode).subscribe((data) => {
        // To work on Later
        console.log(data);
      });
    // }
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
  getUploadForm(): FormGroup<any> {
    return this.fb.group({
      selectedUploadItem: [''],
    });
  }
  getClientDetailsForm(): FormGroup<any> {
    return this.fb.group({
      beneficiary: this.generateBeneficiaryForm(),
      guardian: this.generateGuardianForm(),

      question: [''],

      selectedUploadItem: [],
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
      date_of_birth: [],

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
      occupation: ['', [Validators.required]],
      country: ['', [Validators.required]],
      branch: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      with_effect_from: [, [Validators.required]],
      with_effect_to: [],
      beneficiaries: this.fb.array([]),
    });
  }
  calculateAge(dateOfBirth: string | number | Date): number {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    return today.getFullYear() - dob.getFullYear();
  }
  getClientList() {
    this.isCLientListPresent = false;
    this.crm_client_service
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
  saveButton(value: any) {
    value['webClntType'] = 'I';
    value['webClntIdRegDoc'] = 'I';
    // console.log(value);
    this.router.navigate(['/home/lms/ind/quotation/quotation-details']);
  }
  getValue(name: string) {
    return this.clientDetailsForm.get(name).value;
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
  generateGuardianForm(): FormGroup<any> {
    return this.fb.group({
      code: [0],
      first_name: [''],
      contact: [''],
      date_of_birth: [],
      relation_code: [''],
    });
  }
  selectCountry(_event: any) {
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
  selectState(_event: any) {
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
    this.session_storage.set(SESSION_KEY.CLIENT_CODE, client['idNumber']);
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
          return this.crm_client_service.searchClients(0, 5, inputText.trim());
        }),
        finalize(() => (this.isCLientListPresent = true))
      )
      .subscribe((d) => {
        this.clientList = d['content'];
      });
  }
  // NO UNIT TESTED
  getBeneficiariesByQuotationCode() {
    this.editEntity = true;
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_CODE));
    let proposal_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.PROPOSAL_CODE));
    this.party_service
      // .getListOfBeneficariesByQuotationCode(20235318, proposal_code)
      .getListOfBeneficariesByQuotationCode(quote_code, proposal_code)
      .pipe(finalize(() => (this.editEntity = false)))
      .subscribe((data) => {
        this.beneficiaryList = data;
      });
  }
  getBankList() {
    this.bank_service.getBanks(1100).subscribe((data) => {
      this.bankList = data;
    });
  }
  selectBank(d:any){
    this.getBankBranchList2(d?.target?.value)
  }
  getBankBranchList() {
    let id =
    this.bank_service.getBankBranch().subscribe((data) => {
      this.bankBranchList = data;
    });
  }

  getBankBranchList2(id) {
      this.bank_service.getBankBranchById(id).subscribe((data) => {
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
  saveBeneficiary() {
    this.spinner_Service.show('beneficiary_modal_screen');
    this.isBeneficiaryLoading = true;
    let beneficiary = { ...this.beneficiaryForm.value };
    beneficiary['client_code'] = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.CLIENT_CODE)
    );
    beneficiary['quote_code'] = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.QUOTE_CODE)
    );
    beneficiary['proposal_no'] = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.PROPOSAL_CODE)
    );
    beneficiary['proposal_code'] = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.PROPOSAL_CODE)
    );
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
    let percentage_benefit = this.beneficiaryList?.map(d =>  d?.percentage_benefit)?.reduce((sum, current) => sum + current, 0);

    console.log(percentage_benefit);
    if(percentage_benefit >100){
      this.toast.danger('Percentage Benefits', `More than the expected amount by ${percentage_benefit-100}`)
      return;
    }
    if (!this.checkIfGuardianIsNeeded()) {
      beneficiary['appointee_info'] = null;
    }
    if(percentage_benefit<=100){
    return this.party_service
      .createBeneficiary(beneficiary)
      .pipe(finalize(()=>{
        this.isBeneficiaryLoading = false;
        this.spinner_Service.hide('beneficiary_modal_screen');
      }))
      .subscribe((data) => {
        this.getBeneficiariesByQuotationCode();
        this.closeCategoryDetstModal();
        this.beneficiaryForm.reset();
        this.spinner_Service.hide('beneficiary_modal_screen');
        this.isBeneficiaryLoading = false;
          this.toast.success('Beneficiary Details Added Successfully', 'Beneficiary/Trustee/Guardian')
      },
        err => {
          this.toast.danger(err?.error?.errors[0], 'Percentage Benefit')

        }
      );
    }else{
      console.log("Greater than 100%");
      this.toast.danger(`Percentage Benefit is greater by  ${percentage_benefit -100}`, 'Percentage Benefit')

    }
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
  getValueBeneficiaryValue(name: string = 'question1') {
    return this.beneficiaryForm.get(name).value;
  }
  checkIfGuardianIsNeeded() {
    let date_ = this.calculateAgeWithMonth(
      this.getValueBeneficiaryValue('beneficiary_info.date_of_birth')
    );
    let type = this.getValueBeneficiaryValue('type');
    return type === 'B' && date_ < 18;
  }
  getFileChange(event: any) {
    this.clientDetailsForm
      .get('selectedUploadItem')
      .setValue(event.target.value);
  }
  uploadFile(event: any) {
    this.spinner_Service.show('download_view');
    let client_code = this.session_storage.get(SESSION_KEY.CLIENT_CODE);
    let fileName = StringManipulation.returnNullIfEmpty(
      this.getValue('selectedUploadItem')
    );
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.dms_service
        .saveClientDocument(client_code, fileName, formData)
        .pipe(
          finalize(() => {
            this.spinner_Service.hide('download_view');
          })
        )
        .subscribe((data) => {
          this.documentList.push(data);
          const fileInput = document.getElementById(
            'uploadFile'
          ) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = ''; // Reset the input
          }
          this.spinner_Service.hide('download_view');
        });
    }
  }
  deleteDocumentFileById(code:string, x: any){
    this.spinner_Service.show('download_view');

    this.dms_service.deleteDocumentById(code)
    .pipe(
      finalize(() => {
        this.spinner_Service.hide('download_view');
      })
    )
    .subscribe(data =>{
      console.log(data);

      this.documentList = this.documentList.filter((data, i) => i!==x);
      this.spinner_Service.hide('download_view');

    })

  }
  isImage(name: any){
    return ['jpeg', 'png', 'jpg'].includes(name)
  }
  getDocumentsByClientId() {
    this.spinner_Service.show('download_view');
    let client_code = this.session_storage.get(SESSION_KEY.CLIENT_CODE);
    this.dms_service
      .getClientDocumentById(client_code)
      .pipe(
        finalize(() => {
          this.spinner_Service.hide('download_view');
        })
      )
      .subscribe((data) => {
        this.spinner_Service.hide('download_view');
        this.documentList = data['content'];
      });
  }
  downloadBase64File(url: string) {
    this.spinner_Service.show('download_view');
    this.dms_service
      .downloadFileById(url)
      .pipe(
        finalize(() => {
          this.spinner_Service.hide('download_view');
        })
      )
      .subscribe(() => {
        this.spinner_Service.hide('download_view');
      });
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
  cancelBeneficiary(){
    this.beneficiaryForm.reset();
    this.closeCategoryDetstModal();
  }
  closeCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
  trackByCode(index, item){ return item?.code; }
  trackById(index, item){ return item?.id; }
  async nextPage() {
    let client_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.CLIENT_CODE));
    let formValue = this.clientDetailsForm.value;
    let countryData = this.countryList.find(data => data?.id ===StringManipulation.returnNullIfEmpty(formValue?.country));
    const contactsDetails = {
      emailAddress: StringManipulation.returnNullIfEmpty(formValue.emailAddress),
      id: 0,
      phoneNumber: StringManipulation.returnNullIfEmpty(formValue?.phoneNumber),
      receivedDocuments: "N",
      smsNumber: StringManipulation.returnNullIfEmpty(formValue?.phoneNumber),
      titleShortDescription: StringManipulation.returnNullIfEmpty(formValue?.title)
    }
    let partyData = {
      category: "C",
      country: countryData,
      countryId: StringManipulation.returnNullIfEmpty(formValue?.country),
      dateOfBirth: formValue?.date_of_birth,
      effectiveDateFrom: formValue?.with_effect_from,
      effectiveDateTo: formValue?.with_effect_to,
      id: 0,
      identityNumber: formValue?.idNumber,
      modeOfIdentityId: 12,
      name:  StringManipulation.returnNullIfEmpty(`${formValue?.firstName} ${formValue?.lastName}`),
      organizationId: 2,
      partyTypeId: 2,
      pinNumber: formValue?.pinNumber,
      profileImage: null,
      profilePicture: null,
    }
    let accountData: any = {
      address: null,
      // StringManipulation.returnNullIfEmpty(formValue?.p_address),
      agentRequestDto: null,
      contactDetails: contactsDetails,
      partyId: null,
      partyTypeShortDesc: 'CLIENT',
      createdBy: null,
      effectiveDateFrom: formValue?.with_effect_from,
      effectiveDateTo: formValue?.with_effect_to,
      modeOfIdentityId: 12,
      category: "C",
      // StringManipulation.returnNullIfEmpty(formValue?.clientType), clientTypeList
      countryId: StringManipulation.returnNullIfEmpty(formValue?.country),
      gender: StringManipulation.returnNullIfEmpty(formValue?.gender),
      status: 'A',
      dateCreated: new Date(),
      pinNumber: StringManipulation.returnNullIfEmpty(formValue?.pinNumber),
      accountType: StringManipulation.returnNullIfEmpty(formValue?.clientType),
      firstName: StringManipulation.returnNullIfEmpty(formValue?.firstName),
      lastName: StringManipulation.returnNullIfEmpty(formValue?.lastName),
      dateOfBirth: formValue?.date_of_birth,
      organizationId: 2

    }
    let clientData = {...partyData, ...accountData}

    console.log(clientData);
    console.log(client_code);
    this.lms_client_service.saveClient(clientData).subscribe((data: any) => {
        this.session_storage.set(SESSION_KEY.ACCOUNT_CODE, data['accountCode'])
        this.session_storage.set(SESSION_KEY.ACCOUNT_ID, data['accountId'])
        this.router.navigate(['/home/lms/ind/quotation/insurance-history']);
      })

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
    // await this.router.navigate(['/home/lms/ind/quotation/insurance-history']);
    //     });
    //   }
    // }else{
    //   this.toast.danger('Fill all required Form', 'INCOMPLETE DATA')
    // }
  }
  private addEntity(d: any[]) {
    this.editEntity = true;
    d.push({ isEdit: true });
    this.editEntity = false;
    return d;
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
  private returnLowerCase(data: any) {
    let mapData = data.map((da) => {
      da['name'] = da['name'].toLowerCase();
      return da;
    });
    return mapData;
  }
}
