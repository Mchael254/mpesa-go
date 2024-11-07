import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDocsComponent } from './entity-docs.component';

describe('EntityDocsComponent', () => {
  let component: EntityDocsComponent;
  let fixture: ComponentFixture<EntityDocsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityDocsComponent]
    });
    fixture = TestBed.createComponent(EntityDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
