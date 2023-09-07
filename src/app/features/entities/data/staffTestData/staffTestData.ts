import {AddressDto, CreateAccountDTO, NewAccountCreatedResponse} from "../accountDTO";
import {AssignAppsDto, AssignAppsRequest, CreateStaffDto, StaffDto} from "../StaffDto";
import {Pagination} from "../../../../shared/data/common/pagination";

export const newAccountResponse: NewAccountCreatedResponse = {
    accountId: 1,
    status: "success",
    statusCode: 200,
    accountCode: 1
};

export const staffDto: StaffDto = {
    id: 1,
    name: "John Doe",
    username: "jdoe",
    userType: "Staff",
    emailAddress: "jdoe@example.com",
    status: "Active",
    profileImage: "jdoe.jpg",
    department: "Sales",
    manager: "Jane Smith",
    telNo: "1234567890",
    phoneNumber: "0987654321",
    otherPhone: "1112223333",
    countryCode: 254,
    townCode: 20,
    personelRank: "Senior",
    city: 1,
    physicalAddress: "123 Main Street",
    postalCode: "00100",
    departmentCode: 10,
    activatedBy: "jsmith",
    updateBy: "jdoe",
    dateCreated: "2023-01-01T00:00:00Z",
    dateActivated: "2023-01-02T00:00:00Z",
    granter: "jsmith",
    branchId: 1,
    accountId: 1,
    accountManager: 2,

    profilePicture: "jdoe.jpg",
    organizationId: 1,
    organizationGroupId: 1,
    supervisorId: 2,
    supervisorCode: 20,
    organizationCode: 10,
    pinNumber: "1234",
    gender: "Male"
};

export const newStaffDto: CreateStaffDto = {
    activatedBy: "", departmentCode: 0, emailAddress: "jane.doe@test.com", granterUserId: 0, id: 100, organizationGroupId: 1, otherPhone: 0, personelRank: "", profilePicture: "", supervisorId: 0, updateBy: "", userType: "U", username: "jane.doe"
};

export const paginationStaffDto: Pagination<StaffDto> = {
    content: [staffDto],
    totalElements: 1,
    totalPages: 1,
    size: 1,
    number: 1,
    first: true,
    last: true,
    numberOfElements: 1,
};

export const assignAppsRequest: AssignAppsRequest = {
    assignedSystems:[1,2,3]
}

export const assignAppsDto : AssignAppsDto[] = [
    {
        id :1,
        systemName:"Test System",
        shortDesc:"Test System"
    },
    {
        id :2,
        systemName:"Test System2",
        shortDesc:"Test System2"
    },
    {
        id :3,
        systemName:"Test System3",
        shortDesc:"Test System3"
    }
]

export const newStaff: CreateStaffDto = {
    id: 123,
    username: "jane_doe",
    userType: "admin",
    emailAddress: "jane.doe@example.com",
    personelRank: "Manager",
    departmentCode: 456,
    granterUserId: 789,
    otherPhone: 254700000000,
    activatedBy: "john_smith",
    updateBy: "john_smith",
    profilePicture: null,
    organizationGroupId: 1100,
    supervisorId: 1213
};

let address: AddressDto = {
    box_number: "P.O. Box 1234",
    country_id: 254,
    estate: "Kilimani",
    fax: "+254200000000",
    house_number: "12A",
    id: 123,
    is_utility_address: "yes",
    phoneNumber: "+254700000000",
    physical_address: "123 Main Street, Apt. 4",
    postal_code: "00100",
    residential_address: "Kilimani Estate, Nairobi",
    road: "Ngong Road",
    state_id: 47,
    town_id: 1,
    utility_address_proof: "electricity_bill.jpg",
    zip: "00100"
};

export const staffAccount: CreateAccountDTO = {
    address: address,
    contactDetails: {
        id: null,
        phoneNumber: "+254700000000",
        emailAddress: newStaff.emailAddress,
        smsNumber: "+254700000000",
        receivedDocuments: "Y",
        titleShortDescription: "Mr",
    },
    effectiveDateFrom: "2023-09-04",
    effectiveDateTo: "2024-09-04",
    partyId: 123,
    partyTypeShortDesc: "individual",
    modeOfIdentityid: 456,
    organizationId: 789,
    firstName: "John",
    lastName: "Doe",
    category: "regular",
    accountType: 1,
    countryId: 254,
    status: "active",
    modeOfIdentityNumber: 1234567890,
    branchId: 1011,
    gender: "male",
    dateOfBirth: "1990-01-01",
    pinNumber: "1234",
    dateCreated: "2023-09-04"
};

export const staffData : StaffDto[] = [
    {
        name: "John Doe",
        username: "johndoe",
        userType: "U",
        status: "Active",
        department: "Sales",
    },
    {
        name: "Underwriting Group",
        username: "uw.group",
        userType: "G",
        status: "Active",
        department: "Underwriting",
    }
];


export const apps = [
    {
        'card-body-class': 'appStore',
        systemName: 'GIS/Non Life',
        systemCode: 37,
        desc: 'Lorium ipsum is a dummy text',
        imageSrc: 'surface1.png',
        clicked: false,
    },
    {
        'card-body-class': 'appStore',
        systemName: 'Individual Life',
        systemCode: 26,
        desc: 'Lorium ipsum is a dummy text',
        imageSrc: 'Page.png',
        clicked: false,
    },
    {
        'card-body-class': 'appStore',
        systemName: 'Group Life',
        systemCode: 26,
        desc: 'Lorium ipsum is a dummy text',
        imageSrc: 'Frame.png',
        clicked: false,
    },
    {
        'card-body-class': 'appStore',
        systemName: 'PORTAL',
        systemCode: 43,
        desc: 'Lorium ipsum is a dummy text',
        imageSrc: 'portal.png',
        clicked: false,
    },
];

