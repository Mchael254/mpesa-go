import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationTabComponent } from './authorization-tab.component';

describe('AuthorizationTabComponent', () => {
  let component: AuthorizationTabComponent;
  let fixture: ComponentFixture<AuthorizationTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizationTabComponent]
    });
    fixture = TestBed.createComponent(AuthorizationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
