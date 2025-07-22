import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeIdentityComponent } from './prime-identity.component';

describe('PrimeIdentityComponent', () => {
  let component: PrimeIdentityComponent;
  let fixture: ComponentFixture<PrimeIdentityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrimeIdentityComponent]
    });
    fixture = TestBed.createComponent(PrimeIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
