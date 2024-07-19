import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAmlFormComponent } from './edit-aml-form.component';

describe('EditAmlFormComponent', () => {
  let component: EditAmlFormComponent;
  let fixture: ComponentFixture<EditAmlFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAmlFormComponent]
    });
    fixture = TestBed.createComponent(EditAmlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
