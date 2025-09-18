import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBankingProcessComponent } from './new-banking-process.component';

describe('NewBankingProcessComponent', () => {
  let component: NewBankingProcessComponent;
  let fixture: ComponentFixture<NewBankingProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewBankingProcessComponent]
    });
    fixture = TestBed.createComponent(NewBankingProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
