import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationQuery } from '../Queries/authentication.query';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(private authenticationQuery: AuthenticationQuery, private router: Router) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.authenticationQuery.isAuthenticated()) {            
            this.router.navigateByUrl('/login');
        }
        return this.authenticationQuery.isAuthenticated();
    }
}