// import { TestBed } from '@angular/core/testing';

// import { MandatoryFieldsService } from './mandatory-fields.service';
// import {Observable} from "rxjs/internal/Observable";
// import {HttpClientTestingModule} from "@angular/common/http/testing";
// import {AppConfigService} from "../../config/app-config-service";

// export class MockAppConfigService {
//   get config() {
//     return {
//       contextPath: {
//         "accounts_services": "crm",
//       },
//     };
//   }
// }
// describe('MandatoryFieldsService', () => {
//   let service: MandatoryFieldsService;
//   let appConfigService: AppConfigService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//       ],
//       providers: [
//         { provide: AppConfigService, useClass: MockAppConfigService }
//       ]
//     });
//     service = TestBed.inject(MandatoryFieldsService);
//   });

//   test('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   test('should return an Observable of type MandatoryFieldsDTO[]', () => {
//     const service = TestBed.get(MandatoryFieldsService);
//     const groupId = 'exampleGroupId';
//     const result = service.getMandatoryFieldsByGroupId(groupId);
//     expect(result).toBeInstanceOf(Observable);
//   });
// });
