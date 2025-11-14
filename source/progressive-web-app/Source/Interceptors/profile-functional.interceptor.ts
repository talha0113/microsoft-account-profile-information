/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap } from 'rxjs';

import { RequestManager } from '../Managers/request.manager';
import { ErrorManager } from '../Managers/error.manager';
import { AuthenticationService } from 'Source/Services/authentication.service';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';

export const profileInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const repository = inject(AuthenticationRepository);
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const endSession = (error: any): Observable<never> => {
    authenticationService.logout();
    router.navigateByUrl('/login');
    return ErrorManager.handleRequestError('profileInterceptor', error);
  };

  return next(
    RequestManager.secureRequest(
      request,
      repository.data != null ? repository.data.accessToken : null
    )
  ).pipe(
    catchError(error => {
      let shouldLogout: boolean = false;
      if (error instanceof HttpErrorResponse) {
        switch ((<HttpErrorResponse>error).status) {
          case 401: {
            shouldLogout = false;
            break;
          }
          case 404: {
            shouldLogout = false;
            break;
          }
          default: {
            shouldLogout = true;
            break;
          }
        }
      } else {
        shouldLogout = true;
      }

      if (shouldLogout) {
        return endSession(error);
      } else {
        if ((<HttpErrorResponse>error).status == 404) {
          const req = new HttpRequest('GET', request.url, {
            responseType: 'blob',
          });
          return next(req);
        } else {
          return authenticationService.refreshToken().pipe(
            switchMap((value: string, index: number) => {
              console.log(`${value} : ${index}`);
              return next(
                RequestManager.secureRequest(
                  request,
                  repository.data != null ? repository.data.accessToken : null
                )
              ).pipe(
                catchError(error => {
                  return endSession(error);
                })
              );
            }),
            catchError(error => {
              return endSession(error);
            })
          );
        }
      }
    })
  );
};