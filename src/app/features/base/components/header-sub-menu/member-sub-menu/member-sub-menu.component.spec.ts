import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSubMenuComponent } from './member-sub-menu.component';
import { TranslateModule } from '@ngx-translate/core';

describe('MemberSubMenuComponent', () => {
  let component: MemberSubMenuComponent;
  let fixture: ComponentFixture<MemberSubMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberSubMenuComponent],
      imports: [TranslateModule.forRoot()],
    });
    fixture = TestBed.createComponent(MemberSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
