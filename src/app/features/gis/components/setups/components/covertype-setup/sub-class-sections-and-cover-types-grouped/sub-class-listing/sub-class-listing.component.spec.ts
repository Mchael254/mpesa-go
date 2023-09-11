import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

import { SubClassListingComponent } from './sub-class-listing.component';
import {ClassesSubclassesService} from "../../../../services/classes-subclasses/classes-subclasses.service";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CustomFilterPipe} from "../../../../../../../../shared/pipes/custom-filter/custom-filter.pipe";
import {ChangeDetectorRef} from "@angular/core";
import {SubclassesDTO} from "../../../../data/gisDTO";
import {of} from "rxjs";
import {AppConfigService} from "../../../../../../../../core/config/app-config-service";

class MockClassesSubclassesService {
  getSubclasses1 = jest.fn().mockReturnValue([]);
}

class MockAppConfigService {
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

describe('SubClassListingComponent', () => {
  let component: SubClassListingComponent;
  let classesSubclassesService: Partial<ClassesSubclassesService>;
  let fixture: ComponentFixture<SubClassListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [SubClassListingComponent, CustomFilterPipe],
      providers: [
        {provide: ClassesSubclassesService, useClass: MockClassesSubclassesService},
        { provide: ComponentFixtureAutoDetect, useValue: true },
        FormBuilder,
        ChangeDetectorRef
      ]
    });
    fixture = TestBed.createComponent(SubClassListingComponent);
    classesSubclassesService = TestBed.inject(ClassesSubclassesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all subclasses on initialization', () => {

    const mockSubclasses: SubclassesDTO[] = [

    ];
    jest.spyOn(component, 'loadAllSubclasses');
    jest.spyOn(classesSubclassesService, 'getSubclasses1').mockReturnValue(of(mockSubclasses));


    component.ngOnInit();

    expect(component.loadAllSubclasses).toHaveBeenCalled();
    expect(classesSubclassesService.getSubclasses1).toHaveBeenCalled();
    expect(component.subclassList).toEqual(mockSubclasses);
    expect(component.isDisplayed).toBeTruthy();
  });

  it('should emit the selected subclass code', () => {
    const mockSubclassCode = 123;
    const emitSpy = jest.spyOn(component.selectedSubclassEvent, 'emit');

    component.selectedSubclass({ code: mockSubclassCode , description: 'test'});

    expect(component.subclassForm.value.code).toEqual(mockSubclassCode);
    expect(emitSpy).toHaveBeenCalledWith(mockSubclassCode);
  });

});
