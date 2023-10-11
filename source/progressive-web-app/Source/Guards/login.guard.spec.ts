import { TestBed } from '@angular/core/testing';
import { AuthenticationQuery } from '../Queries/authentication.query';
import { AuthenticationStore } from '../Stores/authentication.store';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { LoginGuard } from './login.guard';
import { AuthenticationService } from '../Services/authentication.service';
import { AuthenticationServiceStub } from '../Services/authentication.service.stub';
import { setUpMock } from '../Managers/storage.mock';

describe('Login Guard', () => {
  let loginGuard: LoginGuard;
  let authenticationService: AuthenticationService;
  let router: Router;

  beforeAll(async () => {
    setUpMock();
  });

  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        LoginGuard,
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
    loginGuard = TestBed.inject(LoginGuard);
    authenticationService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  it('Should exist', async () => {
    expect(loginGuard).toBeDefined();
    expect(authenticationService).toBeDefined();
    expect(router).toBeDefined();
  });

  it('Should allow for un authenticated user', async () => {
    authenticationService.logout();
    expect(loginGuard.canActivate(null, null)).toBeTruthy();
  });

  it('Should not allow for authenticated user', async () => {
    authenticationService.login();
    authenticationService.refreshToken().subscribe(() => {
      expect(loginGuard.canActivate(null, null)).toEqual(
        router.parseUrl('status')
      );
    });
  });
});
