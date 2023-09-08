import {AccountVerifiedResponse} from "../../../core/auth/auth-verification";
import {of} from "rxjs";
import {ActivatedRouteSnapshot} from "@angular/router";

const mockUser = {
    // Provide a valid user object with the necessary properties
    acccUsername: 'acccUser',
    acwaUsername: 'acwaUser',
    username: 'adminUser',
};

export const mockAccountVerifiedResponse: AccountVerifiedResponse = {
    message: 'Account verified successfully',
    status: 'success'
}

export const mockActivatedRoute = {
    snapshot: {
        queryParamMap: {
            get: jest.fn(),
            has: function (name: string): boolean {
                throw new Error('Function not implemented.');
            },
            getAll: function (name: string): string[] {
                throw new Error('Function not implemented.');
            },
            keys: []
        },
        url: [],
        params: {},
        queryParams: {},
        fragment: '',
        data: {},
        outlet: '',
        component: undefined,
        routeConfig: undefined,
        title: '',
        root: new ActivatedRouteSnapshot,
        parent: new ActivatedRouteSnapshot,
        firstChild: new ActivatedRouteSnapshot,
        children: [],
        pathFromRoot: [],
        paramMap: undefined
    },
};

export class MockGlobalMessagingService{
    displayErrorMessage = jest.fn((summary,detail ) => {
        return;
    });
    displaySuccessMessage = jest.fn((summary,detail ) => {return});
}

export class NgxSpinnerServiceStub{
    show = jest.fn();
    hide = jest.fn();
}

export class MockAuthService{
    getCurrentUserName = jest.fn().mockReturnValue('testUser');
    getCurrentUser = jest.fn().mockReturnValue(mockUser);
    verifyAccount = jest.fn();
    resetPassword = jest.fn();
}

export class MockBrowserStorage{

}

export class MockLocalStorageService{
    getItem = jest.fn().mockReturnValue(null);
}

export class MockSessionStorageService {
    setItem = jest.fn();
    getItem = jest.fn();
    removeItem = jest.fn();
}

export class MockAppConfigService {
    get config() {
        return {
            contextPath: {
                "accounts_services": "crm",
                "users_services": "user",
                "auth_services": "oauth"
            },
        };
    }

    verifyAccount = jest.fn().mockReturnValue(of(mockAccountVerifiedResponse));
}

export class MockUtilService {
    getFormattedPhoneNumber = jest.fn().mockReturnValue('234567890');
}
