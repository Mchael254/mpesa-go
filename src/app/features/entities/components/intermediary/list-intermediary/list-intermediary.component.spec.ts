import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIntermediaryComponent } from './list-intermediary.component';

describe('ListIntermediaryComponent', () => {
  let component: ListIntermediaryComponent;
  let fixture: ComponentFixture<ListIntermediaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListIntermediaryComponent]
    });
    fixture = TestBed.createComponent(ListIntermediaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
