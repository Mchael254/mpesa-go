import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurrenderClaimsComponent } from './surrender-claims.component';

describe('SurrenderClaimsComponent', () => {
  let component: SurrenderClaimsComponent;
  let fixture: ComponentFixture<SurrenderClaimsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurrenderClaimsComponent]
    });
    fixture = TestBed.createComponent(SurrenderClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
