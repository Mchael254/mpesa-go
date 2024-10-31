import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeadContactFormComponent } from './edit-lead-contact-form.component';

describe('EditLeadContactFormComponent', () => {
  let component: EditLeadContactFormComponent;
  let fixture: ComponentFixture<EditLeadContactFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLeadContactFormComponent]
    });
    fixture = TestBed.createComponent(EditLeadContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
