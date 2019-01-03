import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthenticationQuery } from '../Queries/authentication.query';

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private authenticationQuery: AuthenticationQuery, private router: Router) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        return !(this.authenticationQuery.isAuthenticated()) || this.router.parseUrl('/status');
    }
}