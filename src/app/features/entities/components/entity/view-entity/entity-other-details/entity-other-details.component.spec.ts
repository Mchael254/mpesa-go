import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityOtherDetailsComponent } from './entity-other-details.component';

describe('EntityOtherDetailsComponent', () => {
  let component: EntityOtherDetailsComponent;
  let fixture: ComponentFixture<EntityOtherDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityOtherDetailsComponent]
    });
    fixture = TestBed.createComponent(EntityOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
