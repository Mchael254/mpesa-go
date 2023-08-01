import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEntityComponent } from './view-entity.component';

describe('ViewEntityComponent', () => {
  let component: ViewEntityComponent;
  let fixture: ComponentFixture<ViewEntityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEntityComponent]
    });
    fixture = TestBed.createComponent(ViewEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
