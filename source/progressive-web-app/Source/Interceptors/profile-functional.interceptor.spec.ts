import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { profileInterceptor } from './profile-functional.interceptor';
import { AuthenticationService } from '../Services/authentication.service';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';
import { RequestManager } from '../Managers/request.manager';
import { ErrorManager } from '../Managers/error.manager';

// Mock dependencies
jest.mock('../Managers/request.manager');
jest.mock('../Managers/error.manager');

describe('profileInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authenticationService: jest.Mocked<AuthenticationService>;
  let authenticationRepository: jest.Mocked<AuthenticationRepository>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    const authServiceSpy = {
      logout: jest.fn(),
      refreshToken: jest.fn(),
    };

    const authRepoSpy = {
      data: { accessToken: 'test-token' },
    };

    const routerSpy = {
      navigateByUrl: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([profileInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: AuthenticationRepository, useValue: authRepoSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authenticationService = TestBed.inject(AuthenticationService) as jest.Mocked<AuthenticationService>;
    authenticationRepository = TestBed.inject(AuthenticationRepository) as jest.Mocked<AuthenticationRepository>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    // Mock static methods
    (RequestManager.secureRequest as jest.Mock) = jest.fn().mockImplementation(req => req);
    (ErrorManager.handleRequestError as jest.Mock) = jest.fn().mockReturnValue(throwError(() => new Error('Test error')));
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should intercept HTTP requests and add authorization', () => {
    const testUrl = '/api/test';
    
    httpClient.get(testUrl).subscribe();

    const req = httpTestingController.expectOne(testUrl);
    expect(RequestManager.secureRequest).toHaveBeenCalledWith(
      expect.any(Object),
      'test-token'
    );

    req.flush({ data: 'test' });
  });

  it('should handle 401 errors by refreshing token', () => {
    const testUrl = '/api/test';
    authenticationService.refreshToken.mockReturnValue(of('new-token'));

    httpClient.get(testUrl).subscribe();

    const req = httpTestingController.expectOne(testUrl);
    req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(authenticationService.refreshToken).toHaveBeenCalled();
  });

  it('should handle 404 errors by creating blob request', () => {
    const testUrl = '/api/test';

    httpClient.get(testUrl).subscribe();

    const req = httpTestingController.expectOne(testUrl);
    req.flush({ error: 'Not Found' }, { status: 404, statusText: 'Not Found' });

    // Should create a new GET request with blob response type
    const blobReq = httpTestingController.expectOne(testUrl);
    expect(blobReq.request.responseType).toBe('blob');
    blobReq.flush(new Blob());
  });

  it('should logout and redirect on other HTTP errors', () => {
    const testUrl = '/api/test';

    httpClient.get(testUrl).subscribe({
      error: () => {
        // Expected error
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.flush({ error: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });

    expect(authenticationService.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should handle non-HTTP errors by logging out', () => {
    const testUrl = '/api/test';

    httpClient.get(testUrl).subscribe({
      error: () => {
        // Expected error
      }
    });

    const req = httpTestingController.expectOne(testUrl);
    req.error(new ProgressEvent('Network error'));

    expect(authenticationService.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});