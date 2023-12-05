import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementComponent } from './endorsement.component';

describe('EndorsementComponent', () => {
  let component: EndorsementComponent;
  let fixture: ComponentFixture<EndorsementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EndorsementComponent]
    });
    fixture = TestBed.createComponent(EndorsementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
