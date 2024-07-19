import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNokFormComponent } from './edit-nok-form.component';

describe('EditNokFormComponent', () => {
  let component: EditNokFormComponent;
  let fixture: ComponentFixture<EditNokFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditNokFormComponent]
    });
    fixture = TestBed.createComponent(EditNokFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
