import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactAddressFormComponent } from './edit-contact-address-form.component';

describe('EditContactAddressFormComponent', () => {
  let component: EditContactAddressFormComponent;
  let fixture: ComponentFixture<EditContactAddressFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditContactAddressFormComponent]
    });
    fixture = TestBed.createComponent(EditContactAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
