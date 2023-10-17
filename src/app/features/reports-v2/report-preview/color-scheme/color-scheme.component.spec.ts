import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSchemeComponent } from './color-scheme.component';

describe('ColorSchemeComponent', () => {
  let component: ColorSchemeComponent;
  let fixture: ComponentFixture<ColorSchemeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColorSchemeComponent]
    });
    fixture = TestBed.createComponent(ColorSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
