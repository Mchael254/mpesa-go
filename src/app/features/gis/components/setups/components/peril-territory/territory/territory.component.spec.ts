import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TerritoryComponent } from './territory.component';
import { TerritoriesService } from '../../../services/perils-territories/territories/territories.service';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {MessageService} from "primeng/api";
import { of } from 'rxjs';
import { territories } from '../../../data/gisDTO';
import { FormBuilder } from '@angular/forms';

describe('TerritoryComponent', () => {
  let component: TerritoryComponent;
  let fixture: ComponentFixture<TerritoryComponent>;
  let territoriesService:TerritoriesService
  let httpMock: HttpTestingController;
  let messageServiceStub: MessageService;
  let cdr;
  let fb: FormBuilder;
  beforeEach(() => {
    cdr = {
      detectChanges: jest.fn(),
    };
  
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TerritoryComponent],
      providers:[
        TerritoriesService,
        MessageService,
        {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis' } }}}  
      ]
    });
    fixture = TestBed.createComponent(TerritoryComponent);
    territoriesService = TestBed.inject(TerritoriesService);
    httpMock = TestBed.inject(HttpTestingController);
    messageServiceStub = TestBed.inject(MessageService);
    fb = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load all territories and update the component properties', fakeAsync(() => {
    const mockTerritories = [  {
      code: 1,
      description: 'Territory 1',
      details: 'Details 1',
      organizationCode: 101,
    },
    {
      code: 2,
      description: 'Territory 2',
      details: 'Details 2',
      organizationCode: 102,
    },];
    jest.spyOn(territoriesService, 'getAllTerritories').mockReturnValue(of(mockTerritories));

    component.loadAllTerritories();


    expect(component.isDisplayed).toBe(true);
    expect(component.territoryList).toEqual(mockTerritories);
    expect(component.filteredTerritories).toEqual(mockTerritories);
   
  }));
  it('should load a single territory and update the component properties', fakeAsync(() => {
    // Define mock data of type 'territories'
    const mockTerritory = {
      code: 1,
      description: 'Territory 1',
      details: 'Details 1',
      organizationCode: 101,
    };

    jest.spyOn(territoriesService, 'getTerritory').mockReturnValue(of(mockTerritory));
    jest.spyOn(component.cdr, 'detectChanges');

    const itemId = 1;
    const item = { id: itemId, name: 'Item 1' };

    component.loadTerritory(itemId, item);

    tick(); // Simulate the passage of time for the observable

    expect(component.territory).toEqual(mockTerritory);
    expect(component.selected).toBe(item);
    expect(component.new).toBe(false);
    expect(component.territoryForm.value).toEqual(mockTerritory);
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  }));
  it('should check if item is active', () => {
    const mockItem = { id: 1, name: 'Peril 1' };
    component.selected = mockItem;
    const isActive = component.isActive(mockItem);
    expect(isActive).toBeTruthy();
  });
   it('should create the form with the expected controls and validators', () => {
    component.createForm();

    expect(component.territoryForm).toBeDefined();
    expect(component.territoryForm.get('code')).toBeDefined();
    expect(component.territoryForm.get('description')).toBeDefined();
    expect(component.territoryForm.get('details')).toBeDefined();
    expect(component.territoryForm.get('organizationCode')).toBeDefined();


    expect(component.territoryForm.get('code')?.getError('required')).toBeTruthy();
    expect(component.territoryForm.get('description')?.getError('required')).toBeTruthy();
    expect(component.territoryForm.get('details')?.getError('required')).toBeTruthy();
    expect(component.territoryForm.get('organizationCode')?.getError('required')).toBeTruthy();
  });
  it('should reset the form, set "new" to true, and remove the "code" control', () => {
    component.territoryForm = fb.group({
      code: '123',
      description: 'Description',
      details: 'Details',
      organizationCode: '456',
    });
    component.new = false;

    component.New();

    expect(component.territoryForm.get('code')).toBeNull();
    expect(component.territoryForm.value).toEqual({
      description: null,
      details: null,
      organizationCode: null,
    });
    expect(component.new).toBe(true);
  });
  it('should save with new = true', () => {

    component.new = true;   
    const createTerritorySpy = jest.spyOn(component.service, 'createTerritory').mockReturnValue(of([]));
    jest.spyOn(messageServiceStub, 'add');
    component.save();
    
    expect(createTerritorySpy).toHaveBeenCalledWith(component.territoryForm.value);
    expect(messageServiceStub.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved',
    });
  });
  it('should save with new = false', () => {
    component.new = false;
    const updateTerritorySpy = jest.spyOn(component.service, 'updateTerritory').mockReturnValue(of());
    component.save();
    expect(updateTerritorySpy).toHaveBeenCalledWith(component.territoryForm.value, 123);
    expect(messageServiceStub.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved',
    });
  });
});
