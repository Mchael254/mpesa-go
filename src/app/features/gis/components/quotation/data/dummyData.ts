import {ClientDTO, ClientTypeDTO} from "src/app/features/entities/data/ClientDTO";
import {Premiums} from "../../setups/data/gisDTO";
import {QuickQuoteData} from "./quotationsDTO";


//dummy premiums
export function generateDummyPremiums(count: number): Premiums[] {
    const basePremium: Premiums = {
        code: 0,
        sectionCode: 200,
        sectionShortDescription: 'Base Cover',
        sectionDescription: 'Covers specific incidents',
        sectionType: 'Optional',
        rate: 2.5,
        dateWithEffectFrom: '2025-01-01',
        dateWithEffectTo: '2025-12-31',
        subClassCode: 1001,
        binderCode: 3001,
        rangeFrom: 0,
        rangeTo: 100000,
        rateDescription: 'Percentage of sum insured',
        divisionFactor: 1,
        rateType: 'Percentage',
        premiumMinimumAmount: 50,
        territoryCode: 110,
        proratedOrFull: 'Full',
        premiumEndorsementMinimumAmount: 25,
        multiplierRate: 1,
        multiplierDivisionFactor: 1,
        maximumRate: 3.5,
        minimumRate: 1.0,
        freeLimit: 0,
        isExProtectorApplication: 'N',
        isSumInsuredLimitApplicable: 'Y',
        sumInsuredLimitType: 'Flat',
        sumInsuredRate: '2.5%',
        grpCode: 'GRP001',
        isNoClaimDiscountApplicable: 'N',
        currencyCode: 840,
        agentName: 'Agent007',
        rangeType: 'Standard',
        limitAmount: 20000,
        limitPeriod: 12,
        noClaimDiscountLevel: '0',
        doesCashBackApply: 'N',
        cashBackLevel: 0,
        rateFrequencyType: 'Annual',
        isChecked: true,
        isMandatory: 'N',
    };

    return Array.from({length: count}, (_, index): Premiums => ({
        ...basePremium,
        code: index + 1,
        sectionCode: 201 + index,
        sectionShortDescription: `Cover ${index + 1} (e.g., Theft, Fire)`,
        sectionDescription: `Covers ${index + 1}-related incidents`,
        rate: 2.5 + index * 0.5,
        agentName: `Agent${String(index + 1).padStart(3, '0')}`,
    }));
}

// Export the dummyPremiums
export const dummyPremiums: Premiums[] = generateDummyPremiums(3);


const dummyClientType: ClientTypeDTO = {
    category: "Individual",
    clientTypeName: "Personal Policyholder",
    code: 1,
    description: "Individual client with personal insurance",
    organizationId: 1001,
    person: "Natural",
    type: "Private"
};

const dummyOccupation = {
    id: 5,
    name: "Software Engineer",
    sector_id: 3,
    short_description: "Tech industry professional"
};

const dummyClient: ClientDTO = {
    branchCode: 10,
    category: "Individual",
    clientTitle: "Mr.",
    clientType: dummyClientType,
    country: 254,
    mobileNumber: "+254712345678",
    state: "Nairobi",
    town: "Westlands",
    createdBy: "system",
    dateOfBirth: "1985-05-15",
    emailAddress: "john.doe@example.com",
    firstName: "John",
    gender: "Male",
    id: 101,
    idNumber: "12345678",
    lastName: "Doe",
    modeOfIdentity: "National ID",
    occupation: dummyOccupation,
    passportNumber: "A12345678",
    phoneNumber: "+254712345678",
    physicalAddress: "123 Main St, Nairobi",
    pinNumber: "P123456789X",
    shortDescription: "Long-term client",
    status: "Active",
    withEffectFromDate: "2020-01-01",
    clientTypeName: "Personal Policyholder",
    clientFullName: "John Doe"
};

export const dummyQuickQuoteData: QuickQuoteData = {
    yearOfManufacture: 2020,
    clientName: "John Doe",
    clientEmail: "john.doe@example.com",
    clientPhoneNumber: "+254712345678",
    carRegNo: "KAA 123A",
    product: {code: 1, name: "Comprehensive Motor Insurance"},
    subClass: {code: 460, name: "Private Vehicle"},
    currency: {code: "KES", name: "Kenyan Shilling"},
    effectiveDateFrom: new Date("2025-01-01"),
    selfDeclaredValue: 1500000,
    modeOfTransport: 1,
    value: 2000000,
    riskId: "RISK-2025-001",
    coverTo: new Date("2026-01-01"),
    existingClientSelected: true,
    selectedClient: dummyClient,
    selectedBinderCode: 12345,
    computationPayloadCode: 5001
};

export const dummyUsers = [
    {userId: 'U001', fullName: 'Alice Johnson'},
    {userId: 'U002', fullName: 'Bob Smith'},
    {userId: 'U003', fullName: 'Carol White'},
    {userId: 'U004', fullName: 'David Brown'},
    {userId: 'U005', fullName: 'Eva Green'},
    {userId: 'U006', fullName: 'Frank Black'},
    {userId: 'U007', fullName: 'Grace Lee'},
    {userId: 'U008', fullName: 'Henry Wilson'},
    {userId: 'U009', fullName: 'Ivy Clark'},
    {userId: 'U010', fullName: 'Jack Turner'}
];

export interface PaymentOption {
    method: string;
    paybill: string;
    account: string;
}

export const dummyPaymentOptions: PaymentOption[] = [
    {
        method: 'mpesa',
        paybill: '123456',
        account: 'MP12345'
    },
    {
        method: 'airtelMoney',
        paybill: '654321',
        account: 'AM54321'
    },
    {
        method: 'Tkash',
        paybill: '777888',
        account: 'TK98765'
    }
];

