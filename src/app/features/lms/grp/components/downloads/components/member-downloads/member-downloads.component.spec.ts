import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDownloadsComponent } from './member-downloads.component';

describe('MemberDownloadsComponent', () => {
  let component: MemberDownloadsComponent;
  let fixture: ComponentFixture<MemberDownloadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberDownloadsComponent]
    });
    fixture = TestBed.createComponent(MemberDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
