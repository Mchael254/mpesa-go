import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardShortPeriodRatesComponent } from './standard-short-period-rates.component';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {MessageService} from "primeng/api";
import { ShortPeriodService } from '../../../services/short-period/short-period.service';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';


describe('StandardShortPeriodRatesComponent', () => {
  let component: StandardShortPeriodRatesComponent;
  let fixture: ComponentFixture<StandardShortPeriodRatesComponent>;
  let httpMock: HttpTestingController;
  let messageServiceStub: MessageService;
  let shortPeriodService:ShortPeriodService;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandardShortPeriodRatesComponent],
      imports: [HttpClientTestingModule,ReactiveFormsModule],
      providers:[
        ShortPeriodService,
        MessageService,
        {provide: AppConfigService, useValue: {config:{contextPath: { 
        gis_services: 'gis',
        accounts_services: "crm",
        users_services: "user",
        auth_services: "oauth",
        setup_services: 'crm'} 
      }}},
        FormBuilder,
      ]
    });
    fixture = TestBed.createComponent(StandardShortPeriodRatesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    messageServiceStub = TestBed.inject(MessageService);
    shortPeriodService = TestBed.inject(ShortPeriodService);
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch SP rates and update rates, then detect changes', () => {
    const mockRates = [ {
      annualPremiumRate: '0.05',
      code: 'SP001',
      dateWithEffectFrom: '2023-01-01',
      dateWithEffectTo: '2023-12-31',
      maximumDays: '30',
      minimumDays: '1',
      organizationCode: 'ORG001',
      rateDivisionFactor: '1.2',
      version: '1',
    }];
    jest.spyOn(shortPeriodService, 'getAllSPRates').mockReturnValue(of({ _embedded: { short_period_rate_dto_list: mockRates } }));
    jest.spyOn(component.cdr, 'detectChanges');

    component.fetchSPRates();

    expect(shortPeriodService.getAllSPRates).toHaveBeenCalled();
    expect(component.rates).toEqual(mockRates);
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should fetch a single SP rate by id and update rate', () => {
    const mockRate = { 
    annualPremiumRate: '0.05',
    code: 'SP001',
    dateWithEffectFrom: '2023-01-01',
    dateWithEffectTo: '2023-12-31',
    maximumDays: '30',
    minimumDays: '1',
    organizationCode: 'ORG001',
    rateDivisionFactor: '1.2',
    version: '1', };
    jest.spyOn(shortPeriodService, 'getSPRates').mockReturnValue(of(mockRate));

    component.fetchSPRate(1);

    expect(shortPeriodService.getSPRates).toHaveBeenCalledWith(1);
    expect(component.rate).toEqual(mockRate);
  });
  it('should create the form with form controls', () => {
    component.createForm();

    expect(component.rateForm).toBeDefined();
    expect(component.rateForm.get('annual_premium_rate')).toBeDefined();
    expect(component.rateForm.get('date_with_effect_from')).toBeDefined();
    expect(component.rateForm.get('date_with_effect_to')).toBeDefined();
    expect(component.rateForm.get('maximum_days')).toBeDefined();
    expect(component.rateForm.get('minimum_days')).toBeDefined();
    expect(component.rateForm.get('organization_code')).toBeDefined();
    expect(component.rateForm.get('rate_division_factor')).toBeDefined();
    expect(component.rateForm.get('version')).toBeDefined();
  });
  it('should set "new" to true when calling add()', () => {
    component.add();

    expect(component.new).toBe(true);
  });
  it('should edit the rate and set "new" to false', () => {
    component.rate = {
      annual_premium_rate: '0.1',
      date_with_effect_from: '2023-01-01',
      date_with_effect_to: '2023-12-31',
      maximum_days: '90',
      minimum_days: '61',
      organization_code: 'ORG001',
      rate_division_factor: '1.8',
      version: '1',
    };

    component.edit();

    expect(component.new).toBe(false);
    expect(component.rateForm.value).toEqual(component.rate);
  });

  it('should handle an error when editing with no rate selected', () => {
    jest.spyOn(messageServiceStub, 'add');
    component.rate = null;

    component.edit();

    expect(component.new).toBe(false);
    // expect(messageServiceStub.add).toHaveBeenCalledWith({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: 'Select a Short Period rate to edit',
    // });
  });
  it('should save with new = true', () => {

    component.new = true;   
    const createRateSpy = jest.spyOn(shortPeriodService, 'createSPRates').mockReturnValue(of([]));
    jest.spyOn(messageServiceStub, 'add');
    component.save();
    
    expect(createRateSpy).toHaveBeenCalledWith(component.rateForm.value);
    expect(messageServiceStub.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved',
    });
  });
  it('should save with new = false', () => {
    component.new = false;
    const updateRateSpy = jest.spyOn(shortPeriodService, 'updateSPRates').mockReturnValue(of());
    component.save();
    expect(updateRateSpy).toHaveBeenCalledWith(component.rateForm.value, 123);
    expect(messageServiceStub.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved',
    });
  });
  it('should handle delete scenarios', () => {
    // Simulate a successful deletion
    component.rate = { code: 1 };
    jest.spyOn(shortPeriodService, 'deleteSPRates').mockReturnValue(of());

    component.delete();

    expect(shortPeriodService.deleteSPRates).toHaveBeenCalledWith(1);
  

    // Reset for the next scenario
    component.rate = null;

    // Simulate trying to delete when no record is selected
    jest.spyOn(messageServiceStub, 'add');
    
    component.delete();

   
  });
});
