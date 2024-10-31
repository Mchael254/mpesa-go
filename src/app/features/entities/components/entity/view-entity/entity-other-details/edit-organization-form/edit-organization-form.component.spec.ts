import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizationFormComponent } from './edit-organization-form.component';

describe('EditOrganizationFormComponent', () => {
  let component: EditOrganizationFormComponent;
  let fixture: ComponentFixture<EditOrganizationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOrganizationFormComponent]
    });
    fixture = TestBed.createComponent(EditOrganizationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
