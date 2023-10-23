import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { AuthenticationServiceStub } from './authentication.service.stub';
import { StorageManager } from '../Managers/storage.manager';
import { TokenConstant } from '../Constants/token.constant';
import { Authentication } from '../Models/authentication.model';
import { setUpMock } from '../Managers/storage.mock';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';
import { tap } from 'rxjs';

describe('Authentication Service', () => {
  let authenticationService: AuthenticationService;
  let repository: AuthenticationRepository;

  beforeAll(async () => {
    setUpMock();
  });

  beforeAll(async () => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationRepository,
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceStub,
        },
      ],
    });
  });

  beforeAll(async () => {
      authenticationService = TestBed.inject(AuthenticationService);
      repository = TestBed.inject(AuthenticationRepository);
  });

  it('Should exist', async () => {
      expect(authenticationService).toBeDefined();
      expect(repository).toBeDefined();
  });

    it(`Should login`, async () => {
        repository.update = new Authentication("dummy", "dummy");
        authenticationService.login();
      authenticationService.refreshToken().subscribe(() => {
          expect(repository.data).toBeDefined();
    });
  });

  it(`Should logout`, async () => {
      authenticationService.logout();
      expect(repository.data).toBeNull();
    expect(StorageManager.get<Authentication>(TokenConstant.token)).toBeNull();
  });
});
