import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOtherDetailsFormComponent } from './edit-other-details-form.component';

describe('EditOtherDetailsFormComponent', () => {
  let component: EditOtherDetailsFormComponent;
  let fixture: ComponentFixture<EditOtherDetailsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOtherDetailsFormComponent]
    });
    fixture = TestBed.createComponent(EditOtherDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
