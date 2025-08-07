export interface Introducer {
    code: number;
    surName: string;
    otherNames: string;
    staffNo: number;
    groupCompany: string | null;
    postalAddress: string | null;
    introducerTown: string | null;
    pin: string | null;
    idRegistration: string | null;
    dateOfBirth: string | null;
    remarks: string | null;
    introducerZip: string | null;
    introducerZipName: string | null;
    userID: string | null;
    bruCode: string | null;
    email: string | null;
    WEF: string | null;
    WET: string | null;
    agentCode: string | null;
    type: string; // 'S', or other types if applicable
    feeAllowed: 'Y' | 'N';
    mobileNumber: string | null;
    telephoneNumber: string | null;
    wef: string | null;
    wet: string | null;
}
