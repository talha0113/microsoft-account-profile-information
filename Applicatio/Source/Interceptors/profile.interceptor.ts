import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { RequestManager } from '../Managers/request.manager';
import { catchError, switchMap, tap, retry } from 'rxjs/operators';
import { ErrorManager } from '../Managers/error.manager';
import { AuthenticationQuery } from '../Queries/authentication.query';
import { AuthenticationService } from '../Services/authentication.service';


@Injectable()
export class ProfileInterceptor implements HttpInterceptor {

    constructor(private authenticationQuery: AuthenticationQuery, private authenticationService: AuthenticationService, private router: Router) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(RequestManager.secureRequest(request, this.authenticationQuery.getToken())).pipe(catchError((error) => {
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
            }
            else {
                if ((<HttpErrorResponse>error).status == 404) {
                    let req = new HttpRequest("GET", request.url, { responseType: "blob" });
                    return next.handle(req);
                }
                else {
                    return this.authenticationService.refreshToken().pipe(switchMap((value: string, index: number) => {
                        return next.handle(RequestManager.secureRequest(request, this.authenticationQuery.getToken())).pipe(catchError((error) => {
                            return this.endSession(error);
                        }));
                    }), catchError((error) => {
                        return this.endSession(error);
                    }));
                }
            }
        }));
    }

    private endSession(error: any): Observable<never> {
        this.authenticationService.logout();
        this.router.navigateByUrl("/login");
        return ErrorManager.handleRequestError("ProfileInterceptor.intercept", error);
    }
    
}
