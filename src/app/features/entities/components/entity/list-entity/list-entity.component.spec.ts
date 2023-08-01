import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntityComponent } from './list-entity.component';

describe('ListEntityComponent', () => {
  let component: ListEntityComponent;
  let fixture: ComponentFixture<ListEntityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListEntityComponent]
    });
    fixture = TestBed.createComponent(ListEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
