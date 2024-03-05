import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportRisksComponent } from './import-risks.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; 

class MockAppConfig {
  config = {
    contextPath: {
      gis_services: 'String' // Provide the expected value for gis_services
    }
  };
}
describe('ImportRisksComponent', () => {
  let component: ImportRisksComponent;
  let fixture: ComponentFixture<ImportRisksComponent>;
  let subclassService: SubclassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportRisksComponent],
      imports: [RouterTestingModule,HttpClientModule],
      providers: [SubclassesService] 
    });
    fixture = TestBed.createComponent(ImportRisksComponent);
    component = fixture.componentInstance;
    subclassService = TestBed.inject(SubclassesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
