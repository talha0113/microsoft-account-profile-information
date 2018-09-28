import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { UserAgentApplication } from 'msal';

import { AuthenticationConfiguration } from "../Configurations/authentication.configuration";
import { ErrorManager } from '../Managers/error.manager';
import { TokenConstant } from '../Constants/token.constant';
import { AuthenticationStore } from '../Stores/authentication.store';
import { Authentication } from '../Models/authentication.model';

@Injectable()
export class AuthenticationService {
    private msalApp: UserAgentApplication;

    constructor(public authenticationStore: AuthenticationStore) {
        this.msalApp = new UserAgentApplication(AuthenticationConfiguration.applicationId, AuthenticationConfiguration.authority,
            (errorDesc: string, token: string, error: string, tokenType: string, userState: string) => {
                console.log("Error Description:" + errorDesc);
                console.log("Token:" + token);
                console.log("Error:" + error);
                console.log("Token Type:" + tokenType);
                console.log("User State:" + userState);
            });
    }

    login(): Observable<null> {
        return from<string>(this.msalApp.loginPopup(AuthenticationConfiguration.scopes)).pipe(
            tap((value: string) => {
                this.authenticationStore.login(new Authentication(value, null));
            }),
            switchMap((value: string, index: number) => {
                return this.refreshToken();
            }),
            map((value: string, index: number) => {
                return null; 
            }),
            catchError((error: any) => {
                return ErrorManager.generalError("AuthenticationService.login", error);
            })
        );
    }

    logout(): void {
        this.authenticationStore.logout();
    }

    refreshToken(): Observable<string> {
        return from<string>(this.msalApp.acquireTokenSilent(AuthenticationConfiguration.scopes)).pipe(
            tap((value: string) => {
                this.authenticationStore.refreshToken(value);
            }),
            map((value: string, index: number) => {
                return null; 
            }),
            catchError((error: any) => {
                return ErrorManager.generalError("AuthenticationService.refreshToken", error);
            })
        );
    }
}