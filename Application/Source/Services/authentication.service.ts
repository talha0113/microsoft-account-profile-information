import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { UserAgentApplication, AuthError, AuthResponse } from 'msal';

import { AuthenticationConfiguration } from "../Configurations/authentication.configuration";
import { ErrorManager } from '../Managers/error.manager';
import { AuthenticationStore } from '../Stores/authentication.store';
import { Authentication } from '../Models/authentication.model';

@Injectable()
export class AuthenticationService {
    private msalApp: UserAgentApplication;

    constructor(public authenticationStore: AuthenticationStore) {
        this.msalApp = new UserAgentApplication({
            auth: {
                authority: AuthenticationConfiguration.authority,
                clientId: AuthenticationConfiguration.applicationId,
                redirectUri: `${window.location.origin}/login`,
                postLogoutRedirectUri: `${window.location.origin}/login`
            },
            cache: {
                cacheLocation: "sessionStorage",
                storeAuthStateInCookie: true,
            }
        });
        this.msalApp.handleRedirectCallback((authenticationError: AuthError, authenticationResponse: AuthResponse) => {
            if (authenticationResponse.tokenType === 'id_token') {
                this.authenticationStore.login(new Authentication(authenticationResponse.idToken.rawIdToken, null));
                this.msalApp.acquireTokenRedirect({
                    scopes: AuthenticationConfiguration.scopes,
                    sid: authenticationResponse.idTokenClaims["sid"]
                });
            }
        });
    }

    login(): void {
        this.msalApp.loginRedirect({
            scopes: AuthenticationConfiguration.scopes
        });
    }

    logout(): void {
        this.msalApp.logout();
        this.authenticationStore.logout();
    }

    refreshToken(): Observable<null> {
        return from(this.msalApp.acquireTokenSilent({
            scopes: AuthenticationConfiguration.scopes
        })).pipe(
            tap((value: AuthResponse) => {
                this.authenticationStore.setError(null);
                this.authenticationStore.refreshToken(value.accessToken);
            }),
            map((value: AuthResponse) => {
                return null; 
            }),
            catchError((error: any) => {
                this.authenticationStore.setError(error);
                return ErrorManager.generalError("AuthenticationService.refreshToken", error);
            })
        );
    }
}