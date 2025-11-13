/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap } from 'rxjs';

import { RequestManager } from '../Managers/request.manager';
import { ErrorManager } from '../Managers/error.manager';
import { AuthenticationService } from '../Services/authentication.service';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';

@Injectable()
export class ProfileInterceptor implements HttpInterceptor {
  private readonly repository = inject(AuthenticationRepository);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(
        RequestManager.secureRequest(
          request,
          this.repository.data != null ? this.repository.data.accessToken : null
        )
      )
      .pipe(
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
            return this.endSession(error);
          } else {
            if ((<HttpErrorResponse>error).status == 404) {
              const req = new HttpRequest('GET', request.url, {
                responseType: 'blob',
              });
              return next.handle(req);
            } else {
              return this.authenticationService.refreshToken().pipe(
                switchMap((value: string, index: number) => {
                  console.log(`${value} : ${index}`);
                  return next
                    .handle(
                      RequestManager.secureRequest(
                        request,
                        this.repository.data != null
                          ? this.repository.data.accessToken
                          : null
                      )
                    )
                    .pipe(
                      catchError(error => {
                        return this.endSession(error);
                      })
                    );
                }),
                catchError(error => {
                  return this.endSession(error);
                })
              );
            }
          }
        })
      );
  }

  private endSession(error: any): Observable<never> {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
    return ErrorManager.handleRequestError(
      'ProfileInterceptor.intercept',
      error
    );
  }
}
