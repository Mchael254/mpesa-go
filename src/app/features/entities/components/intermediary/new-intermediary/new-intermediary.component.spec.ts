import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIntermediaryComponent } from './new-intermediary.component';

describe('NewIntermediaryComponent', () => {
  let component: NewIntermediaryComponent;
  let fixture: ComponentFixture<NewIntermediaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewIntermediaryComponent]
    });
    fixture = TestBed.createComponent(NewIntermediaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
