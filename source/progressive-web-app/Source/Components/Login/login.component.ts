import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';

import { AuthenticationService } from '../../Services/authentication.service';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    standalone: false
})
export class LoginComponent implements OnInit {
  isInProgress$: Observable<boolean>;
  isOffline: boolean = !navigator.onLine;

  constructor(
    private authenticationService: AuthenticationService,
    private repository: AuthenticationRepository,
    private router: Router
  ) {}

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
