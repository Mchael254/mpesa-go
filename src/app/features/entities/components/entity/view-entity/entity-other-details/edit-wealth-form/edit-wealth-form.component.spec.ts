import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWealthFormComponent } from './edit-wealth-form.component';

describe('EditWealthFormComponent', () => {
  let component: EditWealthFormComponent;
  let fixture: ComponentFixture<EditWealthFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditWealthFormComponent]
    });
    fixture = TestBed.createComponent(EditWealthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
