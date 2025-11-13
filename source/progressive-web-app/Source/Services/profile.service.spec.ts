import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ProfileService } from './profile.service';
import { ProfileServiceMock } from './profile.service.mock';
import { setUpMock } from '../Managers/storage.mock';
import { ProfileRepository } from '../Repositories/profile.repository';
import { tap } from 'rxjs';
import { clearRequestsResult } from '@ngneat/elf-requests';

describe('Profile Service', () => {
  let profileService: ProfileService;
  let repository: ProfileRepository;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    setUpMock();
  });

  beforeEach(() => {
    function noOp() {}

    if (typeof globalThis.URL.createObjectURL === 'undefined') {
      Object.defineProperty(globalThis.URL, 'createObjectURL', { value: noOp });
    }
  });

    beforeEach(() => {
        TestBed.configureTestingModule({            
            providers: [provideHttpClient(),
                provideHttpClientTesting(), ProfileService, ProfileRepository],
        });
  });

  beforeEach(() => {
    profileService = TestBed.inject(ProfileService);
    repository = TestBed.inject(ProfileRepository);
    httpClientMock = TestBed.inject(HttpTestingController);
    clearRequestsResult();
    repository.remove();
  });

  it('Should exist', () => {
    expect(profileService).toBeDefined();
    expect(repository).toBeDefined();
    expect(httpClientMock).toBeDefined();
  });

  it(`Should be an empty repository`, () => {
    repository.data$
      .pipe(
        tap(value => {
          expect(value.data).toBeDefined();
        })
      )
      .subscribe();
    profileService.information$.subscribe();

    ProfileServiceMock.metaDataErrorRequest(httpClientMock);
    ProfileServiceMock.pictureErrorRequest(httpClientMock);
  });

  it(`Should not be an empty repository`, () => {
    repository.data$
      .pipe(
        tap(value => {
          expect(value.data).toBeDefined();
        })
      )
      .subscribe();
    profileService.information$.subscribe();

    ProfileServiceMock.metaDataRequest(httpClientMock);
    ProfileServiceMock.pictureRequest(httpClientMock);
  });

  afterEach(() => {
    httpClientMock.verify();
  });
});