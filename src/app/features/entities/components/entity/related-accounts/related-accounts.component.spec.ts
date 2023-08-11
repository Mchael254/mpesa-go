import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedAccountsComponent } from './related-accounts.component';

describe('RelatedAccountsComponent', () => {
  let component: RelatedAccountsComponent;
  let fixture: ComponentFixture<RelatedAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatedAccountsComponent]
    });
    fixture = TestBed.createComponent(RelatedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
