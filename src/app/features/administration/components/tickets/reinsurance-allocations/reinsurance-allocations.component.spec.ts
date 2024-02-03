import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinsuranceAllocationsComponent } from './reinsurance-allocations.component';

describe('ReinsuranceAllocationsComponent', () => {
  let component: ReinsuranceAllocationsComponent;
  let fixture: ComponentFixture<ReinsuranceAllocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReinsuranceAllocationsComponent]
    });
    fixture = TestBed.createComponent(ReinsuranceAllocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
