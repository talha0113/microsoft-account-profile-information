import { Observable, of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { map, tap, switchMap } from 'rxjs/operators';
import { Authentication } from '../Models/authentication.model';

export class AuthenticationServiceStub extends AuthenticationService {

    login(): Observable<null> {
        return of<string>("Test_Token_Id").pipe(
            tap((value: string) => {
                this.authenticationStore.login(new Authentication(0, value, null));
            }),
            switchMap((value: string) => {
                return this.refreshToken();
            }),
            map((value: string) => {
                return null;
            })
        );
    }

    refreshToken(): Observable<string> {
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