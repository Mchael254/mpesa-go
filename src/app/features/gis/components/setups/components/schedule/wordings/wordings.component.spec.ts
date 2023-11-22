import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordingsComponent } from './wordings.component';

describe('WordingsComponent', () => {
  let component: WordingsComponent;
  let fixture: ComponentFixture<WordingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordingsComponent]
    });
    fixture = TestBed.createComponent(WordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
