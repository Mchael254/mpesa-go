import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathClaimsComponent } from './death-claims.component';

describe('DeathClaimsComponent', () => {
  let component: DeathClaimsComponent;
  let fixture: ComponentFixture<DeathClaimsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeathClaimsComponent]
    });
    fixture = TestBed.createComponent(DeathClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
