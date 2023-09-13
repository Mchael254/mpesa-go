import {ComponentFixture, TestBed, tick} from '@angular/core/testing';

import { DynamicBreadcrumbComponent } from './dynamic-breadcrumb.component';
import {Router, RouterLinkWithHref} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

describe('DynamicBreadcrumbComponent', () => {
  let component: DynamicBreadcrumbComponent;
  let router: Router;

  let fixture: ComponentFixture<DynamicBreadcrumbComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [DynamicBreadcrumbComponent],
    });
    fixture = TestBed.createComponent(DynamicBreadcrumbComponent);
    router = TestBed.inject(Router);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the breadcrumb items correctly', () => {
    component.breadCrumbItems = [
      { label: 'Home', url: '/home' },
      { label: 'Dashboard', url: '/home/dashboard' },
      { label: 'Users', url: '/home/dashboard/users' },
    ];
    fixture.detectChanges();

    const breadcrumbItems = fixture.nativeElement.querySelectorAll('.breadcrumb-item');
    expect(breadcrumbItems.length).toBe(3);

    expect(breadcrumbItems[0].textContent).toContain('Home');
    expect(breadcrumbItems[1].textContent).toContain('Dashboard');
    expect(breadcrumbItems[2].textContent).toContain('Users');
  });

  it('should mark the last breadcrumb item as active', () => {
    component.breadCrumbItems = [
      { label: 'Home', url: '/home' },
      { label: 'Dashboard', url: '/home/dashboard' },
      { label: 'Users', url: '/home/dashboard/users' },
    ];
    fixture.detectChanges();

    const breadcrumbItems = fixture.nativeElement.querySelectorAll('.breadcrumb-item');
    expect(breadcrumbItems[2].classList).toContain('active');
  });

});
