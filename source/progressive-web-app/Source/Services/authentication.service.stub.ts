import { Observable, of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { map } from 'rxjs/operators';
import { Authentication } from '../Models/authentication.model';
import { Injectable, inject } from '@angular/core';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';
import { TokenConstant } from '../Constants/token.constant';

@Injectable()
export class AuthenticationServiceStub extends AuthenticationService {
  declare repository: AuthenticationRepository;

  constructor() {
    const repository = inject(AuthenticationRepository);

    super();

    this.repository = repository;
  }

  override login(): void {
    this.repository.update = new Authentication(
      TokenConstant.testtoken['token.id'],
      TokenConstant.testtoken['token.access']
    );
  }

  override logout(): void {
    this.repository.remove();
  }

  override refreshToken(): Observable<null> {
    return of<string>(TokenConstant.testtoken['token.refresh']).pipe(
      map(() => {
        return null;
      })
    );
  }
}
