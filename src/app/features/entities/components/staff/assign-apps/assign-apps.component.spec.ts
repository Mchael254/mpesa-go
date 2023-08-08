import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAppsComponent } from './assign-apps.component';

describe('AssignAppsComponent', () => {
  let component: AssignAppsComponent;
  let fixture: ComponentFixture<AssignAppsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignAppsComponent]
    });
    fixture = TestBed.createComponent(AssignAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
