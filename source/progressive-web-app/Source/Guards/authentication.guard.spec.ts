import { TestBed } from '@angular/core/testing';
import { AuthenticationQuery } from '../Queries/authentication.query';
import { AuthenticationStore } from '../Stores/authentication.store';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from '../Services/authentication.service';
import { AuthenticationServiceStub } from '../Services/authentication.service.stub';
import { setUpMock } from '../Managers/storage.mock';

describe('Authentication Guard', () => {
  let authenticationGuard: AuthenticationGuard;
  let authenticationService: AuthenticationService;
  let router: Router;

  beforeAll(async () => {
    setUpMock();
  });

  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthenticationGuard,
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceStub,
        },
        AuthenticationStore,
        AuthenticationQuery,
      ],
    });
  });

  beforeAll(async () => {
    authenticationGuard = TestBed.inject(AuthenticationGuard);
    authenticationService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    authenticationService.logout();
  });

  it('Should exist', async () => {
    expect(authenticationGuard).toBeDefined();
    expect(authenticationService).toBeDefined();
    expect(router).toBeDefined();
  });

  it('Should allow for authenticated user', async () => {
    authenticationService.login();
    authenticationService.refreshToken().subscribe(() => {
      expect(authenticationGuard.canActivate(null, null)).toEqual(true);
    });
  });

  it('Should not allow for un authenticated user', async () => {
    authenticationService.logout();
    expect(authenticationGuard.canActivate(null, null)).toEqual(
      router.parseUrl('login')
    );
  });
});
