import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { AuthenticationServiceStub } from './authentication.service.stub';
import { AuthenticationStore } from '../Stores/authentication.store';
import { AuthenticationQuery } from '../Queries/authentication.query';
import { StorageManager } from '../Managers/storage.manager';
import { TokenConstant } from '../Constants/token.constant';
import { Authentication } from '../Models/authentication.model';
import { setUpMock } from '../Managers/storage.mock';

describe('Authentication Service', () => {

    let authenticationService: AuthenticationService;
    let authenticationStore: AuthenticationStore;
    let authenticationQuery: AuthenticationQuery;

    beforeAll(async () => {
        setUpMock();
    });

    beforeAll(async () => {
        TestBed.configureTestingModule({
            providers: [
                AuthenticationStore,
                AuthenticationQuery,
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub
                }
            ]
        });
    });

    beforeAll(async () => {
        authenticationService = TestBed.get(AuthenticationService);
        authenticationStore = TestBed.get(AuthenticationStore);
        authenticationQuery = TestBed.get(AuthenticationQuery);
    });


    it('Should exist', async () => {
        expect(authenticationService).toBeDefined();
        expect(authenticationStore).toBeDefined();
        expect(authenticationQuery).toBeDefined();
    });

    it(`Should login`, async () => {
        authenticationService.login().subscribe(() => {
            expect(authenticationQuery.isAuthenticated()).toBeTruthy();
            expect(StorageManager.get<Authentication>(TokenConstant.token).tokenId).toBeDefined();
        });        
    });

    it(`Should logout`, async () => {
        authenticationService.logout();
        expect(authenticationQuery.isAuthenticated()).toBeFalsy();
        expect(StorageManager.get<Authentication>(TokenConstant.token)).toBeNull();
    });
});
