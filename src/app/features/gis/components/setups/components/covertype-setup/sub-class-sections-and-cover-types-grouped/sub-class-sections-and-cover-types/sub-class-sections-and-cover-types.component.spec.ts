import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubClassSectionsAndCoverTypesComponent } from './sub-class-sections-and-cover-types.component';

describe('SubClassSectionsAndCoverTypesComponent', () => {
  let component: SubClassSectionsAndCoverTypesComponent;
  let fixture: ComponentFixture<SubClassSectionsAndCoverTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubClassSectionsAndCoverTypesComponent]
    });
    fixture = TestBed.createComponent(SubClassSectionsAndCoverTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
