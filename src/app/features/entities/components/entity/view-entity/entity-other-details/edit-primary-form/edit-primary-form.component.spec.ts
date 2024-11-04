import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrimaryFormComponent } from './edit-primary-form.component';

describe('EditPrimaryFormComponent', () => {
  let component: EditPrimaryFormComponent;
  let fixture: ComponentFixture<EditPrimaryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPrimaryFormComponent]
    });
    fixture = TestBed.createComponent(EditPrimaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
