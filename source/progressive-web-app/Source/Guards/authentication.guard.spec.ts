import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { authenticationGuard } from './authentication.guard';
import { setUpMock } from '../Managers/storage.mock';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';
import { Authentication } from '../Models/authentication.model';
import { Observable } from 'rxjs';

describe('Authentication Guard', () => {
  let repository: AuthenticationRepository;
  let router: Router;

  beforeEach(async () => {
    setUpMock();
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthenticationRepository],
    });
  });

  beforeEach(async () => {
    repository = TestBed.inject(AuthenticationRepository);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  });

  it('Should exist', async () => {
    expect(authenticationGuard).toBeDefined();
    expect(router).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('Should allow for authenticated user', async () => {
    repository.update = new Authentication('', '');
    expect(repository).toBeDefined();

    const guardResult = TestBed.runInInjectionContext(
      () => authenticationGuard(null, null) as Observable<boolean>
    );
    guardResult.subscribe({
      next: value => {
        expect(value).toBeTruthy();
      },
    });
  });

  it('Should not allow for un authenticated user', async () => {
    repository.remove();
    expect(repository).toBeDefined();
    const guardResult = TestBed.runInInjectionContext(
      () => authenticationGuard(null, null) as Observable<boolean>
    );
    guardResult.subscribe({
      next: value => {
        expect(value).toBeTruthy();
      },
    });
  });
});
