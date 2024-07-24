import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsProcessComponent } from './claims-process.component';

describe('ClaimsProcessComponent', () => {
  let component: ClaimsProcessComponent;
  let fixture: ComponentFixture<ClaimsProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsProcessComponent]
    });
    fixture = TestBed.createComponent(ClaimsProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
