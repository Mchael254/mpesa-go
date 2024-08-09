import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityLevelsActivityStatusComponent } from './priority-levels-activity-status.component';

describe('PriorityLevelsActivityStatusComponent', () => {
  let component: PriorityLevelsActivityStatusComponent;
  let fixture: ComponentFixture<PriorityLevelsActivityStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriorityLevelsActivityStatusComponent]
    });
    fixture = TestBed.createComponent(PriorityLevelsActivityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
