/* eslint-disable @typescript-eslint/no-unused-vars */

import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateFn,
} from '@angular/router';
import { Observable, map } from 'rxjs';

import { AuthenticationRepository } from '../Repositories/authentcation.repository';

export const loginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  return inject(AuthenticationRepository).data$.pipe(
    map(value => {
      return !(value.data != null) || router.parseUrl('/status');
    })
  );
};
