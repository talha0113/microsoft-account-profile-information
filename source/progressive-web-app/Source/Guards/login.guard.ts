/* eslint-disable @typescript-eslint/no-unused-vars */

import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateFn,
} from '@angular/router';

import { AuthenticationQuery } from '../Queries/authentication.query';

export const loginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  return (
    !inject(AuthenticationQuery).isAuthenticated() ||
    inject(Router).parseUrl('/status')
  );
};