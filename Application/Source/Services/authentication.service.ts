import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { UserAgentApplication } from 'msal';

import { AuthenticationConfiguration } from "../Configurations/authentication.configuration";
import { ErrorManager } from '../Managers/error.manager';
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

                if (tokenType == "id_token") {
                    this.authenticationStore.login(new Authentication(token, null));
                    this.msalApp.acquireTokenRedirect(AuthenticationConfiguration.scopes);
                }
            });
    }

    login(): void {
        this.msalApp.loginRedirect(AuthenticationConfiguration.scopes);
    }

    logout(): void {
        //this.msalApp.logout();
        this.authenticationStore.logout();
    }

    refreshToken(): Observable<string> {
        return from<string>(this.msalApp.acquireTokenSilent(AuthenticationConfiguration.scopes)).pipe(
            tap((value: string) => {
                this.authenticationStore.setError(null);
                this.authenticationStore.refreshToken(value);
            }),
            map((value: string, index: number) => {
                return null; 
            }),
            catchError((error: any) => {
                this.authenticationStore.setError(error);
                return ErrorManager.generalError("AuthenticationService.refreshToken", error);
            })
        );
    }
}