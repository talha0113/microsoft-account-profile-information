﻿import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthenticationService } from '../Services/authentication.service';
import { AuthenticationServiceStub } from '../Services/authentication.service.stub';
import { setUpMock } from '../Managers/storage.mock';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileInterceptor } from './profile.interceptor';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Profile Interceptor', () => {
    let repository: AuthenticationRepository;
    let authenticationService: AuthenticationService;
    let router: Router;
    let profileInterceptor: ProfileInterceptor;


    beforeEach(async () => {
    setUpMock();
  });

    beforeEach(async () => {
    TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpClientTestingModule],
        providers: [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: ProfileInterceptor,
                multi: true
            },
            AuthenticationRepository,
            {
                provide: AuthenticationService,
                useClass: AuthenticationServiceStub,
            },
            
      ],
    });
  });

    beforeEach(async () => {
        repository = TestBed.inject(AuthenticationRepository);
        authenticationService = TestBed.inject(AuthenticationService);
        router = TestBed.inject(Router);
        profileInterceptor = TestBed.inject(HTTP_INTERCEPTORS)[0] as ProfileInterceptor;
  });

    it('Should exist', async () => {
        expect(authenticationService).toBeDefined();
      expect(router).toBeDefined();
        expect(repository).toBeDefined();
        expect(profileInterceptor).toBeDefined();
    });

});
