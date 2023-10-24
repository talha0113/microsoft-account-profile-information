/* eslint-disable @typescript-eslint/no-unused-vars */

import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';

import { AuthenticationRepository } from '../Repositories/authentcation.repository';

export const authenticationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const repository = inject(AuthenticationRepository);
  return repository.data$.pipe(
    map(value => {
      return value.data != null || router.parseUrl('/login');
    })
  );
};
