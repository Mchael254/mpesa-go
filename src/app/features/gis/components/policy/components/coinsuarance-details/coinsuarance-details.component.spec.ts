import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsuaranceDetailsComponent } from './coinsuarance-details.component';

describe('CoinsuaranceDetailsComponent', () => {
  let component: CoinsuaranceDetailsComponent;
  let fixture: ComponentFixture<CoinsuaranceDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoinsuaranceDetailsComponent]
    });
    fixture = TestBed.createComponent(CoinsuaranceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
