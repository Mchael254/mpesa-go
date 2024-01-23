import { Component, ElementRef, ViewChild, signal } from '@angular/core';
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
import { ClientService as CRMClientService } from '../../../../../../entities/services/client/client.service';
import { ClientService as LMSClientService } from '../../../../../service/client/client.service';
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
import { FormsService } from 'src/app/features/setups/components/forms/service/forms/forms.service';
import { QuotationService } from 'src/app/features/lms/service/quotation/quotation.service';

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
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Home', url: '/home/dashboard' },
    { label: 'Quotation', url: '/home/lms/quotation/list' },
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
  editEntity: boolean;
  currencyList: any[];
  occupationList: OccupationDTO[] = [];
  sectorList: SectorDTO[] = [];
  beneficiaryTypeList: any[] = [];
  relationTypeList: any[] = [];
  documentList: any;
  isBeneficiaryLoading: boolean = false;
  loadBankBranch: boolean;
  getFormControlsNameWithErrors: string[] = [];
  validationData = [];
  CLIENT_LIST_SESSION = 'CLIENT_LIST_SESSION';
  CLIENT_LIST_MAP: any[] = [];

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
    private lms_client_service: LMSClientService,
    private form_service: FormsService,
    private quotation_service: QuotationService
  ) {
    this.form_service
      .getBySystemAndModuleAndScreeName(
        'LMS_INDIVIDUAL',
        'QUOTATION',
        'CLIENT_DETAILS'
      )
      .subscribe((data) => {
        this.validationData = data['data'].map((val: any) => {
          let temp = {};
          temp['name'] = val?.form_name;
          // use english as defaults
          temp['data'] = val?.inputs.en;
          return temp;
        });
        // console.log(this.validationData);

        this.clientDetailsForm = this.getClientDetailsForm();

        this.clientDetailsForm?.get('clientType')?.setValue(21);
        let client_info = StringManipulation.returnNullIfEmpty(
          this.session_storage.get(SESSION_KEY.CLIENT_DETAILS)
        );
        console.log(this.clientDetailsForm.value);
        console.log(this.getClientDetailsForm());
        
        
        if(client_info){
          console.log(client_info);
          
        }
      });
  }

  getFormData(name: string) {
    const foundData = this.validationData.find((data) => data['name'] === name);
    return foundData !== undefined ? foundData : null;
  }

  ngOnInit() {
    this.clientDetailsForm = this.getClientDetailsForm();
    this.clientTitleList$ = this.crm_client_service.getClientTitles(2);
    this.uploadForm = this.getUploadForm();
    this.beneficiaryForm = this.getBeneficiaryForm();
    this.getCountryList();
    this.getBranchList();
    this.getClientypeList();
    this.getIdentifierTypeList();
    this.getClientList();
    this.getBeneficiariesByQuotationCode();
    this.getBankList();
    // this.getBankBranchList();
    this.getCurrencyList();
    this.getOccupationList();
    this.getSectorList();
    this.getAllBeneficiaryTypes();
    this.getRelationTypes();
    this.getDocumentsByClientId();

    let web_quote = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
    );

    

    // if (web_quote) {
    //   // let accountCode = 178565 //Number(this.session_storage.get(SESSION_KEY.ACCOUNT_CODE));
    //   let accountCode = 178565; //web_quote['account_code'];
    //   this.crm_client_service
    //     .getAccountByCode(accountCode)
    //     .subscribe((data) => {
    //       console.log(data);
    //     });
    // }
    this.getQuotationDetails();
    

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
      citizenship: [
        {
          value: '',
          disabled: !!this.getFormData('CITIZENSHIP')?.data?.is_disabled,
        },
      ],
      date_of_birth: [],
      emailAddress: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/),
        ],
      ],
      gender: ['M'],
      title: [],
      lastName: [
        {
          value: '',
          disabled: !!this.getFormData('LAST_NAME')?.data?.is_disabled,
        },
      ],
      p_address: [],
      firstName: [
        {
          value: '',
          disabled: !!this.getFormData('FIRST_NAME')?.data?.is_disabled,
        },
      ],
      pinNumber: [
        {
          value: '',
          disabled: !!this.getFormData('PIN_NO')?.data?.is_disabled,
        },
        [Validators.required],
      ],
      clientType: [

        {
          value: '',
          disabled: !!this.getFormData('CLIENT_TYPE')?.data?.is_disabled,
        },
        [Validators.required],
      ],
      phoneNumber: [],
      occupation: [],
      country: [{ value: '', disabled: false }, [Validators.required]],
      branch: [
        {
          value: '',
          disabled: !!this.getFormData('BRANCH')?.data?.is_disabled,
        },
        [Validators.required],
      ],
      idNumber: [
        { value: '', disabled: !!this.getFormData('ID_NO')?.data?.is_disabled },
        [Validators.required],
      ],
      with_effect_from: [],
      with_effect_to: [],
      beneficiaries: this.fb.array([]),
      bank_branch: [],
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
      .getBranches(2, 46)
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
    let proposal_code = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
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
  getBankList() {
    this.bank_service.getBanks(1100).subscribe((data) => {
      this.bankList = data;
    });
  }
  selectBank(d: any) {
    this.getBankBranchList2(d?.target?.value);
  }
  getBankBranchList() {
    let id = this.bank_service.getBankBranch().subscribe((data) => {
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

  getQuoteCode() {
    let client_info = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.QUICK_QUOTE_DETAILS)
    );
    if (client_info === null) {
      return StringManipulation.returnNullIfEmpty(
        this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
      )['quote_no'];
    }
    return client_info['quote_code'];
  }
  saveBeneficiary() {
    this.spinner_Service.show('beneficiaries_view');

    this.spinner_Service.show('beneficiary_modal_screen');
    this.isBeneficiaryLoading = true;
    let beneficiary = { ...this.beneficiaryForm.value };
    beneficiary['client_code'] = null
    // StringManipulation.returnNullIfEmpty(
    //   this.session_storage.get(SESSION_KEY.CLIENT_CODE)
    // );
    beneficiary['quote_code'] = this.getQuoteCode();
    // StringManipulation.returnNullIfEmpty(
    //   this.session_storage.get(SESSION_KEY.QUOTE_CODE)
    // );
    // beneficiary['proposal_no'] = StringManipulation.returnNullIfEmpty(
    //   this.session_storage.get(SESSION_KEY.PROPOSAL_CODE)
    // );
    // beneficiary['proposal_code'] = StringManipulation.returnNullIfEmpty(
    //   this.session_storage.get(SESSION_KEY.PROPOSAL_CODE)
    // );
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
            this.spinner_Service.hide('beneficiary_modal_screen');
          })
        )
        .subscribe(
          (data) => {
            this.getBeneficiariesByQuotationCode();
            this.closeCategoryDetstModal();
            this.beneficiaryForm.reset();
            this.spinner_Service.hide('beneficiary_modal_screen');
            this.isBeneficiaryLoading = false;
            this.toast.success(
              'Beneficiary Details Added Successfully',
              'Beneficiary/Trustee/Guardian'
            );
          },
          (err) => {
            this.spinner_Service.hide('beneficiary_modal_screen');

            this.toast.danger(err?.error?.errors[0], 'Percentage Benefit');
          }
        );
    } else {
      this.spinner_Service.hide('beneficiary_modal_screen');
      console.log('Greater than 100%');
      this.toast.danger(
        `Percentage Benefit is greater by  ${percentage_benefit - 100}`,
        'Percentage Benefit'
      );
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
  isImage(name: any) {
    return ['jpeg', 'png', 'jpg'].includes(name);
  }
  getFileChange(event: any) {
    this.clientDetailsForm
      .get('selectedUploadItem')
      .setValue(event.target.value);
  }
  uploadFile(event: any) {
    this.spinner_Service.show('download_view');
    let client_info =
      StringManipulation.returnNullIfEmpty(
        this.session_storage.get(SESSION_KEY.QUICK_QUOTE_DETAILS)
      ) ||
      StringManipulation.returnNullIfEmpty(
        this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
      );
    let fileName = StringManipulation.returnNullIfEmpty(
      this.getValue('selectedUploadItem')
    );
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.dms_service
        .saveClientDocument(client_info['client_code'], fileName, formData)
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
  deleteDocumentFileById(code: string, x: any) {
    this.spinner_Service.show('download_view');

    this.dms_service
      .deleteDocumentById(code)
      .pipe(
        finalize(() => {
          this.spinner_Service.hide('download_view');
        })
      )
      .subscribe((data) => {
        console.log(data);

        this.documentList = this.documentList.filter((data, i) => i !== x);
        this.spinner_Service.hide('download_view');
      });
  }

  getDocumentsByClientId() {
    this.spinner_Service.show('download_view');
    let client_info =
      StringManipulation.returnNullIfEmpty(
        this.session_storage.get(SESSION_KEY.QUICK_QUOTE_DETAILS)
      ) ||
      StringManipulation.returnNullIfEmpty(
        this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
      );
    this.dms_service
      .getClientDocumentById(client_info['client_code'])
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
  cancelBeneficiary() {
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
  trackByCode(index, item) {
    return item?.code;
  }
  trackById(index, item) {
    return item?.id;
  }

  selectBankBranch(event) {
    this.loadBankBranch = true;
    this.bank_service.getBankBranchListByBankId(event.target.value).subscribe(
      (da) => {
        this.loadBankBranch = false;
        this.bankBranchList = da;
      },
      (err) => {
        this.loadBankBranch = false;
      }
    );
  }

  isRequired(name: string) {
    let control = this.clientDetailsForm.get(name);
    return (
      (control.hasError('required') || control.hasError('pattern')) &&
      control.touched
    );
  }

  getFormControlsWithErrors(formGroup: FormGroup): string[] {
    const controlsWithErrors: string[] = [];

    Object.keys(formGroup.controls).forEach((controlName) => {
      const control = formGroup.get(controlName);

      if (control && control.invalid) {
        controlsWithErrors.push(controlName);
      }

      if (control instanceof FormGroup) {
        // If the control is a nested FormGroup, recursively check its controls
        controlsWithErrors.push(...this.getFormControlsWithErrors(control));
      }
    });

    const convertedArray = controlsWithErrors.map((str) => {
      // Use regular expression to insert a space before each capital letter
      return str.replace(/([A-Z])/g, ' $1').trim();
    });

    return convertedArray;
  }

  enableControlsWithErrors(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((controlName) => {
      const control = formGroup.get(controlName);

      if (control && control.invalid) {
        control.enable();
      }

      if (control instanceof FormGroup) {
        this.enableControlsWithErrors(control);
      }
    });
  }

  getQuotationDetails() {
    let quick_quote_details = this.session_storage.get(
      SESSION_KEY.QUICK_QUOTE_DETAILS
    );
    if (quick_quote_details) {
      this.quotation_service
        .getLmsIndividualQuotationTelQuoteByCode(
          quick_quote_details['quote_code']
        )
        .subscribe((data) => {
          console.log(data);
        });
    }
  }
  async nextPage() {
    this.spinner_Service.show('client_details_view')
    if (!this.clientDetailsForm.valid) {
      this.enableControlsWithErrors(this.clientDetailsForm);
      this.getFormControlsNameWithErrors = this.getFormControlsWithErrors(
        this.clientDetailsForm
      );
      this.toast.danger('Fill the required forms', 'Required forms');
    } else {
      let web_quote_details = StringManipulation.returnNullIfEmpty(
        this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS)
      );
      let formValue = this.clientDetailsForm.value;
      let countryData = this.countryList.find(
        (data) =>
          data?.id === StringManipulation.returnNullIfEmpty(formValue?.country)
      );
      const contactsDetails = {
        emailAddress: StringManipulation.returnNullIfEmpty(
          formValue.emailAddress
        ),
        id: 0,
        phoneNumber: StringManipulation.returnNullIfEmpty(
          formValue?.phoneNumber
        ),
        receivedDocuments: 'N',
        smsNumber: StringManipulation.returnNullIfEmpty(formValue?.phoneNumber),
        titleShortDescription: StringManipulation.returnNullIfEmpty(
          formValue?.title
        ),
      };
      let partyData = {
        category: 'C',
        country: countryData,
        countryId: StringManipulation.returnNullIfEmpty(formValue?.country),
        dateOfBirth: formValue?.date_of_birth,
        effectiveDateFrom: formValue?.with_effect_from,
        effectiveDateTo: formValue?.with_effect_to,
        id: 0,
        identityNumber: formValue?.idNumber,
        modeOfIdentityId: 12,
        name: StringManipulation.returnNullIfEmpty(
          `${formValue?.firstName} ${formValue?.lastName}`
        ),
        organizationId: 2,
        partyTypeId: 2,
        pinNumber: formValue?.pinNumber,
        profileImage: null,
        profilePicture: null,
      };
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
        category: 'C',
        // StringManipulation.returnNullIfEmpty(formValue?.clientType), clientTypeList
        countryId: StringManipulation.returnNullIfEmpty(formValue?.country),
        gender: StringManipulation.returnNullIfEmpty(formValue?.gender),
        status: 'A',
        dateCreated: new Date(),
        pin_Number: StringManipulation.returnNullIfEmpty(formValue?.pinNumber),
        account_type: 21,
        // StringManipulation.returnNullIfEmpty(
        //   formValue?.clientType
        // ),
        first_name: StringManipulation.returnNullIfEmpty(formValue?.firstName),
        last_name: StringManipulation.returnNullIfEmpty(formValue?.lastName),
        date_of_birth: formValue?.date_of_birth,
        organization_id: 2,
        branch_id: StringManipulation.returnNullIfEmpty(formValue?.branch),
      };
      let client_req = { ...partyData, ...accountData };
      client_req['clientType'] = StringManipulation.returnNullIfEmpty(formValue?.clientType)
      // Save Client Details to Get Client/AccountID
      console.log(client_req);

      // client_req['accountCode'] = 962479;
      let client_sub = of(client_req);
      // this.lms_client_service.saveClient(client_req);
      // CHECK if Its to save or Update Client Information
      // if(web_quote_details){
      //   // update the code/id
      //   client_sub = this.lms_client_service.updateClient(client_req)
      // }

      client_sub
        .pipe(
          switchMap((client_res) => {
            // After Creating and getting Client/Account ID then Get Complete Details of Tel Quote By QuoteCode
            this.session_storage.set(SESSION_KEY.CLIENT_DETAILS, client_res);
            return this.quotation_service.getLmsIndividualQuotationTelQuoteByCode(
              this.getQuoteCode()
            );
          }),
          switchMap((tel_quote_res: any) => {
            // Converting the Tel Quote Details Into Web Quote Information => Set ClientCode/AccountCode to All in Tel Quote Info
            let client_data = StringManipulation.returnNullIfEmpty(
              this.session_storage.get(SESSION_KEY.CLIENT_DETAILS)
            );
            let quick_quote_details = StringManipulation.returnNullIfEmpty(
              this.session_storage.get(SESSION_KEY.QUICK_QUOTE_DETAILS)
            );
            let web_quote_req = {};
            if (web_quote_details) {
              web_quote_req['code'] = web_quote_details['code'];
              web_quote_req = { ...web_quote_details };
            }
            web_quote_req = { ...web_quote_req, ...quick_quote_details, ...tel_quote_res,  };
            web_quote_req['account_code'] = client_data['accountCode'];
            web_quote_req['client_type'] = client_data['category']

            web_quote_req['client_code'] = this.generateNo();
            // web_quote_req['quick_quote_covers'] = [];
            web_quote_req['cover_type_codes'] = [];
            web_quote_req['quote_no'] = web_quote_req['quote_code']

            return this.quotation_service.saveWebQuote(web_quote_req);
          })
        )
        .subscribe((data: any) => {
          this.session_storage.set(SESSION_KEY.WEB_QUOTE_DETAILS, data);
          this.spinner_Service.hide('client_details_view');
          this.toast.success('Create Client Details Successfully!', 'Client Details');
          this.router.navigate(['/home/lms/ind/quotation/insurance-history'])

        },
        (err: any)=>{
          this.spinner_Service.hide('client_details_view');
          console.log(err);
          
        });
    }
  }

  // CHECK LATER
  mapClientDetails() {
    let client_list: any[] =
      StringManipulation.returnNullIfEmpty(
        this.session_storage.get(this.CLIENT_LIST_SESSION)
      ) || [];
    let web_details = StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS));
    if (web_details) {
      if (client_list.length > 0) {
        return client_list.find(
          (data) => data['client_code'] === web_details['client_code']
        );
      }
    }

    return null;
  }

  generateNo(): string {

    return '2323235976681'
    // const randomNumbers: string[] = [];
    // for (let i = 0; i < 3; i++) {
    //   const randomNumberAsString = Math.floor(Math.random() * 100).toString();
    //   randomNumbers.push(randomNumberAsString);
    // }
    // return randomNumbers.join(', ').replaceAll(', ', '');
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
