/* eslint-disable @typescript-eslint/no-unused-vars */

import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { AuthenticationQuery } from '../Queries/authentication.query';

export const authenticationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  return (
    inject(AuthenticationQuery).isAuthenticated() ||
    inject(Router).parseUrl('/login')
  );
};
