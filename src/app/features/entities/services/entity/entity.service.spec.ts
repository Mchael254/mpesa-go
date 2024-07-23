import { TestBed } from '@angular/core/testing';

import { EntityService } from './entity.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ApiService} from "../../../../shared/services/api/api.service";
import {
  AmlWealthDetailsUpdateDTO,
  BankDetailsUpdateDTO,
  NextKinDetailsUpdateDTO,
  WealthDetailsUpdateDTO
} from "../../data/accountDTO";

const partyAccountId: number = 417;

describe('EntityService', () => {
  let service: EntityService;
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService
      ]
    });
    service = TestBed.inject(EntityService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should update bank details', () => {
    const bankDetails: BankDetailsUpdateDTO = {
      account_number: "",
      bank_branch_id: 0,
      currency_id: 0,
      effective_from_date: "",
      effective_to_date: "",
      iban: "",
      id: 0,
      is_default_channel: "",
      mpayno: "",
      partyAccountId: 0,
      preferedChannel: ""
    };

    service.updateBankDetails(partyAccountId, bankDetails).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(bankDetails);
    });

    const req = httpTestingController.expectOne('/crm/accounts/accounts/417/bank-details');
    expect(req.request.method).toEqual('POST');
    req.flush(bankDetails);
  });

  test('should update wealth details', () => {
    const wealthDetails: WealthDetailsUpdateDTO = {
      citizenship_country_id: 0,
      funds_source: "",
      id: 0,
      is_employed: "",
      is_self_employed: 0,
      marital_status: "",
      nationality_country_id: 0,
      occupation_id: 0,
      partyAccountId: 0,
      sector_id: 0,
      source_of_funds_id: 0
    };

    service.updateWealthDetails(partyAccountId, wealthDetails).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(wealthDetails);
    });

    const req = httpTestingController.expectOne('/crm/accounts/accounts/417/wealth-details');
    expect(req.request.method).toEqual('POST');
    req.flush(wealthDetails);
  });

  test('should update AML details', () => {
    const amlDetails: AmlWealthDetailsUpdateDTO = {
      certificate_registration_number: "",
      certificate_year_of_registration: "",
      cr_form_required: "",
      cr_form_year: 0,
      funds_source: "",
      id: 0,
      operating_country_id: 0,
      parent_country_id: 0,
      partyAccountId: 0,
      registeredName: "",
      source_of_wealth_id: 0,
      tradingName: ""
    };

    service.updateAmlDetails(partyAccountId, amlDetails).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(amlDetails);
    });

    const req = httpTestingController.expectOne('/crm/accounts/accounts/417/aml-details');
    expect(req.request.method).toEqual('POST');
    req.flush(amlDetails);
  });

  test('should update Next-of-Kin details', () => {
    const nokDetails: NextKinDetailsUpdateDTO = {
      accountId: 0,
      emailAddress: "",
      fullName: "",
      id: 0,
      identityNumber: "",
      modeOfIdentityId: 0,
      phoneNumber: "",
      relationship: "",
      smsNumber: ""
    };

    service.updateNokDetails(partyAccountId, nokDetails).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(nokDetails);
    });

    const req = httpTestingController.expectOne('/crm/accounts/accounts/417/next-of-kin-details');
    expect(req.request.method).toEqual('POST');
    req.flush(nokDetails);
  });

});
