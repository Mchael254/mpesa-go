import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedPartiesComponent } from './interested-parties.component';

describe('InterestedPartiesComponent', () => {
  let component: InterestedPartiesComponent;
  let fixture: ComponentFixture<InterestedPartiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterestedPartiesComponent]
    });
    fixture = TestBed.createComponent(InterestedPartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
