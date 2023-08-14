import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffModalComponent } from './staff-modal.component';

describe('StaffModalComponent', () => {
  let component: StaffModalComponent;
  let fixture: ComponentFixture<StaffModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffModalComponent]
    });
    fixture = TestBed.createComponent(StaffModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
