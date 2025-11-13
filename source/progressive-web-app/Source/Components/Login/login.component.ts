import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';

import { AuthenticationService } from '../../Services/authentication.service';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private repository = inject(AuthenticationRepository);
  private router = inject(Router);

  isInProgress$: Observable<boolean>;
  isOffline: boolean = !navigator.onLine;

  ngOnInit() {
    this.isInProgress$ = of(this.isOffline);

    if (!this.isOffline) {
      this.isInProgress$ = this.repository.data$.pipe(
        map(value => {
          return value.isLoading;
        })
      );
      this.repository.data$.subscribe(value => {
        if (value.data != null) {
          //this.authenticationService.refreshToken().subscribe(() => {

          //});
          this.router.navigateByUrl('/status');
        }
      });
    }
  }

  login(): void {
    this.isInProgress$ = of(true);
    this.authenticationService.login();
  }
}
