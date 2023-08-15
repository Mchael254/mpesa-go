import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientTitleDTO} from "../../../../shared/data/common/client-title-dto";
import {EntityService} from "../../services/entity/entity.service";
import {finalize, take, takeUntil} from "rxjs/operators";
import {OccupationDTO} from "../../../../shared/data/common/occupation-dto";
import {DepartmentDto} from "../../../../shared/data/common/departmentDto";
import {DynamicFormFields} from "../../../../shared/utils/dynamic.form.fields";
import {DynamicFormButtons} from "../../../../shared/utils/dynamic.form.button";
import { EntityDetails } from '../../data/entity-details-data'
import {DepartmentService} from "../../../../shared/services/setups/department.service";
import {OccupationService} from "../../../../shared/services/setups/occupation.service";
import { AccountService } from '../../services/account/account.service';
import { AccountReqPartyId, IdentityModeDTO } from '../../data/entityDto';
import { AmlWealthDetailsUpdateDTO, BankDetailsUpdateDTO, NextKinDetailsUpdateDTO, PartyAccountsDetails, PersonalDetailsUpdateDTO, WealthDetailsUpdateDTO } from '../../data/accountDTO';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';
import { ReplaySubject } from 'rxjs';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { StaffDto } from '../../data/StaffDto';
import { StaffService } from '../../services/staff/staff.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LazyLoadEvent } from 'primeng/api';
import { CountryService } from 'src/app/shared/services/setups/country.service';
import { BankService } from 'src/app/shared/services/setups/bank.service';
import { CountryDto } from 'src/app/shared/data/common/countryDto';
import { SectorDTO } from 'src/app/shared/data/common/sector-dto';
import { BankBranchDTO, BankDTO, FundSourceDTO } from 'src/app/shared/data/common/bank-dto';
import { SectorService } from 'src/app/shared/services/setups/sector.service';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit{

  public entityDetailsForm: FormGroup;
  public bankDetailsForm: FormGroup;
  public wealthDetailsForm: FormGroup;
  public amlDetailsForm: FormGroup;
  public nextKinDetailsForm: FormGroup;
  public showExtraStaffDetails: boolean = false;
  showSupervisorModal: boolean = false;
  
  totalRecords: number;
  page = 1;
  pageSize = 5;

  entityId: number;
  partyAccountDetails: PartyAccountsDetails;
  accountDetails: AccountReqPartyId;
  staffSupervisorId: number;
  staffSupervisorOptions = 7;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  viewUsers: Pagination<StaffDto> = <Pagination<StaffDto>>{};
  selectedUser: StaffDto;
  selectedTitle: ClientTitleDTO;

  public titlesData : ClientTitleDTO[];
  public occupationData: OccupationDTO[];
  public staffDepartments: DepartmentDto[];
  public countryData: CountryDto[];
  public sectorData: SectorDTO[];
  public banksData: BankDTO[];
  public branchesData: BankBranchDTO[];
  public fundSource: FundSourceDTO[];
  public modeIdentityType: IdentityModeDTO[];

  // ================//
  public fieldsets: DynamicFormFields[];
  public stepsData: DynamicFormFields[];
  public buttonConfig: DynamicFormButtons;

  private _nameFilter: string;
  private _usernameFilter: string;
  get nameFilter(): string {
    return this._nameFilter;
  }

  set nameFilter(value: string){
    this._nameFilter = value;
    this.searchStaff(value);
  }

  get usernameFilter(): string{
    return this._usernameFilter;
  }

  set usernameFilter(value: string){
    this._usernameFilter = value;
    this.searchStaff(value, 'username');
  }

  constructor(
    private fb: FormBuilder,
    private entityService: EntityService,
    private entityDetails: EntityDetails,
    private countryService: CountryService,
    private bankService: BankService,
    private sectorService: SectorService,
    private departmentService: DepartmentService,
    private occupationService: OccupationService,
    private accountService: AccountService,
    private staffService: StaffService,
    private globalMessagingService: GlobalMessagingService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
    this.createAccountDetailsForm();
    this.entityId = this.activatedRoute.snapshot.params['id'];
    this.getAccountDetailsByAccountCode();
    this.fetchCountries();
    this.fetchBanks(1100);
    this.fetchBankBranches();
    this.fetchSectors(2);
    this.fetchOccupations(2);
    this.fetchClientTitles(1);
    this.fetchFundSource();
    this.fetchModeOfIdentity(2);
    this.fetchDepartments();

    this.fieldsets = this.entityDetails.entityDetails();
    this.buttonConfig = this.entityDetails.actionButtonConfig();
  }
  submitForm(data:any){
    console.log(data);
  }
  goBack(data?:any){
    if(data!=null){

    }
  }


  createAccountDetailsForm() {
    this.entityDetailsForm = this.fb.group({
      name: ['', Validators.required],
      passportNumber: ['', Validators.required],
      partyType: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      clientTitle: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      emailAddress: ['', Validators.required],
      physicalAddress: ['', Validators.required],
      idNumber: ['', Validators.required],
      occupation: ['', Validators.required],
      pinNumber: ['', Validators.required],
      staffDepartment: [''],
      staffSupervisor: ['']
    });

    this.bankDetailsForm = this.fb.group({
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountType: ['', Validators.required],
      branch: ['', Validators.required],
      preferredPaymentAccount: ['', Validators.required],
      iban: ['', Validators.required],
      swiftCode: ['', Validators.required],
      mpay: ['', Validators.required],
      bvn: ['', Validators.required]
    });

    this.wealthDetailsForm = this.fb.group({
      nationality: ['', Validators.required],
      citizenship: ['', Validators.required],
      fundSource: ['', Validators.required],
      employmentType: ['', Validators.required],
      sector: ['', Validators.required]
    });

    this.amlDetailsForm = this.fb.group({
      tradingName: ['', Validators.required],
      certRegNumber: ['', Validators.required],
      companyRegName: ['', Validators.required],
      wealthSource: ['', Validators.required],
      certificateRegYear: ['', Validators.required],
      parentCountry: ['', Validators.required],
      operationCountry: ['', Validators.required]
    });

    this.nextKinDetailsForm = this.fb.group({
      identifierType: ['', Validators.required],
      idNumber: ['', Validators.required],
      fullName: ['', Validators.required],
      emailAddress: ['', Validators.required],
      relationship: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    });


    this.accountService
      .currentAccount$
      .pipe(
        finalize(() => this.fetchSupervisorDetails()),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        currentAccount =>  {
          this.partyAccountDetails = currentAccount;
          this.showExtraStaffDetails = currentAccount?.partyType?.partyTypeName.toLowerCase() === 'staff';
          this.staffSupervisorId =  this.showExtraStaffDetails ? currentAccount?.userDto?.supervisorId : null;
        }
      );
  }

  fetchCountries(){
    this.countryService.getCountries()
      .pipe(takeUntil(this.destroyed$))
      .subscribe( (data) => {
        this.countryData = data;
      });
  }

  fetchBanks(countryId: number){
    this.bankService.getBanks(countryId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe( (data) => {
        this.banksData = data;
      });
  }

  fetchBankBranches() {
    this.bankService.getBankBranch()
      .pipe(takeUntil(this.destroyed$))
      .subscribe( (data) => {
        this.branchesData = data;
      })
  }

  fetchClientTitles(organizationId: number){
    this.entityService.getClientTitles(organizationId)
      .pipe(take(1))
      .subscribe( (data) => {
        this.titlesData = data;
        // this.selectedTitle = this.titlesData[0];
      });
  }

  fetchOccupations(organizationId: number){
    this.occupationService.getOccupations(organizationId)
      .pipe(take(1))
      .subscribe( (data) => {
        this.occupationData = data;
      });
  }

  fetchDepartments(){
    this.departmentService.getDepartments(2)
      .pipe(take(1))
      .subscribe( value => {
        this.staffDepartments = value;
      })
  }

  fetchFundSource() {
    this.bankService.getFundSource()
      .pipe(takeUntil(this.destroyed$))
      .subscribe( (data) => {
        this.fundSource = data;
      })
  }

  fetchModeOfIdentity(organizationId: number) {
    this.accountService.getIdentityMode(organizationId)
      .pipe( takeUntil(this.destroyed$) )
      .subscribe( (data) => {
        this.modeIdentityType = data;
      })
  }

  fetchSectors(organizationId: number){
    this.sectorService.getSectors(organizationId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe( (data) => {
        this.sectorData = data;
      });
  }

  getAccountDetailsByAccountCode() {
    if(this.partyAccountDetails?.accountCode) {
      this.accountService.getAccountDetailsByAccountCode(this.partyAccountDetails.accountCode)
        .pipe(
          takeUntil(this.destroyed$)
        )
        .subscribe((data: PartyAccountsDetails) => {
          this.partyAccountDetails = data
          console.log('Fetch account data using accountCode >>>>>', this.partyAccountDetails);
          let partyAccountType: string = this.partyAccountDetails?.partyType?.partyTypeName;
          if(this.partyAccountDetails?.userDto){
            this.fetchSupervisorDetails();
          }


          if (partyAccountType) {
            switch (partyAccountType.toLowerCase()) {
              case 'staff':
                this.staffDetails();
                break;
              case 'client':
                this.clientDetails();
                break;
              case 'service provider':
                this.serviceProviderDetails();
                break;
              case 'agent':
                this.agentDetails();
                break;
              default:
                break;
            }
          }
          this.updateBankDetails();
          if (this.partyAccountDetails.category.toLocaleLowerCase() === "individual") {
            this.updateWealthDetails();
          } else {
            this.updateAmlWealthDetails();
          }
          this.updateNextofKinDetails();
        })
    }
  }
  agentDetails() {
    this.entityDetailsForm.patchValue({
      physicalAddress: this.partyAccountDetails.agentDto?.physicalAddress,
      mobileNumber: this.partyAccountDetails.agentDto?.phoneNumber,
      emailAddress: this.partyAccountDetails.agentDto?.emailAddress,
      clientTitle: this.partyAccountDetails.contactDetails?.title,
      name: this.partyAccountDetails.agentDto?.name,
      partyType: this.partyAccountDetails.agentDto?.category?.toLowerCase() === 'corporate' ? 'C' : 'I',
      pinNumber: this.partyAccountDetails.agentDto?.pinNo,
      idNumber: this.partyAccountDetails.modeOfIdentityNumber,
      passportNumber: this.partyAccountDetails.modeOfIdentityNumber,
      dateOfBirth: this.datePipe.transform(this.partyAccountDetails.agentDto?.dateOfBirth, 'dd-MM-yyy'),
    })
  }
  serviceProviderDetails() {
    this.entityDetailsForm.patchValue({
      physicalAddress: this.partyAccountDetails.serviceProviderDto?.physicalAddress,
      mobileNumber: this.partyAccountDetails.serviceProviderDto?.phoneNumber,
      emailAddress: this.partyAccountDetails.serviceProviderDto?.emailAddress,
      // clientTitle: this.partyAccountDetails.serviceProviderDto?.title,
      clientTitle: this.partyAccountDetails.contactDetails.title,
      name: this.partyAccountDetails.serviceProviderDto?.name,
      partyType: this.partyAccountDetails.serviceProviderDto?.category?.toLowerCase() === 'corporate' ? 'C' : 'I',
      // partyType: this.partyAccountDetails.partyType.partyTypeName,
      pinNumber: this.partyAccountDetails.serviceProviderDto?.pinNumber,
      idNumber: this.partyAccountDetails.modeOfIdentityNumber,
      passportNumber: this.partyAccountDetails.modeOfIdentityNumber,
      // dateOfBirth: this.datePipe.transform(this.partyAccountDetails.dateOfBirth, 'dd-MM-yyy'),
    })
  }
  clientDetails() {
    this.entityDetailsForm.patchValue({
      physicalAddress: this.partyAccountDetails.clientDto?.physicalAddress,
      mobileNumber: this.partyAccountDetails.clientDto?.phoneNumber,
      emailAddress: this.partyAccountDetails.clientDto?.emailAddress,
      clientTitle: this.partyAccountDetails.clientDto?.clientTitle,
      name: this.partyAccountDetails.clientDto?.firstName,
      partyType: this.partyAccountDetails.clientDto?.category?.toLowerCase() === 'corporate' ? 'C' : 'I',
      pinNumber: this.partyAccountDetails.clientDto?.pinNumber,
      idNumber: this.partyAccountDetails.modeOfIdentityNumber,
      passportNumber: this.partyAccountDetails.modeOfIdentityNumber,
      occupation: this.partyAccountDetails.clientDto?.occupation?.name,
      dateOfBirth: this.datePipe.transform(this.partyAccountDetails.clientDto?.dateOfBirth, 'dd-MM-yyy'),
    })
  }
  staffDetails() {
    // throw new Error('Method not implemented.');
    this.entityDetailsForm.patchValue({
      physicalAddress: this.partyAccountDetails.userDto?.physicalAddress,
      mobileNumber: this.partyAccountDetails.userDto?.phoneNumber,
      emailAddress: this.partyAccountDetails.userDto?.emailAddress,
      clientTitle: this.partyAccountDetails.contactDetails?.id,
      name: this.partyAccountDetails.userDto?.name,
      partyType: this.partyAccountDetails.category?.toLowerCase() === 'corporate' ? 'C' : 'I',
      pinNumber: this.partyAccountDetails.pinNumber,
      idNumber: this.partyAccountDetails.modeOfIdentityNumber,
      passportNumber: this.partyAccountDetails.modeOfIdentityNumber,
      staffDepartment: this.partyAccountDetails?.userDto?.departmentCode,
      dateOfBirth: this.datePipe.transform(this.partyAccountDetails?.dateOfBirth, 'yyyy-MM-dd')
      // dateOfBirth: this.datePipe.transform(this.partyAccountDetails.userDto?.dateOfBirth, 'dd-MM-yyy'),
    });
  }

  updatePersonalInfo() {
    const personalInfoValue = this.entityDetailsForm.getRawValue();

    //Preparing Personal Information DTO
    const personalInfo: PersonalDetailsUpdateDTO = {
      accountId: this.partyAccountDetails.id,
      dob: personalInfoValue.dateOfBirth,
      emailAddress: personalInfoValue.emailAddress,
      identityNumber: personalInfoValue.idNumber,
      modeOfIdentityId: this.partyAccountDetails.modeOfIdentity.id,
      name: personalInfoValue.name,
      occupationId: personalInfoValue.occupation,
      organizationId: this.partyAccountDetails.organizationId,
      passportNo: personalInfoValue.passportNumber,
      phoneNumber: personalInfoValue.mobileNumber,
      physicalAddress: personalInfoValue.physicalAddress,
      pinNumber: personalInfoValue.pinNumber,
      title: personalInfoValue.clientTitle,
      category: personalInfoValue?.partyType,
      departmentId: personalInfoValue?.staffDepartment,
      supervisorId: this.selectedUser?.id
    }

    //calling updating service
    this.accountService.updatePersonalDetails(personalInfo, this.partyAccountDetails.id)
    .subscribe(data => {
      this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated Personal Details.');
      //route to 360 view component after successful Updating
      // this.router.navigate([ `/home/view-entity/${this.entityId}`]); //Confirm this first if needed
    })
  }

  updateBankDetails() {
    this.bankDetailsForm.patchValue({
      bankName: this.partyAccountDetails.paymentDetails?.bank_branch_id,
      accountNumber: this.partyAccountDetails.paymentDetails?.account_number,
      accountType: this.partyAccountDetails.paymentDetails?.preferedChannel,
      branch: this.partyAccountDetails.paymentDetails?.bank_branch_id,
      preferredPaymentAccount: this.partyAccountDetails?.paymentDetails?.is_default_channel,
      iban: this.partyAccountDetails.paymentDetails?.iban,
      swiftCode: this.partyAccountDetails.paymentDetails?.partyAccountId,
      mpay: this.partyAccountDetails.paymentDetails?.mpayno,
      bvn: this.partyAccountDetails.paymentDetails?.account_number,
    })
  }
  saveUpdatedBankDetails() {
    const bankDetailsInfo = this.bankDetailsForm.getRawValue();
    //preparing Bank DTO
    const bankDetails: BankDetailsUpdateDTO = {
      account_number: bankDetailsInfo.accountNumber,
      bank_branch_id: bankDetailsInfo.branch,
      iban: bankDetailsInfo.iban,
      mpayno: bankDetailsInfo.mpay,
      preferedChannel: bankDetailsInfo.preferredPaymentAccount,
      id: this.partyAccountDetails.paymentDetails?.id,
      partyAccountId:this.partyAccountDetails?.id,
      currency_id: 234,
      // effective_from_date:
      // effective_to_date:
      // is_default_channel:,
    }

        //calling updating service
    this.accountService.updateBankDetails(bankDetails, this.partyAccountDetails.id)
      .subscribe(data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated Bank Details');
          //route to 360 view component after successful Updating
        this.router.navigate([ `/home/entity/edit/${this.entityId}`]);
        })
  }

  updateWealthDetails() {
    this.wealthDetailsForm.patchValue({
      nationality: this.partyAccountDetails.wealthAmlDetails?.nationality_country_id,
      citizenship: this.partyAccountDetails.wealthAmlDetails?.citizenship_country_id,
      fundSource: this.partyAccountDetails.wealthAmlDetails?.funds_source,
      employmentType: this.partyAccountDetails.wealthAmlDetails?.is_employed,
      sector: this.partyAccountDetails.wealthAmlDetails?.sector_id
    })
  }

  saveUpdatedWealthDetails() {
    const wealthDetailsInfo = this.wealthDetailsForm.getRawValue();
    //preparing Wealth DTO
    const wealthDetails: WealthDetailsUpdateDTO = {
      citizenship_country_id: wealthDetailsInfo.citizenship,
      funds_source: wealthDetailsInfo.fundSource,
      is_employed: wealthDetailsInfo.employmentType,
      nationality_country_id: wealthDetailsInfo.nationality,
      partyAccountId: this.partyAccountDetails?.id,
      id: this.partyAccountDetails.wealthAmlDetails?.id,
      sector_id: wealthDetailsInfo.sector
      // is_self_employed:
      // marital_status:
      // occupation_id:
      // source_of_funds_id:

    }

    // calling updating service
    this.accountService.updateWealthDetails(wealthDetails, this.partyAccountDetails.id)
      .subscribe(data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Update Wealth Aml Details' );
          // route to 360 view component after successful Updating
        this.router.navigate([ `/home/entity/edit/${this.entityId}`]);
        })
  }

  updateAmlWealthDetails() {
    this.amlDetailsForm.patchValue({
      tradingName: this.partyAccountDetails.wealthAmlDetails?.tradingName,
      certRegNumber: this.partyAccountDetails.wealthAmlDetails?.certificate_registration_number,
      companyRegName: this.partyAccountDetails.wealthAmlDetails?.registeredName,
      wealthSource: this.partyAccountDetails.wealthAmlDetails?.source_of_wealth_id,
      certificateRegYear: this.partyAccountDetails.wealthAmlDetails?.certificate_year_of_registration,
      parentCountry: this.partyAccountDetails.wealthAmlDetails?.parent_country_id,
      operationCountry: this.partyAccountDetails.wealthAmlDetails?.operating_country_id
    })
  }

  saveUpdatedAmlWealthDetails() {
    const wealthAmlDetailsInfo = this.amlDetailsForm.getRawValue();
    //preparing Aml Wealth DTO
    const amlWealthDetails: AmlWealthDetailsUpdateDTO = {
      certificate_registration_number: wealthAmlDetailsInfo.certRegNumber,
      certificate_year_of_registration: wealthAmlDetailsInfo.certificateRegYear,
      operating_country_id: wealthAmlDetailsInfo.operationCountry,
      parent_country_id: wealthAmlDetailsInfo.parentCountry,
      registeredName: wealthAmlDetailsInfo.companyRegName,
      source_of_wealth_id: wealthAmlDetailsInfo.wealthSource,
      tradingName: wealthAmlDetailsInfo.tradingName,
      partyAccountId: this.partyAccountDetails.id,
      id: this.partyAccountDetails.wealthAmlDetails.id
      // cr_form_required:
      // cr_form_year: ,
      // funds_source:
    }
    // calling updating service
    this.accountService.updateAmlWealthDetails(amlWealthDetails, this.partyAccountDetails.id)
      .subscribe(data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated Wealth Aml Details' );
          // route to 360 view component after successful Updating
        this.router.navigate([ `/home/entity/edit/${this.entityId}`]);
        })
  }

  updateNextofKinDetails() {
    this.nextKinDetailsForm.patchValue({
      identifierType: this.partyAccountDetails.nextOfKinDetailsList[0]?.modeOfIdentity,
      idNumber: this.partyAccountDetails.nextOfKinDetailsList[0]?.identityNumber,
      fullName: this.partyAccountDetails.nextOfKinDetailsList[0]?.fullName,
      emailAddress: this.partyAccountDetails.nextOfKinDetailsList[0]?.emailAddress,
      relationship: this.partyAccountDetails.nextOfKinDetailsList[0]?.relationship,
      phoneNumber: this.partyAccountDetails.nextOfKinDetailsList[0]?.phoneNumber,
      dateOfBirth: this.partyAccountDetails.nextOfKinDetailsList[0]?.smsNumber,
    })
  }

  saveUpdatedNextofKinDetails() {
    const nextOfKinDetailsInfo = this.nextKinDetailsForm.getRawValue();
    //preparing Next of kin DTO
    const nextOfKinDetails: NextKinDetailsUpdateDTO = {
      fullName: nextOfKinDetailsInfo.fullName,
      identityNumber: nextOfKinDetailsInfo.idNumber,
      modeOfIdentityId: nextOfKinDetailsInfo.identifierType,
      emailAddress: nextOfKinDetailsInfo.emailAddress,
      phoneNumber: nextOfKinDetailsInfo.phoneNumber,
      smsNumber: nextOfKinDetailsInfo.phoneNumber,
      relationship: nextOfKinDetailsInfo.relationship,
      accountId: this.partyAccountDetails.id,
      id: this.partyAccountDetails.nextOfKinDetailsList[0]?.id

    }
    this.accountService.updateNextOfKinDetails(nextOfKinDetails, this.partyAccountDetails.id)
      .subscribe(data => {
      this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated Next of Kin Details' );
        // route to 360 view component after successful Updating
      this.router.navigate([ `/home/entity/edit/${this.entityId}`]);
      })
  }

  private searchStaff(value: string,
                      searchColumn: string = 'name') {
    if(searchColumn== 'username')
      this.staffService.searchStaff(0,5,null, null, 1, value)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          this.viewUsers = data;
        });
    else
      this.staffService.searchStaff(0,5,null, value, 1)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          this.viewUsers = data;
        });
  }

  lazyLoadAllUsers(event: LazyLoadEvent | TableLazyLoadEvent) {
    let sortField: string = '';

    if ('sortField' in event) {
      if (Array.isArray(event.sortField)) {
        sortField = event.sortField[0];
      } else {
        sortField = event.sortField;
      }
    }

    const pageIndex = event.first / event.rows;
    // const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';

    this.getIndividualUsers(pageIndex, sortField, sortOrder)
      .pipe(untilDestroyed(this))
      .subscribe((data:Pagination<StaffDto>) => {
        this.viewUsers = data;
        this.cdr.detectChanges();
      })
  }
  getIndividualUsers(pageIndex: number,
                     sortList: string = 'dateCreated',
                     order: string = 'desc') {
    return this.staffService.getStaff(pageIndex, this.staffSupervisorOptions, null, sortList, order, null)
      .pipe(untilDestroyed(this));
  }

  onUserRowSelect(event: any) {
    const individualInput = document.querySelector<HTMLInputElement>('#individualUserInput');
    individualInput.value = event.data.name;
    this.selectedUser = event.data;
    this.globalMessagingService.displayInfoMessage('User Selected', event.data.name);
  }

  clearReassignModalFields() {
    this.cdr.detectChanges();
  }

  saveSelectedSupervisor() {
    this.entityDetailsForm.patchValue({
      staffSupervisor: this.selectedUser?.name
    });
  }

  private getStaffSupervisorDetails() {
    if(this.staffSupervisorId){
      this.staffService.getStaffById(this.staffSupervisorId)
        .pipe(untilDestroyed(this))
        .subscribe(supervisor => {
          this.selectedUser = supervisor;
          this.saveSelectedSupervisor();
        })
    }
  }

  onUserRowUnselect(event: any){
  }

  showModal() {
    this.showSupervisorModal = !this.showSupervisorModal;
  }

  ngOnDestroy(): void {
  }

  fetchSupervisorDetails() {
    let staffSupervisorId = this.partyAccountDetails?.userDto?.supervisorId;

    // only perform api call to get supervisor only if the staff account has a supervisor
    if(staffSupervisorId){
      this.staffService
        .getStaffById(staffSupervisorId)
        .pipe(untilDestroyed(this))
        .subscribe( supervisor => {
          console.log('Supervisor: ', supervisor);
          this.selectedUser = supervisor;
          this.entityDetailsForm.controls['staffSupervisor'].setValue(supervisor?.name);
          // this.entityDetailsForm.patchValue({
          //   staffSupervisor:  supervisor?.name
          // });
        });
    }
  }

}
