import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReportsComponent } from './reports.component';
import { Router } from '@angular/router';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let routerStub: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      imports: [RouterTestingModule],
    });
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    routerStub = TestBed.inject(Router);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should navigate to "create-report"', () => {
    const navigateSpy = jest.spyOn(routerStub,'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#create-report-btn');
    button.click();
    expect(component.createReports.call).toBeTruthy();
    expect(navigateSpy).toHaveBeenCalledWith(['/home/reportsv2/create-report']);
  });

  test('should set activeTab to "myReports" on myReports() call', () => {
    component.myReports();
    expect(component.activeTab).toBe('myReports');
  });

  test('should set activeTab to "sharedReports" on sharedReports() call', () => {
    component.sharedReports();
    expect(component.activeTab).toBe('sharedReports');
  });

  test('should have initial activeTab set to "myReports"', () => {
    expect(component.activeTab).toBe('myReports');
  });
});
