import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRequirementsComponent } from './medical-requirements.component';

describe('MedicalRequirementsComponent', () => {
  let component: MedicalRequirementsComponent;
  let fixture: ComponentFixture<MedicalRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalRequirementsComponent]
    });
    fixture = TestBed.createComponent(MedicalRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
