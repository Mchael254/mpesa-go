// /****************************************************************************
//  **
//  ** Author: Justus Muoka
//  **
//  ****************************************************************************/

// import { UtilService } from './util.service';
// import { TestBed } from '@angular/core/testing';
// import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
// import { AccountContact } from '../data/account-contact';
// import { ClientAccountContact } from '../data/client-account-contact';
// import { WebAdmin } from '../data/web-admin';
// import { TqClient } from '../data/tq-client';

describe('UtilService', () => {
//   let username = new FormControl('');
//   let form = new FormArray([
//     username
//   ]);
//   let utilService: UtilService;

//   let agent: AccountContact = {
//     acccCode: 0,
//     acccName: '',
//     acccOtherNames: '',
//     acccEmailAddr: '',
//     acccUsername: 'agent',
//     acccLoginAllowed: '',
//     acccPwdChanged: '',
//     acccPwdReset: '',
//     acccDtCreated: '',
//     acccStatus: '',
//     acccLoginAttempts: 0,
//     acccPersonelRank: '',
//     acccLastLoginDate: '',
//     acccCreatedBy: '',
//     acccAccType: '',
//     acccAccCode: 0,
//     acccAgnCode: 0,
//     authorities: []
//   };

//   let admin: WebAdmin = {
//     id: 0,
//     name: 'admin',
//     username: '',
//     email: 'admin',
//     status: '',
//     userType: '',
//     telNo: '',
//     phoneNumber: '',
//     otherPhone: '',
//     personelRank: '',
//     countryCode: 0,
//     townCode: 0,
//     physicalAddress: '',
//     postalCode: '',
//     departmentCode: 0,
//     activatedBy: '',
//     updateBy: '',
//     dateCreated: new Date(),
//     granter: 0,
//     authorities: [],
//     pinNumber: ''
//   }

//   let client: ClientAccountContact = {
//     acwaCode: 123,
//     acwaUsername: 'client',
//     acwaLoginAllowed: '',
//     acwaPwdChanged: '',
//     acwaPwdReset: '',
//     acwaLoginAttempts: 123,
//     acwaPersonelRank: '',
//     acwaDtCreated: '',
//     acwaStatus: '',
//     acwaLastLoginDate: '',
//     acwaClntCode: 123,
//     acwaCreatedBy: '',
//     acwaName: '',
//     acwaEmailAddrs: '',
//     acwaType: '',
//     acwaCountry: '',
//     acwaIdRegNo: '',
//     acwaSmsCode: '',
//     acwaMobileNumber: '123',
//     acwaPassportNo: '',
//     acwaEmailVerified: '',
//     acwaSpecialClient: '',
//     portalClient: undefined,

//     // authorities
//     authorities: [],
//   };


//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         UtilService,
//       ],
//     });

//     utilService = TestBed.get(UtilService);
//   });

//   test('should be created', () => {
//     expect(utilService).toBeTruthy();
//   });

//   test('should purgeFormArray', () => {
//     utilService.purgeFormArray(form);
//     expect(utilService.purgeFormArray.call).toBeTruthy();
//   });

//   test('should check isUserClient', () => {
//     const checkuser = utilService.isUserClient(client);
//     expect(utilService.isUserClient.call).toBeTruthy();
//     expect(checkuser).toBe(true);
//   })

//   test('should check isUserAgent', () => {
//     const checkuser = utilService.isUserAgent(agent);
//     expect(utilService.isUserAgent.call).toBeTruthy();
//     expect(checkuser).toBe(true);
//   })

//   test('should check isUserAdmin', () => {
//     const checkuser = utilService.isUserAdmin(admin);
//     expect(utilService.isUserAdmin.call).toBeTruthy();
//     expect(checkuser).toBe(true);
//   })

//   test('should resolveUserCode', () => {
//     // resolve admin code
//     let userCode = utilService.resolveUserCode(admin);
//     expect(utilService.resolveUserCode.call).toBeTruthy();
//     expect(userCode).toBe(0);

//     // resolve agent code
//     userCode = utilService.resolveUserCode(agent);
//     expect(utilService.resolveUserCode.call).toBeTruthy();
//     expect(userCode).toBe(0);

//     // resolve client code
//     userCode = utilService.resolveUserCode(client);
//     expect(utilService.resolveUserCode.call).toBeTruthy();
//     expect(userCode).toBe(123);

//     // return null for invalid user
//     userCode = utilService.resolveUserCode({});
//     expect(utilService.resolveUserCode.call).toBeTruthy();
//     expect(userCode).toBe(null);
//   })

//   test('should resolveAgentCodeByAcccCode', () => {
//     // resolve admin code
//     let userCode = utilService.resolveAgentCodeByAcccCode(admin);
//     expect(utilService.resolveAgentCodeByAcccCode.call).toBeTruthy();
//     expect(userCode).toBe(0);

//     // resolve agent code
//     userCode = utilService.resolveAgentCodeByAcccCode(agent);
//     expect(utilService.resolveAgentCodeByAcccCode.call).toBeTruthy();
//     expect(userCode).toBe(0);

//     // resolve client code
//     userCode = utilService.resolveAgentCodeByAcccCode(client);
//     expect(utilService.resolveAgentCodeByAcccCode.call).toBeTruthy();
//     expect(userCode).toBe(123);

//     // return null for invalid user
//     userCode = utilService.resolveAgentCodeByAcccCode({});
//     expect(utilService.resolveAgentCodeByAcccCode.call).toBeTruthy();
//     expect(userCode).toBe(null);
//   })

//   test('should resolveUserName', () => {
//     // resolve admin name
//     let userName = utilService.resolveUserName(admin);
//     expect(utilService.resolveUserName.call).toBeTruthy();
//     expect(userName).toBe('admin');

//     // resolve agent name
//     userName = utilService.resolveUserName(agent);
//     expect(utilService.resolveUserName.call).toBeTruthy();
//     expect(userName).toBe('agent');

//     // resolve client name
//     userName = utilService.resolveUserName(client);
//     expect(utilService.resolveUserName.call).toBeTruthy();
//     expect(userName).toBe('client');

//     // return null for invalid user
//     userName = utilService.resolveUserName({});
//     expect(utilService.resolveUserName.call).toBeTruthy();
//     expect(userName).toBe(null);
//   })

//   test('should check if an object is empty', () => {
//     let isEmpty = utilService.isEmpty({});
//     expect(utilService.isEmpty.call).toBeTruthy();
//     expect(isEmpty).toBe(true);

//     isEmpty = utilService.isEmpty(client);
//     expect(utilService.isEmpty.call).toBeTruthy();
//     expect(isEmpty).toBe(false);

//     isEmpty = utilService.isEmpty('');
//     expect(utilService.isEmpty.call).toBeTruthy();
//     expect(isEmpty).toBe(true);
//   })

//   test('should check if an object isNotEmpty', () => {
//     let isNotEmpty = utilService.isNotEmpty({});
//     expect(utilService.isNotEmpty.call).toBeTruthy();
//     expect(isNotEmpty).toBe(false);
//   })

//   test('should getObject', () => {
//     let objResult = utilService.getObject([client, agent, admin], 'acwaUsername', 'client');
//     expect(utilService.getObject.call).toBeTruthy();
//     expect(objResult).toBe(client);
//   })

//   test('should getFullName', () => {
//     let client: TqClient = {
//       clntId: '',
//       clntCode: 0,
//       clntShtDesc: '',
//       clntName: 'Turnkey',
//       clntSurname: 'Africa',
//       clntOtherNames: 'Nairobi',
//       clntIdRegDoc: '',
//       clntIdRegNo: '',
//       clntDob: undefined,
//       clntCountry: '',
//       clntTelNo: '',
//       clntMoblNo: '',
//       clntPin: '',
//       clntEmailAddrs: '',
//       clntSmsTel: '',
//       clntStatus: '',
//       clntType: '',
//       clntGender: '',
//       clntPassportNo: '',
//       clntMaritalStatus: '',
//       clntPostalAddrs: ''
//     };
//     let fullName = utilService.getFullName(client);
//     expect(utilService.getFullName.call).toBeTruthy();
//     expect(fullName).toEqual('Turnkey');

//     fullName = utilService.getFullName();
//     expect(utilService.getFullName.call).toBeTruthy();
//     expect(fullName).toEqual('');
//   })

//   test('should getClientFullName', () => {
//     const testClient = {
//       surname: 'Africa',
//       type: 'A',
//       name: 'Turnkey',
//       otherNames: 'Nairobi'
//     }
//     let clientFullName = utilService.getClientFullName({});
//     expect(utilService.getClientFullName.call).toBeTruthy();
//     expect(clientFullName).toEqual('');

//     clientFullName = utilService.getClientFullName(testClient);
//     expect(utilService.getClientFullName.call).toBeTruthy();
//     expect(clientFullName).toEqual('Turnkey');

//     testClient.type = 'I';
//     clientFullName = utilService.getClientFullName(testClient);
//     expect(utilService.getClientFullName.call).toBeTruthy();
//     expect(clientFullName).toEqual('Turnkey Africa Nairobi ');
//   })

//   test('should concatNames', () => {
//     const names = ['Turnkey', 'Africa'];
//     let concatName = utilService.concatNames(...names);
//     expect(utilService.concatNames.call).toBeTruthy();
//     expect(concatName).toBe('Turnkey Africa');

//     concatName = utilService.concatNames('');
//     expect(utilService.concatNames.call).toBeTruthy();
//     expect(concatName).toBe('');
//   })

//   test('should extractNames', () => {
//     let extractNames = utilService.extractNames('Turnkey Africa', 'C');
//     expect(utilService.extractNames.call).toBeTruthy();
//     expect(extractNames).toEqual({"clntName": "Turnkey Africa", "clntOtherNames": "", "clntSurname": ""});

//     extractNames = utilService.extractNames('Turnkey Africa', 'I');
//     expect(utilService.extractNames.call).toBeTruthy();
//     expect(extractNames.clntName).toEqual('Turnkey');
//   })

//   test('should generateFullUri', () => {
//     let fullUri = utilService.generateFullUri('TURNKEY', '/');
//     expect(utilService.generateFullUri.call).toBeTruthy();
//     expect(fullUri).toBe('http://localhostTURNKEY');

//     fullUri = utilService.generateFullUri('TURNKEY', '');
//     expect(utilService.generateFullUri.call).toBeTruthy();
//     expect(fullUri).toBe('http://localhostTURNKEY');
//   })

//   test('should check if isIE', () => {
//     let isIE = utilService.isIE();
//     expect(utilService.isIE.call).toBeTruthy();
//     expect(isIE).toBe(false);
//   })

//   test('should check if chunkArray', () => {
//     let chunkedArray = utilService.chunkArray(['a', 'b', 'c', 'd'], 2);
//     expect(utilService.chunkArray.call).toBeTruthy();
//     expect(chunkedArray).toEqual( [["a", "b"], ["c", "d"]]);
//   })

//   test('should convert blobPdfFromBase64String', () => {
//     let converted = utilService.blobPdfFromBase64String('');
//     expect(utilService.blobPdfFromBase64String.call).toBeTruthy();
//     // expect(converted).toEqual(new Blob({})); // todo: fix assertion
//   })

//   // test('should convert blobToString', () => {
//   //   let converted = utilService.blobToString(new Blob(['test string']));
//   //   expect(utilService.blobToString.call).toBeTruthy();
//   //   expect(converted).toEqual(new Blob({}));
//   // })

//   test('should getControlName', () => {
//     let controlName = utilService.getControlName(null);
//     expect(utilService.getControlName.call).toBeTruthy();
//     expect(controlName).toEqual(null);
//   })

//   test('should checkAnyHasValue', () => {
//     let checkStatus = utilService.checkAnyHasValue(['some']);
//     expect(utilService.checkAnyHasValue.call).toBeTruthy();
//     expect(checkStatus).toEqual(true);

//     checkStatus = utilService.checkAnyHasValue();
//     expect(utilService.checkAnyHasValue.call).toBeTruthy();
//     expect(checkStatus).toEqual(false);
//   })

//   test('should resolveStringUserType', () => {
//     let resolvedString = utilService.resolveStringUserType(admin);
//     expect(utilService.resolveStringUserType.call).toBeTruthy();
//     expect(resolvedString).toEqual('ADMIN');

//     resolvedString = utilService.resolveStringUserType(agent);
//     expect(utilService.resolveStringUserType.call).toBeTruthy();
//     expect(resolvedString).toEqual('A');

//     resolvedString = utilService.resolveStringUserType(client);
//     expect(utilService.resolveStringUserType.call).toBeTruthy();
//     expect(resolvedString).toEqual('C');

//     resolvedString = utilService.resolveStringUserType(null);
//     expect(utilService.resolveStringUserType.call).toBeTruthy();
//     expect(resolvedString).toEqual(null);
//   })

//   test('should convert objToUpperCase', () => {
//     let upperCaseObject = utilService.objToUpperCase({username: 'admin'});
//     expect(utilService.objToUpperCase.call).toBeTruthy();
//     expect(upperCaseObject).toEqual({username: 'ADMIN'});
//   })

//   test('should convert objToTitleCase', () => {
//     let titleCaseObject = utilService.objToTitleCase({username: 'admin'});
//     expect(utilService.objToTitleCase.call).toBeTruthy();
//     expect(titleCaseObject).toEqual({username: 'Admin'});
//   })

//   test('should convert strToTitleCase', () => {
//     let titleCaseString = utilService.strToTitleCase('turnquest business solutions');
//     expect(utilService.strToTitleCase.call).toBeTruthy();
//     expect(titleCaseString).toEqual('Turnquest Business Solutions');
//   })

//   test('should convert getRandomString', () => {
//     let randomString = utilService.getRandomString(16);
//     expect(utilService.getRandomString.call).toBeTruthy();
//     expect(randomString.length).toEqual(16);
//   })

});
