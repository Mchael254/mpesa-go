import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCoverageDetailsComponent } from './admin-coverage-details.component';

describe('AdminCoverageDetailsComponent', () => {
  let component: AdminCoverageDetailsComponent;
  let fixture: ComponentFixture<AdminCoverageDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCoverageDetailsComponent]
    });
    fixture = TestBed.createComponent(AdminCoverageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
