import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { ClassesComponent } from './classes.component';
import { ClassesSubclassesService } from '../../../services/classes-subclasses/classes-subclasses.service';
import { Classes } from '../../../data/gisDTO';
import { of } from 'rxjs';

const mockAllClasse: Classes[] = [{
  classCode: '',
  classDescription: '',
  dateWithEffectFrom: '',
  dateWithEffectTo: '',
  claCrgCode: '',
  claReinCrgCode: '',
  shortDescription: '',
  maxPolicyAccumulationLimit: '',
  maxInsuredAccumulationLimit: '',
  organizationCode: 2,
  subClasses: []
}]

const mockClassDetail: Classes = {
  classCode: '700',
  classDescription: 'Class Details',
  dateWithEffectFrom: '',
  dateWithEffectTo: '',
  claCrgCode: '',
  claReinCrgCode: '',
  shortDescription: '',
  maxPolicyAccumulationLimit: '',
  maxInsuredAccumulationLimit: '',
  organizationCode: 2,
  subClasses: []
}

export class MockClassService {
  getAllClasses = jest.fn().mockReturnValue(of(mockAllClasse));
  getClasses = jest.fn().mockReturnValue(of(mockClassDetail));
  updateClass = jest.fn();
  createClass = jest.fn();
  deleteClass = jest.fn();
  getSubclass = jest.fn();
  deleteSubClass = jest.fn();
  getPerilByClass = jest.fn();
  getClassPeril = jest.fn();
  getAllPerils = jest.fn();
  getPeril = jest.fn();
  createClassPeril = jest.fn();
  updateClassPeril = jest.fn();
  deleteClassPeril = jest.fn();
  getAllSubperils = jest.fn();
  getExcessesByClass = jest.fn();
  getExcessesDetails = jest.fn();
  createExcesses = jest.fn();
  updateExcesses = jest.fn();
  deleteExcesses = jest.fn();
  getConditions = jest.fn();
}

describe('ClassesComponent', () => {
  let component: ClassesComponent;
  let fixture: ComponentFixture<ClassesComponent>;
  let classServiceStub: ClassesSubclassesService;
  let messageServiceStub: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: ClassesSubclassesService, useClass: MockClassService },
        MessageService
      ]
    });
    fixture = TestBed.createComponent(ClassesComponent);
    component = fixture.componentInstance;
    classServiceStub = TestBed.inject(ClassesSubclassesService);
    messageServiceStub = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should load all classes', () => {
    jest.spyOn(classServiceStub, 'getAllClasses');
    component.loadAllClasses();
    expect(classServiceStub.getAllClasses).toHaveBeenCalled();
    expect(component.classList).toEqual(mockAllClasse);
    expect(component.isDisplayed).toBeTruthy();
  });

  test('should get class details', () => {
    jest.spyOn(classServiceStub, 'getClasses');
    const event = mockClassDetail.classCode;
    component.getClass(event);

    expect(component.classDetails).toEqual(mockClassDetail);
    expect(component.classForm.value).toEqual(mockClassDetail);
  });
});
