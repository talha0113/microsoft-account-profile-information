import { Observable, of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { map, tap } from 'rxjs/operators';
import { Authentication } from '../Models/authentication.model';
import { Injectable } from '@angular/core';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';

@Injectable()
export class AuthenticationServiceStub extends AuthenticationService {
    constructor(public override repository: AuthenticationRepository) {
        super(repository);
    }

    override login(): void {
        this.repository.update = new Authentication('Test_Token_Id', 'Test_Access_Token');
    }

    override logout(): void {
        this.repository.remove();
    }

  override refreshToken(): Observable<null> {
    return of<string>('Test_Token').pipe(
        tap((value: string) => {
            new Authentication('Test_Token_Id', value);
      }),
      map((value: string) => {
        return null;
      })
    );
  }
}
