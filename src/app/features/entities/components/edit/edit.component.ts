import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientTitleDTO} from "../../../../shared/data/common/client-title-dto";
import {EntityService} from "../../services/entity/entity.service";
import {take} from "rxjs/operators";
import {OccupationDTO} from "../../../../shared/data/common/occupation-dto";
import {DepartmentDto} from "../../../../shared/data/common/departmentDto";
import {DynamicFormFields} from "../../../../shared/utils/dynamic.form.fields";
import {DynamicFormButtons} from "../../../../shared/utils/dynamic.form.button";
import { EntityDetails } from '../../data/entity-details-data'
import {DepartmentService} from "../../../../shared/services/setups/department.service";
import {OccupationService} from "../../../../shared/services/setups/occupation.service";

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

  public titlesData : ClientTitleDTO[];
  public occupationData: OccupationDTO[];
  public staffDepartments: DepartmentDto[];

  // ================//
  public fieldsets: DynamicFormFields[];
  public stepsData: DynamicFormFields[];
  public buttonConfig: DynamicFormButtons;

  constructor(
    private fb: FormBuilder,
    private entityService: EntityService,
    private entityDetails: EntityDetails,
    private departmentService: DepartmentService,
    private occupationService: OccupationService
  ) {
  }

  ngOnInit(): void {
    this.createAccountDetailsForm();
    this.fetchClientTitles(1);
    this.fetchOccupations(2);
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


    /*this.accountService
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
      );*/
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



}
