import { Observable, of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { map, tap } from 'rxjs/operators';
import { Authentication } from '../Models/authentication.model';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationServiceStub extends AuthenticationService {

    login(): void {
        this.authenticationStore.login(new Authentication("Test_Token_Id", null));
    }

    refreshToken(): Observable<null> {
        return of<string>("Test_Token").pipe(
            tap((value: string) => {
                this.authenticationStore.refreshToken(value);
            }),
            map((value: string) => {
                return null;
            })
        );
    }
}