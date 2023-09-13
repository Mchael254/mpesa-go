import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerilComponent } from './peril.component';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { PerilsService } from '../../../services/perils-territories/perils/perils.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MessageService} from "primeng/api";
import { of } from 'rxjs';
import { Peril } from '../../../data/gisDTO';
import { Validators } from '@angular/forms';

describe('PerilComponent', () => {
  let component: PerilComponent;
  let fixture: ComponentFixture<PerilComponent>;
  let messageServiceStub: MessageService;
  let perilService:PerilsService;
  let cdr: any; 
  beforeEach(() => {

    cdr = {
      detectChanges: jest.fn(),
    };
  
    TestBed.configureTestingModule({
      declarations: [PerilComponent],
      imports:[
        HttpClientTestingModule
      ],
      providers: [ 
        PerilsService,
        MessageService,
        {provide: AppConfigService, useValue: {config:{contextPath: { 
        accounts_services: "crm",
        users_services: "user",
        auth_services: "oauth",
        setup_services: 'crm' } }}}]
    });
    fixture = TestBed.createComponent(PerilComponent);
    component = fixture.componentInstance;
    messageServiceStub = TestBed.inject(MessageService);
    perilService = TestBed.inject(PerilsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all perils', () => {
    const mockPerilList = [{ 
      code: '123',
      shortDescription: 'Peril 1',
      description: 'Peril 1 Description',
      fullDescription: 'Peril 1 Full Description',
      paymentType: 'Payment Type 1',
      dateWithEffectFrom:'1/2/23',
      dateWithEffectTo: '1/2/23',
      perilType: 'Peril Type 1',
      organizationCode: 'Organization Code 1'
    }];
    jest.spyOn(perilService, 'getAllPerils').mockReturnValue(of(mockPerilList));
    component.loadAllPerils();
    expect(component.perilList).toEqual(mockPerilList);
  });
  it('should load perils', () => {
    const mockPerilDetails = { 
      code: '123',
      shortDescription: 'Peril 1',
      description: 'Peril 1 Description',
      fullDescription: 'Peril 1 Full Description',
      paymentType: 'Payment Type 1',
      dateWithEffectFrom:'1/2/23',
      dateWithEffectTo: '1/2/23',
      perilType: 'Peril Type 1',
      organizationCode: 'Organization Code 1'
    };
    jest.spyOn(perilService, 'getPeril').mockReturnValue(of(mockPerilDetails));
    component.loadPerils(1, mockPerilDetails);
    expect(component.perilDetails).toEqual(mockPerilDetails);
    expect(component.perilForm.get('shortDescription').value).toEqual(mockPerilDetails.shortDescription);
    expect(component.selected).toEqual(mockPerilDetails);
    expect(component.new).toBeFalsy();
  });
  it('should check if item is active', () => {
    const mockItem = { id: 1, name: 'Peril 1' };
    component.selected = mockItem;
    const isActive = component.isActive(mockItem);
    expect(isActive).toBeTruthy();
  });
  it('should create perilForm and searchForm', () => {
    component.createPerilForm();

    expect(component.perilForm).toBeDefined();
    expect(component.searchForm).toBeDefined();
    expect(component.perilForm.get('shortDescription').validator).toBe(Validators.required);
    expect(component.searchForm.get('search').value).toBe('');
  });
  it('should reset the form and set "new" to true', () => {
    // Set the form values to simulate a filled form
    component.perilForm.setValue({
      shortDescription: 'Test',
      description: 'Test description',
      fullDescription: 'This is a test',
      paymentType: 'Test payment type',
      dateWithEffectFrom: '2023-05-01',
      dateWithEffectTo: '2023-05-02',
      perilType: 'Test peril type',
      organizationCode: 'Test organization code'
    });

    // Call the method to be tested
    component.New();

   
    expect(component.new).toBe(true);
  });
  it('should save with new = true', () => {

    component.new = true;   
    const createPerilSpy = jest.spyOn(component.service, 'createPeril').mockReturnValue(of([]));
    jest.spyOn(messageServiceStub, 'add');
    component.save();
    
    expect(createPerilSpy).toHaveBeenCalledWith(component.perilForm.value);
    expect(messageServiceStub.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved',
    });
  });

  it('should save with new = false', () => {
    component.new = false;
    const updatePerilSpy = jest.spyOn(component.service, 'updatePeril').mockReturnValue(of());
    component.save();
    expect(updatePerilSpy).toHaveBeenCalledWith(component.perilForm.value, 123);
    expect(messageServiceStub.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved',
    });
  });
  
});
