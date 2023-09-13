import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {CreateStaffDto, StaffDto} from "../../../data/StaffDto";
import {EntityDto} from "../../../data/entityDto";
import {CountryDto, StateDto, TownDto} from "../../../../../shared/data/common/countryDto";
import {DepartmentDto} from "../../../../../shared/data/common/departmentDto";
import {OrganizationBranchDto} from "../../../../../shared/data/common/organization-branch-dto";
import {StaffService} from "../../../services/staff/staff.service";
import {EntityService} from "../../../services/entity/entity.service";
import {CountryService} from "../../../../../shared/services/setups/country/country.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {DepartmentService} from "../../../../../shared/services/setups/department/department.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {BranchService} from "../../../../../shared/services/setups/branch/branch.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {DatePipe} from "@angular/common";
import {CreateAccountDTO, NewAccountCreatedResponse} from "../../../data/accountDTO";
import {TableLazyLoadEvent} from "primeng/table";
import {FormStateService} from "../../../../../shared/services/form-state/form-state.service";
import {FormState} from "../../../../../shared/data/form-state";
import {AuthService} from "../../../../../shared/services/auth.service";
import {Logger} from "../../../../../shared/services/logger/logger.service";
import {UtilService} from "../../../../../shared/services/util/util.service";

const log = new Logger('StaffProfileComponent');

@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.css']
})
export class StaffProfileComponent implements OnInit, OnDestroy{
  @ViewChild('cancelSupervisorSelection', {read: ElementRef}) cancelSupervisorSelect: ElementRef;
  @Output() saved = new EventEmitter<boolean>();

  public staffRegistrationForm: FormGroup;
  staffProfileTempData: any;

  staffProfileFormState: FormState = {
    componentName: 'StaffProfile',
    formName: 'staff-profile',
    persisted: false,
    data: null,
    currentUser: this.authService.getCurrentUserName()
  }
  staffProfileFormStateKey: string = this.staffProfileFormState.formName
    + '_' + this.staffProfileFormState?.currentUser;

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

  viewUsers: Pagination<StaffDto> = <Pagination<StaffDto>>{};

  selectedUser: StaffDto;
  entityDetails: EntityDto;

  countries: CountryDto[] = [];
  cities: StateDto[] = [];
  towns: TownDto[] = [];
  departments: DepartmentDto[] = [];
  branches: OrganizationBranchDto[] = [];
  apps: any[] = [];

  profileDetails: any;
  groupId: string = 'staffTab';
  submitted = false;
  savedStaffDetails: boolean = false;
  staffSize: number = 5;

  private savedStaff: CreateStaffDto;
  private currentStaff: number;

  private _listFilter: string;
  private _usernameFilter: string;
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
              private departmentService: DepartmentService,
              private globalMessagingService: GlobalMessagingService,
              private cdr: ChangeDetectorRef,
              private utilService: UtilService,
              private branchService: BranchService,
              private formStateService: FormStateService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.fetchFormStateValues();
    this.fetchEntityById();
    this.fetchCountries();
    this.fetchDepartments();
    this.fetchBranches();
    this.createUserRegForm();
  }

  /**
   * This method is used to fetch the form state values
   */
  fetchFormStateValues(){
    this.staffProfileTempData = this.formStateService.getFormState(this.staffProfileFormStateKey);

    if(this.staffProfileTempData?.persisted)
      this.staffProfileTempData = null;
  }

  /**
   * This method is used to fetch the entity by id
   */
  fetchEntityById(){
    if(!!this.entityService.currentEntity$){
      this.entityService.currentEntity$
        .subscribe( data => {
            this.entityDetails = data;
          }
        );
    }
  }

  /**
   * This method is used to fetch the countries
   */
  fetchCountries(){
    this.countryService.getCountries()
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.countries = data;
      });
  }

  /**
   * This method is used to fetch the departments
   */
  fetchDepartments(){
    this.departmentService.getDepartments(2)
      .pipe(untilDestroyed(this))
      .subscribe(
        (departmentList) => {
          this.departments = departmentList;
        }
      )
  }

  /**
   * This method is used to fetch the organization branches
   */
  fetchBranches() {
    this.branchService
      .getBranches(2)
      .pipe(untilDestroyed(this)
      )
      .subscribe( (branches) => {
        this.branches = branches;
      });
  }

  /**
   * This method is used to create the user registration form
   * It sets the mandatory fields as required
   * It also patches the form with the values from the temp data stored in the form state service or the entity details from the entity service
   */
  createUserRegForm() {
    this.staffRegistrationForm = this.fb.group({
      firstName: [{value: '', disabled: true}],
      lastName: [{value: '', disabled: true}],
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
        manager: [{value: '', disabled: true}],
        branch: [''],
        personelRank: ['']
      }),
      telNo: [''],
      postalCode: [''],
      pinNumber: [{value: '', disabled: true}],
      gender: [''],
      dateOfBirth: [''],
      idNumber: ['']
    });
    this.profileDetails = JSON.parse(sessionStorage.getItem('partyProfileDetails'));

    let staffProfileFormValue = this.formStateService.getFormState(this.staffProfileFormStateKey);

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

    if(staffProfileFormValue){
      this.patchStaffTempData(staffProfileFormValue.data);
      log.info('>>>>> staffProfileFormValue: ', staffProfileFormValue);
    }
    else{
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
        const datePipe = new DatePipe('en-GB'); //TODO: Proper way to fetch locales via constructor injection token
        this.staffRegistrationForm.get('dateOfBirth').patchValue(datePipe.transform(this.entityDetails?.dateOfBirth, 'yyyy-MM-dd'));
      }
    }

    this.staffRegistrationForm.valueChanges.subscribe( newValues => {
      this.staffProfileTempData = this.staffRegistrationForm.getRawValue();
      this.staffProfileFormState.data = {formData: this.staffRegistrationForm.getRawValue(), entityDetails: this.entityDetails};
      this.staffProfileFormState.uniqueKey = this.entityDetails?.id;
      this.formStateService.saveFormState(this.staffProfileFormStateKey, this.staffProfileFormState);
    })
  }

  /**
   * This method is used to fetch the towns for the selected country
   * @param countryId - The country id
   */
  fetchTownsByCountry(countryId:number){
    log.info(`Fetching towns list for country, ${countryId}`);
    this.countryService.getTownsByCountry(countryId)
      .subscribe( (data) => {
        this.towns = data;
      })
  }

  /**
   * This method is used to fetch the city states for the selected country
   * @param countryId - The country id
   */
  fetchCityStatesByCountry(countryId: number){
    this.countryService.getMainCityStatesByCountry(countryId)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.cities = data;
      });
  }

  /**
   * This method is used to handle the country change event
   * It fetches the city states and towns for the selected country
   * @param event
   */
  onCountryChange(event: { value: any; }) {
    let selectedCountry = event.value;

    if(selectedCountry ){
      this.fetchCityStatesByCountry(selectedCountry);
      this.fetchTownsByCountry(selectedCountry);
    }
  }

  /**
   * This method is used to save the staff profile
   * It checks if staff profile form is valid
   * If valid, it saves the staff profile
   * If not valid, it displays an error message and highlights the invalid fields
   */
  onSubmit(){
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

          this.submitted = true;

          this.staffService.setNewStaffAccount(this.savedStaff);
          this.staffProfileFormState.persisted = true;
          this.formStateService.destroyFormState(this.staffProfileFormStateKey);

          this.saved.emit(true);
        });
    });
  }

  get f() { return this.staffRegistrationForm.controls; }

  /**
   * This method is used to load all users
   * @param event
   */
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

  /**
   * This method is used to get the list of individual users
   * @param pageIndex - The page index
   * @param sortList - The sort list
   * @param order -  The sort order as desc or asc
   */
  getIndividualUsers(pageIndex: number,
                     sortList: any = 'dateCreated',
                     order: string = 'desc') {
    return this.staffService.getStaff(pageIndex, this.staffSize, 'U', sortList, order, null)
      .pipe(untilDestroyed(this));
  }

  /**
   * This method is used to select a supervisor
   * @param event
   */
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

  /**
   * This method is used to save the selected supervisor
   */
  saveSelectedSupervisor() {
    const cancelBtn = this.cancelSupervisorSelect.nativeElement;
    cancelBtn.click();
  }

  /**
   * This method is used to search for users by name
   * @param name - The name of the user to search for
   */
  searchUsers(name:string){
    this.staffService.searchStaff(0,5,null, name)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.viewUsers = data;
      })

  }

  /**
   * This method is used to patch the form with the values from the temp data stored in the form state service
   * @param staffProfileValues
   * @private
   */

  private patchStaffTempData(staffProfileValues: any) {
    this.staffRegistrationForm.patchValue({
      userType: staffProfileValues.formData.userType,
      firstName: staffProfileValues.formData.firstName,
      lastName: staffProfileValues.formData.lastName,
      pinNumber: staffProfileValues.formData.pinNumber,
      username: staffProfileValues.formData.username,
      contact_details: {
        countryCode: staffProfileValues.formData.contact_details.countryCode,
        townCode: staffProfileValues.formData.contact_details.townCode,
        city: staffProfileValues.formData.contact_details.city,
        physicalAddress: staffProfileValues.formData.contact_details.physicalAddress,
        phoneNumber: staffProfileValues.formData.contact_details.phoneNumber,
        otherPhone: staffProfileValues.formData.contact_details.otherPhone,
        email: staffProfileValues.formData.contact_details.email
        },
      employment_details: {
        departmentCode: staffProfileValues.formData.employment_details.departmentCode,
        manager: staffProfileValues.formData.employment_details.manager,
        branch: staffProfileValues.formData.employment_details.branch,
        personelRank: staffProfileValues.formData.employment_details.personelRank
      },
      telNo: staffProfileValues.formData.telNo,
      postalCode: staffProfileValues.formData.postalCode,
      gender: staffProfileValues.formData.gender,
      dateOfBirth: staffProfileValues.formData.dateOfBirth,
      idNumber: staffProfileValues.formData.idNumber
    });

    this.entityDetails = staffProfileValues.entityDetails;

    // if(!this.entityDetails){
    //   this.entityDetails.id = this.staffProfileFormState.uniqueKey;
    //   this.entityService.getEntityById(this.entityDetails.id)
    //     .pipe(untilDestroyed(this))
    //     .subscribe( entity => this.entityDetails = entity);
    // }
  }

  ngOnDestroy(){
    this.formStateService.destroyFormState(this.staffProfileFormStateKey);
  }
}
