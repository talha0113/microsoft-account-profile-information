import { vi, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';

import { profileInterceptor } from './profile.interceptor';
import { AuthenticationService } from '../Services/authentication.service';
import { AuthenticationServiceStub } from '../Services/authentication.service.stub';
import { setUpMock } from '../Managers/storage.mock';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';
import { RequestManager } from '../Managers/request.manager';
import { appRoutes } from '../Routes/main.route';

describe('Profile Interceptor', () => {
  const testUrl = '/api/test';
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let repository: AuthenticationRepository;
  let authenticationService: AuthenticationService;
  let router: Router;

  beforeEach(async () => {
    setUpMock();
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([profileInterceptor])),
        provideHttpClientTesting(),
        provideRouter(appRoutes),
        AuthenticationRepository,
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceStub,
        },
      ],
    });
  });

  beforeEach(async () => {
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    repository = TestBed.inject(AuthenticationRepository);
    authenticationService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);

    vi.spyOn(RequestManager, 'secureRequest');
    vi.spyOn(authenticationService, 'refreshToken');
    vi.spyOn(authenticationService, 'logout');
  });

  it('Should exist', async () => {
    expect(authenticationService).toBeDefined();
    expect(router).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should intercept HTTP requests and add authorization', () => {
    httpClient.get(testUrl).subscribe(() => {
      expect(mockRequest.request.headers.has('Authorization')).toBe(true);
    });
    const mockRequest = httpTestingController.expectOne(testUrl);
    mockRequest.flush({ data: 'test' });
  });

  it('should handle non-HTTP errors by logging out', () => {
    httpClient.get(testUrl).subscribe({
      error: () => {
        console.log('Expected network error');
      },
    });

    const mockRequest = httpTestingController.expectOne(testUrl);
    mockRequest.error(new ProgressEvent('Network error'));

    expect(authenticationService.logout).toHaveBeenCalled();
  });
  afterEach(() => {
    httpTestingController.verify();
  });
});
