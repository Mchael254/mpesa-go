import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassDocumentDispatchComponent } from './mass-document-dispatch.component';

describe('MassDocumentDispatchComponent', () => {
  let component: MassDocumentDispatchComponent;
  let fixture: ComponentFixture<MassDocumentDispatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MassDocumentDispatchComponent]
    });
    fixture = TestBed.createComponent(MassDocumentDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
