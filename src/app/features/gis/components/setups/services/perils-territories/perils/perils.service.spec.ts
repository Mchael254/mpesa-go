import { TestBed } from '@angular/core/testing';
import { PerilsService } from './perils.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Peril } from '../../../data/gisDTO';
describe('PerilsService', () => {
  let service: PerilsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
   
        {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis' } }}}
      ]

    });
    service = TestBed.inject(PerilsService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return an Observable of perils array', () => {
    const mockResponse:Peril[] = [
      {
      code:"Test001",
      shortDescription:"Test Short Desc",
      description: "Test description",
      fullDescription: "testing the full description",
      paymentType: "P",
      dateWithEffectFrom: "1/20/23",
      dateWithEffectTo:"2/3/23",
      perilType: "P",
      organizationCode: "2"
      },
    ];
  
    service.getAllPerils().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne(`/${service.baseurl}/setups/api/v1/perils?pageNo=0&pageSize=100`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  }); 
  it('should return an Observable<Peril>', () => {
    const code = 123;
    const mockResponse: Peril = 
      {
        code:"Test001",
        shortDescription:"Test Short Desc",
        description: "Test description",
        fullDescription: "testing the full description",
        paymentType: "P",
        dateWithEffectFrom: "1/20/23",
        dateWithEffectTo:"2/3/23",
        perilType: "P",
        organizationCode: "2"
      }
    
  
    service.getPeril(code).subscribe(vessel => {
      expect(vessel).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne(`/${service.baseurl}/setups/api/v1/perils/${code}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  it('should post peril data to the server', () => {
    const res: Peril[] = [
      {
        code:"Test001",
        shortDescription:"Test Short Desc",
        description: "Test description",
        fullDescription: "testing the full description",
        paymentType: "P",
        dateWithEffectFrom: "1/20/23",
        dateWithEffectTo:"2/3/23",
        perilType: "P",
        organizationCode: "2"
      },
    ];
    service.createPeril(res).subscribe((response) => {
      expect(response).toEqual(res);
    });
  
    const req = httpMock.expectOne(`/${service.baseurl}/setups/api/v1/perils`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(JSON.stringify(res));
  
    req.flush(res);
  });
  it('should update a Peril', () => {
    const id = 1;
    const data: Peril = {
        code:"Test001",
        shortDescription:"Test Short Desc",
        description: "Test description",
        fullDescription: "testing the full description",
        paymentType: "P",
        dateWithEffectFrom: "1/20/23",
        dateWithEffectTo:"2/3/23",
        perilType: "P",
        organizationCode: "2"
       };
    service.updatePeril(data, id).subscribe(result => {
      expect(result).toEqual(data);
    });
  
    const req = httpMock.expectOne(`/${service.baseurl}/setups/api/v1/perils/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(JSON.stringify(data));
    req.flush(data);
  });
  it('should delete peril with given id', () => {
    const mockCover: Peril = { 
        code:"Test001",
        shortDescription:"Test Short Desc",
        description: "Test description",
        fullDescription: "testing the full description",
        paymentType: "P",
        dateWithEffectFrom: "1/20/23",
        dateWithEffectTo:"2/3/23",
        perilType: "P",
        organizationCode: "2"
     };
    const id = 123;
  
    service.deletePeril(id).subscribe(
      (data) => {
        expect(data).toEqual(mockCover);
      },
      (error) => {
        fail('Should not have errored');
      }
    );
  
    const req = httpMock.expectOne(`/${service.baseurl}/setups/api/v1/perils/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockCover);
  });
});
