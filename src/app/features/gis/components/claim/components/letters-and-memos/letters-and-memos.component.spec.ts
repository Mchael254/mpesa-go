import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersAndMemosComponent } from './letters-and-memos.component';

describe('LettersAndMemosComponent', () => {
  let component: LettersAndMemosComponent;
  let fixture: ComponentFixture<LettersAndMemosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LettersAndMemosComponent]
    });
    fixture = TestBed.createComponent(LettersAndMemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
