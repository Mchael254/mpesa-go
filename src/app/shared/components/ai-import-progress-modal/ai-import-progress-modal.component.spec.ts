import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiImportProgressModalComponent } from './ai-import-progress-modal.component';

describe('AiImportProgressModalComponent', () => {
  let component: AiImportProgressModalComponent;
  let fixture: ComponentFixture<AiImportProgressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiImportProgressModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiImportProgressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
