import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { loginGuard } from './login.guard';
import { AuthenticationService } from '../Services/authentication.service';
import { AuthenticationServiceStub } from '../Services/authentication.service.stub';
import { setUpMock } from '../Managers/storage.mock';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';
import { EnvironmentInjector } from '@angular/core';
import { Authentication } from '../Models/authentication.model';

describe('Login Guard', () => {

    let repository: AuthenticationRepository;
    let router: Router;

    beforeEach(async () => {
    setUpMock();
  });

    beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
        providers: [
            AuthenticationRepository
      ],
    });
  });

    beforeEach(async () => {
      repository = TestBed.inject(AuthenticationRepository);
      router = TestBed.inject(Router);
      spyOn(router, 'parseUrl');
  });

  it('Should exist', async () => {
      expect(loginGuard).toBeDefined();
      expect(repository).toBeDefined();
      expect(router).toBeDefined();
  });

    it('Should allow for un authenticated user', async () => {
        repository.remove();
        const guardResult = TestBed.runInInjectionContext(() => { return loginGuard(null, null); });
        expect(guardResult).toBeDefined();
    });

  it('Should not allow for authenticated user', async () => {
      repository.update = new Authentication("", "");
      const guardResult = TestBed.runInInjectionContext(() => { return loginGuard(null, null); });
      expect(guardResult).toBeDefined();
  });
});
