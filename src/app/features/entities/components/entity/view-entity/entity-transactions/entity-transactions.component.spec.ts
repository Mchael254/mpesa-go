import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTransactionsComponent } from './entity-transactions.component';

describe('EntityTransactionsComponent', () => {
  let component: EntityTransactionsComponent;
  let fixture: ComponentFixture<EntityTransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityTransactionsComponent]
    });
    fixture = TestBed.createComponent(EntityTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
