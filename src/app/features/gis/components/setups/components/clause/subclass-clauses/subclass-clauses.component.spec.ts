import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubclassClausesComponent } from './subclass-clauses.component';

describe('SubclassClausesComponent', () => {
  let component: SubclassClausesComponent;
  let fixture: ComponentFixture<SubclassClausesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubclassClausesComponent]
    });
    fixture = TestBed.createComponent(SubclassClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
