import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {DynamicSetupScreensConfigComponent} from './dynamic-setup-screens-config.component';
import {of} from 'rxjs';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {GlobalMessagingService} from "../../services/messaging/global-messaging.service";
import {SystemsService} from "../../services/setups/systems/systems.service";
import {SystemsDto} from "../../data/common/systemsDto";
import {TranslateModule} from "@ngx-translate/core";

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

describe('DynamicSetupScreensConfigComponent', () => {
  let component: DynamicSetupScreensConfigComponent;
  let fixture: ComponentFixture<DynamicSetupScreensConfigComponent>;
  let mockSystemsService: SystemsService;
  let mockRouter: any;
  let mockGlobalMessagingService: GlobalMessagingService;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [DynamicSetupScreensConfigComponent],
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
    fixture = TestBed.createComponent(DynamicSetupScreensConfigComponent);
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
