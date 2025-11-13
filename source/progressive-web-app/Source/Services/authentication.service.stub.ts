import { Observable, of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { map, tap } from 'rxjs/operators';
import { Authentication } from '../Models/authentication.model';
import { Injectable, inject } from '@angular/core';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';

@Injectable()
export class AuthenticationServiceStub extends AuthenticationService {
  override repository: AuthenticationRepository;

  constructor() {
    const repository = inject(AuthenticationRepository);

    super();

    this.repository = repository;
  }

  override login(): void {
    this.repository.update = new Authentication(
      'Test_Token_Id',
      'Test_Access_Token'
    );
  }

  override logout(): void {
    this.repository.remove();
  }

  override refreshToken(): Observable<null> {
    return of<string>('Test_Token').pipe(
        tap((value: string) => { }),
      map(() => {
        return null;
      })
    );
  }
}
