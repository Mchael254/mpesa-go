import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactFormComponent } from './edit-contact-form.component';

describe('EditContactFormComponent', () => {
  let component: EditContactFormComponent;
  let fixture: ComponentFixture<EditContactFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditContactFormComponent]
    });
    fixture = TestBed.createComponent(EditContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
