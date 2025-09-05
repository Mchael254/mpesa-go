import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseComponent } from './base.component';
import {SystemsDto} from "../../../../shared/data/common/systemsDto";
import {of} from "rxjs";
import {SystemsService} from "../../../../shared/services/setups/systems/systems.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const mockSystem: SystemsDto[] = [
  {
    id: 1,
    shortDesc: "GIS",
    systemName: "General Insurance"
  },
  {
    id: 2,
    shortDesc: 'CORE',
    systemName: 'Core System'
  }
]

export class MockSystemsService {
  getSystems = jest.fn().mockReturnValue(of([]));
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  let mockSystemsService: SystemsService;
  let mockRouter: any;
  let mockGlobalMessagingService: GlobalMessagingService;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    };
    TestBed.configureTestingModule({
      declarations: [BaseComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: SystemsService, useClass: MockSystemsService},
        {provide: Router, useValue: mockRouter},
        {provide: GlobalMessagingService, useClass: MockGlobalMessageService},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    mockSystemsService = TestBed.inject(SystemsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchSystems on ngOnInit', () => {
    jest.spyOn(mockSystemsService, 'getSystems').mockReturnValue(of(mockSystem));
    component.ngOnInit();
    component.fetchSystems();
    expect(mockSystemsService.getSystems).toHaveBeenCalled();
    expect(component.systems).toEqual(mockSystem);
  });

  it('should assign the selected system when selectSystem is called', () => {
    const selectedSystem = mockSystem[0];
    component.selectSystem(selectedSystem);
    expect(component.selectedSystem).toEqual(selectedSystem);
  });

  it('should fetch systems successfully and update the systems array', () => {
    jest.spyOn(mockSystemsService, 'getSystems').mockReturnValue(of(mockSystem));
    component.fetchSystems();
    expect(component.systems).toEqual(mockSystem);
  });


  it('should navigate to the correct route based on selected system', () => {
    component.selectedSystem = mockSystem[1];
    component.routeToSelectedSystem();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/crm-screen-setup']);
  });

  it('should not navigate if selected system is undefined', () => {
    component.selectedSystem = mockSystem[0];
    component.routeToSelectedSystem();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
