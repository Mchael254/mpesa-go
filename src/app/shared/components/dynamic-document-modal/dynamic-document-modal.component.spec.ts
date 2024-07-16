import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDocumentModalComponent } from './dynamic-document-modal.component';

describe('DynamicDocumentModalComponent', () => {
  let component: DynamicDocumentModalComponent;
  let fixture: ComponentFixture<DynamicDocumentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicDocumentModalComponent]
    });
    fixture = TestBed.createComponent(DynamicDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
