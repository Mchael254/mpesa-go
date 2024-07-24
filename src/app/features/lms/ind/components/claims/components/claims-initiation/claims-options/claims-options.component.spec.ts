import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsOptionsComponent } from './claims-options.component';

describe('ClaimsOptionsComponent', () => {
  let component: ClaimsOptionsComponent;
  let fixture: ComponentFixture<ClaimsOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsOptionsComponent]
    });
    fixture = TestBed.createComponent(ClaimsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
