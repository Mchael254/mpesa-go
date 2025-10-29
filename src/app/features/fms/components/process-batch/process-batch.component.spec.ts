import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessBatchComponent } from './process-batch.component';

describe('ProcessBatchComponent', () => {
  let component: ProcessBatchComponent;
  let fixture: ComponentFixture<ProcessBatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessBatchComponent]
    });
    fixture = TestBed.createComponent(ProcessBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
