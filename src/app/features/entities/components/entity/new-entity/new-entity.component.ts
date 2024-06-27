import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicFormButtons } from '../../../../../shared/utils/dynamic.form.button';
import { DynamicFormFields } from '../../../../../shared/utils/dynamic.form.fields';
import { EntityService } from '../../../services/entity/entity.service';
import { BreadCrumbItem } from '../../../../../shared/data/common/BreadCrumbItem';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { MandatoryFieldsService } from '../../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../../core/config/app-config-service';
import { UtilService } from '../../../../../shared/services/util/util.service';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { PartyTypeDto } from '../../../data/partyTypeDto';
import { EntityDto, EntityResDTO, IdentityModeDTO } from '../../../data/entityDto';
import { Logger } from '../../../../../shared/services/logger/logger.service';

const log = new Logger('NewEntityComponent');

@Component({
  selector: 'app-new-entity',
  templateUrl: './new-entity.component.html',
  styleUrls: ['./new-entity.component.css']
})
export class NewEntityComponent implements OnInit {

  @ViewChild('closebutton') closebutton;

  public entityRegistrationForm: FormGroup;
  public selectRoleModalForm: FormGroup;
  url = ""
  fileToUpload = ""
  roleName : string;
  selectedItem: any;

  public fieldsets: DynamicFormFields[];
  public stepsData: DynamicFormFields[];
  public buttonConfig: DynamicFormButtons;

  entityBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'New Entity',
      url: '/home/entity/new'
    }
  ];

  private today = new Date();
  public eighteenYearsAgo: Date = new Date (this.today.setFullYear(this.today.getFullYear() - 18));

  roleType: PartyTypeDto[] = [];
  modeIdentityType: IdentityModeDTO[] = [];
  disableRole: boolean = false;
  public selectedRole: PartyTypeDto;

  public partyLevel1: PartyTypeDto[] = [];
  public partyLevel2: PartyTypeDto[] = [];
  selectedFile: File;
  public imageSrc:  string | Uint8Array;
  public savedEntity: EntityDto;
  passportRegex: string;
  pinNumberRegex: string;
  birthCertRegex: string;
  nationalIDRegex: string;
  alienNumberRegex: string;
  hudumaNumberRegex: string;
  registrationNumberRegex: string;
  driversLicenseNumberRegex: string;
  certOfIncorporationNumberRegex: string;
  groupId: string = 'entityTab';
  submitted = false;
  errorsMessages = [
    {  name: 'category',  message: 'Invalid Category' },
    { name:  'date_of_birth', message: 'Invalid DOB' },
    { name:  'mode_of_identity', message: 'Invalid Mode of ID' },
    { name:  'entity_name', message: 'Invalid Entity Name' },
    { name:  'identity_number', message: 'Invalid ID Number' },
    { name:  'pin_number', message: 'Invalid Pin Number' },
    { name:  'assign_role', message: 'Invalid Role' },
    { name:  'profilePiture', message: 'Invalid Profile picture' },
  ]

  visibleStatus: any = {
    category: 'Y',
    date_of_birth: 'Y',
    mode_of_identity: 'Y',
    entity_name: 'Y',
    identity_number: 'Y',
    pin_number: 'Y',
    assign_role: 'Y',
    profilePiture: 'Y',
  };

  constructor(
    private fb: FormBuilder,
    private entityService: EntityService,
    private globalMessagingService: GlobalMessagingService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private appConfig: AppConfigService,
    private utilService: UtilService
  ) {
      this.selectedRole = {};
      this.passportRegex = this.appConfig.config.organization.passport_regex;
      this.pinNumberRegex = this.appConfig.config.organization.pin_regex;
      this.birthCertRegex = this.appConfig.config.organization.birth_cert_regex;
      this.nationalIDRegex = this.appConfig.config.organization.national_ID_regex;
      this.alienNumberRegex = this.appConfig.config.organization.alien_number_regex;
      this.hudumaNumberRegex = this.appConfig.config.organization.huduma_number_regex;
      this.registrationNumberRegex = this.appConfig.config.organization.registration_number_regex;
      this.driversLicenseNumberRegex = this.appConfig.config.organization.drivers_license_number_regex;
      this.certOfIncorporationNumberRegex = this.appConfig.config.organization.cert_of_incorporation_number_regex;
  }
 /**
  * The ngOnInit function initializes the component by creating forms, setting the role name based on a
  * query parameter, and retrieving parties and identity types.
  */
  ngOnInit(): void {
    this.createEntityRegForm();
    this.createSelectRoleForm();
    this.roleName = this.route.snapshot.queryParamMap.get('entityType');
    this.getPartiesType();
    this.getIdentityType();
  }

  ngOnDestroy(): void {}

/**
 * The function creates a form for entity registration with various fields and applies validators and
 * visibility settings based on the response from an API call.
 */
  createEntityRegForm() {
    this.entityRegistrationForm =  this.fb.group({
      category: [''],
      date_of_birth: [''],
      mode_of_identity: [''],
      entity_name: [''],
      identity_number: ['', Validators.pattern(this.nationalIDRegex)],
      pin_number: ['', Validators.pattern(this.pinNumberRegex)],
      assign_role: [{ value: '', disabled: true }],
      profilePiture: [''],
    });


    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.entityRegistrationForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.entityRegistrationForm.controls[key].addValidators(Validators.required);
                this.entityRegistrationForm.controls[key].updateValueAndValidity();
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
  }

 /**
  * The function creates a form for selecting a role with a required partyType field.
  */
  createSelectRoleForm() {
    this.selectRoleModalForm = this.fb.group({
      partyType: ['', Validators.required],
    });
  }

  /**
   * The function returns the controls of the entity registration form.
   * @returns The function `f()` is returning the `controls` property of the `entityRegistrationForm`
   * object.
   */
  get f() { return this.entityRegistrationForm.controls; }

  /**
   * The function `getPartiesType()` retrieves party types from an entity service and assigns them to
   * various variables for further use.
   */
  getPartiesType()
  {
    this.entityService.getPartiesType()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((data: PartyTypeDto[]) => {
        this.roleType = data;
        this.partyLevel1 = data.filter(x => x.partyTypeLevel === 1);
        this.partyLevel2 = data.filter(x => x.partyTypeLevel !== 1);
        this.setRolesType(data);
      })
  }

 /**
  * The function `getIdentityType()` retrieves identity types from an entity service and assigns them
  * to the `modeIdentityType` variable.
  */
  getIdentityType() {
    this.entityService.getIdentityType()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((data: IdentityModeDTO[]) => {
        this.modeIdentityType = data;
      })
  }

/**
 * The function "onAssignRole" assigns a role to a user and updates the form control value.
 * @param role - The `role` parameter is the role that is being assigned to the user.
 */
  onAssignRole(role) {
    this.selectedRole = role;
    if(!this.roleName) {
      this.roleName = this.selectedRole.partyTypeName
    }
    this.entityRegistrationForm.controls['assign_role'].setValue(this.selectedRole?.partyTypeName);
    this.closebutton.nativeElement.click();
  }

/**
 * The function sets the role type based on the selected role name and updates the form control and
 * disable flag accordingly.
 * @param {PartyTypeDto[]} roleType - An array of objects of type PartyTypeDto, which contains
 * information about different party types.
 */
  setRolesType(roleType: PartyTypeDto[]){
    const selectedItem = roleType?.filter( x  => x.partyTypeName?.toLowerCase() === this.roleName?.toLowerCase());
    this.selectedItem = selectedItem[0];
    this.entityRegistrationForm.controls['assign_role'].setValue(this.selectedItem?.partyTypeName);
    if (this.entityRegistrationForm.get('assign_role').value) this.disableRole = true;
  }

/**
 * The function "onFileChange" is triggered when a file is selected, and it reads the file using
 * FileReader, sets the selectedFile and url variables, and logs the url.
 * @param event - The event parameter is the event object that is triggered when a file is selected or
 * changed in the file input field.
 */
  onFileChange(event) {
    if (event.target.files) {
      var reader = new FileReader()
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.cdr.detectChanges();
        log.info(this.url);
      }
    }
  }

 /**
  * The `onSubmit()` function is used to handle form submission, perform validation, and save entity
  * details.
  * @returns The method returns nothing (void).
  */
  onSubmit()
   {
     this.submitted = true;
     this.entityRegistrationForm.markAllAsTouched(); // Mark all form controls as touched to show validation errors

     if (this.entityRegistrationForm.invalid) {
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

       // this.globalMessagingService.displayErrorMessage('Failed', 'Form is Invalid, Fill all required fields');
       return; // Exit the method if the form is invalid
     }
     sessionStorage.removeItem('entityDetails');
     const entityFormValues = this.entityRegistrationForm.getRawValue();
     const partyTypeId = this.selectedItem ? this.selectedItem.id : this.selectedRole.id;
     const saveEntity: EntityResDTO = {
       category: entityFormValues.category,
       effectiveDateFrom: null,
       effectiveDateTo: null,
       modeOfIdentityId: entityFormValues.mode_of_identity,
       identityNumber: entityFormValues.identity_number,
       name: entityFormValues.entity_name,
       organizationId: null,
       partyTypeId: partyTypeId,
       pinNumber: entityFormValues.pin_number,
       profileImage: entityFormValues.profileImage,
       dateOfBirth: entityFormValues.date_of_birth
     }

     this.entityService.saveEntityDetails(saveEntity)
       // .pipe(finalize(() => this.uploadImage(this.savedEntity.id)))
       .subscribe({
        next: (data) => {
          data.partyTypeId = saveEntity.partyTypeId;
         this.savedEntity = data;
         if (this.selectedFile) {
           this.uploadImage(this.savedEntity.id);
         } else {
           this.globalMessagingService.clearMessages();
           this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created an Entity');
           this.goToNextPage();
         }
        },
        error: (err) => {
          const errorMessage = err?.error?.message ?? err.message + `: ${err?.error?.errors[0]}`
          this.globalMessagingService.displayErrorMessage('Error', `${errorMessage} ::: ${err?.error?.errors[0]}`);
        }
       })
  }

  /**
   * The function `uploadImage` uploads an image file to the server and updates the profile picture and
   * image of an entity, then displays a success message and navigates to the next page.
   * @param {number} entityId - The entityId parameter is a number that represents the unique
   * identifier of an entity.
   */
  uploadImage(entityId: number){
    this.entityService.uploadProfileImage(entityId, this.selectedFile)
      .subscribe( res => {
        log.info(res);
        this.savedEntity.profilePicture = res.file;
        this.savedEntity.profileImage = res.file;
        this.entityService.setCurrentEntity(this.savedEntity);
        this.globalMessagingService.clearMessages();
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created an Entity');
        this.goToNextPage();
      });
  }

 /**
  * The function `goToNextPage()` navigates to a specific URL based on the role name and saves the
  * entity details in session storage.
  */
  goToNextPage(){
    let url: string;
    let id: number = this.savedEntity.id;
    switch (this.roleName?.toLocaleLowerCase()) {
      case 'staff':
        url = '/home/entity/staff/new';
        break;
      case 'client':
        url = '/home/entity/client/new';
        break;
      case 'agent':
        url = '/home/entity/intermediary/new';
        break;
      case 'service provider':
        url = 'home/entity/service-provider/new'
        break;
      default:
        url = '/home/entity';
    }
    sessionStorage.setItem('entityDetails', JSON.stringify(this.savedEntity));
    this.entityService.setCurrentEntity(this.savedEntity);
    this.router.navigate([url],
      {queryParams: {id: id}});
  }
}
