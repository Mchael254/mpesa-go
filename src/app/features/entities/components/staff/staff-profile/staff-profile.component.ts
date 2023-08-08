import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {CreateStaffDto, StaffDto} from "../../../data/StaffDto";
import {EntityDto} from "../../../data/entityDto";
import {CountryDto, StateDto, TownDto} from "../../../../../shared/data/common/countryDto";
import {DepartmentDto} from "../../../../../shared/data/common/departmentDto";
import {OrganizationBranchDto} from "../../../../../shared/data/common/organization-branch-dto";
import {StaffService} from "../../../services/staff/staff.service";
import {EntityService} from "../../../services/entity/entity.service";
import {CountryService} from "../../../../../shared/services/setups/country.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields.service";
import {AppService} from "../../../../../shared/services/setups/app.service";
import {DepartmentService} from "../../../../../shared/services/setups/department.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Logger, UtilService} from "../../../../../shared/services";
import {BranchService} from "../../../../../shared/services/setups/branch.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {DatePipe} from "@angular/common";
import {CreateAccountDTO, NewAccountCreatedResponse} from "../../../data/accountDTO";
import {TableLazyLoadEvent} from "primeng/table";
import {Dropdown} from "primeng/dropdown";

const log = new Logger('StaffProfileComponent');

@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.css']
})
export class StaffProfileComponent {
  @ViewChild('cancelSupervisorSelection', {read: ElementRef}) cancelSupervisorSelect: ElementRef;
  @ViewChild('countryDropdown') countriesDropdown?: Dropdown;

  visibleStatus: any = {
    firstName: 'Y',
    lastName: 'Y',
    username: 'Y',
    userType: 'Y',
    countryCode: 'Y',
    townCode: 'Y',
    city: 'Y',
    physicalAddress: 'Y',
    phoneNumber: 'Y',
    otherPhone: 'Y',
    email: 'Y',
    departmentCode: 'Y',
    manager: 'Y',
    branch: 'Y',
    personelRank: 'Y',
    telNo: 'Y',
    postalCode: 'Y',
    pinNumber: 'Y',
    gender: 'Y',
    dateOfBirth: 'Y',
    idNumber: 'Y'
  };

  public staffRegistrationForm: FormGroup;
  viewUsers: Pagination<StaffDto> = <Pagination<StaffDto>>{};

  selectedUser: StaffDto;
  entityDetails: EntityDto;

  countries: CountryDto[] = [];
  cities: StateDto[] = [];
  towns: TownDto[] = [];
  departments: DepartmentDto[] = [];
  branches: OrganizationBranchDto[] = [];
  assignedApps: number[] = [];
  apps: any[] = [];

  profileDetails: any;
  entityId: number;
  groupId: string = 'staffTab';
  submitted = false;
  savedStaffDetails: boolean = false;
  staffSize: number = 5;

  private savedStaff: CreateStaffDto;
  private currentStaff: number;

  private _listFilter: string;
  private _usernameFilter: string;
  selectedCountry: any;

  set usernameFilter(value: string) {
    this._usernameFilter = value;
    this.searchUsers(value);
  }

  get usernameFilter(): string {
    return this._usernameFilter;
  }

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.searchUsers(value);
  }

  constructor(private fb: FormBuilder,
              private staffService: StaffService,
              private entityService: EntityService,
              private countryService: CountryService,
              private mandatoryFieldsService: MandatoryFieldsService,
              private appService: AppService,

              private departmentService: DepartmentService,
              private globalMessagingService: GlobalMessagingService,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router,
              private utilService: UtilService,
              private branchService: BranchService) {
  }

  ngOnInit(): void {
    this.fetchEntityById();
    this.fetchCountries();
    this.fetchSystemApps();
    this.fetchDepartments();
    this.fetchBranches();
    this.createUserRegForm();
  }

  fetchEntityById(){
    this.entityService.currentEntity$
      .pipe(untilDestroyed(this))
      .subscribe( data => {
         log.info('>>>>> entity data from service: ', data);
          this.entityDetails = data;
        }
      );
  }

  fetchCountries(){
    log.info('Fetching countries list');
    this.countryService.getCountries()
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.countries = data;
      });
  }

  fetchSystemApps(){
    log.info('Fetching app list');
    log.info('Current base ref: ',location.href);
    this.apps = this.appService.getApps();
    this.apps.forEach(app =>  {
      app.clicked = false;
    });
  }

  fetchDepartments(){
    this.departmentService.getDepartments(2)
      .pipe(untilDestroyed(this))
      .subscribe(
        (departmentList) => {
          this.departments = departmentList;
        }
      )
  }

  fetchBranches() {
    this.branchService
      .getBranches(2)
      .pipe(untilDestroyed(this)
      )
      .subscribe( (branches) => {
        this.branches = branches;
      });
  }

  createUserRegForm() {
    this.staffRegistrationForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      username: [''],
      userType: [''],
      contact_details: this.fb.group(
        {
          countryCode: [''],
          townCode: [''],
          city: [''],
          physicalAddress: [''],
          phoneNumber: [''],
          otherPhone: [''],
          email: ['', Validators.email]
        },
      ),
      employment_details: this.fb.group({
        departmentCode: [''],
        manager: [''],
        branch: [''],
        personelRank: ['']
      }),
      telNo: [''],
      postalCode: [''],
      pinNumber: [''],
      gender: [''],
      dateOfBirth: [''],
      idNumber: ['']
    });
    this.profileDetails = JSON.parse(sessionStorage.getItem('partyProfileDetails'));

    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this)
      )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.staffRegistrationForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.staffRegistrationForm.controls[key].addValidators(Validators.required);
                this.staffRegistrationForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }

          const contactDetailsControls = this.staffRegistrationForm.get('contact_details') as FormGroup;
          for (const key of Object.keys(contactDetailsControls.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.staffRegistrationForm.get(`contact_details.${key}`).setValidators(Validators.required);
                this.staffRegistrationForm.get(`contact_details.${key}`).updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }

          const employmentDetailsControls = this.staffRegistrationForm.get('employment_details') as FormGroup;
          for (const key of Object.keys(employmentDetailsControls.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.staffRegistrationForm.get(`employment_details.${key}`).setValidators(Validators.required);
                this.staffRegistrationForm.get(`employment_details.${key}`).updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });

    this.staffRegistrationForm.patchValue({
      userType: this.entityDetails.categoryName == 'Individual' ? 'U' :
        (this.entityDetails.categoryName == 'Corporate' ? 'G' : ''),
      firstName: this.entityDetails.name.substring(0, this.entityDetails.name.indexOf(' ')),
      lastName: this.entityDetails.name.substring(this.entityDetails.name.indexOf(' ') + 1),
      pinNumber: this.entityDetails.pinNumber
    });

    if(this.entityDetails.identityNumber){
      this.staffRegistrationForm.get('idNumber').disable();
      this.staffRegistrationForm.get('idNumber').patchValue(this.entityDetails.identityNumber);
    }

    if(this.entityDetails?.dateOfBirth){
      this.staffRegistrationForm.get('dateOfBirth').disable();
      // this.staffRegistrationForm.get('dateOfBirth').patchValue(this.entityDetails?.dateOfBirth);
      const datePipe = new DatePipe('en-GB'); // TODO: Proper way to fetch locales via constructor injection token
      this.staffRegistrationForm.get('dateOfBirth').patchValue(datePipe.transform(this.entityDetails?.dateOfBirth, 'yyyy-MM-dd'));
    }
    this.cdr.detectChanges();
  }

  fetchTownsByCountry(countryId:number){
    log.info(`Fetching towns list for country, ${countryId}`);
    this.countryService.getTownsByCountry(countryId)
      .subscribe( (data) => {
        this.towns = data;
      })
  }

  fetchCityStatesByCountry(countryId: number){
    this.countryService.getMainCityStatesByCountry(countryId)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.cities = data;
      });
  }

  onCountryChange(event: { value: any; }) {
    let selectedCountry = event.value;

    console.log('Selected country: ', event);
    if(selectedCountry ){
      this.fetchCityStatesByCountry(selectedCountry);
      this.fetchTownsByCountry(selectedCountry);
    }
  }

  onSubmit(){
    this.submitted = true;
    this.staffRegistrationForm.markAllAsTouched(); // Mark all form controls as touched to show validation errors

    setTimeout(() => {
      if (this.staffRegistrationForm.invalid) {
        const invalidControls = Array.from(document.querySelectorAll('.is-invalid')) as Array<HTMLInputElement | HTMLSelectElement>;

        let firstInvalidUnfilledControl: HTMLInputElement | HTMLSelectElement | null = null;

        for (const control of invalidControls) {
          if (!control.value) {
            firstInvalidUnfilledControl = control;
            break;
          }
        }

        if (firstInvalidUnfilledControl) {
          firstInvalidUnfilledControl.focus(); // Set focus to the first invalid and unfilled field
          const scrollContainer = this.utilService.findScrollContainer(firstInvalidUnfilledControl);
          if (scrollContainer) {
            scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop; // Scroll the scrollable container to the top of the first invalid and unfilled field
          }
        } else {
          const firstInvalidControl = invalidControls[0];
          if (firstInvalidControl) {
            firstInvalidControl.focus(); // Set focus to the first invalid field
            const scrollContainer = this.utilService.findScrollContainer(firstInvalidControl);
            if (scrollContainer) {
              scrollContainer.scrollTop = firstInvalidControl.offsetTop; // Scroll the scrollable container to the top of the first invalid field
            }
          }
        }

        log.info('Account info: ', this.staffRegistrationForm.getRawValue());
        this.globalMessagingService.displayErrorMessage('Failed', 'Form is Invalid, Fill all required fields');
        return; // Exit the method if the form is invalid
      }

      const staffFormValues = this.staffRegistrationForm.getRawValue();
      // if(this.staffRegistrationForm.valid){


      const staff: CreateStaffDto = {
        id: staffFormValues.id,
        departmentCode: Number(staffFormValues.employment_details.departmentCode),
        emailAddress: staffFormValues.contact_details.email,
        personelRank: staffFormValues.employment_details.personelRank,
        otherPhone: staffFormValues.employment_details.otherPhone,
        userType: staffFormValues.userType,
        username: staffFormValues.username,
        supervisorId: this.selectedUser?.id,
        granterUserId: null,
        organizationGroupId: 1
      };

      const accountDto: CreateAccountDTO = {
        effectiveDateTo: null,
        effectiveDateFrom: null,
        address: {
          id: null,
          box_number: null,
          fax: null,
          country_id: staffFormValues.contact_details.countryCode,
          phoneNumber: staffFormValues.contact_details.phoneNumber,
          is_utility_address: 'N',
          physical_address: null,
          residential_address: null,
          postal_code: null,
          road: null,
          state_id: Number(staffFormValues.contact_details.city,),
          town_id: staffFormValues.contact_details.townCode,
          zip: null,
          estate: null,
          house_number: null,
          utility_address_proof: null
        },
        partyId: this.entityDetails.id,
        partyTypeShortDesc: "STAFF",
        modeOfIdentityid: this.entityDetails?.modeOfIdentity.id,
        modeOfIdentityNumber: staffFormValues.idNumber,
        organizationId: 2,
        firstName: staffFormValues.firstName,
        lastName: staffFormValues.lastName,
        status: "A",
        category: null,
        countryId: staffFormValues.contact_details?.countryCode,
        contactDetails:{
          // accountId:  0,
          emailAddress: staff.emailAddress,
          smsNumber: staffFormValues.contact_details?.phoneNumber,
          phoneNumber: staffFormValues.contact_details?.phoneNumber,
          id: 0,
          receivedDocuments: null,
          titleShortDescription: "DR"
        },
        userRequest: staff,
        branchId: staffFormValues.employment_details?.branch,
        pinNumber: this.entityDetails?.pinNumber,
        dateOfBirth: this.utilService.getFormattedDate(new Date(staffFormValues.dateOfBirth),'yyyy-MM-dd' ),
        gender: staffFormValues.gender ? staffFormValues.gender : null
      }
      this.savedStaff = staff;

      this.savedStaffDetails = true;
      this.staffService.createUserAccount(accountDto)
        .subscribe( data => {
          this.globalMessagingService.displaySuccessMessage('success', 'Successfully Created Staff');

          let savedUser: NewAccountCreatedResponse = data;
          this.currentStaff = savedUser.accountCode;
          this.savedStaff.id = savedUser.accountCode;

          this.staffService.currentStaff.set(savedUser?.accountCode);

          sessionStorage.setItem('staffDetails', JSON.stringify(savedUser));
          // this.stepperComponent.next()
        });
    });
  }

  get f() { return this.staffRegistrationForm.controls; }

  getControl(control: string){
    return this.staffRegistrationForm.get(control);
  }

  lazyLoadAllUsers(event:TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';

    this.getIndividualUsers(pageIndex, sortField, sortOrder)
      .pipe(untilDestroyed(this))
      .subscribe((data:Pagination<StaffDto>) => {
        this.viewUsers = data;
        this.cdr.detectChanges();
      })
  }

  ngOnDestroy(): void {
  }


  getIndividualUsers(pageIndex: number,
                     sortList: any = 'dateCreated',
                     order: string = 'desc') {
    return this.staffService.getStaff(pageIndex, this.staffSize, 'U', sortList, order, null)
      .pipe(untilDestroyed(this));
  }
  onSupervisorSelect(event) {
    const nestedControl = this.staffRegistrationForm.get('employment_details.manager');
    nestedControl.patchValue(event.data.name);

    this.globalMessagingService.displayInfoMessage('User Selected', event.data.name);
  }

  onSupervisorUnselect(event: any) {
    document.querySelector<HTMLInputElement>('#individualUserInput').value = null;
    const nestedControl = this.staffRegistrationForm.get('employment_details.manager');
    nestedControl.patchValue('');
  }

  saveSelectedSupervisor() {
    const cancelBtn = this.cancelSupervisorSelect.nativeElement;
    cancelBtn.click();
  }

  searchUsers(name:string){
    this.staffService.searchStaff(0,5,null, name)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.viewUsers = data;
      })

  }
}
