import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CoverComponent } from './cover.component';
import { CoverTypeService } from '../../../services/cover-type/cover-type.service';
import { GlobalMessagingService } from '../../../../../../../shared/services/messaging/global-messaging.service';
import { of } from 'rxjs';
import { CoverTypes } from '../../../data/gisDTO';

  const coverList: CoverTypes[] = [
      {
        code: 0,
        short_description: 'Mock cover type',
        description: 'This is a mock cover type',
        details: 'Mock cover type details',
        minimum_sum_insured: 1000,
        downgrade_on_suspension: 'false',
        downgrade_on_suspension_to: '',
        organization_code: 2,
        version: 1,
      },
    
];

const mockCoverDetails: CoverTypes = { 
      code: 123,
      short_description: 'Mock cover type',
      description: 'This is a mock cover type',
      details: 'Mock cover type details',
      minimum_sum_insured: 1000,
      downgrade_on_suspension: 'false',
      downgrade_on_suspension_to: '',
      organization_code: 1,
      version: 2,
};

const mockCreateCoverDetails: CoverTypes[] =
  [
    {
      code: 123,
      short_description: 'Create cover type',
      description: 'This is a mock cover type',
      details: 'Mock cover type details',
      minimum_sum_insured: 1000,
      downgrade_on_suspension: 'false',
      downgrade_on_suspension_to: '',
      organization_code: 1,
      version: 2,
    }
  ];
     

export class MockCoverTypeService {
  getAllCovertypes = jest.fn().mockReturnValue(of({_embedded: { cover_type_dto_list: coverList }}));
  getCoverType = jest.fn().mockReturnValue(of(coverList));
  createCover = jest.fn().mockReturnValue(of(mockCreateCoverDetails));
  updateCover = jest.fn().mockReturnValue(of(mockCoverDetails));
  deleteCover = jest.fn().mockReturnValue(of(coverList));
}

export class MockGlobalMessageService {
  displaySuccessMessage = jest.fn();
  displayErrorMessage = jest.fn();
}

describe('CoverComponent', () => {
  let component: CoverComponent;
  let fixture: ComponentFixture<CoverComponent>;
  let coverTypeServiceStub: CoverTypeService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoverComponent],
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
    fixture = TestBed.createComponent(CoverComponent);
    component = fixture.componentInstance;
    coverTypeServiceStub = TestBed.inject(CoverTypeService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should have Class Form', () => {
    expect(component.coverForm).toBeTruthy();
    expect(Object.keys(component.coverForm.controls)).toContain('short_description');
    expect(Object.keys(component.coverForm.controls)).toContain('details');
    expect(Object.keys(component.coverForm.controls)).toContain('description');
    expect(Object.keys(component.coverForm.controls)).toContain('minimum_sum_insured');
    expect(Object.keys(component.coverForm.controls)).toContain('downgrade_on_suspension');
    expect(Object.keys(component.coverForm.controls)).toContain('downgrade_on_suspension_to');
    expect(Object.keys(component.coverForm.controls)).toContain('organization_code');
    expect(Object.keys(component.coverForm.controls)).toContain('version');
    
  });

  test('should load all cover type from the service', () => {
    jest.spyOn(coverTypeServiceStub, 'getAllCovertypes');
    component.loadAllCovertypes();
    expect(coverTypeServiceStub.getAllCovertypes).toHaveBeenCalled();
    expect(component.coverTypeData).toEqual(coverList);
  });

  test('should load Cover Types details', () => {
    const id = 'test id';
    const item = 'test item';

    jest.spyOn(coverTypeServiceStub, 'getCoverType');
    component.loadCoverType(id, item);
    
    expect(component.coverDetails).toEqual(coverList);
    expect(component.selected).toEqual(item);
  });

  test('should add new cover', () => {
    const mockParamForm = {
      short_description: 'Mock cover type',
      description: 'This is a mock cover type',
      details: 'Mock cover type details',
      minimum_sum_insured: '1000',
      downgrade_on_suspension: 'false',
      downgrade_on_suspension_to: '',
      organization_code: 'ORG001',
      version: '1',
    };
    jest.spyOn(coverTypeServiceStub, 'createCover');
    component.coverForm.setValue(mockParamForm);
    component.new = true;
    component.save();
    expect(coverTypeServiceStub.createCover).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('success', 'Cover successfully created');
  });

  // test('should call coverTypesService.updateCover, reset form and show success message', () => {
  //   jest.spyOn(coverTypeServiceStub, 'updateCover');
  //   jest.spyOn(component.coverForm, 'reset');
  //   jest.spyOn(messageServiceStub, 'displaySuccessMessage');
  //   component.coverDetails = { 
  //     code:'123',
  //     short_description: 'Mock cover type',
  //     description: 'This is a mock cover type',
  //     details: 'Mock cover type details',
  //     minimum_sum_insured: '1000',
  //     downgrade_on_suspension: 'false',
  //     downgrade_on_suspension_to: '',
  //     organization_code: 'ORG001',
  //     version: '1',
  //   };
  //   setTimeout(() => {
  //     component.updateCover();
  //     expect(coverTypeServiceStub.updateCover).toHaveBeenCalledWith(component.coverForm.value, component.coverDetails.code);
  //     expect(component.coverForm.reset).toHaveBeenCalled();
  //     expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
  //       'success',
  //       `Cover Updated Successfully`
  //     );
  //   });
  // });

  test('should update cover', () => {
    jest.spyOn(coverTypeServiceStub, 'updateCover');
    component.coverDetails = mockCoverDetails;

    component.updateCover();

    // expect(coverTypeServiceStub.updateCover).toHaveBeenCalledWith(mockCoverDetails, mockCoverDetails.code);
    expect(coverTypeServiceStub.updateCover).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('success', 'Cover successfully Updated');
  });
  
  test('should delete cover', () => {
    jest.spyOn(coverTypeServiceStub, 'deleteCover');
    const mockCoverDetail = coverList[0].code;
    component.selected = mockCoverDetails;
    component.deleteCover();
    expect(component.selected).toBeDefined();
    expect(coverTypeServiceStub.deleteCover).toHaveBeenCalledWith(mockCoverDetail);
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
      'success',
      `Cover of code ${mockCoverDetail} successfully Deleted`
    );
  });
});
