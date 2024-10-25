import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCategoriesComponent } from './request-categories.component';

describe('RequestCategoriesComponent', () => {
  let component: RequestCategoriesComponent;
  let fixture: ComponentFixture<RequestCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestCategoriesComponent]
    });
    fixture = TestBed.createComponent(RequestCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
