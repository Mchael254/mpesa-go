import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsIndividualComponent } from './lms-individual.component';

describe('LmsIndividualComponent', () => {
  let component: LmsIndividualComponent;
  let fixture: ComponentFixture<LmsIndividualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LmsIndividualComponent]
    });
    fixture = TestBed.createComponent(LmsIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
