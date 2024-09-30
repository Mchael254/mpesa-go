import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimTransactionComponent } from './claim-transaction.component';

describe('ClaimTransactionComponent', () => {
  let component: ClaimTransactionComponent;
  let fixture: ComponentFixture<ClaimTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimTransactionComponent]
    });
    fixture = TestBed.createComponent(ClaimTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
