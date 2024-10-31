import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommentFormComponent } from './edit-comment-form.component';

describe('EditCommentFormComponent', () => {
  let component: EditCommentFormComponent;
  let fixture: ComponentFixture<EditCommentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCommentFormComponent]
    });
    fixture = TestBed.createComponent(EditCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
