import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubClassListingComponent } from './sub-class-listing.component';

describe('SubClassListingComponent', () => {
  let component: SubClassListingComponent;
  let fixture: ComponentFixture<SubClassListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubClassListingComponent]
    });
    fixture = TestBed.createComponent(SubClassListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
