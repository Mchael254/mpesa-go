import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonsForPendingComponent } from './reasons-for-pending.component';

describe('ReasonsForPendingComponent', () => {
  let component: ReasonsForPendingComponent;
  let fixture: ComponentFixture<ReasonsForPendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReasonsForPendingComponent]
    });
    fixture = TestBed.createComponent(ReasonsForPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
