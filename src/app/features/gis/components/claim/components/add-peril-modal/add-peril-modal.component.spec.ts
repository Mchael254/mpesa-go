import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPerilModalComponent } from './add-peril-modal.component';

describe('AddPerilModalComponent', () => {
  let component: AddPerilModalComponent;
  let fixture: ComponentFixture<AddPerilModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPerilModalComponent]
    });
    fixture = TestBed.createComponent(AddPerilModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
