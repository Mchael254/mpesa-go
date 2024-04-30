import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalUploadsDecisionsComponent } from './medical-uploads-decisions.component';

describe('MedicalUploadsDecisionsComponent', () => {
  let component: MedicalUploadsDecisionsComponent;
  let fixture: ComponentFixture<MedicalUploadsDecisionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalUploadsDecisionsComponent]
    });
    fixture = TestBed.createComponent(MedicalUploadsDecisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
