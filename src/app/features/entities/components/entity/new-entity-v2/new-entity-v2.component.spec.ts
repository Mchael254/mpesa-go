import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntityV2Component } from './new-entity-v2.component';

describe('NewEntityV2Component', () => {
  let component: NewEntityV2Component;
  let fixture: ComponentFixture<NewEntityV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewEntityV2Component]
    });
    fixture = TestBed.createComponent(NewEntityV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
