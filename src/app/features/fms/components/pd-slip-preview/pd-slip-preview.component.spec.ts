import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdSlipPreviewComponent } from './pd-slip-preview.component';

describe('PdSlipPreviewComponent', () => {
  let component: PdSlipPreviewComponent;
  let fixture: ComponentFixture<PdSlipPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdSlipPreviewComponent]
    });
    fixture = TestBed.createComponent(PdSlipPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
