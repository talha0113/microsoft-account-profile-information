import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, switchMap, tap } from 'rxjs';
import {
  AuthError,
  IPublicClientApplication,
  PublicClientApplication,
  LogLevel,
  AuthenticationResult,
} from '@azure/msal-browser';

import { AuthenticationConfiguration } from '../Configurations/authentication.configuration';
import { ErrorManager } from '../Managers/error.manager';
import { AuthenticationStore } from '../Stores/authentication.store';
import { Authentication } from '../Models/authentication.model';

@Injectable()
export class AuthenticationService {
  private msalApp: IPublicClientApplication;

  constructor(public authenticationStore: AuthenticationStore) {
    this.msalApp = new PublicClientApplication({
        auth: {
        authority: AuthenticationConfiguration.authority,
        clientId: AuthenticationConfiguration.applicationId,
        redirectUri: `${window.location.origin}/login`,
            postLogoutRedirectUri: `${window.location.origin}/login`,
            navigateToLoginRequestUrl: true,
        },      
      cache: {
        cacheLocation: 'sessionStorage',
          storeAuthStateInCookie: false,
          claimsBasedCachingEnabled: true
        },
        system: {
            loggerOptions: {
                piiLoggingEnabled: true,
          loggerCallback: (level, message, containsPii) => {
              if (containsPii) {
              return;
            }
            switch (level) {
              case LogLevel.Error:
                console.error(message);
                return;
              case LogLevel.Info:
                console.info(message);
                return;
              case LogLevel.Verbose:
                console.debug(message);
                return;
              case LogLevel.Warning:
                console.warn(message);
                return;
            }
          },
        },
      },
    });
      from(this.msalApp.initialize()).pipe(switchMap(() => {
          return from(this.msalApp.handleRedirectPromise());
      })).subscribe({
          next:
              (value: AuthenticationResult) => {
                  if (value !== null) {
                      if (value.tokenType === 'Bearer') {
                          this.authenticationStore.login(
                              new Authentication(value.idToken, value.accessToken)
                          );
                          //this.msalApp.acquireTokenRedirect({
                          //    scopes: AuthenticationConfiguration.scopes,
                          //    sid: value.idTokenClaims["sid"]
                          //});
                      }
                  }                  
              },
          error:
              (error) => {
                  console.error(error);
              }
      }
      );
  }

  login(): void {
    this.msalApp.loginRedirect({
        scopes: AuthenticationConfiguration.scopes,
    });
  }

  logout(): void {
    this.msalApp.logout();
    this.authenticationStore.logout();
  }

  refreshToken(): Observable<null> {
    return from(
      this.msalApp.ssoSilent({ scopes: AuthenticationConfiguration.scopes })
    ).pipe(
      tap((value: AuthenticationResult) => {
        this.authenticationStore.setError(null);
        this.authenticationStore.refreshToken(value.accessToken);
      }),
      map((value: AuthenticationResult) => {
        console.log(value);
        return null;
      }),
      catchError((error: AuthError) => {
        this.authenticationStore.setError(error);
        return ErrorManager.generalError(
          'AuthenticationService.refreshToken',
          JSON.stringify(error)
        );
      })
    );
  }
}
