import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDashboardComponent } from './create-dashboard.component';
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MessageService} from "primeng/api";
import {DropdownModule} from "primeng/dropdown";
import {DynamicChartComponent} from "../../../shared/components/dynamic-chart/dynamic-chart.component";
import {MenuModule} from "primeng/menu";

describe('CreateDashboardComponent', () => {
  let component: CreateDashboardComponent;
  let fixture: ComponentFixture<CreateDashboardComponent>;

  let globalMessagingServiceStub: GlobalMessagingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateDashboardComponent,
        DynamicChartComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        DropdownModule,
        MenuModule,
        ],
      providers: [
        GlobalMessagingService,
        MessageService,
      ],
    });
    fixture = TestBed.createComponent(CreateDashboardComponent);
    component = fixture.componentInstance;
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display success message when create dashboard is clicked', () => {

    const displaySuccessMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    component.onCreateDashboard();
    expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', `Successfully Created Dashboard`);
  });

  it('should display success message when add report is clicked',  () => {

    const displaySuccessMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    component.addReport();
    expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', `Report Added`);
  });

  it('should display success message when on delete',  () => {

    const displaySuccessMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    component.delete();
    expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', `Report Deleted`);
  });
});
