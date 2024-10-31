import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResidentialFormComponent } from './edit-residential-form.component';

describe('EditResidentialFormComponent', () => {
  let component: EditResidentialFormComponent;
  let fixture: ComponentFixture<EditResidentialFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditResidentialFormComponent]
    });
    fixture = TestBed.createComponent(EditResidentialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
