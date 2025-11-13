import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { AuthenticationService } from 'Source/Services/authentication.service';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'login',
  imports: [AsyncPipe, TranslocoPipe],
  templateUrl: './login.component.html',
  standalone: true,
})
export class LoginComponent implements OnInit {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly repository = inject(AuthenticationRepository);
  private readonly router = inject(Router);

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
