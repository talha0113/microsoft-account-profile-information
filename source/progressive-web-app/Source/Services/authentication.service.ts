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
import { AuthenticationRepository } from '../Repositories/authentcation.repository';
import { Authentication } from '../Models/authentication.model';
import { trackRequestResult } from '@ngneat/elf-requests';

@Injectable()
export class AuthenticationService {
  private msalApp: IPublicClientApplication;

  constructor(public repository: AuthenticationRepository) {
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
        claimsBasedCachingEnabled: true,
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
    from(this.msalApp.initialize())
      .pipe(
        switchMap(() => {
          return from(this.msalApp.handleRedirectPromise());
        }),
        trackRequestResult([this.repository.storeName]),
        tap((value: AuthenticationResult) => {
          if (value !== null) {
            if (value.tokenType === 'Bearer') {
              this.repository.update = new Authentication(
                value.idToken,
                value.accessToken
              );
              //this.msalApp.acquireTokenRedirect({
              //    scopes: AuthenticationConfiguration.scopes,
              //    sid: value.idTokenClaims["sid"]
              //});
            }
          }
        })
      )
      .subscribe({
        error: error => {
          console.error(error);
        },
      });
  }

  login(): void {
    this.msalApp.loginRedirect({
      scopes: AuthenticationConfiguration.scopes,
    });
  }

  logout(): void {
    this.msalApp.logout();
    this.repository.remove();
  }

  refreshToken(): Observable<null> {
    return from(
      this.msalApp.ssoSilent({ scopes: AuthenticationConfiguration.scopes })
    ).pipe(
      trackRequestResult([this.repository.storeName]),
      tap((value: AuthenticationResult) => {
        this.repository.update = new Authentication(
          value.idToken,
          value.accessToken
        );
      }),
      map((value: AuthenticationResult) => {
        console.log(value);
        return null;
      }),
      catchError((error: AuthError) => {
        return ErrorManager.generalError(
          'AuthenticationService.refreshToken',
          JSON.stringify(error)
        );
      })
    );
  }
}
