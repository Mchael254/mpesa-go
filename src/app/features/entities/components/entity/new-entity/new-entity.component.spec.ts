import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntityComponent } from './new-entity.component';

describe('NewEntityComponent', () => {
  let component: NewEntityComponent;
  let fixture: ComponentFixture<NewEntityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewEntityComponent]
    });
    fixture = TestBed.createComponent(NewEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
