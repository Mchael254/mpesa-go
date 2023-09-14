import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubclassClausesComponent } from './subclass-clauses.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {MessageService} from "primeng/api";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";
import {CoverTypeService} from "../../../services/cover-type/cover-type.service";
import {of} from "rxjs";
import {ClauseService} from "../../../../../services/clause/clause.service";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
    };
  }
}
 export class MockCoverTypeService {
   getAllCovertypes = jest.fn().mockReturnValue(of());
 }

export class MockClauseService {
  getAllSubclasses = jest.fn().mockReturnValue(of());
  getSubclasses = jest.fn().mockReturnValue(of());
  getAllSubclassClauses = jest.fn().mockReturnValue(of());
  getSingleClause = jest.fn().mockReturnValue(of());
  getSubclassClause = jest.fn().mockReturnValue(of());
  getSubclassCovertypeBySCode = jest.fn().mockReturnValue(of());
  getSingleSubclassCovertype = jest.fn().mockReturnValue(of());
  getCovertypeToClauses = jest.fn().mockReturnValue(of());
  deleteSubclassClause = jest.fn().mockReturnValue(of());
  updateSubclassClause = jest.fn().mockReturnValue(of());
  addSubclassClause = jest.fn().mockReturnValue(of());
  updateSubclassCoverType = jest.fn().mockReturnValue(of());
  createSubClassCoverTypeClause = jest.fn().mockReturnValue(of());
  deleteCovertypeToClauses = jest.fn().mockReturnValue(of());
  deleteSingleSubclassCovertype = jest.fn().mockReturnValue(of());
}

export class MockGlobalMessagingService {
  displaySuccessMessage= jest.fn();
}
describe('SubclassClausesComponent', () => {
  let component: SubclassClausesComponent;
  let fixture: ComponentFixture<SubclassClausesComponent>;
  let spinnerStub: NgxSpinnerService;
  let clauseServiceStub: ClauseService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let coverTypeServiceStub: CoverTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubclassClausesComponent],
      imports: [
        HttpClientTestingModule,
        NgxSpinnerModule.forRoot(),
        DropdownModule,
        TableModule,
        FormsModule, ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: GlobalMessagingService, MockGlobalMessagingService },
        { provide: MessageService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: CoverTypeService, useClass: MockCoverTypeService },
        { provide: ClauseService, useClass: MockClauseService },
        { provide: BankService}
      ]
    });
    fixture = TestBed.createComponent(SubclassClausesComponent);
    component = fixture.componentInstance;
    clauseServiceStub = TestBed.inject(ClauseService);
    spinnerStub = TestBed.inject(NgxSpinnerService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    coverTypeServiceStub = TestBed.inject(CoverTypeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and set subclasses', () => {

    const subclasses : any = [];
    jest.spyOn(clauseServiceStub, 'getAllSubclasses').mockReturnValue(of(subclasses) as any);

    component.loadAllSubclasses();

    expect(component.subclassList).toEqual(subclasses);
    expect(component.filteredSubClasses).toEqual(subclasses);
  });

  it('should load and set a subclass', () => {
    const subclassCode = 1;
    const subclassData = {};
    jest.spyOn(clauseServiceStub, 'getSubclasses').mockReturnValue(of(subclassData) as any);

    component.loadSubclass(subclassCode);
    expect(component.subclass).toEqual(subclassData);
  });

  it('should return true if the item is selected and false if the item is not selected', () => {
    const selectedItem = 'selectedItem';
    component.selected = selectedItem;

    const result = component.isActive(selectedItem);

    expect(result).toBe(true);

    const anotherItem = 'selectedItem2';

    const result2 = component.isActive(anotherItem);
    expect(result2).toBe(false);
  });

  it('should create subclassForm with code and description controls', () => {
    component.createForm();

    expect(component.subclassForm.get('code')).toBeDefined();
    expect(component.subclassForm.get('description')).toBeDefined();
  });
  it('should load subclass clauses and populate finalList', () => {

    const code = 'subclass3245';
    const subclassClauses = [
      { subClassCode: 'subclass3245', clauseCode: 'clause1' },
      { subClassCode: 'subclass3246', clauseCode: 'clause2' },
    ];

    jest.spyOn(clauseServiceStub, 'getAllSubclassClauses').mockReturnValue(of(subclassClauses) as any);
    jest.spyOn(clauseServiceStub, 'getSingleClause').mockReturnValue(of({}) as any);

    component.loadAllSubclassClauses(code);

    expect(component.finalList.length).toBe(1);
    // expect(component.finalList[0]).toEqual({ clauseCode: 'clause1' } ); // Ensure the expected clause is in finalList
  });

  it('should load a single subclass clause', () => {
    // Arrange
    const code = 'yourClauseCode'; // Replace with a valid clause code
    component.subclass = { code: 'yourSubclassCode' }; // Provide a valid subclass
    const version = component.editClauseForm.controls['version'];

    jest.spyOn(clauseServiceStub, 'getSubclassClause').mockReturnValue(of({}) as any);
    jest.spyOn(component.editClauseForm, 'patchValue');
    jest.spyOn(version, 'setValue');

    component.loadSingleSubclassClause(code);

    expect(component.editClauseForm.patchValue).toHaveBeenCalledWith({}); // Ensure patchValue was called
    expect(component.editClauseForm.controls['version'].setValue).toHaveBeenCalledWith(0); // Ensure version control was set to 0
  });

  it('should load subclass cover types', () => {
    const code = 'subclass23';

    jest.spyOn(clauseServiceStub, 'getSubclassCovertypeBySCode').mockReturnValue(of({}) as any);

    component.loadSubclassCovertypes(code);

    expect(component.subclassCovertype).toEqual({});
  });

  it('should load single subclass cover type', () => {

    const code = 'CoverTypeCode12';
    component.subclass = { code: 'subclassCode122' };

    jest.spyOn(clauseServiceStub, 'getSingleSubclassCovertype').mockReturnValue(of({}) as any);
    jest.spyOn(clauseServiceStub, 'getCovertypeToClauses').mockReturnValue(of([]) as any);
    jest.spyOn(clauseServiceStub, 'getSubclassClause').mockReturnValue(of({}) as any);

    component.singleSCoverType(code);

    expect(code).toEqual('CoverTypeCode12');
    expect(component.covertypetoclause).toEqual([]);
    expect(component.covertypetoclauseList).toEqual([]);
    expect(component.singleClause).toEqual({});
  });

  it('should load all clauses', () => {
    jest.spyOn(clauseServiceStub, 'getAllSubclassClauses').mockReturnValue(of([]) as any);

    component.loadClauses();

    expect(component.allClauses).toEqual([]);
  });

  it('should delete a subclass clause', () => {
    const clauseCode = '123';
    const subclassCode = '456';

    const clauseCodeInput = component.editClauseForm.controls['clauseCode'];
    jest.spyOn(clauseServiceStub, 'deleteSubclassClause').mockReturnValue(of([]) as any);

    component.deleteSubClassClause();

    expect(component.allClauses).toEqual([]);
    /*expect(clauseServiceStub.deleteSubclassClause).toHaveBeenCalledWith(
      clauseCode,
      subclassCode
    );*/
  });

  it('should load a single clause', () => {
    const clauseCode = '245';
    const subCode = '458';

    jest.spyOn(clauseServiceStub, 'getSubclassClause').mockReturnValue(of([]) as any);
    component.loadsingleclause(clauseCode, subCode);

    expect(clauseServiceStub.getSubclassClause).toHaveBeenCalledWith(
      clauseCode,
      subCode
    );
  });

  /*it('should update subclass clauses', () => {
    // Mock the clause code, subclass code, and form values
    const clauseCode = 'yourClauseCode'; // Replace with a valid clause code
    const subCode = 'yourSubclassCode'; // Replace with a valid subclass code
    /!*const formValues = {
      clauseCode: 'yourUpdatedClauseCode', // Replace with an updated clause code
      // Add other form values as needed
    };*!/

    // Mock an updated clause object with the expected changes
    /!*const updatedClause = {
      ...formValues,
      shortDescription: 'First loss Memo',
    };*!/
    const updatedClause = component.editClauseForm.controls['shortDescription'];
    updatedClause.setValue('First loss Memo')

    /!*const updatedClause = component.editClauseForm.controls['shortDescription'];
    updatedClause.setValue('First loss Memo')*!/

    const formValue = component.editClauseForm.controls['clauseCode'];
    // Call the function to be tested
    formValue.setValue(clauseCode); // Set the form values
    component.updateSubclassClauses(); // Call the function

    // Expect that updateSubclassClause was called with the correct arguments
    expect(clauseServiceStub.updateSubclassClause).toHaveBeenCalledWith(
      updatedClause, // Pass the expected updated clause object
      clauseCode, // Replace with the expected clause code
      subCode // Replace with the expected subclass code
    );
  });*/

  it('should add subclass clauses', () => {
    component.selectedClause = { clauseId: 1 };
    jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');
    component.addSubclassClauses();

    expect(clauseServiceStub.addSubclassClause).toHaveBeenCalledWith(component.selectedClause);

  });

  it('should filter subClasses', () => {
    // Set up test data
    component.subclassList = [
      { description: 'SubClass1' },
      { description: 'SubClass2' },
      { description: 'SubClass3' },
    ];

    const event = { target: { value: 'subclass2' } };

    component.filterSubClasses(event);
    expect(component.filteredSubClasses).toEqual([]);

  });

  it('should delete cover type clauses', () => {
    component.covertypeCode = 123;
    jest.spyOn(clauseServiceStub, 'deleteSingleSubclassCovertype').mockReturnValue(of('') as any);

    component.deleteCoverTypeClauses();

    expect(clauseServiceStub.deleteSingleSubclassCovertype).toHaveBeenCalledWith(123);
  });

  it('should fetch cover types', () => {
    const mockCoverTypeData = [
      {
        code: 1,
        short_description:'' ,
        description:'',
        details: '',
        minimum_sum_insured: 4,
        downgrade_on_suspension: '',
        downgrade_on_suspension_to: '',
        organization_code: 4,
        version:4,
      },
      ];
    jest.spyOn(coverTypeServiceStub, 'getAllCovertypes').mockReturnValue(of({ _embedded: { cover_type_dto_list: mockCoverTypeData } }));

    component.getCoverTypes();

    expect(coverTypeServiceStub.getAllCovertypes).toHaveBeenCalled();
    expect(component.coverTypeData).toEqual(mockCoverTypeData);
  });

  it('should update subclass cover type', () => {
    const mockResponse = {
      certificate_type_code: 0,
      certificate_type_short_description: '',
      code: 0,
      cover_type_code: 0,
      cover_type_short_description: '',
      default_sum_insured: 0,
      description: '',
      installment_period: '',
      installment_type: '',
      is_default: '',
      maximum_installments: 0,
      minimum_premium: 0,
      organization_code: 0,
      payment_installment_percentage: 0,
      sub_class_code: 0,
      sum_insured_currency_code: 0,
      sum_insured_exchange_rate: 0,
      survey_evaluation_required: ''
    };
    jest.spyOn(clauseServiceStub, 'updateSubclassCoverType').mockReturnValue(of(mockResponse));

    const addEditForm = component.addEditCoverTypeForm.controls;

    component.updateSubclassCoverType();
    expect(clauseServiceStub.updateSubclassCoverType).toHaveBeenCalled();

  });

  it('should create subClass cover type clause', () => {
    const mockResponse = [{
      code: 0,
      subClassCode: 0,
      subClassCoverTypeCode: 0,
      clausesShortDescription: '',
      clauseCode: 0,
      isMandatory: '',
      version: 0
    }];
    jest.spyOn(clauseServiceStub, 'createSubClassCoverTypeClause').mockReturnValue(of(mockResponse));

    const event = {
      items: [
        {
          code: '12',
          clauseCode: '778',
        },
      ],
    };

    component.onMoveItems(event);

    expect(clauseServiceStub.createSubClassCoverTypeClause).toHaveBeenCalled();

  });

  it('should delete covertype to clauses', () => {
    const mockResponse = {
      code:0,
      subClassCode: 0,
      subClassCoverTypeCode: 0,
      clausesShortDescription: '',
      clauseCode: 0,
      isMandatory: '',
      version: 0
    };
    jest.spyOn(clauseServiceStub, 'deleteCovertypeToClauses').mockReturnValue(of(mockResponse));

    const event = {
      items: [
        {
          code: '12',
        },
      ],
    };

    component.deleteOnMoveItem(event);

    expect(clauseServiceStub.deleteCovertypeToClauses).toHaveBeenCalled();
  });

  it('should load cover type clauses', () => {
    const mockResponse = {
      certificateTypeCode: 0,
      certificateTypeShortDescription: '',
      code: 0,
      coverTypeCode:0,
      coverTypeShortdescription: '',
      defaultSumInsured: 0,
      description: '',
      installmentPeriod: '',
      installmentType: '',
      isDefault: '',
      maximumInstallments: 0,
      minimumPremium: 0,
      organizationCode: 0,
      paymentInstallmentPercentage: 0,
      subClassCode: 0,
      sumInsuredCurrencyCode: 0,
      sumInsuredExchangeRate: 0,
      surveyEvaluationRequired: ''
    };
    jest.spyOn(clauseServiceStub, 'getSingleSubclassCovertype').mockReturnValue(of(mockResponse));

    const code = 3;

    component.loadCoverTypeClauses(code);

    expect(clauseServiceStub.getSingleSubclassCovertype).toHaveBeenCalledWith(code);

  });
});
