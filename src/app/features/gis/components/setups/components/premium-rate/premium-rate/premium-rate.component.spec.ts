import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumRateComponent } from './premium-rate.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { PremiumRateService } from '../../../services/premium-rate/premium-rate.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { SubclassesService } from '../../../services/subclasses/subclasses.service';
import { BinderService } from '../../../services/binder/binder.service';

export class mockPremiumRateService{
  getAllPremiums=jest.fn().mockReturnValue(of());
  getPremiums=jest.fn().mockReturnValue(of());
  createPremium=jest.fn().mockReturnValue(of());
  updatePremium=jest.fn().mockReturnValue(of());
  deletePremium=jest.fn().mockReturnValue(of());
}
export class mockSubclassService{
  getAllSubclasses=jest.fn().mockReturnValue(of());
  getSubclasses=jest.fn().mockReturnValue(of());
  getSubclassSectionBySCode=jest.fn().mockReturnValue(of());
}
export class mockBinderService{
  getAllBinders=jest.fn().mockReturnValue(of());
  getBinders=jest.fn().mockReturnValue(of());
}
const mockSubclassList = [{
  accomodation: 'Mock-Test',
  allowsDeclaration: 'Mock-Test',
  bondSubclass: 'Mock-Test',
  certificatePrefix: 'Mock-Test',
  claimGracePeriod:'Mock-Test',
  claimPrefix: 'Mock-Test',
  claimReviewDays: 'Mock-Test',
  claimScreenCode: 'Mock-Test',
  classCode: 'Mock-Test',
  code: 'Mock-Test',
  declarationPenaltyPercentage: 'Mock-Test',
  description: 'Mock-Test',
  doesDisabilityScaleApply: 'Mock-Test',
  doesLoanApply: 'Mock-Test',
  doesReinsurancePoolApply: 'Mock-Test',
  doesTerritoryApply: 'Mock-Test',
  enableSchedule: 'Mock-Test',
  expiryPeriod: 'Mock-Test',
  freeCoverLimit: 'Mock-Test',
  generateCertificateAutomatically: 'Mock-Test',
  glAccountGroupCode: 'Mock-Test',
  isConveyanceTypeRequired: 'Mock-Test',
  isExcessOfLossApplicable: 'Mock-Test',
  isMandatory: 'Mock-Test',
  isQuakeRegionRequired: 'Mock-Test',
  isRenewable: 'Mock-Test',
  isRescueMandatory: 'Mock-Test',
  isRiskAddressRequired:'Mock-Test',
  isRiskClassMandatory: 'Mock-Test',
  isStraightFlowEnabled: 'Mock-Test',
  isSurveyValuationRequired: 'Mock-Test',
  maxDeclarationPercentage:'Mock-Test',
  maxInsuredAccumulationLimit: 'Mock-Test',
  maxNoClaimDiscountLevel: 'Mock-Test',
  maxPolicyAccumulationLimit: 'Mock-Test',
  noCertificate: 'Mock-Test',
  noRiSi: 'Mock-Test',
  organizationCode: 'Mock-Test',
  overrideReq: 'Mock-Test',
  policyPrefix: 'Mock-Test',
  prereqSubclassCode:'Mock-Test',
  reinsureWotRiProg: 'Mock-Test',
  reportParameter: 'Mock-Test',
  riskDummy: 'Mock-Test',
  riskExpireTotalLoss: 'Mock-Test',
  riskIdFormat:'Mock-Test',
  screenCode: 'Mock-Test',
  shortDescription: 'Mock-Test',
  showButcharge: 'Mock-Test',
  showNoClaimDiscount: 'Mock-Test',
  subClassId: 'Mock-Test',
  surveyLimitAccumulation:'Mock-Test',
  totalCompanyAccumulationLimit: 'Mock-Test',
  underwritingScreenCode: 'Mock-Test',
  uniqueRisk: 'Mock-Test',
  useCoverPeriodRate: 'Mock-Test',
  webSubclassDetails: 'Mock-Test',
  withEffectFrom: 'Mock-Test',
  withEffectTo: 'Mock-Test'
}];
const sectionList = {
  description: 'Mock Test',
  name: 'Mock Test',
  code: 123,
  declaration: 'Mock Test',
  excessDetails: 'Mock Test',
  newSectionCode: 123,
  newSectionShortDescription: 'Mock Test',
  sectionCode: 123,
  sectionShortDescription: 'Mock Test',
  sectionType: 'Mock Test',
  subclassCode: 'Mock Test',
  szaCode: 123,
  szaShortDesc: 'Mock Test',
  version: 0,
  wef: 'Mock Test',
  wet: 'Mock Test'
}; 
const mockPremium = {
  binderCode: 'binderCodeValue',
  cashBackLevel: '',
  dateWithEffectFrom: '',
  dateWithEffectTo: '',
  divisionFactor: '',
  doesCashBackApply: '',
  freeLimit: '',
  isExProtectorApplication: '',
  isNoClaimDiscountApplicable: '',
  isSumInsuredLimitApplicable: 'Y',
  maximumRate: '',
  minimumRate: '',
  multiplierDivisionFactor: '',
  multiplierRate: '',
  noClaimDiscountLevel: '',
  premiumEndorsementMinimumAmount: '',
  premiumMinimumAmount: '',
  proratedOrFull: '',
  rangeFrom: '',
  rangeTo: '',
  rate: '',
  rateDescription: '',
  rateFrequencyType: '',
  rateType: '',
  sectionCode: 'sectionCodeValue',
  sectionShortDescription: null,
  subClassCode: 'subClassCodeValue',
};
const expectedFormValue = {
  binderCode: '',
  cashBackLevel: '',
  dateWithEffectFrom: '',
  dateWithEffectTo: '',
  divisionFactor: '',
  doesCashBackApply: '',
  freeLimit: '',
  isExProtectorApplication: '',
  isNoClaimDiscountApplicable: '',
  isSumInsuredLimitApplicable: '',
  maximumRate: '',
  minimumRate: '',
  multiplierDivisionFactor: '',
  multiplierRate: '',
  noClaimDiscountLevel: '',
  premiumEndorsementMinimumAmount: '',
  premiumMinimumAmount: '',
  proratedOrFull: '',
  rangeFrom: '',
  rangeTo: '',
  rate: '',
  rateDescription: '',
  rateFrequencyType: '',
  rateType: '',
  sectionShortDescription: '',
  subClassCode: '',
};
const premiumFormValue = {
  sectionCode: 'exampleSectionCode',
  sectionShortDescription: null,
  binderCode: 'exampleBinderCode',
  cashBackLevel: 'exampleCashBackLevel',
  dateWithEffectFrom: 'exampleDateWithEffectFrom',
  dateWithEffectTo: 'exampleDateWithEffectTo',
  divisionFactor: 'exampleDivisionFactor',
  doesCashBackApply: 'exampleDoesCashBackApply',
  freeLimit: 'exampleFreeLimit',
  isExProtectorApplication: 'exampleIsExProtectorApplication',
  isNoClaimDiscountApplicable: 'exampleIsNoClaimDiscountApplicable',
  isSumInsuredLimitApplicable: 'exampleIsSumInsuredLimitApplicable',
  maximumRate: 'exampleMaximumRate',
  minimumRate: 'exampleMinimumRate',
  multiplierDivisionFactor: 'exampleMultiplierDivisionFactor',
  multiplierRate: 'exampleMultiplierRate',
  noClaimDiscountLevel: 'exampleNoClaimDiscountLevel',
  premiumEndorsementMinimumAmount: 'examplePremiumEndorsementMinimumAmount',
  premiumMinimumAmount: 'examplePremiumMinimumAmount',
  proratedOrFull: 'exampleProratedOrFull',
  rangeFrom: 'exampleRangeFrom',
  rangeTo: 'exampleRangeTo',
  rate: 'exampleRate',
  rateDescription: 'exampleRateDescription',
  rateFrequencyType: 'exampleRateFrequencyType',
  rateType: 'exampleRateType',
  subClassCode: 'exampleSubClassCode',
};

describe('PremiumRateComponent', () => {
  let component: PremiumRateComponent;
  let fixture: ComponentFixture<PremiumRateComponent>;
  let messageService: MessageService;
  let service: PremiumRateService;
  let binderService:BinderService;
  let subclassService:SubclassesService;



  // beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [PremiumRateComponent]
  //   });
  //   fixture = TestBed.createComponent(PremiumRateComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiumRateComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: service,useClass:mockPremiumRateService},  
        { provide: subclassService,useClass:mockSubclassService },   
        { provide: binderService,useClass:mockBinderService },   

        { provide: MessageService }, 
        FormBuilder,
        {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis/setups/api/v1' } }}}

      ],
    })
    .compileComponents();

  fixture = TestBed.createComponent(PremiumRateComponent);
  component = fixture.componentInstance;
  
  service = TestBed.inject(PremiumRateService);
  subclassService=TestBed.inject(SubclassesService);
  binderService=TestBed.inject(BinderService);
  messageService = TestBed.inject(MessageService);
  component.premiumForm = new FormGroup({});
  component.fb = TestBed.inject(FormBuilder);

  fixture.detectChanges();

});

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load all subclasses', () => {
   

    jest.spyOn(subclassService, 'getAllSubclasses').mockReturnValue(of(mockSubclassList));
    // Call the method
    component.loadAllSubclass();

    // Expectations
    expect(component.subClassList).toEqual(mockSubclassList);

  });
  it('should load subclass details by code and call necessary methods', () => {
    const code = '123'; // Mocked code for testing
    jest.spyOn(subclassService, 'getSubclasses').mockReturnValue(of(mockSubclassList)as any); // Mock service method
    jest.spyOn(component, 'loadAllSections');
    jest.spyOn(component, 'loadAllBinders');
    jest.spyOn(component, 'loadAllPremiums');
    jest.spyOn(component.cdr, 'detectChanges');

    component.loadSubClass(code);

    expect(subclassService.getSubclasses).toHaveBeenCalledWith(code);
    expect(component.subClassDetail).toEqual(mockSubclassList);
    expect(component.cdr.detectChanges).toHaveBeenCalled();
    expect(component.loadAllSections).toHaveBeenCalledWith(code);
    expect(component.loadAllBinders).toHaveBeenCalledWith(code);
  });
  it('should load all sections and update section list', () => {
    const code = '123'; // Mocked code for testing
  
    jest.spyOn(subclassService, 'getSubclassSectionBySCode').mockReturnValue(of(sectionList) as any); // Mock service method
    jest.spyOn(component.cdr, 'detectChanges');

    component.loadAllSections(code);

    expect(subclassService.getSubclassSectionBySCode).toHaveBeenCalledWith(code);
    expect(component.sectionList).toEqual(sectionList);
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should load all binders and update binder lists', () => {
    const code = '123'; // Mocked code for testing
    const binderList = {
      _embedded: {
        binder_dto_list: [
         
        ],
      },
    }; // Mocked binder list
    jest.spyOn(binderService, 'getAllBinders').mockReturnValue(of(binderList)as any); // Mock service method
    jest.spyOn(component.cdr, 'detectChanges');

    component.loadAllBinders(code);

    expect(binderService.getAllBinders).toHaveBeenCalled();
    expect(component.binderList).toEqual(binderList);
    expect(component.binderListDetails).toEqual(binderList._embedded.binder_dto_list);
    expect(component.selectedBinderList).toEqual(binderList._embedded.binder_dto_list.filter(binder => binder.sub_class_code === code));
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should load binders and update binderListDetails', () => {
    const code = '123'; // Mocked code for testing
    const binderListDetails ={
      // Mocked binder list details
    }; 
    jest.spyOn(binderService, 'getBinders').mockReturnValue(of(binderListDetails)as any); // Mock service method
    jest.spyOn(component.cdr, 'detectChanges');

    component.loadBinders(code);

    expect(binderService.getBinders).toHaveBeenCalledWith(code);
    expect(component.binderListDetails).toEqual(binderListDetails);
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should load all premiums and filter them correctly', () => {
    const sectionCode = 1;
    const binderCode = 2;
    const subclassCode = 3;
    const mockData = [
     //mocked data
    ];
  
    // Initialize selectedSection
    component.selectedSection = { sectionCode: sectionCode }; // Replace with the appropriate initialization based on your code
  
    jest.spyOn(service, 'getAllPremiums').mockReturnValue(of(mockData) as any); // Mock service method
    jest.spyOn(component.cdr, 'detectChanges');

    component.loadAllPremiums(binderCode, subclassCode);
  
    expect(service.getAllPremiums).toHaveBeenCalledWith(sectionCode, binderCode, subclassCode);
    expect(component.premiumList).toEqual(mockData);
    expect(component.selectedPremuimList).toEqual(mockData.filter(premium=>premium.sectionCode === sectionCode && premium.binderCode === binderCode && premium.subClassCode === subclassCode));
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should load premiums and update premiumList', () => {
    const code = 'yourCode'; // Mocked code for testing
    const premiumList = [
      // Mocked premium list
    ]; 
    jest.spyOn(service, 'getPremiums').mockReturnValue(of(premiumList)); // Mock service method
    jest.spyOn(component.cdr, 'detectChanges');

    component.loadPremiums(code);

    expect(service.getPremiums).toHaveBeenCalledWith(code);
    expect(component.premiumList).toEqual(premiumList);
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should create the premium form', () => {
    expect(component.premiumForm).toBeInstanceOf(FormGroup);
    expect(component.premiumForm.controls['sectionShortDescription']).toBeDefined();
    expect(component.premiumForm.controls['rate']).toBeDefined();
    expect(component.premiumForm.controls['dateWithEffectFrom']).toBeDefined();
    expect(component.premiumForm.controls['dateWithEffectTo']).toBeDefined();
    expect(component.premiumForm.controls['subClassCode']).toBeDefined();
    expect(component.premiumForm.controls['binderCode']).toBeDefined();
    expect(component.premiumForm.controls['rangeFrom']).toBeDefined();
    expect(component.premiumForm.controls['rangeTo']).toBeDefined();
    expect(component.premiumForm.controls['rateDescription']).toBeDefined();
    expect(component.premiumForm.controls['divisionFactor']).toBeDefined();
    expect(component.premiumForm.controls['rateType']).toBeDefined();
    expect(component.premiumForm.controls['premiumMinimumAmount']).toBeDefined();
    expect(component.premiumForm.controls['proratedOrFull']).toBeDefined();
    expect(component.premiumForm.controls['premiumEndorsementMinimumAmount']).toBeDefined();
    expect(component.premiumForm.controls['multiplierRate']).toBeDefined();
    expect(component.premiumForm.controls['multiplierDivisionFactor']).toBeDefined();
    expect(component.premiumForm.controls['maximumRate']).toBeDefined();
    expect(component.premiumForm.controls['minimumRate']).toBeDefined();
    expect(component.premiumForm.controls['freeLimit']).toBeDefined();
    expect(component.premiumForm.controls['isExProtectorApplication']).toBeDefined();
    expect(component.premiumForm.controls['noClaimDiscountLevel']).toBeDefined();
  });
  it('should create the search form', () => {
    expect(component.searchForm).toBeInstanceOf(FormGroup);
    expect(component.searchForm.controls['search']).toBeDefined();
  });
  it('should call createPremium method with correct parameters and reset form on success', () => {
    // Arrange
    jest.spyOn(messageService, 'add');
    const createPremiumSpy = jest.spyOn(service, 'createPremium').mockReturnValue(of({})as any);
    const resetFormSpy = jest.spyOn(component.premiumForm, 'reset');

    // Set component properties
    component.selectedSection = { sectionCode: 'sectionCodeValue' };
    component.selectedSubClassPeril = 'subClassCodeValue';
    component.selectedBinder = 'binderCodeValue';

    // Act
    component.createPremium();

    // Assert
    expect(createPremiumSpy).toHaveBeenCalledWith(mockPremium);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved',
    });
    expect(resetFormSpy).toHaveBeenCalled();
  });
  // it('should update selectedPremiumRate and patch the form value correctly', async () => {
  //   const event = 'Premium Rate'; // The event value you want to test
   
  
  //   // Mock console.log
  //   console.log = jest.fn();
  
  //   // Call the function with the mocked event
  //   component.onselectPremium(event);
  
  //   // Wait for the next tick of the event loop (assuming you have Angular's TestBed)
  //   await fixture.whenStable();
  
  //   // Expect selectedPremiumRate to be updated
  //   expect(component.selectedPremiumRate).toEqual(event);
  
  //   // Expect the form value to be patched correctly
  //   expect(component.premiumForm.value).toEqual(expectedFormValue);
  
  //   // Expect console.log to be called with the selectedPremiumRate value
  //   expect(console.log).toHaveBeenCalledWith(event);
  // });
  it('should display an error message if no Premium is selected', () => {
    // Arrange
    component.selectedPremiumRate = undefined; // No Premium selected
    jest.spyOn(messageService, 'add');
  
    // Act
    component.deletePremium();
  
    // Assert
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Select a Premium to continue',
    });
  });
  
  it('should display a success message if Premium is deleted successfully', () => {
    // Arrange
    const id = 123; // Example ID
    component.selectedPremiumRate = { code: id }; // Set selectedPremiumRate
    const deletePremiumMock = jest.spyOn(service, 'deletePremium').mockReturnValue(of(null)); // Mock successful deletePremium() call
    jest.spyOn(messageService, 'add');
  
    // Act
    component.deletePremium();
  
    // Assert
    expect(deletePremiumMock).toHaveBeenCalledWith(id);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail:  "Deleted Successfully",
    });
  
    // Cleanup
    deletePremiumMock.mockRestore();
  });
  it('should update the premium and display success message', () => {
    // Arrange
  
    jest.spyOn(messageService, 'add');
    const selectedSection = { sectionCode: 'exampleSectionCode' };
    const selectedPremiumRate = { code: 'examplePremiumRateCode' };
    const updatePremiumMock = jest.spyOn(service, 'updatePremium').mockReturnValue(of(null));
    const resetFormSpy = jest.spyOn(component.premiumForm, 'reset').mockImplementation(() => {});
    component.premiumForm = component.fb.group(premiumFormValue);
    component.selectedSection = selectedSection;
    component.selectedPremiumRate = selectedPremiumRate;

    // Act
    component.updatePremium();

    // Assert
    expect(updatePremiumMock).toHaveBeenCalledWith(
      { ...premiumFormValue, sectionCode: selectedSection.sectionCode },
      selectedPremiumRate.code
    );
    // expect(resetFormSpy).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Premium Updated',
    });
  });

  it('should display an error message when the update fails', () => {
    // Arrange
    jest.spyOn(messageService, 'add');
    const selectedSection = { sectionCode: 'exampleSectionCode' };
    const selectedPremiumRate = { code: 'examplePremiumRateCode' };
    const errorMessage = 'Update failed'; // Define an error message you expect
    const updatePremiumMock = jest.spyOn(service, 'updatePremium').mockReturnValue(throwError(errorMessage)); // Mock an error response
    const resetFormSpy = jest.spyOn(component.premiumForm, 'reset').mockImplementation(() => {});
    component.premiumForm = component.fb.group(premiumFormValue);
    component.selectedSection = selectedSection;
    component.selectedPremiumRate = selectedPremiumRate;
  
    // Act
    component.updatePremium();
  
    // Assert
    expect(updatePremiumMock).toHaveBeenCalledWith(
      { ...premiumFormValue, sectionCode: selectedSection.sectionCode },
      selectedPremiumRate.code
    );
    // expect(resetFormSpy).toHaveBeenCalled(); // Optionally, verify that resetFormSpy was called
    // expect(messageService.add).toHaveBeenCalledWith({
    //   "detail":  "Error, try again later", // Verify that the error message is displayed
    //   "severity": "error",
    //   "summary": "Error",
    // });
  });
  // it('should log a message and call filterGlobal', () => {
  //   const consoleLogSpy = jest.spyOn(console, 'log'); // Spy on the console.log method
  //   const event = { target: document.createElement('input') };
  //   event.target.value = 'TestValue';
  //   const stringVal = 'StringVal';

  //   component.applyFilterGlobal(event, stringVal);

  //   // Expectations
  //   expect(consoleLogSpy).toHaveBeenCalledWith('calling global filter', stringVal);
  //   // You can also add expectations for calling filterGlobal, but it depends on what dt1 is.
  // });
  
  
  it('should set showAddPremium to true', () => {
    component.showAddPremiumCard();
    expect(component.showAddPremium).toBe(true);
  });

  it('should set showEditPremium to false', () => {
    component.showAddPremiumCard();
    expect(component.showEditPremium).toBe(false);
  });

  it('should set showDeleteCover to false', () => {
    component.showAddPremiumCard();
    expect(component.showDeleteCover).toBe(false);
  });

  it('should set showcover to false', () => {
    component.showAddPremiumCard();
    expect(component.showcover).toBe(false);
  });

  it('should set showButtons to false', () => {
    component.showAddPremiumCard();
    expect(component.showButtons).toBe(false);
  });
  
  it('should set showAddPremium to false', () => {
    component.showEditPremiumCard();
    expect(component.showAddPremium).toBe(false);
  });

  it('should set showEditPremium to true', () => {
    component.showEditPremiumCard();
    expect(component.showEditPremium).toBe(true);
  });

  it('should set showDeleteCover to false', () => {
    component.showEditPremiumCard();
    expect(component.showDeleteCover).toBe(false);
  });

  it('should set showcover to false', () => {
    component.showEditPremiumCard();
    expect(component.showcover).toBe(false);
  });

  it('should set showButtons to false', () => {
    component.showEditPremiumCard();
    expect(component.showButtons).toBe(false);
  });
  it('should set showAddPremium to false', () => {
    component.hideAddPremiumCard();
    expect(component.showAddPremium).toBe(false);
  });

  it('should set showButtons to true', () => {
    component.hideAddPremiumCard();
    expect(component.showButtons).toBe(true);
  });
  
  it('should set showEditPremium to false', () => {
    component.hideEditPremiumCard();
    expect(component.showEditPremium).toBe(false);
  });

  it('should set showButtons to true', () => {
    component.hideEditPremiumCard();
    expect(component.showButtons).toBe(true);
  });
  it('should filter the subclass list based on search value', () => {
    // Mock event object with a target value
    const event = {
      target: {
        value: 'searchTerm',
      },
    };

    // Set up a mock subclass list
    component.subClassList = [
      { description: 'SearchTerm1' },
      { description: 'OtherDescription' },
      { description: 'SearchTerm2' },
    ];

    // Call the filterSubclass() method with the mock event
    component.filterSubclass(event);

    // Expect that filteredSubclass now contains the items with 'searchTerm' in the description
    expect(component.filteredSubclass).toEqual([ ]);
  });
  
  it('should filter the section list based on search value', () => {
    // Mock event object with a target value
    const event = {
      target: {
        value: 'searchTerm',
      },
    };

    // Set up a mock section list
    component.sectionList = [
      { sectionShortDescription: 'SectionTerm1' },
      { sectionShortDescription: 'OtherDescription' },
      { sectionShortDescription: 'SectionTerm2' },
    ];

    // Call the filterSection() method with the mock event
    component.filterSection(event);

    // Expect that filteredSection now contains the items with 'searchTerm' in sectionShortDescription
    expect(component.filteredSection).toEqual([ ]);
  });
  it('should set selectedSection and selectedItemCode based on input data', () => {
    // Mock input data
    const data = {
      sectionCode: 'section123',
      // Add other properties as needed
    };

    // Call the loadSections() method with the mock data
    component.loadSections(data);

    // Expect that selectedSection and selectedItemCode are set correctly
    expect(component.selectedSection).toEqual(data);
    expect(component.selectedItemCode).toBe(data.sectionCode);
  });
  it('should set selectedBinder based on the input code', () => {
    // Mock input code
    const code = 'binder123';

    // Call the selectedBinderCode() method with the mock code
    component.selectedBinderCode(code);

    // Expect that selectedBinder is set correctly
    expect(component.selectedBinder).toBe(code);
  });
  
  // it('should display an error message when selectedBinder is not set', () => {
  //   // Call the test() method with selectedBinder not set (null)
  //   component.test();
  //   jest.spyOn(messageService, 'add');

  //   // Expect that messageService.add() was called with the error message
  //   expect(messageService.add).toHaveBeenCalledWith({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: 'Select a Binder to continue',
  //   });

  //   // Expect that document.getElementById() was not called
  //   expect(document.getElementById).not.toHaveBeenCalled();
  // });


 
  it('should open the modal when selectedBinder is set', () => {
    // Create a mock button element
    const mockButtonElement: HTMLButtonElement = document.createElement('button');
    mockButtonElement.click = jest.fn();
    jest.spyOn(messageService, 'add');

    // Mock document.getElementById as a spy and return the mock button element
    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue(mockButtonElement);

    // Set a mock value for selectedBinder
    component.selectedBinder = 'binder123';

    // Call the test() method with selectedBinder set
    component.test();

    // Expect that messageService.add() was not called
    expect(messageService.add).not.toHaveBeenCalled();

    // Expect that document.getElementById() was called with the specified ID
    expect(getElementByIdSpy).toHaveBeenCalledWith('openModalButton');

    // Expect that the button's click method was called
    expect(mockButtonElement.click).toHaveBeenCalled();

    // Restore the spy after the test
    getElementByIdSpy.mockRestore();
  });
  it('should open the modal when selectedBinder is set and selectedPremiumRate is set', () => {
    // Mock button element
    const mockButtonElement: HTMLButtonElement = document.createElement('button');
    mockButtonElement.click = jest.fn(); // Mock the click method

    // Mock document.getElementById as a spy and return the mock button element
    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue(mockButtonElement);

    // Set mock values for selectedBinder and selectedPremiumRate
    component.selectedBinder = 'binder123';
    component.selectedPremiumRate = 'premiumRate123';

    // Call the testEdit() method with selectedBinder and selectedPremiumRate set
    component.testEdit();

    // Expect that document.getElementById() was called with the specified ID
    expect(getElementByIdSpy).toHaveBeenCalledWith('openModalButtonEdit');

    // Expect that the click method on the mock button element was called
    expect(mockButtonElement.click).toHaveBeenCalled();

    // Restore the spy after the test
    getElementByIdSpy.mockRestore();
  });
  
  it('should open the modal when selectedPremiumRate is set', () => {
    // Mock document.getElementById as a spy and return a mock HTMLElement
    const mockHTMLElement: HTMLElement = document.createElement('button');
    mockHTMLElement.click = jest.fn(); // Mock the click method
    jest.spyOn(messageService, 'add');

    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue(mockHTMLElement);

    // Set a mock value for selectedPremiumRate
    component.selectedPremiumRate = 'premiumRate123';

    // Call the testDelete() method with selectedPremiumRate set
    component.testDelete();

    // Expect that messageService.add() was not called
    expect(messageService.add).not.toHaveBeenCalled();

    // Expect that document.getElementById() was called with the specified ID
    expect(getElementByIdSpy).toHaveBeenCalledWith('openModalButtonDelete');

    // Expect that the click method on the mock HTMLElement was called
    expect(mockHTMLElement.click).toHaveBeenCalled();

    // Restore the spy after the test
    getElementByIdSpy.mockRestore();
  });
  
  it('should set selectedPremiumRate and patch premiumForm with the selected premium', () => {
    // Mock event object with the necessary data
   // Mock event object with the necessary properties
const mockEvent = {
 
  binderCode: '',
  cashBackLevel: '',
  dateWithEffectFrom: '',
  dateWithEffectTo: '',
  divisionFactor: '',
  doesCashBackApply: '',
  freeLimit: '',
  isExProtectorApplication: '',
  isNoClaimDiscountApplicable: '',
  isSumInsuredLimitApplicable: '',
  maximumRate: '',
  minimumRate: '',
  multiplierDivisionFactor: '',
  multiplierRate: '',
  noClaimDiscountLevel: '',
  premiumEndorsementMinimumAmount: '',
  premiumMinimumAmount: '',
  proratedOrFull: '',
  rangeFrom: '',
  rangeTo: '',
  rate: '',
  rateDescription: '',
  rateFrequencyType: '',
  rateType: '',
  sectionShortDescription: '',
  subClassCode: '',
};

// Call the onselectPremium() method with the mock event
component.onselectPremium(mockEvent);

// Expect that selectedPremiumRate is set correctly
expect(component.selectedPremiumRate).toEqual(mockEvent);

// Expect that premiumForm is patched with the selected premium data
expect(component.premiumForm.value).toEqual(mockEvent);


    // Call the onselectPremium() method with the mock event
    component.onselectPremium(mockEvent);

    // Expect that selectedPremiumRate is set correctly
    expect(component.selectedPremiumRate).toEqual(mockEvent);

    // Expect that premiumForm is patched with the selected premium data
    expect(component.premiumForm.value).toEqual(mockEvent);
  });
});
