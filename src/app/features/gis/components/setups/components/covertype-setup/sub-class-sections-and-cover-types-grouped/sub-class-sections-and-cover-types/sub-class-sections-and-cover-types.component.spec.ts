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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SubClassListingComponent} from "../sub-class-listing/sub-class-listing.component";
import {TableModule} from "primeng/table";
import {PickListModule} from "primeng/picklist";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CustomFilterPipe} from "../../../../../../../../shared/pipes/custom-filter/custom-filter.pipe";
import {of} from "rxjs";

class MockSubClassSectionsService {
  getSubclassSectionBySCode = jest.fn();
  getFilteredArray = jest.fn();
  getsubSecArray = jest.fn();
  updatesubSection = jest.fn();
  createSubSections = jest.fn();
}

class MockSubClassCoverTypesService {
  getSubclassCovertypeBySCode = jest.fn();
  updateSubCovertype = jest.fn();
  createSubCovertype = jest.fn();
}

class MockSubClassCoverTypesSectionsService {
  getAllSubCovSection  = jest.fn();
  createSub = jest.fn();
  deleteSubCovSec = jest.fn();
}

class MockSectionsService {
  getAllSections = jest.fn();
}

class MockCoverTypesService {
  getAllCovertypes1 = jest.fn().mockReturnValue(of([]));
}

class MockCurrencyService {
  getAllCurrencies = jest.fn();
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
      imports: [FormsModule, ReactiveFormsModule, TableModule, PickListModule, HttpClientTestingModule],
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
        { provide: ComponentFixtureAutoDetect, useValue: true }
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

  it('should create cover type form on init', () => {
    // Arrange
    jest.spyOn(component, 'createCoverTypeForm');

    // Act
    component.ngOnInit();

    // Assert
    expect(component.createCoverTypeForm).toHaveBeenCalled();
    expect(component.coverTypeForm).toBeTruthy();
  });

});
