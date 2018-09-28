import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";

import { ProfileService } from './profile.service';
import { ProfileStore } from '../Stores/profile.store';
import { ProfileQuery } from '../Queries/profile.query';
import { ProfileServiceMock } from './profile.service.mock';
import { setUpMock } from '../Managers/storage.mock';

describe('Profile Service', () => {

    let profileService: ProfileService;
    let profileStore: ProfileStore;
    let profileQuery: ProfileQuery;
    let httpClientMock: HttpTestingController;

    beforeAll(async () => {
        setUpMock();
    });

    beforeAll(async () => {
        function noOp() { }

        if (typeof window.URL.createObjectURL === 'undefined') {
            Object.defineProperty(window.URL, 'createObjectURL', { value: noOp })
        }
    });

    beforeAll(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                ProfileService,
                ProfileStore,
                ProfileQuery
            ]
        });
    });

    beforeAll(async () => {
        profileService = TestBed.get(ProfileService);
        profileStore = TestBed.get(ProfileStore);
        profileQuery = TestBed.get(ProfileQuery);
        httpClientMock = TestBed.get(HttpTestingController);
    });
    
    it('Should exist', async () => {
        expect(profileService).toBeDefined();
        expect(profileStore).toBeDefined();
        expect(profileQuery).toBeDefined();
        expect(httpClientMock).toBeDefined();        
    });

    it(`Should be empty store`, async () => {
        profileStore.remove();
        profileService.information.subscribe(() => {
            expect(profileQuery.getCount()).toBe(0);
        });

        ProfileServiceMock.metaDataErrorRequest(httpClientMock);
        ProfileServiceMock.pictureErrorRequest(httpClientMock);
        httpClientMock.verify({ ignoreCancelled: true });
    });

    it(`Should not be an empty store`, async () => {
        profileService.information.subscribe(() => {
            expect(profileQuery.getCount()).toBe(1);
        });

        ProfileServiceMock.metaDataRequest(httpClientMock);
        ProfileServiceMock.pictureRequest(httpClientMock);
        httpClientMock.verify();
    });
});
