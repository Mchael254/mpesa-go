import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalClaimsComponent } from './external-claims.component';

describe('ExternalClaimsComponent', () => {
  let component: ExternalClaimsComponent;
  let fixture: ComponentFixture<ExternalClaimsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalClaimsComponent]
    });
    fixture = TestBed.createComponent(ExternalClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
