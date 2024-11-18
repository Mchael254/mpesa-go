import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalClaimsComponent } from './internal-claims.component';

describe('InternalClaimsComponent', () => {
  let component: InternalClaimsComponent;
  let fixture: ComponentFixture<InternalClaimsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalClaimsComponent]
    });
    fixture = TestBed.createComponent(InternalClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
