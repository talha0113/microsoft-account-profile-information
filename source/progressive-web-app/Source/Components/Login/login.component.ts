import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthenticationService } from '../../Services/authentication.service';
import { AuthenticationRepository } from '../../Repositories/authentcation.repository';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  standalone: false,
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isInProgress = toSignal(
    this.repository.data$.pipe(
      map(value => value.isLoading)
    ),
    { initialValue: true }
  );
  
  isOffline = signal(!navigator.onLine);

  constructor(
    private authenticationService: AuthenticationService,
    private repository: AuthenticationRepository,
    private router: Router
  ) {}

  ngOnInit() {
    this.isOffline.set(!navigator.onLine);

    if (!this.isOffline()) {
      this.repository.data$
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          if (value.data != null) {
            //this.authenticationService.refreshToken().subscribe(() => {

            //});
            this.router.navigateByUrl('/status');
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.authenticationService.login();
  }
}
