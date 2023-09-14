import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionComponent } from './section.component';
import { CoverTypeService } from '../../../services/cover-type/cover-type.service';
import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Sections } from '../../../data/gisDTO';

const sectionsMock: Sections[] = [{
  code: 0,
  shortDescription: '',
  description: '',
  classCode: null,
  type: '',
  excessDetails: null,
  section: null,
  webDescription: '',
  dtlDescription: null,
  organizationCode: 0
}]

const sectionDetailMock: Sections = {
  code: 1,
  shortDescription: 'Section Details',
  description: 'Selected Section',
  classCode: null,
  type: '',
  excessDetails: null,
  section: null,
  webDescription: '',
  dtlDescription: null,
  organizationCode: 2
}


export class MockCoverTypeService {
  getAllSections = jest.fn().mockReturnValue(of(sectionsMock));
  getSectionId = jest.fn().mockReturnValue(of(sectionDetailMock));
  saveSection = jest.fn().mockReturnValue(of(sectionDetailMock));
  createSection = jest.fn();
 }
export class MockGlobalMessageService {
  displaySuccessMessage = jest.fn();
  displayErrorMessage = jest.fn();
}

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let coverTypeServiceStub: CoverTypeService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: CoverTypeService, useClass: MockCoverTypeService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService }

      ]
    });
    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    coverTypeServiceStub = TestBed.inject(CoverTypeService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should load all sections', () => {
    jest.spyOn(coverTypeServiceStub, 'getAllSections');
    component.loadAllSections();
    expect(coverTypeServiceStub.getAllSections).toHaveBeenCalled();
    expect(component.sectionsList).toEqual(sectionsMock);
   });
  
  test('should select a section', () => {
    jest.spyOn(coverTypeServiceStub, 'getSectionId');
    component.selectedSection(sectionDetailMock.code, {});
    expect(coverTypeServiceStub.getSectionId).toHaveBeenCalledWith(sectionDetailMock.code);
    expect(component.sectionDetails).toEqual(sectionDetailMock);
  });

  test('should update a section', () => {
    jest.spyOn(coverTypeServiceStub, 'saveSection');
    component.sectionForm.setValue(sectionDetailMock);
    component.updateSection();
    // expect(coverTypeServiceStub.saveSection).toHaveBeenCalledWith(sectionDetailMock, sectionDetailMock.code);
    expect(coverTypeServiceStub.saveSection).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('success', 'Section successfully Updated!');
  });

  test('should create a new section', () => {
    component.createNewSection();

    expect(component.isUpdate).toBe(false);
  });

  test('should save an existing section', () => {
    component.isUpdate = true;
    const updateSpy = jest.spyOn(component, 'updateSection');

    component.save();

    expect(updateSpy).toHaveBeenCalled();
  });

  test('should save a new section', () => {
    component.isUpdate = false;
    const createSpy = jest.spyOn(component, 'createSection');

    component.save();

    expect(createSpy).toHaveBeenCalled();
  });
});
