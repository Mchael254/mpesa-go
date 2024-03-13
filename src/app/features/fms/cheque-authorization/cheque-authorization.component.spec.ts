import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeAuthorizationComponent } from './cheque-authorization.component';

describe('ChequeAuthorizationComponent', () => {
  let component: ChequeAuthorizationComponent;
  let fixture: ComponentFixture<ChequeAuthorizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChequeAuthorizationComponent]
    });
    fixture = TestBed.createComponent(ChequeAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
