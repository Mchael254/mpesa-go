import '../../../../data/testData/matchMedia.mock';
import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

import { SubClassSectionsAndCoverTypesComponent } from './sub-class-sections-and-cover-types.component';
import {ClassesSubclassesService} from "../../../../services/classes-subclasses/classes-subclasses.service";
import {SubClassSectionsService} from "../../../../services/sub-class-sections/sub-class-sections.service";
import {SubClassCoverTypesService} from "../../../../services/sub-class-cover-types/sub-class-cover-types.service";
import {
  SubClassCoverTypesSectionsService
} from "../../../../services/sub-class-cover-types-sections/sub-class-cover-types-sections.service";
import {SectionsService} from "../../../../services/sections/sections.service";
import {ProductSubclassService} from "../../../../services/product-subclass/product-subclass.service";
import {CoverTypesService} from "../../../../services/cover-types/cover-types.service";
import {CurrencyService} from "../../../../../../../../shared/services/setups/currency/currency.service";
import {GlobalMessagingService} from "../../../../../../../../shared/services/messaging/global-messaging.service";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SubClassListingComponent} from "../sub-class-listing/sub-class-listing.component";
import {TableModule} from "primeng/table";
import {PickListModule} from "primeng/picklist";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CustomFilterPipe} from "../../../../../../../../shared/pipes/custom-filter/custom-filter.pipe";
import {forkJoin, of, throwError} from "rxjs";
import {ButtonModule} from "primeng/button";
import {subclassCoverSections, subSections} from "../../../../data/gisDTO";
import {HttpErrorResponse} from "@angular/common/http";

class MockSubClassSectionsService {
  getSubclassSectionBySCode = jest.fn().mockReturnValue(of([]));
  getFilteredArray = jest.fn();
  getsubSecArray = jest.fn();
  updatesubSection = jest.fn().mockReturnValue(of({}));
  createSubSections = jest.fn();
  setsubSecArray = jest.fn();
  setFilteredArray = jest.fn();
}

class MockSubClassCoverTypesService {
  getSubclassCovertypeBySCode = jest.fn().mockReturnValue(of(null));
  updateSubCovertype = jest.fn();
  createSubCovertype = jest.fn();
}

class MockSubClassCoverTypesSectionsService {
  getAllSubCovSection  = jest.fn().mockReturnValue(of([]));
  createSub = jest.fn().mockReturnValue(of([]));
  deleteSubCovSec = jest.fn().mockReturnValue(of([]));
}

class MockSectionsService {
  getAllSections = jest.fn().mockReturnValue(of([]));
}

class MockCoverTypesService {
  getAllCovertypes1 = jest.fn().mockReturnValue(of([]));
}

class MockCurrencyService {
  getAllCurrencies = jest.fn().mockReturnValue(of([]));
}

class MockMessageService {
  displaySuccessMessage = jest.fn();
  displayErrorMessage = jest.fn();
}

class MockClassesSubclassesService {
  getSubclasses1 = jest.fn().mockReturnValue(of([]));
}

describe('SubClassSectionsAndCoverTypesComponent', () => {
  let component: SubClassSectionsAndCoverTypesComponent;
  let mockSubClassSectionsService: SubClassSectionsService;
  let mockSubClassCoverTypesService: SubClassCoverTypesService;
  let mockSubClassCoverTypeSectionService: SubClassCoverTypesSectionsService;
  let mockSectionsService: SectionsService;
  let mockCoverTypeService: CoverTypesService;
  let mockCurrencyService: CurrencyService;
  let mockMessageService: GlobalMessagingService;
  let fixture: ComponentFixture<SubClassSectionsAndCoverTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TableModule, PickListModule, ButtonModule, HttpClientTestingModule],
      declarations: [SubClassSectionsAndCoverTypesComponent, SubClassListingComponent, CustomFilterPipe],
      providers: [
        {provide: SubClassSectionsService, useClass: MockSubClassSectionsService},
        {provide: SubClassCoverTypesService, useClass: MockSubClassCoverTypesService},
        {provide: SubClassCoverTypesSectionsService, useClass: MockSubClassCoverTypesSectionsService},
        {provide: SectionsService, useClass: MockSectionsService},
        {provide: CoverTypesService, useClass: MockCoverTypesService},
        {provide: CurrencyService, useClass: MockCurrencyService},
        {provide: GlobalMessagingService, useClass: MockMessageService},
        {provide: ClassesSubclassesService, useClass: MockClassesSubclassesService},
        { provide: ComponentFixtureAutoDetect, useValue: true },
        FormBuilder
      ]
    });
    fixture = TestBed.createComponent(SubClassSectionsAndCoverTypesComponent);
    mockSubClassSectionsService = TestBed.inject(SubClassSectionsService);
    mockSubClassCoverTypesService = TestBed.inject(SubClassCoverTypesService);
    mockSubClassCoverTypeSectionService = TestBed.inject(SubClassCoverTypesSectionsService);
    mockSectionsService = TestBed.inject(SectionsService);
    mockCoverTypeService = TestBed.inject(CoverTypesService);
    mockCurrencyService = TestBed.inject(CurrencyService);
    mockMessageService = TestBed.inject(GlobalMessagingService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize the form groups', () => {
    expect(component.sections).toBeDefined();
    expect(component.coverTypeForm).toBeDefined();
    expect(component.updateCoverTypeForm).toBeDefined();
  });

  it('should call the necessary methods on ngOnInit', () => {
    jest.spyOn(component, 'createSubSections');
    jest.spyOn(component, 'getAllCovertypes');
    jest.spyOn(component, 'getAllCurrencies');
    jest.spyOn(component, 'createCoverTypeForm');
    jest.spyOn(component, 'createUpdateCoverTypeForm');

    component.ngOnInit();

    expect(component.createSubSections).toHaveBeenCalled();
    expect(component.getAllCovertypes).toHaveBeenCalled();
    expect(component.getAllCurrencies).toHaveBeenCalled();
    expect(component.createCoverTypeForm).toHaveBeenCalled();
    expect(component.createUpdateCoverTypeForm).toHaveBeenCalled();
  });


  it('should create cover type form on init', () => {
    // Arrange
    jest.spyOn(component, 'createCoverTypeForm');

    // Act
    component.ngOnInit();

    // Assert
    expect(component.createCoverTypeForm).toHaveBeenCalled();
    expect(component.coverTypeForm).toBeTruthy();
  });

  it('should load all sections by subclass code', () => {
    const code = 123; // Replace with your test code

    // Create a mock for the getSubclassSectionBySCode method of the subclassSectionsService
    const getSubclassSectionBySCodeMock = jest.spyOn(mockSubClassSectionsService, 'getSubclassSectionBySCode').mockReturnValue(of([]));

    // Create a spy for the setsubSecArray method of the subclassSections
    const setsubSecArraySpy = jest.spyOn(mockSubClassSectionsService, 'setsubSecArray');
    const loadAllSectionsSpy = jest.spyOn(component,'loadAllSections');


    // Call the method under test
    component.loadAllSectionsBySubclassCode(code);

    // Expectations
    expect(getSubclassSectionBySCodeMock).toHaveBeenCalledWith(code);
    // expect(setsubSecArraySpy).toHaveBeenCalledWith([]);
    expect(loadAllSectionsSpy).toHaveBeenCalled();
  });

  it('should load all sections', () => {
    // Create a mock response for the getAllSections method of the sectionsService
    const mockResponse = [
      { code: 1, name: 'Section 1' },
      { code: 2, name: 'Section 2' },
      { code: 3, name: 'Section 3' }
    ];

    const subClassSections = [
      {sectionCode: 1, sectionName: 'Section 1'},
      {sectionCode: 2, sectionName: 'Section 2'}
    ];

    component.allSubclassSections = subClassSections;

    jest.spyOn(mockSectionsService, 'getAllSections').mockReturnValue(of(mockResponse));

    // Call the method under test
    component.loadAllSections();

    // Expectations
    expect(mockSectionsService.getAllSections).toHaveBeenCalled();
    expect(component.allSections).toEqual(mockResponse);

    // Check unassigned sections
    const unassignedSections = component.unassignedSection;
    expect(unassignedSections.length).toBe(1);
    expect(unassignedSections[0]).toEqual({ code: 3, name: 'Section 3' });

  });

  it('should handle move to target action', () => {
    // Create a spy for the onMoveItems method
    const onMoveItemsSpy = jest.spyOn(component, 'onMoveItems');

    // Call the method under test
    const mockEvent = {
      items: [
        { sectionCode: 1 }
      ]
    };

    component.onMoveItem(mockEvent, 'moveToTarget');
    // Expectations
    expect(onMoveItemsSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should handle move all to target action', () => {
    const onMoveAllItemSpy = jest.spyOn(component, 'onMoveAllItem');

    const mockEvent = {
      items: [
        { sectionCode: 1 },
        { sectionCode: 2 },
        { sectionCode: 3 }
      ]
    };

    component.onMoveItem(mockEvent, 'moveAllToTarget');
    expect(onMoveAllItemSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should handle move to source action', () => {
    const mockEvent = {
      items: [
        { sectionCode: 1 }
      ]
    };

    // Create a spy for the deleteonMoveItem method
    const deleteonMoveItemSpy = jest.spyOn(component, 'deleteonMoveItem');

    // Call the method under test
    component.onMoveItem(mockEvent, 'moveToSource');

    // Expectations
    expect(deleteonMoveItemSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should handle move all to source action', () => {
    // Create a spy for the deleteonMoveAllItems method
    const deleteonMoveAllItemsSpy = jest.spyOn(component, 'deleteonMoveAllItems');

    const mockEvent = {
      items: [
        { sectionCode: 1 },
        { sectionCode: 2 },
        { sectionCode: 3 }
      ]
    };

    // Call the method under test
    component.onMoveItem(mockEvent, 'moveAllToSource');

    // Expectations
    expect(deleteonMoveAllItemsSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should filter sub class cover type sections from a list of all subclass cover type sections for the selected subclass and covertype', () => {
    // Create a mock data array
    const mockData = [
      {subClassCode: 103, coverTypeCode: 290},
      {subClassCode: 104, coverTypeCode: 290},
      {subClassCode: 103, coverTypeCode: 290}
    ];

    // Create a spy for the getAllSubCovSection method of the subClassCoverTypeSectionService
    const getAllSubCovSectionSpy = jest.spyOn(mockSubClassCoverTypeSectionService, 'getAllSubCovSection').mockReturnValue(of(mockData));

    // Create a spy for the subclassCoverType.setFilteredArray method
    const setFilteredArraySpy = jest.spyOn(mockSubClassSectionsService, 'setFilteredArray');

    component.subclassCode = 103;
    component.covertypeCode = 290;

    // Call the method under test
    component.getallSubCovSections();

    // Expectations
    expect(getAllSubCovSectionSpy).toHaveBeenCalled();
    expect(component.allSubCovSec).toEqual(mockData);
    expect(component.filterSubCovSec.length).toBe(2); // 2 unique sub class cover type sections: subClassCode 103 and coverTypeCode 290
    expect(setFilteredArraySpy).toHaveBeenCalled();
  });

  it('should compare sections and filter unassigned tasks', () => {
    // Create mock data arrays
    const mockFiltersect = [
      {sectionCode: 1},
      {sectionCode: 2},
      {sectionCode: 3}
    ];
    const mockSubFilter = [
      {sectionCode: 2},
      {sectionCode: 4},
      {sectionCode: 6}
    ];

    // Create a spy for the getFilteredArray method of the subclassSectionsService
    const getFilteredArraySpy = jest.spyOn(mockSubClassSectionsService, 'getFilteredArray').mockReturnValue(of(mockFiltersect));

    // Create a spy for the getsubSecArray method of the subclassSectionsService
    const getsubSecArraySpy = jest.spyOn(mockSubClassSectionsService, 'getsubSecArray').mockReturnValue(of(mockSubFilter));

    component.compareSections();

    expect(component.filtersect).toEqual(mockFiltersect);
    expect(component.filtersect.length).toBe(3);

    expect(component.subFilter).toEqual(mockSubFilter);
    expect(component.subFilter.length).toBe(3);

    expect(component.sourceSubCovSec.length).toBe(2);
    expect(component.sourceSubCovSec).toEqual([{sectionCode: 4}, {sectionCode: 6}]);
  });

  it('should create a new item (sub class cover type section) and display success message', (done) => {
    // Create a mock event with items
    const mockEvent = {
      items: [
        {sectionCode: 789}
      ]
    };

    const createSubSpy = jest.spyOn(mockSubClassCoverTypeSectionService, 'createSub').mockReturnValue(of(null));
    const displaySuccessMessageSpy = jest.spyOn(mockMessageService, 'displaySuccessMessage');

    // Call the method under test
    component.onMoveItems(mockEvent);

    // Expectations
    expect(createSubSpy).toHaveBeenCalledWith({
      code: null,
      coverTypeCode: component.covertypeCode,
      coverTypeShortDescription: 'Cover Type',
      isMandatory: 'Y',
      order: 3,
      organizationCode: 2,
      sectionCode: mockEvent.items[0].sectionCode,
      sectionShortDescription: 'Section Description',
      subClassCode: component.subclassCode,
      subClassCoverTypeCode: 494,
    });
    expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', 'Successfully created');

    createSubSpy.mock.results[0].value.subscribe({
      complete: () => {
        done();
      }
    });
  });

  it('should handle error when creating a new item(sub class cover type section) and display error message', async() => {
    // Create a mock event with items
    const mockEvent = {
      items: [
        {sectionCode: 789}
      ]
    };

    // Create a spy for the console.log method
    const consoleLogSpy = jest.spyOn(console, 'log');

    const createSubSpy = jest.spyOn(mockSubClassCoverTypeSectionService, 'createSub').mockReturnValue(throwError(new HttpErrorResponse({})));
    const displayErrorMessageSpy = jest.spyOn(mockMessageService, 'displayErrorMessage');

    try{
      component.onMoveItems(mockEvent);
    }
    catch (e) {
      expect(displayErrorMessageSpy).toHaveBeenCalled();
    }
  });

  it('should create all items (assign all sub class sections to sub class cover type sections) and log success message', (done) => {
    // Create a mock event with items
    const mockEvent = {
      items: [
        {sectionCode: 1},
        {sectionCode: 2},
        {sectionCode: 3}
      ]
    };

    const createSubSpy = jest.spyOn(mockSubClassCoverTypeSectionService, 'createSub').mockReturnValue(of(null));
    const displayErrorMessageSpy = jest.spyOn(mockMessageService, 'displayErrorMessage');

    // Call the method under test
    component.onMoveAllItem(mockEvent);

    // Expectations
    expect(createSubSpy).toHaveBeenCalledTimes(mockEvent.items.length);

    // Wait for the forkJoin observable to complete before ending the test
    forkJoin(createSubSpy.mock.results[0].value).subscribe({
      complete: () => {
        expect(component.selectedSection).toEqual([]);
        expect(displayErrorMessageSpy).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle error when creating items and display error message', (done) => {
    // Create a mock event with items
    const mockEvent = {
      items: [
        {sectionCode: 1},
        {sectionCode: 2},
        {sectionCode: 3}
      ]
    };

    const createSubSpy = jest.spyOn(mockSubClassCoverTypeSectionService, 'createSub').mockReturnValue(throwError(new HttpErrorResponse({})));
    const displayErrorMessageSpy = jest.spyOn(mockMessageService, 'displayErrorMessage');

    // Call the method under test
    component.onMoveAllItem(mockEvent);

    // Expectations
    expect(createSubSpy).toHaveBeenCalledTimes(mockEvent.items.length);

    // Wait for the forkJoin observable to complete before ending the test
    forkJoin(createSubSpy.mock.results[0].value).subscribe({
      complete: () => {
        // expect(displayErrorMessageSpy).toHaveBeenCalledWith('Error', 'Error, try again later');
        // done();
      },
      error: () => {
        expect(displayErrorMessageSpy).toHaveBeenCalledWith('Error', 'Error, try again later');
        done();
      }
    });

  });

  it('should delete an item (sub class cover type section) and log success message', () => {
    // Create a mock event with items
    const mockEvent = {
      items: [
        {code: 1}
      ]
    };

    const deleteSubCovSecSpy = jest.spyOn(mockSubClassCoverTypeSectionService, 'deleteSubCovSec').mockReturnValue(of(null));

    // Call the method under test
    component.deleteonMoveItem(mockEvent);

    // Expectations
    expect(deleteSubCovSecSpy).toHaveBeenCalledWith(mockEvent.items[0].code);
  });

  it('should handle error when deleting all items(sub class cover type sections) for a sub class cover type and display error message', (done) => {
    const mockEvent = {
      items: [
        {code: 1},
        {code: 2},
        {code: 3}
      ]
    };


    const deleteSubCovSecSpy = jest.spyOn(mockSubClassCoverTypeSectionService, 'deleteSubCovSec').mockReturnValue(throwError(new HttpErrorResponse({})));
    const displayErrorMessageSpy = jest.spyOn(mockMessageService, 'displayErrorMessage');

    // Call the method under test
    component.deleteonMoveAllItems(mockEvent);

    expect(deleteSubCovSecSpy).toHaveBeenCalledTimes(mockEvent.items.length);

    // Wait for the forkJoin observable to complete before ending the test
    forkJoin(deleteSubCovSecSpy.mock.results[0].value).subscribe({
      error: () => {
        expect(displayErrorMessageSpy).toHaveBeenCalledWith('Error', 'Error, try again later');
        done();
      }
    });

  });


  it('should fetch all covertypes and set the allCovertypes property', (done) => {
    // Create a mock response data
    const mockData = {
      _embedded: {
        cover_type_dto_list: [
          {id: 1, name: 'Cover Type 1'},
          {id: 2, name: 'Cover Type 2'}
        ]
      }
    };

    // Create a spy for the getAllCovertypes1 method of the coverTypeService
    const getAllCovertypes1Spy = jest.spyOn(mockCoverTypeService, 'getAllCovertypes1').mockReturnValue(of(mockData));

    // Call the method under test
    component.getAllCovertypes();

    // Expectations
    expect(getAllCovertypes1Spy).toHaveBeenCalled();

    // Wait for the getAllCovertypes1 observable to complete before ending the test
    getAllCovertypes1Spy.mock.results[0].value.subscribe({
      next: () => {
        expect(component.allCovertypes).toEqual(mockData._embedded.cover_type_dto_list);
        done();
      }
    });
  });

  it('should fetch all currencies and set the currencies array property', (done) => {
    const mockData = [
      {id: 1, name: 'Currency 1'},
      {id: 2, name: 'Currency 2'}
    ];

    const getAllCurrenciesSpy = jest.spyOn(mockCurrencyService, 'getAllCurrencies').mockReturnValue(of(mockData));

    // Call the method under test
    component.getAllCurrencies();

    // Expectations
    expect(getAllCurrenciesSpy).toHaveBeenCalled();

    // Wait for the getAllCurrencies observable to complete before ending the test
    getAllCurrenciesSpy.mock.results[0].value.subscribe({
      next: () => {
        expect(component.currencies).toEqual(mockData);
        done();
      }
    });
  });

  it('should update a subclass cover type and display success message', (done) => {

    const updateSubCovertypeSpy = jest.spyOn(mockSubClassCoverTypesService, 'updateSubCovertype').mockReturnValue(of(null));
    const cancelUpdateClickSpy = jest.spyOn(component.cancelCovertypeUpdateTask.nativeElement, 'click');
    const displaySuccessMessageSpy = jest.spyOn(mockMessageService, 'displaySuccessMessage');

    // Call the method under test
    component.updateCovertype();

    // Expectations
    expect(cancelUpdateClickSpy).toHaveBeenCalled();
    expect(updateSubCovertypeSpy).toHaveBeenCalled();

    // Wait for the updateSubCovertype observable to complete before ending the test
    updateSubCovertypeSpy.mock.results[0].value.subscribe({
      complete: () => {
        expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', 'Successfully updated subclass cover type');
        done();
      }
    });

  });

  it('should handle error when updating a subclass cover type and display error message', async() => {
    // Create a spy for the updateSubCovertype method of the subclassCoverTypesService
    const updateSubCovertypeSpy = jest.spyOn(mockSubClassCoverTypesService, 'updateSubCovertype').mockReturnValue(throwError(new HttpErrorResponse({})));

    // Create a spy for the displayErrorMessage method of the messageService
    const displayErrorMessageSpy = jest.spyOn(mockMessageService, 'displayErrorMessage');

    // Call the method under test
    try{
      component.updateCovertype();
    }
    catch (e) {
      expect(displayErrorMessageSpy).toHaveBeenCalled();
    }
  });

  it('should create a subclass cover type and display success message', (done) => {
    // Create a mock requestBody

    const mockRequestBody = {
      certificateTypeCode: 20,
      certificateTypeShortDescription: 'private',
      code: null,
      coverTypeCode: '',
      coverTypeShortdescription: '',
      defaultSumInsured: '',
      description: '',
      installmentPeriod: '',
      installmentType: '',
      isDefault: '',
      maximumInstallments: '',
      minimumPremium: '',
      organizationCode: 2,
      paymentInstallmentPercentage: '',
      subClassCode: 201,
      sumInsuredCurrencyCode: '',
      sumInsuredExchangeRate: '',
      surveyEvaluationRequired: false
    };

    // Create a spy for the createSubCovertype method of the subclassCoverTypesService
    const createSubCovertypeSpy = jest.spyOn(mockSubClassCoverTypesService, 'createSubCovertype').mockReturnValue(of(null));

    // Create a spy for the click method of the cancelCovertypeCreateTask element
    const cancelCovertypeClickSpy = jest.spyOn(component.cancelCovertypeCreateTask.nativeElement, 'click');

    // Create a spy for the displaySuccessMessage method of the messageService
    const displaySuccessMessageSpy = jest.spyOn(mockMessageService, 'displaySuccessMessage');

    // Set the coverTypeForm value
    component.subclassCode = 201;
    component.coverTypeForm.setValue(mockRequestBody);

    // Call the method under test
    component.createCovertype();

    mockRequestBody.certificateTypeShortDescription = null;
    mockRequestBody.certificateTypeCode = null;

    // Expectations
    expect(cancelCovertypeClickSpy).toHaveBeenCalled();
    expect(createSubCovertypeSpy).toHaveBeenCalledWith(mockRequestBody);

    // Wait for the createSubCovertype observable to complete before ending the test
    createSubCovertypeSpy.mock.results[0].value.subscribe({
      complete: () => {
        expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', 'Successfully created subclass cover type');
        done();
      }
    });
  });

  it('should handle error when creating a subclass cover type and display error message', async () => {
    // Create a mock requestBody
    const mockRequestBody = {
      certificateTypeCode: 20,
      certificateTypeShortDescription: 'private',
      code: null,
      coverTypeCode: '',
      coverTypeShortdescription: '',
      defaultSumInsured: '',
      description: '',
      installmentPeriod: '',
      installmentType: '',
      isDefault: '',
      maximumInstallments: '',
      minimumPremium: '',
      organizationCode: 2,
      paymentInstallmentPercentage: '',
      subClassCode: 201,
      sumInsuredCurrencyCode: '',
      sumInsuredExchangeRate: '',
      surveyEvaluationRequired: false
    };

    // Create a spy for the createSubCovertype method of the subclassCoverTypesService
    const createSubCovertypeSpy = jest.spyOn(mockSubClassCoverTypesService, 'createSubCovertype').mockReturnValue(throwError(new HttpErrorResponse({})));

    // Create a spy for the displayErrorMessage method of the messageService
    const displayErrorMessageSpy = jest.spyOn(mockMessageService, 'displayErrorMessage');

    // Set the coverTypeForm value
    component.coverTypeForm.setValue(mockRequestBody);
    component.subclassCode = 201;

    mockRequestBody.certificateTypeShortDescription = null;
    mockRequestBody.certificateTypeCode = null;

    // Call the method under test
    try {
      component.createCovertype();
    }
    catch (e) {
      expect(createSubCovertypeSpy).toHaveBeenCalledWith(mockRequestBody);
      expect(displayErrorMessageSpy).toHaveBeenCalledWith('Error', 'Error, try again later');
    }

  });

  it('should update selectedCovertype, covertypeCode, and update cover type form', () => {
    const mockItem = {
      coverTypeCode: 1235
    };

    // Set initial values for selectedCovertype and covertypeCode
    component.selectedCovertype = null;
    component.covertypeCode = null;

    // Create spies for the necessary methods
    const patchValueSpy = jest.spyOn(component.updateCoverTypeForm, 'patchValue');
    const getallSubCovSectionsSpy = jest.spyOn(component, 'getallSubCovSections');
    const compareSectionsSpy = jest.spyOn(component, 'compareSections');

    // Call the method under test
    component.onSelectCovertype(mockItem);

    // Expectations
    expect(component.selectedCovertype).toBe(mockItem);
    expect(component.covertypeCode).toBe(mockItem.coverTypeCode);
    expect(patchValueSpy).toHaveBeenCalledWith(mockItem);
    expect(getallSubCovSectionsSpy).toHaveBeenCalled();
    expect(compareSectionsSpy).toHaveBeenCalled();
  });

  it('should update the form control value based on the selected covertypes', () => {
    // Create a mock event object
    const mockEvent = {
      target: {
        value: 'Private'
      }
    };

    // Create a mock selectedCovertypes object
    const mockSelectedCovertypes = {
      description: 'Private',
      code: 123
    };

    // Set up initial values for allCovertypes and coverTypeOperation
    component.allCovertypes = [
      {description: 'Private', code : 123},
      {description: '', code : 120}
    ];

    component['coverTypeOperation'] = 'update';

    const setValueSpy = jest.spyOn(component.updateCoverTypeForm.get('coverTypeCode'), 'setValue');

    // Call the method under test
    component.onCovertypesChange(mockEvent);

    expect(setValueSpy).toHaveBeenCalledWith(mockSelectedCovertypes.code);
  });

  it('should update the sectionCode form control based on the selected section', () => {
    // Create a mock event object
    const mockEvent = {
      target: {
        value: 'Section A'
      }
    };

    const mockSelectedSection = {
      sectionType: 'Section A',
      sectionCode: 123
    };

    component.loadSubclassSection = [
      {sectionType: 'Section A', sectionCode: 123},
      {sectionType: 'Section B', sectionCode: 200}
    ];

    const setValueSpy = jest.spyOn(component.sections.get('sectionCode'), 'setValue');

    // Call the method under test
    component.onSectionChange(mockEvent);

    // Expectations
    expect(setValueSpy).toHaveBeenCalledWith(mockSelectedSection?.sectionCode);
  });

  it('should update the sections form group on selecting section', () => {
    // Create a mock event object
    const mockEvent = {
      code: null,
      declaration: '',
      excessDetails: '',
      newSectionCode: 0,
      newSectionShortDescription: '',
      sectionCode: 123,
      sectionShortDescription: '',
      sectionType: '',
      subclassCode: 121,
      szaCode: 0,
      szaShortDesc: '',
      version: 0,
      wef: '',
      wet: ''
    };

    // Set up initial values for subclassCode and selected
    component.subclassCode = 178;
    component.selected = null;

    // Create a spy for the getSubclassSecByCode method
    const getSubclassSecByCodeSpy = jest.spyOn(component, 'getSubclassSecByCode');

    // Call the method under test
    component.onselectSection(mockEvent);

    // Expectations
    expect(getSubclassSecByCodeSpy).toHaveBeenCalledWith(component.subclassCode);
    expect(component.selected).toBe(mockEvent);
    expect(component.sections.value).toEqual(mockEvent);
  });

  it('should call necessary methods and update loadSubclassSection', () => {
    // Create a mock code
    const mockCode = '120';

    jest.spyOn(mockSubClassSectionsService, 'getSubclassSectionBySCode');

    // Call the method under test
    component.getSubclassSecByCode(mockCode);

    // Expectations
    expect(mockSubClassSectionsService.getSubclassSectionBySCode).toHaveBeenCalledWith(mockCode);
    expect(component.loadSubclassSection).toEqual([]);
  });

  it('should call necessary methods and display success message on successful update', () => {
    // Create a mock subsect object
    const mockSubsect: subSections = {
      code: 123,
      declaration: 'Sample Declaration',
      excessDetails: 'Sample Excess Details',
      newSectionCode: 0,
      newSectionShortDescription: 'Sample New Section Short Description',
      sectionCode: 456,
      sectionShortDescription: 'Sample Section Short Description',
      sectionType: 'Sample Section Type',
      subclassCode: 789,
      szaCode: 0,
      szaShortDesc: 'Sample SZA Short Description',
      version: 0,
      wef: '2022-01-01',
      wet: '2022-12-31'
    };


    component.sections.patchValue(mockSubsect);

    mockSubsect.code = null;

    const cancelUpdateClickSpy = jest.spyOn(component.cancelSectionUpdateTask.nativeElement, 'click');
    jest.spyOn(mockSubClassSectionsService , 'updatesubSection');
    jest.spyOn(mockMessageService, 'displaySuccessMessage');

    // Call the method under test
    component.updateSubSections();

    // Expectations
    expect(cancelUpdateClickSpy).toHaveBeenCalled();
    expect(mockSubClassSectionsService.updatesubSection).toHaveBeenCalledWith(mockSubsect, 123);
    expect(mockMessageService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully updated');
  });

  it('should call necessary methods and set subclassCode', () => {
    const loadAllSectionsBySubclassCodeSpy = jest.spyOn(component, 'loadAllSectionsBySubclassCode');
    const loadCovertypeBySubclassCodeSpy = jest.spyOn(component, 'loadCovertypeBySubclassCode');

    // Create a mock event
    const mockEvent = 123;

    // Call the method under test
    component.getSelectedSubclass(mockEvent);

    // Expectations
    expect(loadAllSectionsBySubclassCodeSpy).toHaveBeenCalledWith(mockEvent);
    expect(loadCovertypeBySubclassCodeSpy).toHaveBeenCalledWith(mockEvent);
    expect(component.subclassCode).toBe(mockEvent);
  });

  // it('should call necessary methods and display success message on successful creation', () => {
  //   // Create a mock selectedSection array
  //   const mockSelectedSection = [
  //     {
  //       code: 123,
  //       excessDetails: 'Sample Excess Details',
  //       shortDescription: 'Sample Short Description',
  //       type: 'Sample Type'
  //     },
  //     // Add more elements if needed...
  //   ];
  //
  //   // Create a spy for the cancelSectionBtn.click method
  //   const cancelSectionBtnClickSpy = jest.spyOn(component.cancelSectionTask.nativeElement, 'click');
  //   jest.spyOn(mockSubClassSectionsService, 'createSubSections');
  //   jest.spyOn(mockMessageService, 'displaySuccessMessage');
  //
  //   component.selectedSection = mockSelectedSection;
  //   // Call the method under test
  //   component.onclickSelect();
  //
  //   // Expectations
  //   expect(cancelSectionBtnClickSpy).toHaveBeenCalled();
  //   expect(mockSubClassSectionsService.createSubSections).toHaveBeenCalledTimes(mockSelectedSection.length);
  //   expect(mockSubClassSectionsService.createSubSections).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       code: null,
  //       declaration: "N",
  //       excessDetails: expect.any(String),
  //       newSectionCode: 0,
  //       newSectionShortDescription: "string",
  //       sectionCode: expect.any(Number),
  //       sectionShortDescription: expect.any(String),
  //       sectionType: expect.any(String),
  //       subclassCode: expect.any(Number),
  //       szaCode: 0,
  //       szaShortDesc: "string",
  //       version: 0,
  //       wef: "2013-03-10",
  //       wet: "2013-03-10"
  //     }));
  //
  //   // expect(mockSubClassSectionsService.createSubSections).toHaveBeenCalledWith({
  //   //   code: null,
  //   //   declaration: "N",
  //   //   excessDetails: expect.any(String),
  //   //   newSectionCode: 0,
  //   //   newSectionShortDescription: "string",
  //   //   sectionCode: expect.any(Number),
  //   //   sectionShortDescription: expect.any(String),
  //   //   sectionType: expect.any(String),
  //   //   subclassCode: expect.any(Number),
  //   //   szaCode: 0,
  //   //   szaShortDesc: "string",
  //   //   version: 0,
  //   //   wef: "2013-03-10",
  //   //   wet: "2013-03-10"
  //   // }));
  //   expect(mockMessageService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully created');
  //   // expect(component.selectedSection).toEqual([]);
  // });

});
