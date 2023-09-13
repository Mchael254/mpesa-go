import { TestBed } from '@angular/core/testing';
import { TerritoriesService } from './territories.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { territories } from '../../../data/gisDTO';
describe('TerritoriesService', () => {
  let service: TerritoriesService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
   
        {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis' } }}}
      ]
    });
    service = TestBed.inject(TerritoriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return an Observable of territory array', () => {
    const mockResponse:territories[] = [
      {
        code:123,
        description: 'Description',
        details: 'Details',
        organizationCode: 456,
      },
    ];
  
    service.getAllTerritories().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne(`/${service.baseurl}/setups/api/v1/territories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  }); 
  it('should return an Observable<Territory>', () => {
    const code = 123;
    const mockResponse: territories = 
      {
        code:123,
        description: 'Description',
        details: 'Details',
        organizationCode: 456,
      }
    
  
    service.getTerritory(code).subscribe(vessel => {
      expect(vessel).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne(`/${service.baseurl}/setups/api/v1/territories/${code}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  it('should post territories data to the server', () => {
    const res: territories[] = [
      {
        code:123,
        description: 'Description',
        details: 'Details',
        organizationCode: 456,
      },
    ];
    service.createTerritory(res).subscribe((response) => {
      expect(response).toEqual(res);
    });
  
    const req = httpMock.expectOne(`/${service.baseurl}/setups/api/v1/territories`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(JSON.stringify(res));
  
    req.flush(res);
  });
  it('should update a Territory', () => {
    const id = 1;
    const data: territories = {
      code:123,
      description: 'Description',
      details: 'Details',
      organizationCode: 456,
       };
    service.updateTerritory(data, id).subscribe(result => {
      expect(result).toEqual(data);
    });
  
    const req = httpMock.expectOne(`/${service.baseurl}/setups/api/v1/territories/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(JSON.stringify(data));
    req.flush(data);
  });

});
