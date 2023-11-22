import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordingsComponent } from './wordings.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('WordingsComponent', () => {
  let component: WordingsComponent;
  let fixture: ComponentFixture<WordingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordingsComponent],
      imports: [],
      providers: [],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(WordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
