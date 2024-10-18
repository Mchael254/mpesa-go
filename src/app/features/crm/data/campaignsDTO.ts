import {StaffDto} from "../../entities/data/StaffDto";
import {SystemsDto} from "../../../shared/data/common/systemsDto";
import {OrganizationDTO} from "./organization-dto";
import {CurrencyDTO} from "../../../shared/data/common/currency-dto";

export interface CampaignsDTO {
  code: number,
  user: number,
  organization: number,
  system: number,
  cmpDate: string,
  sponsor: string,
  product: number,
  campaignName: string,
  campaignType: string,
  status: string,
  expectCloseDate: string,
  targetAudience: string,
  targetSize: number,
  cmpNumSent: string,
  cmpBgtCost: number,
  cmpActlCost: number,
  cmpExptRevenue: number,
  expectedSalesCount: number,
  actualSalesCount: number,
  actualResponseCount: number,
  expectedResponseCount: number,
  expectedRoi: number,
  actualRoi: number,
  description: string,
  objective: string,
  impressionCount: number,
  currencies: number,
  expectedCost: number,
  teamLeader: number,
  events: string,
  venue: string,
  eventTime: string
}

export interface AggregatedCampaignsDTO {
  campaign?: CampaignsDTO;
  staffs?: StaffDto[];
  system?: SystemsDto;
  organization?: OrganizationDTO;
  currency?: CurrencyDTO;
}

export interface CampaignMessagesDTO {
  code: number,
  campaignCode: number,
  messageBody: string,
  date: string,
  imageUrl: string,
  image: string,
  sendAll: string,
  status: string,
  messageSubject: string,
  messageType: string
}

export interface CampaignTargetsDTO {
  code: number,
  accountCode: number,
  accountType: string,
  campaignCode: number,
  targetDate: string
}

export interface CampaignActivitiesDTO {
  code: number,
  campaignCode: number,
  campaignActCode: number
}

export interface ClientAttributesDTO {
  code: number,
  name: string,
  description: string,
  prompt: string,
  range: string,
  inputType: string,
  columnName: string,
  tableName: string
}

export interface ClientSearchAttributesDTO {
  columnName: string,
  shtDesc: string,
  tableName: string
}

export interface ProductAttributesDTO {
  code: number,
  productCode: number,
  description: string,
  shortDescription: string,
  narration: string,
  system: number
}

export interface ProductClientAttributesDTO {
  code: number,
  productAttributeCode: number,
  clientAttributeCode: number,
  min: string,
  max: string,
  fixedValue: string
}

export interface AggregatedProduct {
  code: number,
  description: string,
  shortDescription?: string
}
