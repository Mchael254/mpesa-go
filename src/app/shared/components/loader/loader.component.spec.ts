import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';
import { ProgressBarModule } from 'primeng';
import { NgxLoadingModule } from 'ngx-loading';
import { LoaderService } from '../../services/loader.service';
import { of } from 'rxjs';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  const mockLoaderService = <LoaderService>{
    isBlocking: of(false),
    isShowing: of(false),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ProgressBarModule, NgxLoadingModule],
      declarations: [LoaderComponent],
      providers: [{ provide: LoaderService, useValue: mockLoaderService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
